import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Car, 
  Users, 
  Calendar, 
  MapPin, 
  Eye, 
  Edit3, 
  Trash2, 
  Settings,
  Star,
  Shield,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreHorizontal
} from 'lucide-react';

const VehicleGrid = ({ 
  vehicles, 
  onShowDetails, 
  onEditVehicle, 
  onDeleteVehicle, 
  onStatusChange,
  onManageFeatures 
}) => {
  const [showDropdown, setShowDropdown] = useState(null);

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { 
        color: 'bg-green-100 text-green-800', 
        icon: CheckCircle, 
        text: 'Aktif' 
      },
      inactive: { 
        color: 'bg-red-100 text-red-800', 
        icon: XCircle, 
        text: 'Pasif' 
      },
      maintenance: { 
        color: 'bg-yellow-100 text-yellow-800', 
        icon: AlertCircle, 
        text: 'Bakımda' 
      }
    };
    const config = statusConfig[status] || statusConfig['inactive'];
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold ${config.color}`}>
        <Icon className="w-4 h-4 mr-1" />
        {config.text}
      </span>
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {vehicles.map((vehicle) => (
        <motion.div
          key={vehicle.id}
          className="bg-gradient-to-br from-white via-blue-50 to-indigo-100 rounded-2xl shadow-xl border border-slate-200 flex flex-col overflow-hidden hover:shadow-2xl transition-all duration-300"
          whileHover={{ scale: 1.02, y: -2 }}
        >
          <div className="h-40 bg-gradient-to-br from-blue-600/10 via-indigo-600/10 to-purple-600/10 flex items-center justify-center">
            <Car className="w-16 h-16 text-blue-500/80 drop-shadow-lg" />
          </div>
          <div className="flex-1 flex flex-col p-5 space-y-2">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-lg font-bold text-slate-800 truncate">{vehicle.brand} {vehicle.model}</h3>
            </div>
            <div className="flex items-center space-x-2 text-sm text-slate-500">
              <span className="font-semibold text-blue-600">{vehicle.plate}</span>
              <span>•</span>
              <span className="capitalize">{vehicle.type}</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <span>Kapasite:</span>
              <span className="font-semibold text-slate-700">{vehicle.capacity}</span>
            </div>
            <div className="flex-1" />
            <div className="flex space-x-2 mt-3">
              <button
                onClick={() => onEditVehicle(vehicle)}
                className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all text-sm font-semibold shadow-lg"
              >
                Düzenle
              </button>
              <button
                onClick={() => onDeleteVehicle(vehicle)}
                className="flex-1 px-3 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all text-sm font-semibold shadow-lg"
              >
                Sil
              </button>
            </div>
          </div>
        </motion.div>
      ))}

    </div>
  );
};

export default VehicleGrid;
