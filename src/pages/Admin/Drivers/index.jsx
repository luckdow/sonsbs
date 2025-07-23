import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { collection, onSnapshot, addDoc, updateDoc, doc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { USER_ROLES } from '../../../config/constants';
import DriverTable from './DriverTable';
import AddDriverModal from './AddDriverModal';
import EditDriverModal from './EditDriverModal';
import DriverDetailsModal from './DriverDetailsModal';

const DriverIndex = () => {
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDriver, setSelectedDriver] = useState(null);
  
  // Modal durumları
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Firebase'den verileri dinle
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      try {
        // Users koleksiyonundan role="driver" olanları dinle
        const driversQuery = query(
          collection(db, 'users'),
          where('role', '==', USER_ROLES.DRIVER)
        );
        const unsubscribeDrivers = onSnapshot(
          driversQuery,
          (snapshot) => {
            const driverData = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
              // Eski format ile uyumlu olmak için alan adlarını ayarla
              name: doc.data().firstName && doc.data().lastName 
                ? `${doc.data().firstName} ${doc.data().lastName}`
                : doc.data().name || doc.data().email,
              phone: doc.data().phone || '',
              licenseNumber: doc.data().licenseNumber || 'Belirtilmemiş',
              vehicle: doc.data().assignedVehicle || 'Atanmamış',
              status: doc.data().isActive ? 'active' : 'inactive'
            }));
            setDrivers(driverData);
            setLoading(false);
          },
          (error) => {
            console.error('Şoförler yüklenirken hata:', error);
            setLoading(false);
          }
        );

        // Vehicles koleksiyonunu dinle (sadece aktif araçlar)
        const vehiclesQuery = query(
          collection(db, 'vehicles'),
          where('status', '==', 'active')
        );
        
        const unsubscribeVehicles = onSnapshot(
          vehiclesQuery,
          (snapshot) => {
            const vehicleData = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            setVehicles(vehicleData);
          },
          (error) => {
            console.error('Araçlar yüklenirken hata:', error);
          }
        );

        return () => {
          unsubscribeDrivers();
          unsubscribeVehicles();
        };
      } catch (error) {
        console.error('Firebase başlatma hatası:', error);
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  // Şoför ekleme
  const handleAddDriver = async (driverData) => {
    try {
      const newDriver = {
        ...driverData,
        role: 'driver',
        isActive: true,
        totalTrips: 0,
        joinDate: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      // Firebase'a users koleksiyonuna ekle
      const docRef = await addDoc(collection(db, 'users'), newDriver);
      setShowAddModal(false);
      alert('Şoför başarıyla eklendi!');
    } catch (error) {
      console.error('Şoför eklenirken hata:', error);
      alert('Şoför eklenirken bir hata oluştu: ' + error.message);
    }
  };

  // Şoför güncelleme
  const handleUpdateDriver = async (driverId, updatedData) => {
    try {
      // Users koleksiyonunda güncelle (drivers değil!)
      await updateDoc(doc(db, 'users', driverId), {
        ...updatedData,
        updatedAt: new Date().toISOString()
      });
      
      setShowEditModal(false);
      setSelectedDriver(null);
      alert('Şoför bilgileri başarıyla güncellendi!');
    } catch (error) {
      console.error('Şoför güncellenirken hata:', error);
      alert('Şoför güncellenirken bir hata oluştu: ' + error.message);
    }
  };

  // Şoför silme
  const handleDeleteDriver = async (driverId) => {
    if (window.confirm('Bu şoförü silmek istediğinizden emin misiniz?')) {
      try {
        // Firebase'dan sil (users koleksiyonu)
        await deleteDoc(doc(db, 'users', driverId));
        alert('Şoför başarıyla silindi!');
      } catch (error) {
        console.error('Şoför silinirken hata:', error);
        alert('Şoför silinirken bir hata oluştu: ' + error.message);
      }
    }
  };

  // Durum değiştirme
  const handleStatusChange = async (driverId, newStatus) => {
    try {
      // Users koleksiyonunda güncelle (drivers değil!)
      const isActive = newStatus === 'active';
      await updateDoc(doc(db, 'users', driverId), {
        isActive: isActive,
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('Durum güncellenirken hata:', error);
      alert('Durum güncellenirken bir hata oluştu: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Şoförler yükleniyor...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Şoförler</h1>
          </div>
          <button
            onClick={() => {
              setShowAddModal(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Yeni Şoför Ekle
          </button>
        </div>
      </div>

      {/* Şoför Tablosu */}
      <DriverTable
        drivers={drivers}
        vehicles={vehicles}
        onEdit={(driver) => {
          setSelectedDriver(driver);
          setShowEditModal(true);
        }}
        onDelete={handleDeleteDriver}
        onStatusChange={handleStatusChange}
        onViewDetails={(driver) => {
          setSelectedDriver(driver);
          setShowDetailsModal(true);
        }}
      />

      {/* Modals */}
      <AddDriverModal
        isOpen={showAddModal}
        vehicles={vehicles}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddDriver}
      />

      <EditDriverModal
        isOpen={showEditModal}
        driver={selectedDriver}
        vehicles={vehicles}
        onClose={() => {
          setShowEditModal(false);
          setSelectedDriver(null);
        }}
        onSave={(updatedDriver) => handleUpdateDriver(updatedDriver.id, updatedDriver)}
      />

      <DriverDetailsModal
        isOpen={showDetailsModal}
        driver={selectedDriver}
        vehicles={vehicles}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedDriver(null);
        }}
      />
    </div>
  );
};

export default DriverIndex;
