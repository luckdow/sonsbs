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
  Plus,
  Navigation,
  Star
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const CustomerDashboard = () => {
  const { state, user } = useApp();
  const { reservations, vehicles, drivers } = state;
  
  const [customerReservations, setCustomerReservations] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalReservations: 0,
    completedTrips: 0,
    totalSpent: 0,
    upcomingTrips: 0
  });

  useEffect(() => {
    if (user?.email) {
      // Get customer's reservations by email
      const customerReservations = reservations.filter(
        r => r.customerInfo?.email?.toLowerCase() === user.email.toLowerCase()
      );
      setCustomerReservations(customerReservations);

      // Calculate stats
      const completed = customerReservations.filter(r => r.status === 'completed');
      const upcoming = customerReservations.filter(r => {
        if (!r.tripDetails?.date) return false;
        const tripDate = new Date(r.tripDetails.date);
        const now = new Date();
        return tripDate > now && ['confirmed', 'assigned', 'in-progress'].includes(r.status);
      });

      const totalSpent = completed.reduce((sum, r) => sum + (r.totalPrice || 0), 0);

      setDashboardStats({
        totalReservations: customerReservations.length,
        completedTrips: completed.length,
        totalSpent,
        upcomingTrips: upcoming.length
      });
    }
  }, [reservations, user]);

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

  const getStatusInfo = (status) => {
    const statusMap = {
      'pending': { label: 'Bekleyen', color: 'status-pending' },
      'confirmed': { label: 'Onaylandı', color: 'status-confirmed' },
      'assigned': { label: 'Atandı', color: 'status-assigned' },
      'in-progress': { label: 'Devam Ediyor', color: 'status-progress' },
      'completed': { label: 'Tamamlandı', color: 'status-completed' },
      'cancelled': { label: 'İptal Edildi', color: 'status-cancelled' }
    };
    return statusMap[status] || statusMap['pending'];
  };

  const getRecentReservations = () => {
    return customerReservations
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || a.tripDetails?.date || 0);
        const dateB = new Date(b.createdAt || b.tripDetails?.date || 0);
        return dateB - dateA;
      })
      .slice(0, 5);
  };

  const getUpcomingTrips = () => {
    const now = new Date();
    return customerReservations
      .filter(r => {
        if (!r.tripDetails?.date) return false;
        const tripDate = new Date(`${r.tripDetails.date}T${r.tripDetails.time || '00:00'}`);
        return tripDate > now && ['confirmed', 'assigned', 'in-progress'].includes(r.status);
      })
      .sort((a, b) => {
        const dateA = new Date(`${a.tripDetails.date}T${a.tripDetails.time || '00:00'}`);
        const dateB = new Date(`${b.tripDetails.date}T${b.tripDetails.time || '00:00'}`);
        return dateA - dateB;
      })
      .slice(0, 3);
  };

  const recentReservations = getRecentReservations();
  const upcomingTrips = getUpcomingTrips();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Hoş geldiniz!
        </h1>
        <p className="text-gray-600">Transfer rezervasyonlarınızı ve seyahat geçmişinizi görüntüleyin</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Rezervasyon</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalReservations}</p>
                <p className="text-sm text-gray-500">Tüm zamanlar</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tamamlanan Seyahat</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardStats.completedTrips}</p>
                <p className="text-sm text-gray-500">Başarılı transfer</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Harcama</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₺{dashboardStats.totalSpent.toLocaleString('tr-TR')}
                </p>
                <p className="text-sm text-gray-500">Transfer ücreti</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Yaklaşan Seyahat</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardStats.upcomingTrips}</p>
                <p className="text-sm text-gray-500">Planlanmış transfer</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card"
      >
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">Hızlı İşlemler</h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/"
              className="btn btn-primary flex items-center justify-center space-x-2 h-16"
            >
              <Plus className="w-5 h-5" />
              <span>Yeni Rezervasyon</span>
            </a>
            
            <a
              href="/customer/reservations"
              className="btn btn-outline flex items-center justify-center space-x-2 h-16"
            >
              <Calendar className="w-5 h-5" />
              <span>Tüm Rezervasyonlar</span>
            </a>
            
            <a
              href="/customer/profile"
              className="btn btn-outline flex items-center justify-center space-x-2 h-16"
            >
              <User className="w-5 h-5" />
              <span>Profil Ayarları</span>
            </a>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Trips */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="card"
        >
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Yaklaşan Seyahatler</h3>
          </div>
          <div className="card-body">
            {upcomingTrips.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Yaklaşan seyahat yok</p>
                <p className="text-sm text-gray-400 mb-4">
                  Yeni bir rezervasyon yaparak seyahatinizi planlayın
                </p>
                <a href="/" className="btn btn-primary btn-sm">
                  <Plus className="w-4 h-4 mr-1" />
                  Rezervasyon Yap
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingTrips.map((trip) => (
                  <div key={trip.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {trip.reservationId || `RES-${trip.id?.slice(-6)}`}
                        </h4>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="w-3 h-3 mr-1" />
                          {new Date(trip.tripDetails?.date).toLocaleDateString('tr-TR')} 
                          {trip.tripDetails?.time && ` - ${trip.tripDetails.time}`}
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusInfo(trip.status).color}`}>
                        {getStatusInfo(trip.status).label}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-gray-900">{trip.tripDetails?.from}</div>
                          <div className="text-gray-500">→ {trip.tripDetails?.to}</div>
                        </div>
                      </div>

                      {trip.driverId && (
                        <div className="flex items-center text-sm">
                          <User className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-gray-600">Şoför: {getDriverName(trip.driverId)}</span>
                        </div>
                      )}

                      {trip.vehicleId && (
                        <div className="flex items-center text-sm">
                          <Car className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-gray-600">{getVehicleInfo(trip.vehicleId)}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                      <span className="text-lg font-bold text-green-600">
                        ₺{trip.totalPrice?.toLocaleString('tr-TR')}
                      </span>
                      <div className="flex space-x-2">
                        <a
                          href={`/customer/reservations`}
                          className="btn btn-sm btn-outline"
                        >
                          Detay
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Reservations */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="card"
        >
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Son Rezervasyonlar</h3>
          </div>
          <div className="card-body">
            {recentReservations.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Henüz rezervasyon yok</p>
                <p className="text-sm text-gray-400 mb-4">
                  İlk rezervasyonunuzu yapmaya başlayın
                </p>
                <a href="/" className="btn btn-primary btn-sm">
                  <Plus className="w-4 h-4 mr-1" />
                  İlk Rezervasyon
                </a>
              </div>
            ) : (
              <div className="space-y-3">
                {recentReservations.map((reservation) => (
                  <div key={reservation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        reservation.status === 'completed' ? 'bg-green-500' :
                        reservation.status === 'pending' ? 'bg-yellow-500' :
                        reservation.status === 'confirmed' ? 'bg-blue-500' :
                        reservation.status === 'cancelled' ? 'bg-red-500' :
                        'bg-gray-500'
                      }`}></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {reservation.reservationId || `RES-${reservation.id?.slice(-6)}`}
                        </p>
                        <p className="text-xs text-gray-500">
                          {reservation.tripDetails?.from} → {reservation.tripDetails?.to}
                        </p>
                        {reservation.tripDetails?.date && (
                          <p className="text-xs text-gray-400">
                            {new Date(reservation.tripDetails.date).toLocaleDateString('tr-TR')}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        ₺{reservation.totalPrice?.toLocaleString('tr-TR') || '0'}
                      </p>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusInfo(reservation.status).color}`}>
                        {getStatusInfo(reservation.status).label}
                      </span>
                    </div>
                  </div>
                ))}
                
                {recentReservations.length > 0 && (
                  <div className="text-center pt-2">
                    <a
                      href="/customer/reservations"
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Tümünü Görüntüle →
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Service Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="card"
      >
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">Hizmet Bilgileri</h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">7/24 Hizmet</h4>
              <p className="text-sm text-gray-600">
                Günün her saati transfer hizmetimizden faydalanabilirsiniz
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Güvenli Seyahat</h4>
              <p className="text-sm text-gray-600">
                Lisanslı şoförlerimiz ve bakımlı araçlarımızla güvenli yolculuk
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Kaliteli Hizmet</h4>
              <p className="text-sm text-gray-600">
                Müşteri memnuniyeti odaklı premium transfer deneyimi
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Contact Support */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="card bg-gradient-to-r from-blue-50 to-purple-50"
      >
        <div className="card-body text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Yardıma mı ihtiyacınız var?
          </h3>
          <p className="text-gray-600 mb-4">
            Herhangi bir sorunuz veya desteğe ihtiyacınız varsa bizimle iletişime geçin
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href="tel:+905551234567"
              className="btn btn-primary"
            >
              <Phone className="w-4 h-4 mr-2" />
              Bizi Arayın
            </a>
            <a
              href="mailto:destek@sbstransfer.com"
              className="btn btn-outline"
            >
              Email Gönder
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CustomerDashboard;
