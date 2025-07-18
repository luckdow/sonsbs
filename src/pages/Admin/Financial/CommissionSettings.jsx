import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Percent,
  Save,
  Users,
  DollarSign,
  Car
} from 'lucide-react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';

const CommissionSettings = () => {
  const [drivers, setDrivers] = useState([]);
  const [globalSettings, setGlobalSettings] = useState({
    defaultCommissionRate: 15,
    cashCommissionRate: 20,
    minimumCommission: 50,
    maxCommissionRate: 30
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
        ...doc.data(),
        commissionRate: doc.data().commissionRate || globalSettings.defaultCommissionRate
      }));
      setDrivers(driversData);

      // Global ayarları getir (gerçek implementasyonda ayrı bir collection'dan gelecek)
      // Şimdilik varsayılan değerleri kullanıyoruz

    } catch (error) {
      console.error('Veri getirme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateDriverCommission = async (driverId, newRate) => {
    try {
      await updateDoc(doc(db, 'drivers', driverId), {
        commissionRate: parseFloat(newRate)
      });
      
      setDrivers(prev => prev.map(driver => 
        driver.id === driverId 
          ? { ...driver, commissionRate: parseFloat(newRate) }
          : driver
      ));
      
    } catch (error) {
      console.error('Komisyon güncelleme hatası:', error);
      alert('Komisyon güncellenirken hata oluştu');
    }
  };

  const saveGlobalSettings = async () => {
    try {
      setSaving(true);
      
      // Global ayarları kaydet (gerçek implementasyonda ayrı bir doc'a kaydedilecek)
      // Şimdilik console'a log atıyoruz
      console.log('Global ayarlar kaydedildi:', globalSettings);
      
      alert('Genel ayarlar başarıyla kaydedildi');
    } catch (error) {
      console.error('Ayar kaydetme hatası:', error);
      alert('Ayarlar kaydedilirken hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  const applyGlobalRateToAll = async () => {
    if (!confirm('Varsayılan komisyon oranını tüm şoförlere uygulamak istediğinizden emin misiniz?')) {
      return;
    }

    try {
      setSaving(true);
      
      // Tüm şoförlere varsayılan oranı uygula
      const updatePromises = drivers.map(driver => 
        updateDoc(doc(db, 'drivers', driver.id), {
          commissionRate: globalSettings.defaultCommissionRate
        })
      );
      
      await Promise.all(updatePromises);
      
      setDrivers(prev => prev.map(driver => ({
        ...driver,
        commissionRate: globalSettings.defaultCommissionRate
      })));
      
      alert('Varsayılan komisyon oranı tüm şoförlere uygulandı');
    } catch (error) {
      console.error('Toplu güncelleme hatası:', error);
      alert('Toplu güncelleme sırasında hata oluştu');
    } finally {
      setSaving(false);
    }
  };

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
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Komisyon Ayarları</h2>
        <p className="text-gray-600">Şoför komisyon oranlarını ve genel ayarları yönetin</p>
      </div>

      {/* Genel Ayarlar */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Settings className="w-6 h-6 text-green-600" />
          <h3 className="text-xl font-bold text-gray-800">Genel Komisyon Ayarları</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Varsayılan Komisyon Oranı (%)
            </label>
            <div className="relative">
              <input
                type="number"
                value={globalSettings.defaultCommissionRate}
                onChange={(e) => setGlobalSettings(prev => ({
                  ...prev,
                  defaultCommissionRate: parseFloat(e.target.value) || 0
                }))}
                className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                min="0"
                max="50"
                step="0.5"
              />
              <Percent className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nakit Ödeme Komisyon Oranı (%)
            </label>
            <div className="relative">
              <input
                type="number"
                value={globalSettings.cashCommissionRate}
                onChange={(e) => setGlobalSettings(prev => ({
                  ...prev,
                  cashCommissionRate: parseFloat(e.target.value) || 0
                }))}
                className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                min="0"
                max="50"
                step="0.5"
              />
              <Percent className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Komisyon (₺)
            </label>
            <div className="relative">
              <input
                type="number"
                value={globalSettings.minimumCommission}
                onChange={(e) => setGlobalSettings(prev => ({
                  ...prev,
                  minimumCommission: parseFloat(e.target.value) || 0
                }))}
                className="w-full px-3 py-2 pl-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                min="0"
                step="10"
              />
              <DollarSign className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maksimum Komisyon Oranı (%)
            </label>
            <div className="relative">
              <input
                type="number"
                value={globalSettings.maxCommissionRate}
                onChange={(e) => setGlobalSettings(prev => ({
                  ...prev,
                  maxCommissionRate: parseFloat(e.target.value) || 0
                }))}
                className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                min="0"
                max="50"
                step="0.5"
              />
              <Percent className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={saveGlobalSettings}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Kaydediliyor...' : 'Genel Ayarları Kaydet'}
          </button>
          
          <button
            onClick={applyGlobalRateToAll}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Users className="w-4 h-4" />
            Tüm Şoförlere Uygula
          </button>
        </div>
      </div>

      {/* Şoför Bazlı Komisyon Ayarları */}
      <div className="bg-white rounded-xl shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Car className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-800">Şoför Bazlı Komisyon Oranları</h3>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {drivers.map(driver => (
              <motion.div
                key={driver.id}
                whileHover={{ scale: 1.01 }}
                className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">
                        {driver.firstName} {driver.lastName}
                      </h4>
                      <p className="text-sm text-gray-600">{driver.phone}</p>
                    </div>
                  </div>
                  
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    driver.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {driver.status === 'active' ? 'Aktif' : 'Pasif'}
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Komisyon Oranı (%)
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <input
                          type="number"
                          value={driver.commissionRate}
                          onChange={(e) => updateDriverCommission(driver.id, e.target.value)}
                          className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          min="0"
                          max={globalSettings.maxCommissionRate}
                          step="0.5"
                        />
                        <Percent className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm text-gray-600">1000₺ yolculukta</p>
                        <p className="font-bold text-green-600">
                          ₺{(1000 * driver.commissionRate / 100).toFixed(0)} komisyon
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-gray-50 p-2 rounded">
                      <p className="text-gray-600">Şoför Kazancı</p>
                      <p className="font-bold text-gray-800">
                        ₺{(1000 - (1000 * driver.commissionRate / 100)).toFixed(0)}
                      </p>
                    </div>
                    <div className="bg-blue-50 p-2 rounded">
                      <p className="text-blue-600">Komisyon Oranı</p>
                      <p className="font-bold text-blue-800">%{driver.commissionRate}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Komisyon Hesaplama Örnekleri */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4">💡 Komisyon Hesaplama Örnekleri</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">Kredi Kartı Ödeme</h4>
            <div className="space-y-1 text-sm">
              <p>Yolculuk: 500₺</p>
              <p>Komisyon (%{globalSettings.defaultCommissionRate}): {(500 * globalSettings.defaultCommissionRate / 100).toFixed(0)}₺</p>
              <p className="font-bold text-green-600">
                Şoför Kazancı: {(500 - (500 * globalSettings.defaultCommissionRate / 100)).toFixed(0)}₺
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">Nakit Ödeme</h4>
            <div className="space-y-1 text-sm">
              <p>Yolculuk: 500₺</p>
              <p>Komisyon (%{globalSettings.cashCommissionRate}): {(500 * globalSettings.cashCommissionRate / 100).toFixed(0)}₺</p>
              <p className="font-bold text-yellow-600">
                Şoför Borcu: {(500 * globalSettings.cashCommissionRate / 100).toFixed(0)}₺
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">Minimum Komisyon</h4>
            <div className="space-y-1 text-sm">
              <p>Yolculuk: 200₺</p>
              <p>Hesaplanan (%{globalSettings.defaultCommissionRate}): {(200 * globalSettings.defaultCommissionRate / 100).toFixed(0)}₺</p>
              <p className="font-bold text-blue-600">
                Uygulanan: {Math.max(200 * globalSettings.defaultCommissionRate / 100, globalSettings.minimumCommission).toFixed(0)}₺
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommissionSettings;
