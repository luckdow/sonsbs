import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, Mail, MessageSquare, Plus, Trash2, Baby } from 'lucide-react';

const PassengerDetails = ({ bookingData, updateBookingData }) => {
  const [passengers, setPassengers] = useState(bookingData.passengers || []);
  const [contactInfo, setContactInfo] = useState(bookingData.contactInfo || {
    name: '',
    email: '',
    phone: '',
    notes: ''
  });
  const [additionalOptions, setAdditionalOptions] = useState({
    luggage: bookingData.luggage || false,
    airportMeet: bookingData.airportMeet || false,
    childSeat: bookingData.childSeat || false
  });

  useEffect(() => {
    // Initialize with the correct number of passengers
    const requiredPassengerCount = bookingData.passengerCount || 1;
    
    if (passengers.length < requiredPassengerCount) {
      const newPassengers = [...passengers];
      for (let i = passengers.length; i < requiredPassengerCount; i++) {
        newPassengers.push({
          id: Date.now() + i,
          firstName: '',
          lastName: '',
          age: '',
          phone: '',
          isChild: false
        });
      }
      setPassengers(newPassengers);
    } else if (passengers.length > requiredPassengerCount) {
      setPassengers(passengers.slice(0, requiredPassengerCount));
    }
  }, [bookingData.passengerCount]);

  useEffect(() => {
    updateBookingData('passengers', passengers);
    updateBookingData('contactInfo', contactInfo);
    updateBookingData('luggage', additionalOptions.luggage);
    updateBookingData('airportMeet', additionalOptions.airportMeet);
    updateBookingData('childSeat', additionalOptions.childSeat);
  }, [passengers, contactInfo, additionalOptions]);

  const updatePassenger = (index, field, value) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index] = {
      ...updatedPassengers[index],
      [field]: value
    };
    setPassengers(updatedPassengers);
  };

  const updateContactInfo = (field, value) => {
    setContactInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleAdditionalOption = (option) => {
    setAdditionalOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  const addPassenger = () => {
    if (passengers.length < 50) {
      setPassengers([...passengers, {
        id: Date.now(),
        firstName: '',
        lastName: '',
        age: '',
        phone: '',
        isChild: false
      }]);
    }
  };

  const removePassenger = (index) => {
    if (passengers.length > 1) {
      setPassengers(passengers.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="space-y-8">
      {/* Contact Information */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          İletişim Bilgileri
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              <User className="w-4 h-4 inline mr-2" />
              Ad Soyad *
            </label>
            <input
              type="text"
              value={contactInfo.name}
              onChange={(e) => updateContactInfo('name', e.target.value)}
              placeholder="Adınızı ve soyadınızı girin"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              <Phone className="w-4 h-4 inline mr-2" />
              Telefon Numarası *
            </label>
            <input
              type="tel"
              value={contactInfo.phone}
              onChange={(e) => updateContactInfo('phone', e.target.value)}
              placeholder="+90 (555) 000 00 00"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              <Mail className="w-4 h-4 inline mr-2" />
              E-posta Adresi
            </label>
            <input
              type="email"
              value={contactInfo.email}
              onChange={(e) => updateContactInfo('email', e.target.value)}
              placeholder="ornek@email.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              <MessageSquare className="w-4 h-4 inline mr-2" />
              Ek Notlar
            </label>
            <textarea
              value={contactInfo.notes}
              onChange={(e) => updateContactInfo('notes', e.target.value)}
              placeholder="Özel istekleriniz veya notlarınız..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Passenger Information */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Yolcu Bilgileri ({passengers.length} kişi)
          </h3>
          <button
            onClick={addPassenger}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Yolcu Ekle
          </button>
        </div>

        <div className="space-y-4">
          {passengers.map((passenger, index) => (
            <motion.div
              key={passenger.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white border border-gray-200 rounded-xl p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium text-gray-900">
                  Yolcu {index + 1}
                </h4>
                {passengers.length > 1 && (
                  <button
                    onClick={() => removePassenger(index)}
                    className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Ad *
                  </label>
                  <input
                    type="text"
                    value={passenger.firstName}
                    onChange={(e) => updatePassenger(index, 'firstName', e.target.value)}
                    placeholder="Ad"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Soyad *
                  </label>
                  <input
                    type="text"
                    value={passenger.lastName}
                    onChange={(e) => updatePassenger(index, 'lastName', e.target.value)}
                    placeholder="Soyad"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Yaş
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="120"
                    value={passenger.age}
                    onChange={(e) => updatePassenger(index, 'age', e.target.value)}
                    placeholder="Yaş"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    value={passenger.phone}
                    onChange={(e) => updatePassenger(index, 'phone', e.target.value)}
                    placeholder="Telefon"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Child indicator */}
              <div className="mt-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={passenger.isChild || parseInt(passenger.age) < 18}
                    onChange={(e) => updatePassenger(index, 'isChild', e.target.checked)}
                    className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Baby className="w-4 h-4 mr-2 text-blue-600" />
                  <span className="text-sm text-gray-700">
                    Bu yolcu 18 yaşından küçük
                  </span>
                </label>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Additional Options */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-6">
          Ek Hizmetler
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={additionalOptions.luggage}
              onChange={() => toggleAdditionalOption('luggage')}
              className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <div className="font-medium text-gray-900">Fazla Bagaj</div>
              <div className="text-sm text-gray-600">
                Standart bagaj limitini aşan bagajlar için
              </div>
            </div>
          </label>

          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={additionalOptions.airportMeet}
              onChange={() => toggleAdditionalOption('airportMeet')}
              className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <div className="font-medium text-gray-900">Havalimanı Karşılama</div>
              <div className="text-sm text-gray-600">
                Şoförün kapıda karşılaması ve yardım etmesi
              </div>
            </div>
          </label>

          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={additionalOptions.childSeat}
              onChange={() => toggleAdditionalOption('childSeat')}
              className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <div className="font-medium text-gray-900">Çocuk Koltuğu</div>
              <div className="text-sm text-gray-600">
                Küçük çocuklar için güvenlik koltuğu
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Summary */}
      {passengers.some(p => p.firstName && p.lastName) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-xl p-6"
        >
          <h4 className="font-semibold text-green-900 mb-4">
            Yolcu Özeti
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-green-700 font-medium mb-2">Yolcular:</p>
              <ul className="text-sm text-gray-700 space-y-1">
                {passengers
                  .filter(p => p.firstName && p.lastName)
                  .map((passenger, index) => (
                    <li key={index} className="flex items-center">
                      <User className="w-3 h-3 mr-2 text-green-600" />
                      {passenger.firstName} {passenger.lastName}
                      {passenger.age && ` (${passenger.age} yaş)`}
                      {passenger.isChild && <Baby className="w-3 h-3 ml-2 text-blue-600" />}
                    </li>
                  ))}
              </ul>
            </div>
            
            <div>
              <p className="text-sm text-green-700 font-medium mb-2">İletişim:</p>
              <div className="text-sm text-gray-700 space-y-1">
                <div className="flex items-center">
                  <User className="w-3 h-3 mr-2 text-green-600" />
                  {contactInfo.name}
                </div>
                <div className="flex items-center">
                  <Phone className="w-3 h-3 mr-2 text-green-600" />
                  {contactInfo.phone}
                </div>
                {contactInfo.email && (
                  <div className="flex items-center">
                    <Mail className="w-3 h-3 mr-2 text-green-600" />
                    {contactInfo.email}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Additional services */}
          {(additionalOptions.luggage || additionalOptions.airportMeet || additionalOptions.childSeat) && (
            <div className="mt-4 pt-4 border-t border-green-200">
              <p className="text-sm text-green-700 font-medium mb-2">Ek Hizmetler:</p>
              <div className="flex flex-wrap gap-2">
                {additionalOptions.luggage && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-lg text-xs">
                    Fazla Bagaj
                  </span>
                )}
                {additionalOptions.airportMeet && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-lg text-xs">
                    Havalimanı Karşılama
                  </span>
                )}
                {additionalOptions.childSeat && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-lg text-xs">
                    Çocuk Koltuğu
                  </span>
                )}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default PassengerDetails;
