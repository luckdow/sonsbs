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
  QrCode,
  Edit
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { collection, onSnapshot, query, where, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { USER_ROLES } from '../../config/constants';
import { useNavigate } from 'react-router-dom';
import QRCode from 'qrcode';
import toast from 'react-hot-toast';

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
  const [editingReservation, setEditingReservation] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({});
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

  // Şoför bilgilerini getir
  const getDriverInfo = (driverId) => {
    const driver = drivers.find(d => d.id === driverId);
    return driver || { firstName: 'Bilinmiyor', lastName: '', phone: 'Bilinmiyor' };
  };

  // 12 saat içinde düzenleme/iptal kontrolü
  const canModifyReservation = (reservation) => {
    const reservationDate = new Date(reservation.tripDetails?.date || reservation.date);
    const reservationTime = reservation.tripDetails?.time || reservation.time;
    
    if (!reservationDate || !reservationTime) {
      return false; // Tarih/saat yoksa düzenlenemez
    }
    
    // Rezervasyon tarih ve saatini birleştir
    const [hours, minutes] = reservationTime.split(':');
    reservationDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    const now = new Date();
    const timeDiff = reservationDate.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 3600);
    
    console.log('Rezervasyon düzenleme kontrolü:', {
      reservationDate: reservationDate.toISOString(),
      currentTime: now.toISOString(),
      hoursDiff: hoursDiff.toFixed(2),
      status: reservation.status,
      canModify: hoursDiff > 12 && ['pending', 'confirmed', 'PENDING', 'CONFIRMED'].includes(reservation.status)
    });
    
    // 12 saatten fazla kaldıysa ve status pending/confirmed ise düzenlenebilir
    return (hoursDiff > 12 && ['pending', 'confirmed', 'PENDING', 'CONFIRMED'].includes(reservation.status));
  };

  // Rezervasyon düzenleme - Modal açılacak
  const handleEditReservation = (reservation) => {
    console.log('🖊️ Rezervasyon düzenleme başlatılıyor:', reservation.id);
    
    // Form verilerini hazırla
    const formData = {
      firstName: reservation.customerInfo?.firstName || reservation.personalInfo?.firstName || '',
      lastName: reservation.customerInfo?.lastName || reservation.personalInfo?.lastName || '',
      phone: reservation.customerInfo?.phone || reservation.personalInfo?.phone || '', 
      email: reservation.customerInfo?.email || reservation.personalInfo?.email || '',
      flightNumber: reservation.customerInfo?.flightNumber || reservation.personalInfo?.flightNumber || '',
      flightTime: reservation.customerInfo?.flightTime || reservation.personalInfo?.flightTime || '',
      pickupLocation: formatLocation(reservation.tripDetails?.pickupLocation || reservation.pickupLocation),
      dropoffLocation: formatLocation(reservation.tripDetails?.dropoffLocation || reservation.dropoffLocation),
      date: reservation.tripDetails?.date || reservation.date || '',
      time: reservation.tripDetails?.time || reservation.time || '',
      passengerCount: reservation.tripDetails?.passengerCount || reservation.passengerCount || 1
    };
    
    setEditForm(formData);
    setEditingReservation(reservation);
    setShowEditModal(true);
  };

  // Düzenleme kaydetme
  const handleSaveEdit = async () => {
    if (!editingReservation) return;

    try {
      console.log('💾 Rezervasyon düzenleme kaydediliyor:', editForm);

      const updateData = {
        // Müşteri bilgilerini güncelle
        customerInfo: {
          firstName: editForm.firstName,
          lastName: editForm.lastName,
          phone: editForm.phone,
          email: editForm.email,
          flightNumber: editForm.flightNumber,
          flightTime: editForm.flightTime
        },
        personalInfo: {
          firstName: editForm.firstName,
          lastName: editForm.lastName,
          phone: editForm.phone,
          email: editForm.email,
          flightNumber: editForm.flightNumber,
          flightTime: editForm.flightTime
        },
        // Trip bilgilerini güncelle
        tripDetails: {
          ...editingReservation.tripDetails,
          pickupLocation: editForm.pickupLocation,
          dropoffLocation: editForm.dropoffLocation,
          date: editForm.date,
          time: editForm.time,
          passengerCount: parseInt(editForm.passengerCount)
        },
        // Eski format için backward compatibility
        pickupLocation: editForm.pickupLocation,
        dropoffLocation: editForm.dropoffLocation,
        date: editForm.date,
        time: editForm.time,
        passengerCount: parseInt(editForm.passengerCount),
        // Admin için log bilgileri
        lastEditedAt: new Date().toISOString(),
        editedBy: user.email,
        editHistory: [
          ...(editingReservation.editHistory || []),
          {
            editedAt: new Date().toISOString(),
            editedBy: user.email,
            changes: 'Müşteri bilgileri ve seyahat detayları güncellendi'
          }
        ],
        updatedAt: new Date().toISOString()
      };

      await updateDoc(doc(db, 'reservations', editingReservation.id), updateData);

      toast.success('Rezervasyon başarıyla güncellendi. Değişiklikler admin panelinde görüntülenecek.');
      setShowEditModal(false);
      setEditingReservation(null);
      setEditForm({});
      
    } catch (error) {
      console.error('❌ Rezervasyon düzenleme hatası:', error);
      toast.error('Rezervasyon güncellenirken hata oluştu: ' + error.message);
    }
  };

  // Rezervasyon iptal etme - Admin paneline yansıma ile
  const handleCancelReservation = async (reservation) => {
    if (!window.confirm(`Bu rezervasyonu iptal etmek istediğinizden emin misiniz?\n\nRezervasyon: ${reservation.reservationCode || reservation.reservationId}\nTarih: ${reservation.tripDetails?.date || reservation.date} ${reservation.tripDetails?.time || reservation.time}`)) {
      return;
    }

    try {
      const updateData = {
        status: 'cancelled',
        cancelledAt: new Date().toISOString(),
        cancelledBy: user.email,
        cancellationReason: 'Müşteri tarafından iptal edildi',
        updatedAt: new Date().toISOString()
      };

      // Firebase'de rezervasyon durumunu 'cancelled' yap
      await updateDoc(doc(db, 'reservations', reservation.id), updateData);

      toast.success('Rezervasyon başarıyla iptal edildi. Admin panelinde görüntülenecek.');
      setShowModal(false);
      
    } catch (error) {
      console.error('Rezervasyon iptal hatası:', error);
      toast.error('Rezervasyon iptal edilirken hata oluştu: ' + error.message);
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

    // Status seçenekleri - Firebase durum değerleriyle uyumlu
  const statusOptions = [
    { value: 'pending', label: 'Bekliyor', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'confirmed', label: 'Onaylandı', color: 'bg-blue-100 text-blue-800' },
    { value: 'assigned', label: 'Şoför Atandı', color: 'bg-green-100 text-green-800' },
    { value: 'in_progress', label: 'Devam Ediyor', color: 'bg-purple-100 text-purple-800' },
    { value: 'completed', label: 'Tamamlandı', color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: 'İptal Edildi', color: 'bg-red-100 text-red-800' },
    // Büyük harfli versiyonları da destekle
    { value: 'PENDING', label: 'Bekliyor', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'CONFIRMED', label: 'Onaylandı', color: 'bg-blue-100 text-blue-800' },
    { value: 'ASSIGNED', label: 'Şoför Atandı', color: 'bg-green-100 text-green-800' },
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
              {reservations.filter(r => r.status === 'pending' || r.status === 'PENDING').length}
            </div>
            <div className="text-sm text-gray-600">Bekleyen</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {reservations.filter(r => r.status === 'completed' || r.status === 'COMPLETED').length}
            </div>
            <div className="text-sm text-gray-600">Tamamlandı</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {reservations.filter(r => r.assignedDriver && r.assignedDriver !== '').length}
            </div>
            <div className="text-sm text-gray-600">Şoför Atandı</div>
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

                  {/* Driver & Vehicle Info - Eğer şoför atanmışsa */}
                  {reservation?.assignedDriver && reservation.assignedDriver !== 'manual' && (
                    <div className="bg-green-50 rounded-lg p-4 mb-4 border border-green-200">
                      <h4 className="font-medium text-green-900 text-sm mb-3 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Şoför Atandı
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Driver Info */}
                        <div>
                          <div className="flex items-center text-sm text-green-700 mb-1">
                            <User className="w-4 h-4 mr-1" />
                            <span className="font-medium">Şoför</span>
                          </div>
                          <p className="font-semibold text-green-900 mb-1">
                            {getDriverName(reservation.assignedDriver)}
                          </p>
                          {getDriverPhone(reservation.assignedDriver) && (
                            <a 
                              href={`tel:${getDriverPhone(reservation.assignedDriver)}`}
                              className="inline-flex items-center text-sm text-green-600 hover:text-green-800 bg-green-100 hover:bg-green-200 px-2 py-1 rounded transition-colors"
                            >
                              <Phone className="w-3 h-3 mr-1" />
                              {getDriverPhone(reservation.assignedDriver)}
                            </a>
                          )}
                        </div>
                        
                        {/* Vehicle Info */}
                        <div>
                          <div className="flex items-center text-sm text-green-700 mb-1">
                            <Car className="w-4 h-4 mr-1" />
                            <span className="font-medium">Araç</span>
                          </div>
                          <p className="font-semibold text-green-900 mb-1">
                            {getVehicleInfo(reservation.assignedVehicle || reservation.vehicleId).full}
                          </p>
                          {getVehicleInfo(reservation.assignedVehicle || reservation.vehicleId).plateNumber && 
                           getVehicleInfo(reservation.assignedVehicle || reservation.vehicleId).plateNumber !== 'Bilinmeyen' && (
                            <span className="inline-block text-xs bg-green-200 text-green-800 px-2 py-1 rounded font-mono">
                              {getVehicleInfo(reservation.assignedVehicle || reservation.vehicleId).plateNumber}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Manuel Şoför Bilgileri */}
                  {reservation?.assignedDriver === 'manual' && reservation.manualDriverInfo && (
                    <div className="bg-purple-50 rounded-lg p-4 mb-4 border border-purple-200">
                      <h4 className="font-medium text-purple-900 text-sm mb-3 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Şoför Atandı
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center text-sm text-purple-700 mb-1">
                            <User className="w-4 h-4 mr-1" />
                            <span className="font-medium">Şoför</span>
                          </div>
                          <p className="font-semibold text-purple-900 mb-1">
                            {reservation.manualDriverInfo.name}
                          </p>
                          <a 
                            href={`tel:${reservation.manualDriverInfo.phone}`}
                            className="inline-flex items-center text-sm text-purple-600 hover:text-purple-800 bg-purple-100 hover:bg-purple-200 px-2 py-1 rounded transition-colors"
                          >
                            <Phone className="w-3 h-3 mr-1" />
                            {reservation.manualDriverInfo.phone}
                          </a>
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

                    {/* 12 saat içinde düzenleme/iptal butonları */}
                    {canModifyReservation(reservation) && (
                      <>
                        <button
                          onClick={() => handleEditReservation(reservation)}
                          className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Düzenle
                        </button>
                        <button
                          onClick={() => handleCancelReservation(reservation)}
                          className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
                        >
                          <X className="w-4 h-4 mr-1" />
                          İptal Et
                        </button>
                      </>
                    )}

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

                  {/* 12 saat uyarısı */}
                  {!canModifyReservation(reservation) && ['pending', 'confirmed', 'PENDING', 'CONFIRMED'].includes(reservation.status) && (
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center text-sm text-yellow-800">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        <span>Rezervasyon tarihine 12 saatten az kaldığı için düzenleme/iptal yapılamaz. Değişiklik için lütfen iletişime geçin: +90 532 574 26 82</span>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && editingReservation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Rezervasyon Düzenle - #{editingReservation.reservationCode || editingReservation.reservationId}
                </h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ×
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Müşteri Bilgileri */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="w-4 h-4 mr-2 text-blue-600" />
                    Müşteri Bilgileri
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ad</label>
                      <input
                        type="text"
                        value={editForm.firstName || ''}
                        onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ad"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Soyad</label>
                      <input
                        type="text"
                        value={editForm.lastName || ''}
                        onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Soyad"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                      <input
                        type="tel"
                        value={editForm.phone || ''}
                        onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Telefon numarası"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
                      <input
                        type="email"
                        value={editForm.email || ''}
                        onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="E-posta adresi"
                      />
                    </div>
                  </div>
                </div>

                {/* Uçuş Bilgileri */}
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <h4 className="font-semibold text-gray-900 mb-4">Uçuş Bilgileri (Opsiyonel)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Uçuş Numarası</label>
                      <input
                        type="text"
                        value={editForm.flightNumber || ''}
                        onChange={(e) => setEditForm({...editForm, flightNumber: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Örn: TK123"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Uçuş Saati</label>
                      <input
                        type="time"
                        value={editForm.flightTime || ''}
                        onChange={(e) => setEditForm({...editForm, flightTime: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Seyahat Bilgileri */}
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-green-600" />
                    Seyahat Bilgileri
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nereden</label>
                      <input
                        type="text"
                        value={editForm.pickupLocation || ''}
                        onChange={(e) => setEditForm({...editForm, pickupLocation: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Kalkış noktası"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nereye</label>
                      <input
                        type="text"
                        value={editForm.dropoffLocation || ''}
                        onChange={(e) => setEditForm({...editForm, dropoffLocation: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Varış noktası"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tarih</label>
                        <input
                          type="date"
                          value={editForm.date || ''}
                          onChange={(e) => setEditForm({...editForm, date: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Saat</label>
                        <input
                          type="time"
                          value={editForm.time || ''}
                          onChange={(e) => setEditForm({...editForm, time: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Yolcu Sayısı</label>
                        <select
                          value={editForm.passengerCount || 1}
                          onChange={(e) => setEditForm({...editForm, passengerCount: parseInt(e.target.value)})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                          {[1,2,3,4,5,6,7,8].map(num => (
                            <option key={num} value={num}>{num} Kişi</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Uyarı Mesajı */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center text-sm text-yellow-800">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    <span>Değişiklikler admin panelinde görüntülenecek ve manuel onay gerektirebilir.</span>
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 bg-white border-t p-4 flex space-x-3">
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Değişiklikleri Kaydet
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  İptal
                </button>
              </div>
            </motion.div>
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
                {/* Müşteri Bilgileri */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <User className="w-4 h-4 mr-2 text-blue-600" />
                    Müşteri Bilgileri
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600">Ad Soyad</label>
                      <p className="font-medium">
                        {selectedReservation.customerInfo?.firstName || selectedReservation.personalInfo?.firstName || ''} {' '}
                        {selectedReservation.customerInfo?.lastName || selectedReservation.personalInfo?.lastName || ''}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Telefon</label>
                      <p className="font-medium">
                        {selectedReservation.customerInfo?.phone || selectedReservation.personalInfo?.phone || 'Belirtilmedi'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">E-posta</label>
                      <p className="font-medium">
                        {selectedReservation.customerInfo?.email || selectedReservation.personalInfo?.email || 'Belirtilmedi'}
                      </p>
                    </div>
                    {(selectedReservation.customerInfo?.flightNumber || selectedReservation.personalInfo?.flightNumber) && (
                      <div>
                        <label className="text-sm text-gray-600">Uçuş Numarası</label>
                        <p className="font-medium">
                          {selectedReservation.customerInfo?.flightNumber || selectedReservation.personalInfo?.flightNumber}
                        </p>
                      </div>
                    )}
                    {(selectedReservation.customerInfo?.flightTime || selectedReservation.personalInfo?.flightTime) && (
                      <div>
                        <label className="text-sm text-gray-600">Uçuş Saati</label>
                        <p className="font-medium">
                          {selectedReservation.customerInfo?.flightTime || selectedReservation.personalInfo?.flightTime}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

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

                  {/* Şoför Bilgileri - Eğer atanmışsa */}
                  {selectedReservation.assignedDriver && selectedReservation.assignedDriver !== 'manual' && (
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <User className="w-4 h-4 mr-2 text-green-600" />
                        Atanan Şoför
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-gray-600">Şoför Adı</label>
                          <p className="font-medium">
                            {getDriverInfo(selectedReservation.assignedDriver).firstName} {getDriverInfo(selectedReservation.assignedDriver).lastName}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">Telefon</label>
                          <p className="font-medium">
                            {getDriverInfo(selectedReservation.assignedDriver).phone || 'Belirtilmedi'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Manuel şoför bilgileri */}
                  {selectedReservation.assignedDriver === 'manual' && selectedReservation.manualDriverInfo && (
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <User className="w-4 h-4 mr-2 text-purple-600" />
                        Atanan Şoför
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-gray-600">Şoför Adı</label>
                          <p className="font-medium">{selectedReservation.manualDriverInfo.name}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">Telefon</label>
                          <p className="font-medium">{selectedReservation.manualDriverInfo.phone}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-sm text-gray-600">Tarih & Saat</label>
                    <p className="font-medium">
                      {selectedReservation.tripDetails?.date || selectedReservation.date || 'Belirtilmedi'} - {selectedReservation.tripDetails?.time || selectedReservation.time || 'Belirtilmedi'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Nereden</label>
                    <p className="font-medium">{formatLocation(selectedReservation.tripDetails?.pickupLocation || selectedReservation.pickupLocation)}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Nereye</label>
                    <p className="font-medium">{formatLocation(selectedReservation.tripDetails?.dropoffLocation || selectedReservation.dropoffLocation)}</p>
                  </div>
                  
                  {/* Araç Bilgileri */}
                  <div>
                    <label className="text-sm text-gray-600">Seçilen Araç</label>
                    <p className="font-medium">{selectedReservation.selectedVehicle?.name || selectedReservation.vehicleInfo?.name || 'Belirlenmedi'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-600">Toplam Ücret</label>
                    <p className="font-medium text-blue-600">€{Number(selectedReservation.totalPrice || 0).toLocaleString('tr-TR')}</p>
                  </div>
                  
                  {/* QR Kod Bölümü - Tek QR kod */}
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
                </div>
              </div>

              <div className="sticky bottom-0 bg-white border-t p-4 space-y-3">
                {/* 12 saat içinde düzenleme/iptal seçenekleri */}
                {canModifyReservation(selectedReservation) ? (
                  <>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                      <div className="flex items-center text-sm text-green-800">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        <span>Rezervasyon tarihine 12+ saat var. Düzenleme/iptal yapabilirsiniz.</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditReservation(selectedReservation)}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Düzenle
                      </button>
                      <button
                        onClick={() => handleCancelReservation(selectedReservation)}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        İptal Et
                      </button>
                    </div>
                  </>
                ) : ['pending', 'confirmed', 'PENDING', 'CONFIRMED'].includes(selectedReservation.status) && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                    <div className="flex items-center text-sm text-yellow-800">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      <span>Rezervasyon tarihine 12 saatten az kaldı. Değişiklik için lütfen +90 532 574 26 82 numaralı telefonu arayın.</span>
                    </div>
                  </div>
                )}
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
