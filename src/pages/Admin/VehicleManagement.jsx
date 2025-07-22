import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Car, 
  Plus, 
  Edit3, 
  Trash2, 
  Search,
  X,
  Users,
  Fuel,
  CheckCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import toast from 'react-hot-toast';

const VehicleManagement = () => {
  const { state, addVehicle, updateVehicle, deleteVehicle } = useApp();
  const { vehicles = [] } = state;
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    plateNumber: '',
    capacity: '',
    kmRate: '',
    color: '',
    status: 'active',
    fuelType: 'benzin',
    transmission: 'otomatik'
  });

  const resetForm = () => {
    setFormData({
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      plateNumber: '',
      capacity: '',
      kmRate: '',
      color: '',
      status: 'active',
      fuelType: 'benzin',
      transmission: 'otomatik'
    });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.brand.trim()) errors.brand = 'Marka gerekli';
    if (!formData.model.trim()) errors.model = 'Model gerekli';
    if (!formData.plateNumber.trim()) errors.plateNumber = 'Plaka gerekli';
    if (!formData.capacity || formData.capacity < 1) errors.capacity = 'Geçerli kapasite gerekli';
    if (!formData.kmRate || formData.kmRate < 0) errors.kmRate = 'KM başı ücret gerekli';
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach(error => toast.error(error));
      return;
    }

    setIsSubmitting(true);

    try {
      const vehicleData = {
        ...formData,
        capacity: parseInt(formData.capacity),
        kmRate: parseFloat(formData.kmRate),
        year: parseInt(formData.year),
        createdAt: editingVehicle ? editingVehicle.createdAt : new Date(),
        updatedAt: new Date()
      };

      if (editingVehicle) {
        await updateVehicle(editingVehicle.id, vehicleData);
        toast.success('Araç başarıyla güncellendi!');
      } else {
        await addVehicle(vehicleData);
        toast.success('Araç başarıyla eklendi!');
      }

      handleCloseModal();
    } catch (error) {
      console.error('Vehicle operation error:', error);
      toast.error('İşlem sırasında bir hata oluştu');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      brand: vehicle.brand || '',
      model: vehicle.model || '',
      year: vehicle.year || new Date().getFullYear(),
      plateNumber: vehicle.plateNumber || '',
      capacity: vehicle.capacity || '',
      kmRate: vehicle.kmRate || '',
      color: vehicle.color || '',
      status: vehicle.status || 'active',
      fuelType: vehicle.fuelType || 'benzin',
      transmission: vehicle.transmission || 'otomatik'
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu aracı silmek istediğinizden emin misiniz?')) {
      try {
        await deleteVehicle(id);
        toast.success('Araç başarıyla silindi!');
      } catch (error) {
        console.error('Delete error:', error);
        toast.error('Araç silinirken hata oluştu');
      }
    }
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingVehicle(null);
    resetForm();
  };

  const handleAddNew = () => {
    setEditingVehicle(null);
    resetForm();
    setShowAddModal(true);
  };

  // Filter vehicles based on search term
  const filteredVehicles = vehicles.filter(vehicle => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      (vehicle.brand || '').toLowerCase().includes(searchLower) ||
      (vehicle.model || '').toLowerCase().includes(searchLower) ||
      (vehicle.plateNumber || '').toLowerCase().includes(searchLower)
    );
  });

  const statusTypes = [
    { value: 'active', label: 'Aktif', color: 'text-green-600 bg-green-100' },
    { value: 'maintenance', label: 'Bakımda', color: 'text-yellow-600 bg-yellow-100' },
    { value: 'inactive', label: 'Pasif', color: 'text-red-600 bg-red-100' }
  ];

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Content Area */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddNew}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Yeni Araç Ekle
          </motion.button>
        </div>
        {/* Search */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Marka, model veya plaka ile ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

        {/* Vehicles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredVehicles.map((vehicle, index) => {
              const statusConfig = statusTypes.find(s => s.value === vehicle.status);
              
              return (
                <motion.div
                  key={vehicle.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
                >
                  {/* Vehicle Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                        <Car className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">
                          {vehicle.brand} {vehicle.model}
                        </h3>
                        <p className="text-sm text-gray-500">{vehicle.year}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig?.color || 'text-gray-600 bg-gray-100'}`}>
                      {statusConfig?.label || 'Bilinmiyor'}
                    </span>
                  </div>

                  {/* Vehicle Info */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Plaka</span>
                      <span className="font-semibold text-gray-900">{vehicle.plateNumber}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Kapasite</span>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="font-semibold text-gray-900">{vehicle.capacity} kişi</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">KM Ücreti</span>
                      <span className="font-semibold text-gray-900">€{vehicle.kmRate}/km</span>
                    </div>
                    {vehicle.color && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Renk</span>
                        <span className="font-semibold text-gray-900">{vehicle.color}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEdit(vehicle)}
                      className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Düzenle</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(vehicle.id)}
                      className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Sil</span>
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredVehicles.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Car className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm ? 'Araç bulunamadı' : 'Henüz araç eklenmemiş'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm 
                ? 'Arama kriterlerinizi değiştirerek tekrar deneyin'
                : 'İlk aracınızı ekleyerek başlayın'
              }
            </p>
            {!searchTerm && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                İlk Aracı Ekle
              </motion.button>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingVehicle ? 'Araç Düzenle' : 'Yeni Araç Ekle'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Brand and Model */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Marka *
                    </label>
                    <input
                      type="text"
                      value={formData.brand}
                      onChange={(e) => handleInputChange('brand', e.target.value)}
                      placeholder="Örn: Mercedes"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Model *
                    </label>
                    <input
                      type="text"
                      value={formData.model}
                      onChange={(e) => handleInputChange('model', e.target.value)}
                      placeholder="Örn: Vito"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Year and Plate */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Yıl
                    </label>
                    <input
                      type="number"
                      value={formData.year}
                      onChange={(e) => handleInputChange('year', e.target.value)}
                      min="1990"
                      max={new Date().getFullYear() + 1}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Plaka *
                    </label>
                    <input
                      type="text"
                      value={formData.plateNumber}
                      onChange={(e) => handleInputChange('plateNumber', e.target.value.toUpperCase())}
                      placeholder="Örn: 34 ABC 123"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Capacity and KM Rate */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Kapasite *
                    </label>
                    <input
                      type="number"
                      value={formData.capacity}
                      onChange={(e) => handleInputChange('capacity', e.target.value)}
                      placeholder="Örn: 8"
                      min="1"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      KM Başı Ücret (€) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.kmRate}
                      onChange={(e) => handleInputChange('kmRate', e.target.value)}
                      placeholder="Örn: 12.50"
                      min="0"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Color and Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Renk
                    </label>
                    <input
                      type="text"
                      value={formData.color}
                      onChange={(e) => handleInputChange('color', e.target.value)}
                      placeholder="Örn: Beyaz"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Durum
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      {statusTypes.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Fuel Type and Transmission */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Yakıt Türü
                    </label>
                    <select
                      value={formData.fuelType}
                      onChange={(e) => handleInputChange('fuelType', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="benzin">Benzin</option>
                      <option value="dizel">Dizel</option>
                      <option value="lpg">LPG</option>
                      <option value="elektrik">Elektrik</option>
                      <option value="hibrit">Hibrit</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Vites Türü
                    </label>
                    <select
                      value={formData.transmission}
                      onChange={(e) => handleInputChange('transmission', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="otomatik">Otomatik</option>
                      <option value="manuel">Manuel</option>
                    </select>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6 border-t border-gray-200">
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>İşleniyor...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        <span>{editingVehicle ? 'Güncelle' : 'Araç Ekle'}</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VehicleManagement;
