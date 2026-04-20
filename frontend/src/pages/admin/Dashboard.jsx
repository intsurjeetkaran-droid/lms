import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import DashboardLayout from '../../components/DashboardLayout';
import { Users, Package, DollarSign, AlertCircle } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCustomers: 0,
    totalProviders: 0,
    totalOrders: 0,
    pendingComplaints: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await axios.get('/api/admin/stats');
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-xl text-slate-600 dark:text-slate-400">Loading dashboard...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Page Title with proper mobile spacing */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 pl-0 lg:pl-0">
          Admin Dashboard
        </h1>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <Users size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{stats.totalUsers}</h3>
          </div>
          <p className="text-slate-600 dark:text-slate-400 mb-1">Total Users</p>
          <p className="text-sm text-slate-500 dark:text-slate-500">
            Customers: {stats.totalCustomers} | Providers: {stats.totalProviders}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <Package size={24} className="text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{stats.totalOrders}</h3>
          </div>
          <p className="text-slate-600 dark:text-slate-400">Total Orders</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
              <DollarSign size={24} className="text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100">₹{stats.totalRevenue}</h3>
          </div>
          <p className="text-slate-600 dark:text-slate-400">Total Revenue</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
              <AlertCircle size={24} className="text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{stats.pendingComplaints}</h3>
          </div>
          <p className="text-slate-600 dark:text-slate-400">Pending Complaints</p>
        </div>
      </div>

      {/* Quick Actions */}
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/admin/users"
          className="group bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700 hover:scale-105"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Users size={24} className="text-white" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Manage Users</h3>
          <p className="text-slate-600 dark:text-slate-400">View, block, and manage all users</p>
        </Link>

        <Link
          to="/admin/orders"
          className="group bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700 hover:scale-105"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Package size={24} className="text-white" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">View All Orders</h3>
          <p className="text-slate-600 dark:text-slate-400">Monitor all orders in the system</p>
        </Link>

        <Link
          to="/admin/complaints"
          className="group bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700 hover:scale-105"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <AlertCircle size={24} className="text-white" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Handle Complaints</h3>
          <p className="text-slate-600 dark:text-slate-400">Resolve customer complaints</p>
        </Link>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
