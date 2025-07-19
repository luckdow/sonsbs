import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw, CheckCircle } from 'lucide-react';
import { collection, onSnapshot, addDoc, updateDoc, doc, serverTimestamp, query, where, deleteDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { USER_ROLES } from '../../../config/constants';
import { manualCompleteReservation } from '../../../utils/financialIntegration';
import QuickReservationModal from './QuickReservationModal';
import EditReservationModal from './EditReservationModal';
import ReservationTable from './ReservationTable';
import ReservationFilters from './ReservationFilters';
import DriverAssignModal from './DriverAssignModal';
import QRModal from './QRModal';
import toast from 'react-hot-toast';

const ReservationIndex = () => {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] = useState(null);
  
  // Modal durumları
  const [showQuickModal, setShowQuickModal] = useState(false);
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);

  // Firebase'den rezervasyonları dinle
  useEffect(() => {
    console.log('Rezervasyon index: Firebase listeners başlatılıyor...');
    setLoading(true);

    // Firebase listener'ları
    const unsubscribeReservations = onSnapshot(
      collection(db, 'reservations'),
      (snapshot) => {
        console.log('🔄 Admin Panel: Rezervasyonlar güncellendi, döküman sayısı:', snapshot.docs.length);
        const reservationData = snapshot.docs.map(doc => {
          const data = doc.data();
          console.log(`📋 Rezervasyon ${doc.id}:`, { 
            id: doc.id, 
            status: data.status,
            reservationId: data.reservationId,
            assignedDriver: data.assignedDriver,
            assignedDriverId: data.assignedDriverId 
          }); 
          return {
            id: doc.id,
            ...data,
            // Eksik alanları varsayılan değerlerle doldur
            reservationId: data.reservationId || `SBS-${doc.id.slice(-6)}`,
            customerInfo: data.customerInfo || {
              firstName: 'Belirtilmemiş',
              lastName: '',
              phone: '',
              email: ''
            },
            tripDetails: data.tripDetails || {
              date: '',
              time: '',
              pickupLocation: '',
              dropoffLocation: '',
              passengerCount: 1,
              luggageCount: 0
            },
            status: data.status || 'pending',
            paymentMethod: data.paymentMethod || 'cash',
            totalPrice: data.totalPrice || 0,
            createdAt: data.createdAt || new Date().toISOString()
          };
        });
        
        console.log('✅ Admin Panel: İşlenmiş rezervasyonlar:', reservationData.map(r => ({
          id: r.id,
          reservationId: r.reservationId,
          status: r.status,
          customer: `${r.customerInfo?.firstName} ${r.customerInfo?.lastName}`
        })));
        setReservations(reservationData);
        setLoading(false);
      },
      (error) => {
        console.error('Rezervasyonlar yüklenirken hata:', error);
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
        console.log('Rezervasyon index: Şoförler güncellendi, döküman sayısı:', snapshot.docs.length);
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
        
        console.log('Firebase şoförleri işlendi:', driverData);
        setDrivers(driverData);
      },
      (error) => {
        console.error('Şoförler yüklenirken hata:', error);
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
        console.log('Aktif araçlar güncellendi, döküman sayısı:', snapshot.docs.length);
        const vehicleData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log('Aktif araç verileri:', vehicleData); // Debug için
        setVehicles(vehicleData);
      },
      (error) => {
        console.error('Araçlar yüklenirken hata:', error);
        setVehicles([]);
      }
    );

    return () => {
      unsubscribeReservations();
      unsubscribeDrivers();
      unsubscribeVehicles();
    };
  }, []);

  // Filtreleme fonksiyonu
  const handleFilterChange = (filters) => {
    let filtered = [...reservations];

    // Arama filtresi - hem yeni hem eski format için uyumlu
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(res => {
        const customerFirstName = res.customerInfo?.firstName || res.personalInfo?.firstName || '';
        const customerLastName = res.customerInfo?.lastName || res.personalInfo?.lastName || '';
        const customerPhone = res.customerInfo?.phone || res.personalInfo?.phone || '';
        const customerEmail = res.customerInfo?.email || res.personalInfo?.email || '';
        
        return res.reservationId?.toLowerCase().includes(searchTerm) ||
               customerFirstName.toLowerCase().includes(searchTerm) ||
               customerLastName.toLowerCase().includes(searchTerm) ||
               customerPhone.includes(searchTerm) ||
               customerEmail.toLowerCase().includes(searchTerm);
      });
    }

    // Durum filtresi
    if (filters.status !== 'all') {
      filtered = filtered.filter(res => res.status === filters.status);
    }

    // Tarih filtresi
    if (filters.dateRange !== 'all') {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      filtered = filtered.filter(res => {
        const resDate = new Date(res.tripDetails?.date || res.date);
        
        switch (filters.dateRange) {
          case 'today':
            return resDate.toDateString() === today.toDateString();
          case 'tomorrow':
            return resDate.toDateString() === tomorrow.toDateString();
          case 'this_week':
            const weekStart = new Date(today);
            weekStart.setDate(today.getDate() - today.getDay());
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);
            return resDate >= weekStart && resDate <= weekEnd;
          case 'this_month':
            return resDate.getMonth() === today.getMonth() && resDate.getFullYear() === today.getFullYear();
          case 'next_month':
            const nextMonth = new Date(today);
            nextMonth.setMonth(today.getMonth() + 1);
            return resDate.getMonth() === nextMonth.getMonth() && resDate.getFullYear() === nextMonth.getFullYear();
          default:
            return true;
        }
      });
    }

    // Şoför atama filtresi
    if (filters.assignedDriver !== 'all') {
      if (filters.assignedDriver === 'assigned') {
        filtered = filtered.filter(res => res.assignedDriver);
      } else if (filters.assignedDriver === 'unassigned') {
        filtered = filtered.filter(res => !res.assignedDriver);
      }
    }

    // Ödeme yöntemi filtresi
    if (filters.paymentMethod !== 'all') {
      filtered = filtered.filter(res => res.paymentMethod === filters.paymentMethod);
    }

    // Yolcu sayısı filtresi
    if (filters.passengerCount !== 'all') {
      if (filters.passengerCount === '5+') {
        filtered = filtered.filter(res => res.tripDetails?.passengerCount >= 5);
      } else {
        filtered = filtered.filter(res => res.tripDetails?.passengerCount === parseInt(filters.passengerCount));
      }
    }

    setFilteredReservations(filtered);
  };

  // Rezervasyonlar değiştiğinde filtrelenmiş listeyi de güncelle
  useEffect(() => {
    setFilteredReservations(reservations);
  }, [reservations]);

  // Hızlı rezervasyon ekleme - GEÇİCİ OLARAK KAPALI
  const handleQuickReservation = async (reservationData) => {
    toast.info('Hızlı rezervasyon ekleme özelliği geçici olarak kapatılmıştır. Rezervasyonlar müşteri paneli üzerinden oluşturulmalıdır.');
    setShowQuickModal(false);
    return;
    
    /* try {
      const newReservation = {
        ...reservationData,
        reservationId: `SBS-${Date.now()}`,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Firebase'a ekle (id alanı olmadan)
      const docRef = await addDoc(collection(db, 'reservations'), newReservation);
      
      setShowQuickModal(false);
      toast.success('Rezervasyon başarıyla eklendi!');
      
      console.log('Yeni rezervasyon eklendi:', docRef.id);
    } catch (error) {
      console.error('Rezervasyon eklenirken hata:', error);
      toast.error('Rezervasyon eklenirken bir hata oluştu: ' + error.message);
    } */
  };

  // Şoför atama - Sadece gerçek Firebase veriler
  const handleDriverAssign = async (reservationId, driverId, vehicleId) => {
    try {
      console.log('🔍 Şoför atama başlatılıyor:', { reservationId, driverId, vehicleId });
      
      // Rezervasyonu bul
      const reservationToUpdate = reservations.find(res => res.id === reservationId);
      if (!reservationToUpdate) {
        console.error('❌ Rezervasyon bulunamadı:', reservationId);
        console.log('📋 Mevcut rezervasyonlar:', reservations.map(r => ({ id: r.id, reservationId: r.reservationId })));
        toast.error('Rezervasyon bulunamadı');
        return;
      }

      console.log('✅ Güncellenecek rezervasyon bulundu:', {
        id: reservationToUpdate.id,
        reservationId: reservationToUpdate.reservationId,
        currentStatus: reservationToUpdate.status,
        currentAssignedDriver: reservationToUpdate.assignedDriver,
        currentAssignedDriverId: reservationToUpdate.assignedDriverId
      });

      // Güncellenecek veri
      const updateData = {
        assignedDriver: driverId,
        assignedDriverId: driverId, // Şoför dashboard uyumluluğu için
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

      console.log('🔄 Firebase güncellenecek veri:', cleanUpdateData);
      console.log('📍 Güncelleme yapılacak doküman ID:', reservationId);
      
      await updateDoc(doc(db, 'reservations', reservationId), cleanUpdateData);
      console.log('✅ Firebase rezervasyon başarıyla güncellendi!');
      
      setShowDriverModal(false);
      setSelectedReservation(null);
      toast.success('Şoför başarıyla atandı!');
      
    } catch (error) {
      console.error('Şoför atama hatası:', error);
      toast.error('Şoför atama sırasında bir hata oluştu: ' + error.message);
    }
  };

  // Rezervasyon güncelleme - Sadece gerçek Firebase veriler
  const handleReservationUpdate = async (reservationId, updatedData) => {
    try {
      // Rezervasyonu bul
      const reservationToUpdate = reservations.find(res => res.id === reservationId);
      if (!reservationToUpdate) {
        console.error('Rezervasyon bulunamadı:', reservationId);
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
      console.error('Rezervasyon güncelleme hatası:', error);
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

      console.log('Rezervasyon tamamlanacak:', { reservation, driverId });

      // Firebase rezervasyon için finansal entegrasyon
      const result = await manualCompleteReservation(reservationId, 'admin-user');
      
      // Başarı mesajı
      const paymentMsg = reservation.paymentMethod === 'cash' 
        ? 'Şoför komisyon borcu eklendi' 
        : 'Şoför alacağı eklendi';
      
      toast.success(`Rezervasyon tamamlandı! ${paymentMsg}`);
      
    } catch (error) {
      console.error('Rezervasyon tamamlama hatası:', error);
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
      console.error('Rezervasyon silme hatası:', error);
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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Rezervasyon Yönetimi</h1>
            <p className="text-gray-600 mt-1">
              Toplam {reservations.length} rezervasyon • Filtrelenmiş {filteredReservations.length} rezervasyon
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

      {/* Filtreleme */}
      <ReservationFilters 
        onFilterChange={handleFilterChange}
        reservations={reservations}
      />

      {/* Rezervasyon Tablosu */}
      <ReservationTable
        reservations={filteredReservations}
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
        onStatusChange={(reservationId, newStatus) => {
          // Firebase listener otomatik güncelleyecek, manual güncelleme yapmayalım
          console.log('Durum değişikliği:', reservationId, newStatus);
        }}
        onCompleteReservation={handleCompleteReservation}
        onDeleteReservation={handleDeleteReservation}
      />

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
