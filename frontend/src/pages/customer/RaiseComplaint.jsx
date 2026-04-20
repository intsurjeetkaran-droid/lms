import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DashboardLayout from '../../components/DashboardLayout';
import AlertDialog from '../../components/AlertDialog';

const RaiseComplaint = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: 'quality',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  
  // Alert dialog state
  const [alertDialog, setAlertDialog] = useState({ isOpen: false, type: 'info', title: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.description.trim()) {
      setAlertDialog({
        isOpen: true,
        type: 'warning',
        title: 'Description Required',
        message: 'Please provide a description'
      });
      return;
    }

    setLoading(true);
    try {
      await axios.post('/api/complaints', {
        orderId,
        ...formData
      });
      
      setAlertDialog({
        isOpen: true,
        type: 'success',
        title: 'Success',
        message: 'Complaint submitted successfully!'
      });
      setTimeout(() => navigate('/customer/orders'), 2000);
    } catch (error) {
      console.error('Error submitting complaint:', error);
      setAlertDialog({
        isOpen: true,
        type: 'error',
        title: 'Error',
        message: error.response?.data?.message || 'Failed to submit complaint'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100">Raise Complaint</h1>
        </div>
          
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow dark:shadow-slate-900/50">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Complaint Type */}
              <div>
                <label className="block text-lg font-medium mb-2 text-slate-900 dark:text-slate-100">Complaint Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                >
                  <option value="quality">Quality Issue</option>
                  <option value="delivery">Delivery Issue</option>
                  <option value="payment">Payment Issue</option>
                  <option value="behavior">Behavior Issue</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-lg font-medium mb-2 text-slate-900 dark:text-slate-100">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="6"
                  placeholder="Describe your complaint in detail..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-gray-500"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-600 dark:bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-700 dark:hover:bg-orange-600 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Submitting...' : 'Submit Complaint'}
              </button>
            </form>
        </div>
      </div>

      {/* Alert Dialog */}
      <AlertDialog
        isOpen={alertDialog.isOpen}
        onClose={() => {
          setAlertDialog({ isOpen: false, type: 'info', title: '', message: '' });
          if (alertDialog.type === 'success') {
            navigate('/customer/orders');
          }
        }}
        title={alertDialog.title}
        message={alertDialog.message}
        type={alertDialog.type}
      />
    </DashboardLayout>
  );
};

export default RaiseComplaint;
