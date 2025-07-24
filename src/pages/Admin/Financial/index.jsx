import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  Users, 
  CreditCard, 
  Calendar,
  BarChart3,
  TrendingUp
} from 'lucide-react';

// Yeni finansal sistem modülleri
import FinancialDashboard from './FinancialDashboard';
import DriverPaymentManagement_IMPROVED from './DriverPaymentManagement_IMPROVED';
import IncomeExpenseManagement from './IncomeExpenseManagement';

const FinancialManagement = () => {
  const [activeTab, setActiveTab] = useState('dashboard'); // Dashboard ile başla

  const tabs = [
    {
      id: 'dashboard',
      label: '📊 Finansal Dashboard',
      icon: BarChart3,
      component: FinancialDashboard,
      description: 'Güncel finansal durum, gelir-gider analizi ve trend grafikler'
    },
    {
      id: 'driver-payments',
      label: '💳 Şoför Cari Hesapları',
      icon: Users,
      component: DriverPaymentManagement_IMPROVED,
      description: 'Şoförlerden alacak/verecek durumu ve ödeme/tahsilat işlemleri'
    },
    {
      id: 'income-expense',
      label: '💰 Gelir-Gider Yönetimi',
      icon: TrendingUp,
      component: IncomeExpenseManagement,
      description: 'Gelir-gider tablosu, manuel işlem ekleme ve finansal kayıt takibi'
    }
  ];

  const renderActiveComponent = () => {
    const activeTabData = tabs.find(tab => tab.id === activeTab);
    const Component = activeTabData?.component;
    return Component ? <Component /> : null;
  };

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="flex flex-wrap border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-3 transition-all duration-200 font-medium text-sm
                ${activeTab === tab.id
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                }
              `}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="p-6">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {renderActiveComponent()}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FinancialManagement;
