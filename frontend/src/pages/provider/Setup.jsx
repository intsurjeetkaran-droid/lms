import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DashboardLayout from '../../components/DashboardLayout';
import LocationPicker from '../../components/LocationPicker';
import AlertDialog from '../../components/AlertDialog';

const ProviderSetup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    shopName: '',
    address: '',
    location: null,
    serviceRadius: 5,
    isAvailable: true
  });
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Alert dialog state
  const [alertDialog, setAlertDialog] = useState({ isOpen: false, type: 'info', title: '', message: '' });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await axios.get('/api/providers/profile');
      setFormData({
        shopName: data.shopName,
        address: data.address,
        location: data.location,
        serviceRadius: data.serviceRadius,
        isAvailable: data.isAvailable
      });
      setIsEdit(true);
    } catch (error) {
      // Profile doesn't exist yet
      setIsEdit(false);
    }
  };

  const handleLocationSelect = (loc) => {
    setFormData({
      ...formData,
      address: loc.address,
      location: { lat: loc.lat, lng: loc.lng }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.location) {
      setAlertDialog({
        isOpen: true,
        type: 'warning',
        title: 'Location Required',
        message: 'Please set your shop location'
      });
      return;
    }

    setLoading(true);
    try {
      if (isEdit) {
        await axios.put('/api/providers/profile', formData);
        setAlertDialog({
          isOpen: true,
          type: 'success',
          title: 'Success',
          message: 'Profile updated successfully!'
        });
      } else {
        await axios.post('/api/providers/profile', formData);
        setAlertDialog({
          isOpen: true,
          type: 'success',
          title: 'Success',
          message: 'Profile created successfully!'
        });
      }
      setTimeout(() => navigate('/provider/dashboard'), 2000);
    } catch (error) {
      console.error('Error saving profile:', error);
      setAlertDialog({
        isOpen: true,
        type: 'error',
        title: 'Error',
        message: error.response?.data?.message || 'Failed to save profile'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100">
            {isEdit ? 'Update Profile' : 'Setup Provider Profile'}
          </h1>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Shop Name */}
            <div>
              <label className="block text-lg font-medium mb-2 text-slate-900 dark:text-slate-100">Shop Name</label>
              <input
                type="text"
                value={formData.shopName}
                onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                required
              />
            </div>

            {/* Service Radius */}
            <div>
              <label className="block text-lg font-medium mb-2 text-slate-900 dark:text-slate-100">
                Service Radius (km): {formData.serviceRadius}
              </label>
              <input
                type="range"
                min="1"
                max="20"
                value={formData.serviceRadius}
                onChange={(e) => setFormData({ ...formData, serviceRadius: parseInt(e.target.value) })}
                className="w-full accent-blue-600"
              />
            </div>

            {/* Availability */}
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isAvailable}
                onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                className="w-5 h-5 mr-2 rounded border-slate-300 dark:border-slate-600"
              />
              <label className="text-lg font-medium text-slate-900 dark:text-slate-100">Currently Available for Orders</label>
            </div>

            {/* Location Picker */}
            <div>
              <label className="block text-lg font-medium mb-2 text-slate-900 dark:text-slate-100">Shop Location</label>
              <LocationPicker onLocationSelect={handleLocationSelect} />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-violet-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-violet-700 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-all font-medium"
            >
              {loading ? 'Saving...' : isEdit ? 'Update Profile' : 'Create Profile'}
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
            navigate('/provider/dashboard');
          }
        }}
        title={alertDialog.title}
        message={alertDialog.message}
        type={alertDialog.type}
      />
    </DashboardLayout>
  );
};

export default ProviderSetup;
