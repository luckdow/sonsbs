import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';

// Import steps
import RouteStep from './steps/RouteStep';
import PersonalStep from './steps/PersonalStep';
import PaymentStep from './steps/PaymentStep';

const BookingWizard = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [bookingData, setBookingData] = useState({
    // Route data
    tripType: 'one-way',
    pickupLocation: null,
    dropoffLocation: null,
    date: '',
    time: '',
    returnDate: '',
    returnTime: '',
    passengerCount: 1,
    baggageCount: 1,
    selectedVehicle: null,
    routeInfo: null,
    totalPrice: 0,
    
    // Personal data
    personalInfo: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      address: '',
      flightNumber: '',
      flightTime: '',
      specialRequests: ''
    },
    
    // Payment data
    paymentMethod: 'credit_card',
    creditCardInfo: null,
    
    // Terms
    acceptedTerms: false
  });

  const steps = [
    { id: 1, name: 'Güzergah', component: RouteStep },
    { id: 2, name: 'Bilgiler', component: PersonalStep },
    { id: 3, name: 'Ödeme', component: PaymentStep }
  ];

  const updateBookingData = (newData) => {
    setBookingData(prev => ({
      ...prev,
      ...newData
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    
    try {
      // Generate reservation ID
      const reservationId = `RES${Date.now()}`;
      
      // Prepare reservation data for confirmation page
      const reservationData = {
        ...bookingData,
        id: reservationId,
        status: 'confirmed'
      };

      // Navigate to confirmation page with booking data
      // Actual Firebase save will happen in BookingConfirmationPage
      navigate('/booking-confirmation', {
        state: {
          bookingData: reservationData
        }
      });
    } catch (error) {
      console.error('Error preparing reservation:', error);
      alert('Rezervasyon hazırlanırken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  // Get current step component
  const CurrentStepComponent = steps[currentStep - 1]?.component;

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Ana Sayfa</span>
            </button>
            
            <h1 className="text-xl font-bold text-gray-900">Transfer Rezervasyonu</h1>
            
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center space-x-2 md:space-x-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                {/* Step Circle */}
                <div className={`
                  flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full text-sm md:text-base font-medium transition-colors
                  ${currentStep > step.id 
                    ? 'bg-green-600 text-white' 
                    : currentStep === step.id 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }
                `}>
                  {currentStep > step.id ? (
                    <Check className="w-4 h-4 md:w-5 md:h-5" />
                  ) : (
                    step.id
                  )}
                </div>
                
                {/* Step Name */}
                <span className={`
                  ml-2 text-xs md:text-sm font-medium hidden sm:inline
                  ${currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'}
                `}>
                  {step.name}
                </span>
                
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className={`
                    hidden md:block w-12 lg:w-24 h-0.5 ml-4 transition-colors
                    ${currentStep > step.id ? 'bg-green-600' : 'bg-gray-200'}
                  `} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          {CurrentStepComponent && (
            <CurrentStepComponent
              bookingData={bookingData}
              updateBookingData={updateBookingData}
              onNext={handleNext}
              onBack={handleBack}
              onComplete={handleComplete}
              isLoading={isLoading}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default BookingWizard;
