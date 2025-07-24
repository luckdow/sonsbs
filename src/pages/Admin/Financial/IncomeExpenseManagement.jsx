import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  DollarSign,
  FileText,
  Trash2,
  Edit3,
  Filter,
  Download,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  addDoc, 
  deleteDoc, 
  doc, 
  updateDoc,
  serverTimestamp,
  where,
  Timestamp
} from 'firebase/firestore';
import { db } from '../../../config/firebase';

const IncomeExpenseManagement = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterType, setFilterType] = useState('all'); // 'all', 'income', 'expense'
  const [filterDate, setFilterDate] = useState('all'); // 'all', 'today', 'week', 'month'
  
  // Yeni gider ekleme formu
  const [expenseForm, setExpenseForm] = useState({
    type: 'expense', // 'income' veya 'expense'
    amount: '',
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Kategoriler
  const expenseCategories = [
    'Şoför Ödemesi',
    'Yakıt',
    'Araç Bakım',
    'Sigorta', 
    'Kira',
    'Personel Maaşı',
    'Pazarlama',
    'Ofis Giderleri',
    'Vergi',
    'Diğer'
  ];

  const incomeCategories = [
    'Rezervasyon Geliri',
    'Şoförden Tahsilat',
    'Ek Servis Geliri',
    'Diğer'
  ];

  useEffect(() => {
    // Finansal işlemleri dinle
    const unsubscribe = onSnapshot(
      query(
        collection(db, 'financial_transactions'),
        orderBy('createdAt', 'desc')
      ),
      (snapshot) => {
        const transactionData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().createdAt?.toDate?.() || new Date()
        }));
        
        setTransactions(transactionData);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const formatCurrency = (amount) => {
    const validAmount = parseFloat(amount) || 0;
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'EUR'
    }).format(validAmount);
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    
    if (!expenseForm.amount || !expenseForm.description) {
      alert('Lütfen tüm alanları doldurun!');
      return;
    }

    try {
      await addDoc(collection(db, 'financial_transactions'), {
        type: expenseForm.type === 'income' ? 'credit' : 'debit',
        amount: parseFloat(expenseForm.amount),
        description: expenseForm.description,
        category: expenseForm.category,
        date: expenseForm.date,
        source: 'manuel_entry',
        createdAt: serverTimestamp(),
        createdBy: 'admin'
      });

      // Formu temizle
      setExpenseForm({
        type: 'expense',
        amount: '',
        description: '',
        category: '',
        date: new Date().toISOString().split('T')[0]
      });
      
      setShowAddModal(false);
      alert('İşlem başarıyla eklendi!');
    } catch (error) {
      console.error('İşlem eklenirken hata:', error);
      alert('İşlem eklenirken hata oluştu!');
    }
  };

  const handleDeleteTransaction = async (transactionId) => {
    if (window.confirm('Bu işlemi silmek istediğinizden emin misiniz?')) {
      try {
        await deleteDoc(doc(db, 'financial_transactions', transactionId));
        alert('İşlem başarıyla silindi!');
      } catch (error) {
        console.error('İşlem silinirken hata:', error);
        alert('İşlem silinirken hata oluştu!');
      }
    }
  };

  // Filtreleme fonksiyonu
  const getFilteredTransactions = () => {
    let filtered = transactions;

    // Tip filtresi
    if (filterType !== 'all') {
      filtered = filtered.filter(t => {
        if (filterType === 'income') return t.type === 'credit';
        if (filterType === 'expense') return t.type === 'debit';
        return true;
      });
    }

    // Tarih filtresi
    if (filterDate !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter(t => {
        const transactionDate = new Date(t.date);
        
        if (filterDate === 'today') {
          return transactionDate >= today;
        } else if (filterDate === 'week') {
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          return transactionDate >= weekAgo;
        } else if (filterDate === 'month') {
          const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
          return transactionDate >= monthAgo;
        }
        return true;
      });
    }

    return filtered;
  };

  // Özet hesaplamaları
  const getSummary = () => {
    const filtered = getFilteredTransactions();
    const totalIncome = filtered
      .filter(t => t.type === 'credit')
      .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
    
    const totalExpense = filtered
      .filter(t => t.type === 'debit')
      .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);

    return {
      totalIncome,
      totalExpense,
      netBalance: totalIncome - totalExpense
    };
  };

  const summary = getSummary();
  const filteredTransactions = getFilteredTransactions();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header ve Özet Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border-2 border-green-200 rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <TrendingUp className="w-8 h-8 text-green-600" />
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(summary.totalIncome)}
              </div>
              <div className="text-sm text-green-700">Toplam Gelir</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-red-50 border-2 border-red-200 rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <TrendingDown className="w-8 h-8 text-red-600" />
            <div className="text-right">
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(summary.totalExpense)}
              </div>
              <div className="text-sm text-red-700">Toplam Gider</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`${
            summary.netBalance >= 0 
              ? 'bg-blue-50 border-blue-200 text-blue-600' 
              : 'bg-orange-50 border-orange-200 text-orange-600'
          } border-2 rounded-xl p-6`}
        >
          <div className="flex items-center justify-between">
            <DollarSign className={`w-8 h-8 ${
              summary.netBalance >= 0 ? 'text-blue-600' : 'text-orange-600'
            }`} />
            <div className="text-right">
              <div className={`text-2xl font-bold ${
                summary.netBalance >= 0 ? 'text-blue-600' : 'text-orange-600'
              }`}>
                {formatCurrency(summary.netBalance)}
              </div>
              <div className={`text-sm ${
                summary.netBalance >= 0 ? 'text-blue-700' : 'text-orange-700'
              }`}>
                Net Bakiye
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Kontroller */}
      <div className="bg-white rounded-xl p-6 border">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-wrap gap-4">
            {/* Tip Filtresi */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tüm İşlemler</option>
              <option value="income">Sadece Gelirler</option>
              <option value="expense">Sadece Giderler</option>
            </select>

            {/* Tarih Filtresi */}
            <select
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tüm Zamanlar</option>
              <option value="today">Bugün</option>
              <option value="week">Son 7 Gün</option>
              <option value="month">Son 30 Gün</option>
            </select>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Yeni İşlem Ekle
          </button>
        </div>
      </div>

      {/* İşlemler Tablosu */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-600" />
            Gelir-Gider İşlemleri ({filteredTransactions.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tarih
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tip
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Açıklama
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tutar
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.date.toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      transaction.type === 'credit' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {transaction.type === 'credit' ? (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Gelir
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3 mr-1" />
                          Gider
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {transaction.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.category || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <span className={transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}>
                      {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    {transaction.source === 'manuel_entry' && (
                      <button
                        onClick={() => handleDeleteTransaction(transaction.id)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                        title="Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p>Henüz işlem kaydı bulunmuyor</p>
                    <p className="text-sm">Yeni işlem ekleyerek başlayabilirsiniz</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Yeni İşlem Ekleme Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-md mx-4"
          >
            <h3 className="text-lg font-semibold mb-4">Yeni İşlem Ekle</h3>
            
            <form onSubmit={handleAddTransaction} className="space-y-4">
              {/* İşlem Tipi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  İşlem Tipi
                </label>
                <select
                  value={expenseForm.type}
                  onChange={(e) => setExpenseForm({...expenseForm, type: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="expense">Gider</option>
                  <option value="income">Gelir</option>
                </select>
              </div>

              {/* Tutar */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tutar (EUR)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={expenseForm.amount}
                  onChange={(e) => setExpenseForm({...expenseForm, amount: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                  required
                />
              </div>

              {/* Açıklama */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Açıklama
                </label>
                <input
                  type="text"
                  value={expenseForm.description}
                  onChange={(e) => setExpenseForm({...expenseForm, description: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="İşlem açıklaması..."
                  required
                />
              </div>

              {/* Kategori */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori
                </label>
                <select
                  value={expenseForm.category}
                  onChange={(e) => setExpenseForm({...expenseForm, category: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Kategori Seçin</option>
                  {(expenseForm.type === 'expense' ? expenseCategories : incomeCategories).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Tarih */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tarih
                </label>
                <input
                  type="date"
                  value={expenseForm.date}
                  onChange={(e) => setExpenseForm({...expenseForm, date: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Butonlar */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  Ekle
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default IncomeExpenseManagement;
