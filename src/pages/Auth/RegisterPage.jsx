import React from 'react';
import { Link } from 'react-router-dom';
import { Car, UserPlus } from 'lucide-react';

const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
              <Car className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">SBS Transfer</span>
          </Link>
          
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <UserPlus className="w-16 h-16 text-primary-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Kayıt Sayfası
            </h2>
            <p className="text-gray-600 mb-6">
              Müşteri kayıt sistemi rezervasyon sonrası otomatik olarak oluşturulmaktadır.
            </p>
            <div className="space-y-4">
              <Link to="/giriş" className="btn btn-primary w-full">
                Giriş Yapın
              </Link>
              <Link to="/" className="btn btn-outline w-full">
                Ana Sayfaya Dön
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
