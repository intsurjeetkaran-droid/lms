import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DashboardLayout from '../../components/DashboardLayout';
import AlertDialog from '../../components/AlertDialog';
import { Info } from 'lucide-react';

const ReviewOrder = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [customPrices, setCustomPrices] = useState({});
  const [customPriceErrors, setCustomPriceErrors] = useState({});
  const [extraCharge, setExtraCharge] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [priceRange, setPriceRange] = useState({ minPrice: 20, maxPrice: 100 });

  const [alertDialog, setAlertDialog] = useState({ isOpen: false, type: 'info', title: '', message: '' });

  useEffect(() => {
    fetchPriceRange();
    fetchOrder();
  }, [orderId]);

  const fetchPriceRange = async () => {
    try {
      const { data } = await axios.get('/api/garments/my-price-range');
      setPriceRange(data);
    } catch (error) {
      console.error('Error fetching price range:', error);
    }
  };

  const fetchOrder = async () => {
    try {
      const { data } = await axios.get(`/api/orders/${orderId}`);
      setOrder(data);
      setExtraCharge(data.charges.extra || 0);

      const prices = {};
      data.items.forEach(item => {
        if (item.isCustom) {
          // show per-item price (finalPrice is stored as total = price * qty)
          prices[item.name] = item.finalPrice > 0
            ? (item.finalPrice / item.quantity)
            : '';
        }
      });
      setCustomPrices(prices);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomPriceChange = (itemName, value, quantity) => {
    setCustomPrices({ ...customPrices, [itemName]: value });

    const num = Number(value);
    if (value === '' || isNaN(num)) {
      setCustomPriceErrors({ ...customPriceErrors, [itemName]: 'Enter a valid price' });
    } else if (num < priceRange.minPrice || num > priceRange.maxPrice) {
      setCustomPriceErrors({
        ...customPriceErrors,
        [itemName]: `Must be between ₹${priceRange.minPrice} and ₹${priceRange.maxPrice}`
      });
    } else {
      const updated = { ...customPriceErrors };
      delete updated[itemName];
      setCustomPriceErrors(updated);
    }
  };

  const calculateNewTotal = () => {
    if (!order) return 0;

    let itemsTotal = 0;
    order.items.forEach(item => {
      if (item.isCustom) {
        const price = parseFloat(customPrices[item.name]) || 0;
        itemsTotal += price * item.quantity;
      } else {
        itemsTotal += item.finalPrice;
      }
    });

    return itemsTotal +
      order.charges.pickup +
      order.charges.delivery +
      order.charges.distance +
      parseFloat(extraCharge) || 0;
  };

  const hasCustomItems = order?.items.some(i => i.isCustom);
  const hasErrors = Object.keys(customPriceErrors).length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all custom items have a valid price
    const missingPrice = order.items.some(
      item => item.isCustom && (!customPrices[item.name] || Number(customPrices[item.name]) <= 0)
    );
    if (missingPrice) {
      setAlertDialog({ isOpen: true, type: 'warning', title: 'Missing Prices', message: 'Please set prices for all custom items' });
      return;
    }

    if (hasErrors) {
      setAlertDialog({ isOpen: true, type: 'error', title: 'Invalid Prices', message: `All custom item prices must be between ₹${priceRange.minPrice} and ₹${priceRange.maxPrice}` });
      return;
    }

    setSubmitting(true);
    try {
      const items = order.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        basePrice: item.basePrice,
        finalPrice: item.isCustom
          ? parseFloat(customPrices[item.name]) * item.quantity
          : item.finalPrice,
        isCustom: item.isCustom
      }));

      await axios.put(`/api/orders/${orderId}/review`, { items, extraCharge });

      setAlertDialog({ isOpen: true, type: 'success', title: 'Success', message: 'Order reviewed and confirmed!' });
      setTimeout(() => navigate('/provider/orders'), 2000);
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Failed to review order';
      // Sync range if server returns updated bounds
      if (error.response?.data?.minPrice !== undefined) {
        setPriceRange({ minPrice: error.response.data.minPrice, maxPrice: error.response.data.maxPrice });
      }
      setAlertDialog({ isOpen: true, type: 'error', title: 'Error', message: errMsg });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-xl text-slate-700 dark:text-slate-300">Loading order...</div>
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
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100">Review Order</h1>
        </div>

        {/* Price range banner — only shown if order has custom items */}
        {hasCustomItems && (
          <div className="mb-5 flex items-center gap-3 bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800 rounded-xl px-4 py-3">
            <Info size={18} className="text-sky-500 flex-shrink-0" />
            <p className="text-sm text-sky-700 dark:text-sky-300">
              Your custom item price range is{' '}
              <span className="font-semibold">₹{priceRange.minPrice} – ₹{priceRange.maxPrice}</span> per item.
              Prices outside this range will be blocked.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Order Info */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100">Order Information</h2>
            <div className="space-y-1 text-slate-700 dark:text-slate-300">
              <p><span className="font-medium text-slate-900 dark:text-slate-100">Order ID:</span> #{order._id.slice(-6)}</p>
              <p><span className="font-medium text-slate-900 dark:text-slate-100">Customer:</span> {order.customerId?.name}</p>
              <p><span className="font-medium text-slate-900 dark:text-slate-100">Phone:</span> {order.customerId?.phone}</p>
              <p><span className="font-medium text-slate-900 dark:text-slate-100">Address:</span> {order.pickupLocation.address}</p>
            </div>
          </div>

          {/* Items */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100">Items</h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="border-b border-slate-200 dark:border-slate-700 pb-4 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-medium text-slate-900 dark:text-slate-100">{item.name}</span>
                      {item.isCustom && (
                        <span className="ml-2 text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded-full">
                          Custom
                        </span>
                      )}
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Qty: {item.quantity}</p>
                    </div>

                    <div className="text-right">
                      {item.isCustom ? (
                        <div>
                          <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
                            Price per item (₹{priceRange.minPrice}–₹{priceRange.maxPrice})
                          </label>
                          <input
                            type="number"
                            min={priceRange.minPrice}
                            max={priceRange.maxPrice}
                            step="0.01"
                            value={customPrices[item.name] ?? ''}
                            onChange={(e) => handleCustomPriceChange(item.name, e.target.value, item.quantity)}
                            placeholder={`${priceRange.minPrice}–${priceRange.maxPrice}`}
                            className={`w-36 px-3 py-1.5 border rounded-lg focus:outline-none focus:ring-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm transition-colors ${
                              customPriceErrors[item.name]
                                ? 'border-red-400 dark:border-red-500 focus:ring-red-400'
                                : 'border-slate-300 dark:border-slate-600 focus:ring-blue-500'
                            }`}
                            required
                          />
                          {customPriceErrors[item.name] && (
                            <p className="text-xs text-red-500 dark:text-red-400 mt-1 text-right">
                              {customPriceErrors[item.name]}
                            </p>
                          )}
                          {!customPriceErrors[item.name] && customPrices[item.name] !== '' && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                              Total: ₹{((parseFloat(customPrices[item.name]) || 0) * item.quantity).toFixed(2)}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-blue-600 dark:text-blue-400 font-medium">₹{item.finalPrice}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Charges */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100">Charges</h2>
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
                <span>Distance Charge ({order.distance.toFixed(2)} km):</span>
                <span>₹{order.charges.distance.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Extra Charge:</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={extraCharge}
                  onChange={(e) => setExtraCharge(parseFloat(e.target.value) || 0)}
                  className="w-32 px-3 py-1 border border-slate-300 dark:border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>
          </div>

          {/* Total */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl shadow-lg border border-blue-200 dark:border-blue-800">
            <div className="flex justify-between items-center text-2xl font-bold">
              <span className="text-slate-900 dark:text-slate-100">Final Total:</span>
              <span className="text-blue-600 dark:text-blue-400">₹{calculateNewTotal().toFixed(2)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || hasErrors}
            className="w-full bg-gradient-to-r from-blue-600 to-violet-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
          >
            {submitting ? 'Confirming...' : 'Confirm & Send to Customer'}
          </button>
        </form>
      </div>

      <AlertDialog
        isOpen={alertDialog.isOpen}
        onClose={() => {
          setAlertDialog({ isOpen: false, type: 'info', title: '', message: '' });
          if (alertDialog.type === 'success') navigate('/provider/orders');
        }}
        title={alertDialog.title}
        message={alertDialog.message}
        type={alertDialog.type}
      />
    </DashboardLayout>
  );
};

export default ReviewOrder;
