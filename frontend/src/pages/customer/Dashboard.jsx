import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import DashboardLayout from '../../components/DashboardLayout';
import { Package, ClipboardList, User } from 'lucide-react';

const CustomerDashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <DashboardLayout>
      {/* Page Title with proper mobile spacing */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100">
          Customer Dashboard
        </h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Link
          to="/customer/select-provider"
          className="group bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700 hover:scale-105"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Package size={24} className="text-white" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Create New Order</h3>
          <p className="text-slate-600 dark:text-slate-400">Select a provider and place your laundry order</p>
        </Link>

        <Link
          to="/customer/orders"
          className="group bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700 hover:scale-105"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <ClipboardList size={24} className="text-white" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">My Orders</h3>
          <p className="text-slate-600 dark:text-slate-400">View and track your order history</p>
        </Link>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700">
          <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
            <User size={24} className="text-white" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Profile</h3>
          <p className="text-slate-600 dark:text-slate-400">Name: {user?.name}</p>
          <p className="text-slate-600 dark:text-slate-400">Email: {user?.email}</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CustomerDashboard;
