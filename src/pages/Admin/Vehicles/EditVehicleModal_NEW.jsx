import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Car, Save, AlertCircle, Calculator, Info, Plus, Trash2 } from 'lucide-react';
import { getDefaultPricingForType, validatePricing, formatPriceBreakdown } from '../../../utils/vehiclePricing';

const EditVehicleModal = ({ vehicle, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    brand: vehicle.brand || '',
    model: vehicle.model || '',
    year: vehicle.year || new Date().getFullYear(),
    plateNumber: vehicle.plateNumber || '',
    capacity: vehicle.capacity || '',
    kmRate: vehicle.kmRate || 25, // Euro cinsinden
    color: vehicle.color || '',
    fuelType: vehicle.fuelType || 'benzin',
    transmission: vehicle.transmission || 'otomatik',
    type: vehicle.type || 'sedan',
    imageUrl: vehicle.imageUrl || '',
    features: vehicle.features || [],
    description: vehicle.description || '',
    // Yeni dinamik fiyatlandırma sistemi
    priceRanges: vehicle.pricing && vehicle.pricing.ranges ? 
      vehicle.pricing.ranges.map(range => ({
        minKm: range.from,
        maxKm: range.to,
        fixedPrice: range.isFixed ? range.price : 0,
        pricePerKm: !range.isFixed ? range.price : 0
      })) : [
        { minKm: 1, maxKm: 20, fixedPrice: 25, pricePerKm: 0 },
        { minKm: 20, maxKm: 40, fixedPrice: 0, pricePerKm: 1.5 },
        { minKm: 40, maxKm: 80, fixedPrice: 0, pricePerKm: 1 },
        { minKm: 80, maxKm: 150, fixedPrice: 0, pricePerKm: 0.8 }
      ]
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

  // Form güncelleme
  const updateFormData = (field, value) => {
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

  // Fiyat aralığı ekleme
  const addPriceRange = () => {
    setFormData(prev => ({
      ...prev,
      priceRanges: [...prev.priceRanges, {
        minKm: prev.priceRanges.length > 0 ? prev.priceRanges[prev.priceRanges.length - 1].maxKm : 0,
        maxKm: prev.priceRanges.length > 0 ? prev.priceRanges[prev.priceRanges.length - 1].maxKm + 20 : 20,
        fixedPrice: 0,
        pricePerKm: 1.0
      }]
    }));
  };

  // Fiyat aralığı kaldırma
  const removePriceRange = (index) => {
    setFormData(prev => ({
      ...prev,
      priceRanges: prev.priceRanges.filter((_, i) => i !== index)
    }));
  };

  // Fiyat aralığı güncelleme
  const updatePriceRange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      priceRanges: prev.priceRanges.map((range, i) => 
        i === index ? { ...range, [field]: value } : range
      )
    }));
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

    // Temel alanlar
    if (!formData.brand.trim()) newErrors.brand = 'Marka gerekli';
    if (!formData.model.trim()) newErrors.model = 'Model gerekli';
    if (!formData.plateNumber.trim()) newErrors.plateNumber = 'Plaka gerekli';
    if (!formData.capacity || formData.capacity < 1) newErrors.capacity = 'Kapasite gerekli';
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
        kmRate: parseFloat(formData.kmRate || 25), // Backward compatibility
        year: parseInt(formData.year),
        plateNumber: formData.plateNumber.toUpperCase().replace(/\s/g, ''),
        brand: formData.brand.trim(),
        model: formData.model.trim(),
        color: formData.color.trim(),
        // Yeni dinamik fiyatlandırma sistemi
        pricing: {
          ranges: formData.priceRanges.map(range => ({
            from: parseInt(range.minKm),
            to: parseInt(range.maxKm),
            price: range.fixedPrice > 0 ? parseFloat(range.fixedPrice) : parseFloat(range.pricePerKm),
            isFixed: range.fixedPrice > 0
          }))
        }
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
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Araç Bilgileri */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-600" />
              Araç Bilgileri
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marka *
                </label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => updateFormData('brand', e.target.value)}
                  className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.brand ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Mercedes, BMW, Ford..."
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
                  Model *
                </label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => updateFormData('model', e.target.value)}
                  className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.model ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="E-Class, 3 Series, Focus..."
                />
                {errors.model && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.model}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Yıl
                </label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) => updateFormData('year', parseInt(e.target.value))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="1990"
                  max={new Date().getFullYear() + 1}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plaka *
                </label>
                <input
                  type="text"
                  value={formData.plateNumber}
                  onChange={(e) => updateFormData('plateNumber', e.target.value.toUpperCase())}
                  className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
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
                  Kapasite *
                </label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => updateFormData('capacity', parseInt(e.target.value))}
                  className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.capacity ? 'border-red-300' : 'border-gray-300'
                  }`}
                  min="1"
                  max="55"
                  placeholder="4"
                />
                {errors.capacity && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.capacity}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Teknik Detaylar */}
          <div className="space-y-4">
            {/* Dinamik Fiyatlandırma Bölümü */}
            <div className="bg-gray-50 p-4 rounded-lg border">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-medium text-gray-900">Dinamik Fiyatlandırma</h4>
                <button
                  type="button"
                  onClick={addPriceRange}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Aralık Ekle
                </button>
              </div>

              <div className="space-y-3">
                {formData.priceRanges.map((range, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                    <div className="flex-1 grid grid-cols-4 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Min KM
                        </label>
                        <input
                          type="number"
                          value={range.minKm}
                          onChange={(e) => updatePriceRange(index, 'minKm', parseInt(e.target.value) || 0)}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Max KM
                        </label>
                        <input
                          type="number"
                          value={range.maxKm}
                          onChange={(e) => updatePriceRange(index, 'maxKm', parseInt(e.target.value) || 0)}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Sabit Fiyat (€)
                        </label>
                        <input
                          type="number"
                          value={range.fixedPrice}
                          onChange={(e) => updatePriceRange(index, 'fixedPrice', parseFloat(e.target.value) || 0)}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          KM Oranı (€)
                        </label>
                        <input
                          type="number"
                          value={range.pricePerKm}
                          onChange={(e) => updatePriceRange(index, 'pricePerKm', parseFloat(e.target.value) || 0)}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                    {formData.priceRanges.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePriceRange(index)}
                        className="flex items-center justify-center w-8 h-8 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Fiyat Önizlemesi */}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <h5 className="text-sm font-medium text-blue-900 mb-2">Fiyat Önizlemesi (35 KM)</h5>
                <div className="text-sm text-blue-800">
                  Örnek hesaplama: 35 KM mesafe için toplam maliyet hesaplanacak
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Yakıt Türü
                </label>
                <select
                  value={formData.fuelType}
                  onChange={(e) => updateFormData('fuelType', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="benzin">Benzin</option>
                  <option value="dizel">Dizel</option>
                  <option value="elektrik">Elektrik</option>
                  <option value="hibrit">Hibrit</option>
                  <option value="lpg">LPG</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vites
                </label>
                <select
                  value={formData.transmission}
                  onChange={(e) => updateFormData('transmission', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="otomatik">Otomatik</option>
                  <option value="manuel">Manuel</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Renk *
                </label>
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => updateFormData('color', e.target.value)}
                  className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.color ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Siyah, Beyaz, Gri..."
                />
                {errors.color && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.color}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Araç Tipi
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => updateFormData('type', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="sedan">Sedan</option>
                  <option value="suv">SUV</option>
                  <option value="minivan">Minivan</option>
                  <option value="luxury">Lüks Araç</option>
                  <option value="bus">Otobüs</option>
                </select>
              </div>
            </div>
          </div>

          {/* Özellikler */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Araç Özellikleri</h3>
            <div className="grid grid-cols-3 gap-3">
              {availableFeatures.map(feature => (
                <label key={feature} className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={formData.features.includes(feature)}
                    onChange={() => handleFeatureToggle(feature)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">{feature}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Açıklama */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Açıklama
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => updateFormData('description', e.target.value)}
              rows={3}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Araç hakkında ek bilgiler..."
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
