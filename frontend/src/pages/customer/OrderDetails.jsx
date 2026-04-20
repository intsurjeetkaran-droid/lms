import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import DashboardLayout from '../../components/DashboardLayout';

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const { data } = await axios.get(`/api/orders/${orderId}`);
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-xl text-slate-700 dark:text-slate-300">Loading order details...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!order) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow text-center border border-slate-200 dark:border-slate-700">
            <p className="text-xl text-slate-600 dark:text-slate-400">Order not found</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100">Order Details</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Info */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100">Order Information</h2>
            <div className="space-y-2 text-slate-700 dark:text-slate-300">
              <p><span className="font-medium text-slate-900 dark:text-slate-100">Order ID:</span> #{order._id.slice(-6)}</p>
              <p><span className="font-medium text-slate-900 dark:text-slate-100">Status:</span> {order.status.replace('_', ' ').toUpperCase()}</p>
              <p><span className="font-medium text-slate-900 dark:text-slate-100">Provider:</span> {order.providerId?.name}</p>
              <p><span className="font-medium text-slate-900 dark:text-slate-100">Created:</span> {new Date(order.createdAt).toLocaleString()}</p>
            </div>
          </div>

          {/* Pickup Location */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100">Pickup Location</h2>
            <p className="text-slate-700 dark:text-slate-300">{order.pickupLocation.address}</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              Distance: {order.distance.toFixed(2)} km
            </p>
          </div>

          {/* Items */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100">Items</h2>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                  <div>
                    <span className="font-medium text-slate-900 dark:text-slate-100">{item.name}</span>
                    {item.isCustom && <span className="text-sm text-orange-600 dark:text-orange-400 ml-2">(Custom)</span>}
                    <span className="text-slate-600 dark:text-slate-400 ml-2">x {item.quantity}</span>
                  </div>
                  <span className="text-blue-600 dark:text-blue-400 font-medium">₹{item.finalPrice}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Charges */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100">Charges Breakdown</h2>
            <div className="space-y-2 text-slate-700 dark:text-slate-300">
              <div className="flex justify-between">
                <span>Pickup Charge:</span>
                <span>₹{order.charges.pickup}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge:</span>
                <span>₹{order.charges.delivery}</span>
              </div>
              <div className="flex justify-between">
                <span>Distance Charge:</span>
                <span>₹{order.charges.distance.toFixed(2)}</span>
              </div>
              {order.charges.extra > 0 && (
                <div className="flex justify-between">
                  <span>Extra Charge:</span>
                  <span>₹{order.charges.extra}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg border-t border-slate-200 dark:border-slate-700 pt-2 text-slate-900 dark:text-slate-100">
                <span>Total:</span>
                <span className="text-blue-600 dark:text-blue-400">₹{order.totalPrice}</span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg lg:col-span-2 border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100">Payment Information</h2>
            <div className="space-y-2 text-slate-700 dark:text-slate-300">
              <p><span className="font-medium text-slate-900 dark:text-slate-100">Method:</span> {order.paymentMethod?.toUpperCase()}</p>
              <p><span className="font-medium text-slate-900 dark:text-slate-100">Status:</span> {order.paymentStatus === 'paid' ? '✓ Paid' : 'Pending'}</p>
              {order.transactionId && (
                <p><span className="font-medium text-slate-900 dark:text-slate-100">Transaction ID:</span> {order.transactionId}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OrderDetails;
