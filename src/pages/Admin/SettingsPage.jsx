import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Smartphone,
  Building2,
  Users,
  Banknote,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import toast from 'react-hot-toast';

const SettingsPage = () => {
  const { state, updateSettings } = useApp();
  
  const [activeTab, setActiveTab] = useState('general');
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [settings, setSettings] = useState({
    // General Settings
    general: {
      companyName: 'SBS Transfer',
      companyEmail: 'info@sbstransfer.com',
      companyPhone: '+90 555 123 45 67',
      companyAddress: 'İstanbul, Türkiye',
      companyDescription: 'Premium transfer hizmetleri',
      website: 'https://sbstransfer.com',
      logo: '',
      favicon: ''
    },
    
    // Payment Settings
    payment: {
      paytrMerchantId: '',
      paytrMerchantKey: '',
      paytrMerchantSalt: '',
      testMode: true,
      enabledMethods: {
        cash: true,
        creditCard: true,
        bankTransfer: true,
        paytr: false
      },
      currency: 'TRY',
      taxRate: 18
    },
    
    // Bank Accounts
    bankAccounts: [
      {
        id: 1,
        bankName: 'Türkiye İş Bankası',
        accountHolder: 'SBS Transfer Hizmetleri Ltd. Şti.',
        iban: 'TR33 0006 4000 0011 2345 6789 01',
        branch: 'Ataşehir Şubesi',
        isActive: true
      }
    ],
    
    // Company Information
    company: {
      taxNumber: '1234567890',
      commercialRegistrationNumber: '123456',
      mersisNumber: '0123456789012345',
      establishmentDate: '2020-01-01',
      legalStructure: 'Ltd. Şti.',
      authorizedPerson: 'Mehmet Yılmaz',
      authorizedPersonTitle: 'Genel Müdür'
    },
    
    // Commission Settings
    commission: {
      defaultDriverCommission: 70,
      companyCommission: 30,
      minimumCommission: 50,
      maximumCommission: 90,
      paymentFrequency: 'weekly'
    },
    
    // Notification Settings
    notifications: {
      email: {
        newReservation: true,
        reservationUpdate: true,
        driverAssignment: true,
        paymentReceived: true,
        cancellation: true,
        weeklyReport: true
      },
      sms: {
        reservationConfirmation: true,
        driverAssignment: true,
        paymentReminder: false,
        promotions: false
      },
      push: {
        newReservation: true,
        statusUpdate: true,
        promotions: false
      }
    },
    
    // System Settings
    system: {
      maintenanceMode: false,
      debugMode: false,
      dataRetention: 365,
      backupFrequency: 'daily',
      timezone: 'Europe/Istanbul',
      language: 'tr',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '24h'
    }
  });

  const tabs = [
    {
      id: 'general',
      name: 'Genel Ayarlar',
      icon: Settings,
      description: 'Şirket bilgileri ve genel ayarlar'
    },
    {
      id: 'payment',
      name: 'Ödeme Ayarları',
      icon: CreditCard,
      description: 'PayTR API ve ödeme yöntemleri'
    },
    {
      id: 'bankAccounts',
      name: 'Banka Hesapları',
      icon: Banknote,
      description: 'Havale için banka hesap bilgileri'
    },
    {
      id: 'company',
      name: 'Şirket Bilgileri',
      icon: Building2,
      description: 'Resmi şirket ve yasal bilgiler'
    },
    {
      id: 'commission',
      name: 'Komisyon Ayarları',
      icon: Percent,
      description: 'Şoför komisyon oranları'
    },
    {
      id: 'notifications',
      name: 'Bildirim Ayarları',
      icon: Bell,
      description: 'E-posta, SMS ve push bildirimleri'
    },
    {
      id: 'system',
      name: 'Sistem Ayarları',
      icon: Server,
      description: 'Sistem konfigürasyonu ve güvenlik'
    }
  ];

  useEffect(() => {
    // Firebase'den settings'i yükle
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        const settingsSnapshot = await getDocs(collection(db, 'settings'));
        
        if (!settingsSnapshot.empty) {
          const settingsDoc = settingsSnapshot.docs.find(doc => doc.id === 'main');
          if (settingsDoc) {
            const firebaseSettings = settingsDoc.data();
            console.log('Firebase Settings Loaded:', firebaseSettings);
            setSettings(prev => ({
              ...prev,
              ...firebaseSettings
            }));
          }
        }
      } catch (error) {
        console.error('Settings yüklenirken hata:', error);
        toast.error('Ayarlar yüklenirken hata oluştu');
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleInputChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    setHasChanges(true);
  };

  const handleNestedChange = (section, subsection, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section][subsection],
          [field]: value
        }
      }
    }));
    setHasChanges(true);
  };

  const handleBankAccountChange = (index, field, value) => {
    setSettings(prev => ({
      ...prev,
      bankAccounts: prev.bankAccounts.map((account, i) =>
        i === index ? { ...account, [field]: value } : account
      )
    }));
    setHasChanges(true);
  };

  const addBankAccount = () => {
    const newAccount = {
      id: Date.now(),
      bankName: '',
      accountHolder: '',
      iban: '',
      branch: '',
      isActive: true
    };
    setSettings(prev => ({
      ...prev,
      bankAccounts: [...prev.bankAccounts, newAccount]
    }));
    setHasChanges(true);
  };

  const removeBankAccount = (index) => {
    setSettings(prev => ({
      ...prev,
      bankAccounts: prev.bankAccounts.filter((_, i) => i !== index)
    }));
    setHasChanges(true);
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      // Firebase'e settings'i kaydet
      await setDoc(doc(db, 'settings', 'main'), {
        ...settings,
        updatedAt: new Date().toISOString()
      });
      
      setHasChanges(false);
      toast.success('Ayarlar başarıyla kaydedildi!');
    } catch (error) {
      console.error('Settings save error:', error);
      toast.error('Ayarlar kaydedilirken hata oluştu: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralSettings settings={settings.general} onChange={(field, value) => handleInputChange('general', field, value)} />;
      
      case 'payment':
        return <PaymentSettings settings={settings.payment} onChange={(field, value) => handleInputChange('payment', field, value)} onNestedChange={(subsection, field, value) => handleNestedChange('payment', subsection, field, value)} />;
      
      case 'bankAccounts':
        return <BankAccountsSettings accounts={settings.bankAccounts} onAccountChange={handleBankAccountChange} onAddAccount={addBankAccount} onRemoveAccount={removeBankAccount} />;
      
      case 'company':
        return <CompanySettings settings={settings.company} onChange={(field, value) => handleInputChange('company', field, value)} />;
      
      case 'commission':
        return <CommissionSettings settings={settings.commission} onChange={(field, value) => handleInputChange('commission', field, value)} />;
      
      case 'notifications':
        return <NotificationSettings settings={settings.notifications} onChange={(subsection, field, value) => handleNestedChange('notifications', subsection, field, value)} />;
      
      case 'system':
        return <SystemSettings settings={settings.system} onChange={(field, value) => handleInputChange('system', field, value)} />;
      
      default:
        return null;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sistem Ayarları</h1>
            <p className="text-gray-600 mt-2">Platform ayarlarını yönetin ve konfigürasyon yapın</p>
          </div>
          
          {hasChanges && (
            <motion.button
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSaveSettings}
              disabled={isLoading}
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-5 w-5" />
              <span>{isLoading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-0">
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex-1 py-4 px-6 text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  } ${index === 0 ? 'rounded-tl-xl' : ''} ${index === tabs.length - 1 ? 'rounded-tr-xl' : ''}`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:block">{tab.name}</span>
                  </div>
                  
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-blue-50 border-b-2 border-blue-600 rounded-t-xl"
                      style={{ zIndex: -1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
        
        {/* Tab Description */}
        <div className="px-6 py-3 bg-gray-50 rounded-b-xl">
          <p className="text-sm text-gray-600">
            {tabs.find(tab => tab.id === activeTab)?.description}
          </p>
        </div>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      >
        {renderTabContent()}
      </motion.div>

      {/* Changes Warning */}
      <AnimatePresence>
        {hasChanges && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-6 right-6 bg-yellow-100 border border-yellow-300 rounded-lg p-4 shadow-lg max-w-sm"
          >
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-yellow-800">Kaydedilmemiş Değişiklikler</p>
                <p className="text-xs text-yellow-700">Değişikliklerinizi kaydetmeyi unutmayın</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// General Settings Component
const GeneralSettings = ({ settings, onChange }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Şirket Adı *
        </label>
        <input
          type="text"
          value={settings.companyName}
          onChange={(e) => onChange('companyName', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Şirket adını girin"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          E-posta Adresi *
        </label>
        <input
          type="email"
          value={settings.companyEmail}
          onChange={(e) => onChange('companyEmail', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="info@company.com"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Telefon Numarası *
        </label>
        <input
          type="tel"
          value={settings.companyPhone}
          onChange={(e) => onChange('companyPhone', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="+90 555 123 45 67"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Website
        </label>
        <input
          type="url"
          value={settings.website}
          onChange={(e) => onChange('website', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="https://company.com"
        />
      </div>
    </div>
    
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Şirket Adresi *
      </label>
      <textarea
        value={settings.companyAddress}
        onChange={(e) => onChange('companyAddress', e.target.value)}
        rows={3}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Tam adres bilgisi"
      />
    </div>
    
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Şirket Açıklaması
      </label>
      <textarea
        value={settings.companyDescription}
        onChange={(e) => onChange('companyDescription', e.target.value)}
        rows={3}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Şirket hakkında kısa açıklama"
      />
    </div>
  </div>
);

// Payment Settings Component
const PaymentSettings = ({ settings, onChange, onNestedChange }) => (
  <div className="space-y-8">
    {/* PayTR Settings */}
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
        <CreditCard className="h-5 w-5 text-blue-600" />
        <span>PayTR API Ayarları</span>
      </h3>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <div className="flex items-center space-x-2">
          <Info className="h-4 w-4 text-blue-600" />
          <p className="text-sm text-blue-800">
            PayTR API bilgilerinizi PayTR merchant panelinden alabilirsiniz.
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Merchant ID
          </label>
          <input
            type="text"
            value={settings.paytrMerchantId}
            onChange={(e) => onChange('paytrMerchantId', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="PayTR Merchant ID"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Merchant Key
          </label>
          <input
            type="password"
            value={settings.paytrMerchantKey}
            onChange={(e) => onChange('paytrMerchantKey', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="PayTR Merchant Key"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Merchant Salt
          </label>
          <input
            type="password"
            value={settings.paytrMerchantSalt}
            onChange={(e) => onChange('paytrMerchantSalt', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="PayTR Merchant Salt"
          />
        </div>
        
        <div className="flex items-center space-x-3 pt-8">
          <input
            type="checkbox"
            id="testMode"
            checked={settings.testMode}
            onChange={(e) => onChange('testMode', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="testMode" className="text-sm font-medium text-gray-700">
            Test Modu Aktif
          </label>
        </div>
      </div>
    </div>
    
    {/* Payment Methods */}
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Ödeme Yöntemleri</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(settings.enabledMethods).map(([method, enabled]) => (
          <label key={method} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => onNestedChange('enabledMethods', method, e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-sm font-medium text-gray-700 capitalize">
              {method === 'cash' ? 'Nakit' : 
               method === 'creditCard' ? 'Kredi Kartı' : 
               method === 'bankTransfer' ? 'Banka Havalesi' : 
               method === 'paytr' ? 'PayTR' : method}
            </span>
          </label>
        ))}
      </div>
    </div>
    
    {/* Currency and Tax */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Para Birimi
        </label>
        <select
          value={settings.currency}
          onChange={(e) => onChange('currency', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="EUR">Euro (€)</option>
          <option value="USD">Amerikan Doları ($)</option>
          <option value="EUR">Euro (€)</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          KDV Oranı (%)
        </label>
        <input
          type="number"
          min="0"
          max="100"
          step="0.1"
          value={settings.taxRate}
          onChange={(e) => onChange('taxRate', parseFloat(e.target.value))}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  </div>
);

// Bank Accounts Settings Component  
const BankAccountsSettings = ({ accounts, onAccountChange, onAddAccount, onRemoveAccount }) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-semibold text-gray-900">Banka Hesapları</h3>
      <button
        onClick={onAddAccount}
        className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Banknote className="h-4 w-4" />
        <span>Hesap Ekle</span>
      </button>
    </div>
    
    <div className="space-y-4">
      {accounts.map((account, index) => (
        <div key={account.id} className="border border-gray-200 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Banka Adı *
              </label>
              <input
                type="text"
                value={account.bankName}
                onChange={(e) => onAccountChange(index, 'bankName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Banka adı"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hesap Sahibi *
              </label>
              <input
                type="text"
                value={account.accountHolder}
                onChange={(e) => onAccountChange(index, 'accountHolder', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Hesap sahibi adı"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                IBAN *
              </label>
              <input
                type="text"
                value={account.iban}
                onChange={(e) => onAccountChange(index, 'iban', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="TR00 0000 0000 0000 0000 0000 00"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Şube
              </label>
              <input
                type="text"
                value={account.branch}
                onChange={(e) => onAccountChange(index, 'branch', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Şube adı"
              />
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-4">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={account.isActive}
                onChange={(e) => onAccountChange(index, 'isActive', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700">Aktif Hesap</span>
            </label>
            
            <button
              onClick={() => onRemoveAccount(index)}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Hesabı Kaldır
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Company Settings Component
const CompanySettings = ({ settings, onChange }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Vergi Numarası
        </label>
        <input
          type="text"
          value={settings.taxNumber}
          onChange={(e) => onChange('taxNumber', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="1234567890"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ticaret Sicil Numarası
        </label>
        <input
          type="text"
          value={settings.commercialRegistrationNumber}
          onChange={(e) => onChange('commercialRegistrationNumber', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="123456"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          MERSİS Numarası
        </label>
        <input
          type="text"
          value={settings.mersisNumber}
          onChange={(e) => onChange('mersisNumber', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="0123456789012345"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Kuruluş Tarihi
        </label>
        <input
          type="date"
          value={settings.establishmentDate}
          onChange={(e) => onChange('establishmentDate', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Hukuki Yapı
        </label>
        <select
          value={settings.legalStructure}
          onChange={(e) => onChange('legalStructure', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="Ltd. Şti.">Limited Şirket</option>
          <option value="A.Ş.">Anonim Şirket</option>
          <option value="Şahıs">Şahıs Şirketi</option>
          <option value="Koop.">Kooperatif</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Yetkili Kişi
        </label>
        <input
          type="text"
          value={settings.authorizedPerson}
          onChange={(e) => onChange('authorizedPerson', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Ad Soyad"
        />
      </div>
    </div>
    
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Yetkili Unvanı
      </label>
      <input
        type="text"
        value={settings.authorizedPersonTitle}
        onChange={(e) => onChange('authorizedPersonTitle', e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Genel Müdür, CEO, vs."
      />
    </div>
  </div>
);

// Commission Settings Component
const CommissionSettings = ({ settings, onChange }) => (
  <div className="space-y-6">
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-center space-x-2">
        <Info className="h-4 w-4 text-blue-600" />
        <p className="text-sm text-blue-800">
          Komisyon oranları toplamı %100 olmalıdır. Şoför + Şirket = %100
        </p>
      </div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Varsayılan Şoför Komisyonu (%)
        </label>
        <input
          type="number"
          min="0"
          max="100"
          step="1"
          value={settings.defaultDriverCommission}
          onChange={(e) => onChange('defaultDriverCommission', parseInt(e.target.value))}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">Şoförlere verilen varsayılan komisyon oranı</p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Şirket Komisyonu (%)
        </label>
        <input
          type="number"
          min="0"
          max="100"
          step="1"
          value={settings.companyCommission}
          onChange={(e) => onChange('companyCommission', parseInt(e.target.value))}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">Şirketin aldığı komisyon oranı</p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Minimum Komisyon (%)
        </label>
        <input
          type="number"
          min="0"
          max="100"
          step="1"
          value={settings.minimumCommission}
          onChange={(e) => onChange('minimumCommission', parseInt(e.target.value))}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Maksimum Komisyon (%)
        </label>
        <input
          type="number"
          min="0"
          max="100"
          step="1"
          value={settings.maximumCommission}
          onChange={(e) => onChange('maximumCommission', parseInt(e.target.value))}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
    
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Ödeme Sıklığı
      </label>
      <select
        value={settings.paymentFrequency}
        onChange={(e) => onChange('paymentFrequency', e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="daily">Günlük</option>
        <option value="weekly">Haftalık</option>
        <option value="monthly">Aylık</option>
      </select>
    </div>
  </div>
);

// Notification Settings Component
const NotificationSettings = ({ settings, onChange }) => (
  <div className="space-y-8">
    {/* Email Notifications */}
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
        <Mail className="h-5 w-5 text-blue-600" />
        <span>E-posta Bildirimleri</span>
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(settings.email).map(([key, value]) => (
          <label key={key} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => onChange('email', key, e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-sm font-medium text-gray-700">
              {key === 'newReservation' ? 'Yeni Rezervasyon' :
               key === 'reservationUpdate' ? 'Rezervasyon Güncelleme' :
               key === 'driverAssignment' ? 'Şoför Atama' :
               key === 'paymentReceived' ? 'Ödeme Alındı' :
               key === 'cancellation' ? 'İptal Bildirimi' :
               key === 'weeklyReport' ? 'Haftalık Rapor' : key}
            </span>
          </label>
        ))}
      </div>
    </div>
    
    {/* SMS Notifications */}
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
        <Smartphone className="h-5 w-5 text-green-600" />
        <span>SMS Bildirimleri</span>
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(settings.sms).map(([key, value]) => (
          <label key={key} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => onChange('sms', key, e.target.checked)}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <span className="text-sm font-medium text-gray-700">
              {key === 'reservationConfirmation' ? 'Rezervasyon Onayı' :
               key === 'driverAssignment' ? 'Şoför Atama' :
               key === 'paymentReminder' ? 'Ödeme Hatırlatması' :
               key === 'promotions' ? 'Promosyonlar' : key}
            </span>
          </label>
        ))}
      </div>
    </div>
    
    {/* Push Notifications */}
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
        <Bell className="h-5 w-5 text-purple-600" />
        <span>Push Bildirimleri</span>
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(settings.push).map(([key, value]) => (
          <label key={key} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => onChange('push', key, e.target.checked)}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <span className="text-sm font-medium text-gray-700">
              {key === 'newReservation' ? 'Yeni Rezervasyon' :
               key === 'statusUpdate' ? 'Durum Güncellemesi' :
               key === 'promotions' ? 'Promosyonlar' : key}
            </span>
          </label>
        ))}
      </div>
    </div>
  </div>
);

// System Settings Component
const SystemSettings = ({ settings, onChange }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Saat Dilimi
        </label>
        <select
          value={settings.timezone}
          onChange={(e) => onChange('timezone', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="Europe/Istanbul">İstanbul (UTC+3)</option>
          <option value="Europe/London">Londra (UTC+0)</option>
          <option value="America/New_York">New York (UTC-5)</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Dil
        </label>
        <select
          value={settings.language}
          onChange={(e) => onChange('language', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="tr">Türkçe</option>
          <option value="en">English</option>
          <option value="de">Deutsch</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tarih Formatı
        </label>
        <select
          value={settings.dateFormat}
          onChange={(e) => onChange('dateFormat', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Saat Formatı
        </label>
        <select
          value={settings.timeFormat}
          onChange={(e) => onChange('timeFormat', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="24h">24 Saat</option>
          <option value="12h">12 Saat (AM/PM)</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Veri Saklama Süresi (Gün)
        </label>
        <input
          type="number"
          min="30"
          max="3650"
          value={settings.dataRetention}
          onChange={(e) => onChange('dataRetention', parseInt(e.target.value))}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Yedekleme Sıklığı
        </label>
        <select
          value={settings.backupFrequency}
          onChange={(e) => onChange('backupFrequency', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="daily">Günlük</option>
          <option value="weekly">Haftalık</option>
          <option value="monthly">Aylık</option>
        </select>
      </div>
    </div>
    
    <div className="space-y-4">
      <label className="flex items-center space-x-3 p-4 border border-yellow-200 rounded-lg bg-yellow-50">
        <input
          type="checkbox"
          checked={settings.maintenanceMode}
          onChange={(e) => onChange('maintenanceMode', e.target.checked)}
          className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
        />
        <div>
          <span className="text-sm font-medium text-yellow-800">Bakım Modu</span>
          <p className="text-xs text-yellow-700">Aktif olduğunda site bakım moduna geçer</p>
        </div>
      </label>
      
      <label className="flex items-center space-x-3 p-4 border border-red-200 rounded-lg bg-red-50">
        <input
          type="checkbox"
          checked={settings.debugMode}
          onChange={(e) => onChange('debugMode', e.target.checked)}
          className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
        />
        <div>
          <span className="text-sm font-medium text-red-800">Debug Modu</span>
          <p className="text-xs text-red-700">Sadece geliştirme aşamasında aktif edilmeli</p>
        </div>
      </label>
    </div>
  </div>
);

export default SettingsPage;
