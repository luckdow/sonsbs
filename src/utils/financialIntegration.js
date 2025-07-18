import { doc, updateDoc, getDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Rezervasyon tamamlandığında şoför cari hesabını otomatik günceller
 * @param {string} reservationId - Rezervasyon ID
 * @param {object} reservationData - Rezervasyon verileri
 */
export const updateDriverFinancials = async (reservationId, reservationData) => {
  try {
    const {
      driverId,
      totalPrice,
      paymentMethod,
      customerInfo,
      tripDetails
    } = reservationData;

    if (!driverId || !totalPrice) {
      console.log('Eksik veri: driverId veya totalPrice bulunamadı');
      return;
    }

    // Şoför bilgilerini getir
    const driverDoc = await getDoc(doc(db, 'drivers', driverId));
    if (!driverDoc.exists()) {
      console.error('Şoför bulunamadı:', driverId);
      return;
    }

    const driverData = driverDoc.data();
    const commissionRate = driverData.commissionRate || 15; // %15 varsayılan
    const commission = (totalPrice * commissionRate) / 100;
    const driverEarning = totalPrice - commission;

    let balanceChange = 0;
    let transactionNote = '';

    // Ödeme metoduna göre cari hesap güncellemesi
    if (paymentMethod === 'cash') {
      // Nakit ödeme: Şoför müşteriden parayı aldı, komisyon borcu var
      balanceChange = -commission; // Negatif çünkü şoför firmaya komisyon borçlu
      transactionNote = `Nakit rezervasyon komisyonu - ${reservationId}`;
    } else if (paymentMethod === 'card' || paymentMethod === 'credit_card') {
      // Kart ödeme: Firma müşteriden parayı aldı, şofore ödeme yapacak
      balanceChange = +driverEarning; // Pozitif çünkü firma şofore borçlu
      transactionNote = `Kart rezervasyon kazancı - ${reservationId}`;
    }

    // Mevcut bakiyeyi al
    const currentBalance = driverData.balance || 0;
    const newBalance = currentBalance + balanceChange;

    // İşlem kaydı oluştur
    const transaction = {
      id: Date.now().toString(),
      type: balanceChange > 0 ? 'earning' : 'commission_debt',
      amount: Math.abs(balanceChange),
      note: transactionNote,
      date: new Date(),
      balanceBefore: currentBalance,
      balanceAfter: newBalance,
      reservationId: reservationId,
      paymentMethod: paymentMethod,
      totalPrice: totalPrice,
      commission: commission,
      customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
      tripRoute: `${tripDetails.pickupLocation} → ${tripDetails.dropoffLocation}`
    };

    // Mevcut işlemleri al
    const currentTransactions = driverData.transactions || [];
    const updatedTransactions = [...currentTransactions, transaction];

    // Şoför belgesini güncelle
    await updateDoc(doc(db, 'drivers', driverId), {
      balance: newBalance,
      transactions: updatedTransactions,
      lastTransactionDate: new Date(),
      // İstatistikleri güncelle
      totalEarnings: (driverData.totalEarnings || 0) + (balanceChange > 0 ? balanceChange : 0),
      totalCommission: (driverData.totalCommission || 0) + commission,
      completedTrips: (driverData.completedTrips || 0) + 1
    });

    // Ayrıca finansal işlem kaydı oluştur (raporlama için)
    await addDoc(collection(db, 'financial_transactions'), {
      ...transaction,
      driverId: driverId,
      createdAt: new Date(),
      processedBy: 'system_auto'
    });

    console.log(`Şoför ${driverId} cari hesabı güncellendi:`, {
      oldBalance: currentBalance,
      newBalance: newBalance,
      change: balanceChange,
      paymentMethod: paymentMethod
    });

    return {
      success: true,
      oldBalance: currentBalance,
      newBalance: newBalance,
      transaction: transaction
    };

  } catch (error) {
    console.error('Şoför finansal güncelleme hatası:', error);
    throw error;
  }
};

/**
 * QR kod okunduğunda rezervasyonu tamamla ve finansal güncelleme yap
 * @param {string} reservationId - Rezervasyon ID
 * @param {string} scannedBy - QR kodu tarayan kişi (şoför ID)
 */
export const processQRScanCompletion = async (reservationId, scannedBy) => {
  try {
    // Rezervasyon bilgilerini getir
    const reservationDoc = await getDoc(doc(db, 'reservations', reservationId));
    if (!reservationDoc.exists()) {
      throw new Error('Rezervasyon bulunamadı');
    }

    const reservationData = reservationDoc.data();
    
    // Rezervasyonun durumunu kontrol et
    if (reservationData.status === 'completed') {
      throw new Error('Bu rezervasyon zaten tamamlanmış');
    }

    // Şoförün doğru kişi olduğunu kontrol et
    if (reservationData.driverId !== scannedBy) {
      throw new Error('Bu rezervasyon size atanmamış');
    }

    // Rezervasyonu tamamlanmış olarak işaretle
    await updateDoc(doc(db, 'reservations', reservationId), {
      status: 'completed',
      completedAt: new Date(),
      qrScannedAt: new Date(),
      qrScannedBy: scannedBy,
      financialProcessed: true // Finansal işlemin yapıldığını işaretle
    });

    // Finansal güncellemeyi yap
    const financialResult = await updateDriverFinancials(reservationId, reservationData);

    return {
      success: true,
      message: 'Rezervasyon başarıyla tamamlandı',
      reservation: reservationData,
      financial: financialResult
    };

  } catch (error) {
    console.error('QR scan completion error:', error);
    throw error;
  }
};

/**
 * Manuel rezervasyon tamamlama (admin panelinden)
 * @param {string} reservationId - Rezervasyon ID
 * @param {string} completedBy - Tamamlayan admin ID
 */
export const manualCompleteReservation = async (reservationId, completedBy) => {
  try {
    const reservationDoc = await getDoc(doc(db, 'reservations', reservationId));
    if (!reservationDoc.exists()) {
      throw new Error('Rezervasyon bulunamadı');
    }

    const reservationData = reservationDoc.data();
    
    if (reservationData.status === 'completed') {
      throw new Error('Bu rezervasyon zaten tamamlanmış');
    }

    // Rezervasyonu tamamlanmış olarak işaretle
    await updateDoc(doc(db, 'reservations', reservationId), {
      status: 'completed',
      completedAt: new Date(),
      completedBy: completedBy,
      completionMethod: 'manual',
      financialProcessed: true // Finansal işlemin yapıldığını işaretle
    });

    // Finansal güncellemeyi yap
    const financialResult = await updateDriverFinancials(reservationId, reservationData);

    return {
      success: true,
      message: 'Rezervasyon manuel olarak tamamlandı',
      reservation: reservationData,
      financial: financialResult
    };

  } catch (error) {
    console.error('Manual completion error:', error);
    throw error;
  }
};
