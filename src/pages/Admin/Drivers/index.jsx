import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw, Users } from 'lucide-react';
import { collection, onSnapshot, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { initializeFirebaseData } from '../../../utils/initializeFirebaseData';
import DriverTable from './DriverTable';
import DriverFilters from './DriverFilters';
import AddDriverModal from './AddDriverModal';
import EditDriverModal from './EditDriverModal';
import DriverDetailsModal from './DriverDetailsModal';

const DriverIndex = () => {
  const [drivers, setDrivers] = useState([]);
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDriver, setSelectedDriver] = useState(null);
  
  // Filtreleme state'leri
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [vehicleFilter, setVehicleFilter] = useState('all');
  const [licenseExpiryFilter, setLicenseExpiryFilter] = useState('all');
  
  // Modal durumları
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Firebase'den verileri dinle
  useEffect(() => {
    const initializeData = async () => {
      console.log('Firebase initialize başlatılıyor...');
      setLoading(true);
      
      try {
        // Firebase'a demo verilerini ekle (eğer yoksa)
        await initializeFirebaseData();
        console.log('Firebase başlangıç verileri hazırlandı');
        
        // Drivers koleksiyonunu dinle
        const unsubscribeDrivers = onSnapshot(
          collection(db, 'drivers'),
          (snapshot) => {
            console.log('Drivers koleksiyonu güncellendi, döküman sayısı:', snapshot.docs.length);
            const driverData = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            setDrivers(driverData);
            setLoading(false);
          },
          (error) => {
            console.error('Şoförler yüklenirken hata:', error);
            setLoading(false);
          }
        );

        // Vehicles koleksiyonunu dinle
        const unsubscribeVehicles = onSnapshot(
          collection(db, 'vehicles'),
          (snapshot) => {
            console.log('Vehicles koleksiyonu güncellendi, döküman sayısı:', snapshot.docs.length);
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

  // Filtreleme fonksiyonu
  const applyFilters = () => {
    if (!drivers || drivers.length === 0) {
      setFilteredDrivers([]);
      return;
    }
    
    let filtered = [...drivers];

    // Arama filtresi
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      filtered = filtered.filter(driver => 
        (driver.firstName || '').toLowerCase().includes(searchTermLower) ||
        (driver.lastName || '').toLowerCase().includes(searchTermLower) ||
        (driver.phone || '').includes(searchTerm) ||
        (driver.email || '').toLowerCase().includes(searchTermLower) ||
        (driver.licenseNumber || '').includes(searchTerm)
      );
    }

    // Durum filtresi
    if (statusFilter !== 'all') {
      filtered = filtered.filter(driver => driver.status === statusFilter);
    }

    // Araç atama filtresi
    if (vehicleFilter !== 'all') {
      if (vehicleFilter === 'assigned') {
        filtered = filtered.filter(driver => driver.assignedVehicle);
      } else if (vehicleFilter === 'unassigned') {
        filtered = filtered.filter(driver => !driver.assignedVehicle);
      }
    }

    // Lisans süresi filtresi
    if (licenseExpiryFilter !== 'all') {
      const today = new Date();
      const oneMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
      const threeMonths = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000);
      
      filtered = filtered.filter(driver => {
        const expiryDate = new Date(driver.licenseExpiry);
        
        switch (licenseExpiryFilter) {
          case 'expired':
            return expiryDate < today;
          case 'expiring':
            return expiryDate >= today && expiryDate <= oneMonth;
          case 'valid':
            return expiryDate > oneMonth;
          default:
            return true;
        }
      });
    }

    setFilteredDrivers(filtered);
  };

  // Filtreler değiştiğinde filtreleme uygula
  useEffect(() => {
    applyFilters();
  }, [drivers, searchTerm, statusFilter, vehicleFilter, licenseExpiryFilter]);

  // Şoför ekleme
  const handleAddDriver = async (driverData) => {
    console.log('Şoför ekleme başlatılıyor:', driverData);
    try {
      const newDriver = {
        ...driverData,
        totalTrips: 0,
        joinDate: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      console.log('Firebase\'a eklenecek veri:', newDriver);
      
      // Firebase'a ekle
      const docRef = await addDoc(collection(db, 'drivers'), newDriver);
      console.log('Yeni şoför eklendi, ID:', docRef.id);
      
      setShowAddModal(false);
      alert('Şoför başarıyla eklendi!');
    } catch (error) {
      console.error('Şoför eklenirken hata:', error);
      alert('Şoför eklenirken bir hata oluştu: ' + error.message);
    }
  };

  // Şoför güncelleme
  const handleUpdateDriver = async (driverId, updatedData) => {
    console.log('Şoför güncelleme başlatılıyor:', driverId, updatedData);
    try {
      // Firebase'da güncelle
      await updateDoc(doc(db, 'drivers', driverId), {
        ...updatedData,
        updatedAt: new Date().toISOString()
      });
      
      console.log('Şoför güncellendi:', driverId);
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
        // Firebase'dan sil
        await deleteDoc(doc(db, 'drivers', driverId));
        
        console.log('Şoför silindi:', driverId);
        alert('Şoför başarıyla silindi!');
      } catch (error) {
        console.error('Şoför silinirken hata:', error);
        alert('Şoför silinirken bir hata oluştu: ' + error.message);
      }
    }
  };

  // Durum değiştirme
  const handleStatusChange = async (driverId, newStatus) => {
    console.log('Durum değiştirme başlatılıyor:', driverId, newStatus);
    try {
      // Firebase'da güncelle
      await updateDoc(doc(db, 'drivers', driverId), {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
      
      console.log('Şoför durumu güncellendi:', driverId, newStatus);
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Şoför Yönetimi</h1>
            <p className="text-gray-600 mt-1">
              Toplam {drivers.length} şoför • Filtrelenmiş {filteredDrivers.length} şoför
            </p>
          </div>
          <button
            onClick={() => {
              console.log('Yeni Şoför Ekle butonuna tıklandı');
              setShowAddModal(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Yeni Şoför Ekle
          </button>
        </div>
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { 
            label: 'Aktif Şoförler', 
            value: drivers.filter(d => d.status === 'active').length,
            color: 'text-green-600',
            bg: 'bg-green-100'
          },
          { 
            label: 'Pasif Şoförler', 
            value: drivers.filter(d => d.status === 'inactive').length,
            color: 'text-red-600',
            bg: 'bg-red-100'
          },
          { 
            label: 'Araç Atanmış', 
            value: drivers.filter(d => d.assignedVehicle).length,
            color: 'text-blue-600',
            bg: 'bg-blue-100'
          },
          { 
            label: 'Araç Bekleyen', 
            value: drivers.filter(d => !d.assignedVehicle).length,
            color: 'text-yellow-600',
            bg: 'bg-yellow-100'
          }
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <Users className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-lg font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filtreleme */}
      <DriverFilters 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        vehicleFilter={vehicleFilter}
        setVehicleFilter={setVehicleFilter}
        licenseExpiryFilter={licenseExpiryFilter}
        setLicenseExpiryFilter={setLicenseExpiryFilter}
        onClearFilters={() => {
          setSearchTerm('');
          setStatusFilter('all');
          setVehicleFilter('all');
          setLicenseExpiryFilter('all');
        }}
        vehicles={vehicles}
      />

      {/* Şoför Tablosu */}
      <DriverTable
        drivers={filteredDrivers}
        vehicles={vehicles}
        onEdit={(driver) => {
          console.log('Şoför düzenleme başlatılıyor:', driver);
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
