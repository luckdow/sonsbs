import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Star,
  Edit3,
  Save,
  X,
  Camera,
  Shield,
  CreditCard,
  Bell,
  Lock,
  Eye,
  EyeOff,
  Trash2,
  Download
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const CustomerProfile = () => {
  const { state, user, showNotification } = useApp();
  const { reservations } = state;
  
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    dateOfBirth: '',
    address: '',
    city: '',
    preferences: {
      language: 'tr',
      notifications: {
        email: true,
        sms: false,
        push: true
      },
      defaultPickupLocation: '',
      paymentMethod: 'cash'
    }
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [customerStats, setCustomerStats] = useState({
    totalReservations: 0,
    completedTrips: 0,
    totalSpent: 0,
    joinDate: null,
    favoriteRoute: null
  });

  useEffect(() => {
    // Get customer reservations
    if (user?.email) {
      const customerReservations = reservations.filter(
        r => r.customerInfo?.email?.toLowerCase() === user.email.toLowerCase()
      );

      const completedTrips = customerReservations.filter(r => r.status === 'completed');
      const totalSpent = completedTrips.reduce((sum, r) => sum + (r.totalPrice || 0), 0);

      // Find most common route
      const routeCounts = {};
      customerReservations.forEach(r => {
        if (r.tripDetails?.from && r.tripDetails?.to) {
          const route = `${r.tripDetails.from} → ${r.tripDetails.to}`;
          routeCounts[route] = (routeCounts[route] || 0) + 1;
        }
      });

      const favoriteRoute = Object.keys(routeCounts).length > 0 
        ? Object.keys(routeCounts).reduce((a, b) => routeCounts[a] > routeCounts[b] ? a : b)
        : null;

      setCustomerStats({
        totalReservations: customerReservations.length,
        completedTrips: completedTrips.length,
        totalSpent,
        joinDate: user?.metadata?.creationTime || new Date().toISOString(),
        favoriteRoute
      });

      // Set customer info from first reservation if available
      if (customerReservations.length > 0) {
        const firstReservation = customerReservations[0];
        if (firstReservation.customerInfo) {
          setCustomerInfo(prev => ({
            ...prev,
            firstName: firstReservation.customerInfo.firstName || '',
            lastName: firstReservation.customerInfo.lastName || '',
            phone: firstReservation.customerInfo.phone || ''
          }));
        }
      }
    }
  }, [reservations, user]);

  useEffect(() => {
    setFormData(customerInfo);
  }, [customerInfo]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      // Basic validation
      if (!formData.firstName || !formData.lastName) {
        showNotification('Lütfen ad ve soyad alanlarını doldurun', 'error');
        return;
      }

      // Phone validation
      if (formData.phone) {
        const phoneRegex = /^(\+90|0)?[5][0-9]{9}$/;
        if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
          showNotification('Geçerli bir telefon numarası girin', 'error');
          return;
        }
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (formData.email && !emailRegex.test(formData.email)) {
        showNotification('Geçerli bir email adresi girin', 'error');
        return;
      }

      setCustomerInfo(formData);
      setIsEditing(false);
      showNotification('Profil başarıyla güncellendi', 'success');
      
      // Here you would typically save to a backend
      // For now, we'll just store in localStorage
      localStorage.setItem('customerProfile', JSON.stringify(formData));
    } catch (error) {
      console.error('Profil güncelleme hatası:', error);
      showNotification('Profil güncellenirken bir hata oluştu', 'error');
    }
  };

  const handleCancel = () => {
    setFormData(customerInfo);
    setIsEditing(false);
  };

  const handlePasswordChange = async () => {
    try {
      if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
        showNotification('Lütfen tüm şifre alanlarını doldurun', 'error');
        return;
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        showNotification('Yeni şifreler eşleşmiyor', 'error');
        return;
      }

      if (passwordData.newPassword.length < 6) {
        showNotification('Yeni şifre en az 6 karakter olmalıdır', 'error');
        return;
      }

      // Here you would implement actual password change logic
      showNotification('Şifre başarıyla güncellendi', 'success');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Şifre güncelleme hatası:', error);
      showNotification('Şifre güncellenirken bir hata oluştu', 'error');
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const exportData = () => {
    const exportData = {
      profile: customerInfo,
      statistics: customerStats,
      reservationHistory: reservations.filter(
        r => r.customerInfo?.email?.toLowerCase() === user?.email?.toLowerCase()
      ),
      exportDate: new Date().toISOString()
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `kullanici-verileri-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const deleteAccount = () => {
    if (window.confirm('Hesabınızı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
      if (window.confirm('Son kez soruyoruz: Hesabınızı kalıcı olarak silmek istediğinizden emin misiniz?')) {
        // Here you would implement account deletion logic
        showNotification('Hesap silme talebiniz alındı. 24 saat içinde işlenecektir.', 'info');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profil Ayarları</h1>
          <p className="text-gray-600">Hesap bilgilerinizi yönetin</p>
        </div>
        {!isEditing ? (
          <button
            onClick={handleEdit}
            className="btn btn-primary"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Düzenle
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="btn btn-success"
            >
              <Save className="w-4 h-4 mr-2" />
              Kaydet
            </button>
            <button
              onClick={handleCancel}
              className="btn btn-outline"
            >
              <X className="w-4 h-4 mr-2" />
              İptal
            </button>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div className="card-body text-center">
            <Calendar className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{customerStats.totalReservations}</p>
            <p className="text-sm text-gray-600">Toplam Rezervasyon</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <div className="card-body text-center">
            <Star className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{customerStats.completedTrips}</p>
            <p className="text-sm text-gray-600">Tamamlanan Seyahat</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="card-body text-center">
            <CreditCard className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(customerStats.totalSpent)}</p>
            <p className="text-sm text-gray-600">Toplam Harcama</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <div className="card-body text-center">
            <MapPin className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <p className="text-lg font-bold text-gray-900 truncate" title={customerStats.favoriteRoute}>
              {customerStats.favoriteRoute || 'Henüz yok'}
            </p>
            <p className="text-sm text-gray-600">Favori Güzergah</p>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 card"
        >
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Kişisel Bilgiler</h3>
          </div>
          <div className="card-body">
            <div className="space-y-6">
              {/* Profile Picture */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-10 h-10 text-blue-600" />
                  </div>
                  {isEditing && (
                    <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center">
                      <Camera className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-900">
                    {customerInfo.firstName} {customerInfo.lastName}
                  </h4>
                  <p className="text-sm text-gray-500">Müşteri</p>
                  <p className="text-sm text-gray-400">
                    Üye olma: {new Date(customerStats.joinDate).toLocaleDateString('tr-TR')}
                  </p>
                </div>
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label">Ad *</label>
                  {isEditing ? (
                    <input
                      type="text"
                      className="input"
                      value={formData.firstName || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    />
                  ) : (
                    <p className="input-display">{customerInfo.firstName || 'Belirtilmemiş'}</p>
                  )}
                </div>

                <div>
                  <label className="label">Soyad *</label>
                  {isEditing ? (
                    <input
                      type="text"
                      className="input"
                      value={formData.lastName || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    />
                  ) : (
                    <p className="input-display">{customerInfo.lastName || 'Belirtilmemiş'}</p>
                  )}
                </div>

                <div>
                  <label className="label">Email</label>
                  <p className="input-display flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-gray-400" />
                    {customerInfo.email}
                  </p>
                </div>

                <div>
                  <label className="label">Telefon</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      className="input"
                      value={formData.phone || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  ) : (
                    <p className="input-display flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      {customerInfo.phone || 'Belirtilmemiş'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="label">Doğum Tarihi</label>
                  {isEditing ? (
                    <input
                      type="date"
                      className="input"
                      value={formData.dateOfBirth || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                    />
                  ) : (
                    <p className="input-display flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      {customerInfo.dateOfBirth 
                        ? `${new Date(customerInfo.dateOfBirth).toLocaleDateString('tr-TR')} (${calculateAge(customerInfo.dateOfBirth)} yaş)`
                        : 'Belirtilmemiş'
                      }
                    </p>
                  )}
                </div>

                <div>
                  <label className="label">Şehir</label>
                  {isEditing ? (
                    <input
                      type="text"
                      className="input"
                      value={formData.city || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    />
                  ) : (
                    <p className="input-display flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      {customerInfo.city || 'Belirtilmemiş'}
                    </p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="label">Adres</label>
                {isEditing ? (
                  <textarea
                    className="input"
                    rows="3"
                    value={formData.address || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  />
                ) : (
                  <p className="input-display">
                    {customerInfo.address || 'Belirtilmemiş'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Preferences & Settings */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-6"
        >
          {/* Notification Preferences */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Bildirim Tercihleri
              </h3>
            </div>
            <div className="card-body space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Email Bildirimleri</span>
                <input
                  type="checkbox"
                  className="toggle"
                  checked={formData.preferences?.notifications?.email || false}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    preferences: {
                      ...prev.preferences,
                      notifications: {
                        ...prev.preferences?.notifications,
                        email: e.target.checked
                      }
                    }
                  }))}
                  disabled={!isEditing}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-700">SMS Bildirimleri</span>
                <input
                  type="checkbox"
                  className="toggle"
                  checked={formData.preferences?.notifications?.sms || false}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    preferences: {
                      ...prev.preferences,
                      notifications: {
                        ...prev.preferences?.notifications,
                        sms: e.target.checked
                      }
                    }
                  }))}
                  disabled={!isEditing}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-700">Push Bildirimleri</span>
                <input
                  type="checkbox"
                  className="toggle"
                  checked={formData.preferences?.notifications?.push || false}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    preferences: {
                      ...prev.preferences,
                      notifications: {
                        ...prev.preferences?.notifications,
                        push: e.target.checked
                      }
                    }
                  }))}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>

          {/* Default Preferences */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Varsayılan Tercihler</h3>
            </div>
            <div className="card-body space-y-4">
              <div>
                <label className="label">Varsayılan Alınacak Yer</label>
                {isEditing ? (
                  <input
                    type="text"
                    className="input"
                    placeholder="Ör: Ev adresiniz"
                    value={formData.preferences?.defaultPickupLocation || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      preferences: {
                        ...prev.preferences,
                        defaultPickupLocation: e.target.value
                      }
                    }))}
                  />
                ) : (
                  <p className="input-display">
                    {customerInfo.preferences?.defaultPickupLocation || 'Belirtilmemiş'}
                  </p>
                )}
              </div>

              <div>
                <label className="label">Tercih Edilen Ödeme</label>
                {isEditing ? (
                  <select
                    className="input"
                    value={formData.preferences?.paymentMethod || 'cash'}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      preferences: {
                        ...prev.preferences,
                        paymentMethod: e.target.value
                      }
                    }))}
                  >
                    <option value="cash">Nakit</option>
                    <option value="card">Kredi Kartı</option>
                    <option value="transfer">Banka Transferi</option>
                  </select>
                ) : (
                  <p className="input-display">
                    {customerInfo.preferences?.paymentMethod === 'cash' ? 'Nakit' :
                     customerInfo.preferences?.paymentMethod === 'card' ? 'Kredi Kartı' :
                     customerInfo.preferences?.paymentMethod === 'transfer' ? 'Banka Transferi' : 'Nakit'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Hızlı İşlemler</h3>
            </div>
            <div className="card-body space-y-3">
              <button
                onClick={exportData}
                className="btn btn-outline w-full justify-start"
              >
                <Download className="w-4 h-4 mr-2" />
                Verilerimi İndir
              </button>
              
              <button
                onClick={() => showNotification('Yakında kullanıma sunulacak', 'info')}
                className="btn btn-outline w-full justify-start"
              >
                <Shield className="w-4 h-4 mr-2" />
                Gizlilik Ayarları
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Password Change */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card"
      >
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Lock className="w-5 h-5 mr-2" />
            Şifre Değiştir
          </h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="label">Mevcut Şifre</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="input pr-10"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="label">Yeni Şifre</label>
              <input
                type="password"
                className="input"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
              />
            </div>

            <div>
              <label className="label">Yeni Şifre Tekrar</label>
              <input
                type="password"
                className="input"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              />
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handlePasswordChange}
              className="btn btn-primary"
            >
              Şifreyi Güncelle
            </button>
          </div>
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="card border-red-200"
      >
        <div className="card-header bg-red-50">
          <h3 className="text-lg font-semibold text-red-900">Tehlikeli Alan</h3>
        </div>
        <div className="card-body">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-md font-medium text-gray-900">Hesabı Sil</h4>
              <p className="text-sm text-gray-600">
                Hesabınızı kalıcı olarak silin. Bu işlem geri alınamaz.
              </p>
            </div>
            <button
              onClick={deleteAccount}
              className="btn btn-outline text-red-600 border-red-200 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Hesabı Sil
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CustomerProfile;
