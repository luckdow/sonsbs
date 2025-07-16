import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const ConfirmationPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          {/* Content */}
          <div className="bg-white rounded-xl shadow-soft p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Rezervasyon Onayı
            </h2>
            <p className="text-gray-600 mb-6">
              Bu sayfa geliştirilme aşamasındadır. Burada rezervasyon onayı, QR kod ve giriş bilgileri gösterilecektir.
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

export default ConfirmationPage;
