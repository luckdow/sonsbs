import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  Users, 
  CreditCard, 
  TrendingUp, 
  AlertTriangle,
  Calendar,
  FileText
} from 'lucide-react';

// Alt modülleri import et
import FinancialOverview from './FinancialOverview';
import DriverAccounts from './DriverAccounts';
import PaymentManagement from './PaymentManagement';
import PaymentReminders from './PaymentReminders';
import FinancialReports from './FinancialReports';

const FinancialManagement = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    {
      id: 'overview',
      label: 'Genel Bakış',
      icon: TrendingUp,
      component: FinancialOverview
    },
    {
      id: 'drivers',
      label: 'Şoför Cariler',
      icon: Users,
      component: DriverAccounts
    },
    {
      id: 'payments',
      label: 'Ödeme Yönetimi',
      icon: CreditCard,
      component: PaymentManagement
    },
    {
      id: 'reminders',
      label: 'Ödeme Uyarıları',
      icon: AlertTriangle,
      component: PaymentReminders
    },
    {
      id: 'reports',
      label: 'Finansal Raporlar',
      icon: FileText,
      component: FinancialReports
    }
  ];

  const renderActiveComponent = () => {
    const activeTabData = tabs.find(tab => tab.id === activeTab);
    const Component = activeTabData?.component;
    return Component ? <Component /> : null;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Finansal Yönetim</h1>
        <p className="text-gray-600 mt-1">Tüm finansal işlemler, şoför carilik hesapları ve ödeme takibi merkezi</p>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="flex flex-wrap border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-6 py-4 transition-all duration-200 font-medium
                ${activeTab === tab.id
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                }
              `}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="p-6">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderActiveComponent()}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FinancialManagement;
