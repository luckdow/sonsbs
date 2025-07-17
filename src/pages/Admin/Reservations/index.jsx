import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Clock, MapPin, User, Car, CreditCard, RefreshCw } from 'lucide-react';
import { collection, onSnapshot, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import QuickReservationModal from './QuickReservationModal';
import EditReservationModal from './EditReservationModal';
import ReservationCard from './ReservationCard';
import DriverAssignModal from './DriverAssignModal';
import QRModal from './QRModal';

const ReservationIndex = () => {
  const [reservations, setReservations] = useState([]);
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

    const unsubscribeDrivers = onSnapshot(
      collection(db, 'drivers'),
      (snapshot) => {
        const driverData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        if (driverData.length > 0) {
          setDrivers([...mockDrivers, ...driverData]);
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

  // Şoför atama
  const handleDriverAssign = async (reservationId, driverId, vehicleId) => {
    try {
      // Önce local state'i güncelle
      setReservations(prev => prev.map(res => 
        res.id === reservationId 
          ? { ...res, assignedDriver: driverId, assignedVehicle: vehicleId, status: 'assigned' }
          : res
      ));
      
      // Firebase'ı güncelle
      await updateDoc(doc(db, 'reservations', reservationId), {
        assignedDriver: driverId,
        assignedVehicle: vehicleId,
        status: 'assigned',
        updatedAt: new Date().toISOString()
      });
      
      setShowDriverModal(false);
      setSelectedReservation(null);
    } catch (error) {
      console.error('Şoför atama hatası:', error);
      alert('Şoför atama sırasında bir hata oluştu');
    }
  };

  // Rezervasyon güncelleme
  const handleUpdateReservation = async (updatedReservation) => {
    try {
      // Önce local state'i güncelle
      setReservations(prev => prev.map(res => 
        res.id === updatedReservation.id ? updatedReservation : res
      ));
      
      // Firebase'ı güncelle
      await updateDoc(doc(db, 'reservations', updatedReservation.id), {
        ...updatedReservation,
        updatedAt: new Date().toISOString()
      });
      
      setShowEditModal(false);
      setSelectedReservation(null);
      alert('Rezervasyon güncellendi');
    } catch (error) {
      console.error('Rezervasyon güncelleme hatası:', error);
      alert('Rezervasyon güncellenirken hata oluştu');
    }
  };

  // Rezervasyon düzenleme
  const handleEditReservation = (reservation) => {
    setSelectedReservation(reservation);
    setShowEditModal(true);
  };

  // Rezervasyon iptal etme
  const handleCancelReservation = async (reservation) => {
    if (window.confirm('Bu rezervasyonu iptal etmek istediğinizden emin misiniz?')) {
      try {
        await updateReservationStatus(reservation.id, 'cancelled');
        alert('Rezervasyon iptal edildi');
      } catch (error) {
        console.error('Rezervasyon iptal hatası:', error);
        alert('Rezervasyon iptal edilirken hata oluştu');
      }
    }
  };

  // QR kod gösterme
  const handleShowQR = (reservation) => {
    setSelectedReservation(reservation);
    setShowQRModal(true);
  };

  // Rezervasyon durumu güncelleme
  const updateReservationStatus = async (reservationId, newStatus) => {
    try {
      // Önce local state'i güncelle
      setReservations(prev => prev.map(res => 
        res.id === reservationId 
          ? { ...res, status: newStatus, updatedAt: new Date().toISOString() }
          : res
      ));
      
      // Firebase'ı güncelle
      await updateDoc(doc(db, 'reservations', reservationId), {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Durum güncelleme hatası:', error);
      alert('Durum güncellenirken bir hata oluştu');
    }
  };

  // Durum badge renkleri
  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      assigned: 'bg-purple-100 text-purple-800',
      started: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    const texts = {
      pending: 'Bekliyor',
      confirmed: 'Onaylandı',
      assigned: 'Şoför Atandı',
      started: 'Başladı',
      completed: 'Tamamlandı',
      cancelled: 'İptal Edildi'
    };
    return texts[status] || 'Bilinmiyor';
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
              Toplam {reservations.length} rezervasyon bulunuyor
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

      {/* Durum Özeti */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {[
          { status: 'pending', label: 'Bekleyen', icon: Clock, color: 'yellow' },
          { status: 'confirmed', label: 'Onaylanan', icon: Calendar, color: 'blue' },
          { status: 'assigned', label: 'Atanan', icon: User, color: 'purple' },
          { status: 'started', label: 'Başlayan', icon: Car, color: 'green' },
          { status: 'completed', label: 'Tamamlanan', icon: CreditCard, color: 'gray' },
          { status: 'cancelled', label: 'İptal', icon: RefreshCw, color: 'red' }
        ].map(({ status, label, icon: Icon, color }) => {
          const count = reservations.filter(r => r.status === status).length;
          return (
            <div key={status} className="bg-white rounded-lg border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-${color}-100`}>
                  <Icon className={`w-4 h-4 text-${color}-600`} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{label}</p>
                  <p className="text-lg font-semibold text-gray-900">{count}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rezervasyon Listesi */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Tüm Rezervasyonlar</h2>
        </div>
        
        {reservations.length === 0 ? (
          <div className="p-8 text-center">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz rezervasyon yok</h3>
            <p className="text-gray-600 mb-4">İlk rezervasyonu oluşturmak için yukarıdaki butonu kullanın</p>
            <button
              onClick={() => setShowQuickModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Rezervasyon Ekle
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            {reservations.map((reservation) => (
              <ReservationCard
                key={reservation.id}
                reservation={reservation}
                drivers={drivers}
                vehicles={vehicles}
                getStatusBadge={getStatusBadge}
                getStatusText={getStatusText}
                onAssignDriver={(res) => {
                  setSelectedReservation(res);
                  setShowDriverModal(true);
                }}
                onUpdateStatus={updateReservationStatus}
                onEdit={handleEditReservation}
                onCancel={handleCancelReservation}
                onShowQR={handleShowQR}
              />
            ))}
          </div>
        )}
      </div>

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
          onUpdate={handleUpdateReservation}
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
