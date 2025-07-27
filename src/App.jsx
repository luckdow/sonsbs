import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider } from './contexts/AuthContext'
import { AppProvider } from './context/AppContext'

// Performance Components
import MobileOptimizer from './components/UI/MobileOptimizer'

// Layout Components (keep these as direct imports since they're used on all pages)
import Layout from './components/Layout/Layout'
import AdminLayout from './components/Layout/AdminLayout'
import DriverLayout from './components/Layout/DriverLayout'

// Loading component
const PageSkeleton = () => (
  <div className="min-h-screen bg-gray-50 animate-pulse">
    <div className="h-16 bg-gray-200 mb-4"></div>
    <div className="container mx-auto px-4">
      <div className="h-8 bg-gray-200 rounded mb-4 w-1/3"></div>
      <div className="h-4 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 bg-gray-200 rounded mb-2 w-2/3"></div>
      <div className="h-4 bg-gray-200 rounded mb-4 w-1/2"></div>
      <div className="h-64 bg-gray-200 rounded"></div>
    </div>
  </div>
);

// Lazy load all pages for code splitting
// Static Pages
const AboutPage = lazy(() => import('./pages/Static/AboutPage'))
const ContactPage = lazy(() => import('./pages/Static/ContactPage'))
const ServicesPage = lazy(() => import('./pages/Static/ServicesPage'))  
const FAQPage = lazy(() => import('./pages/Static/FAQPage'))
const PrivacyPolicyPage = lazy(() => import('./pages/Static/PrivacyPolicyPage'))
const TermsPage = lazy(() => import('./pages/Static/TermsPage'))
const KVKKPage = lazy(() => import('./pages/Static/KVKKPage'))
const CookiePolicyPage = lazy(() => import('./pages/Static/CookiePolicyPage'))
const RefundCancellationPage = lazy(() => import('./pages/Static/RefundCancellationPage'))

// City Pages
const AntalyaTransfer = lazy(() => import('./pages/City/AntalyaTransfer'))
const LaraTransfer = lazy(() => import('./pages/City/LaraTransfer'))
const KasTransfer = lazy(() => import('./pages/City/KasTransfer'))
const KalkanTransfer = lazy(() => import('./pages/City/KalkanTransfer'))
const ManavgatTransfer = lazy(() => import('./pages/City/ManavgatTransfer'))
const SerikTransfer = lazy(() => import('./pages/City/SerikTransfer'))
const KemerTransfer = lazy(() => import('./pages/City/KemerTransfer'))
const BelekTransfer = lazy(() => import('./pages/City/BelekTransfer'))
const AlanyaTransfer = lazy(() => import('./pages/City/AlanyaTransfer'))
const SideTransfer = lazy(() => import('./pages/City/SideTransfer'))

// Service Pages
const HavaalaniTransfer = lazy(() => import('./pages/Services/HavaalaniTransfer'))
const VipTransfer = lazy(() => import('./pages/Services/VipTransfer'))
const GrupTransfer = lazy(() => import('./pages/Services/GrupTransfer'))
const OtelTransfer = lazy(() => import('./pages/Services/OtelTransfer'))
const SehirIciTransfer = lazy(() => import('./pages/Services/SehirIciTransfer'))
const DugunTransfer = lazy(() => import('./pages/Services/DugunTransfer'))
const KurumsalTransfer = lazy(() => import('./pages/Services/KurumsalTransfer'))
const KarsilamaHizmeti = lazy(() => import('./pages/Services/KarsilamaHizmeti'))

// Blog Pages
const BlogPage = lazy(() => import('./pages/Blog/BlogPage'))
const BlogPostPage = lazy(() => import('./pages/Blog/BlogPostPage'))
const BlogCategoryPage = lazy(() => import('./pages/Blog/BlogCategoryPage'))

// Public Pages (keep HomePage direct since it's landing page)
import HomePage from './pages/Public/HomePage_OPTIMIZED'
const VehicleSelectionPage = lazy(() => import('./pages/Public/VehicleSelectionPage'))
const CustomerInfoPage = lazy(() => import('./pages/Public/CustomerInfoPage'))
const PaymentPage = lazy(() => import('./pages/Public/PaymentPage'))
const ConfirmationPage = lazy(() => import('./pages/Public/ConfirmationPage'))
const BookingConfirmationPage = lazy(() => import('./pages/Public/BookingConfirmationPage'))
const MyReservations = lazy(() => import('./pages/Public/MyReservations'))
const CustomerProfile = lazy(() => import('./pages/Public/CustomerProfile'))
const DriverQRScanner = lazy(() => import('./pages/Public/DriverQRScanner'))
const ManualDriverQR = lazy(() => import('./pages/Public/ManualDriverQR'))

// Auth Pages
const LoginPage = lazy(() => import('./pages/Auth/LoginPage'))
const RegisterPage = lazy(() => import('./pages/Auth/RegisterPage'))
const ResetPasswordPage = lazy(() => import('./pages/Auth/ResetPasswordPage'))

// Admin Pages
const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard'))
const VehicleManagement = lazy(() => import('./pages/Admin/VehicleManagement'))
const VehicleIndex = lazy(() => import('./pages/Admin/Vehicles'))
const DriverIndex = lazy(() => import('./pages/Admin/Drivers'))
const ExtraServicesManagement = lazy(() => import('./pages/Admin/ExtraServicesManagement'))
const ReservationManagement = lazy(() => import('./pages/Admin/Reservations'))
const FinancialManagement = lazy(() => import('./pages/Admin/Financial'))
const SettingsPage = lazy(() => import('./pages/Admin/SettingsPage'))

// Driver Pages
const DriverDashboard = lazy(() => import('./pages/Driver/DriverDashboard'))
const MyTrips = lazy(() => import('./pages/Driver/MyTrips'))
const DriverProfile = lazy(() => import('./pages/Driver/DriverProfile'))

// Booking Components
const BookingWizard = lazy(() => import('./components/Booking/BookingWizard'))

// Components
import { ProtectedRoute, PublicRoute, AdminRoute, DriverRoute, CustomerRoute } from './components/Auth/ProtectedRoute'
import ScrollToTop from './components/ScrollToTop'

// Error Boundary
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'

function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <AuthProvider>
          <AppProvider>
            <BrowserRouter>
              <ScrollToTop />
              <div className="App">
                <Suspense fallback={<PageSkeleton />}>
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
                      <Route path="antalya-transfer" element={<AntalyaTransfer />} />
                      <Route path="lara-transfer" element={<LaraTransfer />} />
                      <Route path="kas-transfer" element={<KasTransfer />} />
                      <Route path="kalkan-transfer" element={<KalkanTransfer />} />
                      <Route path="manavgat-transfer" element={<ManavgatTransfer />} />
                      <Route path="serik-transfer" element={<SerikTransfer />} />
                      <Route path="kemer-transfer" element={<KemerTransfer />} />
                      <Route path="belek-transfer" element={<BelekTransfer />} />
                      <Route path="alanya-transfer" element={<AlanyaTransfer />} />
                      <Route path="side-transfer" element={<SideTransfer />} />
                
                {/* Service Pages */}
                <Route path="hizmetler/havaalani-transfer" element={<HavaalaniTransfer />} />
                <Route path="hizmetler/vip-transfer" element={<VipTransfer />} />
                <Route path="hizmetler/grup-transfer" element={<GrupTransfer />} />
                <Route path="hizmetler/otel-transfer" element={<OtelTransfer />} />
                <Route path="hizmetler/sehir-ici-transfer" element={<SehirIciTransfer />} />
                <Route path="hizmetler/dugun-transfer" element={<DugunTransfer />} />
                <Route path="hizmetler/kurumsal-transfer" element={<KurumsalTransfer />} />
                <Route path="hizmetler/karsilama-hizmeti" element={<KarsilamaHizmeti />} />
                
                {/* Blog Pages */}
                <Route path="blog" element={<BlogPage />} />
                <Route path="blog/kategori/:categorySlug" element={<BlogCategoryPage />} />
                <Route path="blog/:slug" element={<BlogPostPage />} />
                
                {/* Legacy Service Routes - Redirect to new paths */}
                <Route path="havaalani-transfer" element={<HavaalaniTransfer />} />
                <Route path="vip-transfer" element={<VipTransfer />} />
                <Route path="grup-transfer" element={<GrupTransfer />} />
                <Route path="otel-transfer" element={<OtelTransfer />} />
                <Route path="sehir-ici-transfer" element={<SehirIciTransfer />} />
                <Route path="dugun-transfer" element={<DugunTransfer />} />
                <Route path="kurumsal-transfer" element={<KurumsalTransfer />} />
                <Route path="karsilama-hizmeti" element={<KarsilamaHizmeti />} />
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
          </Suspense>

            {/* Global Components */}
            <MobileOptimizer />
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
