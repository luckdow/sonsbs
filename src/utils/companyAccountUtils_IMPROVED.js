import { doc, updateDoc, getDoc, collection, addDoc, setDoc, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * 🏢 ŞİRKET FİNANSAL YÖNETİM SİSTEMİ
 * 
 * Bu dosya şirketin genel muhasebe entegrasyonunu sağlar:
 * - Gelir kayıtları (rezervasyonlardan komisyon/pay)
 * - Gider kayıtları (şoförlere yapılan ödemeler)
 * - Net kar/zarar hesaplamaları
 * - Ödeme/Tahsilat işlemleri
 */

/**
 * Şirket ana hesabının güncel durumunu getir
 */
export const getCompanyFinancialStatus = async () => {
  try {
    // Basit sorgu - sadece collection'dan al, filtreleme client tarafında yap
    const financialSnapshot = await getDocs(collection(db, 'company_financials'));
    
    let totalRevenue = 0;
    let totalExpense = 0;
    let cashRevenue = 0;
    let cardRevenue = 0;
    let totalDriverPayments = 0;
    let totalDriverCollections = 0;
    
    // Client tarafında filtreleme
    financialSnapshot.docs.forEach(doc => {
      const data = doc.data();
      
      if (data.type === 'reservation_completion') {
        totalRevenue += data.companyRevenue || 0;
        totalExpense += data.companyExpense || 0;
        
        if (data.paymentMethod === 'cash') {
          cashRevenue += data.companyRevenue || 0;
        } else {
          cardRevenue += data.companyRevenue || 0;
        }
      } else if (data.type === 'driver_payment') {
        totalDriverPayments += data.amount || 0;
      } else if (data.type === 'driver_collection') {
        totalDriverCollections += data.amount || 0;
      }
    });

    const netProfit = totalRevenue - totalExpense;
    const cashFlow = cardRevenue + totalDriverCollections - totalDriverPayments; // Kasadaki nakit akış

    return {
      // Gelirler
      totalRevenue,
      cashRevenue,
      cardRevenue,
      
      // Giderler
      totalExpense,
      totalDriverPayments,
      
      // Tahsilatlar
      totalDriverCollections,
      
      // Net durumlar
      netProfit,
      cashFlow,
      
      // Özet
      summary: {
        activeBalance: cashFlow,
        profitMargin: totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(2) : 0,
        totalTransactions: financialSnapshot.docs.length
      }
    };

  } catch (error) {
    console.error('❌ Şirket finansal durum alınamadı:', error);
    throw error;
  }
};

/**
 * Şoföre ödeme yapıldığında kayıt oluştur
 */
export const recordDriverPayment = async (driverId, driverType, driverName, amount, note = '') => {
  try {
    const paymentRecord = {
      id: `payment_${driverId}_${Date.now()}`,
      type: 'driver_payment',
      driverId: driverId,
      driverType: driverType, // 'regular' veya 'manual'
      driverName: driverName,
      amount: parseFloat(amount),
      note: note,
      date: new Date(),
      paymentMethod: 'manual', // Admin panelinden yapılan ödemeler
      category: 'driver_expense',
      processedBy: 'admin_manual',
      createdAt: new Date()
    };

    // Company financials koleksiyonuna kaydet
    await addDoc(collection(db, 'company_financials'), paymentRecord);

    // Financial transactions koleksiyonuna da kaydet (gelir-gider sekmesi için)
    const transactionRecord = {
      type: 'debit', // Gider
      amount: parseFloat(amount),
      description: `Şoför Ödemesi: ${driverName}${note ? ` - ${note}` : ''}`,
      category: 'Şoför Ödemesi',
      date: new Date().toISOString().split('T')[0],
      source: 'driver_payment',
      driverId: driverId,
      driverType: driverType,
      driverName: driverName,
      createdAt: new Date(),
      createdBy: 'admin'
    };

    await addDoc(collection(db, 'financial_transactions'), transactionRecord);

    console.log(`💳 Şoför ödemesi kaydedildi: ${driverName} - ${amount}€`);

    return {
      success: true,
      record: paymentRecord
    };

  } catch (error) {
    console.error('❌ Şoför ödeme kaydı oluşturulamadı:', error);
    throw error;
  }
};

/**
 * Şoförden tahsilat yapıldığında kayıt oluştur
 */
export const recordDriverCollection = async (driverId, driverType, driverName, amount, note = '') => {
  try {
    const collectionRecord = {
      id: `collection_${driverId}_${Date.now()}`,
      type: 'driver_collection',
      driverId: driverId,
      driverType: driverType, // 'regular' veya 'manual'
      driverName: driverName,
      amount: parseFloat(amount),
      note: note,
      date: new Date(),
      paymentMethod: 'manual', // Admin panelinden yapılan tahsilatlar
      category: 'driver_revenue',
      processedBy: 'admin_manual',
      createdAt: new Date()
    };

    // Company financials koleksiyonuna kaydet
    await addDoc(collection(db, 'company_financials'), collectionRecord);

    // Financial transactions koleksiyonuna da kaydet (gelir-gider sekmesi için)
    const transactionRecord = {
      type: 'credit', // Gelir
      amount: parseFloat(amount),
      description: `Şoförden Tahsilat: ${driverName}${note ? ` - ${note}` : ''}`,
      category: 'Şoförden Tahsilat',
      date: new Date().toISOString().split('T')[0],
      source: 'driver_collection',
      driverId: driverId,
      driverType: driverType,
      driverName: driverName,
      createdAt: new Date(),
      createdBy: 'admin'
    };

    await addDoc(collection(db, 'financial_transactions'), transactionRecord);

    console.log(`💰 Şoför tahsilatı kaydedildi: ${driverName} - ${amount}€`);

    return {
      success: true,
      record: collectionRecord
    };

  } catch (error) {
    console.error('❌ Şoför tahsilat kaydı oluşturulamadı:', error);
    throw error;
  }
};

/**
 * Manuel gider kaydı oluştur (işletme giderleri için)
 */
export const recordManualExpense = async (category, description, amount, note = '') => {
  try {
    const expenseRecord = {
      id: `expense_${Date.now()}`,
      type: 'manual_expense',
      category: category, // 'fuel', 'maintenance', 'office', 'marketing', vb.
      description: description,
      amount: parseFloat(amount),
      note: note,
      date: new Date(),
      processedBy: 'admin_manual',
      createdAt: new Date()
    };

    await addDoc(collection(db, 'company_financials'), expenseRecord);

    console.log(`💸 Manuel gider kaydedildi: ${description} - ${amount}€`);

    return {
      success: true,
      record: expenseRecord
    };

  } catch (error) {
    console.error('❌ Manuel gider kaydı oluşturulamadı:', error);
    throw error;
  }
};

/**
 * Finansal rapor verilerini getir (tarih aralığına göre)
 */
export const getFinancialReport = async (startDate, endDate) => {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Günün sonuna kadar

    // Basit sorgu - tüm finansal kayıtları getir, client tarafında filtrele
    const snapshot = await getDocs(collection(db, 'company_financials'));
    
    // Client tarafında tarih filtresi uygula
    const records = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(record => {
        const recordDate = record.date?.toDate ? record.date.toDate() : new Date(record.date);
        return recordDate >= start && recordDate <= end;
      });

    // Kategorilere ayır
    const reservationRecords = records.filter(r => r.type === 'reservation_completion');
    const driverPayments = records.filter(r => r.type === 'driver_payment');
    const driverCollections = records.filter(r => r.type === 'driver_collection');
    const manualExpenses = records.filter(r => r.type === 'manual_expense');

    // Toplamları hesapla
    const revenue = {
      total: reservationRecords.reduce((sum, r) => sum + (r.companyRevenue || 0), 0),
      cash: reservationRecords.filter(r => r.paymentMethod === 'cash').reduce((sum, r) => sum + (r.companyRevenue || 0), 0),
      card: reservationRecords.filter(r => r.paymentMethod !== 'cash').reduce((sum, r) => sum + (r.companyRevenue || 0), 0),
      reservationCount: reservationRecords.length
    };

    const expenses = {
      driverPayments: driverPayments.reduce((sum, r) => sum + (r.amount || 0), 0),
      manualExpenses: manualExpenses.reduce((sum, r) => sum + (r.amount || 0), 0),
      total: 0
    };
    expenses.total = expenses.driverPayments + expenses.manualExpenses;

    const collections = {
      driverCollections: driverCollections.reduce((sum, r) => sum + (r.amount || 0), 0)
    };

    const netProfit = revenue.total + collections.driverCollections - expenses.total;

    return {
      period: { startDate, endDate },
      revenue,
      expenses,
      collections,
      netProfit,
      records: {
        reservations: reservationRecords,
        driverPayments,
        driverCollections,
        manualExpenses
      },
      summary: {
        totalRecords: records.length,
        profitMargin: revenue.total > 0 ? ((netProfit / revenue.total) * 100).toFixed(2) : 0,
        averageReservationRevenue: revenue.reservationCount > 0 ? (revenue.total / revenue.reservationCount).toFixed(2) : 0
      }
    };

  } catch (error) {
    console.error('❌ Finansal rapor oluşturulamadı:', error);
    throw error;
  }
};

/**
 * Şoför bazlı finansal özet getir
 */
export const getDriverFinancialSummary = async (driverId, driverType = 'regular') => {
  try {
    // Şoförle ilgili tüm finansal kayıtları getir
    const financialQuery = query(
      collection(db, 'company_financials'),
      where('driverId', '==', driverId),
      orderBy('date', 'desc')
    );
    
    const snapshot = await getDocs(financialQuery);
    const records = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Rezervasyon kazançları
    const reservationRecords = records.filter(r => r.type === 'reservation_completion');
    const payments = records.filter(r => r.type === 'driver_payment');
    const collections = records.filter(r => r.type === 'driver_collection');

    const totalEarnings = reservationRecords.reduce((sum, r) => {
      // Şoförün bu rezervasyondan ne kadar kazandığını hesapla
      if (r.driverType === 'manual') {
        return sum + (r.companyExpense || 0); // Manuel şoföre ödenen
      } else {
        return sum + (r.companyExpense || 0); // Sistem şoförüne ödenen
      }
    }, 0);

    const totalPayments = payments.reduce((sum, r) => sum + (r.amount || 0), 0);
    const totalCollections = collections.reduce((sum, r) => sum + (r.amount || 0), 0);

    // Net bakiye hesapla
    const netBalance = totalEarnings - totalPayments + totalCollections;

    return {
      driverId,
      driverType,
      totalEarnings,
      totalPayments,
      totalCollections,
      netBalance,
      reservationCount: reservationRecords.length,
      records: {
        reservations: reservationRecords,
        payments,
        collections
      },
      summary: {
        averageEarningPerReservation: reservationRecords.length > 0 ? (totalEarnings / reservationRecords.length).toFixed(2) : 0,
        isProfitable: netBalance > 0
      }
    };

  } catch (error) {
    console.error('❌ Şoför finansal özeti alınamadı:', error);
    throw error;
  }
};

/**
 * Günlük finansal özet getir (dashboard için)
 */
export const getDailyFinancialSummary = async () => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

    const report = await getFinancialReport(startOfDay, endOfDay);

    return {
      today: report,
      quickStats: {
        todayRevenue: report.revenue.total,
        todayExpenses: report.expenses.total,
        todayProfit: report.netProfit,
        reservationCount: report.revenue.reservationCount
      }
    };

  } catch (error) {
    console.error('❌ Günlük finansal özet alınamadı:', error);
    throw error;
  }
};

/**
 * Aylık finansal trend getir
 */
export const getMonthlyFinancialTrend = async (monthsBack = 6) => {
  try {
    const trends = [];
    const currentDate = new Date();

    for (let i = monthsBack - 1; i >= 0; i--) {
      const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() - i + 1, 0);

      const monthReport = await getFinancialReport(monthStart, monthEnd);

      trends.push({
        month: monthStart.toISOString().slice(0, 7), // YYYY-MM format
        monthName: monthStart.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' }),
        revenue: monthReport.revenue.total,
        expenses: monthReport.expenses.total,
        profit: monthReport.netProfit,
        reservationCount: monthReport.revenue.reservationCount
      });
    }

    return trends;

  } catch (error) {
    console.error('❌ Aylık finansal trend alınamadı:', error);
    throw error;
  }
};

export default {
  getCompanyFinancialStatus,
  recordDriverPayment,
  recordDriverCollection,
  recordManualExpense,
  getFinancialReport,
  getDriverFinancialSummary,
  getDailyFinancialSummary,
  getMonthlyFinancialTrend
};
