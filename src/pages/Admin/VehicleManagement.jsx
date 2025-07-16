import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Car, 
  Users, 
  Plus, 
  Edit3, 
  Trash2, 
  Search,
  Filter,
  Eye,
  Settings
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const VehicleManagement = () => {
  const { state, addVehicle, updateVehicle, deleteVehicle, showNotification } = useApp();
  const { vehicles, drivers } = state;
  
  const [showModal, setShowModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    plateNumber: '',
    capacity: 4,
    vehicleType: 'sedan',
    color: '',
    features: [],
    status: 'active',
    driverId: '',
    dailyRate: 0,
    kmRate: 0,
    fuelType: 'benzin',
    transmission: 'otomatik',
    airConditioning: true,
    gps: true,
    bluetooth: true,
    childSeat: false
  });

  const vehicleTypes = [
    { value: 'sedan', label: 'Sedan' },
    { value: 'suv', label: 'SUV' },
    { value: 'minivan', label: 'Minivan' },
    { value: 'luxury', label: 'Lüks Araç' },
    { value: 'van', label: 'Van' }
  ];

  const fuelTypes = [
    { value: 'benzin', label: 'Benzin' },
    { value: 'dizel', label: 'Dizel' },
    { value: 'hibrit', label: 'Hibrit' },
    { value: 'elektrik', label: 'Elektrik' }
  ];

  const transmissionTypes = [
    { value: 'otomatik', label: 'Otomatik' },
    { value: 'manuel', label: 'Manuel' }
  ];

  useEffect(() => {
    if (editingVehicle) {
      setFormData({ ...editingVehicle });
    } else {
      resetForm();
    }
  }, [editingVehicle]);

  const resetForm = () => {
    setFormData({
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      plateNumber: '',
      capacity: 4,
      vehicleType: 'sedan',
      color: '',
      features: [],
      status: 'active',
      driverId: '',
      dailyRate: 0,
      kmRate: 0,
      fuelType: 'benzin',
      transmission: 'otomatik',
      airConditioning: true,
      gps: true,
      bluetooth: true,
      childSeat: false
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Form validation
      if (!formData.brand || !formData.model || !formData.plateNumber) {
        showNotification('Lütfen tüm zorunlu alanları doldurun', 'error');
        return;
      }

      // Plaka formatı kontrolü (basit)
      const plateRegex = /^[0-9]{2}[A-Z]{1,3}[0-9]{1,4}$/;
      if (!plateRegex.test(formData.plateNumber.replace(/\s/g, ''))) {
        showNotification('Geçerli bir plaka numarası girin (örn: 34ABC1234)', 'error');
        return;
      }

      const vehicleData = {
        ...formData,
        plateNumber: formData.plateNumber.toUpperCase(),
        features: [
          ...(formData.airConditioning ? ['Klima'] : []),
          ...(formData.gps ? ['GPS'] : []),
          ...(formData.bluetooth ? ['Bluetooth'] : []),
          ...(formData.childSeat ? ['Çocuk Koltuğu'] : [])
        ]
      };

      if (editingVehicle) {
        await updateVehicle(editingVehicle.id, vehicleData);
        showNotification('Araç başarıyla güncellendi', 'success');
      } else {
        await addVehicle(vehicleData);
        showNotification('Araç başarıyla eklendi', 'success');
      }

      handleCloseModal();
    } catch (error) {
      console.error('Araç kaydetme hatası:', error);
      showNotification('Araç kaydedilirken bir hata oluştu', 'error');
    }
  };

  const handleDelete = async (vehicleId) => {
    if (window.confirm('Bu aracı silmek istediğinizden emin misiniz?')) {
      try {
        await deleteVehicle(vehicleId);
        showNotification('Araç başarıyla silindi', 'success');
      } catch (error) {
        console.error('Araç silme hatası:', error);
        showNotification('Araç silinirken bir hata oluştu', 'error');
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingVehicle(null);
    resetForm();
  };

  const getDriverName = (driverId) => {
    if (!driverId) return 'Atanmamış';
    const driver = drivers.find(d => d.id === driverId);
    return driver ? `${driver.firstName} ${driver.lastName}` : 'Bilinmeyen';
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = 
      vehicle.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.plateNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || vehicle.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Araç Yönetimi</h1>
          <p className="text-gray-600">Filonuzdaki araçları yönetin</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Yeni Araç
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-body">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Marka, model veya plaka ile ara..."
                  className="input pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                className="input"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Tüm Durumlar</option>
                <option value="active">Aktif</option>
                <option value="maintenance">Bakımda</option>
                <option value="inactive">Pasif</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicles Grid */}
      {filteredVehicles.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-12">
            <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || filterStatus !== 'all' ? 'Araç bulunamadı' : 'Henüz araç yok'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || filterStatus !== 'all' 
                ? 'Arama kriterlerinize uygun araç bulunamadı' 
                : 'İlk aracınızı ekleyerek başlayın'
              }
            </p>
            {!searchTerm && filterStatus === 'all' && (
              <button
                onClick={() => setShowModal(true)}
                className="btn btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                İlk Aracı Ekle
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle, index) => (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card hover:shadow-lg transition-shadow"
            >
              <div className="card-body">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {vehicle.brand} {vehicle.model}
                    </h3>
                    <p className="text-sm text-gray-500">{vehicle.year}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    vehicle.status === 'active' ? 'status-active' :
                    vehicle.status === 'maintenance' ? 'status-warning' :
                    'status-inactive'
                  }`}>
                    {vehicle.status === 'active' ? 'Aktif' :
                     vehicle.status === 'maintenance' ? 'Bakımda' :
                     'Pasif'}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Plaka:</span>
                    <span className="font-medium">{vehicle.plateNumber}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Kapasite:</span>
                    <span className="font-medium">{vehicle.capacity} kişi</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tip:</span>
                    <span className="font-medium">
                      {vehicleTypes.find(t => t.value === vehicle.vehicleType)?.label}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Şoför:</span>
                    <span className="font-medium">{getDriverName(vehicle.driverId)}</span>
                  </div>
                </div>

                {vehicle.features && vehicle.features.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {vehicle.features.slice(0, 3).map((feature, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded"
                        >
                          {feature}
                        </span>
                      ))}
                      {vehicle.features.length > 3 && (
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                          +{vehicle.features.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="text-sm">
                    <span className="text-gray-500">Günlük: </span>
                    <span className="font-medium">₺{vehicle.dailyRate || 0}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingVehicle(vehicle);
                        setShowModal(true);
                      }}
                      className="btn btn-sm btn-outline"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(vehicle.id)}
                      className="btn btn-sm btn-outline text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="modal-content max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3 className="text-lg font-semibold">
                {editingVehicle ? 'Araç Düzenle' : 'Yeni Araç Ekle'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-body space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Basic Info */}
                <div className="space-y-4">
                  <div>
                    <label className="label">Marka *</label>
                    <input
                      type="text"
                      className="input"
                      value={formData.brand}
                      onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <label className="label">Model *</label>
                    <input
                      type="text"
                      className="input"
                      value={formData.model}
                      onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <label className="label">Yıl</label>
                    <input
                      type="number"
                      className="input"
                      min="1990"
                      max={new Date().getFullYear() + 1}
                      value={formData.year}
                      onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                    />
                  </div>

                  <div>
                    <label className="label">Plaka *</label>
                    <input
                      type="text"
                      className="input"
                      placeholder="34ABC1234"
                      value={formData.plateNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, plateNumber: e.target.value.toUpperCase() }))}
                      required
                    />
                  </div>

                  <div>
                    <label className="label">Renk</label>
                    <input
                      type="text"
                      className="input"
                      value={formData.color}
                      onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Specs */}
                <div className="space-y-4">
                  <div>
                    <label className="label">Araç Tipi</label>
                    <select
                      className="input"
                      value={formData.vehicleType}
                      onChange={(e) => setFormData(prev => ({ ...prev, vehicleType: e.target.value }))}
                    >
                      {vehicleTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="label">Kapasite</label>
                    <input
                      type="number"
                      className="input"
                      min="1"
                      max="20"
                      value={formData.capacity}
                      onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) }))}
                    />
                  </div>

                  <div>
                    <label className="label">Yakıt Tipi</label>
                    <select
                      className="input"
                      value={formData.fuelType}
                      onChange={(e) => setFormData(prev => ({ ...prev, fuelType: e.target.value }))}
                    >
                      {fuelTypes.map(fuel => (
                        <option key={fuel.value} value={fuel.value}>
                          {fuel.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="label">Vites</label>
                    <select
                      className="input"
                      value={formData.transmission}
                      onChange={(e) => setFormData(prev => ({ ...prev, transmission: e.target.value }))}
                    >
                      {transmissionTypes.map(trans => (
                        <option key={trans.value} value={trans.value}>
                          {trans.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="label">Atanmış Şoför</label>
                    <select
                      className="input"
                      value={formData.driverId}
                      onChange={(e) => setFormData(prev => ({ ...prev, driverId: e.target.value }))}
                    >
                      <option value="">Şoför seçin</option>
                      {drivers.map(driver => (
                        <option key={driver.id} value={driver.id}>
                          {driver.firstName} {driver.lastName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Günlük Ücret (₺)</label>
                  <input
                    type="number"
                    className="input"
                    min="0"
                    step="0.01"
                    value={formData.dailyRate}
                    onChange={(e) => setFormData(prev => ({ ...prev, dailyRate: parseFloat(e.target.value) || 0 }))}
                  />
                </div>

                <div>
                  <label className="label">KM Başı Ücret (₺)</label>
                  <input
                    type="number"
                    className="input"
                    min="0"
                    step="0.01"
                    value={formData.kmRate}
                    onChange={(e) => setFormData(prev => ({ ...prev, kmRate: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
              </div>

              {/* Features */}
              <div>
                <label className="label">Özellikler</label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="checkbox mr-2"
                      checked={formData.airConditioning}
                      onChange={(e) => setFormData(prev => ({ ...prev, airConditioning: e.target.checked }))}
                    />
                    Klima
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="checkbox mr-2"
                      checked={formData.gps}
                      onChange={(e) => setFormData(prev => ({ ...prev, gps: e.target.checked }))}
                    />
                    GPS
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="checkbox mr-2"
                      checked={formData.bluetooth}
                      onChange={(e) => setFormData(prev => ({ ...prev, bluetooth: e.target.checked }))}
                    />
                    Bluetooth
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="checkbox mr-2"
                      checked={formData.childSeat}
                      onChange={(e) => setFormData(prev => ({ ...prev, childSeat: e.target.checked }))}
                    />
                    Çocuk Koltuğu
                  </label>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="label">Durum</label>
                <select
                  className="input"
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                >
                  <option value="active">Aktif</option>
                  <option value="maintenance">Bakımda</option>
                  <option value="inactive">Pasif</option>
                </select>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="btn btn-outline"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  {editingVehicle ? 'Güncelle' : 'Ekle'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default VehicleManagement;
