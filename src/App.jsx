import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
// Static Pages
import AboutPage from './pages/Static/AboutPage'
import ContactPage from './pages/Static/ContactPage'
import ServicesPage from './pages/Static/ServicesPage'
import FAQPage from './pages/Static/FAQPage'
import PrivacyPolicyPage from './pages/Static/PrivacyPolicyPage'
import TermsPage from './pages/Static/TermsPage'
import KVKKPage from './pages/Static/KVKKPage'
import CookiePolicyPage from './pages/Static/CookiePolicyPage'
import RefundCancellationPage from './pages/Static/RefundCancellationPage'

// City Pages
import AntalyaTransferPage from './pages/City/AntalyaTransferPage'
import KemerTransferPage from './pages/City/KemerTransferPage'
import SideTransferPage from './pages/City/SideTransferPage'

import { Toaster } from 'react-hot-toast'
import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider } from './contexts/AuthContext'
import { AppProvider } from './context/AppContext'

// Layout Components
import Layout from './components/Layout/Layout'
import AdminLayout from './components/Layout/AdminLayout'
import DriverLayout from './components/Layout/DriverLayout'

// Public Pages
import HomePage from './pages/Public/HomePage_OPTIMIZED'
import VehicleSelectionPage from './pages/Public/VehicleSelectionPage'
import CustomerInfoPage from './pages/Public/CustomerInfoPage'
import PaymentPage from './pages/Public/PaymentPage'
import ConfirmationPage from './pages/Public/ConfirmationPage'
import BookingConfirmationPage from './pages/Public/BookingConfirmationPage'
import MyReservations from './pages/Public/MyReservations'
import CustomerProfile from './pages/Public/CustomerProfile'
import DriverQRScanner from './pages/Public/DriverQRScanner'
import ManualDriverQR from './pages/Public/ManualDriverQR'

// Auth Pages
import LoginPage from './pages/Auth/LoginPage'
import RegisterPage from './pages/Auth/RegisterPage'
import ResetPasswordPage from './pages/Auth/ResetPasswordPage'

// Admin Pages
import AdminDashboard from './pages/Admin/AdminDashboard'
import VehicleManagement from './pages/Admin/VehicleManagement'
import VehicleIndex from './pages/Admin/Vehicles'
import DriverIndex from './pages/Admin/Drivers'
import ExtraServicesManagement from './pages/Admin/ExtraServicesManagement'
import ReservationManagement from './pages/Admin/Reservations'
import FinancialManagement from './pages/Admin/Financial'
import SettingsPage from './pages/Admin/SettingsPage'

// Driver Pages
import DriverDashboard from './pages/Driver/DriverDashboard'
import MyTrips from './pages/Driver/MyTrips'
import DriverProfile from './pages/Driver/DriverProfile'

// Booking Components
import BookingWizard from './components/Booking/BookingWizard'

// Components
import { ProtectedRoute, PublicRoute, AdminRoute, DriverRoute, CustomerRoute } from './components/Auth/ProtectedRoute'

// Error Boundary
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'

function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <AuthProvider>
          <AppProvider>
            <BrowserRouter>
              <div className="App">
                <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="rezervasyon" element={<BookingWizard />} />
                <Route path="araç-seçimi" element={<VehicleSelectionPage />} />
                <Route path="müşteri-bilgileri" element={<CustomerInfoPage />} />
                <Route path="ödeme" element={<PaymentPage />} />
                <Route path="onay" element={<ConfirmationPage />} />
                <Route path="rezervasyonlarim" element={<MyReservations />} />
                <Route path="profil" element={<CustomerProfile />} />
                
                {/* Static Pages */}
                <Route path="hakkimizda" element={<AboutPage />} />
                <Route path="iletisim" element={<ContactPage />} />
                <Route path="hizmetlerimiz" element={<ServicesPage />} />
                <Route path="sss" element={<FAQPage />} />
                <Route path="gizlilik-politikasi" element={<PrivacyPolicyPage />} />
                <Route path="kullanim-sartlari" element={<TermsPage />} />
                <Route path="kvkk" element={<KVKKPage />} />
                <Route path="cerez-politikasi" element={<CookiePolicyPage />} />
                <Route path="iade-iptal" element={<RefundCancellationPage />} />
                
                {/* City Pages */}
                <Route path="antalya-transfer" element={<AntalyaTransferPage />} />
                <Route path="kemer-transfer" element={<KemerTransferPage />} />
                <Route path="side-transfer" element={<SideTransferPage />} />
              </Route>

              {/* Booking Confirmation - Standalone Route */}
              <Route path="/booking-confirmation" element={<BookingConfirmationPage />} />
              
              {/* Driver QR Scanner - Standalone Route */}
              <Route path="/driver-qr" element={<DriverQRScanner />} />
              
              {/* Manuel Driver QR - Rezervasyon spesifik link */}
              <Route path="/manual-driver/:reservationId" element={<ManualDriverQR />} />

              {/* Auth Routes */}
              <Route path="/giriş" element={
                <PublicRoute redirectTo="auto">
                  <LoginPage />
                </PublicRoute>
              } />
              <Route path="/kayıt" element={
                <PublicRoute redirectTo="auto">
                  <RegisterPage />
                </PublicRoute>
              } />
              <Route path="/şifre-sıfırla" element={
                <PublicRoute redirectTo="auto">
                  <ResetPasswordPage />
                </PublicRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin" element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }>
                <Route index element={<AdminDashboard />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="araçlar" element={<VehicleManagement />} />
                <Route path="vehicles" element={<VehicleIndex />} />
                <Route path="şoförler" element={<DriverIndex />} />
                <Route path="ek-hizmetler" element={<ExtraServicesManagement />} />
                <Route path="rezervasyonlar" element={<ReservationManagement />} />
                <Route path="finans" element={<FinancialManagement />} />
                <Route path="ayarlar" element={<SettingsPage />} />
              </Route>

              {/* Driver Routes */}
              <Route path="/driver" element={
                <DriverRoute>
                  <DriverLayout />
                </DriverRoute>
              }>
                <Route index element={<DriverDashboard />} />
                <Route path="dashboard" element={<DriverDashboard />} />
                <Route path="seferlerim" element={<MyTrips />} />
                <Route path="profil" element={<DriverProfile />} />
              </Route>

              {/* 404 Route */}
              <Route path="*" element={
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <h1 className="text-6xl font-bold text-gray-400">404</h1>
                    <p className="text-xl text-gray-600 mt-4">Sayfa bulunamadı</p>
                    <a 
                      href="/" 
                      className="btn btn-primary mt-6 inline-block"
                    >
                      Ana Sayfaya Dön
                    </a>
                  </div>
                </div>
              } />
            </Routes>

            {/* Global Components */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#22c55e',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </div>
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  </HelmetProvider>
  </ErrorBoundary>
  )
}

export default App
