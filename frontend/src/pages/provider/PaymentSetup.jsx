import { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '../../components/DashboardLayout';
import AlertDialog from '../../components/AlertDialog';

const PaymentSetup = () => {
  const [formData, setFormData] = useState({
    upiId: '',
    qrCode: '',
    codEnabled: true,
    pickupCharge: 0,
    deliveryCharge: 0,
    distanceRate: 5
  });
  const [loading, setLoading] = useState(false);
  const [hasConfig, setHasConfig] = useState(false);
  
  // Alert dialog state
  const [alertDialog, setAlertDialog] = useState({ isOpen: false, type: 'info', title: '', message: '' });

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const { data: user } = await axios.get('/api/auth/me');
      const { data } = await axios.get(`/api/providers/payment-config/${user._id}`);
      setFormData(data);
      setHasConfig(true);
    } catch (error) {
      setHasConfig(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('/api/providers/payment-config', formData);
      setAlertDialog({
        isOpen: true,
        type: 'success',
        title: 'Success',
        message: 'Payment configuration saved successfully!'
      });
    } catch (error) {
      console.error('Error saving config:', error);
      setAlertDialog({
        isOpen: true,
        type: 'error',
        title: 'Error',
        message: 'Failed to save configuration'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100">Payment Setup</h1>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* UPI Configuration */}
            <div className="border-b border-slate-200 dark:border-slate-700 pb-6">
              <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100">UPI Configuration</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">UPI ID</label>
                  <input
                    type="text"
                    value={formData.upiId}
                    onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                    placeholder="yourname@upi"
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">QR Code URL</label>
                  <input
                    type="url"
                    value={formData.qrCode}
                    onChange={(e) => setFormData({ ...formData, qrCode: e.target.value })}
                    placeholder="https://example.com/qr-code.png"
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                  />
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Upload your QR code image and paste the URL here
                  </p>
                </div>
              </div>
            </div>

            {/* COD Configuration */}
            <div className="border-b border-slate-200 dark:border-slate-700 pb-6">
              <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100">Cash on Delivery</h2>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.codEnabled}
                  onChange={(e) => setFormData({ ...formData, codEnabled: e.target.checked })}
                  className="w-5 h-5 mr-2 rounded border-slate-300 dark:border-slate-600"
                />
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Enable Cash on Delivery</label>
              </div>
            </div>

            {/* Charges Configuration */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100">Charges Configuration</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Pickup Charge (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.pickupCharge}
                    onChange={(e) => setFormData({ ...formData, pickupCharge: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Delivery Charge (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.deliveryCharge}
                    onChange={(e) => setFormData({ ...formData, deliveryCharge: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Distance Rate (₹ per km)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.distanceRate}
                    onChange={(e) => setFormData({ ...formData, distanceRate: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-violet-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-violet-700 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-all font-medium"
            >
              {loading ? 'Saving...' : hasConfig ? 'Update Configuration' : 'Save Configuration'}
            </button>
          </form>
        </div>
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

export default PaymentSetup;
