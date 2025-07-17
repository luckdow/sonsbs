import React from 'react';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  CreditCard,
  DollarSign,
  Ban
} from 'lucide-react';

// Status Badge Component
export const StatusBadge = ({ status, type = 'reservation' }) => {
  const getStatusConfig = () => {
    if (type === 'payment') {
      switch (status) {
        case 'paid':
          return {
            color: 'bg-green-100 text-green-800 border-green-200',
            icon: CheckCircle,
            label: 'Ödendi'
          };
        case 'pending':
          return {
            color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            icon: Clock,
            label: 'Bekleyen'
          };
        case 'unpaid':
          return {
            color: 'bg-red-100 text-red-800 border-red-200',
            icon: XCircle,
            label: 'Ödenmedi'
          };
        case 'refunded':
          return {
            color: 'bg-gray-100 text-gray-800 border-gray-200',
            icon: DollarSign,
            label: 'İade Edildi'
          };
        default:
          return {
            color: 'bg-gray-100 text-gray-800 border-gray-200',
            icon: AlertCircle,
            label: 'Bilinmeyen'
          };
      }
    } else {
      // Reservation status
      switch (status) {
        case 'confirmed':
          return {
            color: 'bg-green-100 text-green-800 border-green-200',
            icon: CheckCircle,
            label: 'Onaylandı'
          };
        case 'pending':
          return {
            color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            icon: Clock,
            label: 'Bekleyen'
          };
        case 'cancelled':
          return {
            color: 'bg-red-100 text-red-800 border-red-200',
            icon: XCircle,
            label: 'İptal Edildi'
          };
        case 'completed':
          return {
            color: 'bg-blue-100 text-blue-800 border-blue-200',
            icon: CheckCircle,
            label: 'Tamamlandı'
          };
        case 'in_progress':
          return {
            color: 'bg-purple-100 text-purple-800 border-purple-200',
            icon: AlertCircle,
            label: 'Devam Ediyor'
          };
        default:
          return {
            color: 'bg-gray-100 text-gray-800 border-gray-200',
            icon: AlertCircle,
            label: 'Bilinmeyen'
          };
      }
    }
  };

  const config = getStatusConfig();
  const IconComponent = config.icon;

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${config.color}`}>
      <IconComponent className="w-3 h-3 mr-1" />
      {config.label}
    </span>
  );
};

// Payment Method Badge
export const PaymentMethodBadge = ({ method }) => {
  const getMethodConfig = () => {
    switch (method) {
      case 'credit_card':
        return {
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: CreditCard,
          label: 'Kredi Kartı'
        };
      case 'bank_transfer':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: DollarSign,
          label: 'Havale'
        };
      case 'cash':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: DollarSign,
          label: 'Nakit'
        };
      case 'phone_order':
        return {
          color: 'bg-purple-100 text-purple-800 border-purple-200',
          icon: AlertCircle,
          label: 'Telefon Siparişi'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: AlertCircle,
          label: 'Belirtilmemiş'
        };
    }
  };

  const config = getMethodConfig();
  const IconComponent = config.icon;

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${config.color}`}>
      <IconComponent className="w-3 h-3 mr-1" />
      {config.label}
    </span>
  );
};

// Priority Badge
export const PriorityBadge = ({ priority }) => {
  const getPriorityConfig = () => {
    switch (priority) {
      case 'high':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          label: 'Yüksek'
        };
      case 'medium':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          label: 'Orta'
        };
      case 'low':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          label: 'Düşük'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          label: 'Normal'
        };
    }
  };

  const config = getPriorityConfig();

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${config.color}`}>
      {config.label}
    </span>
  );
};

// Status utilities
export const getStatusColor = (status, type = 'reservation') => {
  if (type === 'payment') {
    switch (status) {
      case 'paid': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'unpaid': return 'text-red-600';
      case 'refunded': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  } else {
    switch (status) {
      case 'confirmed': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'cancelled': return 'text-red-600';
      case 'completed': return 'text-blue-600';
      case 'in_progress': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  }
};

export const getStatusText = (status, type = 'reservation') => {
  if (type === 'payment') {
    switch (status) {
      case 'paid': return 'Ödendi';
      case 'pending': return 'Bekleyen';
      case 'unpaid': return 'Ödenmedi';
      case 'refunded': return 'İade Edildi';
      default: return 'Bilinmeyen';
    }
  } else {
    switch (status) {
      case 'confirmed': return 'Onaylandı';
      case 'pending': return 'Bekleyen';
      case 'cancelled': return 'İptal Edildi';
      case 'completed': return 'Tamamlandı';
      case 'in_progress': return 'Devam Ediyor';
      default: return 'Bilinmeyen';
    }
  }
};

export const canEditReservation = (status) => {
  return ['pending', 'confirmed'].includes(status);
};

export const canCancelReservation = (status) => {
  return ['pending', 'confirmed'].includes(status);
};

export const canAssignDriver = (status) => {
  return ['confirmed'].includes(status);
};
