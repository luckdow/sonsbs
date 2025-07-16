import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { X } from 'lucide-react';

const Modal = () => {
  const { state, actions } = useApp();
  const { modal } = state;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      actions.hideModal();
    }
  };

  return (
    <AnimatePresence>
      {modal.isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                {getModalTitle(modal.type)}
              </h2>
              <button
                onClick={actions.hideModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto">
              {renderModalContent(modal.type, modal.data, actions)}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const getModalTitle = (type) => {
  switch (type) {
    case 'confirm-delete':
      return 'Silme Onayı';
    case 'qr-scanner':
      return 'QR Kod Okut';
    case 'bank-details':
      return 'Banka Hesap Bilgileri';
    case 'trip-details':
      return 'Yolculuk Detayları';
    case 'customer-info':
      return 'Müşteri Bilgileri';
    case 'driver-assignment':
      return 'Şoför Atama';
    default:
      return 'Bilgi';
  }
};

const renderModalContent = (type, data, actions) => {
  switch (type) {
    case 'confirm-delete':
      return (
        <ConfirmDeleteModal 
          data={data} 
          onConfirm={() => {
            data.onConfirm();
            actions.hideModal();
          }}
          onCancel={actions.hideModal}
        />
      );

    case 'bank-details':
      return <BankDetailsModal data={data} />;

    case 'trip-details':
      return <TripDetailsModal data={data} />;

    case 'customer-info':
      return <CustomerInfoModal data={data} />;

    case 'driver-assignment':
      return (
        <DriverAssignmentModal 
          data={data}
          onAssign={(driverId) => {
            data.onAssign(driverId);
            actions.hideModal();
          }}
          onCancel={actions.hideModal}
        />
      );

    default:
      return (
        <div className="text-center py-8">
          <p className="text-gray-600">Modal içeriği bulunamadı</p>
        </div>
      );
  }
};

// Modal Components
const ConfirmDeleteModal = ({ data, onConfirm, onCancel }) => (
  <div className="text-center">
    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
      <X className="h-6 w-6 text-red-600" />
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">
      {data.title || 'Silmek istediğinizden emin misiniz?'}
    </h3>
    <p className="text-sm text-gray-500 mb-6">
      {data.message || 'Bu işlem geri alınamaz.'}
    </p>
    <div className="flex space-x-3">
      <button
        onClick={onCancel}
        className="flex-1 btn btn-outline"
      >
        İptal
      </button>
      <button
        onClick={onConfirm}
        className="flex-1 btn btn-danger"
      >
        Sil
      </button>
    </div>
  </div>
);

const BankDetailsModal = ({ data }) => (
  <div className="space-y-4">
    <div className="bg-blue-50 p-4 rounded-lg">
      <h4 className="font-medium text-blue-900 mb-2">Havale/EFT Bilgileri</h4>
      <div className="space-y-2 text-sm text-blue-800">
        <div>
          <span className="font-medium">Banka:</span> {data.bankName}
        </div>
        <div>
          <span className="font-medium">Hesap Sahibi:</span> {data.accountHolder}
        </div>
        <div>
          <span className="font-medium">IBAN:</span> {data.iban}
        </div>
        <div>
          <span className="font-medium">Açıklama:</span> {data.description}
        </div>
      </div>
    </div>
    <p className="text-xs text-gray-600">
      Ödeme işleminizi tamamladıktan sonra dekont görselini WhatsApp üzerinden iletiniz.
    </p>
  </div>
);

const TripDetailsModal = ({ data }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-4 text-sm">
      <div>
        <span className="font-medium text-gray-700">Rezervasyon No:</span>
        <p className="text-gray-900">{data.reservationId}</p>
      </div>
      <div>
        <span className="font-medium text-gray-700">Tarih:</span>
        <p className="text-gray-900">{data.date}</p>
      </div>
      <div>
        <span className="font-medium text-gray-700">Saat:</span>
        <p className="text-gray-900">{data.time}</p>
      </div>
      <div>
        <span className="font-medium text-gray-700">Yolcu Sayısı:</span>
        <p className="text-gray-900">{data.passengerCount}</p>
      </div>
      <div className="col-span-2">
        <span className="font-medium text-gray-700">Güzergah:</span>
        <p className="text-gray-900">{data.route}</p>
      </div>
      <div className="col-span-2">
        <span className="font-medium text-gray-700">Araç:</span>
        <p className="text-gray-900">{data.vehicle}</p>
      </div>
    </div>
  </div>
);

const CustomerInfoModal = ({ data }) => (
  <div className="space-y-4">
    <div className="text-center">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
        <span className="text-blue-600 font-semibold text-lg">
          {data.firstName?.[0]}{data.lastName?.[0]}
        </span>
      </div>
      <h3 className="text-lg font-medium text-gray-900">
        {data.firstName} {data.lastName}
      </h3>
    </div>
    
    <div className="space-y-3 text-sm">
      <div>
        <span className="font-medium text-gray-700">E-posta:</span>
        <p className="text-gray-900">{data.email}</p>
      </div>
      <div>
        <span className="font-medium text-gray-700">Telefon:</span>
        <p className="text-gray-900">{data.phone}</p>
      </div>
      {data.flightNumber && (
        <div>
          <span className="font-medium text-gray-700">Uçuş Numarası:</span>
          <p className="text-gray-900">{data.flightNumber}</p>
        </div>
      )}
    </div>
  </div>
);

const DriverAssignmentModal = ({ data, onAssign, onCancel }) => {
  const [selectedDriver, setSelectedDriver] = React.useState('');

  return (
    <div className="space-y-4">
      <div>
        <label className="form-label">Şoför Seçin</label>
        <select
          value={selectedDriver}
          onChange={(e) => setSelectedDriver(e.target.value)}
          className="form-input"
        >
          <option value="">Şoför seçin...</option>
          {data.drivers?.map((driver) => (
            <option key={driver.id} value={driver.id}>
              {driver.firstName} {driver.lastName} - {driver.vehicle?.model || 'Araç atanmamış'}
            </option>
          ))}
        </select>
      </div>
      
      <div className="flex space-x-3">
        <button
          onClick={onCancel}
          className="flex-1 btn btn-outline"
        >
          İptal
        </button>
        <button
          onClick={() => onAssign(selectedDriver)}
          disabled={!selectedDriver}
          className="flex-1 btn btn-primary"
        >
          Ata
        </button>
      </div>
    </div>
  );
};

export default Modal;
