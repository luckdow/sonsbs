import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { updateManualDriverFinancials, updateDriverFinancials } from '../../utils/financialIntegration_IMPROVED';
import { Car, CheckCircle, XCircle, Clock, MapPin, User, Euro, Calendar } from 'lucide-react';

const ManualDriverQR = () => {
  const { reservationId } = useParams();
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [tripStatus, setTripStatus] = useState('waiting');
  const [linkExpired, setLinkExpired] = useState(false);

  useEffect(() => {
    loadReservation();
  }, [reservationId]);

  // Yolculuk tamamlandıktan 30 saniye sonra linki devre dışı bırak
  useEffect(() => {
    let timer;
    if (tripStatus === 'completed') {
      timer = setTimeout(() => {
        setLinkExpired(true);
      }, 30000); // 30 saniye
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [tripStatus]);

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
        return;
      }

      const reservationData = { id: reservationSnap.id, ...reservationSnap.data() };
      setReservation(reservationData);

      if (reservationData.status === 'completed') {
        setTripStatus('completed');
      } else if (reservationData.status === 'in_progress') {
        setTripStatus('started');
      } else if (reservationData.assignedDriver !== 'manual' || !reservationData.manualDriverInfo) {
        setTripStatus('invalid');
      } else {
        setTripStatus('waiting');
      }

    } catch (error) {
      setTripStatus('invalid');
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

    } catch (error) {
      // Hata durumu
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

      // Finansal işlemler
      if (reservation.assignedDriver === 'manual' || reservation.manualDriverInfo) {
        await updateManualDriverFinancials(reservation.id, {
          ...reservation,
          status: 'completed',
          completedAt: serverTimestamp()
        });
      } else if (reservation.assignedDriver || reservation.assignedDriverId) {
        await updateDriverFinancials(reservation.id, {
          ...reservation,
          status: 'completed',
          completedAt: serverTimestamp()
        });
      }

      setTripStatus('completed');

    } catch (error) {
      // Hata durumu
    } finally {
      setActionLoading(false);
    }
  };

  // Gidiş-dönüş kontrolü için yardımcı fonksiyon
  const isRoundTripReservation = (reservation) => {
    if (!reservation) return false;
    
    // Tüm olası gidiş-dönüş formatlarını kontrol et
    return (
      reservation.tripDetails?.tripType === 'round_trip' ||
      reservation.tripDetails?.tripType === 'round-trip' ||
      reservation.tripType === 'round-trip' ||
      reservation.transferType === 'round-trip' ||
      reservation.isRoundTrip === true
    );
  };

  // Dönüş tarihi alma fonksiyonu
  const getReturnDate = (reservation) => {
    return (
      reservation.tripDetails?.returnDate ||
      reservation.returnDate ||
      'Belirtilmemiş'
    );
  };

  // Dönüş saati alma fonksiyonu
  const getReturnTime = (reservation) => {
    return (
      reservation.tripDetails?.returnTime ||
      reservation.returnTime ||
      reservation.tripDetails?.time ||
      'Belirtilmemiş'
    );
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm max-w-sm w-full text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Rezervasyon Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (tripStatus === 'invalid' || linkExpired) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm max-w-sm w-full text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-3">
            {linkExpired ? 'Link Süresi Doldu' : 'Erişim Engellendi'}
          </h1>
          <p className="text-gray-600 text-sm mb-6 leading-relaxed">
            {linkExpired 
              ? 'Bu link güvenlik nedeniyle süresi dolmuştur. Artık kullanılamaz.' 
              : 'Bu link artık geçerli değil veya yetkiniz bulunmuyor. Lütfen yeni bir link talep edin.'
            }
          </p>
          
          {/* Profesyonel Bilgilendirme */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-4">
            <p className="text-blue-800 text-sm font-medium mb-2">
              📞 Destek İhtiyacınız mı Var?
            </p>
            <p className="text-blue-700 text-xs leading-relaxed">
              Sorun yaşıyorsanız +90 532 574 26 82 numaralı telefonu arayabilirsiniz.
            </p>
          </div>

          {/* Güvenlik Bildirimi */}
          <div className="bg-gray-100 rounded-2xl p-4">
            <p className="text-xs text-gray-600 mb-1">
              <strong>Güvenlik Bildirimi:</strong>
            </p>
            <p className="text-xs text-gray-500">
              Bu sistem güvenlik amacıyla her yolculuk için tek kullanımlık linkler oluşturur.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-sm mx-auto p-4">
        
        {/* Header */}
        <div className="text-center py-6">
          <h1 className="text-2xl font-bold text-gray-900">SBS Transfer Hizmetleri Ltd. Şti.</h1>
          <p className="text-gray-600 text-sm mt-1">Transfer Servisi</p>
        </div>

        {/* Yolculuk tamamlandıysa sadece teşekkür sayfası göster */}
        {tripStatus === 'completed' ? (
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Yolculuk Tamamlandı!</h3>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                Transfer hizmeti başarıyla tamamlanmıştır. Müşteriye güvenli bir yolculuk sunduğunuz için teşekkür ederiz.
              </p>
              
              {/* Tamamlanma Detayları */}
              <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-700 font-medium">Rezervasyon:</span>
                    <span className="text-green-900 font-bold">#{reservation.reservationId}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-700 font-medium">Tamamlanma:</span>
                    <span className="text-green-900">{new Date().toLocaleString('tr-TR')}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-700 font-medium">Müşteri:</span>
                    <span className="text-green-900">{reservation.customerInfo?.firstName} {reservation.customerInfo?.lastName}</span>
                  </div>
                  {(reservation.paymentMethod === 'cash' || reservation.paymentMethod === 'nakit') && (
                    <div className="border-t border-green-300 pt-3 mt-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-green-700 font-medium">Tahsil Edilen:</span>
                        <span className="text-green-900 font-bold">€{reservation.totalPrice || reservation.pricing?.totalPrice || 0}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Profesyonel Mesaj */}
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-4">
                <p className="text-blue-800 text-sm font-medium mb-2">
                  🏆 SBS Transfer Hizmetleri Ltd. Şti. Ailesinin Bir Parçası Olduğunuz İçin Teşekkürler
                </p>
                <p className="text-blue-700 text-xs leading-relaxed">
                  Kaliteli hizmetiniz sayesinde müşteri memnuniyetini artırıyor ve markamızı güçlendiriyorsunuz.
                </p>
              </div>

              {/* Link Durumu */}
              <div className="bg-gray-100 rounded-2xl p-4">
                <p className="text-xs text-gray-600 mb-1">
                  <strong>Güvenlik Bildirimi:</strong>
                </p>
                <p className="text-xs text-gray-500">
                  Bu link artık güvenlik nedeniyle devre dışı bırakılmıştır. Yeni rezervasyonlar için yeni link alınması gerekmektedir.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Rezervasyon Kartı - Sadece tamamlanmadıysa göster */}
            {reservation && (
              <div className="bg-white rounded-3xl shadow-lg p-6 mb-4">
                
                {/* Rezervasyon ID ve Status */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Rezervasyon</p>
                    <p className="text-lg font-bold text-gray-900">#{reservation.reservationId}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    tripStatus === 'started' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {tripStatus === 'started' ? 'Devam Ediyor' : 'Beklemede'}
                  </div>
                </div>

                {/* Müşteri */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Müşteri</p>
                      <p className="font-semibold text-gray-900">
                        {reservation.customerInfo?.firstName} {reservation.customerInfo?.lastName}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tarih & Saat */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 uppercase">Tarih & Saat</p>
                      <div className="space-y-1">
                        <p className="font-semibold text-gray-900">
                          <span className="text-green-700">GİDİŞ:</span> {reservation.tripDetails?.date} • {reservation.tripDetails?.time}
                        </p>
                        {isRoundTripReservation(reservation) && (
                          <p className="font-semibold text-gray-900">
                            <span className="text-blue-700">DÖNÜŞ:</span> {getReturnDate(reservation)} • {getReturnTime(reservation)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Güzergah */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-purple-600" />
                      </div>
                      <p className="text-xs text-gray-500 uppercase">Güzergah</p>
                    </div>
                    {isRoundTripReservation(reservation) && (
                      <div className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-semibold">
                        GİDİŞ-DÖNÜŞ
                      </div>
                    )}
                  </div>
                  
                  <div className="ml-11 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-3 h-3 rounded-full bg-green-500 mt-1"></div>
                      <div>
                        <p className="text-xs text-gray-500">NEREDEN</p>
                        <p className="text-sm font-medium text-gray-800">
                          {formatLocation(reservation.tripDetails?.pickupLocation)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="ml-1.5 w-0.5 h-6 bg-gray-300"></div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-3 h-3 rounded-full bg-red-500 mt-1"></div>
                      <div>
                        <p className="text-xs text-gray-500">NEREYE</p>
                        <p className="text-sm font-medium text-gray-800">
                          {formatLocation(reservation.tripDetails?.dropoffLocation)}
                        </p>
                      </div>
                    </div>
                    
                    {isRoundTripReservation(reservation) && (
                      <>
                        <div className="ml-1.5 w-0.5 h-6 bg-gray-300"></div>
                        <div className="flex items-start gap-3">
                          <div className="w-3 h-3 rounded-full bg-blue-500 mt-1"></div>
                          <div>
                            <p className="text-xs text-gray-500">DÖNÜŞ</p>
                            <p className="text-sm font-medium text-gray-800">
                              {formatLocation(reservation.tripDetails?.pickupLocation)}
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Ücret */}
                <div className="bg-green-50 rounded-2xl p-4 mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Euro className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Sizin Ücretiniz</p>
                      <p className="text-xl font-bold text-green-700">€{reservation.manualDriverInfo?.price}</p>
                    </div>
                  </div>
                </div>

                {/* Ödeme Bilgisi */}
                {(reservation.paymentMethod === 'cash' || reservation.paymentMethod === 'nakit') && (
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                        <Euro className="w-4 h-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-xs text-amber-600 uppercase font-semibold">NAKİT ÖDEME</p>
                        <p className="text-lg font-bold text-amber-800">
                          Müşteriden €{reservation.totalPrice || reservation.pricing?.totalPrice || 0} alınacak
                        </p>
                      </div>
                    </div>
                    <div className="bg-amber-100 rounded-xl p-3 mt-3">
                      <p className="text-xs text-amber-700">
                        <strong>ÖNEMLİ:</strong> Müşteri size nakit olarak €{reservation.totalPrice || reservation.pricing?.totalPrice || 0} ödeyecek. 
                        Lütfen bu tutarı tahsil ettiğinizi onaylayın.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Aksiyon Butonları - Sadece tamamlanmadıysa göster */}
            <div className="bg-white rounded-3xl shadow-lg p-6">
              {tripStatus === 'waiting' && (
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Hazır mısınız?</h3>
                  <p className="text-gray-600 text-sm mb-6">Müşteri ile buluştuğunuzda yolculuğu başlatın</p>
                  <button
                    onClick={startTrip}
                    disabled={actionLoading}
                    className="w-full bg-blue-600 text-white py-4 rounded-2xl font-semibold text-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {actionLoading ? 'Başlatılıyor...' : 'Yolculuğu Başlat'}
                  </button>
                </div>
              )}

              {tripStatus === 'started' && (
                <div className="text-center">
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Car className="w-8 h-8 text-amber-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Yolculuk Devam Ediyor</h3>
                  <p className="text-gray-600 text-sm mb-6">Hedefe vardığınızda tamamlayın</p>
                  <button
                    onClick={completeTrip}
                    disabled={actionLoading}
                    className="w-full bg-green-600 text-white py-4 rounded-2xl font-semibold text-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {actionLoading ? 'Tamamlanıyor...' : 'Yolculuğu Tamamla'}
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">© 2025 SBS Transfer Hizmetleri Ltd. Şti.</p>
        </div>

      </div>
    </div>
  );
};

export default ManualDriverQR;

