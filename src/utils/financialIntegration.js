import { doc, updateDoc, getDoc, collection, addDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * İyileştirilmiş Finansal Entegrasyon Sistemi
 * 
 * ÖDEME Akışları:
 * 
 * 1. Sisteme Kayıtlı Şoförler:
 *    - Nakit: Şoför müşteriden alır → Şoför firmaya komisyon borçlu
 *    - Kart: Firma müşteri parayı alır → Firma şofore kazancını (komisyon düştükten sonra kalan) ödemeli
 * 
 * 2. Manuel Şoförler:
 *    - Nakit: Şoför müşteriden alır → Şoför firmaya (toplam - hak ediş) borçlu  
 *    - Kart: Firma müşteri parayı alır → Firma şoföre hak edişini ödemeli
 */

/**
 * Rezervasyon tamamlandığında şoför cari hesabını otomatik günceller
 * @param {string} reservationId - Rezervasyon ID
 * @param {object} reservationData - Rezervasyon verileri
 */
export const updateDriverFinancials = async (reservationId, reservationData) => {
  try {
    console.log('💰 updateDriverFinancials başlatıldı:', { reservationId, reservationData });
    
    const driverId = reservationData.assignedDriver || reservationData.assignedDriverId || reservationData.driverId;
    const {
      totalPrice,
      paymentMethod,
      customerInfo,
      tripDetails,
      manualDriverInfo
    } = reservationData;

    console.log('🔍 Driver bilgileri:', { driverId, totalPrice, paymentMethod, manualDriverInfo });

    // Manuel şoför kontrolü
    const isManualDriver = driverId === 'manual' && manualDriverInfo;
    
    if (isManualDriver) {
      console.log('➡️ Manuel şoför finansal işlemi çağrılıyor...');
      return await updateManualDriverFinancials(reservationId, reservationData);
    }

    if (!driverId || !totalPrice) {
      console.log('⚠️ Eksik veri: driverId veya totalPrice bulunamadı');
      return;
    }

    // Şoför bilgilerini users koleksiyonundan getir
    const driverDoc = await getDoc(doc(db, 'users', driverId));
    if (!driverDoc.exists()) {
      console.error('Şoför bulunamadı:', driverId);
      throw new Error(`Şoför bulunamadı: ${driverId}`);
    }

    const driverData = driverDoc.data();
    const commissionRate = driverData.commission || 15; // Şoför yönetimindeki % komisyon
    const commission = (totalPrice * commissionRate) / 100;
    const driverEarning = totalPrice - commission; // Şoförün kazancı (komisyon düştükten sonra)

    let balanceChange = 0;
    let transactionNote = '';

    // ÖDEME Metoduna göre cari hesap güncellemesi - DÜZELTİLMİŞ MANTIK
    if (paymentMethod === 'cash') {
      // Nakit ödeme: Şoför müşteriden tüm parayı aldı, firmaya komisyon borçlu
      balanceChange = -commission; // Negatif çünkü şofor firmaya komisyon borçlu
      transactionNote = `Nakit rezervasyon komisyon borcu - ${reservationId}`;
    } else if (paymentMethod === 'card' || paymentMethod === 'bank_transfer') {
      // Kart/Havale ödeme: Firma müşteriden parayı aldı, şofore kazancını ödemeli
      balanceChange = +driverEarning; // Pozitif çünkü firma şofore kazancını borçlu
      transactionNote = `Kart/Havale rezervasyon kazancı - ${reservationId}`;
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

    // Şoför belgesini güncelle (users koleksiyonunda)
    await updateDoc(doc(db, 'users', driverId), {
      balance: newBalance,
      transactions: updatedTransactions,
      lastTransactionDate: new Date(),
      // İstatistikleri güncelle
      totalEarnings: (driverData.totalEarnings || 0) + (balanceChange > 0 ? balanceChange : 0),
      totalCommission: (driverData.totalCommission || 0) + commission,
      completedTrips: (driverData.completedTrips || 0) + 1,
      // Ödeme metoduna göre istatistikler
      totalCashTrips: paymentMethod === 'cash' ? (driverData.totalCashTrips || 0) + 1 : (driverData.totalCashTrips || 0),
      totalCardTrips: (paymentMethod === 'card' || paymentMethod === 'credit_card') ? (driverData.totalCardTrips || 0) + 1 : (driverData.totalCardTrips || 0),
      // Finans özeti
      totalCashCommission: paymentMethod === 'cash' ? (driverData.totalCashCommission || 0) + commission : (driverData.totalCashCommission || 0),
      totalCardEarnings: (paymentMethod === 'card' || paymentMethod === 'credit_card') ? (driverData.totalCardEarnings || 0) + driverEarning : (driverData.totalCardEarnings || 0)
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

    // Şirket finansal durumunu güncelle
    const { updateCompanyFinancials } = await import('./companyAccountUtils');
    try {
      await updateCompanyFinancials(reservationId, reservationData, {
        success: true,
        oldBalance: currentBalance,
        newBalance: newBalance,
        transaction: transaction
      });
    } catch (error) {
      console.error('Şirket finansal güncelleme hatası:', error);
      // Şoför işlemi başarılı oldu, şirket güncellemesi başarısız olsa da devam et
    }

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

    // Şoförün doğru kişi olduğunu kontrol et (hem driverId hem assignedDriver field'larını kontrol et)
    const assignedDriverId = reservationData.assignedDriver || reservationData.assignedDriverId || reservationData.driverId;
    if (!assignedDriverId) {
      throw new Error('Bu rezervasyona şoför atanmamış');
    }

    // Rezervasyonu tamamlanmış olarak işaretle
    const updateData = {
      status: 'completed',
      completedAt: new Date(),
      qrScannedAt: new Date(),
      financialProcessed: true // Finansal işlemin yapıldığını işaretle
    };

    // scannedBy varsa ekle (undefined olamaz)
    if (scannedBy && scannedBy !== undefined && scannedBy !== null) {
      updateData.qrScannedBy = scannedBy;
    }

    await updateDoc(doc(db, 'reservations', reservationId), updateData);

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

    // Önce finansal güncellemeyi yap (rezervasyon henüz completed değilken)
    const financialResult = await updateDriverFinancials(reservationId, reservationData);

    // Sonra rezervasyonu tamamlanmış olarak işaretle
    await updateDoc(doc(db, 'reservations', reservationId), {
      status: 'completed',
      completedAt: new Date(),
      completedBy: completedBy,
      completionMethod: 'manual',
      financialProcessed: true // Finansal işlemin yapıldığını işaretle
    });

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

/**
 * Manuel şoför için finansal işlem
 * @param {string} reservationId - Rezervasyon ID
 * @param {object} reservationData - Rezervasyon verileri
 */
export const updateManualDriverFinancials = async (reservationId, reservationData) => {
  try {
    const {
      totalPrice,
      paymentMethod,
      customerInfo,
      tripDetails,
      manualDriverInfo
    } = reservationData;

    if (!manualDriverInfo || !manualDriverInfo.price) {
      console.log('Manuel şoför bilgileri veya hak ediş tutarı bulunamadı');
      return;
    }

    const driverEarning = parseFloat(manualDriverInfo.price);
    const driverName = manualDriverInfo.name;
    const driverPhone = manualDriverInfo.phone;
    const plateNumber = manualDriverInfo.plateNumber;

    // Manuel şoför için cari hesap ID'si oluştur (telefon numarasına göre)
    const manualDriverId = `manual_${driverPhone.replace(/[^0-9]/g, '')}`;

    let balanceChange = 0;
    let transactionNote = '';

    // Ödeme metoduna göre cari hesap güncellemesi
    if (paymentMethod === 'cash') {
      // Nakit ödeme: Manuel şoför müşteriden parayı aldı, bize hak ediş tutarını ödemeli
      balanceChange = -driverEarning; // Negatif çünkü manuel şoför firmaya borçlu
      transactionNote = `Nakit rezervasyon - Manuel şoför borcu - ${reservationId}`;
    } else if (paymentMethod === 'card' || paymentMethod === 'credit_card') {
      // Kart ödeme: Firma müşteriden parayı aldı, manuel şofore hak ediş ödemeli
      balanceChange = +driverEarning; // Pozitif çünkü firma manuel şofore borçlu
      transactionNote = `Kart rezervasyon - Manuel şoför alacağı - ${reservationId}`;
    }

    // Manuel şoför cari hesap kaydını kontrol et veya oluştur
    let manualDriverDoc;
    try {
      manualDriverDoc = await getDoc(doc(db, 'manual_drivers', manualDriverId));
    } catch (error) {
      console.log('Manuel şoför belgesi kontrol edilemedi:', error);
    }

    let currentBalance = 0;
    let currentTransactions = [];
    let totalEarnings = 0;
    let completedTrips = 0;

    if (manualDriverDoc && manualDriverDoc.exists()) {
      const driverData = manualDriverDoc.data();
      currentBalance = driverData.balance || 0;
      currentTransactions = driverData.transactions || [];
      totalEarnings = driverData.totalEarnings || 0;
      completedTrips = driverData.completedTrips || 0;
    }

    const newBalance = currentBalance + balanceChange;

    // İşlem kaydı oluştur
    const transaction = {
      id: Date.now().toString(),
      type: balanceChange > 0 ? 'earning' : 'debt',
      amount: Math.abs(balanceChange),
      note: transactionNote,
      date: new Date(),
      balanceBefore: currentBalance,
      balanceAfter: newBalance,
      reservationId: reservationId,
      paymentMethod: paymentMethod,
      totalPrice: totalPrice,
      driverEarning: driverEarning,
      customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
      tripRoute: `${tripDetails.pickupLocation} → ${tripDetails.dropoffLocation}`
    };

    const updatedTransactions = [...currentTransactions, transaction];

    // Manuel şoför belgesini güncelle/oluştur
    const manualDriverData = {
      name: driverName,
      phone: driverPhone,
      plateNumber: plateNumber,
      balance: newBalance,
      transactions: updatedTransactions,
      lastTransactionDate: new Date(),
      totalEarnings: totalEarnings + (balanceChange > 0 ? driverEarning : 0),
      completedTrips: completedTrips + 1,
      // Ödeme metoduna göre istatistikler
      totalCashTrips: paymentMethod === 'cash' ? 
        ((manualDriverDoc && manualDriverDoc.exists()) ? (manualDriverDoc.data().totalCashTrips || 0) + 1 : 1) : 
        ((manualDriverDoc && manualDriverDoc.exists()) ? (manualDriverDoc.data().totalCashTrips || 0) : 0),
      totalCardTrips: (paymentMethod === 'card' || paymentMethod === 'credit_card') ? 
        ((manualDriverDoc && manualDriverDoc.exists()) ? (manualDriverDoc.data().totalCardTrips || 0) + 1 : 1) : 
        ((manualDriverDoc && manualDriverDoc.exists()) ? (manualDriverDoc.data().totalCardTrips || 0) : 0),
      // Finans özeti
      totalCashDebt: paymentMethod === 'cash' ? 
        ((manualDriverDoc && manualDriverDoc.exists()) ? (manualDriverDoc.data().totalCashDebt || 0) + Math.abs(balanceChange) : Math.abs(balanceChange)) :
        ((manualDriverDoc && manualDriverDoc.exists()) ? (manualDriverDoc.data().totalCashDebt || 0) : 0),
      totalCardEarnings: (paymentMethod === 'card' || paymentMethod === 'credit_card') ? 
        ((manualDriverDoc && manualDriverDoc.exists()) ? (manualDriverDoc.data().totalCardEarnings || 0) + driverEarning : driverEarning) :
        ((manualDriverDoc && manualDriverDoc.exists()) ? (manualDriverDoc.data().totalCardEarnings || 0) : 0),
      createdAt: manualDriverDoc && manualDriverDoc.exists() ? undefined : new Date(),
      updatedAt: new Date(),
      type: 'manual_driver'
    };

    // Undefined değerleri temizle
    Object.keys(manualDriverData).forEach(key => {
      if (manualDriverData[key] === undefined) {
        delete manualDriverData[key];
      }
    });

    // setDoc kullanarak belgeyi oluştur/güncelle (merge: true ile)
    await setDoc(doc(db, 'manual_drivers', manualDriverId), manualDriverData, { merge: true });

    // Ayrıca finansal işlem kaydı oluştur (raporlama için)
    await addDoc(collection(db, 'financial_transactions'), {
      ...transaction,
      driverId: manualDriverId,
      driverType: 'manual',
      driverName: driverName,
      driverPhone: driverPhone,
      plateNumber: plateNumber,
      createdAt: new Date(),
      processedBy: 'system_auto'
    });

    console.log(`Manuel şoför ${driverName} cari hesabı güncellendi:`, {
      oldBalance: currentBalance,
      newBalance: newBalance,
      change: balanceChange,
      paymentMethod: paymentMethod
    });

    // Şirket finansal durumunu güncelle
    const { updateCompanyFinancials } = await import('./companyAccountUtils');
    try {
      await updateCompanyFinancials(reservationId, reservationData, {
        success: true,
        oldBalance: currentBalance,
        newBalance: newBalance,
        transaction: transaction,
        driverType: 'manual',
        driverName: driverName
      });
    } catch (error) {
      console.error('Şirket finansal güncelleme hatası:', error);
      // Şoför işlemi başarılı oldu, şirket güncellemesi başarısız olsa da devam et
    }

    return {
      success: true,
      oldBalance: currentBalance,
      newBalance: newBalance,
      transaction: transaction,
      driverType: 'manual',
      driverName: driverName
    };

  } catch (error) {
    console.error('Manuel şoför finansal güncelleme hatası:', error);
    throw error;
  }
};
