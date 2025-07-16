import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Save,
  Globe,
  Bell,
  Shield,
  CreditCard,
  MapPin,
  Mail,
  Phone,
  Clock,
  DollarSign,
  Percent,
  Upload,
  Image,
  Key,
  Database,
  Server,
  Smartphone
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const SettingsPage = () => {
  const { state, showNotification } = useApp();
  
  const [settings, setSettings] = useState({
    // Company Information
    companyName: 'SBS Transfer',
    companyEmail: 'info@sbstransfer.com',
    companyPhone: '+90 555 123 45 67',
    companyAddress: 'İstanbul, Türkiye',
    companyDescription: 'Premium transfer hizmetleri',
    
    // Business Settings
    baseFare: 50,
    perKmRate: 3.5,
    minimumFare: 30,
    cancellationFee: 15,
    waitingTimeRate: 1.5,
    
    // Commission Rates
    defaultDriverCommission: 10,
    adminCommission: 5,
    platformFee: 2.5,
    
    // Service Areas
    serviceAreas: ['İstanbul', 'Ankara', 'İzmir', 'Antalya', 'Bursa'],
    
    // Operating Hours
    operatingHours: {
      monday: { start: '06:00', end: '24:00', active: true },
      tuesday: { start: '06:00', end: '24:00', active: true },
      wednesday: { start: '06:00', end: '24:00', active: true },
      thursday: { start: '06:00', end: '24:00', active: true },
      friday: { start: '06:00', end: '24:00', active: true },
      saturday: { start: '06:00', end: '24:00', active: true },
      sunday: { start: '08:00', end: '22:00', active: true }
    },
    
    // Notification Settings
    emailNotifications: {
      newReservation: true,
      reservationUpdate: true,
      driverAssignment: true,
      paymentReceived: true,
      cancellation: true
    },
    
    smsNotifications: {
      reservationConfirmation: true,
      driverInfo: true,
      paymentReminder: false,
      promotions: false
    },
    
    // Payment Settings
    paymentMethods: {
      cash: true,
      creditCard: true,
      bankTransfer: true,
      paytr: true
    },
    
    // API Keys (masked for security)
    apiKeys: {
      googleMaps: 'AIza**********************',
      paytr: 'paytr_**********************',
      firebase: 'firebase_******************',
      sendgrid: 'sg.**********************'
    },
    
    // System Settings
    maintenanceMode: false,
    debugMode: false,
    dataRetention: 365, // days
    backupFrequency: 'daily',
    
    // Mobile App Settings
    appVersion: '1.0.0',
    forceUpdate: false,
    maintenanceMessage: '',
    
    // Terms and Privacy
    termsVersion: '1.0',
    privacyVersion: '1.0',
    lastUpdated: new Date().toISOString()
  });

  const [activeTab, setActiveTab] = useState('company');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Load settings from localStorage or API
    const savedSettings = localStorage.getItem('sbsSettings');
    if (savedSettings) {
      setSettings(prev => ({ ...prev, ...JSON.parse(savedSettings) }));
    }
  }, []);

  const handleInputChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: typeof prev[section] === 'object' 
        ? { ...prev[section], [field]: value }
        : value
    }));
    setHasChanges(true);
  };

  const handleSimpleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSaveSettings = async () => {
    try {
      // Save to localStorage (in production, this would be an API call)
      localStorage.setItem('sbsSettings', JSON.stringify(settings));
      
      setHasChanges(false);
      showNotification('Ayarlar başarıyla kaydedildi', 'success');
    } catch (error) {
      console.error('Settings save error:', error);
      showNotification('Ayarlar kaydedilirken bir hata oluştu', 'error');
    }
  };

  const tabs = [
    { id: 'company', label: 'Şirket Bilgileri', icon: Globe },
    { id: 'business', label: 'İş Ayarları', icon: DollarSign },
    { id: 'notifications', label: 'Bildirimler', icon: Bell },
    { id: 'payments', label: 'Ödeme', icon: CreditCard },
    { id: 'api', label: 'API Ayarları', icon: Key },
    { id: 'system', label: 'Sistem', icon: Server },
    { id: 'mobile', label: 'Mobil Uygulama', icon: Smartphone }
  ];

  const dayNames = {
    monday: 'Pazartesi',
    tuesday: 'Salı',
    wednesday: 'Çarşamba',
    thursday: 'Perşembe',
    friday: 'Cuma',
    saturday: 'Cumartesi',
    sunday: 'Pazar'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sistem Ayarları</h1>
          <p className="text-gray-600">Platform ayarlarını yönetin</p>
        </div>
        {hasChanges && (
          <button
            onClick={handleSaveSettings}
            className="btn btn-primary"
          >
            <Save className="w-4 h-4 mr-2" />
            Değişiklikleri Kaydet
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="card-body p-0">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-left text-sm font-medium rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className="w-4 h-4 mr-3" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="card"
          >
            <div className="card-body">
              {/* Company Information */}
              {activeTab === 'company' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Şirket Bilgileri</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="label">Şirket Adı</label>
                      <input
                        type="text"
                        className="input"
                        value={settings.companyName}
                        onChange={(e) => handleSimpleChange('companyName', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="label">Email</label>
                      <input
                        type="email"
                        className="input"
                        value={settings.companyEmail}
                        onChange={(e) => handleSimpleChange('companyEmail', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="label">Telefon</label>
                      <input
                        type="tel"
                        className="input"
                        value={settings.companyPhone}
                        onChange={(e) => handleSimpleChange('companyPhone', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="label">Adres</label>
                      <input
                        type="text"
                        className="input"
                        value={settings.companyAddress}
                        onChange={(e) => handleSimpleChange('companyAddress', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="label">Şirket Açıklaması</label>
                    <textarea
                      className="input"
                      rows="3"
                      value={settings.companyDescription}
                      onChange={(e) => handleSimpleChange('companyDescription', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="label">Hizmet Bölgeleri</label>
                    <div className="space-y-2">
                      {settings.serviceAreas.map((area, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="text"
                            className="input flex-1"
                            value={area}
                            onChange={(e) => {
                              const newAreas = [...settings.serviceAreas];
                              newAreas[index] = e.target.value;
                              handleSimpleChange('serviceAreas', newAreas);
                            }}
                          />
                          <button
                            onClick={() => {
                              const newAreas = settings.serviceAreas.filter((_, i) => i !== index);
                              handleSimpleChange('serviceAreas', newAreas);
                            }}
                            className="btn btn-outline text-red-600"
                          >
                            Sil
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          handleSimpleChange('serviceAreas', [...settings.serviceAreas, 'Yeni Bölge']);
                        }}
                        className="btn btn-outline"
                      >
                        Bölge Ekle
                      </button>
                    </div>
                  </div>

                  {/* Operating Hours */}
                  <div>
                    <label className="label">Çalışma Saatleri</label>
                    <div className="space-y-3">
                      {Object.entries(settings.operatingHours).map(([day, hours]) => (
                        <div key={day} className="flex items-center space-x-4 p-3 border rounded-lg">
                          <div className="w-24">
                            <span className="font-medium">{dayNames[day]}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              className="checkbox"
                              checked={hours.active}
                              onChange={(e) => handleInputChange('operatingHours', day, { ...hours, active: e.target.checked })}
                            />
                            <span className="text-sm">Aktif</span>
                          </div>
                          {hours.active && (
                            <>
                              <div className="flex items-center space-x-2">
                                <input
                                  type="time"
                                  className="input w-24"
                                  value={hours.start}
                                  onChange={(e) => handleInputChange('operatingHours', day, { ...hours, start: e.target.value })}
                                />
                                <span>-</span>
                                <input
                                  type="time"
                                  className="input w-24"
                                  value={hours.end}
                                  onChange={(e) => handleInputChange('operatingHours', day, { ...hours, end: e.target.value })}
                                />
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Business Settings */}
              {activeTab === 'business' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">İş Ayarları</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Ücretlendirme</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="label">Başlangıç Ücreti (₺)</label>
                          <input
                            type="number"
                            className="input"
                            step="0.01"
                            value={settings.baseFare}
                            onChange={(e) => handleSimpleChange('baseFare', parseFloat(e.target.value))}
                          />
                        </div>
                        
                        <div>
                          <label className="label">KM Başı Ücret (₺)</label>
                          <input
                            type="number"
                            className="input"
                            step="0.01"
                            value={settings.perKmRate}
                            onChange={(e) => handleSimpleChange('perKmRate', parseFloat(e.target.value))}
                          />
                        </div>
                        
                        <div>
                          <label className="label">Minimum Ücret (₺)</label>
                          <input
                            type="number"
                            className="input"
                            step="0.01"
                            value={settings.minimumFare}
                            onChange={(e) => handleSimpleChange('minimumFare', parseFloat(e.target.value))}
                          />
                        </div>
                        
                        <div>
                          <label className="label">İptal Ücreti (₺)</label>
                          <input
                            type="number"
                            className="input"
                            step="0.01"
                            value={settings.cancellationFee}
                            onChange={(e) => handleSimpleChange('cancellationFee', parseFloat(e.target.value))}
                          />
                        </div>
                        
                        <div>
                          <label className="label">Bekleme Ücreti (₺/dk)</label>
                          <input
                            type="number"
                            className="input"
                            step="0.01"
                            value={settings.waitingTimeRate}
                            onChange={(e) => handleSimpleChange('waitingTimeRate', parseFloat(e.target.value))}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Komisyon Oranları (%)</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="label">Varsayılan Şoför Komisyonu</label>
                          <input
                            type="number"
                            className="input"
                            step="0.1"
                            min="0"
                            max="100"
                            value={settings.defaultDriverCommission}
                            onChange={(e) => handleSimpleChange('defaultDriverCommission', parseFloat(e.target.value))}
                          />
                        </div>
                        
                        <div>
                          <label className="label">Admin Komisyonu</label>
                          <input
                            type="number"
                            className="input"
                            step="0.1"
                            min="0"
                            max="100"
                            value={settings.adminCommission}
                            onChange={(e) => handleSimpleChange('adminCommission', parseFloat(e.target.value))}
                          />
                        </div>
                        
                        <div>
                          <label className="label">Platform Ücreti</label>
                          <input
                            type="number"
                            className="input"
                            step="0.1"
                            min="0"
                            max="100"
                            value={settings.platformFee}
                            onChange={(e) => handleSimpleChange('platformFee', parseFloat(e.target.value))}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notification Settings */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Bildirim Ayarları</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                        <Mail className="w-4 h-4 mr-2" />
                        Email Bildirimleri
                      </h4>
                      <div className="space-y-3">
                        {Object.entries(settings.emailNotifications).map(([key, value]) => (
                          <label key={key} className="flex items-center">
                            <input
                              type="checkbox"
                              className="checkbox mr-3"
                              checked={value}
                              onChange={(e) => handleInputChange('emailNotifications', key, e.target.checked)}
                            />
                            <span className="text-sm capitalize">
                              {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                        <Phone className="w-4 h-4 mr-2" />
                        SMS Bildirimleri
                      </h4>
                      <div className="space-y-3">
                        {Object.entries(settings.smsNotifications).map(([key, value]) => (
                          <label key={key} className="flex items-center">
                            <input
                              type="checkbox"
                              className="checkbox mr-3"
                              checked={value}
                              onChange={(e) => handleInputChange('smsNotifications', key, e.target.checked)}
                            />
                            <span className="text-sm capitalize">
                              {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Settings */}
              {activeTab === 'payments' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Ödeme Ayarları</h3>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Kabul Edilen Ödeme Yöntemleri</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {Object.entries(settings.paymentMethods).map(([key, value]) => (
                        <label key={key} className="flex items-center p-3 border rounded-lg">
                          <input
                            type="checkbox"
                            className="checkbox mr-3"
                            checked={value}
                            onChange={(e) => handleInputChange('paymentMethods', key, e.target.checked)}
                          />
                          <span className="capitalize">
                            {key === 'paytr' ? 'PayTR' : key.replace(/([A-Z])/g, ' $1')}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* API Settings */}
              {activeTab === 'api' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">API Ayarları</h3>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center">
                        <Shield className="w-5 h-5 text-yellow-600 mr-2" />
                        <p className="text-sm text-yellow-800">
                          Güvenlik nedeniyle API anahtarları maskelenmiştir. Yeni anahtar girmek için metin kutusunu temizleyin.
                        </p>
                      </div>
                    </div>
                    
                    {Object.entries(settings.apiKeys).map(([key, value]) => (
                      <div key={key}>
                        <label className="label capitalize">
                          {key === 'paytr' ? 'PayTR API Key' : 
                           key === 'googleMaps' ? 'Google Maps API Key' :
                           `${key} API Key`}
                        </label>
                        <input
                          type="password"
                          className="input"
                          placeholder={value}
                          onChange={(e) => handleInputChange('apiKeys', key, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* System Settings */}
              {activeTab === 'system' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Sistem Ayarları</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Genel Ayarlar</h4>
                      <div className="space-y-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="checkbox mr-3"
                            checked={settings.maintenanceMode}
                            onChange={(e) => handleSimpleChange('maintenanceMode', e.target.checked)}
                          />
                          <span>Bakım Modu</span>
                        </label>
                        
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="checkbox mr-3"
                            checked={settings.debugMode}
                            onChange={(e) => handleSimpleChange('debugMode', e.target.checked)}
                          />
                          <span>Debug Modu</span>
                        </label>
                        
                        <div>
                          <label className="label">Veri Saklama Süresi (gün)</label>
                          <input
                            type="number"
                            className="input"
                            value={settings.dataRetention}
                            onChange={(e) => handleSimpleChange('dataRetention', parseInt(e.target.value))}
                          />
                        </div>
                        
                        <div>
                          <label className="label">Yedekleme Sıklığı</label>
                          <select
                            className="input"
                            value={settings.backupFrequency}
                            onChange={(e) => handleSimpleChange('backupFrequency', e.target.value)}
                          >
                            <option value="daily">Günlük</option>
                            <option value="weekly">Haftalık</option>
                            <option value="monthly">Aylık</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Veritabanı</h4>
                      <div className="space-y-4">
                        <button className="btn btn-outline w-full">
                          <Database className="w-4 h-4 mr-2" />
                          Veritabanı Yedekle
                        </button>
                        
                        <button className="btn btn-outline w-full">
                          <Upload className="w-4 h-4 mr-2" />
                          Veritabanı Geri Yükle
                        </button>
                        
                        <button className="btn btn-outline w-full text-red-600 border-red-200 hover:bg-red-50">
                          <Database className="w-4 h-4 mr-2" />
                          Veritabanını Temizle
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Mobile App Settings */}
              {activeTab === 'mobile' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Mobil Uygulama Ayarları</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Uygulama Versiyonu</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="label">Mevcut Versiyon</label>
                          <input
                            type="text"
                            className="input"
                            value={settings.appVersion}
                            onChange={(e) => handleSimpleChange('appVersion', e.target.value)}
                          />
                        </div>
                        
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="checkbox mr-3"
                            checked={settings.forceUpdate}
                            onChange={(e) => handleSimpleChange('forceUpdate', e.target.checked)}
                          />
                          <span>Zorunlu Güncelleme</span>
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Bakım Mesajı</h4>
                      <textarea
                        className="input"
                        rows="4"
                        placeholder="Bakım modunda gösterilecek mesaj..."
                        value={settings.maintenanceMessage}
                        onChange={(e) => handleSimpleChange('maintenanceMessage', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Şartlar ve Gizlilik</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="label">Kullanım Şartları Versiyonu</label>
                        <input
                          type="text"
                          className="input"
                          value={settings.termsVersion}
                          onChange={(e) => handleSimpleChange('termsVersion', e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <label className="label">Gizlilik Politikası Versiyonu</label>
                        <input
                          type="text"
                          className="input"
                          value={settings.privacyVersion}
                          onChange={(e) => handleSimpleChange('privacyVersion', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Save Button (Fixed) */}
      {hasChanges && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={handleSaveSettings}
            className="btn btn-primary shadow-lg"
          >
            <Save className="w-4 h-4 mr-2" />
            Değişiklikleri Kaydet
          </button>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
