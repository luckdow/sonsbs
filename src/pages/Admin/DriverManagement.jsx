import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Plus, 
  Edit3, 
  Trash2, 
  Search,
  Filter,
  Phone,
  Mail,
  MapPin,
  Calendar,
  User,
  Shield,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const DriverManagement = () => {
  const { state, addDriver, updateDriver, deleteDriver, showNotification } = useApp();
  const { drivers, vehicles } = state;
  
  const [showModal, setShowModal] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    city: '',
    licenseNumber: '',
    licenseExpiry: '',
    experienceYears: 0,
    status: 'active',
    emergencyContact: {
      name: '',
      phone: '',
      relation: ''
    },
    bankInfo: {
      accountHolder: '',
      iban: '',
      bankName: ''
    },
    hireDate: new Date().toISOString().split('T')[0],
    salary: 0,
    commission: 10,
    rating: 5.0
  });

  useEffect(() => {
    if (editingDriver) {
      setFormData({ 
        ...editingDriver,
        emergencyContact: editingDriver.emergencyContact || { name: '', phone: '', relation: '' },
        bankInfo: editingDriver.bankInfo || { accountHolder: '', iban: '', bankName: '' }
      });
    } else {
      resetForm();
    }
  }, [editingDriver]);

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      address: '',
      city: '',
      licenseNumber: '',
      licenseExpiry: '',
      experienceYears: 0,
      status: 'active',
      emergencyContact: {
        name: '',
        phone: '',
        relation: ''
      },
      bankInfo: {
        accountHolder: '',
        iban: '',
        bankName: ''
      },
      hireDate: new Date().toISOString().split('T')[0],
      salary: 0,
      commission: 10,
      rating: 5.0
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Form validation
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
        showNotification('Lütfen tüm zorunlu alanları doldurun', 'error');
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        showNotification('Geçerli bir email adresi girin', 'error');
        return;
      }

      // Phone validation (Turkish phone format)
      const phoneRegex = /^(\+90|0)?[5][0-9]{9}$/;
      if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
        showNotification('Geçerli bir telefon numarası girin', 'error');
        return;
      }

      // License number validation
      if (formData.licenseNumber && formData.licenseNumber.length < 6) {
        showNotification('Ehliyet numarası en az 6 karakter olmalıdır', 'error');
        return;
      }

      const driverData = {
        ...formData,
        email: formData.email.toLowerCase(),
        phone: formData.phone.replace(/\s/g, ''),
        fullName: `${formData.firstName} ${formData.lastName}`
      };

      if (editingDriver) {
        await updateDriver(editingDriver.id, driverData);
        showNotification('Şoför başarıyla güncellendi', 'success');
      } else {
        await addDriver(driverData);
        showNotification('Şoför başarıyla eklendi', 'success');
      }

      handleCloseModal();
    } catch (error) {
      console.error('Şoför kaydetme hatası:', error);
      showNotification('Şoför kaydedilirken bir hata oluştu', 'error');
    }
  };

  const handleDelete = async (driverId) => {
    // Check if driver is assigned to any vehicle
    const assignedVehicle = vehicles.find(v => v.driverId === driverId);
    
    if (assignedVehicle) {
      showNotification('Bu şoför bir araca atanmış durumda. Önce araç atamasını kaldırın.', 'error');
      return;
    }

    if (window.confirm('Bu şoförü silmek istediğinizden emin misiniz?')) {
      try {
        await deleteDriver(driverId);
        showNotification('Şoför başarıyla silindi', 'success');
      } catch (error) {
        console.error('Şoför silme hatası:', error);
        showNotification('Şoför silinirken bir hata oluştu', 'error');
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingDriver(null);
    resetForm();
  };

  const getAssignedVehicle = (driverId) => {
    const vehicle = vehicles.find(v => v.driverId === driverId);
    return vehicle ? `${vehicle.brand} ${vehicle.model} (${vehicle.plateNumber})` : 'Atanmamış';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'status-active';
      case 'inactive':
        return 'status-inactive';
      case 'vacation':
        return 'status-warning';
      case 'suspended':
        return 'status-error';
      default:
        return 'status-pending';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Aktif';
      case 'inactive':
        return 'Pasif';
      case 'vacation':
        return 'İzinli';
      case 'suspended':
        return 'Askıya Alınmış';
      default:
        return 'Bilinmeyen';
    }
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birth = new Date(dateOfBirth);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = 
      driver.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.phone?.includes(searchTerm);
    
    const matchesFilter = filterStatus === 'all' || driver.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Yeni Şoför
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-body">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Ad, soyad, email veya telefon ile ara..."
                  className="input pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                className="input"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Tüm Durumlar</option>
                <option value="active">Aktif</option>
                <option value="inactive">Pasif</option>
                <option value="vacation">İzinli</option>
                <option value="suspended">Askıya Alınmış</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Drivers Grid */}
      {filteredDrivers.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || filterStatus !== 'all' ? 'Şoför bulunamadı' : 'Henüz şoför yok'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || filterStatus !== 'all' 
                ? 'Arama kriterlerinize uygun şoför bulunamadı' 
                : 'İlk şoförünüzü ekleyerek başlayın'
              }
            </p>
            {!searchTerm && filterStatus === 'all' && (
              <button
                onClick={() => setShowModal(true)}
                className="btn btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                İlk Şoförü Ekle
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredDrivers.map((driver, index) => (
            <motion.div
              key={driver.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card hover:shadow-lg transition-shadow"
            >
              <div className="card-body">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {driver.firstName} {driver.lastName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {driver.experienceYears ? `${driver.experienceYears} yıl deneyim` : 'Deneyim belirtilmemiş'}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(driver.status)}`}>
                    {getStatusText(driver.status)}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm">
                    <Mail className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-600 truncate">{driver.email}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Phone className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">{driver.phone}</span>
                  </div>
                  {driver.city && (
                    <div className="flex items-center text-sm">
                      <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-600">{driver.city}</span>
                    </div>
                  )}
                  {driver.dateOfBirth && (
                    <div className="flex items-center text-sm">
                      <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-600">{calculateAge(driver.dateOfBirth)} yaş</span>
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 p-3 rounded-lg mb-4">
                  <div className="text-xs text-gray-500 mb-1">Atanmış Araç</div>
                  <div className="text-sm font-medium text-gray-900">
                    {getAssignedVehicle(driver.id)}
                  </div>
                </div>

                {driver.licenseNumber && (
                  <div className="bg-blue-50 p-3 rounded-lg mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-blue-600 mb-1">Ehliyet No</div>
                        <div className="text-sm font-medium text-blue-900">
                          {driver.licenseNumber}
                        </div>
                      </div>
                      {driver.licenseExpiry && (
                        <div className="text-right">
                          <div className="text-xs text-blue-600 mb-1">Geçerlilik</div>
                          <div className="text-sm font-medium text-blue-900">
                            {new Date(driver.licenseExpiry).toLocaleDateString('tr-TR')}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="text-sm">
                    <span className="text-gray-500">Değerlendirme: </span>
                    <span className="font-medium">⭐ {driver.rating || 5.0}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingDriver(driver);
                        setShowModal(true);
                      }}
                      className="btn btn-sm btn-outline"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(driver.id)}
                      className="btn btn-sm btn-outline text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="modal-content max-w-4xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3 className="text-lg font-semibold">
                {editingDriver ? 'Şoför Düzenle' : 'Yeni Şoför Ekle'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-body space-y-6">
              {/* Personal Information */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Kişisel Bilgiler
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Ad *</label>
                    <input
                      type="text"
                      className="input"
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <label className="label">Soyad *</label>
                    <input
                      type="text"
                      className="input"
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <label className="label">Email *</label>
                    <input
                      type="email"
                      className="input"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <label className="label">Telefon *</label>
                    <input
                      type="tel"
                      className="input"
                      placeholder="0555 123 45 67"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <label className="label">Doğum Tarihi</label>
                    <input
                      type="date"
                      className="input"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="label">Şehir</label>
                    <input
                      type="text"
                      className="input"
                      value={formData.city}
                      onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="label">Adres</label>
                    <textarea
                      className="input"
                      rows="2"
                      value={formData.address}
                      onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              {/* License Information */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                  Ehliyet Bilgileri
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="label">Ehliyet Numarası</label>
                    <input
                      type="text"
                      className="input"
                      value={formData.licenseNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, licenseNumber: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="label">Ehliyet Bitiş Tarihi</label>
                    <input
                      type="date"
                      className="input"
                      value={formData.licenseExpiry}
                      onChange={(e) => setFormData(prev => ({ ...prev, licenseExpiry: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="label">Deneyim (Yıl)</label>
                    <input
                      type="number"
                      className="input"
                      min="0"
                      max="50"
                      value={formData.experienceYears}
                      onChange={(e) => setFormData(prev => ({ ...prev, experienceYears: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                </div>
              </div>

              {/* Employment Information */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3">
                  İstihdam Bilgileri
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="label">İşe Başlama Tarihi</label>
                    <input
                      type="date"
                      className="input"
                      value={formData.hireDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, hireDate: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="label">Maaş (₺)</label>
                    <input
                      type="number"
                      className="input"
                      min="0"
                      step="0.01"
                      value={formData.salary}
                      onChange={(e) => setFormData(prev => ({ ...prev, salary: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>

                  <div>
                    <label className="label">Komisyon (%)</label>
                    <input
                      type="number"
                      className="input"
                      min="0"
                      max="100"
                      step="0.1"
                      value={formData.commission}
                      onChange={(e) => setFormData(prev => ({ ...prev, commission: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Acil Durum İletişim
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="label">İsim</label>
                    <input
                      type="text"
                      className="input"
                      value={formData.emergencyContact.name}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        emergencyContact: { ...prev.emergencyContact, name: e.target.value }
                      }))}
                    />
                  </div>

                  <div>
                    <label className="label">Telefon</label>
                    <input
                      type="tel"
                      className="input"
                      value={formData.emergencyContact.phone}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        emergencyContact: { ...prev.emergencyContact, phone: e.target.value }
                      }))}
                    />
                  </div>

                  <div>
                    <label className="label">Yakınlık Derecesi</label>
                    <input
                      type="text"
                      className="input"
                      placeholder="Anne, Baba, Eş, vb."
                      value={formData.emergencyContact.relation}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        emergencyContact: { ...prev.emergencyContact, relation: e.target.value }
                      }))}
                    />
                  </div>
                </div>
              </div>

              {/* Bank Information */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3">
                  Banka Bilgileri
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Hesap Sahibi</label>
                    <input
                      type="text"
                      className="input"
                      value={formData.bankInfo.accountHolder}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        bankInfo: { ...prev.bankInfo, accountHolder: e.target.value }
                      }))}
                    />
                  </div>

                  <div>
                    <label className="label">Banka Adı</label>
                    <input
                      type="text"
                      className="input"
                      value={formData.bankInfo.bankName}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        bankInfo: { ...prev.bankInfo, bankName: e.target.value }
                      }))}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="label">IBAN</label>
                    <input
                      type="text"
                      className="input"
                      placeholder="TR00 0000 0000 0000 0000 0000 00"
                      value={formData.bankInfo.iban}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        bankInfo: { ...prev.bankInfo, iban: e.target.value.toUpperCase() }
                      }))}
                    />
                  </div>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="label">Durum</label>
                <select
                  className="input"
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                >
                  <option value="active">Aktif</option>
                  <option value="inactive">Pasif</option>
                  <option value="vacation">İzinli</option>
                  <option value="suspended">Askıya Alınmış</option>
                </select>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="btn btn-outline"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  {editingDriver ? 'Güncelle' : 'Ekle'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default DriverManagement;
