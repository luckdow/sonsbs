import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw, CheckCircle, Calendar, CalendarDays, Clock } from 'lucide-react';
import { collection, onSnapshot, addDoc, updateDoc, doc, serverTimestamp, query, where, deleteDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { USER_ROLES } from '../../../config/constants';
import { manualCompleteReservation } from '../../../utils/financialIntegration_IMPROVED';
import QuickReservationModal from './QuickReservationModal';
import EditReservationModal from './EditReservationModal';
import ReservationTable from './ReservationTable';
import ReservationFilters from './ReservationFilters';
import DriverAssignModal from './DriverAssignModal';
import QRModal from './QRModal';
import { sendWhatsAppMessage, generateManualDriverWhatsAppMessage } from '../../../utils/whatsappService';
import { generateManualDriverPDF } from '../../../utils/pdfGenerator';
import { sendBookingConfirmationEmail } from '../../../services/emailService';
import { sendDriverAssignmentEmail } from '../../../services/emailService';
import toast from 'react-hot-toast';

const ReservationIndex = () => {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [activeTab, setActiveTab] = useState('today'); // Aktif tab
  
  // Yıllık takvim state'leri
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  
  // Modal durumları
  const [showQuickModal, setShowQuickModal] = useState(false);
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);

  // Rezervasyonları kategorize etme fonksiyonu
  const categorizeReservations = (reservations) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const oneWeekLater = new Date(today);
    oneWeekLater.setDate(oneWeekLater.getDate() + 7);
    
    const oneMonthLater = new Date(today);
    oneMonthLater.setDate(oneMonthLater.getDate() + 30);

    return {
      today: reservations.filter(r => {
        const reservationDate = new Date(r.tripDetails?.date || r.date);
        reservationDate.setHours(0, 0, 0, 0);
        return reservationDate.getTime() === today.getTime() && 
               !['cancelled', 'completed'].includes(r.status);
      }),
      thisWeek: reservations.filter(r => {
        const reservationDate = new Date(r.tripDetails?.date || r.date);
        reservationDate.setHours(0, 0, 0, 0);
        return reservationDate > today && 
               reservationDate < oneWeekLater && 
               !['cancelled', 'completed'].includes(r.status);
      }),
      thisMonth: reservations.filter(r => {
        const reservationDate = new Date(r.tripDetails?.date || r.date);
        reservationDate.setHours(0, 0, 0, 0);
        return reservationDate >= oneWeekLater && 
               reservationDate < oneMonthLater && 
               !['cancelled', 'completed'].includes(r.status);
      }),
      assigned: reservations.filter(r => r.status === 'assigned'), // Şoför atananlar
      completed: reservations.filter(r => r.status === 'completed'),
      cancelled: reservations.filter(r => r.status === 'cancelled'),
      pending: reservations.filter(r => r.status === 'pending' || r.status === 'confirmed'),
      all: reservations.filter(r => !['cancelled', 'completed'].includes(r.status)) // Tüm aktif rezervasyonlar
    };
  };

  // Yıllık takvim için rezervasyonları organize etme
  const getReservationsByDate = (reservations) => {
    const reservationsByDate = {};
    
    reservations.forEach(reservation => {
      const date = reservation.tripDetails?.date || reservation.date;
      if (date) {
        const [year, month, day] = date.split('-');
        
        if (!reservationsByDate[year]) {
          reservationsByDate[year] = {};
        }
        if (!reservationsByDate[year][month]) {
          reservationsByDate[year][month] = {};
        }
        if (!reservationsByDate[year][month][day]) {
          reservationsByDate[year][month] = reservationsByDate[year][month] || {};
          reservationsByDate[year][month][day] = [];
        }
        
        reservationsByDate[year][month][day].push(reservation);
      }
    });
    
    return reservationsByDate;
  };

  // Mevcut yılları al
  const getAvailableYears = (reservations) => {
    const years = new Set();
    const currentYear = new Date().getFullYear();
    
    // En az mevcut yılı ekle
    years.add(currentYear);
    
    reservations.forEach(reservation => {
      const date = reservation.tripDetails?.date || reservation.date;
      if (date) {
        const year = parseInt(date.split('-')[0]);
        years.add(year);
      }
    });
    
    return Array.from(years).sort((a, b) => a - b);
  };

  // Ay isimleri
  const monthNames = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];

  // Seçili tarihe göre rezervasyonları filtrele
  const getFilteredReservations = () => {
    if (selectedDay && selectedMonth && selectedYear) {
      // Belirli bir gün seçili
      const targetDate = `${selectedYear}-${selectedMonth.toString().padStart(2, '0')}-${selectedDay.toString().padStart(2, '0')}`;
      return reservations.filter(r => {
        const reservationDate = r.tripDetails?.date || r.date;
        return reservationDate === targetDate;
      });
    } else if (selectedMonth && selectedYear) {
      // Belirli bir ay seçili
      const targetYearMonth = `${selectedYear}-${selectedMonth.toString().padStart(2, '0')}`;
      return reservations.filter(r => {
        const reservationDate = r.tripDetails?.date || r.date;
        return reservationDate && reservationDate.startsWith(targetYearMonth);
      });
    } else if (selectedYear) {
      // Belirli bir yıl seçili
      const targetYear = selectedYear.toString();
      return reservations.filter(r => {
        const reservationDate = r.tripDetails?.date || r.date;
        return reservationDate && reservationDate.startsWith(targetYear);
      });
    } else {
      // Normal kategorize edilmiş rezervasyonlar
      const categorized = categorizeReservations(reservations);
      return categorized[activeTab] || [];
    }
  };

  // Firebase'den rezervasyonları dinle
  useEffect(() => {
    setLoading(true);

    // Firebase listener'ları
    const unsubscribeReservations = onSnapshot(
      collection(db, 'reservations'),
      (snapshot) => {
        const reservationData = snapshot.docs.map(doc => {
          const data = doc.data();
          
          return {
            id: doc.id,
            ...data
          };
        });
        
        setReservations(reservationData);
        setLoading(false);
      },
      (error) => {
        // Hata durumunda sessizce yoksay
        setReservations([]);
        setLoading(false);
      }
    );

    const driversQuery = query(
      collection(db, 'users'),
      where('role', '==', USER_ROLES.DRIVER)
    );
    
    const unsubscribeDrivers = onSnapshot(
      driversQuery,
      (snapshot) => {
        const driverData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          // DriverAssignModal ile uyumlu format
          firstName: doc.data().firstName || '',
          lastName: doc.data().lastName || '',
          name: doc.data().firstName && doc.data().lastName 
            ? `${doc.data().firstName} ${doc.data().lastName}`
            : doc.data().name || doc.data().email,
          phone: doc.data().phone || '',
          licenseNumber: doc.data().licenseNumber || 'Belirtilmemiş',
          assignedVehicle: doc.data().assignedVehicle || null,
          vehicle: doc.data().assignedVehicle || 'Atanmamış',
          status: doc.data().isActive !== false ? 'active' : 'inactive' // Default olarak active
        }));
        
        setDrivers(driverData);
      },
      (error) => {
        // Hata durumunda sessizce yoksay
        setDrivers([]);
      }
    );

    const vehiclesQuery = query(
      collection(db, 'vehicles'),
      where('status', '==', 'active')
    );
    
    const unsubscribeVehicles = onSnapshot(
      vehiclesQuery,
      (snapshot) => {
        const vehicleData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setVehicles(vehicleData);
      },
      (error) => {
        // Hata durumunda sessizce yoksay
        setVehicles([]);
      }
    );

    return () => {
      unsubscribeReservations();
      unsubscribeDrivers();
      unsubscribeVehicles();
    };
  }, []);

  // Hızlı rezervasyon ekleme - EmailJS entegrasyonu ile
  const handleQuickReservation = async (reservationData) => {
    try {
      const reservationId = `SBS-${Date.now()}`;
      
      // Otomatik şifre oluştur
      const tempPassword = Math.random().toString(36).slice(-8);
      
      const newReservation = {
        ...reservationData,
        reservationId: reservationId,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tempPassword: tempPassword // Geçici şifreyi rezervasyona ekle
      };
      
      // Otomatik kullanıcı hesabı oluştur
      try {
        const { createUserWithEmailAndPassword } = await import('firebase/auth');
        const { auth } = await import('../../../config/firebase');
        
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          reservationData.customerInfo.email,
          tempPassword
        );
        
        // Kullanıcı profilini güncelle
        const { updateProfile } = await import('firebase/auth');
        await updateProfile(userCredential.user, {
          displayName: `${reservationData.customerInfo.firstName} ${reservationData.customerInfo.lastName}`
        });
        
        // Kullanıcı dokümanı oluştur
        const { setDoc } = await import('firebase/firestore');
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          email: reservationData.customerInfo.email,
          firstName: reservationData.customerInfo.firstName,
          lastName: reservationData.customerInfo.lastName,
          phone: reservationData.customerInfo.phone,
          createdAt: new Date().toISOString(),
          role: 'customer',
          tempPassword: tempPassword,
          createdBy: 'admin_quick_reservation'
        });
        
        console.log('✅ Otomatik kullanıcı hesabı oluşturuldu:', userCredential.user.uid);
        
      } catch (authError) {
        console.log('ℹ️ Kullanıcı zaten mevcut veya hesap oluşturulamadı:', authError.message);
        // Hata olsa bile devam et
      }
      
      // Firebase'a ekle
      const docRef = await addDoc(collection(db, 'reservations'), newReservation);
      
      // QR kod oluştur
      const QRCode = await import('qrcode');
      const qrText = `Gate Transfer - Rezervasyon: ${reservationId} - Tel: ${reservationData.customerInfo.phone}`;
      const qrCodeUrl = await QRCode.toDataURL(qrText, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      // Email gönder
      try {
        await sendBookingConfirmationEmail({
          customerName: `${reservationData.customerInfo.firstName} ${reservationData.customerInfo.lastName}`,
          customerEmail: reservationData.customerInfo.email,
          customerPhone: reservationData.customerInfo.phone,
          reservationId: reservationId,
          pickupLocation: reservationData.tripDetails.pickupLocation,
          dropoffLocation: reservationData.tripDetails.dropoffLocation,
          tripDate: reservationData.tripDetails.date,
          tripTime: reservationData.tripDetails.time,
          passengerCount: reservationData.tripDetails.passengerCount,
          totalPrice: reservationData.totalPrice,
          paymentMethod: reservationData.paymentMethod,
          qrCodeUrl: qrCodeUrl,
          tripType: reservationData.tripDetails.tripType === 'round-trip' ? 'Gidiş-Dönüş' : 'Tek Yön',
          tempPassword: tempPassword, // Geçici şifreyi email'e ekle
          isNewUser: true // Admin panelinden eklenenler hep yeni kullanıcı
        });
        toast.success('Rezervasyon eklendi ve onay e-postası gönderildi!');
      } catch (emailError) {
        console.error('Email gönderimi hatası:', emailError);
        toast.success('Rezervasyon eklendi ancak e-posta gönderilemedi.');
      }
      
      setShowQuickModal(false);
      
    } catch (error) {
      console.error('Rezervasyon ekleme hatası:', error);
      toast.error('Rezervasyon eklenirken bir hata oluştu: ' + error.message);
    }
  };

  // Şoför atama - Sistemdeki şoförler ve manuel şoförler
  const handleDriverAssign = async (reservationId, driverId, vehicleId, manualDriverInfo = null) => {
    try {
      
      // Rezervasyonu bul
      const reservationToUpdate = reservations.find(res => res.id === reservationId);
      if (!reservationToUpdate) {
      // Debug log removed
        toast.error('Rezervasyon bulunamadı');
        return;
      }

      setSelectedReservation({
        id: reservationToUpdate.id,
        reservationId: reservationToUpdate.reservationId,
        currentStatus: reservationToUpdate.status,
        currentAssignedDriver: reservationToUpdate.assignedDriver,
        currentAssignedDriverId: reservationToUpdate.assignedDriverId
      });

      if (manualDriverInfo) {
        // Manuel şoför ataması
        
        // Güncellenecek veri
        const updateData = {
          assignedDriver: 'manual', // Manuel şoför işaretlemesi
          assignedDriverId: 'manual',
          manualDriverInfo: manualDriverInfo, // Manuel şoför bilgileri
          assignedVehicle: manualDriverInfo.plateNumber, // Plaka bilgisi
          status: 'assigned',
          updatedAt: new Date().toISOString()
        };

        // Firebase'de güncelle
        await updateDoc(doc(db, 'reservations', reservationId), updateData);
        
        // E-posta gönder
        try {
          await sendDriverAssignmentEmail({
            customerName: `${reservationToUpdate.customerInfo?.firstName || ''} ${reservationToUpdate.customerInfo?.lastName || ''}`.trim(),
            customerEmail: reservationToUpdate.customerInfo?.email,
            reservationId: reservationToUpdate.reservationId || reservationToUpdate.reservationCode,
            driverName: manualDriverInfo.name,
            driverPhone: manualDriverInfo.phone,
            vehiclePlate: manualDriverInfo.plateNumber || '',
            pickupLocation: reservationToUpdate.tripDetails?.pickupLocation || '',
            dropoffLocation: reservationToUpdate.tripDetails?.dropoffLocation || '',
            tripDate: reservationToUpdate.tripDetails?.date || '',
            tripTime: reservationToUpdate.tripDetails?.time || ''
          });
          console.log('✅ Şoför atama e-postası gönderildi');
        } catch (emailError) {
          console.error('❌ Şoför atama e-postası hatası:', emailError);
          // E-posta hatası rezervasyon atamayı engellemez
        }
        
        // WhatsApp mesajı gönder
        try {
          const whatsappMessage = generateManualDriverWhatsAppMessage(reservationToUpdate, manualDriverInfo);
          sendWhatsAppMessage(manualDriverInfo.phone, whatsappMessage);
        } catch (whatsappError) {
      // Debug log removed
          toast.error('WhatsApp gönderimi başarısız: ' + whatsappError.message);
        }
        
        // PDF oluştur ve indir
        try {
          const companyInfo = {
            name: 'SBS TURKEY TURİZM SANAYİ VE TİCARET LİMİTED ŞİRKETİ',
            address: 'GÜZELYURT MAH. SERİK CAD. NO: 138 /2 AKSU/ ANTALYA',
            phone: '+90 532 574 26 82',
            email: 'sbstravel@gmail.com',
            website: 'www.gatetransfer.com'
          };
          
          const pdfResult = await generateManualDriverPDF(reservationToUpdate, manualDriverInfo, companyInfo);
          
          // PDF başarıyla oluşturuldu mesajı
          if (pdfResult) {
            console.log('PDF başarıyla oluşturuldu ve indirildi');
          }
          
        } catch (pdfError) {
          console.error('PDF oluşturma hatası:', pdfError);
          alert('PDF oluşturulurken bir hata oluştu: ' + pdfError.message);
        }
        
        // Pop-up bildirimi kaldırıldı - sadece işlem sonucu gösterilecek
        // toast.success(`Manuel şoför (${manualDriverInfo.name}) atandı! WhatsApp gönderildi ve PDF indirildi.`);
        
      } else {
        // Normal sistem şoförü ataması
        const updateData = {
          assignedDriver: driverId,
          assignedDriverId: driverId,
          assignedVehicle: vehicleId, 
          status: 'assigned',
          updatedAt: new Date().toISOString()
        };

        // Firebase'de güncelle
        const cleanUpdateData = Object.keys(updateData).reduce((acc, key) => {
          if (updateData[key] !== undefined && updateData[key] !== null) {
            acc[key] = updateData[key];
          }
          return acc;
        }, {});

        
        await updateDoc(doc(db, 'reservations', reservationId), cleanUpdateData);
        
        // Sistem şoförü için e-posta gönder
        try {
          const assignedDriver = drivers.find(d => d.id === driverId);
          const assignedVehicle = vehicles.find(v => v.id === vehicleId);
          
          if (assignedDriver && reservationToUpdate.customerInfo?.email) {
            await sendDriverAssignmentEmail({
              customerName: `${reservationToUpdate.customerInfo?.firstName || ''} ${reservationToUpdate.customerInfo?.lastName || ''}`.trim(),
              customerEmail: reservationToUpdate.customerInfo?.email,
              reservationId: reservationToUpdate.reservationId || reservationToUpdate.reservationCode,
              driverName: `${assignedDriver.firstName || ''} ${assignedDriver.lastName || ''}`.trim(),
              driverPhone: assignedDriver.phone || '',
              vehiclePlate: assignedVehicle?.plateNumber || '',
              pickupLocation: reservationToUpdate.tripDetails?.pickupLocation || '',
              dropoffLocation: reservationToUpdate.tripDetails?.dropoffLocation || '',
              tripDate: reservationToUpdate.tripDetails?.date || '',
              tripTime: reservationToUpdate.tripDetails?.time || ''
            });
            console.log('✅ Sistem şoför atama e-postası gönderildi');
          }
        } catch (emailError) {
          console.error('❌ Sistem şoför atama e-postası hatası:', emailError);
          // E-posta hatası rezervasyon atamayı engellemez
        }
        
        toast.success('Şoför başarıyla atandı!');
      }
      
      setShowDriverModal(false);
      setSelectedReservation(null);
      
    } catch (error) {
      // Debug log removed
      toast.error('Şoför atama sırasında bir hata oluştu: ' + error.message);
    }
  };

  // Rezervasyon güncelleme - Sadece gerçek Firebase veriler
  const handleReservationUpdate = async (reservationId, updatedData) => {
    try {
      // Rezervasyonu bul
      const reservationToUpdate = reservations.find(res => res.id === reservationId);
      if (!reservationToUpdate) {
      // Debug log removed
        toast.error('Rezervasyon bulunamadı');
        return;
      }

      // Firebase'de güncelle
      await updateDoc(doc(db, 'reservations', reservationId), {
        ...updatedData,
        updatedAt: new Date().toISOString()
      });
      
      setShowEditModal(false);
      setSelectedReservation(null);
      toast.success('Rezervasyon başarıyla güncellendi!');
    } catch (error) {
      // Debug log removed
      toast.error('Rezervasyon güncellenirken bir hata oluştu: ' + error.message);
    }
  };

  // Manuel rezervasyon tamamlama - Sadece gerçek Firebase veriler
  const handleCompleteReservation = async (reservationId) => {
    try {
      const reservation = reservations.find(r => r.id === reservationId);
      if (!reservation) {
        toast.error('Rezervasyon bulunamadı');
        return;
      }

      if (reservation.status === 'completed') {
        toast.error('Bu rezervasyon zaten tamamlanmış');
        return;
      }

      // Şoför atama kontrolü - assignedDriver veya assignedDriverId kullan
      const driverId = reservation.assignedDriver || reservation.assignedDriverId || reservation.driverId;
      if (!driverId) {
        toast.error('Rezervasyona şoför atanmamış');
        return;
      }

      // Firebase rezervasyon için finansal entegrasyon
      const result = await manualCompleteReservation(reservationId, 'admin-user');
      
      // Başarı mesajı
      const paymentMsg = reservation.paymentMethod === 'cash' 
        ? 'Şoför komisyon borcu eklendi' 
        : 'Şoför alacağı eklendi';
      
      toast.success(`Rezervasyon tamamlandı! ${paymentMsg}`);
      
    } catch (error) {
      // Debug log removed
      toast.error('Rezervasyon tamamlanırken hata oluştu: ' + error.message);
    }
  };

  // Rezervasyon silme
  const handleDeleteReservation = async (reservationId) => {
    if (!window.confirm('Bu rezervasyonu silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      // Firebase'den sil
      await deleteDoc(doc(db, 'reservations', reservationId));
      
      // Local state'den kaldırma - Firebase listener otomatik güncelleyecek
      // setReservations(prev => prev.filter(res => res.id !== reservationId)); // Bu satırı kaldırıyoruz
      
      toast.success('Rezervasyon başarıyla silindi!');
    } catch (error) {
      // Debug log removed
      toast.error('Rezervasyon silinirken bir hata oluştu: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Rezervasyonlar yükleniyor...</span>
        </div>
      </div>
    );
  }

  const categorizedReservations = categorizeReservations(reservations);
  const reservationsByDate = getReservationsByDate(reservations);
  const availableYears = getAvailableYears(reservations);
  
  // Aktif tab'daki rezervasyonları filtrele
  const currentReservations = getFilteredReservations();

  const tabConfig = [
    { key: 'today', label: 'Bugün', count: categorizedReservations.today.length, color: 'text-red-600 bg-red-50' },
    { key: 'thisWeek', label: 'Bu Hafta', count: categorizedReservations.thisWeek.length, color: 'text-purple-600 bg-purple-50' },
    { key: 'thisMonth', label: 'Bu Ay', count: categorizedReservations.thisMonth.length, color: 'text-indigo-600 bg-indigo-50' },
    { key: 'assigned', label: 'Şoför Atananlar', count: categorizedReservations.assigned.length, color: 'text-orange-600 bg-orange-50' },
    { key: 'calendar', label: 'Yıllık Takvim', count: 0, color: 'text-blue-600 bg-blue-50', isSpecial: true, icon: Calendar },
    { key: 'all', label: 'Tüm Rezervasyonlar', count: categorizedReservations.all.length, color: 'text-slate-600 bg-slate-50' },
    { key: 'pending', label: 'Bekleyen', count: categorizedReservations.pending.length, color: 'text-yellow-600 bg-yellow-50' },
    { key: 'completed', label: 'Tamamlanan', count: categorizedReservations.completed.length, color: 'text-green-600 bg-green-50' },
    { key: 'cancelled', label: 'İptal', count: categorizedReservations.cancelled.length, color: 'text-gray-600 bg-gray-50' }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Rezervasyon Yönetimi</h1>
            <p className="text-gray-600 mt-1">
              Toplam {reservations.length} rezervasyon • {currentReservations.length} {tabConfig.find(t => t.key === activeTab)?.label.toLowerCase()} rezervasyon
            </p>
          </div>
          <button
            onClick={() => setShowQuickModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Hızlı Rezervasyon Ekle
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1">
        <div className="flex flex-wrap gap-1">
          {tabConfig.map(tab => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                if (tab.key !== 'calendar') {
                  // Normal tab seçildi, takvim seçimlerini temizle
                  setSelectedYear(null);
                  setSelectedMonth(null);
                  setSelectedDay(null);
                }
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab.key
                  ? `${tab.color} border-2 border-current`
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {tab.icon && <tab.icon className="w-4 h-4" />}
              <span>{tab.label}</span>
              {!tab.isSpecial && (
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                  activeTab === tab.key ? 'bg-white bg-opacity-80' : 'bg-gray-200'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Yıllık Takvim Navigasyonu */}
      {activeTab === 'calendar' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
          {/* Yıl Seçimi */}
          {!selectedYear && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Yıl Seçin</h3>
              </div>
              <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-3">
                {availableYears.map(year => {
                  const yearReservations = reservationsByDate[year] || {};
                  const yearCount = Object.values(yearReservations).reduce((total, months) => {
                    if (typeof months === 'object' && months !== null) {
                      return total + Object.values(months).reduce((monthTotal, days) => {
                        if (typeof days === 'object' && days !== null) {
                          return monthTotal + Object.values(days).reduce((dayTotal, reservations) => {
                            return dayTotal + (Array.isArray(reservations) ? reservations.length : 0);
                          }, 0);
                        }
                        return monthTotal;
                      }, 0);
                    }
                    return total;
                  }, 0);
                  
                  return (
                    <button
                      key={year}
                      onClick={() => setSelectedYear(year)}
                      className="group relative overflow-hidden bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                          <CalendarDays className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="text-lg font-bold text-gray-900 group-hover:text-blue-600">
                          {year}
                        </div>
                        <div className="text-xs text-gray-500 group-hover:text-blue-500 font-medium">
                          {yearCount || 0} rezervasyon
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Ay Seçimi */}
          {selectedYear && !selectedMonth && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedYear} - Ay Seçin
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedYear(null)}
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  ← Yıllara Dön
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {monthNames.map((monthName, index) => {
                  const monthNum = index + 1;
                  const monthStr = monthNum.toString().padStart(2, '0');
                  const monthReservations = reservationsByDate[selectedYear]?.[monthStr] || {};
                  const monthCount = Object.values(monthReservations).reduce((total, dayReservations) => 
                    total + (Array.isArray(dayReservations) ? dayReservations.length : 0), 0);
                  
                  // Ay renkleri - rezervasyon sayısına göre
                  let iconBgColor = 'bg-gray-100';
                  let iconColor = 'text-gray-500';
                  let borderColor = 'border-gray-200';
                  let bgColor = 'bg-white';
                  let textColor = 'text-gray-900';
                  let countColor = 'text-gray-500';
                  
                  if (monthCount > 0) {
                    if (monthCount >= 10) {
                      iconBgColor = 'bg-red-100';
                      iconColor = 'text-red-600';
                      borderColor = 'border-red-200';
                      bgColor = 'bg-red-50';
                      textColor = 'text-red-800';
                      countColor = 'text-red-600';
                    } else if (monthCount >= 5) {
                      iconBgColor = 'bg-yellow-100';
                      iconColor = 'text-yellow-600';
                      borderColor = 'border-yellow-200';
                      bgColor = 'bg-yellow-50';
                      textColor = 'text-yellow-800';
                      countColor = 'text-yellow-600';
                    } else {
                      iconBgColor = 'bg-green-100';
                      iconColor = 'text-green-600';
                      borderColor = 'border-green-200';
                      bgColor = 'bg-green-50';
                      textColor = 'text-green-800';
                      countColor = 'text-green-600';
                    }
                  }
                  
                  return (
                    <button
                      key={monthNum}
                      onClick={() => setSelectedMonth(monthNum)}
                      className={`group relative overflow-hidden ${bgColor} border ${borderColor} rounded-xl p-4 hover:shadow-md transition-all duration-200`}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <div className={`p-2 ${iconBgColor} rounded-lg transition-colors`}>
                          <CalendarDays className={`w-4 h-4 ${iconColor}`} />
                        </div>
                        <div className={`text-sm font-bold ${textColor} group-hover:text-blue-600`}>
                          {monthName}
                        </div>
                        <div className={`text-xs font-semibold ${countColor} group-hover:text-blue-500`}>
                          {monthCount || 0} rezervasyon
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Gün Seçimi */}
          {selectedYear && selectedMonth && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedYear} {monthNames[selectedMonth - 1]} - Gün Seçin
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedMonth(null)}
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  ← Aylara Dön
                </button>
              </div>
              
              {(() => {
                // Ay içindeki rezervasyonlu günleri bul
                const monthStr = selectedMonth.toString().padStart(2, '0');
                const monthReservations = reservationsByDate[selectedYear]?.[monthStr] || {};
                const reservedDays = Object.keys(monthReservations).filter(day => 
                  Array.isArray(monthReservations[day]) && monthReservations[day].length > 0
                );
                
                if (reservedDays.length === 0) {
                  // Hiç rezervasyon yoksa sadece bilgilendirme mesajı
                  return (
                    <div className="text-center py-12">
                      <div className="flex justify-center mb-4">
                        <div className="p-4 bg-gray-100 rounded-full">
                          <Calendar className="w-12 h-12 text-gray-400" />
                        </div>
                      </div>
                      <h4 className="text-lg font-medium text-gray-900 mb-2">
                        Rezervasyon Bulunamadı
                      </h4>
                      <p className="text-gray-600">
                        {monthNames[selectedMonth - 1]} {selectedYear} ayında rezervasyon bulunmuyor.
                      </p>
                    </div>
                  );
                }
                
                // Rezervasyonu olan günleri göster
                return (
                  <>
                    {/* Gün listesi */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {reservedDays.sort((a, b) => parseInt(a) - parseInt(b)).map(dayStr => {
                        const day = parseInt(dayStr);
                        const dayReservations = monthReservations[dayStr] || [];
                        const formattedDate = `${dayStr}/${monthStr}/${selectedYear}`;
                        
                        return (
                          <button
                            key={day}
                            onClick={() => setSelectedDay(day)}
                            className={`group relative overflow-hidden border rounded-xl p-4 transition-all duration-200 ${
                              selectedDay === day
                                ? 'border-blue-300 bg-blue-50 shadow-md'
                                : 'border-green-200 bg-green-50 hover:bg-green-100 hover:shadow-md'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`p-2 rounded-lg ${
                                selectedDay === day 
                                  ? 'bg-blue-100' 
                                  : 'bg-green-100 group-hover:bg-green-200'
                              } transition-colors`}>
                                <Clock className={`w-4 h-4 ${
                                  selectedDay === day 
                                    ? 'text-blue-600' 
                                    : 'text-green-600'
                                }`} />
                              </div>
                              <div className="flex-1 text-left">
                                <div className="text-sm font-medium text-gray-900">
                                  {formattedDate}
                                </div>
                                <div className={`text-xs font-semibold ${
                                  selectedDay === day ? 'text-blue-600' : 'text-green-600'
                                }`}>
                                  {dayReservations.length} rezervasyon
                                </div>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    
                    {/* Tüm ay rezervasyonlarını göster butonu */}
                    <div className="mt-6 text-center">
                      <button
                        onClick={() => {
                          setSelectedDay(null);
                          // Ay rezervasyonlarını göstermek için selectedMonth'u koru
                        }}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Tüm {monthNames[selectedMonth - 1]} Rezervasyonlarını Göster
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {/* Rezervasyon Tablosu */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {(activeTab !== 'calendar' || (selectedYear && (selectedMonth || selectedDay))) && (
          <ReservationTable
            reservations={getFilteredReservations()}
            drivers={drivers}
            vehicles={vehicles}
            onEdit={(reservation) => {
              setSelectedReservation(reservation);
              setShowEditModal(true);
            }}
            onDriverAssign={(reservation) => {
              setSelectedReservation(reservation);
              setShowDriverModal(true);
            }}
            onShowQR={(reservation) => {
              setSelectedReservation(reservation);
              setShowQRModal(true);
            }}
            onCompleteReservation={handleCompleteReservation}
            onStatusChange={(reservationId, newStatus) => {
              // Firebase listener otomatik güncelleyecek, manual güncelleme yapmayalım
            }}
          />
        )}
        
        {/* Takvim tabında henüz seçim yapılmamışsa */}
        {activeTab === 'calendar' && !selectedYear && (
          <div className="p-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="p-6 bg-blue-100 rounded-full">
                <Calendar className="w-16 h-16 text-blue-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Yıllık Rezervasyon Takvimi
            </h3>
            <p className="text-gray-600">
              Rezervasyonlarınızı yıl, ay ve gün bazında görüntüleyebilirsiniz.
              <br />
              Başlamak için yukarıdan bir yıl seçin.
            </p>
          </div>
        )}
        
        {/* Yıl seçildi ama ay seçilmedi */}
        {activeTab === 'calendar' && selectedYear && !selectedMonth && (
          <div className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-blue-100 rounded-full">
                <CalendarDays className="w-12 h-12 text-blue-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {selectedYear} Yılı Seçildi
            </h3>
            <p className="text-gray-600">
              Rezervasyonları görüntülemek için bir ay seçin.
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      {showQuickModal && (
        <QuickReservationModal
          onClose={() => setShowQuickModal(false)}
          onSubmit={handleQuickReservation}
          vehicles={vehicles}
        />
      )}

      {showEditModal && selectedReservation && (
        <EditReservationModal
          reservation={selectedReservation}
          onClose={() => {
            setShowEditModal(false);
            setSelectedReservation(null);
          }}
          onUpdate={handleReservationUpdate}
        />
      )}

      {showDriverModal && selectedReservation && (
        <DriverAssignModal
          reservation={selectedReservation}
          drivers={drivers}
          vehicles={vehicles}
          onClose={() => {
            setShowDriverModal(false);
            setSelectedReservation(null);
          }}
          onAssign={handleDriverAssign}
        />
      )}

      {showQRModal && selectedReservation && (
        <QRModal
          reservation={selectedReservation}
          onClose={() => {
            setShowQRModal(false);
            setSelectedReservation(null);
          }}
        />
      )}
    </div>
  );
};

export default ReservationIndex;
