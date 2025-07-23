import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  Users, 
  CreditCard, 
  Calendar
} from 'lucide-react';

// Alt modülleri import et
import DriverAccounts from './DriverAccounts';
import ReservationFinance from './ReservationFinance';
import Income from './Income';
import Expenses from './Expenses';

const FinancialManagement = () => {
  const [activeTab, setActiveTab] = useState('reservations');

  const tabs = [
    {
      id: 'reservations',
      label: 'Rezervasyon Finansı',
      icon: Calendar,
      component: ReservationFinance,
      description: 'Aylık/yıllık rezervasyon gelir takibi'
    },
    {
      id: 'drivers',
      label: 'Şoför Cari Hesapları',
      icon: Users,
      component: DriverAccounts,
      description: 'Şoförlere ne kadar ödeyeceğiniz/alacağınız'
    },
    {
      id: 'income',
      label: 'Gelirler',
      icon: DollarSign,
      component: Income,
      description: 'Rezervasyonlardan komisyon düştükten sonra net kazancınız'
    },
    {
      id: 'expenses',
      label: 'Giderler',
      icon: CreditCard,
      component: Expenses,
      description: 'Şoförlere ödenen komisyonlar'
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
