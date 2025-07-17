import React, { useState } from 'react';
import { MapPin, Calendar, Clock, User, Phone, Mail, Car, CreditCard, QrCode, Edit, X, Eye } from 'lucide-react';

const ReservationCard = ({ 
  reservation, 
  drivers, 
  vehicles, 
  getStatusBadge, 
  getStatusText, 
  onAssignDriver, 
  onUpdateStatus,
  onEdit,
  onCancel,
  onShowQR
}) => {
  const assignedDriver = drivers.find(d => d.id === reservation.assignedDriver);
  const assignedVehicle = vehicles.find(v => v.id === reservation.assignedVehicle);

  // Admin paneli - sadece şoför atama ve takip
  const canAssignDriver = ['pending', 'confirmed'].includes(reservation.status);
  const canCancel = !['completed', 'cancelled'].includes(reservation.status);

  // Profesyonel durum badge
  const getStatusBadgeStyle = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
      assigned: 'bg-purple-100 text-purple-800 border-purple-200',
      started: 'bg-green-100 text-green-800 border-green-200',
      completed: 'bg-gray-100 text-gray-800 border-gray-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };
    return styles[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: Clock,
      confirmed: Calendar,
      assigned: User,
      started: Car,
      completed: CreditCard,
      cancelled: X
    };
    const Icon = icons[status] || Clock;
    return <Icon className="w-3 h-3" />;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Car className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">{reservation.reservationId}</h3>
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeStyle(reservation.status)}`}>
              {getStatusIcon(reservation.status)}
              {getStatusText(reservation.status)}
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">
            ₺{reservation.totalPrice || 0}
          </p>
          <p className="text-sm text-gray-500">
            {reservation.paymentMethod === 'cash' && '💵 Nakit'}
            {reservation.paymentMethod === 'card' && '💳 Kredi Kartı'}
            {reservation.paymentMethod === 'transfer' && '🏦 Havale'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Müşteri Bilgileri */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <User className="w-4 h-4 text-blue-600" />
            Müşteri Bilgileri
          </h4>
          <div className="space-y-2">
            <p className="font-medium text-gray-900">
              {reservation.customerInfo?.firstName} {reservation.customerInfo?.lastName}
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="w-3 h-3" />
              <span>{reservation.customerInfo?.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail className="w-3 h-3" />
              <span>{reservation.customerInfo?.email}</span>
            </div>
          </div>
        </div>

        {/* Seyahat Bilgileri */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-green-600" />
            Seyahat Bilgileri
          </h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-3 h-3" />
              <span>{reservation.tripDetails?.date}</span>
              <Clock className="w-3 h-3 ml-2" />
              <span>{reservation.tripDetails?.time}</span>
            </div>
            <div className="text-sm text-gray-600">
              <p><strong>Kalkış:</strong> {reservation.tripDetails?.pickupLocation}</p>
              <p><strong>Varış:</strong> {reservation.tripDetails?.dropoffLocation}</p>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>👥 {reservation.tripDetails?.passengerCount} Kişi</span>
              <span>🧳 {reservation.tripDetails?.luggageCount} Bagaj</span>
              {reservation.tripDetails?.flightNumber && (
                <span>✈️ {reservation.tripDetails.flightNumber}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Şoför/Araç Bilgisi */}
      {assignedDriver && assignedVehicle && (
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4 mb-6 border border-purple-200">
          <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
            <Car className="w-4 h-4" />
            Atanmış Şoför & Araç
          </h4>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-purple-900">
                {assignedDriver.firstName} {assignedDriver.lastName}
              </p>
              <p className="text-sm text-purple-700">
                {assignedVehicle.brand} {assignedVehicle.model} - {assignedVehicle.plateNumber}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-purple-700">{assignedDriver.phone}</p>
              <p className="text-xs text-purple-600">Kapasite: {assignedVehicle.capacity} kişi</p>
            </div>
          </div>
        </div>
      )}

      {/* Aksiyon Butonları */}
      <div className="flex flex-wrap gap-2">
        {/* Şoför Atama */}
        {canAssignDriver && (
          <button
            onClick={() => onAssignDriver(reservation)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <User className="w-4 h-4" />
            Şoför Ata
          </button>
        )}
        
        {/* Görüntüle/Düzenle */}
        <button
          onClick={() => onEdit && onEdit(reservation)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Edit className="w-4 h-4" />
          Düzenle
        </button>
        
        {/* QR Kod */}
        <button
          onClick={() => onShowQR && onShowQR(reservation)}
          className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <QrCode className="w-4 h-4" />
          QR Kod
        </button>
        
        {/* Telefon */}
        <button
          onClick={() => window.open(`tel:${reservation.customerInfo?.phone}`)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Phone className="w-4 h-4" />
          Ara
        </button>
        
        {/* E-posta */}
        <button
          onClick={() => window.open(`mailto:${reservation.customerInfo?.email}`)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Mail className="w-4 h-4" />
          E-posta
        </button>
        
        {/* İptal */}
        {canCancel && (
          <button
            onClick={() => onCancel && onCancel(reservation)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            İptal Et
          </button>
        )}
      </div>
    </div>
  );
};

export default ReservationCard;
