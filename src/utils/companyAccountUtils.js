import { doc, getDoc, updateDoc, setDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Rezervasyon tamamlandığında şirket cari hesabını otomatik günceller
 * @param {string} reservationId - Rezervasyon ID
 * @param {object} reservationData - Rezervasyon verileri
 * @param {object} financialResult - Finansal işlem sonucu
 */
export const updateCompanyFinancials = async (reservationId, reservationData, financialResult) => {
  try {
    console.log('🏢 updateCompanyFinancials başlatıldı:', { reservationId, reservationData, financialResult });
    
    const {
      totalPrice,
      paymentMethod,
      customerInfo,
      tripDetails,
      manualDriverInfo,
      assignedDriver,
      assignedDriverId,
      driverId
    } = reservationData;

    // Şoför bilgileri
    const actualDriverId = assignedDriver || assignedDriverId || driverId;
    const isManualDriver = actualDriverId === 'manual' && manualDriverInfo;
    
    let driverName = 'Bilinmeyen Şoför';
    let driverAmount = 0;
    let companyAmount = 0;
    let driverType = 'regular';
    
    // Manuel şoför ise
    if (isManualDriver) {
      driverName = manualDriverInfo.name;
      driverAmount = parseFloat(manualDriverInfo.price) || 0;
      companyAmount = totalPrice - driverAmount;
      driverType = 'manual';
    } 
    // Sistem şoförü ise
    else if (actualDriverId) {
      // Şoför bilgilerini getir
      const driverDoc = await getDoc(doc(db, 'users', actualDriverId));
      if (driverDoc.exists()) {
        const driverData = driverDoc.data();
        driverName = `${driverData.firstName || ''} ${driverData.lastName || ''}`.trim();
        const commissionRate = driverData.commission || 20; // Varsayılan %20 komisyon
        const commission = (totalPrice * commissionRate) / 100;
        driverAmount = totalPrice - commission;
        companyAmount = commission;
      } else {
        console.error('Şoför bulunamadı:', actualDriverId);
      }
    }

    // Şirket için finansal kayıt
    let companyRevenue = 0;
    let companyExpense = 0;
    let transactionNote = '';

    // Ödeme metoduna göre cari hesap güncellemesi
    if (paymentMethod === 'cash') {
      // Nakit ödeme: Şoför müşteriden parayı aldı
      companyRevenue = companyAmount; // Şoförden alınacak komisyon
      transactionNote = `Nakit rezervasyon geliri (şoförden alınacak) - ${reservationId}`;
    } else if (paymentMethod === 'card' || paymentMethod === 'credit_card') {
      // Kart ödeme: Firma müşteriden parayı aldı
      companyRevenue = totalPrice;
      companyExpense = driverAmount; // Şoföre ödenecek tutar
      transactionNote = `Kart rezervasyon geliri ve şoför ödemesi - ${reservationId}`;
    }

    // Şirket cari hesap kaydını al veya oluştur
    const companyDocRef = doc(db, 'company_accounts', 'main_account');
    let companyData = {};
    
    try {
      const companyDoc = await getDoc(companyDocRef);
      if (companyDoc.exists()) {
        companyData = companyDoc.data();
      }
    } catch (error) {
      console.log('Şirket hesabı getirilemedi, yeni oluşturulacak', error);
    }

    // Mevcut bakiyeleri al
    const totalRevenueToDate = companyData.totalRevenueToDate || 0;
    const totalExpensesToDate = companyData.totalExpensesToDate || 0;
    const reservationsRevenue = companyData.reservationsRevenue || 0;
    const driverPayments = companyData.driverPayments || 0;
    const currentTransactions = companyData.transactions || [];

    // Yeni değerler
    const newRevenueToDate = totalRevenueToDate + companyRevenue;
    const newExpensesToDate = totalExpensesToDate + companyExpense;
    const newReservationsRevenue = reservationsRevenue + companyRevenue;
    const newDriverPayments = driverPayments + companyExpense;

    // İşlem kaydı oluştur
    const transaction = {
      id: Date.now().toString(),
      type: 'reservation_completed',
      revenueAmount: companyRevenue,
      expenseAmount: companyExpense,
      netAmount: companyRevenue - companyExpense,
      note: transactionNote,
      date: new Date(),
      reservationId: reservationId,
      paymentMethod: paymentMethod,
      totalPrice: totalPrice,
      driverAmount: driverAmount,
      companyAmount: companyAmount,
      driverId: actualDriverId,
      driverType: driverType,
      driverName: driverName,
      customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
      tripRoute: `${tripDetails.pickupLocation} → ${tripDetails.dropoffLocation}`
    };

    const updatedTransactions = [...currentTransactions, transaction];

    // Şirket belgesini güncelle/oluştur
    const updatedCompanyData = {
      totalRevenueToDate: newRevenueToDate,
      totalExpensesToDate: newExpensesToDate,
      reservationsRevenue: newReservationsRevenue,
      driverPayments: newDriverPayments,
      lastUpdated: new Date(),
      transactions: updatedTransactions
    };

    // setDoc kullanarak belgeyi oluştur/güncelle (merge: true ile)
    await setDoc(doc(db, 'company_accounts', 'main_account'), updatedCompanyData, { merge: true });

    console.log(`Şirket finansal kaydı güncellendi:`, {
      revenue: companyRevenue,
      expense: companyExpense,
      netAmount: companyRevenue - companyExpense,
      paymentMethod: paymentMethod
    });

    return {
      success: true,
      revenue: companyRevenue,
      expense: companyExpense,
      netAmount: companyRevenue - companyExpense,
      transaction: transaction
    };

  } catch (error) {
    console.error('Şirket finansal güncelleme hatası:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Şoföre manuel ödeme yapıldığında şirket finansal kaydını günceller
 * @param {string} driverId - Şoför ID
 * @param {string} driverType - Şoför tipi ('regular' veya 'manual')
 * @param {string} driverName - Şoför adı
 * @param {number} amount - Ödeme tutarı
 * @param {string} note - İşlem notu
 */
export const recordDriverPayment = async (driverId, driverType, driverName, amount, note) => {
  try {
    const companyDocRef = doc(db, 'company_accounts', 'main_account');
    let companyData = {};
    
    try {
      const companyDoc = await getDoc(companyDocRef);
      if (companyDoc.exists()) {
        companyData = companyDoc.data();
      }
    } catch (error) {
      console.log('Şirket hesabı getirilemedi, yeni oluşturulacak', error);
    }

    // Mevcut bakiyeleri al
    const totalExpensesToDate = companyData.totalExpensesToDate || 0;
    const driverPayments = companyData.driverPayments || 0;
    const currentTransactions = companyData.transactions || [];

    // Yeni değerler
    const newExpensesToDate = totalExpensesToDate + amount;
    const newDriverPayments = driverPayments + amount;

    // İşlem kaydı oluştur
    const transaction = {
      id: Date.now().toString(),
      type: 'driver_payment',
      revenueAmount: 0,
      expenseAmount: amount,
      netAmount: -amount,
      note: note || `Şoför Ödemesi - ${driverName}`,
      date: new Date(),
      driverId: driverId,
      driverType: driverType,
      driverName: driverName,
      paymentMethod: 'manual'
    };

    const updatedTransactions = [...currentTransactions, transaction];

    // Şirket belgesini güncelle
    const updatedCompanyData = {
      totalExpensesToDate: newExpensesToDate,
      driverPayments: newDriverPayments,
      lastUpdated: new Date(),
      transactions: updatedTransactions
    };

    await setDoc(doc(db, 'company_accounts', 'main_account'), updatedCompanyData, { merge: true });

    // Finansal işlem kaydı oluştur
    await addDoc(collection(db, 'financial_transactions'), {
      ...transaction,
      transactionType: 'expense',
      category: 'driver_payments',
      createdAt: new Date(),
      processedBy: 'admin_manual'
    });

    return {
      success: true,
      expense: amount,
      transaction: transaction
    };

  } catch (error) {
    console.error('Şirket finansal güncelleme hatası:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Şoförden tahsilat yapıldığında şirket finansal kaydını günceller
 * @param {string} driverId - Şoför ID
 * @param {string} driverType - Şoför tipi ('regular' veya 'manual')
 * @param {string} driverName - Şoför adı
 * @param {number} amount - Tahsilat tutarı
 * @param {string} note - İşlem notu
 */
export const recordDriverCollection = async (driverId, driverType, driverName, amount, note) => {
  try {
    const companyDocRef = doc(db, 'company_accounts', 'main_account');
    let companyData = {};
    
    try {
      const companyDoc = await getDoc(companyDocRef);
      if (companyDoc.exists()) {
        companyData = companyDoc.data();
      }
    } catch (error) {
      console.log('Şirket hesabı getirilemedi, yeni oluşturulacak', error);
    }

    // Mevcut bakiyeleri al
    const totalRevenueToDate = companyData.totalRevenueToDate || 0;
    const reservationsRevenue = companyData.reservationsRevenue || 0;
    const currentTransactions = companyData.transactions || [];

    // Yeni değerler
    const newRevenueToDate = totalRevenueToDate + amount;
    const newReservationsRevenue = reservationsRevenue + amount;

    // İşlem kaydı oluştur
    const transaction = {
      id: Date.now().toString(),
      type: 'driver_collection',
      revenueAmount: amount,
      expenseAmount: 0,
      netAmount: amount,
      note: note || `Şoför Tahsilatı - ${driverName}`,
      date: new Date(),
      driverId: driverId,
      driverType: driverType,
      driverName: driverName,
      paymentMethod: 'manual'
    };

    const updatedTransactions = [...currentTransactions, transaction];

    // Şirket belgesini güncelle
    const updatedCompanyData = {
      totalRevenueToDate: newRevenueToDate,
      reservationsRevenue: newReservationsRevenue,
      lastUpdated: new Date(),
      transactions: updatedTransactions
    };

    await setDoc(doc(db, 'company_accounts', 'main_account'), updatedCompanyData, { merge: true });

    // Finansal işlem kaydı oluştur
    await addDoc(collection(db, 'financial_transactions'), {
      ...transaction,
      transactionType: 'income',
      category: 'driver_collections',
      createdAt: new Date(),
      processedBy: 'admin_manual'
    });

    return {
      success: true,
      revenue: amount,
      transaction: transaction
    };

  } catch (error) {
    console.error('Şirket finansal güncelleme hatası:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
