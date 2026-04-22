import { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '../../components/DashboardLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import ErrorMessage from '../../components/ErrorMessage';
import ConfirmDialog from '../../components/ConfirmDialog';
import AlertDialog from '../../components/AlertDialog';
import { Shirt, Plus, Pencil, Check, X } from 'lucide-react';

const ManageGarments = () => {
  const [garments, setGarments] = useState([]);
  const [formData, setFormData] = useState({ name: '', price: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);
  const [priceError, setPriceError] = useState('');

  // Price range state
  const [priceRange, setPriceRange] = useState({ minPrice: 20, maxPrice: 100 });
  const [editingRange, setEditingRange] = useState(false);
  const [rangeForm, setRangeForm] = useState({ minPrice: '', maxPrice: '' });
  const [rangeError, setRangeError] = useState('');
  const [rangeSaving, setRangeSaving] = useState(false);

  // Dialog states
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, garmentId: null });
  const [alertDialog, setAlertDialog] = useState({ isOpen: false, type: 'info', title: '', message: '' });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchPriceRange();
    fetchGarments();
  }, []);

  const fetchPriceRange = async () => {
    try {
      const { data } = await axios.get('/api/garments/my-price-range');
      setPriceRange(data);
      setRangeForm({ minPrice: data.minPrice, maxPrice: data.maxPrice });
    } catch (error) {
      console.error('Error fetching price range:', error);
    }
  };

  const fetchGarments = async () => {
    try {
      setError(null);
      setFetchLoading(true);
      const { data } = await axios.get('/api/garments/my-garments');
      setGarments(data);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load garments. Please try again.');
    } finally {
      setFetchLoading(false);
    }
  };

  // ── Price range editing ──────────────────────────────────────────────────

  const validateRange = (min, max) => {
    const minN = Number(min);
    const maxN = Number(max);
    if (isNaN(minN) || isNaN(maxN)) return 'Enter valid numbers';
    if (minN < 0 || maxN < 0) return 'Prices cannot be negative';
    if (maxN <= minN) return 'Max must be greater than min';
    return '';
  };

  const handleRangeChange = (field, value) => {
    const updated = { ...rangeForm, [field]: value };
    setRangeForm(updated);
    setRangeError(validateRange(updated.minPrice, updated.maxPrice));
  };

  const saveRange = async () => {
    const err = validateRange(rangeForm.minPrice, rangeForm.maxPrice);
    if (err) { setRangeError(err); return; }

    setRangeSaving(true);
    try {
      const { data } = await axios.put('/api/garments/my-price-range', {
        minPrice: Number(rangeForm.minPrice),
        maxPrice: Number(rangeForm.maxPrice)
      });
      setPriceRange({ minPrice: data.minPrice, maxPrice: data.maxPrice });
      setEditingRange(false);
      setRangeError('');
      setAlertDialog({
        isOpen: true,
        type: 'success',
        title: 'Range Updated',
        message: `Custom item price range set to ₹${data.minPrice} – ₹${data.maxPrice}`
      });
    } catch (error) {
      setRangeError(error.response?.data?.message || 'Failed to update range');
    } finally {
      setRangeSaving(false);
    }
  };

  const cancelRangeEdit = () => {
    setRangeForm({ minPrice: priceRange.minPrice, maxPrice: priceRange.maxPrice });
    setRangeError('');
    setEditingRange(false);
  };

  // ── Garment price validation ─────────────────────────────────────────────

  const handlePriceChange = (value) => {
    setFormData({ ...formData, price: value });
    const num = Number(value);
    if (value === '') {
      setPriceError('');
    } else if (isNaN(num) || num < priceRange.minPrice || num > priceRange.maxPrice) {
      setPriceError(`Must be between ₹${priceRange.minPrice} and ₹${priceRange.maxPrice}`);
    } else {
      setPriceError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price) {
      setAlertDialog({ isOpen: true, type: 'warning', title: 'Missing Fields', message: 'Please fill in all fields' });
      return;
    }

    const numericPrice = Number(formData.price);
    if (isNaN(numericPrice) || numericPrice < priceRange.minPrice || numericPrice > priceRange.maxPrice) {
      setPriceError(`Must be between ₹${priceRange.minPrice} and ₹${priceRange.maxPrice}`);
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        await axios.put(`/api/garments/${editingId}`, formData);
        setAlertDialog({ isOpen: true, type: 'success', title: 'Success', message: 'Garment updated successfully!' });
      } else {
        await axios.post('/api/garments', formData);
        setAlertDialog({ isOpen: true, type: 'success', title: 'Success', message: 'Garment added successfully!' });
      }
      setFormData({ name: '', price: '' });
      setPriceError('');
      setEditingId(null);
      fetchGarments();
    } catch (error) {
      // Sync range if server returns updated bounds
      if (error.response?.data?.minPrice !== undefined) {
        const { minPrice, maxPrice } = error.response.data;
        setPriceRange({ minPrice, maxPrice });
        setRangeForm({ minPrice, maxPrice });
      }
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
    setPriceError('');
    setEditingId(garment._id);
  };

  const handleToggleActive = async (id, isActive) => {
    try {
      await axios.put(`/api/garments/${id}`, { isActive: !isActive });
      fetchGarments();
    } catch (error) {
      setAlertDialog({ isOpen: true, type: 'error', title: 'Error', message: 'Failed to update garment status' });
    }
  };

  const handleDelete = (id) => setConfirmDialog({ isOpen: true, garmentId: id });

  const confirmDelete = async () => {
    const { garmentId } = confirmDialog;
    setActionLoading(true);
    try {
      await axios.delete(`/api/garments/${garmentId}`);
      setConfirmDialog({ isOpen: false, garmentId: null });
      setAlertDialog({ isOpen: true, type: 'success', title: 'Success', message: 'Garment deleted successfully!' });
      fetchGarments();
    } catch (error) {
      setConfirmDialog({ isOpen: false, garmentId: null });
      setAlertDialog({ isOpen: true, type: 'error', title: 'Error', message: error.response?.data?.message || 'Failed to delete garment' });
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

        {/* ── Custom Item Price Range Card ── */}
        <div className="mb-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Custom Item Price Range</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Customers will see this range as a hint when adding custom items to their order.
              </p>
            </div>
            {!editingRange && (
              <button
                onClick={() => setEditingRange(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 rounded-lg hover:bg-sky-100 dark:hover:bg-sky-900/50 transition-all"
              >
                <Pencil size={13} />
                Edit Range
              </button>
            )}
          </div>

          {!editingRange ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 dark:text-slate-400">Min</span>
                <span className="text-xl font-bold text-sky-600 dark:text-sky-400">₹{priceRange.minPrice}</span>
              </div>
              <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-sky-400 to-indigo-500 rounded-full w-full" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 dark:text-slate-400">Max</span>
                <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">₹{priceRange.maxPrice}</span>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Min Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={rangeForm.minPrice}
                    onChange={(e) => handleRangeChange('minPrice', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 ${
                      rangeError ? 'border-red-400 focus:ring-red-400' : 'border-slate-300 dark:border-slate-600 focus:ring-sky-500'
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Max Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={rangeForm.maxPrice}
                    onChange={(e) => handleRangeChange('maxPrice', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 ${
                      rangeError ? 'border-red-400 focus:ring-red-400' : 'border-slate-300 dark:border-slate-600 focus:ring-sky-500'
                    }`}
                  />
                </div>
                <div className="flex gap-2 pt-5">
                  <button
                    onClick={saveRange}
                    disabled={rangeSaving || !!rangeError}
                    className="flex items-center gap-1 px-3 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm transition-all"
                  >
                    <Check size={14} />
                    {rangeSaving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={cancelRangeEdit}
                    className="flex items-center gap-1 px-3 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 text-sm transition-all"
                  >
                    <X size={14} />
                    Cancel
                  </button>
                </div>
              </div>
              {rangeError && <p className="text-xs text-red-500 dark:text-red-400">{rangeError}</p>}
            </div>
          )}
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
                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                  Price (₹)
                  <span className="ml-2 text-xs font-normal text-slate-400">
                    ₹{priceRange.minPrice} – ₹{priceRange.maxPrice}
                  </span>
                </label>
                <input
                  type="number"
                  min={priceRange.minPrice}
                  max={priceRange.maxPrice}
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handlePriceChange(e.target.value)}
                  placeholder={`${priceRange.minPrice} – ${priceRange.maxPrice}`}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors ${
                    priceError
                      ? 'border-red-400 dark:border-red-500 focus:ring-red-400'
                      : 'border-slate-300 dark:border-slate-600 focus:ring-sky-500'
                  }`}
                  required
                />
                {priceError && (
                  <p className="mt-1 text-xs text-red-500 dark:text-red-400">{priceError}</p>
                )}
                {/* Range progress bar */}
                {formData.price !== '' && !priceError && (
                  <div className="mt-2">
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                      <div
                        className="bg-sky-500 h-1.5 rounded-full transition-all"
                        style={{
                          width: `${Math.min(100, Math.max(0,
                            ((Number(formData.price) - priceRange.minPrice) / (priceRange.maxPrice - priceRange.minPrice)) * 100
                          ))}%`
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading || !!priceError}
                  className="flex-1 bg-gradient-to-r from-sky-500 to-indigo-600 text-white py-2 rounded-lg hover:from-sky-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                >
                  {loading ? 'Saving...' : editingId ? 'Update' : 'Add'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={() => { setFormData({ name: '', price: '' }); setPriceError(''); setEditingId(null); }}
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
              <ErrorMessage title="Unable to Load Garments" message={error} onRetry={fetchGarments} variant="error" />
            ) : garments.length === 0 ? (
              <EmptyState
                icon={Shirt}
                title="No Garments Added"
                message="Start by adding garments and their prices to your catalog."
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
                            ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-200'
                            : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200'
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
