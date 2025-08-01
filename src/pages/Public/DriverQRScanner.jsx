import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import QRScannerComponent from '../../components/QR/QRScannerComponent';
import { updateManualDriverFinancials, updateDriverFinancials } from '../../utils/financialIntegration_IMPROVED';
import { Car, QrCode, CheckCircle, XCircle, Clock, MapPin, User, Euro } from 'lucide-react';
import toast from 'react-hot-toast';

const DriverQRScanner = () => {
  const [scanning, setScanning] = useState(false);
  const [currentReservation, setCurrentReservation] = useState(null);
  const [tripStatus, setTripStatus] = useState('waiting'); // 'waiting', 'started', 'completed'
  const [loading, setLoading] = useState(false);

  const handleQRScan = async (qrData) => {
    try {
      setLoading(true);
      
      // QR kod verisini parse et
      let reservationId;
      
      try {
        // Önce JSON parse etmeyi dene
        const parsedData = JSON.parse(qrData);
        reservationId = parsedData.reservationId;
      } catch (error) {
        // JSON değilse, direkt string olarak kullan (manuel giriş için)
        reservationId = qrData.trim();
        console.log('📝 Manual ID input detected:', reservationId);
      }

      // Rezervasyon ID kontrolü
      if (!reservationId) {
        toast.error('QR kodunda veya manuel girişte rezervasyon ID bulunamadı');
        return;
      }

      console.log('🔍 Searching for reservation ID:', reservationId);

      // Firebase'den rezervasyon verilerini al
      const reservationRef = doc(db, 'reservations', reservationId);
      const reservationSnap = await getDoc(reservationRef);

      if (!reservationSnap.exists()) {
        toast.error(`Bu QR koda ait rezervasyon bulunamadı: ${reservationId}`);
        return;
      }

      const reservation = { id: reservationSnap.id, ...reservationSnap.data() };

      // Rezervasyon durumunu kontrol et
      if (reservation.status === 'completed') {
        toast.error('Bu rezervasyon zaten tamamlanmış');
        return;
      }

      if (reservation.status !== 'confirmed' && reservation.status !== 'in_progress') {
        toast.error('Bu rezervasyon henüz onaylanmamış');
        return;
      }

      // Manuel şoför kontrolü
      if (reservation.assignedDriver !== 'manual' || !reservation.manualDriverInfo) {
        toast.error('Bu rezervasyon manuel şoföre atanmamış');
        return;
      }

      setCurrentReservation(reservation);
      
      // Eğer rezervasyon zaten başlamışsa
      if (reservation.status === 'in_progress') {
        setTripStatus('started');
        toast.success('Devam eden yolculuk yüklendi');
      } else {
        toast.success('Rezervasyon başarıyla yüklendi');
      }

      setScanning(false);

    } catch (error) {
      console.error('QR okuma hatası:', error);
      toast.error('QR kod okunurken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const startTrip = async () => {
    if (!currentReservation) return;

    try {
      setLoading(true);

      // Rezervasyon durumunu "in_progress" olarak güncelle
      const reservationRef = doc(db, 'reservations', currentReservation.id);
      await updateDoc(reservationRef, {
        status: 'in_progress',
        startedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      setTripStatus('started');
      toast.success('🚗 Yolculuk başlatıldı!');

    } catch (error) {
      console.error('Yolculuk başlatma hatası:', error);
      toast.error('Yolculuk başlatılırken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const completeTrip = async () => {
    if (!currentReservation) return;

    try {
      setLoading(true);

      // Rezervasyon durumunu "completed" olarak güncelle
      const reservationRef = doc(db, 'reservations', currentReservation.id);
      await updateDoc(reservationRef, {
        status: 'completed',
        completedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Şoför tipine göre finansal işlemleri güncelle
      if (currentReservation.assignedDriver === 'manual' || currentReservation.manualDriverInfo) {
        // Manuel şoför için
        console.log('🚕 Manuel şoför için finansal işlem güncelleniyor...');
        await updateManualDriverFinancials(currentReservation.id, {
          ...currentReservation,
          status: 'completed',
          completedAt: serverTimestamp()
        });
      } else if (currentReservation.assignedDriver || currentReservation.assignedDriverId) {
        // Sisteme kayıtlı şoför için
        console.log('👨‍💼 Sistem şoförü için finansal işlem güncelleniyor...');
        await updateDriverFinancials(currentReservation.id, {
          ...currentReservation,
          status: 'completed',
          completedAt: serverTimestamp()
        });
      }

      setTripStatus('completed');
      toast.success('🎉 Yolculuk tamamlandı! Finansal kayıtlar güncellendi.');

      // 3 saniye sonra sayfayı sıfırla
      setTimeout(() => {
        setCurrentReservation(null);
        setTripStatus('waiting');
      }, 3000);

    } catch (error) {
      console.error('Yolculuk tamamlama hatası:', error);
      toast.error('Yolculuk tamamlanırken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const resetScanner = () => {
    setCurrentReservation(null);
    setTripStatus('waiting');
    setScanning(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Car className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Manuel Şoför Paneli</h1>
            <p className="text-gray-600">QR kod okutarak yolculuklarınızı yönetin</p>
          </div>
        </div>

        {!currentReservation && !scanning && (
          <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
            <QrCode className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-800 mb-2">QR Kod Okutun</h2>
            <p className="text-gray-600 mb-6">Rezervasyon QR kodunu okutarak yolculuğu başlatın</p>
            <button
              onClick={() => setScanning(true)}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              QR Kod Okut
            </button>
          </div>
        )}

        {scanning && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="text-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">QR Kod Tarayın</h2>
              <p className="text-gray-600">Rezervasyon QR kodunu kameranıza tutun</p>
            </div>
            
            <QRScannerComponent
              isOpen={true}
              onClose={() => setScanning(false)}
              onScan={handleQRScan}
            />
            
            <button
              onClick={() => setScanning(false)}
              className="w-full mt-4 bg-gray-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              İptal
            </button>
          </div>
        )}

        {currentReservation && (
          <div className="space-y-6">
            {/* Rezervasyon Bilgileri */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Rezervasyon Detayları</h2>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-800">
                      {currentReservation.customerInfo?.firstName} {currentReservation.customerInfo?.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{currentReservation.customerInfo?.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="font-medium text-gray-800">Güzergah</p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Nereden:</span> {currentReservation.tripDetails?.pickupLocation}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Nereye:</span> {currentReservation.tripDetails?.dropoffLocation}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-800">Tarih & Saat</p>
                    <p className="text-sm text-gray-600">
                      {currentReservation.tripDetails?.date} - {currentReservation.tripDetails?.time}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Euro className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-800">Ücret Bilgisi</p>
                    <p className="text-sm text-gray-600">
                      Toplam: €{currentReservation.totalPrice}
                    </p>
                    <p className="text-sm text-green-600 font-medium">
                      Sizin Hak Edişiniz: €{currentReservation.manualDriverInfo?.price}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Durum ve Aksiyon Butonları */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="text-center">
                {tripStatus === 'waiting' && (
                  <>
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Yolculuk Başlatmaya Hazır</h3>
                    <p className="text-gray-600 mb-6">Müşteri hazır olduğunda yolculuğu başlatın</p>
                    <button
                      onClick={startTrip}
                      disabled={loading}
                      className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {loading ? 'Başlatılıyor...' : 'Yolculuğu Başlat'}
                    </button>
                  </>
                )}

                {tripStatus === 'started' && (
                  <>
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Car className="w-8 h-8 text-orange-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Yolculuk Devam Ediyor</h3>
                    <p className="text-gray-600 mb-6">Hedefe vardığınızda yolculuğu tamamlayın</p>
                    <button
                      onClick={completeTrip}
                      disabled={loading}
                      className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50"
                    >
                      {loading ? 'Tamamlanıyor...' : 'Yolculuğu Tamamla'}
                    </button>
                  </>
                )}

                {tripStatus === 'completed' && (
                  <>
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Yolculuk Tamamlandı!</h3>
                    <p className="text-gray-600 mb-6">Finansal kayıtlar güncellendi. Yeni QR kod okutabilirsiniz.</p>
                  </>
                )}
              </div>

              {tripStatus !== 'completed' && (
                <button
                  onClick={resetScanner}
                  className="w-full mt-4 bg-gray-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                >
                  Yeni QR Kod Okut
                </button>
              )}
            </div>
          </div>
        )}

        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">İşlem yapılıyor...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverQRScanner;
