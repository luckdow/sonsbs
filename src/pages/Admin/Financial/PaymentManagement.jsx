import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  AlertTriangle, 
  Clock,
  CheckCircle,
  DollarSign,
  Users,
  Calendar,
  Filter
} from 'lucide-react';
import { collection, getDocs, doc, updateDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../../config/firebase';

const PaymentManagement = () => {
  const [pendingPayments, setPendingPayments] = useState([]);
  const [completedPayments, setCompletedPayments] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [filterDriver, setFilterDriver] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    fetchPaymentData();
  }, []);

  const fetchPaymentData = async () => {
    try {
      setLoading(true);
      
      // Şoförleri getir
      const driversSnapshot = await getDocs(collection(db, 'drivers'));
      const driversData = driversSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDrivers(driversData);

      // Tamamlanan rezervasyonları getir
      const reservationsQuery = query(
        collection(db, 'reservations'),
        where('status', '==', 'completed'),
        orderBy('completedAt', 'desc')
      );
      const reservationsSnapshot = await getDocs(reservationsQuery);
      
      const payments = [];
      
      for (const resDoc of reservationsSnapshot.docs) {
        const reservation = { id: resDoc.id, ...resDoc.data() };
        
        if (reservation.driverId) {
          const driver = driversData.find(d => d.id === reservation.driverId);
          if (driver) {
            const commissionRate = driver.commissionRate || 15;
            const tripPrice = reservation.totalPrice || 0;
            const commission = (tripPrice * commissionRate) / 100;
            const driverEarning = tripPrice - commission;

            const payment = {
              id: reservation.id,
              driverId: reservation.driverId,
              driverName: `${driver.firstName} ${driver.lastName}`,
              customerName: reservation.customerName,
              tripPrice,
              commission,
              driverEarning,
              paymentMethod: reservation.paymentMethod,
              completedAt: reservation.completedAt,
              paymentStatus: reservation.driverPaymentStatus || 'pending',
              route: `${reservation.pickupLocation?.address || 'Bilinmiyor'} → ${reservation.dropoffLocation?.address || 'Bilinmiyor'}`,
              commissionRate
            };

            payments.push(payment);
          }
        }
      }

      // Ödeme durumuna göre ayır
      setPendingPayments(payments.filter(p => p.paymentStatus === 'pending'));
      setCompletedPayments(payments.filter(p => p.paymentStatus === 'paid'));

    } catch (error) {
      console.error('Ödeme verilerini getirme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsPaid = async (payment) => {
    try {
      // Rezervasyon ödeme durumunu güncelle
      await updateDoc(doc(db, 'reservations', payment.id), {
        driverPaymentStatus: 'paid',
        paidAt: new Date()
      });

      // Şoför bakiyesini güncelle (sadece kredi kartı/havale ödemeleri için)
      if (payment.paymentMethod !== 'cash') {
        const driver = drivers.find(d => d.id === payment.driverId);
        const newBalance = (driver.balance || 0) + payment.driverEarning;
        
        await updateDoc(doc(db, 'drivers', payment.driverId), {
          balance: newBalance
        });
      }

      // State'i güncelle
      setPendingPayments(prev => prev.filter(p => p.id !== payment.id));
      setCompletedPayments(prev => [...prev, { ...payment, paymentStatus: 'paid', paidAt: new Date() }]);
      
      alert('Ödeme başarıyla işaretlendi');
    } catch (error) {
      console.error('Ödeme işaretleme hatası:', error);
      alert('Ödeme işaretlenirken hata oluştu');
    }
  };

  const filteredPayments = (activeTab === 'pending' ? pendingPayments : completedPayments)
    .filter(payment => {
      if (filterDriver !== 'all' && payment.driverId !== filterDriver) return false;
      
      if (dateFilter !== 'all') {
        const paymentDate = payment.completedAt?.toDate?.() || new Date(payment.completedAt);
        const now = new Date();
        const diffDays = Math.floor((now - paymentDate) / (1000 * 60 * 60 * 24));
        
        if (dateFilter === 'today' && diffDays !== 0) return false;
        if (dateFilter === 'week' && diffDays > 7) return false;
        if (dateFilter === 'month' && diffDays > 30) return false;
      }
      
      return true;
    });

  const PaymentCard = ({ payment }) => (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-l-blue-500"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            payment.paymentMethod === 'cash' ? 'bg-yellow-100' : 'bg-green-100'
          }`}>
            <DollarSign className={`w-5 h-5 ${
              payment.paymentMethod === 'cash' ? 'text-yellow-600' : 'text-green-600'
            }`} />
          </div>
          <div>
            <h4 className="font-bold text-gray-800">{payment.driverName}</h4>
            <p className="text-sm text-gray-600">{payment.customerName}</p>
          </div>
        </div>
        
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          payment.paymentMethod === 'cash' 
            ? 'bg-yellow-100 text-yellow-700' 
            : 'bg-green-100 text-green-700'
        }`}>
          {payment.paymentMethod === 'cash' ? 'Nakit' : 'Kredi/Havale'}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600">Yolculuk Ücreti</p>
          <p className="text-lg font-bold text-gray-800">€{payment.tripPrice.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Komisyon (%{payment.commissionRate})</p>
          <p className="text-lg font-bold text-red-600">€{payment.commission.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-green-800">Şoför Kazancı</span>
          <span className="text-xl font-bold text-green-600">
            €{payment.driverEarning.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-1">Rota</p>
        <p className="text-sm text-gray-800">{payment.route}</p>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">
          {payment.completedAt?.toDate?.()?.toLocaleDateString('tr-TR') || 'Tarih bilinmiyor'}
        </span>
        
        {activeTab === 'pending' && (
          <button
            onClick={() => markAsPaid(payment)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
          >
            <CheckCircle className="w-4 h-4" />
            Ödendi İşaretle
          </button>
        )}
        
        {activeTab === 'completed' && (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Ödendi</span>
          </div>
        )}
      </div>

      {payment.paymentMethod === 'cash' && (
        <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-600" />
            <span className="text-sm text-yellow-800">
              Nakit ödeme - Şoför komisyonu toplamalı
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* İstatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-l-yellow-500">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-yellow-600" />
            <div>
              <p className="text-sm text-gray-600">Bekleyen Ödemeler</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingPayments.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-l-green-500">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Tamamlanan</p>
              <p className="text-2xl font-bold text-green-600">{completedPayments.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-l-blue-500">
          <div className="flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Bekleyen Tutar</p>
              <p className="text-2xl font-bold text-blue-600">
                €{pendingPayments.reduce((sum, p) => sum + p.driverEarning, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-l-purple-500">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">Aktif Şoförler</p>
              <p className="text-2xl font-bold text-purple-600">{drivers.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex-1 px-6 py-4 font-medium transition-colors ${
              activeTab === 'pending'
                ? 'bg-yellow-50 text-yellow-600 border-b-2 border-yellow-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Clock className="w-5 h-5" />
              Bekleyen Ödemeler ({pendingPayments.length})
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('completed')}
            className={`flex-1 px-6 py-4 font-medium transition-colors ${
              activeTab === 'completed'
                ? 'bg-green-50 text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Tamamlanan Ödemeler ({completedPayments.length})
            </div>
          </button>
        </div>

        {/* Filtreler */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <select
                value={filterDriver}
                onChange={(e) => setFilterDriver(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">Tüm Şoförler</option>
                {drivers.map(driver => (
                  <option key={driver.id} value={driver.id}>
                    {driver.firstName} {driver.lastName}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex-1">
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">Tüm Tarihler</option>
                <option value="today">Bugün</option>
                <option value="week">Son 7 Gün</option>
                <option value="month">Son 30 Gün</option>
              </select>
            </div>
          </div>
        </div>

        {/* Ödeme Listesi */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredPayments.map(payment => (
              <PaymentCard key={payment.id} payment={payment} />
            ))}
          </div>
          
          {filteredPayments.length === 0 && (
            <div className="text-center py-12">
              <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {activeTab === 'pending' ? 'Bekleyen ödeme bulunamadı' : 'Tamamlanan ödeme bulunamadı'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentManagement;
