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
  Car,
  Route
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const DriverDashboard = () => {
  const { state, user } = useApp();
  const { reservations, vehicles, drivers } = state;
  
  const [driverInfo, setDriverInfo] = useState(null);
  const [driverReservations, setDriverReservations] = useState([]);
  const [todayStats, setTodayStats] = useState({
    totalTrips: 0,
    completedTrips: 0,
    earnings: 0,
    totalDistance: 0
  });

  useEffect(() => {
    // Find current driver info
    const currentDriver = drivers.find(d => d.email === user?.email);
    setDriverInfo(currentDriver);

    if (currentDriver) {
      // Get driver's reservations
      const driverReservations = reservations.filter(r => r.driverId === currentDriver.id);
      setDriverReservations(driverReservations);

      // Calculate today's stats
      const today = new Date().toDateString();
      const todayReservations = driverReservations.filter(
        r => r.tripDetails?.date && new Date(r.tripDetails.date).toDateString() === today
      );

      const todayCompleted = todayReservations.filter(r => r.status === 'completed');
      const todayEarnings = todayCompleted.reduce((sum, r) => {
        const driverShare = (r.totalPrice || 0) * ((currentDriver.commission || 10) / 100);
        return sum + driverShare;
      }, 0);

      const todayDistance = todayCompleted.reduce((sum, r) => {
        return sum + (r.tripDetails?.distance || 0);
      }, 0);

      setTodayStats({
        totalTrips: todayReservations.length,
        completedTrips: todayCompleted.length,
        earnings: todayEarnings,
        totalDistance: todayDistance
      });
    }
  }, [drivers, reservations, user]);

  const getAssignedVehicle = () => {
    if (!driverInfo) return null;
    return vehicles.find(v => v.driverId === driverInfo.id);
  };

  const getUpcomingTrips = () => {
    const now = new Date();
    return driverReservations
      .filter(r => {
        if (!r.tripDetails?.date) return false;
        const tripDate = new Date(`${r.tripDetails.date}T${r.tripDetails.time || '00:00'}`);
        return tripDate > now && ['confirmed', 'assigned'].includes(r.status);
      })
      .sort((a, b) => {
        const dateA = new Date(`${a.tripDetails.date}T${a.tripDetails.time || '00:00'}`);
        const dateB = new Date(`${b.tripDetails.date}T${b.tripDetails.time || '00:00'}`);
        return dateA - dateB;
      })
      .slice(0, 5);
  };

  const getCurrentTrip = () => {
    return driverReservations.find(r => r.status === 'in-progress');
  };

  const assignedVehicle = getAssignedVehicle();
  const upcomingTrips = getUpcomingTrips();
  const currentTrip = getCurrentTrip();

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
        <h1 className="text-2xl font-bold text-gray-900">
          Hoş geldiniz, {driverInfo.firstName}!
        </h1>
        <p className="text-gray-600">Bugünkü seferleriniz ve performansınız</p>
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
                <p className="text-sm font-medium text-gray-600">Bugünkü Seferler</p>
                <p className="text-2xl font-bold text-gray-900">{todayStats.totalTrips}</p>
                <p className="text-sm text-gray-500">
                  {todayStats.completedTrips} tamamlandı
                </p>
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
                <p className="text-sm font-medium text-gray-600">Bugünkü Kazanç</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₺{todayStats.earnings.toLocaleString('tr-TR')}
                </p>
                <p className="text-sm text-gray-500">
                  %{driverInfo.commission || 10} komisyon
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
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
                <p className="text-sm font-medium text-gray-600">Bugünkü Mesafe</p>
                <p className="text-2xl font-bold text-gray-900">
                  {todayStats.totalDistance} km
                </p>
                <p className="text-sm text-gray-500">Toplam mesafe</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Route className="w-6 h-6 text-purple-600" />
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
                <p className="text-sm font-medium text-gray-600">Değerlendirme</p>
                <p className="text-2xl font-bold text-gray-900">
                  ⭐ {driverInfo.rating || 5.0}
                </p>
                <p className="text-sm text-gray-500">Müşteri puanı</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Current Trip */}
      {currentTrip && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card border-l-4 border-l-blue-500"
        >
          <div className="card-header bg-blue-50">
            <div className="flex items-center">
              <Navigation className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-blue-900">Devam Eden Sefer</h3>
            </div>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Müşteri</p>
                <p className="font-medium text-gray-900">
                  {currentTrip.customerInfo?.firstName} {currentTrip.customerInfo?.lastName}
                </p>
                <p className="text-sm text-gray-500">{currentTrip.customerInfo?.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Nereden</p>
                <p className="font-medium text-gray-900">{currentTrip.tripDetails?.from}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Nereye</p>
                <p className="font-medium text-gray-900">{currentTrip.tripDetails?.to}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Ücret</p>
                <p className="text-lg font-bold text-green-600">
                  ₺{currentTrip.totalPrice?.toLocaleString('tr-TR')}
                </p>
              </div>
            </div>
            <div className="mt-4 flex space-x-2">
              <button className="btn btn-success flex-1">
                Seferi Tamamla
              </button>
              <button className="btn btn-outline">
                Müşteriyi Ara
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Vehicle Info */}
      {assignedVehicle && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="card"
          >
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Car className="w-5 h-5 mr-2" />
                Atanmış Aracınız
              </h3>
            </div>
            <div className="card-body">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Araç:</span>
                  <span className="font-medium">
                    {assignedVehicle.brand} {assignedVehicle.model}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Plaka:</span>
                  <span className="font-medium">{assignedVehicle.plateNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Yıl:</span>
                  <span className="font-medium">{assignedVehicle.year}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Kapasite:</span>
                  <span className="font-medium">{assignedVehicle.capacity} kişi</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Durum:</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    assignedVehicle.status === 'active' ? 'status-active' : 'status-inactive'
                  }`}>
                    {assignedVehicle.status === 'active' ? 'Aktif' : 'Pasif'}
                  </span>
                </div>
              </div>
              
              {assignedVehicle.features && assignedVehicle.features.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Özellikler:</p>
                  <div className="flex flex-wrap gap-1">
                    {assignedVehicle.features.map((feature, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Upcoming Trips */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="card"
          >
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Yaklaşan Seferler</h3>
            </div>
            <div className="card-body">
              {upcomingTrips.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Yaklaşan sefer yok</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingTrips.map((trip, index) => (
                    <div key={trip.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium text-gray-900">
                            {trip.customerInfo?.firstName} {trip.customerInfo?.lastName}
                          </p>
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="w-3 h-3 mr-1" />
                            {new Date(trip.tripDetails?.date).toLocaleDateString('tr-TR')} - {trip.tripDetails?.time}
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          trip.status === 'confirmed' ? 'status-confirmed' : 'status-assigned'
                        }`}>
                          {trip.status === 'confirmed' ? 'Onaylandı' : 'Atandı'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <div className="flex items-center mb-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          {trip.tripDetails?.from}
                        </div>
                        <div className="flex items-center">
                          <Navigation className="w-3 h-3 mr-1" />
                          {trip.tripDetails?.to}
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
                        <span className="text-sm font-medium text-green-600">
                          ₺{trip.totalPrice?.toLocaleString('tr-TR')}
                        </span>
                        <div className="flex space-x-1">
                          <button className="btn btn-xs btn-outline">
                            <Phone className="w-3 h-3" />
                          </button>
                          <button className="btn btn-xs btn-outline">
                            <MapPin className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* No Vehicle Assigned */}
      {!assignedVehicle && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card"
        >
          <div className="card-body text-center py-12">
            <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Henüz Araç Atanmadı
            </h3>
            <p className="text-gray-500">
              Size bir araç atanması için yöneticinizle iletişime geçin.
            </p>
          </div>
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="card"
      >
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">Hızlı İşlemler</h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="btn btn-outline flex-col h-20">
              <CheckCircle className="w-6 h-6 mb-1" />
              <span className="text-sm">Müsait</span>
            </button>
            <button className="btn btn-outline flex-col h-20">
              <XCircle className="w-6 h-6 mb-1" />
              <span className="text-sm">Meşgul</span>
            </button>
            <button className="btn btn-outline flex-col h-20">
              <AlertTriangle className="w-6 h-6 mb-1" />
              <span className="text-sm">Arıza Bildir</span>
            </button>
            <button className="btn btn-outline flex-col h-20">
              <Phone className="w-6 h-6 mb-1" />
              <span className="text-sm">Destek</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DriverDashboard;
