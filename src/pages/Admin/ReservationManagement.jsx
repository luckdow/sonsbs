import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Search,
  Filter,
  Eye,
  Edit3,
  Trash2,
  MapPin,
  Clock,
  User,
  Phone,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Car,
  Users
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const ReservationManagement = () => {
  const { state, updateReservation, deleteReservation, showNotification } = useApp();
  const { reservations, vehicles, drivers } = state;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showModal, setShowModal] = useState(false);

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
    if (!driverId) return 'Atanmamış';
    const driver = drivers.find(d => d.id === driverId);
    return driver ? `${driver.firstName} ${driver.lastName}` : 'Bilinmeyen Şoför';
  };

  const getVehicleInfo = (vehicleId) => {
    if (!vehicleId) return 'Atanmamış';
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.brand} ${vehicle.model} (${vehicle.plateNumber})` : 'Bilinmeyen Araç';
  };

  const handleStatusUpdate = async (reservationId, newStatus) => {
    try {
      await updateReservation(reservationId, { status: newStatus });
      showNotification('Rezervasyon durumu güncellendi', 'success');
    } catch (error) {
      console.error('Durum güncelleme hatası:', error);
      showNotification('Durum güncellenirken bir hata oluştu', 'error');
    }
  };

  const handleDelete = async (reservationId) => {
    if (window.confirm('Bu rezervasyonu silmek istediğinizden emin misiniz?')) {
      try {
        await deleteReservation(reservationId);
        showNotification('Rezervasyon başarıyla silindi', 'success');
      } catch (error) {
        console.error('Rezervasyon silme hatası:', error);
        showNotification('Rezervasyon silinirken bir hata oluştu', 'error');
      }
    }
  };

  const handleAssignDriver = async (reservationId, driverId, vehicleId) => {
    try {
      await updateReservation(reservationId, { 
        driverId, 
        vehicleId,
        status: 'assigned'
      });
      showNotification('Şoför ve araç atandı', 'success');
    } catch (error) {
      console.error('Atama hatası:', error);
      showNotification('Atama yapılırken bir hata oluştu', 'error');
    }
  };

  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = 
      reservation.reservationId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.customerInfo?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.customerInfo?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.customerInfo?.phone?.includes(searchTerm) ||
      reservation.tripDetails?.from?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.tripDetails?.to?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || reservation.status === filterStatus;
    
    const matchesDate = !filterDate || 
      (reservation.tripDetails?.date && 
       new Date(reservation.tripDetails.date).toDateString() === new Date(filterDate).toDateString());
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getReservationStats = () => {
    const total = reservations.length;
    const pending = reservations.filter(r => r.status === 'pending').length;
    const confirmed = reservations.filter(r => r.status === 'confirmed').length;
    const completed = reservations.filter(r => r.status === 'completed').length;
    const cancelled = reservations.filter(r => r.status === 'cancelled').length;
    
    const totalRevenue = reservations
      .filter(r => r.status === 'completed')
      .reduce((sum, r) => sum + (r.totalPrice || 0), 0);

    return { total, pending, confirmed, completed, cancelled, totalRevenue };
  };

  const stats = getReservationStats();

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
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
            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{stats.confirmed}</p>
            <p className="text-sm text-gray-600">Onaylı</p>
          </div>
        </div>

        <div className="card">
          <div className="card-body text-center">
            <CheckCircle className="w-8 h-8 text-blue-500 mx-auto mb-2" />
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

        <div className="card">
          <div className="card-body text-center">
            <DollarSign className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">₺{stats.totalRevenue.toLocaleString('tr-TR')}</p>
            <p className="text-sm text-gray-600">Gelir</p>
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
                placeholder="Rezervasyon ID, müşteri adı veya güzergah ile ara..."
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
              {searchTerm || filterStatus !== 'all' || filterDate ? 'Rezervasyon bulunamadı' : 'Henüz rezervasyon yok'}
            </h3>
            <p className="text-gray-500">
              {searchTerm || filterStatus !== 'all' || filterDate
                ? 'Arama kriterlerinize uygun rezervasyon bulunamadı' 
                : 'Yeni rezervasyonlar burada görünecektir'
              }
            </p>
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
                        {reservation.tripDetails?.date && (
                          <p className="text-sm text-gray-500">
                            {new Date(reservation.tripDetails.date).toLocaleDateString('tr-TR')} 
                            {reservation.tripDetails.time && ` - ${reservation.tripDetails.time}`}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Customer Info */}
                      <div>
                        <div className="flex items-center text-sm text-gray-600 mb-1">
                          <User className="w-4 h-4 mr-1" />
                          Müşteri
                        </div>
                        <p className="font-medium text-gray-900">
                          {reservation.customerInfo?.firstName} {reservation.customerInfo?.lastName}
                        </p>
                        {reservation.customerInfo?.phone && (
                          <div className="flex items-center text-sm text-gray-500">
                            <Phone className="w-3 h-3 mr-1" />
                            {reservation.customerInfo.phone}
                          </div>
                        )}
                      </div>

                      {/* Route Info */}
                      <div>
                        <div className="flex items-center text-sm text-gray-600 mb-1">
                          <MapPin className="w-4 h-4 mr-1" />
                          Güzergah
                        </div>
                        <p className="text-sm text-gray-900">
                          <span className="block truncate">{reservation.tripDetails?.from || 'Bilinmiyor'}</span>
                          <span className="text-gray-500">→</span>
                          <span className="block truncate">{reservation.tripDetails?.to || 'Bilinmiyor'}</span>
                        </p>
                      </div>

                      {/* Vehicle & Driver */}
                      <div>
                        <div className="flex items-center text-sm text-gray-600 mb-1">
                          <Car className="w-4 h-4 mr-1" />
                          Araç & Şoför
                        </div>
                        <p className="text-sm text-gray-900 truncate">
                          {getVehicleInfo(reservation.vehicleId)}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {getDriverName(reservation.driverId)}
                        </p>
                      </div>

                      {/* Passengers */}
                      <div>
                        <div className="flex items-center text-sm text-gray-600 mb-1">
                          <Users className="w-4 h-4 mr-1" />
                          Yolcular
                        </div>
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

                  {/* Actions */}
                  <div className="flex flex-col space-y-2 lg:ml-4">
                    {/* Status Update */}
                    <select
                      className="input text-sm"
                      value={reservation.status}
                      onChange={(e) => handleStatusUpdate(reservation.id, e.target.value)}
                    >
                      {statusOptions.map(status => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedReservation(reservation);
                          setShowModal(true);
                        }}
                        className="btn btn-sm btn-outline"
                        title="Detayları Görüntüle"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => handleDelete(reservation.id)}
                        className="btn btn-sm btn-outline text-red-600 border-red-200 hover:bg-red-50"
                        title="Rezervasyonu Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Assign Driver Button */}
                    {reservation.status === 'confirmed' && !reservation.driverId && (
                      <button
                        onClick={() => {
                          // Bu burada basit bir atama yapıyor - gerçek uygulamada modal açılabilir
                          const availableDriver = drivers.find(d => d.status === 'active');
                          const availableVehicle = vehicles.find(v => v.status === 'active' && v.driverId === availableDriver?.id);
                          
                          if (availableDriver && availableVehicle) {
                            handleAssignDriver(reservation.id, availableDriver.id, availableVehicle.id);
                          } else {
                            showNotification('Uygun şoför veya araç bulunamadı', 'warning');
                          }
                        }}
                        className="btn btn-sm btn-primary"
                      >
                        Şoför Ata
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

              {/* Customer Information */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3">Müşteri Bilgileri</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Ad Soyad</p>
                      <p className="font-medium">
                        {selectedReservation.customerInfo?.firstName} {selectedReservation.customerInfo?.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Telefon</p>
                      <p className="font-medium">{selectedReservation.customerInfo?.phone || 'Belirtilmemiş'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{selectedReservation.customerInfo?.email || 'Belirtilmemiş'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Yolcu Sayısı</p>
                      <p className="font-medium">
                        {selectedReservation.passengerCount || 1} Yetişkin
                        {selectedReservation.childCount > 0 && `, ${selectedReservation.childCount} Çocuk`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trip Details */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3">Seyahat Detayları</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="space-y-3">
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
              </div>

              {/* Vehicle & Driver Assignment */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3">Araç ve Şoför</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Atanmış Araç</p>
                      <p className="font-medium">{getVehicleInfo(selectedReservation.vehicleId)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Atanmış Şoför</p>
                      <p className="font-medium">{getDriverName(selectedReservation.driverId)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              {(selectedReservation.luggageCount > 0 || selectedReservation.specialRequests) && (
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Ek Bilgiler</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    {selectedReservation.luggageCount > 0 && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-600">Bagaj Sayısı</p>
                        <p className="font-medium">{selectedReservation.luggageCount} adet</p>
                      </div>
                    )}
                    {selectedReservation.specialRequests && (
                      <div>
                        <p className="text-sm text-gray-600">Özel İstekler</p>
                        <p className="font-medium">{selectedReservation.specialRequests}</p>
                      </div>
                    )}
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
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ReservationManagement;
