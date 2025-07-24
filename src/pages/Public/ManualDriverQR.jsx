import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { updateManualDriverFinancials, updateDriverFinancials } from '../../utils/financialIntegration_IMPROVED';
import { Car, CheckCircle, XCircle, Clock, MapPin, User, Euro, AlertCircle, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

const ManualDriverQR = () => {
  const { reservationId } = useParams();
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [tripStatus, setTripStatus] = useState('waiting');

  useEffect(() => {
    loadReservation();
  }, [reservationId]);

  const loadReservation = async () => {
    try {
      setLoading(true);

      if (!reservationId) {
        setTripStatus('invalid');
        return;
      }

      const reservationRef = doc(db, 'reservations', reservationId);
      const reservationSnap = await getDoc(reservationRef);

      if (!reservationSnap.exists()) {
        setTripStatus('invalid');
        toast.error('Rezervasyon bulunamadı');
        return;
      }

      const reservationData = { id: reservationSnap.id, ...reservationSnap.data() };
      setReservation(reservationData);

      if (reservationData.status === 'completed') {
        setTripStatus('completed');
        toast.info('Bu rezervasyon zaten tamamlanmış');
      } else if (reservationData.status === 'in_progress') {
        setTripStatus('started');
        toast.info('Yolculuk devam ediyor');
      } else if (reservationData.assignedDriver !== 'manual' || !reservationData.manualDriverInfo) {
        setTripStatus('invalid');
        toast.error('Bu rezervasyon manuel şoföre atanmamış');
      } else {
        setTripStatus('waiting');
        toast.success('Rezervasyon yüklendi');
      }

    } catch (error) {
      console.error('Rezervasyon yükleme hatası:', error);
      setTripStatus('invalid');
      toast.error('Rezervasyon yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const startTrip = async () => {
    if (!reservation) return;

    try {
      setActionLoading(true);

      const reservationRef = doc(db, 'reservations', reservation.id);
      await updateDoc(reservationRef, {
        status: 'in_progress',
        startedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      setTripStatus('started');
      toast.success('Yolculuk başlatıldı!');

    } catch (error) {
      console.error('Yolculuk başlatma hatası:', error);
      toast.error('Yolculuk başlatılırken hata oluştu');
    } finally {
      setActionLoading(false);
    }
  };

  const completeTrip = async () => {
    if (!reservation) return;

    try {
      setActionLoading(true);

      const reservationRef = doc(db, 'reservations', reservation.id);
      await updateDoc(reservationRef, {
        status: 'completed',
        completedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Şoför tipine göre finansal işlemleri güncelle
      if (reservation.assignedDriver === 'manual' || reservation.manualDriverInfo) {
        // Manuel şoför için
        console.log('🚕 Manuel şoför için finansal işlem güncelleniyor...');
        await updateManualDriverFinancials(reservation.id, {
          ...reservation,
          status: 'completed',
          completedAt: serverTimestamp()
        });
      } else if (reservation.assignedDriver || reservation.assignedDriverId) {
        // Sisteme kayıtlı şoför için
        console.log('👨‍💼 Sistem şoförü için finansal işlem güncelleniyor...');
        await updateDriverFinancials(reservation.id, {
          ...reservation,
          status: 'completed',
          completedAt: serverTimestamp()
        });
      }

      setTripStatus('completed');
      toast.success('Yolculuk tamamlandı! Finansal kayıtlar güncellendi.');

    } catch (error) {
      console.error('Yolculuk tamamlama hatası:', error);
      toast.error('Yolculuk tamamlanırken hata oluştu');
    } finally {
      setActionLoading(false);
    }
  };

  const formatLocation = (location) => {
    if (!location) return 'Belirtilmemiş';
    if (typeof location === 'string') return location;
    if (location.address) return location.address;
    if (location.name) return location.name;
    return 'Konum bilgisi mevcut değil';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Rezervasyon yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (tripStatus === 'invalid') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-xl font-bold text-gray-800 mb-2">Geçersiz Link</h1>
          <p className="text-gray-600 mb-4">Bu link geçersiz veya süresi dolmuş olabilir.</p>
          <p className="text-sm text-gray-500">Lütfen yeni bir QR kod talep edin.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-lg mx-auto px-4">
        
        {/* Rezervasyon Bilgileri */}
        {reservation && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            
            {/* Başlık */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-xl font-bold text-gray-900">#{reservation.reservationId}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                tripStatus === 'completed' ? 'bg-green-100 text-green-800' :
                tripStatus === 'started' ? 'bg-yellow-100 text-yellow-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {tripStatus === 'completed' ? 'Tamamlandı' :
                 tripStatus === 'started' ? 'Devam Ediyor' : 'Beklemede'}
              </span>
            </div>
            
            <div className="space-y-5">
              
              {/* Müşteri Bilgileri */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" />
                  Müşteri Bilgileri
                </h3>
                <div className="space-y-1">
                  <p className="font-medium text-gray-900">
                    {reservation.customerInfo?.firstName} {reservation.customerInfo?.lastName}
                  </p>
                  <p className="text-sm text-gray-600">{reservation.customerInfo?.email}</p>
                </div>
              </div>

              {/* Seyahat Bilgileri */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-green-600" />
                  Seyahat Bilgileri
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-4 text-sm">
                    <span>📅 {reservation.tripDetails?.date}</span>
                    <span>⏰ {reservation.tripDetails?.time}</span>
                  </div>
                  
                  <div className="text-sm">
                    <span className="font-medium">Seyahat Türü:</span> {
                      reservation.tripDetails?.tripType === 'round-trip' ? 
                      'Gidiş-Dönüş' : 'Tek Yön'
                    }
                  </div>

                  {reservation.tripDetails?.flightNumber && (
                    <div className="text-sm">
                      <span className="font-medium">Uçuş:</span> {reservation.tripDetails.flightNumber}
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-sm">
                    <span>👥 {reservation.tripDetails?.passengerCount || 1} Yolcu</span>
                    <span>🧳 {reservation.tripDetails?.luggageCount || 0} Bagaj</span>
                  </div>
                </div>
              </div>

              {/* Güzergah */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-purple-600" />
                  Güzergah
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-gray-800">NEREDEN</p>
                      <p className="text-sm text-gray-600 mt-1">{formatLocation(reservation.tripDetails?.pickupLocation)}</p>
                    </div>
                  </div>
                  <div className="ml-1.5 w-0.5 h-4 bg-gray-300"></div>
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-gray-800">NEREYE</p>
                      <p className="text-sm text-gray-600 mt-1">{formatLocation(reservation.tripDetails?.dropoffLocation)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ücret Bilgileri */}
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Euro className="w-4 h-4 text-green-600" />
                  Ücret Bilgileri
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Toplam Ücret:</span>
                    <span className="font-medium">€{reservation.totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Ödeme Yöntemi:</span>
                    <span className="font-medium">
                      {reservation.paymentMethod === 'cash' ? 'Nakit' :
                       reservation.paymentMethod === 'card' ? 'Kredi Kartı' : 
                       'Banka Havalesi'}
                    </span>
                  </div>
                  <div className="border-t border-green-300 pt-2">
                    <div className="flex justify-between">
                      <span className="font-medium text-green-700">Sizin Hak Edişiniz:</span>
                      <span className="font-bold text-green-700">€{reservation.manualDriverInfo?.price}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Aksiyon Butonları */}
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
                  disabled={actionLoading}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {actionLoading ? 'Başlatılıyor...' : 'Yolculuğu Başlat'}
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
                  disabled={actionLoading}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {actionLoading ? 'Tamamlanıyor...' : 'Yolculuğu Tamamla'}
                </button>
              </>
            )}

            {tripStatus === 'completed' && (
              <>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Yolculuk Tamamlandı!</h3>
                <p className="text-gray-600 mb-4">Finansal kayıtlar güncellendi.</p>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-700">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Bu link artık kullanılamaz</span>
                  </div>
                  <p className="text-xs text-green-600 mt-1">Rezervasyon tamamlandığı için link devre dışı bırakıldı.</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">© SONSBS Transfer Servisi</p>
        </div>

        {/* Loading Overlay */}
        {actionLoading && (
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

export default ManualDriverQR;

