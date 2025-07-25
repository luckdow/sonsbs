import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { doc, updateDoc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { updateManualDriverFinancials } from '../../utils/financialIntegration_IMPROVED';
import { QrCode, Camera, CheckCircle, XCircle, Navigation, MapPin, Clock, User, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import QrScanner from 'qr-scanner';

const QRScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tripStatus, setTripStatus] = useState('idle'); // 'idle', 'started', 'completed'
  const videoRef = useRef(null);
  const qrScannerRef = useRef(null);

  useEffect(() => {
    return () => {
      // Cleanup scanner when component unmounts
      if (qrScannerRef.current) {
        qrScannerRef.current.destroy();
      }
    };
  }, []);

  const startScanning = async () => {
    try {
      setIsScanning(true);
      
      if (!videoRef.current) return;

      // QR Scanner başlat
      qrScannerRef.current = new QrScanner(
        videoRef.current,
        (result) => {
          handleQRScan(result.data);
        },
        {
          onDecodeError: (err) => {
            console.log('QR decode error:', err);
          },
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );

      await qrScannerRef.current.start();
      
    } catch (error) {
      console.error('Camera başlatılamadı:', error);
      toast.error('Kamera erişimi sağlanamadı');
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.stop();
      qrScannerRef.current.destroy();
      qrScannerRef.current = null;
    }
    setIsScanning(false);
  };

  const handleQRScan = async (qrData) => {
    try {
      setLoading(true);
      stopScanning();

      // QR içeriğini parse et
      let parsedData;
      try {
        parsedData = JSON.parse(qrData);
      } catch (parseError) {
        // URL formatında ise reservation ID'sini çıkar
        if (qrData.includes('/verify/')) {
          const reservationId = qrData.split('/verify/')[1];
          parsedData = { reservationId };
        } else {
          throw new Error('Geçersiz QR kod formatı');
        }
      }

      setScannedData(parsedData);

      // Rezervasyon bilgilerini al
      let reservationId = parsedData.reservationId;
      
      // Eğer SBS- prefix'i varsa kaldır
      if (reservationId.startsWith('SBS-')) {
        reservationId = reservationId.substring(4);
      }

      // Veritabanında rezervasyonu ara
      const reservationDoc = await getDoc(doc(db, 'reservations', reservationId));
      
      if (!reservationDoc.exists()) {
        toast.error('Rezervasyon bulunamadı');
        return;
      }

      const reservationData = { id: reservationDoc.id, ...reservationDoc.data() };
      setReservation(reservationData);

      // Mevcut durumu kontrol et
      if (reservationData.status === 'completed') {
        setTripStatus('completed');
        toast.info('Bu yolculuk zaten tamamlanmış');
      } else if (reservationData.status === 'in_progress') {
        setTripStatus('started');
        toast.info('Yolculuk devam ediyor - Tamamlamak için butona basın');
      } else {
        setTripStatus('idle');
        toast.success('Rezervasyon bulundu - Yolculuğu başlatabilirsiniz');
      }

    } catch (error) {
      console.error('QR tarama hatası:', error);
      toast.error('QR kod okunamadı: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const startTrip = async () => {
    if (!reservation) return;

    try {
      setLoading(true);

      await updateDoc(doc(db, 'reservations', reservation.id), {
        status: 'in_progress',
        tripStartedAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });

      setTripStatus('started');
      toast.success('Yolculuk başlatıldı!');

    } catch (error) {
      console.error('Yolculuk başlatma hatası:', error);
      toast.error('Yolculuk başlatılamadı');
    } finally {
      setLoading(false);
    }
  };

  const completeTrip = async () => {
    if (!reservation) return;

    try {
      setLoading(true);

      // Rezervasyonu tamamlandı olarak güncelle
      await updateDoc(doc(db, 'reservations', reservation.id), {
        status: 'completed',
        completedAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });

      // Manuel şoför finansal işlemlerini güncelle
      if (reservation.assignedDriver === 'manual' && reservation.manualDriverInfo) {
        await updateManualDriverFinancials(reservation.id, {
          ...reservation,
          status: 'completed',
          completedAt: Timestamp.now()
        });
      }

      setTripStatus('completed');
      toast.success('Yolculuk tamamlandı! Finansal işlemler otomatik olarak güncellendi.');

    } catch (error) {
      console.error('Yolculuk tamamlama hatası:', error);
      toast.error('Yolculuk tamamlanamadı');
    } finally {
      setLoading(false);
    }
  };

  const resetScanner = () => {
    setScannedData(null);
    setReservation(null);
    setTripStatus('idle');
  };

  const formatLocation = (location) => {
    if (!location) return 'Belirtilmemiş';
    if (typeof location === 'string') return location;
    if (location.address) return location.address;
    if (location.name) return location.name;
    return 'Konum bilgisi mevcut değil';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">QR Kod Tarayıcı</h1>
        <p className="text-gray-600">Rezervasyon QR kodunu okutarak yolculuğu yönetin</p>
      </div>

      {!scannedData ? (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-center space-y-6">
            {!isScanning ? (
              <>
                <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                  <QrCode className="w-12 h-12 text-blue-600" />
                </div>
                <button
                  onClick={startScanning}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors flex items-center gap-2 mx-auto"
                >
                  <Camera className="w-5 h-5" />
                  QR Kod Taramayı Başlat
                </button>
              </>
            ) : (
              <div className="space-y-4">
                <div className="relative w-full max-w-md mx-auto">
                  <video
                    ref={videoRef}
                    className="w-full rounded-lg border-4 border-blue-300"
                    style={{ aspectRatio: '1:1' }}
                  />
                  <div className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none">
                    <div className="absolute inset-4 border-2 border-blue-400 rounded-lg border-dashed"></div>
                  </div>
                </div>
                <p className="text-gray-600">QR kodu kamera görüş alanına getirin</p>
                <button
                  onClick={stopScanning}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Taramayı Durdur
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Rezervasyon Bilgileri */}
          {reservation && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Rezervasyon Detayları</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  tripStatus === 'completed' ? 'bg-green-100 text-green-800' :
                  tripStatus === 'started' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {tripStatus === 'completed' ? 'Tamamlandı' :
                   tripStatus === 'started' ? 'Devam Ediyor' : 'Beklemede'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Müşteri Bilgileri */}
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-700 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Müşteri Bilgileri
                  </h3>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="font-medium">{reservation.customerInfo?.firstName} {reservation.customerInfo?.lastName}</p>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {reservation.customerInfo?.phone}
                    </p>
                  </div>
                </div>

                {/* Yolculuk Bilgileri */}
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-700 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Yolculuk Bilgileri
                  </h3>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">{reservation.tripDetails?.date} - {reservation.tripDetails?.time}</p>
                    <p className="text-sm font-medium">Yolcu: {reservation.passengerCount} kişi</p>
                  </div>
                </div>

                {/* Güzergah */}
                <div className="md:col-span-2 space-y-3">
                  <h3 className="font-medium text-gray-700 flex items-center gap-2">
                    <Navigation className="w-4 h-4" />
                    Güzergah
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-800">Başlangıç</p>
                        <p className="text-sm text-gray-600">{formatLocation(reservation.tripDetails?.pickupLocation)}</p>
                      </div>
                    </div>
                    <div className="my-2 ml-2 w-0.5 h-6 bg-gray-300"></div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-red-600 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-800">Varış</p>
                        <p className="text-sm text-gray-600">{formatLocation(reservation.tripDetails?.dropoffLocation)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Aksiyon Butonları */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {tripStatus === 'idle' && (
                <button
                  onClick={startTrip}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-8 py-3 rounded-lg transition-colors flex items-center gap-2 justify-center"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <CheckCircle className="w-5 h-5" />
                  )}
                  Yolculuğu Başlat
                </button>
              )}

              {tripStatus === 'started' && (
                <button
                  onClick={completeTrip}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-8 py-3 rounded-lg transition-colors flex items-center gap-2 justify-center"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <CheckCircle className="w-5 h-5" />
                  )}
                  Yolculuğu Tamamla
                </button>
              )}

              {tripStatus === 'completed' && (
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-6 py-3 rounded-lg">
                    <CheckCircle className="w-5 h-5" />
                    Yolculuk Tamamlandı
                  </div>
                </div>
              )}

              <button
                onClick={resetScanner}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2 justify-center"
              >
                <QrCode className="w-5 h-5" />
                Yeni QR Tarama
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default QRScanner;
