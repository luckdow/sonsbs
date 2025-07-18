import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw, CheckCircle } from 'lucide-react';
import { collection, onSnapshot, addDoc, updateDoc, doc, serverTimestamp, query, where } from 'firebase/firestore';
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

  // Mock veriler - test için
  const mockReservations = [
    {
      id: '1',
      reservationId: 'SBS-001234',
      customerInfo: {
        firstName: 'Ahmet',
        lastName: 'Yılmaz',
        phone: '+90 555 123 45 67',
        email: 'ahmet@example.com'
      },
      tripDetails: {
        date: '2024-01-15',
        time: '14:30',
        pickupLocation: 'Lara Kundu Otelleri',
        dropoffLocation: 'Antalya Havalimanı',
        passengerCount: 2,
        luggageCount: 3,
        flightNumber: 'TK123'
      },
      status: 'pending',
      paymentMethod: 'cash',
      totalPrice: 150,
      createdAt: '2024-01-10T10:00:00Z',
      assignedDriver: null,
      assignedVehicle: null
    },
    {
      id: '2',
      reservationId: 'SBS-001235',
      customerInfo: {
        firstName: 'Ayşe',
        lastName: 'Demir',
        phone: '+90 555 987 65 43',
        email: 'ayse@example.com'
      },
      tripDetails: {
        date: '2024-01-16',
        time: '09:00',
        pickupLocation: 'Kaleici Otelleri',
        dropoffLocation: 'Antalya Havalimanı',
        passengerCount: 1,
        luggageCount: 2,
        flightNumber: 'PC456'
      },
      status: 'confirmed',
      paymentMethod: 'card',
      totalPrice: 120,
      createdAt: '2024-01-11T08:00:00Z',
      assignedDriver: 'driver1',
      assignedVehicle: 'vehicle1'
    },
    {
      id: '3',
      reservationId: 'SBS-001236',
      customerInfo: {
        firstName: 'Mehmet',
        lastName: 'Özkan',
        phone: '+90 555 333 44 55',
        email: 'mehmet@example.com'
      },
      tripDetails: {
        date: '2024-01-17',
        time: '16:45',
        pickupLocation: 'Antalya Havalimanı',
        dropoffLocation: 'Belek Otelleri',
        passengerCount: 4,
        luggageCount: 6,
        flightNumber: 'TK789'
      },
      status: 'assigned',
      paymentMethod: 'card',
      totalPrice: 180,
      createdAt: '2024-01-12T14:00:00Z',
      assignedDriver: 'driver2',
      assignedVehicle: 'vehicle2'
    }
  ];

  const mockDrivers = [
    {
      id: 'driver1',
      firstName: 'Mehmet',
      lastName: 'Şoför',
      phone: '+90 555 111 22 33',
      status: 'active',
      assignedVehicle: 'vehicle1'
    },
    {
      id: 'driver2',
      firstName: 'Ali',
      lastName: 'Karaca',
      phone: '+90 555 444 55 66',
      status: 'active',
      assignedVehicle: 'vehicle2'
    }
  ];

  const mockVehicles = [
    {
      id: 'vehicle1',
      brand: 'Mercedes',
      model: 'Vito',
      plateNumber: '07ABC123',
      capacity: 8,
      status: 'active'
    },
    {
      id: 'vehicle2',
      brand: 'Ford',
      model: 'Transit',
      plateNumber: '07DEF456',
      capacity: 12,
      status: 'active'
    }
  ];

  // Firebase'den rezervasyonları dinle
  useEffect(() => {
    // Mock verileri başlangıçta yükle
    setReservations(mockReservations);
    setDrivers(mockDrivers);
    setVehicles(mockVehicles);
    setLoading(false);

    // Firebase listener'ları
    const unsubscribeReservations = onSnapshot(
      collection(db, 'reservations'),
      (snapshot) => {
        const reservationData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        // Eğer Firebase'den veri gelirse mock verilerle birleştir
        if (reservationData.length > 0) {
          setReservations([...mockReservations, ...reservationData]);
        }
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
          // Eski format ile uyumlu olmak için alan adlarını ayarla
          name: doc.data().firstName && doc.data().lastName 
            ? `${doc.data().firstName} ${doc.data().lastName}`
            : doc.data().name || doc.data().email,
          phone: doc.data().phone || '',
          licenseNumber: doc.data().licenseNumber || 'Belirtilmemiş',
          vehicle: doc.data().assignedVehicle || 'Atanmamış',
          status: doc.data().isActive ? 'active' : 'inactive'
        }));
        if (driverData.length > 0) {
          setDrivers([...mockDrivers, ...driverData]);
        } else {
          setDrivers(mockDrivers);
        }
      }
    );

    const unsubscribeVehicles = onSnapshot(
      collection(db, 'vehicles'),
      (snapshot) => {
        const vehicleData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        if (vehicleData.length > 0) {
          setVehicles([...mockVehicles, ...vehicleData]);
        }
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

    // Arama filtresi
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(res => 
        res.reservationId.toLowerCase().includes(searchTerm) ||
        res.customerInfo?.firstName.toLowerCase().includes(searchTerm) ||
        res.customerInfo?.lastName.toLowerCase().includes(searchTerm) ||
        res.customerInfo?.phone.includes(searchTerm) ||
        res.customerInfo?.email.toLowerCase().includes(searchTerm)
      );
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
        const resDate = new Date(res.tripDetails?.date);
        
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

  // Hızlı rezervasyon ekleme
  const handleQuickReservation = async (reservationData) => {
    try {
      const newReservation = {
        ...reservationData,
        id: `temp-${Date.now()}`,
        reservationId: `SBS-${Date.now()}`,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Önce local state'e ekle
      setReservations(prev => [newReservation, ...prev]);
      
      // Firebase'a ekle
      await addDoc(collection(db, 'reservations'), newReservation);
      setShowQuickModal(false);
    } catch (error) {
      console.error('Rezervasyon eklenirken hata:', error);
      alert('Rezervasyon eklenirken bir hata oluştu');
    }
  };

  // Şoför atama - Hata düzeltmesi
  const handleDriverAssign = async (reservationId, driverId, vehicleId) => {
    try {
      // Rezervasyonu bul
      const reservationToUpdate = reservations.find(res => res.id === reservationId);
      if (!reservationToUpdate) {
        console.error('Rezervasyon bulunamadı:', reservationId);
        alert('Rezervasyon bulunamadı');
        return;
      }

      // Önce local state'i güncelle
      setReservations(prev => prev.map(res => 
        res.id === reservationId 
          ? { 
              ...res, 
              assignedDriver: driverId,
              assignedDriverId: driverId, // Şoför dashboard uyumluluğu için
              assignedVehicle: vehicleId, 
              status: 'assigned' 
            }
          : res
      ));
      
      // Eğer gerçek Firebase ID'si varsa güncelle
      if (reservationToUpdate.firebaseId) {
        await updateDoc(doc(db, 'reservations', reservationToUpdate.firebaseId), {
          assignedDriver: driverId,
          assignedDriverId: driverId, // Şoför dashboard uyumluluğu için
          assignedVehicle: vehicleId,
          status: 'assigned',
          updatedAt: new Date().toISOString()
        });
      }
      
      setShowDriverModal(false);
      setSelectedReservation(null);
    } catch (error) {
      console.error('Şoför atama hatası:', error);
      alert('Şoför atama sırasında bir hata oluştu: ' + error.message);
      
      // Hata durumunda local state'i geri al
      setReservations(prev => prev.map(res => 
        res.id === reservationId 
          ? { ...res, assignedDriver: null, assignedVehicle: null, status: 'pending' }
          : res
      ));
    }
  };

  // Rezervasyon güncelleme
  const handleReservationUpdate = async (reservationId, updatedData) => {
    try {
      // Rezervasyonu bul
      const reservationToUpdate = reservations.find(res => res.id === reservationId);
      if (!reservationToUpdate) {
        console.error('Rezervasyon bulunamadı:', reservationId);
        alert('Rezervasyon bulunamadı');
        return;
      }

      setReservations(prev => prev.map(res => 
        res.id === reservationId ? { ...res, ...updatedData } : res
      ));
      
      // Eğer gerçek Firebase ID'si varsa güncelle
      if (reservationToUpdate.firebaseId) {
        await updateDoc(doc(db, 'reservations', reservationToUpdate.firebaseId), {
          ...updatedData,
          updatedAt: new Date().toISOString()
        });
      }
      
      setShowEditModal(false);
      setSelectedReservation(null);
    } catch (error) {
      console.error('Rezervasyon güncelleme hatası:', error);
      alert('Rezervasyon güncellenirken bir hata oluştu: ' + error.message);
    }
  };

  // Manuel rezervasyon tamamlama - CARİ HESAP ENTEGRASYONu
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

      if (!reservation.driverId) {
        toast.error('Rezervasyona şoför atanmamış');
        return;
      }

      // Finansal entegrasyon ile tamamla
      const result = await manualCompleteReservation(reservationId, 'admin-user');
      
      // Local state'i güncelle
      setReservations(prev => prev.map(res => 
        res.id === reservationId 
          ? { ...res, status: 'completed', completedAt: new Date() }
          : res
      ));

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
          setReservations(prev => prev.map(res => 
            res.id === reservationId ? { ...res, status: newStatus } : res
          ));
        }}
        onCompleteReservation={handleCompleteReservation}
      />

      {/* Modals */}
      {showQuickModal && (
        <QuickReservationModal
          onClose={() => setShowQuickModal(false)}
          onSubmit={handleQuickReservation}
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
