import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Settings, Save, Plus, Trash2, Shield } from 'lucide-react';

const VehicleFeaturesModal = ({ vehicle, onClose, onUpdate }) => {
  const [features, setFeatures] = useState(vehicle.features || []);
  const [newFeature, setNewFeature] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Önceden tanımlı özellikler
  const predefinedFeatures = [
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
    'Kamera Sistemi',
    'Elektrikli Kapılar',
    'Masaj Koltuğu',
    'Mini Bar',
    'Gazete/Dergi',
    'Havlu Hizmeti',
    'Şemsiye',
    'Telefon Şarj Kablosu',
    'Tablet/iPad',
    'Çocuk Oyuncağı',
    'Battaniye',
    'Maske/Dezenfektan',
    'VIP Lounge Erişim'
  ];

  const addFeature = (feature) => {
    if (feature.trim() && !features.includes(feature.trim())) {
      setFeatures([...features, feature.trim()]);
      setNewFeature('');
    }
  };

  const removeFeature = (featureToRemove) => {
    setFeatures(features.filter(f => f !== featureToRemove));
  };

  const addPredefinedFeature = (feature) => {
    if (!features.includes(feature)) {
      setFeatures([...features, feature]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const success = await onUpdate(vehicle.id, {
        ...vehicle,
        features: features
      });

      if (success) {
        onClose();
      }
    } catch (error) {
      console.error('Özellikler güncellenirken hata:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addFeature(newFeature);
    }
  };

  // Henüz eklenmemiş önceden tanımlı özellikler
  const availablePredefinedFeatures = predefinedFeatures.filter(
    feature => !features.includes(feature)
  );

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
            <Settings className="w-6 h-6 text-blue-600" />
            Araç Özelliklerini Yönet
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Araç Bilgileri */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">
              {vehicle.brand} {vehicle.model}
            </h3>
            <p className="text-sm text-blue-700">
              {vehicle.year} • {vehicle.plateNumber} • {vehicle.capacity} Kişi
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Mevcut Özellikler */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Mevcut Özellikler ({features.length})
                </h3>
                
                {features.length > 0 ? (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-gray-900">{feature}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFeature(feature)}
                          className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Henüz özellik eklenmemiş</p>
                  </div>
                )}
              </div>

              {/* Özellik Ekleme */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Özellik Ekle
                </h3>

                {/* Yeni Özellik Girişi */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Özel Özellik Ekle
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Özellik adı girin..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => addFeature(newFeature)}
                      disabled={!newFeature.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Önceden Tanımlı Özellikler */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hazır Özellikler
                  </label>
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {availablePredefinedFeatures.map((feature) => (
                      <button
                        key={feature}
                        type="button"
                        onClick={() => addPredefinedFeature(feature)}
                        className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Plus className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-gray-900">{feature}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                  {availablePredefinedFeatures.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">
                      Tüm hazır özellikler eklendi
                    </p>
                  )}
                </div>
              </div>
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
                    Kaydediliyor...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Özellikleri Kaydet
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default VehicleFeaturesModal;
