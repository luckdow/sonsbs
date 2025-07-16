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
  Car,
  CreditCard,
  Clock,
  Award,
  TrendingUp
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const DriverProfile = () => {
  const { state, user, updateDriver, showNotification } = useApp();
  const { drivers, reservations, vehicles } = state;
  
  const [driverInfo, setDriverInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [stats, setStats] = useState({
    totalTrips: 0,
    completedTrips: 0,
    totalEarnings: 0,
    averageRating: 0,
    totalDistance: 0,
    joinDate: null
  });

  useEffect(() => {
    // Find current driver info
    const currentDriver = drivers.find(d => d.email === user?.email);
    if (currentDriver) {
      setDriverInfo(currentDriver);
      setFormData(currentDriver);
      
      // Calculate driver stats
      const driverReservations = reservations.filter(r => r.driverId === currentDriver.id);
      const completedTrips = driverReservations.filter(r => r.status === 'completed');
      
      const totalEarnings = completedTrips.reduce((sum, r) => {
        const commission = (r.totalPrice || 0) * ((currentDriver.commission || 10) / 100);
        return sum + commission;
      }, 0);

      const totalDistance = completedTrips.reduce((sum, r) => {
        return sum + (r.tripDetails?.distance || 0);
      }, 0);

      setStats({
        totalTrips: driverReservations.length,
        completedTrips: completedTrips.length,
        totalEarnings,
        averageRating: currentDriver.rating || 5.0,
        totalDistance,
        joinDate: currentDriver.hireDate
      });
    }
  }, [drivers, reservations, user]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      if (!driverInfo?.id) return;

      // Basic validation
      if (!formData.firstName || !formData.lastName || !formData.phone) {
        showNotification('Lütfen tüm zorunlu alanları doldurun', 'error');
        return;
      }

      // Phone validation
      const phoneRegex = /^(\+90|0)?[5][0-9]{9}$/;
      if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
        showNotification('Geçerli bir telefon numarası girin', 'error');
        return;
      }

      await updateDriver(driverInfo.id, formData);
      setDriverInfo(formData);
      setIsEditing(false);
      showNotification('Profil başarıyla güncellendi', 'success');
    } catch (error) {
      console.error('Profil güncelleme hatası:', error);
      showNotification('Profil güncellenirken bir hata oluştu', 'error');
    }
  };

  const handleCancel = () => {
    setFormData(driverInfo || {});
    setIsEditing(false);
  };

  const getAssignedVehicle = () => {
    if (!driverInfo) return null;
    return vehicles.find(v => v.driverId === driverInfo.id);
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

  const assignedVehicle = getAssignedVehicle();

  if (!driverInfo) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Profil Bulunamadı</h3>
          <p className="text-gray-500">Lütfen yöneticinizle iletişime geçin.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0"
      >
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Profil Ayarları
          </h1>
          <p className="text-gray-600 mt-2 text-lg">Kişisel bilgilerinizi görüntüleyin ve düzenleyin</p>
        </div>
        {!isEditing ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleEdit}
            className="btn btn-primary"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Düzenle
          </motion.button>
        ) : (
          <div className="flex space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              className="btn btn-success"
            >
              <Save className="w-4 h-4 mr-2" />
              Kaydet
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCancel}
              className="btn btn-outline"
            >
              <X className="w-4 h-4 mr-2" />
              İptal
            </motion.button>
          </div>
        )}
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          whileHover={{ scale: 1.05, y: -5 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
          className="card group hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50"
        >
          <div className="card-body text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Car className="w-10 h-10 text-blue-500 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
            <p className="text-3xl font-bold text-gray-900 mb-1">{stats.totalTrips}</p>
            <p className="text-sm text-gray-600 font-medium">Toplam Sefer</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          whileHover={{ scale: 1.05, y: -5 }}
          transition={{ duration: 0.3, delay: 0.1, type: "spring", stiffness: 300 }}
          className="card group hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50"
        >
          <div className="card-body text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Award className="w-10 h-10 text-green-500 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
            <p className="text-3xl font-bold text-gray-900 mb-1">{stats.completedTrips}</p>
            <p className="text-sm text-gray-600 font-medium">Tamamlanan</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          whileHover={{ scale: 1.05, y: -5 }}
          transition={{ duration: 0.3, delay: 0.2, type: "spring", stiffness: 300 }}
          className="card group hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50"
        >
          <div className="card-body text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <TrendingUp className="w-10 h-10 text-purple-500 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
            <p className="text-3xl font-bold text-gray-900 mb-1">{formatCurrency(stats.totalEarnings)}</p>
            <p className="text-sm text-gray-600 font-medium">Toplam Kazanç</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          whileHover={{ scale: 1.05, y: -5 }}
          transition={{ duration: 0.3, delay: 0.3, type: "spring", stiffness: 300 }}
          className="card group hover:bg-gradient-to-br hover:from-yellow-50 hover:to-orange-50"
        >
          <div className="card-body text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Star className="w-10 h-10 text-yellow-500 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
            <p className="text-3xl font-bold text-gray-900 mb-1">⭐ {stats.averageRating}</p>
            <p className="text-sm text-gray-600 font-medium">Ortalama Puan</p>
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
              <div className="flex items-center space-x-6">
                <div className="relative group">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 group-hover:scale-110">
                    <User className="w-12 h-12 text-white" />
                  </div>
                  {isEditing && (
                    <motion.button 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Camera className="w-4 h-4" />
                    </motion.button>
                  )}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm"></div>
                </div>
                <div className="flex-1">
                  <h4 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-1">
                    {driverInfo.firstName} {driverInfo.lastName}
                  </h4>
                  <p className="text-blue-600 font-semibold mb-2">Profesyonel Şoför</p>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center bg-gradient-to-r from-yellow-50 to-orange-50 px-3 py-1 rounded-full">
                      <Star className="w-4 h-4 text-yellow-500 mr-2" />
                      <span className="text-sm font-semibold text-gray-700">{stats.averageRating} Puan</span>
                    </div>
                    <div className="flex items-center bg-gradient-to-r from-green-50 to-emerald-50 px-3 py-1 rounded-full">
                      <Award className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-sm font-semibold text-gray-700">{stats.completedTrips} Sefer</span>
                    </div>
                  </div>
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
                    <p className="input-display">{driverInfo.firstName}</p>
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
                    <p className="input-display">{driverInfo.lastName}</p>
                  )}
                </div>

                <div>
                  <label className="label">Email</label>
                  <p className="input-display flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-gray-400" />
                    {driverInfo.email}
                  </p>
                </div>

                <div>
                  <label className="label">Telefon *</label>
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
                      {driverInfo.phone}
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
                      {driverInfo.dateOfBirth 
                        ? `${new Date(driverInfo.dateOfBirth).toLocaleDateString('tr-TR')} (${calculateAge(driverInfo.dateOfBirth)} yaş)`
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
                      {driverInfo.city || 'Belirtilmemiş'}
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
                    {driverInfo.address || 'Belirtilmemiş'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Additional Information */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-6"
        >
          {/* License Information */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="card group"
          >
            <div className="card-header bg-gradient-to-r from-blue-50 to-indigo-50 group-hover:from-blue-100 group-hover:to-indigo-100 transition-all duration-300">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                Ehliyet Bilgileri
              </h3>
            </div>
            <div className="card-body space-y-4">
              <div>
                <label className="label">Ehliyet No</label>
                {isEditing ? (
                  <input
                    type="text"
                    className="input"
                    value={formData.licenseNumber || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, licenseNumber: e.target.value }))}
                  />
                ) : (
                  <p className="input-display">{driverInfo.licenseNumber || 'Belirtilmemiş'}</p>
                )}
              </div>

              <div>
                <label className="label">Geçerlilik Tarihi</label>
                {isEditing ? (
                  <input
                    type="date"
                    className="input"
                    value={formData.licenseExpiry || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, licenseExpiry: e.target.value }))}
                  />
                ) : (
                  <p className="input-display">
                    {driverInfo.licenseExpiry 
                      ? new Date(driverInfo.licenseExpiry).toLocaleDateString('tr-TR')
                      : 'Belirtilmemiş'
                    }
                  </p>
                )}
              </div>

              <div>
                <label className="label">Deneyim (Yıl)</label>
                {isEditing ? (
                  <input
                    type="number"
                    className="input"
                    min="0"
                    max="50"
                    value={formData.experienceYears || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, experienceYears: parseInt(e.target.value) || 0 }))}
                  />
                ) : (
                  <div className="input-display flex items-center justify-between">
                    <span>{driverInfo.experienceYears || 0} yıl</span>
                    <div className="flex space-x-1">
                      {[...Array(Math.min(5, driverInfo.experienceYears || 0))].map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Assigned Vehicle */}
          {assignedVehicle && (
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Car className="w-5 h-5 mr-2" />
                  Atanmış Araç
                </h3>
              </div>
              <div className="card-body space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Araç:</span>
                  <span className="font-medium">{assignedVehicle.brand} {assignedVehicle.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Plaka:</span>
                  <span className="font-medium">{assignedVehicle.plateNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Yıl:</span>
                  <span className="font-medium">{assignedVehicle.year}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Kapasite:</span>
                  <span className="font-medium">{assignedVehicle.capacity} kişi</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Durum:</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    assignedVehicle.status === 'active' ? 'status-active' : 'status-inactive'
                  }`}>
                    {assignedVehicle.status === 'active' ? 'Aktif' : 'Pasif'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Work Statistics */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                İş İstatistikleri
              </h3>
            </div>
            <div className="card-body space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">İşe Başlama:</span>
                <span className="font-medium">
                  {stats.joinDate 
                    ? new Date(stats.joinDate).toLocaleDateString('tr-TR')
                    : 'Bilinmiyor'
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Toplam Mesafe:</span>
                <span className="font-medium">{stats.totalDistance} km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Komisyon Oranı:</span>
                <span className="font-medium">%{driverInfo.commission || 10}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Durum:</span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  driverInfo.status === 'active' ? 'status-active' : 'status-inactive'
                }`}>
                  {driverInfo.status === 'active' ? 'Aktif' : 'Pasif'}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Emergency Contact */}
      {(driverInfo.emergencyContact?.name || isEditing) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card"
        >
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Acil Durum İletişim</h3>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="label">İsim</label>
                {isEditing ? (
                  <input
                    type="text"
                    className="input"
                    value={formData.emergencyContact?.name || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      emergencyContact: { ...prev.emergencyContact, name: e.target.value }
                    }))}
                  />
                ) : (
                  <p className="input-display">{driverInfo.emergencyContact?.name || 'Belirtilmemiş'}</p>
                )}
              </div>

              <div>
                <label className="label">Telefon</label>
                {isEditing ? (
                  <input
                    type="tel"
                    className="input"
                    value={formData.emergencyContact?.phone || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      emergencyContact: { ...prev.emergencyContact, phone: e.target.value }
                    }))}
                  />
                ) : (
                  <p className="input-display">{driverInfo.emergencyContact?.phone || 'Belirtilmemiş'}</p>
                )}
              </div>

              <div>
                <label className="label">Yakınlık Derecesi</label>
                {isEditing ? (
                  <input
                    type="text"
                    className="input"
                    value={formData.emergencyContact?.relation || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      emergencyContact: { ...prev.emergencyContact, relation: e.target.value }
                    }))}
                  />
                ) : (
                  <p className="input-display">{driverInfo.emergencyContact?.relation || 'Belirtilmemiş'}</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Bank Information */}
      {(driverInfo.bankInfo?.accountHolder || isEditing) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="card"
        >
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Banka Bilgileri
            </h3>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">Hesap Sahibi</label>
                {isEditing ? (
                  <input
                    type="text"
                    className="input"
                    value={formData.bankInfo?.accountHolder || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      bankInfo: { ...prev.bankInfo, accountHolder: e.target.value }
                    }))}
                  />
                ) : (
                  <p className="input-display">{driverInfo.bankInfo?.accountHolder || 'Belirtilmemiş'}</p>
                )}
              </div>

              <div>
                <label className="label">Banka Adı</label>
                {isEditing ? (
                  <input
                    type="text"
                    className="input"
                    value={formData.bankInfo?.bankName || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      bankInfo: { ...prev.bankInfo, bankName: e.target.value }
                    }))}
                  />
                ) : (
                  <p className="input-display">{driverInfo.bankInfo?.bankName || 'Belirtilmemiş'}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="label">IBAN</label>
                {isEditing ? (
                  <input
                    type="text"
                    className="input"
                    placeholder="TR00 0000 0000 0000 0000 0000 00"
                    value={formData.bankInfo?.iban || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      bankInfo: { ...prev.bankInfo, iban: e.target.value.toUpperCase() }
                    }))}
                  />
                ) : (
                  <p className="input-display">{driverInfo.bankInfo?.iban || 'Belirtilmemiş'}</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DriverProfile;
