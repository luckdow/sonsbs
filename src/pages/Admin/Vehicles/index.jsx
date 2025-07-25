import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw, Car } from 'lucide-react';
import { collection, onSnapshot, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import VehicleTable from './VehicleTable';
import AddVehicleModal from './AddVehicleModal';
import EditVehicleModal from './EditVehicleModal';
import VehicleDetailsModal from './VehicleDetailsModal';
import VehicleFeaturesModal from './VehicleFeaturesModal';

const VehicleIndex = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  
  // Modal durumları
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showFeaturesModal, setShowFeaturesModal] = useState(false);

  // Firebase'den araç verilerini dinle
  useEffect(() => {
    setLoading(true);
    
    const unsubscribeVehicles = onSnapshot(
      collection(db, 'vehicles'),
      (snapshot) => {
        const vehicleData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setVehicles(vehicleData);
        setLoading(false);
      },
      (error) => {
        setLoading(false);
      }
    );

    return () => unsubscribeVehicles();
  }, []);

  // Araç ekleme
  const handleAddVehicle = async (vehicleData) => {
    try {
      const newVehicle = {
        ...vehicleData,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'active'
      };
      
      await addDoc(collection(db, 'vehicles'), newVehicle);
      setShowAddModal(false);
      return true;
    } catch (error) {
      return false;
    }
  };

  // Araç güncelleme
  const handleUpdateVehicle = async (vehicleId, vehicleData) => {
    try {
      const updatedVehicle = {
        ...vehicleData,
        updatedAt: new Date()
      };
      
      await updateDoc(doc(db, 'vehicles', vehicleId), updatedVehicle);
      setShowEditModal(false);
      setSelectedVehicle(null);
      return true;
    } catch (error) {
      return false;
    }
  };

  // Araç silme
  const handleDeleteVehicle = async (vehicleId) => {
    try {
      await deleteDoc(doc(db, 'vehicles', vehicleId));
      return true;
    } catch (error) {
      return false;
    }
  };

  // Araç detayları göster
  const handleShowDetails = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowDetailsModal(true);
  };

  // Araç düzenle
  const handleEditVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowEditModal(true);
  };

  // Araç özellikleri yönet
  const handleManageFeatures = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowFeaturesModal(true);
  };

  // Durum değiştirme
  const handleStatusChange = async (vehicleId, newStatus) => {
    try {
      await updateDoc(doc(db, 'vehicles', vehicleId), { 
        status: newStatus, 
        updatedAt: new Date() 
      });
      return true;
    } catch (error) {
      return false;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Araçlar yükleniyor...</span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Car className="w-7 h-7 text-blue-600" />
            Araç Yönetimi
          </h1>
          <p className="text-gray-600 mt-1">
            {vehicles.length} araç kayıtlı
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Yeni Araç Ekle
        </button>
      </div>

      {/* Araç Listesi */}
      <VehicleTable
        vehicles={vehicles}
        onShowDetails={handleShowDetails}
        onEditVehicle={handleEditVehicle}
        onDeleteVehicle={handleDeleteVehicle}
        onStatusChange={handleStatusChange}
        onManageFeatures={handleManageFeatures}
      />

      {/* Modaller */}
      {showAddModal && (
        <AddVehicleModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddVehicle}
        />
      )}

      {showEditModal && selectedVehicle && (
        <EditVehicleModal
          vehicle={selectedVehicle}
          onClose={() => {
            setShowEditModal(false);
            setSelectedVehicle(null);
          }}
          onSubmit={handleUpdateVehicle}
        />
      )}

      {showDetailsModal && selectedVehicle && (
        <VehicleDetailsModal
          vehicle={selectedVehicle}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedVehicle(null);
          }}
        />
      )}

      {showFeaturesModal && selectedVehicle && (
        <VehicleFeaturesModal
          vehicle={selectedVehicle}
          onClose={() => {
            setShowFeaturesModal(false);
            setSelectedVehicle(null);
          }}
          onUpdate={handleUpdateVehicle}
        />
      )}
    </div>
  );
};

export default VehicleIndex;
