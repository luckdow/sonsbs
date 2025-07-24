import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Building, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  CreditCard,
  Clock,
  ChevronDown,
  ChevronUp,
  Filter
} from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

const CompanyFinancials = () => {
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTransactions, setShowTransactions] = useState(false);
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  // Şirket finansal verilerini getir
  const fetchCompanyData = async () => {
    try {
      setLoading(true);
      const companyDoc = await getDoc(doc(db, 'company_accounts', 'main_account'));
      
      if (companyDoc.exists()) {
        const data = companyDoc.data();
        
        // Transactions'ları tarihe göre sırala (en yeni en üstte)
        const sortedTransactions = [...(data.transactions || [])].sort((a, b) => {
          const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date);
          const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date);
          return dateB - dateA;
        });
        
        setCompanyData({
          ...data,
          transactions: sortedTransactions
        });
        setFilteredTransactions(sortedTransactions);
      } else {
        setCompanyData({
          totalRevenueToDate: 0,
          totalExpensesToDate: 0,
          reservationsRevenue: 0,
          driverPayments: 0,
          transactions: []
        });
        setFilteredTransactions([]);
      }
    } catch (error) {
      console.error('Şirket finansal verilerini alma hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyData();
  }, []);

  useEffect(() => {
    if (companyData && companyData.transactions) {
      filterTransactionsByPeriod(filterPeriod);
    }
  }, [companyData, filterPeriod]);

  // İşlemleri filtreleme fonksiyonu
  const filterTransactionsByPeriod = (period) => {
    if (!companyData || !companyData.transactions) return;
    
    const now = new Date();
    const transactions = companyData.transactions;
    
    let filtered;
    switch (period) {
      case 'today':
        filtered = transactions.filter(t => {
          const date = t.date?.toDate ? t.date.toDate() : new Date(t.date);
          return date.setHours(0, 0, 0, 0) === now.setHours(0, 0, 0, 0);
        });
        break;
      case 'week':
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        filtered = transactions.filter(t => {
          const date = t.date?.toDate ? t.date.toDate() : new Date(t.date);
          return date >= oneWeekAgo;
        });
        break;
      case 'month':
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        filtered = transactions.filter(t => {
          const date = t.date?.toDate ? t.date.toDate() : new Date(t.date);
          return date >= oneMonthAgo;
        });
        break;
      default:
        filtered = transactions;
    }
    
    setFilteredTransactions(filtered);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount || 0);
  };

  // İşlem türüne göre renk ve ikon belirleme
  const getTransactionStyle = (type) => {
    if (type === 'reservation_completed' || type === 'driver_collection') {
      return {
        iconBg: 'bg-green-100',
        textColor: 'text-green-600',
        icon: TrendingUp
      };
    } else if (type === 'driver_payment') {
      return {
        iconBg: 'bg-red-100',
        textColor: 'text-red-600',
        icon: TrendingDown
      };
    } else {
      return {
        iconBg: 'bg-blue-100',
        textColor: 'text-blue-600',
        icon: DollarSign
      };
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    const dateObj = date?.toDate ? date.toDate() : new Date(date);
    return format(dateObj, 'dd MMM yyyy HH:mm', { locale: tr });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const netBalance = (companyData?.totalRevenueToDate || 0) - (companyData?.totalExpensesToDate || 0);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold flex items-center">
          <Building className="mr-2 text-blue-600" />
          Şirket Finansal Durumu
        </h2>
      </div>

      {/* Finansal Özet */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-blue-50 rounded-lg p-4 flex flex-col"
        >
          <div className="flex items-center text-blue-600 mb-2">
            <DollarSign size={18} className="mr-1" />
            <span className="font-medium">Net Bakiye</span>
          </div>
          <div className={`text-xl font-bold ${netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(netBalance)}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-green-50 rounded-lg p-4 flex flex-col"
        >
          <div className="flex items-center text-green-600 mb-2">
            <TrendingUp size={18} className="mr-1" />
            <span className="font-medium">Toplam Gelir</span>
          </div>
          <div className="text-xl font-bold text-green-600">
            {formatCurrency(companyData?.totalRevenueToDate)}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-red-50 rounded-lg p-4 flex flex-col"
        >
          <div className="flex items-center text-red-600 mb-2">
            <TrendingDown size={18} className="mr-1" />
            <span className="font-medium">Toplam Gider</span>
          </div>
          <div className="text-xl font-bold text-red-600">
            {formatCurrency(companyData?.totalExpensesToDate)}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-purple-50 rounded-lg p-4 flex flex-col"
        >
          <div className="flex items-center text-purple-600 mb-2">
            <CreditCard size={18} className="mr-1" />
            <span className="font-medium">Şoför Ödemeleri</span>
          </div>
          <div className="text-xl font-bold text-purple-600">
            {formatCurrency(companyData?.driverPayments)}
          </div>
        </motion.div>
      </div>

      {/* İşlem Geçmişi */}
      <div className="p-6 border-t border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <button 
            onClick={() => setShowTransactions(!showTransactions)}
            className="flex items-center text-gray-700 font-medium"
          >
            İşlem Geçmişi
            {showTransactions ? 
              <ChevronUp className="ml-2 h-5 w-5" /> : 
              <ChevronDown className="ml-2 h-5 w-5" />
            }
          </button>
          
          {showTransactions && (
            <div className="flex items-center space-x-2">
              <Filter size={16} className="text-gray-500" />
              <select
                value={filterPeriod}
                onChange={(e) => setFilterPeriod(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                <option value="all">Tüm İşlemler</option>
                <option value="today">Bugün</option>
                <option value="week">Son 7 Gün</option>
                <option value="month">Son 30 Gün</option>
              </select>
            </div>
          )}
        </div>
        
        {showTransactions && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4"
          >
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Bu dönemde işlem bulunamadı
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        İşlem
                      </th>
                      <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tarih
                      </th>
                      <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Gelir
                      </th>
                      <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Gider
                      </th>
                      <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Net
                      </th>
                      <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Detay
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTransactions.map((transaction, index) => {
                      const style = getTransactionStyle(transaction.type);
                      const TransactionIcon = style.icon;
                      
                      return (
                        <tr key={transaction.id || index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className={`flex-shrink-0 h-8 w-8 rounded-full ${style.iconBg} flex items-center justify-center`}>
                                <TransactionIcon size={14} className={style.textColor} />
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">
                                  {transaction.type === 'reservation_completed' ? 'Rezervasyon Geliri' : 
                                   transaction.type === 'driver_payment' ? 'Şoför Ödemesi' :
                                   transaction.type === 'driver_collection' ? 'Şoför Tahsilatı' : 'Diğer İşlem'}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {transaction.paymentMethod === 'cash' ? 'Nakit' : 
                                   transaction.paymentMethod === 'card' || transaction.paymentMethod === 'credit_card' ? 'Kredi Kartı' : 
                                   transaction.paymentMethod === 'manual' ? 'Manuel İşlem' : 'Diğer'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {formatDate(transaction.date)}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-green-600 font-medium">
                              {transaction.revenueAmount > 0 ? 
                                formatCurrency(transaction.revenueAmount) : '-'}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-red-600 font-medium">
                              {transaction.expenseAmount > 0 ? 
                                formatCurrency(transaction.expenseAmount) : '-'}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className={`text-sm font-medium ${transaction.netAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {formatCurrency(transaction.netAmount)}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                            <div className="max-w-xs truncate">
                              {transaction.note}
                              {transaction.driverName && ` - ${transaction.driverName}`}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CompanyFinancials;
