import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  User, 
  Phone,
  Navigation,
  CheckCircle,
  QrCode,
  Car,
  ExternalLink,
  Eye,
  X,
  Plane,
  Users,
  Package,
  ArrowLeft,
  Mail
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { collection, onSnapshot, updateDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { processQRScanCompletion } from '../../utils/financialIntegration';
import QRScannerComponent from '../../components/QR/QRScannerComponent';
import QRScanner from './QRScanner';
import toast from 'react-hot-toast';

const DriverDashboard = () => {
  const { currentUser } = useApp();
  const { user, userProfile } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [activeView, setActiveView] = useState('dashboard');
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [activeTrip, setActiveTrip] = useState(null);

  // Lokasyon objesini stringe çeviren yardımcı fonksiyon
  const formatLocation = (location) => {
    if (!location) return 'Belirtilmemiş';
    if (typeof location === 'string') return location;
    if (typeof location === 'object') {
      if (location.address) return location.address;
      if (location.name) return location.name;
      if (location.formatted_address) return location.formatted_address;
      if (location.description) return location.description;
      if (location.lat && location.lng) return `${location.lat}, ${location.lng}`;
      return 'Lokasyon bilgisi mevcut';
    }
    return String(location);
  };

  // Real-time reservations listener
  useEffect(() => {
    if (!currentUser?.uid && !user?.uid) {
      console.log('DriverDashboard: User ID bulunamadı');
      return;
    }

    // Kullanılacak UID'yi belirle
    const userId = currentUser?.uid || user?.uid;

    // Hem assignedDriverId hem de assignedDriver field'larını kontrol et
    const q1 = query(
      collection(db, 'reservations'),
      where('assignedDriverId', '==', userId)
    );

    const q2 = query(
      collection(db, 'reservations'), 
      where('assignedDriver', '==', userId)
    );

    // İki query'yi de dinle ve sonuçları birleştir
    const unsubscribe1 = onSnapshot(q1, (snapshot) => {
      handleReservationUpdate(snapshot, 'assignedDriverId');
    }, (error) => {
      console.error('DriverDashboard: assignedDriverId query error:', error);
    });

    const unsubscribe2 = onSnapshot(q2, (snapshot) => {
      handleReservationUpdate(snapshot, 'assignedDriver');
    }, (error) => {
      console.error('DriverDashboard: assignedDriver query error:', error);
    });

    function handleReservationUpdate(snapshot, queryType) {
      const reservationList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      console.log(`🚗 DriverDashboard: ${queryType} sorgusu sonucu:`, {
        count: reservationList.length,
        reservations: reservationList.map(r => ({ 
          id: r.id, 
          reservationId: r.reservationId,
          status: r.status,
          assignedDriver: r.assignedDriver,
          assignedDriverId: r.assignedDriverId 
        }))
      });
      
      // Rezervasyonları unique hale getir
      setReservations(prevReservations => {
        const uniqueReservations = [...prevReservations];
        
        reservationList.forEach(newRes => {
          const existingIndex = uniqueReservations.findIndex(r => r.id === newRes.id);
          if (existingIndex >= 0) {
            uniqueReservations[existingIndex] = newRes;
          } else {
            uniqueReservations.push(newRes);
          }
        });
        
        // Tarihce sırala
        uniqueReservations.sort((a, b) => {
          const dateA = a.tripDetails?.date || a.date;
          const dateB = b.tripDetails?.date || b.date;
          if (dateA && dateB) {
            return new Date(dateB) - new Date(dateA);
          }
          return 0;
        });

        // Aktif trip'i bul
        const activeTrip = uniqueReservations.find(r => r.status === 'trip-started');
        setActiveTrip(activeTrip);
        
        return uniqueReservations;
      });
      
      setLoading(false);
    }

    return () => {
      unsubscribe1();
      unsubscribe2();
    };
  }, [currentUser, user, userProfile]);

  // Get assigned reservations (not completed)
  const assignedReservations = reservations.filter(r => 
    r.status === 'assigned' || r.status === 'confirmed'
  );

  // Start trip function - Sadece yolculuğu başlat, finansal işlem yapma
  const startTrip = async (reservationId) => {
    try {
      const reservationRef = doc(db, 'reservations', reservationId);
      await updateDoc(reservationRef, {
        status: 'trip-started',
        tripStartTime: new Date().toISOString()
      });
      
      // Aktif yolculuğu set et
      const reservation = reservations.find(r => r.id === reservationId);
      setActiveTrip(reservation);
      
      toast.success('Yolculuk başlatıldı!');
      setActiveView('active-trip');
    } catch (error) {
      console.error('Error starting trip:', error);
      toast.error('Yolculuk başlatılırken hata oluştu');
    }
  };

  // Complete trip function - ŞİMDİ finansal işlemler yapılsın
  const completeTrip = async (reservationId) => {
    try {
      const userId = currentUser?.uid || user?.uid;
      if (!userId) {
        toast.error('Kullanıcı bilgisi bulunamadı');
        return;
      }

      console.log('🏁 Yolculuk tamamlanıyor - Finansal işlemler başlatılıyor...');
      
      // Finansal entegrasyon ile rezervasyonu tamamla
      await processQRScanCompletion(reservationId, userId);
      
      toast.success('Yolculuk tamamlandı! Finansal işlemler güncellendi.');
      setActiveView('dashboard');
      setActiveTrip(null);
    } catch (error) {
      console.error('Error completing trip:', error);
      toast.error('Yolculuk tamamlanırken hata oluştu: ' + error.message);
    }
  };

  // Open Google Maps for navigation
  const openNavigation = (pickup, dropoff) => {
    const mapsUrl = `https://www.google.com/maps/dir/${encodeURIComponent(pickup)}/${encodeURIComponent(dropoff)}`;
    window.open(mapsUrl, '_blank');
  };

  // QR Scanner modal component
  const QRScannerModal = () => (
    <AnimatePresence>
      {isQRScannerOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">QR Kod Okut</h3>
              <button
                onClick={() => setIsQRScannerOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            
            {/* Gerçek QR Scanner Component */}
            <QRScannerComponent
              isOpen={true}
              onClose={() => setIsQRScannerOpen(false)}
              onScan={(result) => {
                console.log('QR Scan Result:', result);
                // QR kod sonucunda rezervasyon ID'sini al
                const scannedReservationId = result;
                // Hem document ID'sine hem de reservationId field'ına bak
                const reservation = reservations.find(r => 
                  r.id === scannedReservationId || 
                  r.reservationId === scannedReservationId
                );
                
                if (reservation) {
                  startTrip(reservation.id);
                  setIsQRScannerOpen(false);
                  toast.success(`QR kod başarıyla okundu! Rezervasyon: ${reservation.reservationId || reservation.id}`);
                } else {
                  console.error('Rezervasyon bulunamadı. Aranan ID:', scannedReservationId);
                  toast.error(`Bu QR koda ait rezervasyon bulunamadı: ${scannedReservationId}`);
                }
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Dashboard View - Main screen with assigned reservations
  const DashboardView = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Merhaba {userProfile?.firstName || userProfile?.name || 'Şoför'}!
        </h1>
        <p className="text-blue-100">
          {assignedReservations.length} atanmış göreviniz var
        </p>
      </div>

      {/* Active Trip Alert */}
      {activeTrip && (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-green-50 border-2 border-green-200 rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-green-500 p-2 rounded-full">
                <Car className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-green-900">Aktif Yolculuk</p>
                <p className="text-sm text-green-700">
                  {activeTrip.customerInfo?.firstName} {activeTrip.customerInfo?.lastName}
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveView('active-trip')}
              className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors"
            >
              Görüntüle
            </button>
          </div>
        </motion.div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setActiveView('qr-scanner')}
          className="bg-white border-2 border-gray-200 rounded-xl p-6 text-center hover:border-blue-300 transition-colors"
        >
          <QrCode className="w-12 h-12 text-blue-500 mx-auto mb-3" />
          <p className="font-semibold text-gray-900">QR Kod Okut</p>
          <p className="text-sm text-gray-500 mt-1">Yolculuk Yönet</p>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setActiveView('trip-details')}
          className="bg-white border-2 border-gray-200 rounded-xl p-6 text-center hover:border-blue-300 transition-colors"
        >
          <Eye className="w-12 h-12 text-gray-500 mx-auto mb-3" />
          <p className="font-semibold text-gray-900">Geçmiş İşler</p>
          <p className="text-sm text-gray-500 mt-1">Tamamlananlar</p>
        </motion.button>
      </div>

      {/* Assigned Reservations */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Atanmış Görevler</h2>
        
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-gray-100 rounded-xl p-4 animate-pulse">
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : assignedReservations.length === 0 ? (
          <div className="bg-gray-50 rounded-xl p-8 text-center">
            <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">Henüz atanmış görev yok</p>
            <p className="text-sm text-gray-400 mt-1">Yeni görevler için bekleyin</p>
          </div>
        ) : (
          <div className="space-y-3">
            {assignedReservations.map((reservation) => (
              <motion.div
                key={reservation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {reservation.customerInfo?.firstName} {reservation.customerInfo?.lastName}
                    </p>
                    <p className="text-sm text-blue-600 font-medium">
                      {reservation.reservationId || reservation.id}
                    </p>
                  </div>
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-lg text-xs font-medium">
                    Atandı
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-green-500" />
                    <span>{formatLocation(reservation.tripDetails?.pickupLocation || reservation.pickupLocation)}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-red-500" />
                    <span>{formatLocation(reservation.tripDetails?.dropoffLocation || reservation.dropoffLocation)}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{reservation.tripDetails?.date || reservation.date || 'Belirtilmemiş'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{reservation.tripDetails?.time || reservation.time || 'Belirtilmemiş'}</span>
                    </div>
                  </div>
                  {(reservation.tripDetails?.flightNumber || reservation.flightNumber) && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Plane className="w-4 h-4 text-blue-500" />
                      <span>Uçuş: {reservation.tripDetails?.flightNumber || reservation.flightNumber}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{reservation.tripDetails?.passengerCount || reservation.passengerCount || 1} Yolcu</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Package className="w-4 h-4" />
                      <span>{reservation.tripDetails?.luggageCount || reservation.luggageCount || 0} Bavul</span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedReservation(reservation);
                      setActiveView('reservation-details');
                    }}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    Detaylar
                  </button>
                  <button
                    onClick={() => setIsQRScannerOpen(true)}
                    className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                  >
                    QR Okut
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Active Trip View
  const ActiveTripView = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setActiveView('dashboard')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Aktif Yolculuk</h1>
      </div>

      {activeTrip && (
        <div className="space-y-6">
          {/* Trip Status */}
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
            <div className="text-center">
              <div className="bg-green-500 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Car className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-xl font-bold text-green-900 mb-2">Yolculuk Devam Ediyor</h2>
              <p className="text-green-700">
                {activeTrip.customerInfo?.firstName} {activeTrip.customerInfo?.lastName}
              </p>
              <p className="text-sm text-green-600 mt-1">
                {activeTrip.reservationId || activeTrip.id}
              </p>
            </div>
          </div>

          {/* Trip Details */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-bold text-gray-900 mb-4">Yolculuk Detayları</h3>
            
            <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <MapPin className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Alış Noktası</p>
                  <p className="text-gray-600">
                    {formatLocation(activeTrip.tripDetails?.pickupLocation || activeTrip.pickupLocation)}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-red-100 p-2 rounded-full">
                  <MapPin className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Varış Noktası</p>
                  <p className="text-gray-600">
                    {formatLocation(activeTrip.tripDetails?.dropoffLocation || activeTrip.dropoffLocation)}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Müşteri</p>
                  <p className="text-gray-600">
                    {activeTrip.customerInfo?.firstName} {activeTrip.customerInfo?.lastName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {activeTrip.customerInfo?.phone}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                const pickup = formatLocation(activeTrip.tripDetails?.pickupLocation || activeTrip.pickupLocation);
                const dropoff = formatLocation(activeTrip.tripDetails?.dropoffLocation || activeTrip.dropoffLocation);
                
                const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(pickup || 'Başlangıç')}&destination=${encodeURIComponent(dropoff || 'Varış')}&travelmode=driving`;
                window.open(mapsUrl, '_blank');
                toast.success('Google Maps navigasyon açıldı!');
              }}
              className="w-full bg-blue-500 text-white py-4 px-6 rounded-xl font-bold text-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-3"
            >
              <Navigation className="w-6 h-6" />
              <span>Google Maps'te Aç</span>
              <ExternalLink className="w-5 h-5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => completeTrip(activeTrip.id)}
              className="w-full bg-green-500 text-white py-4 px-6 rounded-xl font-bold text-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-3"
            >
              <CheckCircle className="w-6 h-6" />
              <span>Yolculuğu Tamamla</span>
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );

  // Reservation Details View
  const ReservationDetailsView = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setActiveView('dashboard')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Rezervasyon Detayı</h1>
      </div>

      {selectedReservation && (
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-bold text-gray-900 mb-4">Müşteri Bilgileri</h3>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">
                    {selectedReservation.customerInfo?.firstName} {selectedReservation.customerInfo?.lastName}
                  </p>
                  <p className="text-sm text-gray-500">Müşteri</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">{selectedReservation.customerInfo?.phone}</p>
                  <p className="text-sm text-gray-500">Telefon</p>
                </div>
              </div>

              {selectedReservation.customerInfo?.email && (
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{selectedReservation.customerInfo?.email}</p>
                    <p className="text-sm text-gray-500">E-posta</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Trip Info */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-bold text-gray-900 mb-4">Yolculuk Bilgileri</h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <MapPin className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Alış Noktası</p>
                  <p className="text-gray-600">{formatLocation(selectedReservation.tripDetails?.pickupLocation || selectedReservation.pickupLocation)}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-red-100 p-2 rounded-full">
                  <MapPin className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Varış Noktası</p>
                  <p className="text-gray-600">{formatLocation(selectedReservation.tripDetails?.dropoffLocation || selectedReservation.dropoffLocation)}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{selectedReservation.tripDetails?.date || selectedReservation.date}</p>
                    <p className="text-sm text-gray-500">Tarih</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{selectedReservation.tripDetails?.time || selectedReservation.time}</p>
                    <p className="text-sm text-gray-500">Saat</p>
                  </div>
                </div>
              </div>

              {(selectedReservation.tripDetails?.flightNumber || selectedReservation.flightNumber) && (
                <div className="flex items-center space-x-3">
                  <Plane className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="font-medium text-gray-900">{selectedReservation.tripDetails?.flightNumber || selectedReservation.flightNumber}</p>
                    <p className="text-sm text-gray-500">Uçuş Numarası</p>
                  </div>
                </div>
              )}

              {(selectedReservation.tripDetails?.passengerCount || selectedReservation.passengerCount) && (
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-purple-500" />
                  <div>
                    <p className="font-medium text-gray-900">{selectedReservation.tripDetails?.passengerCount || selectedReservation.passengerCount} kişi</p>
                    <p className="text-sm text-gray-500">Yolcu Sayısı</p>
                  </div>
                </div>
              )}

              {(selectedReservation.tripDetails?.luggageCount || selectedReservation.luggageCount) && (
                <div className="flex items-center space-x-3">
                  <Package className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="font-medium text-gray-900">{selectedReservation.tripDetails?.luggageCount || selectedReservation.luggageCount} adet</p>
                    <p className="text-sm text-gray-500">Bagaj</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsQRScannerOpen(true)}
            className="w-full bg-blue-500 text-white py-4 px-6 rounded-xl font-bold text-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-3"
          >
            <QrCode className="w-6 h-6" />
            <span>QR Kod Okut ve Başlat</span>
          </motion.button>
        </div>
      )}
    </div>
  );

  // Trip History View
  const TripHistoryView = () => {
    const completedTrips = reservations.filter(r => r.status === 'completed');

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setActiveView('dashboard')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Geçmiş İşler</h1>
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <h2 className="text-xl font-bold mb-2">Tamamlanan Yolculuklar</h2>
          <p className="text-green-100">
            Toplam {completedTrips.length} yolculuk tamamladınız
          </p>
        </div>

        {/* Completed Trips List */}
        <div>
          {completedTrips.length === 0 ? (
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">Henüz tamamlanmış yolculuk yok</p>
            </div>
          ) : (
            <div className="space-y-3">
              {completedTrips.map((trip) => (
                <motion.div
                  key={trip.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-gray-200 rounded-xl p-4"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {trip.customerInfo?.firstName} {trip.customerInfo?.lastName}
                      </p>
                      <p className="text-sm text-green-600 font-medium">{trip.reservationId || trip.id}</p>
                    </div>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-lg text-xs font-medium">
                      Tamamlandı
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-green-500" />
                      <span>{formatLocation(trip.tripDetails?.pickupLocation || trip.pickupLocation)}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-red-500" />
                      <span>{formatLocation(trip.tripDetails?.dropoffLocation || trip.dropoffLocation)}</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{trip.tripDetails?.date || trip.date}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{trip.tripDetails?.time || trip.time}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Main render
  return (
    <div className="min-h-screen bg-gray-50 p-4 max-w-md mx-auto">
      <AnimatePresence mode="wait">
        {activeView === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <DashboardView />
          </motion.div>
        )}

        {activeView === 'active-trip' && (
          <motion.div
            key="active-trip"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <ActiveTripView />
          </motion.div>
        )}

        {activeView === 'reservation-details' && (
          <motion.div
            key="reservation-details"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <ReservationDetailsView />
          </motion.div>
        )}

        {activeView === 'qr-scanner' && (
          <motion.div
            key="qr-scanner"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => setActiveView('dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">QR Kod Tarayıcı</h1>
            </div>
            
            <QRScanner />
          </motion.div>
        )}

        {activeView === 'trip-details' && (
          <motion.div
            key="trip-details"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <TripHistoryView />
          </motion.div>
        )}
      </AnimatePresence>

      <QRScannerModal />
    </div>
  );
};

export default DriverDashboard;
