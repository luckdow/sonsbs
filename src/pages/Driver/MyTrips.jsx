import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  User, 
  Phone,
  Navigation,
  CheckCircle,
  XCircle,
  AlertTriangle,
  DollarSign,
  Filter,
  Search,
  Route
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const MyTrips = () => {
  const { state, user, updateReservation, showNotification } = useApp();
  const { reservations, drivers } = state;
  
  const [driverInfo, setDriverInfo] = useState(null);
  const [driverReservations, setDriverReservations] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Find current driver info
    const currentDriver = drivers.find(d => d.email === user?.email);
    setDriverInfo(currentDriver);

    if (currentDriver) {
      // Get driver's reservations
      const driverReservations = reservations.filter(r => r.driverId === currentDriver.id);
      setDriverReservations(driverReservations);
    }
  }, [drivers, reservations, user]);

  const statusOptions = [
    { value: 'assigned', label: 'Atandı', color: 'status-assigned' },
    { value: 'in-progress', label: 'Devam Ediyor', color: 'status-progress' },
    { value: 'completed', label: 'Tamamlandı', color: 'status-completed' },
    { value: 'cancelled', label: 'İptal Edildi', color: 'status-cancelled' }
  ];

  const getStatusInfo = (status) => {
    return statusOptions.find(option => option.value === status) || statusOptions[0];
  };

  const handleStatusUpdate = async (reservationId, newStatus) => {
    try {
      await updateReservation(reservationId, { status: newStatus });
      showNotification('Sefer durumu güncellendi', 'success');
    } catch (error) {
      console.error('Durum güncelleme hatası:', error);
      showNotification('Durum güncellenirken bir hata oluştu', 'error');
    }
  };

  const filteredReservations = driverReservations.filter(reservation => {
    const matchesSearch = 
      reservation.reservationId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.customerInfo?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.customerInfo?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.tripDetails?.from?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.tripDetails?.to?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || reservation.status === filterStatus;
    
    const matchesDate = !filterDate || 
      (reservation.tripDetails?.date && 
       new Date(reservation.tripDetails.date).toDateString() === new Date(filterDate).toDateString());
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getTripStats = () => {
    const total = driverReservations.length;
    const assigned = driverReservations.filter(r => r.status === 'assigned').length;
    const inProgress = driverReservations.filter(r => r.status === 'in-progress').length;
    const completed = driverReservations.filter(r => r.status === 'completed').length;
    const cancelled = driverReservations.filter(r => r.status === 'cancelled').length;
    
    const totalEarnings = driverReservations
      .filter(r => r.status === 'completed')
      .reduce((sum, r) => {
        const driverShare = (r.totalPrice || 0) * ((driverInfo?.commission || 10) / 100);
        return sum + driverShare;
      }, 0);

    return { total, assigned, inProgress, completed, cancelled, totalEarnings };
  };

  const stats = getTripStats();

  const formatDateTime = (date, time) => {
    if (!date) return 'Tarih belirtilmemiş';
    const dateObj = new Date(date);
    const formattedDate = dateObj.toLocaleDateString('tr-TR');
    return time ? `${formattedDate} - ${time}` : formattedDate;
  };

  const calculateDriverEarning = (totalPrice) => {
    if (!driverInfo || !totalPrice) return 0;
    return totalPrice * ((driverInfo.commission || 10) / 100);
  };

  if (!driverInfo) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Şoför Profili Bulunamadı</h3>
          <p className="text-gray-500">Lütfen yöneticinizle iletişime geçin.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Seferlerim</h1>
        <p className="text-gray-600">Atanmış ve tamamlanmış seferlerinizi görüntüleyin</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
            <p className="text-2xl font-bold text-gray-900">{stats.assigned}</p>
            <p className="text-sm text-gray-600">Atandı</p>
          </div>
        </div>

        <div className="card">
          <div className="card-body text-center">
            <Navigation className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
            <p className="text-sm text-gray-600">Devam Ediyor</p>
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

        <div className="card">
          <div className="card-body text-center">
            <DollarSign className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-lg font-bold text-gray-900">€{stats.totalEarnings.toLocaleString('tr-TR')}</p>
            <p className="text-sm text-gray-600">Kazanç</p>
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
                placeholder="Rezervasyon ID veya müşteri adı ile ara..."
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

      {/* Trips List */}
      {filteredReservations.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-12">
            <Route className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || filterStatus !== 'all' || filterDate ? 'Sefer bulunamadı' : 'Henüz sefer yok'}
            </h3>
            <p className="text-gray-500">
              {searchTerm || filterStatus !== 'all' || filterDate
                ? 'Arama kriterlerinize uygun sefer bulunamadı' 
                : 'Size atanmış seferler burada görünecektir'
              }
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReservations
            .sort((a, b) => {
              // Sort by date (newest first)
              const dateA = new Date(`${a.tripDetails?.date}T${a.tripDetails?.time || '00:00'}`);
              const dateB = new Date(`${b.tripDetails?.date}T${b.tripDetails?.time || '00:00'}`);
              return dateB - dateA;
            })
            .map((reservation, index) => (
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
                          €{reservation.totalPrice?.toLocaleString('tr-TR') || '0'}
                        </p>
                        <p className="text-sm text-green-600 font-medium">
                          Kazanç: €{calculateDriverEarning(reservation.totalPrice).toLocaleString('tr-TR')}
                        </p>
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

                      {/* Date & Time */}
                      <div>
                        <div className="flex items-center text-sm text-gray-600 mb-1">
                          <Clock className="w-4 h-4 mr-1" />
                          Tarih & Saat
                        </div>
                        <p className="text-sm text-gray-900">
                          {formatDateTime(reservation.tripDetails?.date, reservation.tripDetails?.time)}
                        </p>
                        {reservation.tripDetails?.distance && (
                          <p className="text-sm text-gray-500">
                            {reservation.tripDetails.distance} km
                          </p>
                        )}
                      </div>

                      {/* Passengers */}
                      <div>
                        <div className="flex items-center text-sm text-gray-600 mb-1">
                          <User className="w-4 h-4 mr-1" />
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
                    {/* Status Update for assigned trips */}
                    {reservation.status === 'assigned' && (
                      <button
                        onClick={() => handleStatusUpdate(reservation.id, 'in-progress')}
                        className="btn btn-primary"
                      >
                        Sefere Başla
                      </button>
                    )}

                    {/* Status Update for in-progress trips */}
                    {reservation.status === 'in-progress' && (
                      <button
                        onClick={() => handleStatusUpdate(reservation.id, 'completed')}
                        className="btn btn-success"
                      >
                        Seferi Tamamla
                      </button>
                    )}

                    {/* Quick Actions */}
                    <div className="flex space-x-2">
                      {reservation.customerInfo?.phone && (
                        <a
                          href={`tel:${reservation.customerInfo.phone}`}
                          className="btn btn-sm btn-outline"
                          title="Müşteriyi Ara"
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                      )}
                      
                      {reservation.tripDetails?.from && reservation.tripDetails?.to && (
                        <a
                          href={`https://www.google.com/maps/dir/${encodeURIComponent(reservation.tripDetails.from)}/${encodeURIComponent(reservation.tripDetails.to)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-outline"
                          title="Haritada Aç"
                        >
                          <MapPin className="w-4 h-4" />
                        </a>
                      )}

                      {(reservation.status === 'assigned' || reservation.status === 'in-progress') && (
                        <button
                          onClick={() => {
                            if (window.confirm('Bu seferi iptal etmek istediğinizden emin misiniz?')) {
                              handleStatusUpdate(reservation.id, 'cancelled');
                            }
                          }}
                          className="btn btn-sm btn-outline text-red-600 border-red-200 hover:bg-red-50"
                          title="Seferi İptal Et"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Status Indicator */}
                    <div className="text-center">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusInfo(reservation.status).color}`}>
                        {getStatusInfo(reservation.status).label}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTrips;
