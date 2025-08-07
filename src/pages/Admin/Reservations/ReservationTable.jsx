import React, { useState } from 'react';
import { 
  User, 
  Car, 
  Calendar, 
  MapPin, 
  Phone, 
  CreditCard,
  Mail,
  Users,
  Luggage,
  Plane,
  RotateCcw,
  DollarSign,
  Clock,
  RefreshCw
} from 'lucide-react';
import { StatusBadge, getStatusColor } from '../../../utils/statusUtils';
import PhoneDisplay from '../../../components/UI/PhoneDisplay';

const ReservationTable = ({ 
  reservations, 
  drivers, 
  vehicles, 
  onEdit, 
  onDriverAssign, 
  onShowQR, 
  onStatusChange,
  onCompleteReservation,
  onDeleteReservation
}) => {
  const [expandedRows, setExpandedRows] = useState(new Set());

  const toggleRowExpansion = (reservationId) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reservationId)) {
        newSet.delete(reservationId);
      } else {
        newSet.add(reservationId);
      }
      return newSet;
    });
  };

  const getDriverName = (reservation) => {
    // Manuel şoför kontrolü
    if (reservation.assignedDriver === 'manual' && reservation.manualDriverInfo) {
      return `${reservation.manualDriverInfo.name} (Dış)`;
    }
    
    // Sistem şoförü kontrolü
    const driverId = reservation.assignedDriver || reservation.assignedDriverId;
    if (driverId && driverId !== 'manual') {
      const driver = drivers.find(d => d.id === driverId);
      return driver ? `${driver.firstName} ${driver.lastName}` : 'Sistem Şoförü';
    }
    
    return 'Atanmamış';
  };

  const getVehicleName = (vehicleId) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.brand} ${vehicle.model}` : 'Araç yok';
  };

  // Location objelerini string'e dönüştürme helper
  const formatLocation = (location) => {
    if (!location) return 'Belirtilmemiş';
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

  // Backward compatibility helper functions
  const getCustomerInfo = (reservation) => {
    return {
      firstName: reservation.customerInfo?.firstName || reservation.personalInfo?.firstName || '',
      lastName: reservation.customerInfo?.lastName || reservation.personalInfo?.lastName || '',
      phone: reservation.customerInfo?.phone || reservation.personalInfo?.phone || '',
      email: reservation.customerInfo?.email || reservation.personalInfo?.email || ''
    };
  };

  const getTripDetails = (reservation) => {
    // transferType ve isRoundTrip field'larını kontrol et
    let tripType = 'one-way'; // varsayılan
    
    if (reservation.transferType === 'round-trip' || reservation.isRoundTrip === true) {
      tripType = 'round-trip';
    } else if (reservation.tripDetails?.tripType) {
      tripType = reservation.tripDetails.tripType;
    } else if (reservation.tripType) {
      tripType = reservation.tripType;
    }
    

    
    return {
      date: reservation.tripDetails?.date || reservation.date,
      time: reservation.tripDetails?.time || reservation.time,
      returnDate: reservation.tripDetails?.returnDate || reservation.returnDate,
      returnTime: reservation.tripDetails?.returnTime || reservation.returnTime,
      tripType: tripType,
      pickupLocation: formatLocation(reservation.tripDetails?.pickupLocation || reservation.pickupLocation),
      dropoffLocation: formatLocation(reservation.tripDetails?.dropoffLocation || reservation.dropoffLocation),
      passengerCount: reservation.tripDetails?.passengerCount || reservation.passengerCount || 1,
      luggageCount: reservation.tripDetails?.luggageCount || reservation.baggageCount || 0,
      flightNumber: reservation.tripDetails?.flightNumber || reservation.personalInfo?.flightNumber || ''
    };
  };

  const getPaymentMethodDisplay = (paymentMethod) => {
    // PaymentMethod obje ise string'e dönüştür
    let methodValue = paymentMethod;
    
    if (typeof paymentMethod === 'object' && paymentMethod !== null) {
      // Eğer obje ise, muhtemel property'leri kontrol et
      methodValue = paymentMethod.method || 
                   paymentMethod.type || 
                   paymentMethod.value || 
                   paymentMethod.label || 
                   paymentMethod.name || 
                   paymentMethod.paymentMethod ||
                   Object.values(paymentMethod)[0] || // İlk değeri al
                   'cash';
    }
    
    const paymentMethods = {
      'credit_card': { label: 'Kredi Kartı', icon: '💳', color: 'text-blue-600 bg-blue-50' },
      'card': { label: 'Kredi Kartı', icon: '💳', color: 'text-blue-600 bg-blue-50' },
      'Kredi Kartı': { label: 'Kredi Kartı', icon: '💳', color: 'text-blue-600 bg-blue-50' },
      'bank_transfer': { label: 'Havale', icon: '🏦', color: 'text-green-600 bg-green-50' },
      'transfer': { label: 'Havale', icon: '🏦', color: 'text-green-600 bg-green-50' },
      'Havale': { label: 'Havale', icon: '🏦', color: 'text-green-600 bg-green-50' },
      'cash': { label: 'Nakit', icon: '💵', color: 'text-yellow-600 bg-yellow-50' },
      'Nakit': { label: 'Nakit', icon: '💵', color: 'text-yellow-600 bg-yellow-50' },
      'eft': { label: 'EFT', icon: '📱', color: 'text-purple-600 bg-purple-50' }
    };
    
    // PaymentMethod değerini kontrol et ve varsayılan olarak 'cash' döndür
    const method = paymentMethods[methodValue];
    
    if (!method) {
      return paymentMethods['cash'];
    }
    
    return method;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-full table-fixed">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="w-24 px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rezervasyon
              </th>
              <th className="w-40 px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Müşteri
              </th>
              <th className="w-28 px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tarih & Saat
              </th>
              <th className="w-48 px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rota
              </th>
              <th className="w-24 px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Durum
              </th>
              <th className="w-32 px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Şoför
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reservations.map((reservation) => (
              <React.Fragment key={reservation.id}>
                {/* Ana satır */}
                <tr 
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onDoubleClick={() => toggleRowExpansion(reservation.id)}
                  title="Çift tıklayın detayları görmek için"
                >
                  <td className="px-2 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-xs font-medium text-gray-900 truncate">
                        {reservation.reservationId}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-2 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="w-3 h-3 text-gray-400 mr-1" />
                      <div className="min-w-0">
                        <div className="text-xs font-medium text-gray-900 truncate">
                          {getCustomerInfo(reservation).firstName} {getCustomerInfo(reservation).lastName}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          <PhoneDisplay 
                            phone={getCustomerInfo(reservation).phone} 
                            size="sm"
                            className="text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-2 py-3 whitespace-nowrap">
                    <div className="flex items-center text-xs text-gray-900">
                      <Calendar className="w-3 h-3 text-gray-400 mr-1" />
                      <div className="min-w-0">
                        <div className="font-medium truncate text-xs">
                          {getTripDetails(reservation).date}
                        </div>
                        <div className="text-gray-500 truncate text-xs">
                          {getTripDetails(reservation).time}
                        </div>
                        {getTripDetails(reservation).tripType === 'round-trip' && getTripDetails(reservation).returnDate && (
                          <div className="font-medium text-blue-600 truncate text-xs">
                            {getTripDetails(reservation).returnDate}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-2 py-3">
                    <div className="flex items-center text-xs text-gray-900">
                      <MapPin className="w-3 h-3 text-gray-400 mr-1" />
                      <div className="min-w-0">
                        <div className="truncate text-xs">{getTripDetails(reservation).pickupLocation}</div>
                        <div className="text-gray-500 truncate text-xs">↓ {getTripDetails(reservation).dropoffLocation}</div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-2 py-3 whitespace-nowrap">
                    <div className="space-y-1">
                      <StatusBadge status={reservation.status} />
                      {/* İptal bilgileri */}
                      {reservation.status === 'cancelled' && (
                        <div className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                          {reservation.cancellationReason && (
                            <div className="font-medium">{reservation.cancellationReason}</div>
                          )}
                          {reservation.cancelledBy && (
                            <div className="text-red-500 mt-1">
                              İptal eden: {reservation.cancelledBy}
                            </div>
                          )}
                          {reservation.cancelledAt && (
                            <div className="text-red-400 text-xs">
                              {new Date(reservation.cancelledAt).toLocaleString('tr-TR')}
                            </div>
                          )}
                        </div>
                      )}
                      {/* Düzenleme bilgileri */}
                      {reservation.lastEditedAt && (
                        <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                          <div className="font-medium flex items-center">
                            <RotateCcw className="w-3 h-3 mr-1" />
                            Düzenlendi
                          </div>
                          {reservation.editedBy && (
                            <div className="text-blue-500 mt-1">
                              Düzenleyen: {reservation.editedBy}
                            </div>
                          )}
                          <div className="text-blue-400 text-xs">
                            {new Date(reservation.lastEditedAt).toLocaleString('tr-TR')}
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-2 py-3 whitespace-nowrap">
                    <div className="flex items-center text-xs">
                      <Car className="w-3 h-3 text-gray-400 mr-1" />
                      <div className="min-w-0">
                        <div className="text-gray-900 truncate text-xs">{getDriverName(reservation)}</div>
                        <div className="text-gray-500 truncate text-xs">{getVehicleName(reservation.assignedVehicle)}</div>
                      </div>
                    </div>
                  </td>
                </tr>
                
                {/* Genişletilmiş detay satırı */}
                {expandedRows.has(reservation.id) && (
                  <tr>
                    <td colSpan="6" className="px-4 py-4 bg-gradient-to-r from-gray-50 to-blue-50 border-l-4 border-blue-500">
                      <div className="max-w-7xl mx-auto">
                        {/* Başlık */}
                        <div className="mb-4 pb-2 border-b border-gray-200">
                          <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-blue-600" />
                            Rezervasyon Detayları - {reservation.reservationId}
                          </h3>
                          <p className="text-xs text-gray-600 mt-1">
                            Oluşturulma: {new Date(reservation.createdAt).toLocaleDateString('tr-TR', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                          {/* Müşteri Bilgileri */}
                          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
                              <div className="p-1.5 bg-blue-100 rounded-lg">
                                <User className="w-4 h-4 text-blue-600" />
                              </div>
                              <h4 className="font-medium text-gray-900 text-sm">Müşteri</h4>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-start gap-2">
                                <User className="w-3 h-3 text-gray-500 mt-0.5 flex-shrink-0" />
                                <div className="min-w-0">
                                  <p className="text-xs font-medium text-gray-700">Ad Soyad</p>
                                  <p className="text-sm text-gray-900 font-semibold truncate">
                                    {getCustomerInfo(reservation).firstName} {getCustomerInfo(reservation).lastName}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-start gap-2">
                                <Phone className="w-3 h-3 text-gray-500 mt-0.5 flex-shrink-0" />
                                <div className="min-w-0">
                                  <p className="text-xs font-medium text-gray-700">Telefon</p>
                                  <div className="text-sm">
                                    <PhoneDisplay 
                                      phone={getCustomerInfo(reservation).phone} 
                                      size="sm"
                                      showCountryName={false}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-start gap-2">
                                <Mail className="w-3 h-3 text-gray-500 mt-0.5 flex-shrink-0" />
                                <div className="min-w-0">
                                  <p className="text-xs font-medium text-gray-700">E-posta</p>
                                  <p className="text-sm text-gray-900 font-semibold truncate">
                                    {getCustomerInfo(reservation).email || 'Belirtilmemiş'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Seyahat Bilgileri */}
                          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
                              <div className="p-1.5 bg-green-100 rounded-lg">
                                <MapPin className="w-4 h-4 text-green-600" />
                              </div>
                              <h4 className="font-medium text-gray-900 text-sm">Seyahat Detayları</h4>
                            </div>
                            
                            {/* Seyahat Türü - Tek satır */}
                            <div className="mb-3">
                              <div className="flex items-start gap-2">
                                <RotateCcw className="w-3 h-3 text-gray-500 mt-0.5 flex-shrink-0" />
                                <div className="min-w-0">
                                  <p className="text-xs font-medium text-gray-700">SEYAHAT TÜRÜ</p>
                                  <p className="text-sm text-gray-900 font-semibold">
                                    {getTripDetails(reservation).tripType === 'round-trip' ? 'Gidiş-Dönüş' : 'Tek Yön'}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* 2x2 Grid - Gidiş Bilgileri */}
                            <div className="grid grid-cols-2 gap-4 mb-3">
                              {/* Gidiş Tarihi */}
                              <div className="flex items-start gap-2">
                                <Calendar className="w-3 h-3 text-gray-500 mt-0.5 flex-shrink-0" />
                                <div className="min-w-0">
                                  <p className="text-xs font-medium text-gray-700">GİDİŞ TARİHİ</p>
                                  <p className="text-sm text-gray-900 font-semibold">
                                    {getTripDetails(reservation).date}
                                  </p>
                                </div>
                              </div>

                              {/* Gidiş Saati */}
                              <div className="flex items-start gap-2">
                                <Clock className="w-3 h-3 text-gray-500 mt-0.5 flex-shrink-0" />
                                <div className="min-w-0">
                                  <p className="text-xs font-medium text-gray-700">GİDİŞ SAATİ</p>
                                  <p className="text-sm text-gray-900 font-semibold">
                                    {getTripDetails(reservation).time}
                                  </p>
                                </div>
                              </div>
                            </div>
                            
                            {/* 2x2 Grid - Dönüş Bilgileri (Sadece gidiş-dönüş seyahatlerde) */}
                            {getTripDetails(reservation).tripType === 'round-trip' && getTripDetails(reservation).returnDate && (
                              <div className="grid grid-cols-2 gap-4 mb-3">
                                <div className="flex items-start gap-2">
                                  <Calendar className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
                                  <div className="min-w-0">
                                    <p className="text-xs font-medium text-gray-700">DÖNÜŞ TARİHİ</p>
                                    <p className="text-sm text-blue-600 font-semibold">
                                      {getTripDetails(reservation).returnDate}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-start gap-2">
                                  <Clock className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
                                  <div className="min-w-0">
                                    <p className="text-xs font-medium text-gray-700">DÖNÜŞ SAATİ</p>
                                    <p className="text-sm text-blue-600 font-semibold">
                                      {getTripDetails(reservation).returnTime}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* 2x2 Grid - Kişi ve Bagaj Bilgileri */}
                            <div className="grid grid-cols-2 gap-4">
                              {/* Kişi Sayısı */}
                              <div className="flex items-start gap-2">
                                <Users className="w-3 h-3 text-gray-500 mt-0.5 flex-shrink-0" />
                                <div className="min-w-0">
                                  <p className="text-xs font-medium text-gray-700">KİŞİ SAYISI</p>
                                  <p className="text-sm text-gray-900 font-semibold">
                                    {getTripDetails(reservation).passengerCount} Kişi
                                  </p>
                                </div>
                              </div>

                              {/* Bagaj Sayısı */}
                              <div className="flex items-start gap-2">
                                <Luggage className="w-3 h-3 text-gray-500 mt-0.5 flex-shrink-0" />
                                <div className="min-w-0">
                                  <p className="text-xs font-medium text-gray-700">BAGAJ SAYISI</p>
                                  <p className="text-sm text-gray-900 font-semibold">
                                    {getTripDetails(reservation).luggageCount} Bagaj
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Uçuş Numarası - Varsa tek satır */}
                            {getTripDetails(reservation).flightNumber && (
                              <div className="mt-3">
                                <div className="flex items-start gap-2">
                                  <Plane className="w-3 h-3 text-gray-500 mt-0.5 flex-shrink-0" />
                                  <div className="min-w-0">
                                    <p className="text-xs font-medium text-gray-700">UÇUŞ NUMARASI</p>
                                    <p className="text-sm text-gray-900 font-semibold">
                                      {getTripDetails(reservation).flightNumber}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {/* Şoför Bilgileri */}
                          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
                              <div className="p-1.5 bg-indigo-100 rounded-lg">
                                <User className="w-4 h-4 text-indigo-600" />
                              </div>
                              <h4 className="font-medium text-gray-900 text-sm">Şoför</h4>
                            </div>
                            <div className="space-y-2">
                              {reservation.assignedDriver === 'manual' && reservation.manualDriverInfo ? (
                                // Manuel şoför bilgileri
                                <>
                                  <div className="flex items-start gap-2">
                                    <User className="w-3 h-3 text-purple-500 mt-0.5 flex-shrink-0" />
                                    <div className="min-w-0">
                                      <p className="text-xs font-medium text-gray-700">Dış Şoför</p>
                                      <p className="text-sm text-purple-600 font-semibold">
                                        {reservation.manualDriverInfo.name}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-start gap-2">
                                    <Phone className="w-3 h-3 text-gray-500 mt-0.5 flex-shrink-0" />
                                    <div className="min-w-0">
                                      <p className="text-xs font-medium text-gray-700">Telefon</p>
                                      <p className="text-sm text-gray-900 font-semibold">
                                        {reservation.manualDriverInfo.phone}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-start gap-2">
                                    <Car className="w-3 h-3 text-gray-500 mt-0.5 flex-shrink-0" />
                                    <div className="min-w-0">
                                      <p className="text-xs font-medium text-gray-700">Plaka</p>
                                      <p className="text-sm text-gray-900 font-semibold">
                                        {reservation.manualDriverInfo.plateNumber}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-start gap-2">
                                    <DollarSign className="w-3 h-3 text-gray-500 mt-0.5 flex-shrink-0" />
                                    <div className="min-w-0">
                                      <p className="text-xs font-medium text-gray-700">Ücret</p>
                                      <p className="text-sm text-green-600 font-bold">
                                        {reservation.manualDriverInfo.price} €
                                      </p>
                                    </div>
                                  </div>
                                </>
                              ) : reservation.assignedDriver && reservation.assignedDriver !== 'manual' ? (
                                // Sistem şoförü bilgileri
                                <>
                                  <div className="flex items-start gap-2">
                                    <User className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
                                    <div className="min-w-0">
                                      <p className="text-xs font-medium text-gray-700">Sistem Şoförü</p>
                                      <p className="text-sm text-blue-600 font-semibold">
                                        {getDriverName(reservation)}
                                      </p>
                                    </div>
                                  </div>
                                  {reservation.assignedVehicle && (
                                    <div className="flex items-start gap-2">
                                      <Car className="w-3 h-3 text-gray-500 mt-0.5 flex-shrink-0" />
                                      <div className="min-w-0">
                                        <p className="text-xs font-medium text-gray-700">Araç</p>
                                        <p className="text-sm text-gray-900 font-semibold">
                                          {(() => {
                                            const vehicle = vehicles.find(v => v.id === reservation.assignedVehicle);
                                            return vehicle ? `${vehicle.brand} ${vehicle.model} (${vehicle.plateNumber})` : reservation.assignedVehicle;
                                          })()}
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                </>
                              ) : (
                                // Şoför atanmamış
                                <div className="flex items-start gap-2">
                                  <User className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
                                  <div className="min-w-0">
                                    <p className="text-xs font-medium text-gray-700">Durum</p>
                                    <p className="text-sm text-gray-500 font-semibold">
                                      Şoför Atanmadı
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Ödeme Bilgileri */}
                          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
                              <div className="p-1.5 bg-purple-100 rounded-lg">
                                <CreditCard className="w-4 h-4 text-purple-600" />
                              </div>
                              <h4 className="font-medium text-gray-900 text-sm">Ödeme</h4>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-start gap-2">
                                  <CreditCard className="w-3 h-3 text-gray-500 mt-0.5 flex-shrink-0" />
                                  <div className="min-w-0">
                                    <p className="text-xs font-medium text-gray-700">Yöntem</p>
                                    <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPaymentMethodDisplay(reservation.paymentMethod).color}`}>
                                      <span className="mr-1">{getPaymentMethodDisplay(reservation.paymentMethod).icon}</span>
                                      {getPaymentMethodDisplay(reservation.paymentMethod).label}
                                    </div>
                                  </div>
                                </div>
                              
                              <div className="flex items-start gap-2">
                                <DollarSign className="w-3 h-3 text-gray-500 mt-0.5 flex-shrink-0" />
                                <div className="min-w-0">
                                  <p className="text-xs font-medium text-gray-700">Tutar</p>
                                  <p className="text-base text-gray-900 font-bold">
                                    €{reservation.totalPrice || reservation.selectedVehicle?.totalPrice || 0}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex items-start gap-2">
                                <RefreshCw className="w-3 h-3 text-gray-500 mt-0.5 flex-shrink-0" />
                                <div className="min-w-0">
                                  <p className="text-xs font-medium text-gray-700">Güncelleme</p>
                                  <p className="text-sm text-gray-900 font-semibold">
                                    {reservation.updatedAt 
                                      ? new Date(reservation.updatedAt).toLocaleDateString('tr-TR')
                                      : 'Yok'
                                    }
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Rota Bilgileri - 5. Kart */}
                        <div className="mt-4">
                          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
                              <div className="p-1.5 bg-orange-100 rounded-lg">
                                <MapPin className="w-4 h-4 text-orange-600" />
                              </div>
                              <h4 className="font-medium text-gray-900 text-sm">Rota Bilgileri</h4>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Kalkış Noktası */}
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="p-1 bg-green-100 rounded-full">
                                    <MapPin className="w-3 h-3 text-green-600" />
                                  </div>
                                  <h5 className="font-medium text-gray-800 text-sm">Kalkış Noktası</h5>
                                </div>
                                <div className="pl-6">
                                  <p className="text-gray-900 font-medium leading-relaxed">
                                    {getTripDetails(reservation).pickupLocation}
                                  </p>
                                </div>
                              </div>
                              
                              {/* Varış Noktası */}
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="p-1 bg-red-100 rounded-full">
                                    <MapPin className="w-3 h-3 text-red-600" />
                                  </div>
                                  <h5 className="font-medium text-gray-800 text-sm">Varış Noktası</h5>
                                </div>
                                <div className="pl-6">
                                  <p className="text-gray-900 font-medium leading-relaxed">
                                    {getTripDetails(reservation).dropoffLocation}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* İşlem Butonları */}
                        <div className="mt-4 bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className="p-1 bg-gray-100 rounded">
                                <User className="w-3 h-3 text-gray-600" />
                              </div>
                              <h4 className="font-medium text-gray-900 text-sm">İşlemler</h4>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-4 gap-2">
                            <button
                              onClick={() => onEdit(reservation)}
                              className="flex items-center justify-center gap-1 p-2 text-center bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-all group"
                              title="Rezervasyon bilgilerini düzenle"
                            >
                              <div className="p-1 bg-blue-100 rounded group-hover:bg-blue-200 transition-colors">
                                <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </div>
                              <span className="text-xs font-medium text-blue-700">Düzenle</span>
                            </button>
                            
                            <button
                              onClick={() => onDriverAssign(reservation)}
                              className="flex items-center justify-center gap-1 p-2 text-center bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 hover:border-purple-300 transition-all group"
                              title="Şoför ve araç ataması yap"
                            >
                              <div className="p-1 bg-purple-100 rounded group-hover:bg-purple-200 transition-colors">
                                <User className="w-3 h-3 text-purple-600" />
                              </div>
                              <span className="text-xs font-medium text-purple-700">Şoför</span>
                            </button>
                            
                            <button
                              onClick={() => onShowQR(reservation)}
                              className="flex items-center justify-center gap-1 p-2 text-center bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 hover:border-green-300 transition-all group"
                              title="QR kod oluştur ve görüntüle"
                            >
                              <div className="p-1 bg-green-100 rounded group-hover:bg-green-200 transition-colors">
                                <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                </svg>
                              </div>
                              <span className="text-xs font-medium text-green-700">QR</span>
                            </button>

                            {/* Tamamlama/Silme Butonu */}
                            {reservation.status !== 'completed' && (reservation.assignedDriver || reservation.assignedDriverId || reservation.driverId) ? (
                              <button
                                onClick={() => onCompleteReservation(reservation.id)}
                                className="flex items-center justify-center gap-1 p-2 text-center bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 hover:border-emerald-300 transition-all group"
                                title="Rezervasyonu tamamla"
                              >
                                <div className="p-1 bg-emerald-100 rounded group-hover:bg-emerald-200 transition-colors">
                                  <svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                </div>
                                <span className="text-xs font-medium text-emerald-700">Bitir</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => onDeleteReservation(reservation.id)}
                                className="flex items-center justify-center gap-1 p-2 text-center bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 transition-all group"
                                title="Rezervasyonu sil"
                              >
                                <div className="p-1 bg-red-100 rounded group-hover:bg-red-200 transition-colors">
                                  <svg className="w-3 h-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </div>
                                <span className="text-xs font-medium text-red-700">Sil</span>
                              </button>
                            )}
                          </div>
                        </div>
                        
                        {/* Düzenleme Geçmişi - Eğer düzenleme yapılmışsa */}
                        {(reservation.editHistory || reservation.lastEditedAt) && (
                          <div className="mt-4 bg-white rounded-lg p-3 shadow-sm border border-blue-200">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="p-1 bg-blue-100 rounded">
                                <RotateCcw className="w-3 h-3 text-blue-600" />
                              </div>
                              <h4 className="font-medium text-blue-900 text-sm">Düzenleme Geçmişi</h4>
                            </div>
                            
                            <div className="space-y-2">
                              {/* Son düzenleme */}
                              {reservation.lastEditedAt && (
                                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-medium text-blue-800">Son Düzenleme</span>
                                    <span className="text-xs text-blue-600">
                                      {new Date(reservation.lastEditedAt).toLocaleString('tr-TR')}
                                    </span>
                                  </div>
                                  {reservation.editedBy && (
                                    <div className="text-xs text-blue-700">
                                      <strong>Düzenleyen:</strong> {reservation.editedBy}
                                    </div>
                                  )}
                                </div>
                              )}
                              
                              {/* Düzenleme geçmişi detayları */}
                              {reservation.editHistory && reservation.editHistory.length > 0 && (
                                <div className="space-y-1">
                                  {reservation.editHistory.slice(-3).reverse().map((edit, index) => (
                                    <div key={index} className="bg-gray-50 rounded p-2 border border-gray-200">
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-medium text-gray-700">
                                          {edit.changes || 'Bilgiler güncellendi'}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                          {new Date(edit.editedAt).toLocaleString('tr-TR')}
                                        </span>
                                      </div>
                                      <div className="text-xs text-gray-600">
                                        Düzenleyen: {edit.editedBy}
                                      </div>
                                    </div>
                                  ))}
                                  {reservation.editHistory.length > 3 && (
                                    <div className="text-xs text-gray-500 text-center">
                                      ve {reservation.editHistory.length - 3} daha fazla düzenleme...
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div> {/* max-w-7xl mx-auto kapanışı */}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      
      {reservations.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Henüz rezervasyon bulunmuyor</p>
        </div>
      )}
    </div>
  );
};

export default ReservationTable;
