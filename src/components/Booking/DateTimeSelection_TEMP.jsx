import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, RotateCcw, ArrowLeft } from 'lucide-react';
import { TIME_SLOTS } from '../../config/constants';

const DateTimeSelection = ({ bookingData, updateBookingData, onNext, onPrevious }) => {
  const [isRoundTrip, setIsRoundTrip] = useState(bookingData.isRoundTrip || false);
  const [departureDate, setDepartureDate] = useState(bookingData.departureDate || '');
  const [departureTime, setDepartureTime] = useState(bookingData.departureTime || '');
  const [returnDate, setReturnDate] = useState(bookingData.returnDate || '');
  const [returnTime, setReturnTime] = useState(bookingData.returnTime || '');

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  
  // Get current time
  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  useEffect(() => {
    updateBookingData({
      isRoundTrip,
      departureDate,
      departureTime,
      returnDate,
      returnTime
    });
  }, [isRoundTrip, departureDate, departureTime, returnDate, returnTime, updateBookingData]);

  // Filter available time slots based on selected date
  const getAvailableTimeSlots = (selectedDate) => {
    const isToday = selectedDate === today;
    
    if (isToday) {
      // If today, only show future time slots
      return TIME_SLOTS.filter(time => time > currentTime);
    }
    
    // If future date, show all time slots
    return TIME_SLOTS;
  };

  const handleRoundTripToggle = () => {
    setIsRoundTrip(!isRoundTrip);
    if (!isRoundTrip) {
      // When enabling round trip, set return date to next day by default
      if (departureDate) {
        const nextDay = new Date(departureDate);
        nextDay.setDate(nextDay.getDate() + 1);
        setReturnDate(nextDay.toISOString().split('T')[0]);
      }
    } else {
      // When disabling round trip, clear return data
      setReturnDate('');
      setReturnTime('');
    }
  };

  const handleDepartureDateChange = (date) => {
    setDepartureDate(date);
    
    // Clear departure time if date is today and current time slots are not available
    if (date === today && departureTime <= currentTime) {
      setDepartureTime('');
    }
    
    // Adjust return date if needed
    if (isRoundTrip && returnDate && new Date(returnDate) <= new Date(date)) {
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      setReturnDate(nextDay.toISOString().split('T')[0]);
    }
  };

  const handleReturnDateChange = (date) => {
    setReturnDate(date);
    
    // Clear return time if needed
    if (date === today && returnTime <= currentTime) {
      setReturnTime('');
    }
  };

  const handleNext = () => {
    if (departureDate && departureTime && (!isRoundTrip || (returnDate && returnTime))) {
      onNext();
    }
  };

  const isFormValid = departureDate && departureTime && (!isRoundTrip || (returnDate && returnTime));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-8">
        <div className="max-w-md lg:max-w-2xl xl:max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto">
              <Calendar className="w-8 h-8" />
            </div>
            <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold">Tarih ve Saat Seçimi</h1>
            <p className="text-blue-100 text-sm">
              Transfer tarihinizi ve saatinizi belirleyin
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md lg:max-w-2xl xl:max-w-4xl mx-auto px-4 -mt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-t-3xl shadow-xl space-y-6 p-6"
        >
          {/* Seyahat Türü */}
          <div className="space-y-4">
            <div className="text-left">
              <h2 className="text-base font-medium text-gray-900 mb-1">
                Seyahat Türü
              </h2>
              <p className="text-sm text-gray-600">
                Transfer türünüzü seçin
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-4">
              <div className="grid grid-cols-2 gap-4">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsRoundTrip(false)}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    !isRoundTrip
                      ? 'border-blue-500 bg-blue-500 text-white shadow-lg'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:shadow-md'
                  }`}
                >
                  <ArrowRight className="w-6 h-6 mx-auto mb-2" />
                  <div className="font-semibold">Tek Yön</div>
                  <div className="text-sm opacity-80">Sadece gidiş</div>
                </motion.button>
                
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleRoundTripToggle()}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    isRoundTrip
                      ? 'border-blue-500 bg-blue-500 text-white shadow-lg'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:shadow-md'
                  }`}
                >
                  <RotateCcw className="w-6 h-6 mx-auto mb-2" />
                  <div className="font-semibold">Gidiş-Dönüş</div>
                  <div className="text-sm opacity-80">İki yön</div>
                </motion.button>
              </div>
            </div>
          </div>

          {/* Gidiş Tarih ve Saat */}
          <div className="space-y-4">
            <div className="text-left">
              <h2 className="text-base font-medium text-gray-900 mb-1">
                Gidiş Bilgileri
              </h2>
              <p className="text-sm text-gray-600">
                Gidiş tarihi ve saatinizi seçin
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Gidiş Tarihi */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Gidiş Tarihi
                </label>
                <input
                  type="date"
                  value={departureDate}
                  min={today}
                  onChange={(e) => handleDepartureDateChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  required
                />
              </div>

              {/* Gidiş Saati */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  <Clock className="w-4 h-4 inline mr-2" />
                  Gidiş Saati
                </label>
                <select
                  value={departureTime}
                  onChange={(e) => setDepartureTime(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  required
                  disabled={!departureDate}
                >
                  <option value="">Saat seçin</option>
                  {getAvailableTimeSlots(departureDate).map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                {departureDate === today && (
                  <p className="text-xs text-amber-600 flex items-center">
                    ⚠️ Bugün için sadece gelecek saatler gösterilmektedir
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Dönüş Tarih ve Saat */}
          {isRoundTrip && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              <div className="text-left">
                <h2 className="text-base font-medium text-gray-900 mb-1">
                  Dönüş Bilgileri
                </h2>
                <p className="text-sm text-gray-600">
                  Dönüş tarihi ve saatinizi seçin
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Dönüş Tarihi */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Dönüş Tarihi
                  </label>
                  <input
                    type="date"
                    value={returnDate}
                    min={departureDate || today}
                    onChange={(e) => handleReturnDateChange(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    required
                  />
                </div>

                {/* Dönüş Saati */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    <Clock className="w-4 h-4 inline mr-2" />
                    Dönüş Saati
                  </label>
                  <select
                    value={returnTime}
                    onChange={(e) => setReturnTime(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    required
                    disabled={!returnDate}
                  >
                    <option value="">Saat seçin</option>
                    {getAvailableTimeSlots(returnDate).map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                  {returnDate === today && (
                    <p className="text-xs text-amber-600 flex items-center">
                      ⚠️ Bugün için sadece gelecek saatler gösterilmektedir
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Seçilen Tarih ve Saat Özeti */}
          {departureDate && departureTime && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-6"
            >
              <h3 className="text-base font-medium text-gray-900 mb-4">
                Rezervasyon Özeti
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Gidiş Bilgileri */}
                <div className="bg-white rounded-xl p-4 border border-blue-100">
                  <div className="flex items-center mb-3">
                    <ArrowRight className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="font-semibold text-gray-900">Gidiş</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                      <span>{new Date(departureDate).toLocaleDateString('tr-TR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="font-medium">{departureTime}</span>
                    </div>
                  </div>
                </div>

                {/* Dönüş Bilgileri */}
                {isRoundTrip && returnDate && returnTime && (
                  <div className="bg-white rounded-xl p-4 border border-purple-100">
                    <div className="flex items-center mb-3">
                      <RotateCcw className="w-5 h-5 text-purple-600 mr-2" />
                      <span className="font-semibold text-gray-900">Dönüş</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                        <span>{new Date(returnDate).toLocaleDateString('tr-TR', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 text-gray-500 mr-2" />
                        <span className="font-medium">{returnTime}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Ek Bilgiler */}
              <div className="mt-4 pt-4 border-t border-blue-200">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-blue-600 font-medium">Seyahat Türü:</span>
                    <span className="ml-2 text-gray-700">
                      {isRoundTrip ? 'Gidiş-Dönüş' : 'Tek Yön'}
                    </span>
                  </div>
                  {departureDate === today && (
                    <div className="text-amber-600">
                      <span className="font-medium">⚠️ Günlük Rezervasyon:</span>
                      <span className="ml-1">Lütfen zamanında hazır olun</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Önemli Bilgiler */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4">
            <h4 className="text-base font-medium text-amber-800 mb-3">Önemli Bilgiler</h4>
            <ul className="text-sm text-amber-700 space-y-2">
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">•</span>
                Rezervasyon saatinden 15 dakika önce hazır bulunun
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">•</span>
                Havalimanı transferleri için 30 dakika önceden buluşma önerilir
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">•</span>
                Gidiş-dönüş rezervasyonlarda dönüş saati değiştirilebilir
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">•</span>
                Acil durumlar için 7/24 destek hattımızı arayabilirsiniz
              </li>
            </ul>
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6">
            <button
              onClick={onPrevious}
              className="flex-1 sm:flex-none px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 font-semibold flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Geri
            </button>
            
            <button
              onClick={handleNext}
              disabled={!isFormValid}
              className="flex-1 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 font-semibold shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              Devam Et
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DateTimeSelection;
