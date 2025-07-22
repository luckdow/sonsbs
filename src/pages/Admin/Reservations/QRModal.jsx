import React, { useRef } from 'react';
import { X, Download, Share2, QrCode } from 'lucide-react';
import QRCode from 'qrcode';

const QRModal = ({ reservation, onClose }) => {
  const qrRef = useRef(null);

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

  React.useEffect(() => {
    if (reservation && qrRef.current) {
      // QR kod verisi olarak sadece rezervasyon ID'sini kullan
      const qrData = reservation.reservationId || reservation.id;
      
      console.log('QR Modal: QR kod verisi:', qrData);
      console.log('QR Modal: Rezervasyon bilgileri:', reservation);

      QRCode.toCanvas(qrRef.current, qrData, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });
    }
  }, [reservation]);

  const handleDownload = () => {
    if (qrRef.current) {
      const link = document.createElement('a');
      link.download = `QR-${reservation.reservationId}.png`;
      link.href = qrRef.current.toDataURL();
      link.click();
    }
  };

  const handleShare = async () => {
    if (qrRef.current && navigator.share) {
      try {
        const canvas = qrRef.current;
        canvas.toBlob(async (blob) => {
          const file = new File([blob], `QR-${reservation.reservationId}.png`, { type: 'image/png' });
          await navigator.share({
            files: [file],
            title: `QR Kod - ${reservation.reservationId}`,
            text: `${reservation.customerInfo?.firstName} ${reservation.customerInfo?.lastName} rezervasyon QR kodu`
          });
        });
      } catch (error) {
        console.error('Paylaşım hatası:', error);
      }
    }
  };

  if (!reservation) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            QR Kod
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">{reservation.reservationId}</h3>
            <p className="text-sm text-gray-600">
              {reservation.customerInfo?.firstName} {reservation.customerInfo?.lastName}
            </p>
          </div>

          {/* QR Code */}
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white border-2 border-gray-200 rounded-lg">
              <canvas ref={qrRef} className="block"></canvas>
            </div>
          </div>

          {/* Rezervasyon Özeti */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Tarih:</span>
                <span className="font-medium">{reservation.tripDetails?.date} {reservation.tripDetails?.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Kalkış:</span>
                <span className="font-medium">{formatLocation(reservation.tripDetails?.pickupLocation)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Varış:</span>
                <span className="font-medium">{formatLocation(reservation.tripDetails?.dropoffLocation)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Yolcu:</span>
                <span className="font-medium">{reservation.tripDetails?.passengerCount} kişi</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tutar:</span>
                <span className="font-medium text-green-600">€{reservation.totalPrice}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleDownload}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              İndir
            </button>
            
            {navigator.share && (
              <button
                onClick={handleShare}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Paylaş
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRModal;
