import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, ArrowLeft } from 'lucide-react';

const PaymentPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-8">
            <button
              onClick={() => navigate('/müşteri-bilgileri')}
              className="btn btn-outline p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Ödeme</h1>
              <p className="text-gray-600">Ödeme yöntemini seçin</p>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-xl shadow-soft p-8 text-center">
            <CreditCard className="w-16 h-16 text-primary-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Ödeme Sayfası
            </h2>
            <p className="text-gray-600 mb-6">
              Bu sayfa geliştirilme aşamasındadır. Burada ödeme yöntemleri ve PayTR entegrasyonu bulunacaktır.
            </p>
            <button
              onClick={() => navigate('/')}
              className="btn btn-primary"
            >
              Ana Sayfaya Dön
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
