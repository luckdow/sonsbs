import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw, Car, Settings, Grid, List } from 'lucide-react';
import { collection, onSnapshot, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import VehicleTable from './VehicleTable';
import VehicleGrid from './VehicleGrid';
import VehicleFilters from './VehicleFilters';
import AddVehicleModal from './AddVehicleModal';
import EditVehicleModal from './EditVehicleModal';
import VehicleDetailsModal from './VehicleDetailsModal';
import VehicleFeaturesModal from './VehicleFeaturesModal';

const VehicleIndex = () => {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  
  // Filtreleme state'leri
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [capacityFilter, setCapacityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  
  // Modal durumları
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showFeaturesModal, setShowFeaturesModal] = useState(false);

  // Firebase'den araç verilerini dinle
  useEffect(() => {
    console.log('Araç verileri yükleniyor...');
    setLoading(true);
    
    const unsubscribeVehicles = onSnapshot(
      collection(db, 'vehicles'),
      (snapshot) => {
        console.log('Vehicles koleksiyonu güncellendi, döküman sayısı:', snapshot.docs.length);
        const vehicleData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setVehicles(vehicleData);
        setFilteredVehicles(vehicleData);
        setLoading(false);
      },
      (error) => {
        console.error('Araç verileri yüklenirken hata:', error);
        setLoading(false);
      }
    );

    return () => unsubscribeVehicles();
  }, []);

  // Filtreleme işlemleri
  useEffect(() => {
    let filtered = vehicles;

    // Arama filtresi
    if (searchTerm) {
      filtered = filtered.filter(vehicle => 
        vehicle.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.plateNumber?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Durum filtresi
    if (statusFilter !== 'all') {
      filtered = filtered.filter(vehicle => vehicle.status === statusFilter);
    }

    // Kapasite filtresi
    if (capacityFilter !== 'all') {
      const capacity = parseInt(capacityFilter);
      filtered = filtered.filter(vehicle => vehicle.capacity >= capacity);
    }

    // Tip filtresi
    if (typeFilter !== 'all') {
      filtered = filtered.filter(vehicle => vehicle.type === typeFilter);
    }

    setFilteredVehicles(filtered);
  }, [vehicles, searchTerm, statusFilter, capacityFilter, typeFilter]);

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
      console.log('Araç başarıyla eklendi');
      setShowAddModal(false);
      return true;
    } catch (error) {
      console.error('Araç eklenirken hata:', error);
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
      console.log('Araç başarıyla güncellendi');
      setShowEditModal(false);
      setSelectedVehicle(null);
      return true;
    } catch (error) {
      console.error('Araç güncellenirken hata:', error);
      return false;
    }
  };

  // Araç silme
  const handleDeleteVehicle = async (vehicleId) => {
    try {
      await deleteDoc(doc(db, 'vehicles', vehicleId));
      console.log('Araç başarıyla silindi');
      return true;
    } catch (error) {
      console.error('Araç silinirken hata:', error);
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
      console.log('Araç durumu güncellendi');
      return true;
    } catch (error) {
      console.error('Araç durumu güncellenirken hata:', error);
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
            {vehicles.length} araç kayıtlı • {filteredVehicles.length} gösteriliyor
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

      {/* Filtreler */}
      <VehicleFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        capacityFilter={capacityFilter}
        setCapacityFilter={setCapacityFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
      />

      {/* Görünüm Değiştirme */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Car className="w-5 h-5 text-gray-500" />
            <span className="text-sm text-gray-600">Görünüm</span>
          </div>
          <div className="flex rounded-lg border border-gray-200 p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-2 px-3 py-1 rounded text-sm transition-colors ${
                viewMode === 'table' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <List className="w-4 h-4" />
              Tablo
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-2 px-3 py-1 rounded text-sm transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Grid className="w-4 h-4" />
              Kart
            </button>
          </div>
        </div>
      </div>

      {/* Araç Listesi */}
      {viewMode === 'table' ? (
        <VehicleTable
          vehicles={filteredVehicles}
          onShowDetails={handleShowDetails}
          onEditVehicle={handleEditVehicle}
          onDeleteVehicle={handleDeleteVehicle}
          onStatusChange={handleStatusChange}
          onManageFeatures={handleManageFeatures}
        />
      ) : (
        <VehicleGrid
          vehicles={filteredVehicles}
          onShowDetails={handleShowDetails}
          onEditVehicle={handleEditVehicle}
          onDeleteVehicle={handleDeleteVehicle}
          onStatusChange={handleStatusChange}
          onManageFeatures={handleManageFeatures}
        />
      )}

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
