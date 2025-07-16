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
  DollarSign,
  Search,
  Filter,
  Eye,
  Star,
  Navigation
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const MyReservations = () => {
  const { state, user, updateReservation, showNotification } = useApp();
  const { reservations, vehicles, drivers } = state;
  
  const [customerReservations, setCustomerReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (user?.email) {
      // Get customer's reservations by email
      const customerReservations = reservations.filter(
        r => r.customerInfo?.email?.toLowerCase() === user.email.toLowerCase()
      );
      setCustomerReservations(customerReservations);
    }
  }, [reservations, user]);

  useEffect(() => {
    // Apply filters
    let filtered = customerReservations;

    if (searchTerm) {
      filtered = filtered.filter(reservation =>
        reservation.reservationId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.tripDetails?.from?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.tripDetails?.to?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(reservation => reservation.status === filterStatus);
    }

    if (filterDate) {
      filtered = filtered.filter(reservation => {
        if (!reservation.tripDetails?.date) return false;
        return new Date(reservation.tripDetails.date).toDateString() === new Date(filterDate).toDateString();
      });
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt || a.tripDetails?.date || 0);
      const dateB = new Date(b.createdAt || b.tripDetails?.date || 0);
      return dateB - dateA;
    });

    setFilteredReservations(filtered);
  }, [customerReservations, searchTerm, filterStatus, filterDate]);

  const statusOptions = [
    { value: 'pending', label: 'Bekleyen', color: 'status-pending' },
    { value: 'confirmed', label: 'Onaylandı', color: 'status-confirmed' },
    { value: 'assigned', label: 'Atandı', color: 'status-assigned' },
    { value: 'in-progress', label: 'Devam Ediyor', color: 'status-progress' },
    { value: 'completed', label: 'Tamamlandı', color: 'status-completed' },
    { value: 'cancelled', label: 'İptal Edildi', color: 'status-cancelled' }
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
    if (!vehicleId) return 'Henüz atanmadı';
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.brand} ${vehicle.model} (${vehicle.plateNumber})` : 'Bilinmeyen Araç';
  };

  const handleCancelReservation = async (reservationId) => {
    if (window.confirm('Bu rezervasyonu iptal etmek istediğinizden emin misiniz?')) {
      try {
        await updateReservation(reservationId, { status: 'cancelled' });
        showNotification('Rezervasyon iptal edildi', 'success');
      } catch (error) {
        console.error('İptal etme hatası:', error);
        showNotification('Rezervasyon iptal edilirken bir hata oluştu', 'error');
      }
    }
  };

  const canCancel = (reservation) => {
    // Only allow cancellation for pending, confirmed, or assigned reservations
    return ['pending', 'confirmed', 'assigned'].includes(reservation.status);
  };

  const formatDateTime = (date, time) => {
    if (!date) return 'Tarih belirtilmemiş';
    const dateObj = new Date(date);
    const formattedDate = dateObj.toLocaleDateString('tr-TR');
    return time ? `${formattedDate} - ${time}` : formattedDate;
  };

  const getReservationStats = () => {
    const total = customerReservations.length;
    const pending = customerReservations.filter(r => r.status === 'pending').length;
    const confirmed = customerReservations.filter(r => r.status === 'confirmed').length;
    const completed = customerReservations.filter(r => r.status === 'completed').length;
    const cancelled = customerReservations.filter(r => r.status === 'cancelled').length;
    
    return { total, pending, confirmed, completed, cancelled };
  };

  const stats = getReservationStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Rezervasyonlarım</h1>
        <p className="text-gray-600">Tüm transfer rezervasyonlarınızı görüntüleyip yönetin</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="card">
          <div className="card-body text-center">
            <Calendar className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-sm text-gray-600">Toplam</p>
          </div>
        </div>

        <div className="card">
          <div className="card-body text-center">
            <Clock className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            <p className="text-sm text-gray-600">Bekleyen</p>
          </div>
        </div>

        <div className="card">
          <div className="card-body text-center">
            <CheckCircle className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{stats.confirmed}</p>
            <p className="text-sm text-gray-600">Onaylı</p>
          </div>
        </div>

        <div className="card">
          <div className="card-body text-center">
            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
            <p className="text-sm text-gray-600">Tamamlandı</p>
          </div>
        </div>

        <div className="card">
          <div className="card-body text-center">
            <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{stats.cancelled}</p>
            <p className="text-sm text-gray-600">İptal</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rezervasyon ID veya güzergah ile ara..."
                className="input pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div>
              <select
                className="input"
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

            <div>
              <input
                type="date"
                className="input"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                placeholder="Tarih filtrele"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Reservations List */}
      {filteredReservations.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || filterStatus !== 'all' || filterDate 
                ? 'Rezervasyon bulunamadı' 
                : 'Henüz rezervasyon yok'
              }
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || filterStatus !== 'all' || filterDate
                ? 'Arama kriterlerinize uygun rezervasyon bulunamadı' 
                : 'İlk rezervasyonunuzu yapmaya başlayın'
              }
            </p>
            {!searchTerm && filterStatus === 'all' && !filterDate && (
              <a href="/" className="btn btn-primary">
                <Calendar className="w-4 h-4 mr-2" />
                İlk Rezervasyonu Yap
              </a>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReservations.map((reservation, index) => (
            <motion.div
              key={reservation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card hover:shadow-lg transition-shadow"
            >
              <div className="card-body">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Main Info */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {reservation.reservationId || `RES-${reservation.id?.slice(-6)}`}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusInfo(reservation.status).color}`}>
                          {getStatusInfo(reservation.status).label}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          ₺{reservation.totalPrice?.toLocaleString('tr-TR') || '0'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDateTime(reservation.tripDetails?.date, reservation.tripDetails?.time)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Route Info */}
                      <div>
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <MapPin className="w-4 h-4 mr-1" />
                          Güzergah
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-900">
                            <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                            {reservation.tripDetails?.from || 'Bilinmiyor'}
                          </p>
                          <p className="text-sm text-gray-900">
                            <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                            {reservation.tripDetails?.to || 'Bilinmiyor'}
                          </p>
                        </div>
                        {reservation.tripDetails?.distance && (
                          <p className="text-xs text-gray-500 mt-1">
                            Mesafe: {reservation.tripDetails.distance} km
                          </p>
                        )}
                      </div>

                      {/* Passenger Info */}
                      <div>
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <User className="w-4 h-4 mr-1" />
                          Yolcu Bilgileri
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-900">
                            {reservation.passengerCount || 1} Yetişkin
                            {reservation.childCount > 0 && `, ${reservation.childCount} Çocuk`}
                          </p>
                          {reservation.luggageCount > 0 && (
                            <p className="text-sm text-gray-500">
                              {reservation.luggageCount} Bagaj
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Driver & Vehicle Info */}
                    {(reservation.status === 'assigned' || reservation.status === 'in-progress' || reservation.status === 'completed') && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <div className="flex items-center text-sm text-blue-700 mb-1">
                              <User className="w-4 h-4 mr-1" />
                              Şoför
                            </div>
                            <p className="font-medium text-blue-900">
                              {getDriverName(reservation.driverId)}
                            </p>
                            {getDriverPhone(reservation.driverId) && (
                              <div className="flex items-center text-sm text-blue-600 mt-1">
                                <Phone className="w-3 h-3 mr-1" />
                                {getDriverPhone(reservation.driverId)}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center text-sm text-blue-700 mb-1">
                              <Car className="w-4 h-4 mr-1" />
                              Araç
                            </div>
                            <p className="font-medium text-blue-900">
                              {getVehicleInfo(reservation.vehicleId)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Special Requests */}
                    {reservation.specialRequests && (
                      <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          <strong>Özel İstekler:</strong> {reservation.specialRequests}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-2 lg:ml-4">
                    <button
                      onClick={() => {
                        setSelectedReservation(reservation);
                        setShowModal(true);
                      }}
                      className="btn btn-outline"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Detaylar
                    </button>

                    {/* Call Driver Button */}
                    {getDriverPhone(reservation.driverId) && (
                      <a
                        href={`tel:${getDriverPhone(reservation.driverId)}`}
                        className="btn btn-outline"
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Şoförü Ara
                      </a>
                    )}

                    {/* Map Button */}
                    {reservation.tripDetails?.from && reservation.tripDetails?.to && (
                      <a
                        href={`https://www.google.com/maps/dir/${encodeURIComponent(reservation.tripDetails.from)}/${encodeURIComponent(reservation.tripDetails.to)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline"
                      >
                        <Navigation className="w-4 h-4 mr-2" />
                        Harita
                      </a>
                    )}

                    {/* Cancel Button */}
                    {canCancel(reservation) && (
                      <button
                        onClick={() => handleCancelReservation(reservation.id)}
                        className="btn btn-outline text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        İptal Et
                      </button>
                    )}

                    {/* Rate Button for completed trips */}
                    {reservation.status === 'completed' && !reservation.rating && (
                      <button
                        className="btn btn-outline text-yellow-600 border-yellow-200 hover:bg-yellow-50"
                      >
                        <Star className="w-4 h-4 mr-2" />
                        Değerlendir
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Reservation Details Modal */}
      {showModal && selectedReservation && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="modal-content max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3 className="text-lg font-semibold">
                Rezervasyon Detayları - {selectedReservation.reservationId || `RES-${selectedReservation.id?.slice(-6)}`}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="modal-body space-y-6">
              {/* Status */}
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusInfo(selectedReservation.status).color}`}>
                  {getStatusInfo(selectedReservation.status).label}
                </span>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">
                    ₺{selectedReservation.totalPrice?.toLocaleString('tr-TR') || '0'}
                  </p>
                  <p className="text-sm text-gray-500">Toplam Ücret</p>
                </div>
              </div>

              {/* Trip Details */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3">Seyahat Detayları</h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Nereden</p>
                    <p className="font-medium">{selectedReservation.tripDetails?.from || 'Belirtilmemiş'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Nereye</p>
                    <p className="font-medium">{selectedReservation.tripDetails?.to || 'Belirtilmemiş'}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Tarih</p>
                      <p className="font-medium">
                        {selectedReservation.tripDetails?.date 
                          ? new Date(selectedReservation.tripDetails.date).toLocaleDateString('tr-TR')
                          : 'Belirtilmemiş'
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Saat</p>
                      <p className="font-medium">{selectedReservation.tripDetails?.time || 'Belirtilmemiş'}</p>
                    </div>
                  </div>
                  {selectedReservation.tripDetails?.distance && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Mesafe</p>
                        <p className="font-medium">{selectedReservation.tripDetails.distance} km</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Tahmini Süre</p>
                        <p className="font-medium">{selectedReservation.tripDetails.duration || 'Hesaplanmamış'}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Passenger Information */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3">Yolcu Bilgileri</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Yolcu Sayısı</p>
                      <p className="font-medium">
                        {selectedReservation.passengerCount || 1} Yetişkin
                        {selectedReservation.childCount > 0 && `, ${selectedReservation.childCount} Çocuk`}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Bagaj Sayısı</p>
                      <p className="font-medium">{selectedReservation.luggageCount || 0} adet</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Driver & Vehicle Information */}
              {(selectedReservation.driverId || selectedReservation.vehicleId) && (
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Araç ve Şoför</h4>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-blue-700">Atanmış Şoför</p>
                        <p className="font-medium text-blue-900">{getDriverName(selectedReservation.driverId)}</p>
                        {getDriverPhone(selectedReservation.driverId) && (
                          <p className="text-sm text-blue-600">{getDriverPhone(selectedReservation.driverId)}</p>
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-blue-700">Atanmış Araç</p>
                        <p className="font-medium text-blue-900">{getVehicleInfo(selectedReservation.vehicleId)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Special Requests */}
              {selectedReservation.specialRequests && (
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Özel İstekler</h4>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-yellow-800">{selectedReservation.specialRequests}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                onClick={() => setShowModal(false)}
                className="btn btn-outline"
              >
                Kapat
              </button>
              {canCancel(selectedReservation) && (
                <button
                  onClick={() => {
                    setShowModal(false);
                    handleCancelReservation(selectedReservation.id);
                  }}
                  className="btn btn-outline text-red-600 border-red-200 hover:bg-red-50"
                >
                  Rezervasyonu İptal Et
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MyReservations;
