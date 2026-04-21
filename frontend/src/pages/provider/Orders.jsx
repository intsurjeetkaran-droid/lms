import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import DashboardLayout from '../../components/DashboardLayout';
import AlertDialog from '../../components/AlertDialog';

const ProviderOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  
  // Alert dialog state
  const [alertDialog, setAlertDialog] = useState({ isOpen: false, type: 'info', title: '', message: '' });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get('/api/orders/provider-orders');
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await axios.put(`/api/orders/${orderId}/status`, { status: newStatus });
      setAlertDialog({
        isOpen: true,
        type: 'success',
        title: 'Success',
        message: 'Order status updated!'
      });
      fetchOrders();
    } catch (error) {
      console.error('Error updating status:', error);
      setAlertDialog({
        isOpen: true,
        type: 'error',
        title: 'Error',
        message: 'Failed to update status'
      });
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      awaiting_review: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      picked_up: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      processing: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
      delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      completed: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(o => o.status === filter);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-xl text-slate-700 dark:text-slate-300">Loading orders...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100">Manage Orders</h1>
        </div>
        
        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['all', 'awaiting_review', 'confirmed', 'picked_up', 'processing', 'delivered'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-300 ${
                filter === status
                  ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {status === 'all' ? 'All' : status.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>

        {/* Orders Grid */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow text-center border border-slate-200 dark:border-slate-700">
            <p className="text-xl text-slate-600 dark:text-slate-400">No orders found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrders.map((order) => (
              <div key={order._id} className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow duration-300 flex flex-col">
                {/* Header */}
                <div className="mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      Order #{order._id.slice(-6)}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                    {order.customerId?.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-500">
                    {order.customerId?.phone}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                    {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                {/* Order Details */}
                <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mb-4 flex-grow">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Items:</span>
                      <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{order.items.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Total:</span>
                      <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">₹{order.totalPrice}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Payment:</span>
                      <span className={`text-sm font-medium ${order.paymentStatus === 'paid' ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
                        {order.paymentStatus === 'paid' ? '✓ Paid' : 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  {order.status === 'awaiting_review' && (
                    <Link
                      to={`/provider/orders/${order._id}/review`}
                      className="bg-gradient-to-r from-blue-600 to-violet-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-violet-700 transition-all text-center font-medium"
                    >
                      Review Order
                    </Link>
                  )}
                  
                  {order.status === 'confirmed' && (
                    <button
                      onClick={() => handleStatusUpdate(order._id, 'picked_up')}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all font-medium"
                    >
                      Mark as Picked Up
                    </button>
                  )}
                  
                  {order.status === 'picked_up' && (
                    <button
                      onClick={() => handleStatusUpdate(order._id, 'processing')}
                      className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-all font-medium"
                    >
                      Start Processing
                    </button>
                  )}
                  
                  {order.status === 'processing' && (
                    <button
                      onClick={() => handleStatusUpdate(order._id, 'delivered')}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all font-medium"
                    >
                      Mark as Delivered
                    </button>
                  )}
                  
                  {order.status === 'delivered' && (
                    <button
                      onClick={() => handleStatusUpdate(order._id, 'completed')}
                      className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-all font-medium"
                    >
                      Complete Order
                    </button>
                  )}

                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${order.pickupLocation.lat},${order.pickupLocation.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all text-center font-medium"
                  >
                    📍 Navigate
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Alert Dialog */}
      <AlertDialog
        isOpen={alertDialog.isOpen}
        onClose={() => setAlertDialog({ isOpen: false, type: 'info', title: '', message: '' })}
        title={alertDialog.title}
        message={alertDialog.message}
        type={alertDialog.type}
      />
    </DashboardLayout>
  );
};

export default ProviderOrders;
