import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ArrowLeft } from 'lucide-react';

const CustomerInfoPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-8">
            <button
              onClick={() => navigate('/araç-seçimi')}
              className="btn btn-outline p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Müşteri Bilgileri</h1>
              <p className="text-gray-600">Kişisel bilgilerinizi girin</p>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-xl shadow-soft p-8 text-center">
            <User className="w-16 h-16 text-primary-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Müşteri Bilgileri Sayfası
            </h2>
            <p className="text-gray-600 mb-6">
              Bu sayfa geliştirilme aşamasındadır. Burada müşteri bilgileri formu bulunacaktır.
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

export default CustomerInfoPage;
