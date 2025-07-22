import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  User, 
  Phone,
  Car,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Search,
  Eye,
  Navigation,
  X,
  LogOut,
  Settings,
  Download,
  QrCode
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { USER_ROLES } from '../../config/constants';
import { useNavigate } from 'react-router-dom';
import QRCode from 'qrcode';

const MyReservations = () => {
  const { user, userProfile, signOut } = useAuth();
  const navigate = useNavigate();
  
  // Local state for real-time data
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // QR kod oluştur
  const generateQRCode = async (reservationCode, customerPhone) => {
    try {
      console.log('🔲 QR kod oluşturuluyor:', reservationCode);
      
      if (!customerPhone) {
        console.log('❌ QR kod için telefon numarası yok');
        return;
      }
      
      const qrText = `SBS Transfer - Rezervasyon: ${reservationCode} - Tel: ${customerPhone}`;
      const qrCodeDataUrl = await QRCode.toDataURL(qrText, {
        width: 200,
        margin: 2,
        color: {
          dark: '#1f2937',
          light: '#ffffff'
        }
      });
      
      setQrCodeUrl(qrCodeDataUrl);
      console.log('✅ QR kod oluşturuldu');
      
    } catch (error) {
      console.error('❌ QR kod oluşturma hatası:', error);
    }
  };

  // QR kodu indir
  const downloadQRCode = () => {
    if (qrCodeUrl && selectedReservation) {
      const link = document.createElement('a');
      link.download = `SBS-Transfer-${selectedReservation?.reservationCode || selectedReservation?.reservationId}.png`;
      link.href = qrCodeUrl;
      link.click();
    }
  };

  // Firebase listeners for real-time data
  useEffect(() => {
    if (!user?.email) {
      setLoading(false);
      return;
    }
    
    console.log('MyReservations: Firebase listeners başlatılıyor...');
    
    // Rezervasyonları dinle - email bazlı filtreleme
    const reservationsQuery = query(
      collection(db, 'reservations')
    );
    
    const unsubscribeReservations = onSnapshot(
      reservationsQuery,
      (snapshot) => {
        const allReservations = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Email bazlı filtreleme - her iki format da kontrol et ama çifte kayıt engelle
        const userEmail = user.email.toLowerCase();
        const uniqueReservationIds = new Set(); // Çifte kayıt engelleme için
        
        const userReservations = allReservations.filter(r => {
          const email1 = r.personalInfo?.email?.toLowerCase();
          const email2 = r.customerInfo?.email?.toLowerCase();
          
          // Email eşleşmesi kontrolü
          const isUserReservation = email1 === userEmail || email2 === userEmail;
          
          // Çifte kayıt kontrolü - reservationCode veya reservationId bazlı
          const reservationId = r.reservationCode || r.reservationId || r.id;
          if (isUserReservation && !uniqueReservationIds.has(reservationId)) {
            uniqueReservationIds.add(reservationId);
            return true;
          }
          
          return false;
        });
        
        console.log('Kullanıcı rezervasyonları (çifte kayıt temizlendi):', userReservations);
        setReservations(userReservations);
      },
      (error) => {
        console.error('MyReservations: Rezervasyonlar yüklenirken hata:', error);
      }
    );

    // Şoförleri dinle
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
          firstName: doc.data().firstName || '',
          lastName: doc.data().lastName || '',
          phone: doc.data().phone || ''
        }));
        setDrivers(driverData);
      },
      (error) => {
        console.error('MyReservations: Şoförler yüklenirken hata:', error);
      }
    );

    // Aktif araçları dinle
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
        setLoading(false);
      },
      (error) => {
        console.error('MyReservations: Araçlar yüklenirken hata:', error);
        setLoading(false);
      }
    );

    return () => {
      unsubscribeReservations();
      unsubscribeDrivers();
      unsubscribeVehicles();
    };
  }, [user]);

  useEffect(() => {
    // Apply filters
    let filtered = reservations;

    if (searchTerm) {
      filtered = filtered.filter(reservation =>
        reservation?.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation?.reservationCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation?.reservationId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        formatLocation(getPickupLocation(reservation))?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        formatLocation(getDropoffLocation(reservation))?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getCustomerName(reservation)?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(reservation => reservation?.status === filterStatus);
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => {
      const dateA = new Date(a?.createdAt || a?.date || 0);
      const dateB = new Date(b?.createdAt || b?.date || 0);
      return dateB - dateA;
    });

    setFilteredReservations(filtered);
  }, [reservations, searchTerm, filterStatus]);

  const statusOptions = [
    { value: 'PENDING', label: 'Bekleyen', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'CONFIRMED', label: 'Onaylandı', color: 'bg-blue-100 text-blue-800' },
    { value: 'ASSIGNED', label: 'Atandı', color: 'bg-green-100 text-green-800' },
    { value: 'IN_PROGRESS', label: 'Devam Ediyor', color: 'bg-purple-100 text-purple-800' },
    { value: 'COMPLETED', label: 'Tamamlandı', color: 'bg-green-100 text-green-800' },
    { value: 'CANCELLED', label: 'İptal Edildi', color: 'bg-red-100 text-red-800' }
  ];

  const getStatusInfo = (status) => {
    return statusOptions.find(option => option.value === status) || statusOptions[0];
  };

  const getDriverName = (driverId) => {
    if (!driverId) return 'Henüz atanmadı';
    const driver = drivers.find(d => d.id === driverId);
    return driver ? `${driver.firstName} ${driver.lastName}` : 'Bilinmeyen Şoför';
  };

  const getDriverPhone = (driverId) => {
    if (!driverId) return null;
    const driver = drivers.find(d => d.id === driverId);
    return driver?.phone;
  };

  const getVehicleInfo = (vehicleId) => {
    if (!vehicleId) return { brand: 'Henüz atanmadı', model: '', plateNumber: '', full: 'Henüz atanmadı' };
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? {
      brand: vehicle.brand || 'Bilinmeyen',
      model: vehicle.model || '',
      plateNumber: vehicle.plateNumber || 'Bilinmeyen',
      full: `${vehicle.brand} ${vehicle.model} (${vehicle.plateNumber})`
    } : { brand: 'Bilinmeyen araç', model: '', plateNumber: '', full: 'Bilinmeyen araç' };
  };

  const formatDateTime = (reservation) => {
    // Hem yeni hem eski format için uyumlu
    const date = reservation?.tripDetails?.date || reservation?.date;
    const time = reservation?.tripDetails?.time || reservation?.time;
    if (!date) return 'Tarih belirtilmemiş';
    const dateObj = new Date(date);
    const formattedDate = dateObj.toLocaleDateString('tr-TR');
    return time ? `${formattedDate} - ${time}` : formattedDate;
  };

  const getPickupLocation = (reservation) => {
    const location = reservation?.tripDetails?.pickupLocation || reservation?.pickupLocation;
    return formatLocation(location);
  };

  const getDropoffLocation = (reservation) => {
    const location = reservation?.tripDetails?.dropoffLocation || reservation?.dropoffLocation;
    return formatLocation(location);
  };

  const getCustomerName = (reservation) => {
    const firstName = reservation.customerInfo?.firstName || reservation.personalInfo?.firstName || '';
    const lastName = reservation.customerInfo?.lastName || reservation.personalInfo?.lastName || '';
    return `${firstName} ${lastName}`.trim() || 'İsimsiz';
  };

  const getCustomerPhone = (reservation) => {
    return reservation.customerInfo?.phone || reservation.personalInfo?.phone || '';
  };

  const getPassengerCount = (reservation) => {
    return reservation?.tripDetails?.passengerCount || reservation?.passengerCount || 1;
  };

  const formatLocation = (location) => {
    if (!location) return 'Bilinmiyor';
    if (typeof location === 'string') return location;
    if (typeof location === 'object') {
      if (location.address) return String(location.address);
      if (location.name) return String(location.name);
      if (location.formatted_address) return String(location.formatted_address);
      if (location.description) return String(location.description);
      return 'Lokasyon bilgisi mevcut';
    }
    return String(location);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Çıkış hatası:', error);
    }
  };

  // Giriş yapmamışsa login sayfasına yönlendir
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Giriş Yapmanız Gerekiyor</h2>
          <p className="text-gray-600 mb-6">Rezervasyonlarınızı görmek için lütfen giriş yapın.</p>
          <button
            onClick={() => navigate('/giriş')}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Giriş Yap
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Rezervasyonlar yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Rezervasyonlarım</h1>
              <p className="text-gray-600">Hoş geldiniz, {userProfile?.firstName || user.email}</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/profil')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span>Profil</span>
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Çıkış</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{reservations.length}</div>
            <div className="text-sm text-gray-600">Toplam Rezervasyon</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {reservations.filter(r => r.status === 'PENDING').length}
            </div>
            <div className="text-sm text-gray-600">Bekleyen</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {reservations.filter(r => r.status === 'COMPLETED').length}
            </div>
            <div className="text-sm text-gray-600">Tamamlandı</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {reservations.filter(r => ['CONFIRMED', 'ASSIGNED', 'IN_PROGRESS'].includes(r.status)).length}
            </div>
            <div className="text-sm text-gray-600">Aktif</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rezervasyon ara..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Tüm Durumlar</option>
              {statusOptions.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Reservations List */}
        {filteredReservations.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || filterStatus !== 'all' 
                ? 'Rezervasyon bulunamadı' 
                : 'Henüz rezervasyon yok'
              }
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || filterStatus !== 'all'
                ? 'Arama kriterlerinize uygun rezervasyon bulunamadı' 
                : 'İlk rezervasyonunuzu yapmaya başlayın'
              }
            </p>
            {!searchTerm && filterStatus === 'all' && (
              <button
                onClick={() => navigate('/')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Rezervasyon Yap
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReservations.map((reservation, index) => (
              <motion.div
                key={reservation?.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        #{reservation?.reservationCode || reservation?.reservationId || reservation?.id?.slice(-8) || 'Rezervasyon'}
                      </h3>
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusInfo(reservation?.status).color}`}>
                        {getStatusInfo(reservation?.status).label}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-900">
                        €{Number(reservation?.totalPrice || 0).toLocaleString('tr-TR')}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDateTime(reservation)}
                      </p>
                    </div>
                  </div>

                  {/* Route Info */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="font-medium">Güzergah</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        <p className="text-sm text-gray-900">
                          {formatLocation(getPickupLocation(reservation))}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                        <p className="text-sm text-gray-900">
                          {formatLocation(getDropoffLocation(reservation))}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Driver & Vehicle Info */}
                  {(reservation?.status === 'ASSIGNED' || reservation?.status === 'IN_PROGRESS' || reservation?.status === 'COMPLETED') && (
                    <div className="bg-blue-50 rounded-lg p-4 mb-4">
                      <h4 className="font-medium text-blue-900 text-sm mb-3">🚗 Şoför & Araç Bilgileri</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Driver Info */}
                        <div>
                          <div className="flex items-center text-sm text-blue-700 mb-1">
                            <User className="w-4 h-4 mr-1" />
                            <span className="font-medium">Şoför</span>
                          </div>
                          <p className="font-semibold text-blue-900 mb-1">
                            {getDriverName(reservation.assignedDriver || reservation.driverId)}
                          </p>
                          {getDriverPhone(reservation.assignedDriver || reservation.driverId) && (
                            <a 
                              href={`tel:${getDriverPhone(reservation.assignedDriver || reservation.driverId)}`}
                              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 bg-blue-100 hover:bg-blue-200 px-2 py-1 rounded transition-colors"
                            >
                              <Phone className="w-3 h-3 mr-1" />
                              {getDriverPhone(reservation.assignedDriver || reservation.driverId)}
                            </a>
                          )}
                        </div>
                        
                        {/* Vehicle Info */}
                        <div>
                          <div className="flex items-center text-sm text-blue-700 mb-1">
                            <Car className="w-4 h-4 mr-1" />
                            <span className="font-medium">Araç</span>
                          </div>
                          <p className="font-semibold text-blue-900 mb-1">
                            {getVehicleInfo(reservation.assignedVehicle || reservation.vehicleId).full}
                          </p>
                          {getVehicleInfo(reservation.assignedVehicle || reservation.vehicleId).plateNumber && 
                           getVehicleInfo(reservation.assignedVehicle || reservation.vehicleId).plateNumber !== 'Bilinmeyen' && (
                            <span className="inline-block text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded font-mono">
                              {getVehicleInfo(reservation.assignedVehicle || reservation.vehicleId).plateNumber}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        setSelectedReservation(reservation);
                        setShowModal(true);
                        // QR kod oluştur
                        const reservationCode = reservation?.reservationCode || reservation?.reservationId || reservation?.id;
                        const customerPhone = reservation?.customerInfo?.phone || getCustomerPhone(reservation);
                        if (reservationCode && customerPhone) {
                          generateQRCode(reservationCode, customerPhone);
                        }
                      }}
                      className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Detaylar
                    </button>

                    {/* Call Driver Button */}
                    {getDriverPhone(reservation.assignedDriver || reservation.driverId) && (
                      <a
                        href={`tel:${getDriverPhone(reservation.assignedDriver || reservation.driverId)}`}
                        className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
                      >
                        <Phone className="w-4 h-4 mr-1" />
                        Şoförü Ara
                      </a>
                    )}

                    {/* Map Button */}
                    {reservation?.pickupLocation && reservation?.dropoffLocation && (
                      <a
                        href={`https://www.google.com/maps/dir/${encodeURIComponent(formatLocation(reservation?.pickupLocation))}/${encodeURIComponent(formatLocation(reservation?.dropoffLocation))}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Navigation className="w-4 h-4 mr-1" />
                        Harita
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && selectedReservation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Rezervasyon Detayları
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ×
                </button>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-600">Rezervasyon Kodu</label>
                    <p className="font-medium">#{selectedReservation.reservationCode || selectedReservation.reservationId || selectedReservation.id}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Durum</label>
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ml-2 ${getStatusInfo(selectedReservation.status).color}`}>
                      {getStatusInfo(selectedReservation.status).label}
                    </span>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Tarih & Saat</label>
                    <p className="font-medium">{formatDateTime(selectedReservation.date, selectedReservation.time)}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Nereden</label>
                    <p className="font-medium">{formatLocation(selectedReservation.pickupLocation)}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Nereye</label>
                    <p className="font-medium">{formatLocation(selectedReservation.dropoffLocation)}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Toplam Ücret</label>
                    <p className="font-medium text-blue-600">€{Number(selectedReservation.totalPrice || 0).toLocaleString('tr-TR')}</p>
                  </div>
                  
                  {/* QR Kod Bölümü */}
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <QrCode className="w-5 h-5 text-purple-600" />
                        <label className="text-sm text-gray-600 font-medium">QR Kod</label>
                      </div>
                    </div>
                    {qrCodeUrl ? (
                      <div className="text-center">
                        <div className="bg-white p-3 rounded-lg border-2 border-purple-200 inline-block mb-3">
                          <img src={qrCodeUrl} alt="QR Code" className="w-32 h-32 mx-auto" />
                        </div>
                        <button
                          onClick={downloadQRCode}
                          className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all duration-300 text-sm flex items-center justify-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          QR Kodunu İndir
                        </button>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <div className="w-32 h-32 mx-auto flex items-center justify-center bg-gray-100 rounded-lg">
                          <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">QR kod oluşturuluyor...</p>
                      </div>
                    )}
                  </div>
                  
                  {/* QR Kod Bölümü */}
                  <div className="mt-6 p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-200">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                        <QrCode className="w-4 h-4 text-white" />
                      </div>
                      <h4 className="font-medium text-gray-900">QR Kod</h4>
                    </div>
                    
                    {qrCodeUrl ? (
                      <div className="text-center">
                        <div className="bg-white p-3 rounded-xl border-2 border-purple-200 inline-block mb-4 shadow-lg">
                          <img src={qrCodeUrl} alt="QR Code" className="w-32 h-32 mx-auto" />
                        </div>
                        <button
                          onClick={downloadQRCode}
                          className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all duration-300 text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                        >
                          <Download className="w-4 h-4" />
                          QR Kodunu İndir
                        </button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="bg-white/50 backdrop-blur-sm p-6 rounded-xl border border-purple-200">
                          <div className="w-32 h-32 mx-auto flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl">
                            <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                          </div>
                          <p className="text-sm text-gray-500 mt-4">QR kod oluşturuluyor...</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 bg-white border-t p-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Kapat
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReservations;
