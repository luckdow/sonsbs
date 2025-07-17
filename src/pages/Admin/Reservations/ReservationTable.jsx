import React, { useState } from 'react';
import { 
  Eye, 
  EyeOff, 
  Edit, 
  User, 
  Car, 
  QrCode, 
  Calendar, 
  MapPin, 
  Phone, 
  CreditCard,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { StatusBadge, getStatusColor } from '../../../utils/statusUtils';

const ReservationTable = ({ 
  reservations, 
  drivers, 
  vehicles, 
  onEdit, 
  onDriverAssign, 
  onShowQR, 
  onStatusChange 
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

  const getDriverName = (driverId) => {
    const driver = drivers.find(d => d.id === driverId);
    return driver ? `${driver.firstName} ${driver.lastName}` : 'Atanmamış';
  };

  const getVehicleName = (vehicleId) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.brand} ${vehicle.model}` : 'Araç yok';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rezervasyon
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Müşteri
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tarih & Saat
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rota
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Durum
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Şoför
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Detay
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reservations.map((reservation) => (
              <React.Fragment key={reservation.id}>
                {/* Ana satır */}
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">
                        {reservation.reservationId}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="w-4 h-4 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {reservation.customerInfo?.firstName} {reservation.customerInfo?.lastName}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Phone className="w-3 h-3 mr-1" />
                          {reservation.customerInfo?.phone}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                      <div>
                        <div>{reservation.tripDetails?.date}</div>
                        <div className="text-gray-500">{reservation.tripDetails?.time}</div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-900">
                      <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                      <div className="max-w-xs truncate">
                        <div className="truncate">{reservation.tripDetails?.pickupLocation}</div>
                        <div className="text-gray-500 truncate">↓ {reservation.tripDetails?.dropoffLocation}</div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={reservation.status} />
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm">
                      <Car className="w-4 h-4 text-gray-400 mr-2" />
                      <div>
                        <div className="text-gray-900">{getDriverName(reservation.assignedDriver)}</div>
                        <div className="text-gray-500">{getVehicleName(reservation.assignedVehicle)}</div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleRowExpansion(reservation.id)}
                      className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                    >
                      {expandedRows.has(reservation.id) ? (
                        <>
                          <EyeOff className="w-4 h-4 mr-1" />
                          <ChevronDown className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4 mr-1" />
                          <ChevronRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEdit(reservation)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Düzenle"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => onDriverAssign(reservation)}
                        className="text-purple-600 hover:text-purple-800"
                        title="Şoför Ata"
                      >
                        <User className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => onShowQR(reservation)}
                        className="text-green-600 hover:text-green-800"
                        title="QR Kod"
                      >
                        <QrCode className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
                
                {/* Genişletilmiş detay satırı */}
                {expandedRows.has(reservation.id) && (
                  <tr>
                    <td colSpan="8" className="px-6 py-4 bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Müşteri Detayları */}
                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-900 border-b pb-2">Müşteri Bilgileri</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-400" />
                              <span>{reservation.customerInfo?.firstName} {reservation.customerInfo?.lastName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-gray-400" />
                              <span>{reservation.customerInfo?.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400">@</span>
                              <span>{reservation.customerInfo?.email}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Seyahat Detayları */}
                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-900 border-b pb-2">Seyahat Detayları</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span>{reservation.tripDetails?.date} - {reservation.tripDetails?.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-400" />
                              <span>{reservation.tripDetails?.passengerCount} Yolcu</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400">✈️</span>
                              <span>{reservation.tripDetails?.flightNumber || 'Uçuş no yok'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400">🧳</span>
                              <span>{reservation.tripDetails?.luggageCount} Bagaj</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Ödeme ve Durum */}
                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-900 border-b pb-2">Ödeme & Durum</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <CreditCard className="w-4 h-4 text-gray-400" />
                              <span className="capitalize">{reservation.paymentMethod}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400">💰</span>
                              <span className="font-medium">{reservation.totalPrice} TL</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400">📅</span>
                              <span>{new Date(reservation.createdAt).toLocaleDateString('tr-TR')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400">🔄</span>
                              <span>
                                {reservation.updatedAt 
                                  ? new Date(reservation.updatedAt).toLocaleDateString('tr-TR')
                                  : 'Güncellenmemiş'
                                }
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
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
