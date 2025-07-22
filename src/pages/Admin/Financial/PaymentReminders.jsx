import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  Calendar,
  Bell,
  Clock,
  Plus,
  Edit,
  Trash2,
  CheckCircle
} from 'lucide-react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../config/firebase';

const PaymentReminders = () => {
  const [reminders, setReminders] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [formData, setFormData] = useState({
    driverId: '',
    title: '',
    description: '',
    dueDate: '',
    amount: '',
    type: 'payment', // payment, commission, other
    priority: 'medium' // low, medium, high
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Şoförleri getir
      const driversSnapshot = await getDocs(collection(db, 'drivers'));
      const driversData = driversSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDrivers(driversData);

      // Ödeme uyarılarını getir
      const remindersSnapshot = await getDocs(collection(db, 'paymentReminders'));
      const remindersData = remindersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        dueDate: doc.data().dueDate?.toDate() || new Date(doc.data().dueDate)
      }));
      
      // Uyarıları tarihe göre sırala
      remindersData.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      setReminders(remindersData);

    } catch (error) {
      console.error('Veri getirme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.driverId || !formData.title || !formData.dueDate) {
      alert('Lütfen zorunlu alanları doldurun');
      return;
    }

    try {
      const reminderData = {
        ...formData,
        dueDate: new Date(formData.dueDate),
        amount: parseFloat(formData.amount) || 0,
        createdAt: new Date(),
        status: 'active'
      };

      if (editingReminder) {
        // Güncelle
        await updateDoc(doc(db, 'paymentReminders', editingReminder.id), reminderData);
        setReminders(prev => prev.map(reminder => 
          reminder.id === editingReminder.id 
            ? { ...reminder, ...reminderData }
            : reminder
        ));
      } else {
        // Yeni ekle
        const docRef = await addDoc(collection(db, 'paymentReminders'), reminderData);
        setReminders(prev => [...prev, { id: docRef.id, ...reminderData }]);
      }

      // Formu temizle
      setFormData({
        driverId: '',
        title: '',
        description: '',
        dueDate: '',
        amount: '',
        type: 'payment',
        priority: 'medium'
      });
      setShowModal(false);
      setEditingReminder(null);
      
    } catch (error) {
      console.error('Uyarı kaydetme hatası:', error);
      alert('Uyarı kaydedilirken hata oluştu');
    }
  };

  const handleDelete = async (reminderId) => {
    if (!confirm('Bu uyarıyı silmek istediğinizden emin misiniz?')) return;

    try {
      await deleteDoc(doc(db, 'paymentReminders', reminderId));
      setReminders(prev => prev.filter(reminder => reminder.id !== reminderId));
    } catch (error) {
      console.error('Uyarı silme hatası:', error);
      alert('Uyarı silinirken hata oluştu');
    }
  };

  const markAsCompleted = async (reminderId) => {
    try {
      await updateDoc(doc(db, 'paymentReminders', reminderId), {
        status: 'completed',
        completedAt: new Date()
      });
      
      setReminders(prev => prev.map(reminder => 
        reminder.id === reminderId 
          ? { ...reminder, status: 'completed', completedAt: new Date() }
          : reminder
      ));
    } catch (error) {
      console.error('Uyarı tamamlama hatası:', error);
      alert('Uyarı tamamlanırken hata oluştu');
    }
  };

  const openEditModal = (reminder) => {
    setEditingReminder(reminder);
    setFormData({
      driverId: reminder.driverId,
      title: reminder.title,
      description: reminder.description,
      dueDate: reminder.dueDate.toISOString().split('T')[0],
      amount: reminder.amount.toString(),
      type: reminder.type,
      priority: reminder.priority
    });
    setShowModal(true);
  };

  const getDriverName = (driverId) => {
    const driver = drivers.find(d => d.id === driverId);
    return driver ? `${driver.firstName} ${driver.lastName}` : 'Bilinmeyen Şoför';
  };

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'payment': return '💰';
      case 'commission': return '💼';
      case 'other': return '📝';
      default: return '📋';
    }
  };

  const activeReminders = reminders.filter(r => r.status !== 'completed');
  const completedReminders = reminders.filter(r => r.status === 'completed');

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Ödeme Uyarıları</h2>
          <p className="text-gray-600">Şoför ödemelerini ve komisyon tahsilat tarihlerini takip edin</p>
        </div>
        <button
          onClick={() => {
            setEditingReminder(null);
            setFormData({
              driverId: '',
              title: '',
              description: '',
              dueDate: '',
              amount: '',
              type: 'payment',
              priority: 'medium'
            });
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Plus className="w-4 h-4" />
          Yeni Uyarı
        </button>
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-l-red-500">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            <div>
              <p className="text-sm text-gray-600">Acil Uyarılar</p>
              <p className="text-2xl font-bold text-red-600">
                {activeReminders.filter(r => getDaysUntilDue(r.dueDate) <= 0).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-l-yellow-500">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-yellow-600" />
            <div>
              <p className="text-sm text-gray-600">Bu Hafta</p>
              <p className="text-2xl font-bold text-yellow-600">
                {activeReminders.filter(r => {
                  const days = getDaysUntilDue(r.dueDate);
                  return days > 0 && days <= 7;
                }).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-l-blue-500">
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Toplam Aktif</p>
              <p className="text-2xl font-bold text-blue-600">{activeReminders.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-l-green-500">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Tamamlanan</p>
              <p className="text-2xl font-bold text-green-600">{completedReminders.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Aktif Uyarılar */}
      <div className="bg-white rounded-xl shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Bell className="w-6 h-6 text-orange-600" />
            Aktif Uyarılar
          </h3>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {activeReminders.map(reminder => {
              const daysUntil = getDaysUntilDue(reminder.dueDate);
              const isOverdue = daysUntil < 0;
              const isToday = daysUntil === 0;
              
              return (
                <motion.div
                  key={reminder.id}
                  whileHover={{ scale: 1.01 }}
                  className={`border-l-4 rounded-lg p-4 ${getPriorityColor(reminder.priority)} ${
                    isOverdue ? 'ring-2 ring-red-200' : isToday ? 'ring-2 ring-yellow-200' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getTypeIcon(reminder.type)}</span>
                      <div>
                        <h4 className="font-bold text-gray-800">{reminder.title}</h4>
                        <p className="text-sm text-gray-600">
                          {getDriverName(reminder.driverId)} • {reminder.dueDate.toLocaleDateString('tr-TR')}
                        </p>
                        {reminder.description && (
                          <p className="text-sm text-gray-500 mt-1">{reminder.description}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="text-right mr-4">
                        {reminder.amount > 0 && (
                          <p className="font-bold text-green-600">€{reminder.amount.toLocaleString()}</p>
                        )}
                        <p className={`text-sm font-medium ${
                          isOverdue ? 'text-red-600' : isToday ? 'text-yellow-600' : 'text-gray-600'
                        }`}>
                          {isOverdue 
                            ? `${Math.abs(daysUntil)} gün gecikmiş` 
                            : isToday 
                              ? 'Bugün' 
                              : `${daysUntil} gün kaldı`
                          }
                        </p>
                      </div>
                      
                      <button
                        onClick={() => openEditModal(reminder)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => markAsCompleted(reminder.id)}
                        className="p-2 text-green-600 hover:bg-green-100 rounded-lg"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => handleDelete(reminder.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
            
            {activeReminders.length === 0 && (
              <div className="text-center py-12">
                <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Aktif uyarı bulunamadı</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-md w-full p-6"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {editingReminder ? 'Uyarı Düzenle' : 'Yeni Uyarı Oluştur'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Şoför *
                </label>
                <select
                  value={formData.driverId}
                  onChange={(e) => setFormData(prev => ({ ...prev, driverId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="">Şoför seçin</option>
                  {drivers.map(driver => (
                    <option key={driver.id} value={driver.id}>
                      {driver.firstName} {driver.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Başlık *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Uyarı başlığı"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Açıklama
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows="3"
                  placeholder="Detaylı açıklama"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tür
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="payment">Ödeme</option>
                    <option value="commission">Komisyon</option>
                    <option value="other">Diğer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Öncelik
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="low">Düşük</option>
                    <option value="medium">Orta</option>
                    <option value="high">Yüksek</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tarih *
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tutar (€)
                  </label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  {editingReminder ? 'Güncelle' : 'Oluştur'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PaymentReminders;
