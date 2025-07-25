import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Car, Save, Upload, AlertCircle, Calculator, Info, Plus, Trash2, Settings, DollarSign } from 'lucide-react';
import { getDefaultPricingForType, generatePricingExample, createCustomPricing, validatePricing } from '../../../utils/vehiclePricing';

const EditVehicleModal = ({ vehicle, onClose, onSubmit }) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({
    brand: vehicle?.brand || '',
    model: vehicle?.model || '',
    year: vehicle?.year || new Date().getFullYear(),
    plateNumber: vehicle?.plateNumber || '',
    capacity: vehicle?.capacity || '',
    kmRate: vehicle?.kmRate || 25, // Backward compatibility (euro cinsinden)
    color: vehicle?.color || '',
    fuelType: vehicle?.fuelType || 'benzin',
    transmission: vehicle?.transmission || 'otomatik',
    type: vehicle?.type || 'sedan',
    imageUrl: vehicle?.imageUrl || '',
    features: vehicle?.features || [],
    description: vehicle?.description || '',
    // Yeni dinamik fiyatlandırma
    pricing: vehicle?.pricing || {
      ranges: [
        { from: 1, to: 20, price: 25, isFixed: true }, // 1-20km sabit 25€
        { from: 20, to: 40, price: 1.5, isFixed: false }, // 20-40km arası 1.5€/km
        { from: 40, to: 80, price: 1, isFixed: false }, // 40-80km arası 1€/km  
        { from: 80, to: 150, price: 0.8, isFixed: false } // 80-150km arası 0.8€/km
      ]
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPricingExample, setShowPricingExample] = useState(false);

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

  // Araç prop'u değiştiğinde formData'yı güncelle
  useEffect(() => {
    if (vehicle) {
      setFormData({
        brand: vehicle.brand || '',
        model: vehicle.model || '',
        year: vehicle.year || new Date().getFullYear(),
        plateNumber: vehicle.plateNumber || '',
        capacity: vehicle.capacity || '',
        kmRate: vehicle.kmRate || 25,
        color: vehicle.color || '',
        fuelType: vehicle.fuelType || 'benzin',
        transmission: vehicle.transmission || 'otomatik',
        type: vehicle.type || 'sedan',
        imageUrl: vehicle.imageUrl || '',
        features: vehicle.features || [],
        description: vehicle.description || '',
        pricing: vehicle.pricing || {
          ranges: [
            { from: 1, to: 20, price: 25, isFixed: true },
            { from: 20, to: 40, price: 1.5, isFixed: false },
            { from: 40, to: 80, price: 1, isFixed: false },
            { from: 80, to: 150, price: 0.8, isFixed: false }
          ]
        }
      });
    }
  }, [vehicle]);

  // Araç tipi değiştiğinde varsayılan fiyatları güncelle (sadece yeni araç eklerken)
  useEffect(() => {
    // Bu useEffect'i sadece araç tipini manuel değiştirdiğimizde çalıştır
    // Mevcut araç düzenlerken varsayılan fiyatları yükleme
    if (!vehicle?.id) {
      const defaultPricing = getDefaultPricingForType(formData.type);
      setFormData(prev => ({
        ...prev,
        pricing: defaultPricing,
        kmRate: defaultPricing.ranges?.[1]?.price || 25
      }));
    }
  }, [formData.type, vehicle?.id]);

  const handleInputChange = (field, value) => {
    // Sayısal alanlar için özel işlem
    let processedValue = value;
    
    if (['capacity', 'year', 'kmRate'].includes(field)) {
      // Boş string ise string olarak bırak, sayı ise parseFloat/parseInt yap
      if (value === '') {
        processedValue = '';
      } else if (!isNaN(parseFloat(value))) {
        processedValue = field === 'year' ? parseInt(value) : parseFloat(value);
      } else {
        processedValue = value; // Geçersiz giriş için mevcut değeri koru
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: processedValue
    }));
    
    // Hata temizle
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Fiyat aralığı güncelleme
  const handleRangeChange = (index, field, value) => {
    let newValue;
    
    if (field === 'isFixed') {
      newValue = value;
    } else {
      // Boş string ise string olarak bırak, sayı ise parseFloat yap
      newValue = value === '' ? '' : (isNaN(parseFloat(value)) ? value : parseFloat(value));
    }
    
    setFormData(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        ranges: prev.pricing.ranges.map((range, i) => 
          i === index ? { ...range, [field]: newValue } : range
        )
      }
    }));

    // Hata temizle
    if (errors[`pricing.ranges.${index}.${field}`]) {
      setErrors(prev => ({
        ...prev,
        [`pricing.ranges.${index}.${field}`]: ''
      }));
    }
  };

  // Yeni aralık ekleme
  const addPriceRange = () => {
    const lastRange = formData.pricing.ranges[formData.pricing.ranges.length - 1];
    const newFrom = lastRange ? lastRange.to : 1;
    
    setFormData(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        ranges: [...prev.pricing.ranges, {
          from: newFrom,
          to: newFrom + 20,
          price: 1,
          isFixed: false
        }]
      }
    }));
  };

  // Aralık silme
  const removePriceRange = (index) => {
    if (formData.pricing.ranges.length > 1) {
      setFormData(prev => ({
        ...prev,
        pricing: {
          ...prev.pricing,
          ranges: prev.pricing.ranges.filter((_, i) => i !== index)
        }
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
    if (!formData.capacity || formData.capacity === '' || formData.capacity < 1) newErrors.capacity = 'Geçerli kapasite gerekli';
    if (!formData.color.trim()) newErrors.color = 'Renk gerekli';

    // Dinamik fiyatlandırma validasyonu
    const pricingValidation = validatePricing(formData.pricing);
    if (!pricingValidation.isValid) {
      pricingValidation.errors.forEach((error, index) => {
        newErrors[`pricing.general.${index}`] = error;
      });
    }

    // Her aralık için validasyon
    formData.pricing.ranges.forEach((range, index) => {
      if (range.from === '' || range.to === '' || range.from >= range.to) {
        newErrors[`pricing.ranges.${index}.to`] = 'Bitiş km başlangıçtan büyük olmalı';
      }
      if (range.price === '' || range.price <= 0) {
        newErrors[`pricing.ranges.${index}.price`] = 'Fiyat 0\'dan büyük olmalı';
      }
    });

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
        capacity: formData.capacity === '' ? 0 : parseInt(formData.capacity),
        kmRate: formData.kmRate === '' ? 25 : parseFloat(formData.kmRate), // Backward compatibility
        year: formData.year === '' ? new Date().getFullYear() : parseInt(formData.year),
        plateNumber: formData.plateNumber.toUpperCase().replace(/\s/g, ''),
        brand: formData.brand.trim(),
        model: formData.model.trim(),
        color: formData.color.trim(),
        // Yeni dinamik fiyatlandırma sistemi
        pricing: {
          ranges: formData.pricing.ranges.map(range => ({
            from: parseInt(range.from),
            to: parseInt(range.to),
            price: parseFloat(range.price),
            isFixed: Boolean(range.isFixed)
          }))
        }
      };

      const success = await onSubmit(vehicle.id, vehicleData);
      
      if (success) {
        onClose();
      }
    } catch (error) {
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

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              type="button"
              onClick={() => setActiveTab('basic')}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'basic'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Info className="w-4 h-4" />
              Temel Bilgiler
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('pricing')}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'pricing'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              Fiyatlandırma
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('features')}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'features'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Settings className="w-4 h-4" />
              Araç Özellikleri
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Temel Bilgiler Sekmesi */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Temel Bilgiler */}
                <div className="space-y-4">
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
            </div>
          )}

          {/* Fiyatlandırma Sekmesi */}
          {activeTab === 'pricing' && (
            <div className="space-y-6">
              {/* Dinamik Fiyatlandırma Sistemi */}
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-green-600" />
                    Dinamik Fiyatlandırma Sistemi (EUR)
                  </h3>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={addPriceRange}
                      className="flex items-center gap-1 text-sm text-green-600 hover:text-green-800 px-2 py-1 rounded border border-green-300 hover:bg-green-100"
                    >
                      <Plus className="w-4 h-4" />
                      Aralık Ekle
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowPricingExample(!showPricingExample)}
                      className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                    >
                      <Info className="w-4 h-4" />
                      Örnek Hesaplama
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {formData.pricing.ranges.map((range, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-end bg-white p-3 rounded border">
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Başlangıç (km)
                        </label>
                        <input
                          type="number"
                          value={range.from}
                          onChange={(e) => handleRangeChange(index, 'from', e.target.value)}
                          min="0"
                          className="w-full px-2 py-1 text-sm border rounded"
                          placeholder="1"
                        />
                      </div>
                      
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Bitiş (km)
                        </label>
                        <input
                          type="number"
                          value={range.to}
                          onChange={(e) => handleRangeChange(index, 'to', e.target.value)}
                          min="1"
                          className="w-full px-2 py-1 text-sm border rounded"
                          placeholder="20"
                        />
                      </div>
                      
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Fiyat (€)
                        </label>
                        <input
                          type="number"
                          value={range.price}
                          onChange={(e) => handleRangeChange(index, 'price', e.target.value)}
                          min="0"
                          step="0.1"
                          className="w-full px-2 py-1 text-sm border rounded"
                          placeholder="25"
                        />
                      </div>
                      
                      <div className="col-span-3">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Fiyat Tipi
                        </label>
                        <select
                          value={range.isFixed ? 'fixed' : 'per_km'}
                          onChange={(e) => handleRangeChange(index, 'isFixed', e.target.value === 'fixed')}
                          className="w-full px-2 py-1 text-sm border rounded"
                        >
                          <option value="fixed">Sabit Fiyat</option>
                          <option value="per_km">Km Başına</option>
                        </select>
                      </div>
                      
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Önizleme
                        </label>
                        <div className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                          {range.from}-{range.to}km: {range.isFixed ? `€${range.price}` : `€${range.price}/km`}
                        </div>
                      </div>
                      
                      <div className="col-span-1 flex justify-center">
                        {formData.pricing.ranges.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removePriceRange(index)}
                            className="text-red-500 hover:text-red-700 p-1"
                            title="Aralığı Sil"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Genel validasyon hataları */}
                {Object.keys(errors).filter(key => key.startsWith('pricing.general')).map(key => (
                  <p key={key} className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors[key]}
                  </p>
                ))}

                {/* Örnek hesaplama */}
                {showPricingExample && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-900 mb-2">Örnek Hesaplama: 35km mesafe</h4>
                    <div className="text-sm text-blue-800">
                      <p>• 1-20km: €25 (sabit)</p>
                      <p>• 20-35km: 15km × €1.5 = €22.5</p>
                      <p className="font-medium border-t pt-1 mt-1">Toplam: €47.5 → €48 (yuvarlama)</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Araç Özellikleri Sekmesi */}
          {activeTab === 'features' && (
            <div className="space-y-6">
              {/* Özellikler */}
              <div>
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
            </div>
          )}

          {/* Butonlar - Tüm sekmelerde göster */}
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
