import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'qrcode';
import { Download, Copy, QrCode, X, Check } from 'lucide-react';
import toast from 'react-hot-toast';

// Simple QR Code component using canvas
const QRCodeDisplay = ({ value, size = 200 }) => {
  const canvasRef = useRef();
  
  React.useEffect(() => {
    if (canvasRef.current && value) {
      QRCode.toCanvas(canvasRef.current, value, {
        width: size,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      }).catch(err => console.error('QR Code generation error:', err));
    }
  }, [value, size]);

  return <canvas ref={canvasRef} className="rounded-lg" />;
};

// QR Code Modal Component
export const QRCodeModal = ({ reservation, onClose }) => {
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const qrRef = useRef();

  const qrData = {
    reservationId: reservation.reservationId || `SBS-${reservation.id?.slice(-6)}`,
    customerName: `${reservation.customerInfo?.firstName || ''} ${reservation.customerInfo?.lastName || ''}`.trim(),
    pickup: reservation.tripDetails?.pickupLocation || '',
    dropoff: reservation.tripDetails?.dropoffLocation || '',
    date: reservation.tripDetails?.date || '',
    time: reservation.tripDetails?.time || '',
    phone: reservation.customerInfo?.phone || '',
    verifyUrl: `${window.location.origin}/verify/${reservation.id}`
  };

  const qrString = JSON.stringify(qrData);

  const downloadQR = async () => {
    setDownloading(true);
    try {
      const canvas = await QRCode.toCanvas(qrString, {
        width: 512,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });
      
      const link = document.createElement('a');
      link.download = `qr-${qrData.reservationId}.png`;
      link.href = canvas.toDataURL();
      link.click();
      
      toast.success('QR kodu indirildi');
    } catch (error) {
      toast.error('QR kodu indirilemedi');
    } finally {
      setDownloading(false);
    }
  };

  const copyQRData = async () => {
    try {
      await navigator.clipboard.writeText(qrData.verifyUrl);
      setCopied(true);
      toast.success('Doğrulama linki kopyalandı');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Link kopyalanamadı');
    }
  };

  return (
    <div className="modal-overlay">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="modal-content max-w-lg"
      >
        <div className="modal-header">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <QrCode className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">QR Kod</h2>
              <p className="text-sm text-gray-500">{qrData.reservationId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="modal-body text-center">
          <div className="bg-white p-6 rounded-xl border-2 border-gray-100 inline-block">
            <QRCodeDisplay
              value={qrString}
              size={200}
            />
          </div>
          
          <div className="mt-6 space-y-3">
            <p className="text-sm text-gray-600">
              Bu QR kodu müşteriye göndererek rezervasyon bilgilerini doğrulayabilirsiniz.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={downloadQR}
                disabled={downloading}
                className="btn btn-primary disabled:opacity-50"
              >
                <Download className="w-4 h-4 mr-2" />
                {downloading ? 'İndiriliyor...' : 'PNG İndir'}
              </button>
              
              <button
                onClick={copyQRData}
                className="btn btn-outline"
              >
                <AnimatePresence mode="wait">
                  {copied ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="flex items-center"
                    >
                      <Check className="w-4 h-4 mr-2 text-green-600" />
                      Kopyalandı
                    </motion.div>
                  ) : (
                    <motion.div
                      key="copy"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="flex items-center"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Link Kopyala
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>

          {/* Reservation Details */}
          <div className="mt-6 bg-gray-50 rounded-lg p-4 text-left">
            <h4 className="font-medium text-gray-900 mb-3">Rezervasyon Detayları</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Müşteri:</span>
                <span className="font-medium">{qrData.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Telefon:</span>
                <span className="font-medium">{qrData.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tarih:</span>
                <span className="font-medium">
                  {qrData.date ? new Date(qrData.date).toLocaleDateString('tr-TR') : '-'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Saat:</span>
                <span className="font-medium">{qrData.time || '-'}</span>
              </div>
              {qrData.pickup && (
                <div className="pt-2">
                  <span className="text-gray-600 block mb-1">Kalkış:</span>
                  <span className="font-medium text-sm">{qrData.pickup}</span>
                </div>
              )}
              {qrData.dropoff && (
                <div className="pt-2">
                  <span className="text-gray-600 block mb-1">Varış:</span>
                  <span className="font-medium text-sm">{qrData.dropoff}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button
            onClick={onClose}
            className="btn btn-outline w-full"
          >
            Kapat
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// QR Code utilities
export const generateQRData = (reservation) => {
  return {
    reservationId: reservation.reservationId || `SBS-${reservation.id?.slice(-6)}`,
    customerName: `${reservation.customerInfo?.firstName || ''} ${reservation.customerInfo?.lastName || ''}`.trim(),
    pickup: reservation.tripDetails?.pickupLocation || '',
    dropoff: reservation.tripDetails?.dropoffLocation || '',
    date: reservation.tripDetails?.date || '',
    time: reservation.tripDetails?.time || '',
    phone: reservation.customerInfo?.phone || '',
    verifyUrl: `${window.location.origin}/verify/${reservation.id}`
  };
};

export const downloadQRCode = async (reservation) => {
  const qrData = generateQRData(reservation);
  const qrString = JSON.stringify(qrData);
  
  try {
    const canvas = await QRCode.toCanvas(qrString, {
      width: 512,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });
    
    const link = document.createElement('a');
    link.download = `qr-${qrData.reservationId}.png`;
    link.href = canvas.toDataURL();
    link.click();
    
    return true;
  } catch (error) {
    console.error('QR download error:', error);
    return false;
  }
};
