import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { 
  Car, 
  User, 
  LogOut
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const DriverLayout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Başarıyla çıkış yaptınız');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Çıkış yapılırken hata oluştu');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-40">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-500 p-2 rounded-full">
              <Car className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900">SBS Transfer</h1>
              <p className="text-xs text-gray-500">Şoför Paneli</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigate('/şoför/profil')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Profil"
            >
              <User className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Çıkış Yap"
            >
              <LogOut className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="pb-4">
        <Outlet />
      </main>
    </div>
  );
};

export default DriverLayout;
