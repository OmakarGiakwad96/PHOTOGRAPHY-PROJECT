import { Routes, Route } from 'react-router-dom'

import PublicLayout from './layouts/PublicLayout'
import AuthLayout from './layouts/AuthLayout'
import CustomerLayout from './layouts/CustomerLayout'
import PhotographerLayout from './layouts/PhotographerLayout'
import AdminLayout from './layouts/AdminLayout'
import ProtectedRoute from './routes/ProtectedRoute'

// Public pages
import Home from './pages/public/HomePage'
import About from './pages/public/AboutPage'
import Contact from './pages/public/ContactPage'
import Faq from './pages/public/FaqPage'
import SearchPage from './pages/public/SearchPage'
import PhotographerList from './pages/public/PhotographerList'
import PhotographerDetails from './pages/public/PhotographerDetails'
import PortfolioPage from './pages/public/PortfolioPage'
import PackagesPage from './pages/public/PackagesPage'
import PackageDetails from './pages/public/PackageDetails'

// Auth pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'

// Customer pages
import CustomerDashboard from './pages/customer/Dashboard'
import CustomerProfile from './pages/customer/Profile'
import EditProfile from './pages/customer/EditProfile'
import MyBookings from './pages/customer/MyBookings'
import BookingDetails from './pages/customer/BookingDetails'
import PaymentHistory from './pages/customer/PaymentHistory'
import CustomerReviews from './pages/customer/Reviews'

// Photographer pages
import PhotographerDashboard from './pages/photographer/Dashboard'
import PhotographerProfile from './pages/photographer/Profile'
import PhotographerPortfolio from './pages/photographer/Portfolio'
import AddPortfolio from './pages/photographer/AddPortfolio'
import PhotographerPackages from './pages/photographer/Packages'
import AddPackage from './pages/photographer/AddPackage'
import BookingRequests from './pages/photographer/BookingRequests'
import Earnings from './pages/photographer/Earnings'

// Admin pages
import AdminDashboard from './pages/admin/Dashboard'
import AdminUsers from './pages/admin/Users'
import AdminPhotographers from './pages/admin/Photographers'
import Approvals from './pages/admin/Approvals'
import AdminBookings from './pages/admin/Bookings'
import AdminPayments from './pages/admin/Payments'
import AdminRefunds from './pages/admin/Refunds'
import PaymentIssues from './pages/admin/PaymentIssues'
import Logs from './pages/admin/Logs'
import Reports from './pages/admin/Reports'
import AdminSettings from './pages/admin/Settings'

// Error pages
import NotFound from './pages/errors/NotFound'
import Unauthorized from './pages/errors/Unauthorized'
import ServerError from './pages/errors/ServerError'

function App() {
  return (
    <Routes>
      {/* Public site */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/photographers" element={<PhotographerList />} />
        <Route path="/photographers/:id" element={<PhotographerDetails />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/packages" element={<PackagesPage />} />
        <Route path="/packages/:id" element={<PackageDetails />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/server-error" element={<ServerError />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Auth */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* Customer dashboard */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['client']}>
            <CustomerLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/customer/dashboard" element={<CustomerDashboard />} />
        <Route path="/customer/profile" element={<CustomerProfile />} />
        <Route path="/customer/profile/edit" element={<EditProfile />} />
        <Route path="/customer/bookings" element={<MyBookings />} />
        <Route path="/customer/bookings/:id" element={<BookingDetails />} />
        <Route path="/customer/payments" element={<PaymentHistory />} />
        <Route path="/customer/reviews" element={<CustomerReviews />} />
      </Route>

      {/* Photographer dashboard */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['photographer']}>
            <PhotographerLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/photographer/dashboard" element={<PhotographerDashboard />} />
        <Route path="/photographer/profile" element={<PhotographerProfile />} />
        <Route path="/photographer/portfolio" element={<PhotographerPortfolio />} />
        <Route path="/photographer/portfolio/add" element={<AddPortfolio />} />
        <Route path="/photographer/packages" element={<PhotographerPackages />} />
        <Route path="/photographer/packages/add" element={<AddPackage />} />
        <Route path="/photographer/bookings" element={<BookingRequests />} />
        <Route path="/photographer/earnings" element={<Earnings />} />
      </Route>

      {/* Admin dashboard */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/photographers" element={<AdminPhotographers />} />
        <Route path="/admin/approvals" element={<Approvals />} />
        <Route path="/admin/bookings" element={<AdminBookings />} />
        <Route path="/admin/payments" element={<AdminPayments />} />
        <Route path="/admin/refunds" element={<AdminRefunds />} />
        <Route path="/admin/payment-issues" element={<PaymentIssues />} />
        <Route path="/admin/logs" element={<Logs />} />
        <Route path="/admin/reports" element={<Reports />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
      </Route>
    </Routes>
  )
}

export default App
