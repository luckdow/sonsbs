import React from 'react';
import { AnimatePresence } from 'framer-motion';

// Import modal components
import { 
  AddReservationModal, 
  EditReservationModal, 
  DriverAssignmentModal 
} from '../../../components/Modals/ReservationModals';
import { QRCodeModal } from '../../../components/QR/QRCodeUtils';

const ReservationModals = ({
  showAddModal,
  showEditModal,
  showDriverModal,
  showQRModal,
  selectedReservation,
  drivers,
  vehicles,
  onAdd,
  onUpdate,
  onAssign,
  onCloseAdd,
  onCloseEdit,
  onCloseDriver,
  onCloseQR
}) => {
  return (
    <AnimatePresence>
      {/* Add Reservation Modal */}
      {showAddModal && (
        <AddReservationModal
          onAdd={onAdd}
          onClose={onCloseAdd}
        />
      )}
      
      {/* Edit Reservation Modal */}
      {showEditModal && selectedReservation && (
        <EditReservationModal
          reservation={selectedReservation}
          onUpdate={onUpdate}
          onClose={onCloseEdit}
        />
      )}
      
      {/* Driver Assignment Modal */}
      {showDriverModal && selectedReservation && (
        <DriverAssignmentModal
          reservation={selectedReservation}
          drivers={drivers}
          vehicles={vehicles}
          onAssign={onAssign}
          onClose={onCloseDriver}
        />
      )}
      
      {/* QR Code Modal */}
      {showQRModal && selectedReservation && (
        <QRCodeModal
          reservation={selectedReservation}
          onClose={onCloseQR}
        />
      )}
    </AnimatePresence>
  );
};

export default ReservationModals;
