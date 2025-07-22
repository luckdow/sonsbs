import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Car, Save, Upload, AlertCircle, Calculator, Info, Plus, Trash2, Settings, Palette, Zap } from 'lucide-react';
import { getDefaultPricingForType, generatePricingExample, createCustomPricing, validatePricing } from '../../../utils/vehiclePricing';

const AddVehicleModal = ({ onClose, onSubmit }) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    plateNumber: '',
    capacity: '',
    kmRate: 25, // Backward compatibility (euro cinsinden)
    color: '',
    fuelType: 'benzin',
    transmission: 'otomatik',
    type: 'sedan',
    imageUrl: '',
    features: [],
    description: '',
    // Yeni dinamik fiyatlandırma
    pricing: {
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

  // Sekme menüsü
  const tabs = [
    { id: 'basic', label: 'Temel Bilgiler', icon: Car },
    { id: 'technical', label: 'Teknik Detaylar', icon: Settings },
    { id: 'pricing', label: 'Fiyatlandırma', icon: Calculator },
    { id: 'features', label: 'Özellikler', icon: Zap }
  ];

  // Araç tipi değiştiğinde varsayılan fiyatları güncelle
  useEffect(() => {
    const defaultPricing = getDefaultPricingForType(formData.type);
    setFormData(prev => ({
      ...prev,
      pricing: defaultPricing
    }));
  }, [formData.type]);

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

  const handleRangeChange = (index, field, value) => {
    const newValue = field === 'isFixed' ? value : parseFloat(value) || 0;
    
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
    if (!formData.capacity || formData.capacity < 1) newErrors.capacity = 'Geçerli kapasite gerekli';
    if (!formData.color.trim()) newErrors.color = 'Renk gerekli';

    // Dinamik fiyatlandırma validasyonu
    const pricingValidation = validatePricing(formData.pricing);
    if (!pricingValidation.isValid) {
      pricingValidation.errors.forEach((error, index) => {
        newErrors[`pricing.ranges.${index}`] = error;
      });
    }

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
        color: formData.color.trim(),
        // Yeni dinamik fiyatlandırma sistemi
        pricing: createCustomPricing(formData.pricing.ranges)
      };

      const success = await onSubmit(vehicleData);
      
      if (success) {
        onClose();
      }
    } catch (error) {
      console.error('Araç eklenirken hata:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Sekme içeriği render fonksiyonları
  const renderBasicInfo = () => (
    <div className="space-y-4">
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
  );

  const renderTechnicalDetails = () => (
    <div className="space-y-4">
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
    </div>
  );

  const renderPricing = () => (
    <div className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-lg border">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-medium text-gray-900">Dinamik Fiyatlandırma Sistemi (EUR)</h4>
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
          {formData.pricing.ranges.map((range, index) => (
            <div key={index} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
              <div className="flex-1 grid grid-cols-4 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min KM
                  </label>
                  <input
                    type="number"
                    value={range.from}
                    onChange={(e) => handleRangeChange(index, 'from', parseInt(e.target.value) || 0)}
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
                    value={range.to}
                    onChange={(e) => handleRangeChange(index, 'to', parseInt(e.target.value) || 0)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fiyat (€)
                  </label>
                  <input
                    type="number"
                    value={range.price}
                    onChange={(e) => handleRangeChange(index, 'price', parseFloat(e.target.value) || 0)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="flex items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={range.isFixed}
                      onChange={(e) => handleRangeChange(index, 'isFixed', e.target.checked)}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Sabit Fiyat</span>
                  </label>
                </div>
              </div>
              {formData.pricing.ranges.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePriceRange(index)}
                  className="flex items-center justify-center w-8 h-8 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md"
                  title="Aralığı Sil"
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
            {(() => {
              const example = generatePricingExample(formData.type, 35);
              return `Toplam: €${example.totalPrice}`;
            })()}
          </div>
        </div>
      </div>
    </div>
  );

  const renderFeatures = () => (
    <div className="space-y-4">
      <div>
        <h4 className="text-lg font-medium text-gray-900 mb-4">Araç Özellikleri</h4>
        <div className="grid grid-cols-2 gap-3">
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
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return renderBasicInfo();
      case 'technical':
        return renderTechnicalDetails();
      case 'pricing':
        return renderPricing();
      case 'features':
        return renderFeatures();
      default:
        return renderBasicInfo();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Car className="w-6 h-6 text-blue-600" />
            Yeni Araç Ekle
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 bg-gray-50">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-500 text-blue-600 bg-white'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6">
            {renderTabContent()}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
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
                  Ekleniyor...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Araç Ekle
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddVehicleModal;
