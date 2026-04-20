import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// Landing Page
import LandingPage from './landing/LandingPage';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Customer Pages
import CustomerDashboard from './pages/customer/Dashboard';
import SelectProvider from './pages/customer/SelectProvider';
import CreateOrder from './pages/customer/CreateOrder';
import MyOrders from './pages/customer/MyOrders';
import OrderDetails from './pages/customer/OrderDetails';
import GiveFeedback from './pages/customer/GiveFeedback';
import RaiseComplaint from './pages/customer/RaiseComplaint';

// Provider Pages
import ProviderDashboard from './pages/provider/Dashboard';
import ProviderSetup from './pages/provider/Setup';
import ManageGarments from './pages/provider/ManageGarments';
import ProviderOrders from './pages/provider/Orders';
import ReviewOrder from './pages/provider/ReviewOrder';
import PaymentSetup from './pages/provider/PaymentSetup';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageComplaints from './pages/admin/ManageComplaints';
import AllOrders from './pages/admin/AllOrders';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Customer Routes */}
          <Route path="/customer" element={<PrivateRoute role="customer" />}>
            <Route path="dashboard" element={<CustomerDashboard />} />
            <Route path="select-provider" element={<SelectProvider />} />
            <Route path="create-order/:providerId" element={<CreateOrder />} />
            <Route path="orders" element={<MyOrders />} />
            <Route path="orders/:orderId" element={<OrderDetails />} />
            <Route path="feedback/:orderId" element={<GiveFeedback />} />
            <Route path="complaint/:orderId" element={<RaiseComplaint />} />
          </Route>

          {/* Provider Routes */}
          <Route path="/provider" element={<PrivateRoute role="provider" />}>
            <Route path="dashboard" element={<ProviderDashboard />} />
            <Route path="setup" element={<ProviderSetup />} />
            <Route path="garments" element={<ManageGarments />} />
            <Route path="orders" element={<ProviderOrders />} />
            <Route path="orders/:orderId/review" element={<ReviewOrder />} />
            <Route path="payment-setup" element={<PaymentSetup />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<PrivateRoute role="admin" />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="complaints" element={<ManageComplaints />} />
            <Route path="orders" element={<AllOrders />} />
          </Route>

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
