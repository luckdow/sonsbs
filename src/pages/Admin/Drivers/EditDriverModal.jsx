import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  User, 
  Phone, 
  Mail, 
  MapPin,
  Calendar,
  Car,
  CreditCard,
  AlertTriangle,
  FileText
} from 'lucide-react';

const EditDriverModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  driver,
  vehicles,
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    licenseNumber: '',
    licenseExpiry: '',
    joinDate: '',
    bloodType: '',
    emergencyContact: '',
    emergencyPhone: '',
    assignedVehicle: '',
    bankAccount: '',
    bankName: '',
    salary: '',
    commission: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [hasChanges, setHasChanges] = useState(false);

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', '0+', '0-'];

  useEffect(() => {
    if (driver && isOpen) {
      setFormData({
        firstName: driver.firstName || '',
        lastName: driver.lastName || '',
        email: driver.email || '',
        phone: driver.phone || '',
        address: driver.address || '',
        licenseNumber: driver.licenseNumber || '',
        licenseExpiry: driver.licenseExpiry ? driver.licenseExpiry.split('T')[0] : '',
        joinDate: driver.joinDate ? driver.joinDate.split('T')[0] : '',
        bloodType: driver.bloodType || '',
        emergencyContact: driver.emergencyContact || '',
        emergencyPhone: driver.emergencyPhone || '',
        assignedVehicle: driver.assignedVehicle || '',
        bankAccount: driver.bankAccount || '',
        bankName: driver.bankName || '',
        salary: driver.salary || '',
        commission: driver.commission || '',
        notes: driver.notes || ''
      });
      setHasChanges(false);
      setErrors({});
    }
  }, [driver, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    setHasChanges(true);
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Ad alanı gereklidir';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Soyad alanı gereklidir';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'E-posta alanı gereklidir';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Geçerli bir e-posta adresi girin';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefon alanı gereklidir';
    }
    if (!formData.licenseNumber.trim()) {
      newErrors.licenseNumber = 'Ehliyet numarası gereklidir';
    }
    if (!formData.licenseExpiry) {
      newErrors.licenseExpiry = 'Ehliyet bitiş tarihi gereklidir';
    }
    if (!formData.commission) {
      newErrors.commission = 'Komisyon oranı gereklidir';
    }

    // Email format validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Geçerli bir e-posta adresi girin';
    }

    // Phone format validation
    if (formData.phone && !/^[0-9+\-\s\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Geçerli bir telefon numarası girin';
    }

    // License expiry date validation
    if (formData.licenseExpiry) {
      const today = new Date();
      const expiryDate = new Date(formData.licenseExpiry);
      if (expiryDate <= today) {
        newErrors.licenseExpiry = 'Ehliyet bitiş tarihi bugünden sonra olmalıdır';
      }
    }

    // Salary validation
    if (formData.salary && (isNaN(formData.salary) || parseFloat(formData.salary) < 0)) {
      newErrors.salary = 'Geçerli bir maaş miktarı girin';
    }

    // Commission validation
    if (formData.commission) {
      const commission = parseFloat(formData.commission);
      if (isNaN(commission) || commission < 0 || commission > 100) {
        newErrors.commission = 'Komisyon 0 ile 100 arasında olmalıdır';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!hasChanges) {
      onClose();
      return;
    }

    const updatedDriver = {
      ...driver,
      ...formData,
      updatedAt: new Date().toISOString()
    };

    onSave(updatedDriver);
  };

  const handleClose = () => {
    if (hasChanges) {
      if (window.confirm('Değişiklikler kaydedilmedi. Çıkmak istediğinizden emin misiniz?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  if (!isOpen || !driver) return null;

  const getLicenseStatus = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { color: 'text-red-600', message: 'Ehliyet süresi dolmuş!', urgent: true };
    } else if (diffDays <= 30) {
      return { color: 'text-orange-600', message: `${diffDays} gün içinde dolacak`, urgent: true };
    } else if (diffDays <= 90) {
      return { color: 'text-yellow-600', message: `${diffDays} gün kaldı`, urgent: false };
    } else {
      return { color: 'text-green-600', message: 'Geçerli', urgent: false };
    }
  };

  const licenseStatus = getLicenseStatus(formData.licenseExpiry);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Şoför Düzenle</h2>
            <p className="text-sm text-gray-500 mt-1">
              {driver.firstName} {driver.lastName}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4">
          {/* Durum Uyarıları */}
          {formData.licenseExpiry && licenseStatus.urgent && (
            <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-600" />
                <span className={`font-medium ${licenseStatus.color}`}>
                  Ehliyet Uyarısı: {licenseStatus.message}
                </span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Sol Kolon - Kişisel Bilgiler */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2 mb-3">
                <User className="w-5 h-5" />
                Kişisel Bilgiler
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ad *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ad"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Soyad *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Soyad"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-posta *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="ornek@email.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefon *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0555 123 4567"
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adres
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={2}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tam adres..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kan Grubu
                  </label>
                  <select
                    name="bloodType"
                    value={formData.bloodType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Seçiniz</option>
                    {bloodTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    İşe Başlama Tarihi
                  </label>
                  <input
                    type="date"
                    name="joinDate"
                    value={formData.joinDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Acil Durumda Aranacak Kişi
                </label>
                <input
                  type="text"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="İsim ve telefon"
                />
              </div>
            </div>

            {/* Sağ Kolon - Lisans ve İş Bilgileri */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2 mb-3">
                <CreditCard className="w-5 h-5" />
                Lisans ve İş Bilgileri
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ehliyet Numarası *
                </label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.licenseNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ehliyet numarası"
                />
                {errors.licenseNumber && (
                  <p className="mt-1 text-xs text-red-600">{errors.licenseNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ehliyet Bitiş Tarihi *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    name="licenseExpiry"
                    value={formData.licenseExpiry}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.licenseExpiry ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.licenseExpiry && (
                  <p className="mt-1 text-xs text-red-600">{errors.licenseExpiry}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Atanan Araç
                </label>
                <div className="relative">
                  <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    name="assignedVehicle"
                    value={formData.assignedVehicle}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Araç seçiniz</option>
                    {vehicles && vehicles.length > 0 ? (
                      vehicles.map(vehicle => (
                        <option key={vehicle.id} value={vehicle.id}>
                          {vehicle.brand} {vehicle.model} ({vehicle.plateNumber}) - {vehicle.status || 'Durum Belirtilmemiş'}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>Araç bulunamadı</option>
                    )}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Banka Adı
                  </label>
                  <input
                    type="text"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Banka adı"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Banka Hesap No
                  </label>
                  <input
                    type="text"
                    name="bankAccount"
                    value={formData.bankAccount}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Hesap numarası"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Maaş
                  </label>
                  <input
                    type="number"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.salary ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0"
                    min="0"
                  />
                  {errors.salary && (
                    <p className="mt-1 text-xs text-red-600">{errors.salary}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Komisyon (%) *
                  </label>
                  <input
                    type="number"
                    name="commission"
                    value={formData.commission}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.commission ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="25"
                    min="0"
                    max="100"
                  />
                  {errors.commission && (
                    <p className="mt-1 text-xs text-red-600">{errors.commission}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notlar
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Şoför hakkında notlar..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-4 pt-4 border-t bg-gray-50 -mx-4 -mb-4 px-4 py-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading || !hasChanges}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Kaydediliyor...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Değişiklikleri Kaydet
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDriverModal;
