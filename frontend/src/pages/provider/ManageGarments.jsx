import { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '../../components/DashboardLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import ErrorMessage from '../../components/ErrorMessage';
import ConfirmDialog from '../../components/ConfirmDialog';
import AlertDialog from '../../components/AlertDialog';
import { Shirt, Plus } from 'lucide-react';

const ManageGarments = () => {
  const [garments, setGarments] = useState([]);
  const [formData, setFormData] = useState({ name: '', price: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Dialog states
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, garmentId: null });
  const [alertDialog, setAlertDialog] = useState({ isOpen: false, type: 'info', title: '', message: '' });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchGarments();
  }, []);

  const fetchGarments = async () => {
    try {
      setError(null);
      setFetchLoading(true);
      const { data } = await axios.get('/api/garments/my-garments');
      setGarments(data);
    } catch (error) {
      console.error('Error fetching garments:', error);
      setError(error.response?.data?.message || 'Failed to load garments. Please try again.');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price) {
      setAlertDialog({
        isOpen: true,
        type: 'warning',
        title: 'Missing Fields',
        message: 'Please fill in all fields'
      });
      return;
    }

    setLoading(true);

    try {
      if (editingId) {
        await axios.put(`/api/garments/${editingId}`, formData);
        setAlertDialog({
          isOpen: true,
          type: 'success',
          title: 'Success',
          message: 'Garment updated successfully!'
        });
      } else {
        await axios.post('/api/garments', formData);
        setAlertDialog({
          isOpen: true,
          type: 'success',
          title: 'Success',
          message: 'Garment added successfully!'
        });
      }
      
      setFormData({ name: '', price: '' });
      setEditingId(null);
      fetchGarments();
    } catch (error) {
      console.error('Error saving garment:', error);
      setAlertDialog({
        isOpen: true,
        type: 'error',
        title: 'Error',
        message: error.response?.data?.message || 'Failed to save garment'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (garment) => {
    setFormData({ name: garment.name, price: garment.price });
    setEditingId(garment._id);
  };

  const handleToggleActive = async (id, isActive) => {
    try {
      await axios.put(`/api/garments/${id}`, { isActive: !isActive });
      fetchGarments();
    } catch (error) {
      console.error('Error toggling garment:', error);
      setAlertDialog({
        isOpen: true,
        type: 'error',
        title: 'Error',
        message: 'Failed to update garment status'
      });
    }
  };

  const handleDelete = async (id) => {
    setConfirmDialog({ isOpen: true, garmentId: id });
  };

  const confirmDelete = async () => {
    const { garmentId } = confirmDialog;
    setActionLoading(true);

    try {
      await axios.delete(`/api/garments/${garmentId}`);
      setConfirmDialog({ isOpen: false, garmentId: null });
      setAlertDialog({
        isOpen: true,
        type: 'success',
        title: 'Success',
        message: 'Garment deleted successfully!'
      });
      fetchGarments();
    } catch (error) {
      console.error('Error deleting garment:', error);
      setConfirmDialog({ isOpen: false, garmentId: null });
      setAlertDialog({
        isOpen: true,
        type: 'error',
        title: 'Error',
        message: error.response?.data?.message || 'Failed to delete garment'
      });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">Manage Garments</h1>
          <p className="text-slate-600 dark:text-slate-400">Add and manage your laundry service items and pricing</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add/Edit Form */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-soft border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Plus size={24} className="text-sky-500" />
              {editingId ? 'Edit Garment' : 'Add New Garment'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Garment Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Shirt, Jeans"
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Price (₹)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                  required
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-sky-500 to-indigo-600 text-white py-2 rounded-lg hover:from-sky-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                >
                  {loading ? 'Saving...' : editingId ? 'Update' : 'Add'}
                </button>
                
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ name: '', price: '' });
                      setEditingId(null);
                    }}
                    className="px-4 bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-400 dark:hover:bg-slate-600 transition-all"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Garments List */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-soft border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100">Your Garments</h2>
            
            {fetchLoading ? (
              <LoadingSpinner message="Loading garments..." />
            ) : error ? (
              <ErrorMessage 
                title="Unable to Load Garments"
                message={error}
                onRetry={fetchGarments}
                variant="error"
              />
            ) : garments.length === 0 ? (
              <EmptyState
                icon={Shirt}
                title="No Garments Added"
                message="Start by adding garments and their prices to your catalog. This will help customers see what services you offer."
                variant="info"
              />
            ) : (
              <div className="space-y-2">
                {garments.map((garment) => (
                  <div
                    key={garment._id}
                    className={`flex justify-between items-center p-4 border border-slate-200 dark:border-slate-700 rounded-lg transition-all ${
                      !garment.isActive ? 'bg-slate-50 dark:bg-slate-900/50 opacity-60' : 'bg-white dark:bg-slate-800'
                    }`}
                  >
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100">{garment.name}</h3>
                      <p className="text-sky-600 dark:text-sky-400 font-medium">₹{garment.price}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-500">
                        {garment.isActive ? '✓ Active' : '✗ Inactive'}
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(garment)}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleActive(garment._id, garment.isActive)}
                        className={`px-3 py-1 rounded transition-all text-sm ${
                          garment.isActive
                            ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/50'
                            : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50'
                        }`}
                      >
                        {garment.isActive ? 'Disable' : 'Enable'}
                      </button>
                      <button
                        onClick={() => handleDelete(garment._id)}
                        className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-900/50 transition-all text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, garmentId: null })}
        onConfirm={confirmDelete}
        title="Delete Garment"
        message="Are you sure you want to delete this garment? This action cannot be undone."
        confirmText="Delete"
        type="error"
        loading={actionLoading}
      />

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

export default ManageGarments;
