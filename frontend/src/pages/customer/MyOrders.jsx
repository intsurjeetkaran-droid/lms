import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import DashboardLayout from '../../components/DashboardLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import ErrorMessage from '../../components/ErrorMessage';
import { Package, ShoppingBag } from 'lucide-react';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setError(null);
      setLoading(true);
      const { data } = await axios.get('/api/orders/my-orders');
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError(error.response?.data?.message || 'Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      awaiting_review: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      picked_up: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      processing: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
      delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      completed: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
  };

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingSpinner message="Loading your orders..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">My Orders</h1>
          <p className="text-slate-600 dark:text-slate-400">Track and manage your laundry orders</p>
        </div>

        {error && (
          <div className="mb-6">
            <ErrorMessage 
              title="Unable to Load Orders"
              message={error}
              onRetry={fetchOrders}
              variant="error"
            />
          </div>
        )}
        
        {!error && orders.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title="No Orders Yet"
            message="You haven't placed any orders yet. Start by selecting a service provider and creating your first order."
            actionLabel="Find a Provider"
            onAction={() => window.location.href = '/customer/select-provider'}
          />
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-soft hover:shadow-soft-lg transition-all border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      Order #{order._id.slice(-6)}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Provider: {order.providerId?.name || 'N/A'}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    Items: {order.items.length}
                  </p>
                  <p className="text-lg font-bold bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">
                    Total: ₹{order.totalPrice}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Payment: {order.paymentStatus === 'paid' ? '✓ Paid' : 'Pending'}
                  </p>
                </div>

                <div className="mt-4 flex gap-2 flex-wrap">
                  <Link
                    to={`/customer/orders/${order._id}`}
                    className="bg-gradient-to-r from-sky-500 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-sky-600 hover:to-indigo-700 transition-all text-sm font-medium"
                  >
                    View Details
                  </Link>
                  
                  {order.status === 'delivered' && (
                    <Link
                      to={`/customer/feedback/${order._id}`}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all text-sm font-medium"
                    >
                      Give Feedback
                    </Link>
                  )}
                  
                  {order.status === 'completed' && (
                    <Link
                      to={`/customer/complaint/${order._id}`}
                      className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-all text-sm font-medium"
                    >
                      Raise Complaint
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyOrders;
