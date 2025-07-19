import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { QrCode, CheckCircle, AlertCircle, DollarSign, MapPin, User, Clock } from 'lucide-react';
import { processQRScanCompletion } from '../../utils/financialIntegration';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import toast from 'react-hot-toast';

const QRScannerComponent = ({ driverId, onScanComplete, onScanSuccess, onScanError }) => {
  const [scannedData, setScannedData] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [reservationDetails, setReservationDetails] = useState(null);
  const [manualReservationId, setManualReservationId] = useState('');
  const [showManualInput, setShowManualInput] = useState(true); // Geliştirme için manual input

  const handleQRScan = async (qrData) => {
    try {
      setProcessing(true);
      
      console.log('QRScanner: Okutulan veri:', qrData);
      
      // QR kod verisini parse et
      let reservationId;
      try {
        const parsed = JSON.parse(qrData);
        reservationId = parsed.reservationId || parsed.id;
      } catch (e) {
        // QR kod sadece rezervasyon ID'si içeriyorsa
        reservationId = qrData;
      }

      console.log('QRScanner: Rezervasyon ID:', reservationId);

      if (!reservationId) {
        throw new Error('QR kodunda rezervasyon ID bulunamadı');
      }

      // onScanSuccess callback'ini çağır
      if (onScanSuccess) {
        onScanSuccess(reservationId);
        return;
      }

      // Rezervasyon detaylarını getir
      const reservationDoc = await getDoc(doc(db, 'reservations', reservationId));
      if (!reservationDoc.exists()) {
        throw new Error('Rezervasyon bulunamadı');
      }

      const reservation = reservationDoc.data();
      setReservationDetails(reservation);
      setScannedData({ reservationId });

    } catch (error) {
      console.error('QR scan error:', error);
      if (onScanError) {
        onScanError(error);
      } else {
        toast.error('QR kod okuma hatası: ' + error.message);
      }
    } finally {
      setProcessing(false);
    }
  };

  const handleManualReservationLookup = async () => {
    if (!manualReservationId.trim()) {
      toast.error('Rezervasyon ID giriniz');
      return;
    }

    console.log('QRScanner: Manuel arama:', manualReservationId);
    handleQRScan(manualReservationId.trim());
  };

  const handleCompleteTrip = async () => {
    if (!scannedData || !reservationDetails) {
      toast.error('Önce QR kod okutun');
      return;
    }

    try {
      setProcessing(true);

      // Finansal entegrasyon ile trip'i tamamla
      const result = await processQRScanCompletion(scannedData.reservationId, driverId);

      // Başarı mesajı - ödeme metoduna göre
      let message = 'Yolculuk tamamlandı! ';
      if (reservationDetails.paymentMethod === 'cash') {
        message += `${reservationDetails.totalPrice}₺ nakit ödeme aldınız. Komisyon (${(reservationDetails.totalPrice * 0.15).toFixed(0)}₺) cari hesabınızdan düşüldü.`;
      } else {
        message += `Kazancınız (${(reservationDetails.totalPrice * 0.85).toFixed(0)}₺) cari hesabınıza eklendi.`;
      }

      toast.success(message);
      
      if (onScanComplete) {
        onScanComplete(result);
      }

      // State'i temizle
      setScannedData(null);
      setReservationDetails(null);
      setManualReservationId('');

    } catch (error) {
      console.error('Trip completion error:', error);
      toast.error('Yolculuk tamamlama hatası: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6">
      <div className="text-center mb-6">
        <QrCode className="w-16 h-16 mx-auto text-blue-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">Yolculuk Tamamla</h2>
        <p className="text-gray-600">QR kod okutun veya rezervasyon ID girin</p>
      </div>

      {/* QR Scanner Placeholder - Gerçek uygulamada react-qr-scanner gibi bir kütüphane kullanılabilir */}
      <div className="mb-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <QrCode className="w-12 h-12 mx-auto text-gray-400 mb-2" />
          <p className="text-gray-500">QR kod tarayıcı burada olacak</p>
          <p className="text-sm text-gray-400 mt-2">Gerçek uygulamada kamera QR kod okuyacak</p>
        </div>
      </div>

      {/* Manuel Rezervasyon ID Girişi */}
      <div className="mb-6">
        <button
          onClick={() => setShowManualInput(!showManualInput)}
          className="w-full text-blue-600 hover:text-blue-800 text-sm"
        >
          Manuel rezervasyon ID gir
        </button>
        
        {showManualInput && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-3 space-y-3"
          >
            <input
              type="text"
              placeholder="Rezervasyon ID (örn: SBS-001234)"
              value={manualReservationId}
              onChange={(e) => setManualReservationId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            
            <button
              onClick={handleManualReservationLookup}
              disabled={processing}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {processing ? 'Aranıyor...' : 'Rezervasyon Ara'}
            </button>
          </motion.div>
        )}
      </div>

      {/* Rezervasyon Detayları */}
      {reservationDetails && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 rounded-lg p-4 mb-6"
        >
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            Rezervasyon Bulundu
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center">
              <User className="w-4 h-4 text-gray-500 mr-2" />
              <span className="text-sm">
                {reservationDetails.customerInfo?.firstName} {reservationDetails.customerInfo?.lastName}
              </span>
            </div>
            
            <div className="flex items-center">
              <MapPin className="w-4 h-4 text-gray-500 mr-2" />
              <span className="text-sm">
                {reservationDetails.tripDetails?.pickupLocation} → {reservationDetails.tripDetails?.dropoffLocation}
              </span>
            </div>
            
            <div className="flex items-center">
              <Clock className="w-4 h-4 text-gray-500 mr-2" />
              <span className="text-sm">
                {reservationDetails.tripDetails?.date} - {reservationDetails.tripDetails?.time}
              </span>
            </div>
            
            <div className="flex items-center">
              <DollarSign className="w-4 h-4 text-gray-500 mr-2" />
              <span className="text-sm">
                {reservationDetails.totalPrice}₺ - {reservationDetails.paymentMethod === 'cash' ? 'Nakit' : 'Kart'}
              </span>
            </div>

            {/* Ödeme Uyarısı */}
            {reservationDetails.paymentMethod === 'cash' ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-2 mt-3">
                <div className="flex items-center">
                  <AlertCircle className="w-4 h-4 text-yellow-600 mr-2" />
                  <span className="text-xs text-yellow-800">
                    Nakit ödeme: Müşteriden {reservationDetails.totalPrice}₺ alacaksınız
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-2 mt-3">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-blue-600 mr-2" />
                  <span className="text-xs text-blue-800">
                    Kart ödemesi: Kazancınız cari hesabınıza eklenecek
                  </span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Tamamlama Butonu */}
      {scannedData && reservationDetails && (
        <button
          onClick={handleCompleteTrip}
          disabled={processing}
          className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
        >
          {processing ? 'Tamamlanıyor...' : '✓ Yolculuğu Tamamla'}
        </button>
      )}
    </div>
  );
};

export default QRScannerComponent;
