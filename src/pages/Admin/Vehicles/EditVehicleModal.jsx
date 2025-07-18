import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Car, Save, AlertCircle } from 'lucide-react';

const EditVehicleModal = ({ vehicle, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    brand: vehicle.brand || '',
    model: vehicle.model || '',
    year: vehicle.year || new Date().getFullYear(),
    plateNumber: vehicle.plateNumber || '',
    capacity: vehicle.capacity || '',
    kmRate: vehicle.kmRate || '',
    color: vehicle.color || '',
    fuelType: vehicle.fuelType || 'benzin',
    transmission: vehicle.transmission || 'otomatik',
    type: vehicle.type || 'sedan',
    imageUrl: vehicle.imageUrl || '',
    features: vehicle.features || [],
    description: vehicle.description || ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Özellik seçenekleri
  const availableFeatures = [
    'Klima',
    'WiFi',
    'USB Şarj',
    'Su İkramı',
    'Bebek Koltuğu',
    'Çocuk Koltuğu',
    'Tekerlekli Sandalye Desteği',
    'Müzik Sistemi',
    'TV/Monitör',
    'Mikrobus',
    'Büyük Bagaj',
    'Hostesli Hizmet',
    'Premium İç Tasarım',
    'Deri Koltuk',
    'Panoramik Cam',
    'Bluetooth',
    'Navigasyon',
    'Kamera Sistemi'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Hata temizle
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleFeatureToggle = (feature) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.brand.trim()) newErrors.brand = 'Marka gerekli';
    if (!formData.model.trim()) newErrors.model = 'Model gerekli';
    if (!formData.plateNumber.trim()) newErrors.plateNumber = 'Plaka gerekli';
    if (!formData.capacity || formData.capacity < 1) newErrors.capacity = 'Geçerli kapasite gerekli';
    if (!formData.kmRate || formData.kmRate < 0) newErrors.kmRate = 'KM başı ücret gerekli';
    if (!formData.color.trim()) newErrors.color = 'Renk gerekli';

    // Plaka formatı kontrolü (basit)
    const plateRegex = /^[0-9]{2}[A-Z]{1,3}[0-9]{2,4}$/;
    if (formData.plateNumber && !plateRegex.test(formData.plateNumber.replace(/\s/g, ''))) {
      newErrors.plateNumber = 'Geçerli plaka formatı girin (örn: 06ABC123)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const vehicleData = {
        ...formData,
        capacity: parseInt(formData.capacity),
        kmRate: parseFloat(formData.kmRate),
        year: parseInt(formData.year),
        plateNumber: formData.plateNumber.toUpperCase().replace(/\s/g, ''),
        brand: formData.brand.trim(),
        model: formData.model.trim(),
        color: formData.color.trim()
      };

      const success = await onSubmit(vehicle.id, vehicleData);
      
      if (success) {
        onClose();
      }
    } catch (error) {
      console.error('Araç güncellenirken hata:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Car className="w-6 h-6 text-blue-600" />
            Araç Düzenle
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Temel Bilgiler */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                Temel Bilgiler
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marka <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => handleInputChange('brand', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.brand ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Marka giriniz"
                />
                {errors.brand && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.brand}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Model <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => handleInputChange('model', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.model ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Model giriniz"
                />
                {errors.model && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.model}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Yıl
                  </label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => handleInputChange('year', e.target.value)}
                    min="1990"
                    max={new Date().getFullYear() + 1}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tip
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="sedan">Sedan</option>
                    <option value="suv">SUV</option>
                    <option value="minibus">Minibüs</option>
                    <option value="midibus">Midibüs</option>
                    <option value="bus">Otobüs</option>
                    <option value="vip">VIP</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plaka <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.plateNumber}
                  onChange={(e) => handleInputChange('plateNumber', e.target.value.toUpperCase())}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.plateNumber ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="06ABC123"
                />
                {errors.plateNumber && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.plateNumber}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Renk <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => handleInputChange('color', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.color ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Renk giriniz"
                />
                {errors.color && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.color}
                  </p>
                )}
              </div>
            </div>

            {/* Teknik Bilgiler */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                Teknik Bilgiler
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kapasite <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => handleInputChange('capacity', e.target.value)}
                  min="1"
                  max="50"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.capacity ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Kişi sayısı"
                />
                {errors.capacity && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.capacity}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  KM Başı Ücret (₺) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.kmRate}
                  onChange={(e) => handleInputChange('kmRate', e.target.value)}
                  min="0"
                  step="0.01"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.kmRate ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
                {errors.kmRate && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.kmRate}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Yakıt Türü
                  </label>
                  <select
                    value={formData.fuelType}
                    onChange={(e) => handleInputChange('fuelType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="benzin">Benzin</option>
                    <option value="dizel">Dizel</option>
                    <option value="lpg">LPG</option>
                    <option value="elektrik">Elektrik</option>
                    <option value="hibrit">Hibrit</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Şanzıman
                  </label>
                  <select
                    value={formData.transmission}
                    onChange={(e) => handleInputChange('transmission', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="otomatik">Otomatik</option>
                    <option value="manuel">Manuel</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Araç Resmi (URL)
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Araç fotoğrafının URL'ini girin (opsiyonel)
                </p>
              </div>
            </div>
          </div>

          {/* Özellikler */}
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">
              Araç Özellikleri
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {availableFeatures.map((feature) => (
                <label
                  key={feature}
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.features.includes(feature)}
                    onChange={() => handleFeatureToggle(feature)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{feature}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Açıklama */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Açıklama
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Araç hakkında ek bilgiler..."
            />
          </div>

          {/* Butonlar */}
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Güncelleniyor...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Güncelle
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditVehicleModal;
