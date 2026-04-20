import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import DashboardLayout from '../../components/DashboardLayout';
import { AlertCircle, Package, DollarSign } from 'lucide-react';

const ProviderDashboard = () => {
  const [stats, setStats] = useState({
    pendingOrders: 0,
    totalOrders: 0,
    totalEarnings: 0
  });
  const [hasProfile, setHasProfile] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkProfile();
    fetchStats();
  }, []);

  const checkProfile = async () => {
    try {
      await axios.get('/api/providers/profile');
      setHasProfile(true);
    } catch (error) {
      setHasProfile(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await axios.get('/api/orders/provider-orders');
      const pending = data.filter(o => o.status === 'awaiting_review').length;
      const earnings = data
        .filter(o => o.paymentStatus === 'paid')
        .reduce((sum, o) => sum + o.totalPrice, 0);
      
      setStats({
        pendingOrders: pending,
        totalOrders: data.length,
        totalEarnings: earnings
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!hasProfile) {
    return (
      <DashboardLayout>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-8 rounded-2xl text-center max-w-2xl mx-auto">
          <AlertCircle size={48} className="text-yellow-600 dark:text-yellow-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">Complete Your Profile</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">Please set up your provider profile to start receiving orders</p>
          <Link
            to="/provider/setup"
            className="inline-block bg-gradient-to-r from-blue-600 to-violet-600 text-white px-8 py-3 rounded-lg hover:shadow-lg transition-all"
          >
            Setup Profile
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Page Title with proper mobile spacing */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100">
          Provider Dashboard
        </h1>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center">
              <AlertCircle size={24} className="text-yellow-600 dark:text-yellow-400" />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{stats.pendingOrders}</h3>
          </div>
          <p className="text-slate-600 dark:text-slate-400">Pending Reviews</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <Package size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{stats.totalOrders}</h3>
          </div>
          <p className="text-slate-600 dark:text-slate-400">Total Orders</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <DollarSign size={24} className="text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100">₹{stats.totalEarnings}</h3>
          </div>
          <p className="text-slate-600 dark:text-slate-400">Total Earnings</p>
        </div>
      </div>

      {/* Quick Actions */}
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link
          to="/provider/orders"
          className="group bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700 hover:scale-105"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Package size={24} className="text-white" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Manage Orders</h3>
          <p className="text-slate-600 dark:text-slate-400">View and update order status</p>
        </Link>

        <Link
          to="/provider/garments"
          className="group bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700 hover:scale-105"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Package size={24} className="text-white" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Manage Garments</h3>
          <p className="text-slate-600 dark:text-slate-400">Add and update garment prices</p>
        </Link>

        <Link
          to="/provider/payment-setup"
          className="group bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700 hover:scale-105"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <DollarSign size={24} className="text-white" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Payment Setup</h3>
          <p className="text-slate-600 dark:text-slate-400">Configure UPI and charges</p>
        </Link>

        <Link
          to="/provider/setup"
          className="group bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700 hover:scale-105"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Package size={24} className="text-white" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Profile Settings</h3>
          <p className="text-slate-600 dark:text-slate-400">Update shop details and location</p>
        </Link>
      </div>
    </DashboardLayout>
  );
};

export default ProviderDashboard;
