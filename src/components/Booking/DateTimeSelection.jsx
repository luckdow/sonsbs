import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, RotateCcw } from 'lucide-react';
import { TIME_SLOTS } from '../../config/constants';

const DateTimeSelection = ({ bookingData, updateBookingData }) => {
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
    updateBookingData('isRoundTrip', isRoundTrip);
    updateBookingData('departureDate', departureDate);
    updateBookingData('departureTime', departureTime);
    updateBookingData('returnDate', returnDate);
    updateBookingData('returnTime', returnTime);
  }, [isRoundTrip, departureDate, departureTime, returnDate, returnTime]);

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

  return (
    <div className="space-y-8">
      {/* Trip Type Selection */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Seyahat Türü
        </h3>
        <div className="flex space-x-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsRoundTrip(false)}
            className={`flex-1 p-4 rounded-lg border-2 transition-colors ${
              !isRoundTrip
                ? 'border-blue-500 bg-blue-500 text-white'
                : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300'
            }`}
          >
            <ArrowRight className="w-6 h-6 mx-auto mb-2" />
            <div className="font-medium">Tek Yön</div>
            <div className="text-sm opacity-80">Sadece gidiş</div>
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => handleRoundTripToggle()}
            className={`flex-1 p-4 rounded-lg border-2 transition-colors ${
              isRoundTrip
                ? 'border-blue-500 bg-blue-500 text-white'
                : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300'
            }`}
          >
            <RotateCcw className="w-6 h-6 mx-auto mb-2" />
            <div className="font-medium">Gidiş-Dönüş</div>
            <div className="text-sm opacity-80">İki yön</div>
          </motion.button>
        </div>
      </div>

      {/* Departure Date & Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Departure Date */}
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Departure Time */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            <Clock className="w-4 h-4 inline mr-2" />
            Gidiş Saati
          </label>
          <select
            value={departureTime}
            onChange={(e) => setDepartureTime(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            <p className="text-xs text-amber-600">
              Bugün için sadece gelecek saatler gösterilmektedir
            </p>
          )}
        </div>
      </div>

      {/* Return Date & Time (if round trip) */}
      {isRoundTrip && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Return Date */}
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Return Time */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              <Clock className="w-4 h-4 inline mr-2" />
              Dönüş Saati
            </label>
            <select
              value={returnTime}
              onChange={(e) => setReturnTime(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              <p className="text-xs text-amber-600">
                Bugün için sadece gelecek saatler gösterilmektedir
              </p>
            )}
          </div>
        </motion.div>
      )}

      {/* Selected Time Summary */}
      {departureDate && departureTime && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border border-blue-200 rounded-xl p-6"
        >
          <h4 className="font-semibold text-blue-900 mb-4">
            Seçilen Tarih ve Saat
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Departure Info */}
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center mb-2">
                <ArrowRight className="w-5 h-5 text-blue-600 mr-2" />
                <span className="font-medium text-gray-900">Gidiş</span>
              </div>
              <div className="space-y-1 text-sm">
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
                  <span>{departureTime}</span>
                </div>
              </div>
            </div>

            {/* Return Info */}
            {isRoundTrip && returnDate && returnTime && (
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <RotateCcw className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="font-medium text-gray-900">Dönüş</span>
                </div>
                <div className="space-y-1 text-sm">
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
                    <span>{returnTime}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Additional Info */}
          <div className="mt-4 pt-4 border-t border-blue-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-600 font-medium">Seyahat Türü:</span>
                <span className="ml-2 text-gray-700">
                  {isRoundTrip ? 'Gidiş-Dönüş' : 'Tek Yön'}
                </span>
              </div>
              {departureDate === today && (
                <div className="text-amber-600">
                  <span className="font-medium">⚠️ Günlük rezervasyon:</span>
                  <span className="ml-1">Lütfen zamanında hazır olun</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Important Notes */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <h5 className="font-medium text-amber-800 mb-2">Önemli Notlar:</h5>
        <ul className="text-sm text-amber-700 space-y-1">
          <li>• Rezervasyon saatinden 15 dakika önce hazır bulunun</li>
          <li>• Havalimanı transferleri için 30 dakika önceden buluşma önerilir</li>
          <li>• Gidiş-dönüş rezervasyonlarda dönüş saati değiştirilebilir</li>
          <li>• Acil durumlar için 7/24 destek hattımızı arayabilirsiniz</li>
        </ul>
      </div>
    </div>
  );
};

export default DateTimeSelection;
