import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { CheckCircle, AlertCircle, XCircle, Info, X } from 'lucide-react';

const NotificationSystem = () => {
  const { state, actions } = useApp();
  const { notification } = state;

  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        actions.hideNotification();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [notification.show, actions]);

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <XCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getColorClasses = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getIconColorClasses = (type) => {
    switch (type) {
      case 'success':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
      case 'warning':
        return 'text-yellow-400';
      default:
        return 'text-blue-400';
    }
  };

  return (
    <AnimatePresence>
      {notification.show && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.3 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.3 }}
          transition={{ type: "spring", stiffness: 500, damping: 25 }}
          className="fixed top-4 right-4 z-50 max-w-sm w-full"
        >
          <div className={`rounded-lg border p-4 shadow-lg ${getColorClasses(notification.type)}`}>
            <div className="flex">
              <div className={`flex-shrink-0 ${getIconColorClasses(notification.type)}`}>
                {getIcon(notification.type)}
              </div>
              <div className="ml-3 flex-1">
                {notification.title && (
                  <h3 className="text-sm font-medium">
                    {notification.title}
                  </h3>
                )}
                <p className={`text-sm ${notification.title ? 'mt-1' : ''}`}>
                  {notification.message}
                </p>
              </div>
              <div className="ml-4 flex-shrink-0">
                <button
                  onClick={actions.hideNotification}
                  className={`inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    notification.type === 'success' ? 'focus:ring-green-500' :
                    notification.type === 'error' ? 'focus:ring-red-500' :
                    notification.type === 'warning' ? 'focus:ring-yellow-500' :
                    'focus:ring-blue-500'
                  }`}
                >
                  <span className="sr-only">Kapat</span>
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationSystem;
