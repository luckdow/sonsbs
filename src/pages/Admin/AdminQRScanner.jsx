import React from 'react';
import QRScanner from '../Driver/QRScanner';

const AdminQRScanner = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manuel Şoför QR Tarayıcı</h1>
        <p className="text-gray-600 mt-2">
          Manuel şoförler için rezervasyon QR kodlarını okutarak yolculukları yönetin
        </p>
      </div>
      
      <QRScanner />
    </div>
  );
};

export default AdminQRScanner;
