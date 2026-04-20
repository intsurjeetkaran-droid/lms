import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DashboardLayout from '../../components/DashboardLayout';
import LocationPicker from '../../components/LocationPicker';
import AlertDialog from '../../components/AlertDialog';

const CreateOrder = () => {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const [garments, setGarments] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [customItem, setCustomItem] = useState({ name: '', quantity: 1 });
  const [location, setLocation] = useState(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Alert dialog state
  const [alertDialog, setAlertDialog] = useState({ isOpen: false, type: 'info', title: '', message: '' });

  useEffect(() => {
    fetchGarments();
  }, [providerId]);

  const fetchGarments = async () => {
    try {
      const { data } = await axios.get(`/api/garments/provider/${providerId}`);
      setGarments(data);
    } catch (error) {
      console.error('Error fetching garments:', error);
    }
  };

  const handleAddItem = (garment) => {
    const existing = selectedItems.find(item => item.name === garment.name);
    if (existing) {
      setSelectedItems(selectedItems.map(item =>
        item.name === garment.name
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setSelectedItems([...selectedItems, {
        name: garment.name,
        quantity: 1,
        basePrice: garment.price,
        isCustom: false
      }]);
    }
  };

  const handleAddCustomItem = () => {
    if (customItem.name && customItem.quantity > 0) {
      setSelectedItems([...selectedItems, {
        name: customItem.name,
        quantity: customItem.quantity,
        basePrice: 0,
        isCustom: true
      }]);
      setCustomItem({ name: '', quantity: 1 });
    }
  };

  const handleRemoveItem = (index) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return selectedItems.reduce((sum, item) => 
      sum + (item.basePrice * item.quantity), 0
    );
  };

  const handleSubmitOrder = async () => {
    if (!location || selectedItems.length === 0) {
      setAlertDialog({
        isOpen: true,
        type: 'warning',
        title: 'Missing Information',
        message: 'Please select items and location'
      });
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post('/api/orders', {
        providerId,
        items: selectedItems,
        pickupLocation: location
      });
      
      setAlertDialog({
        isOpen: true,
        type: 'success',
        title: 'Order Created',
        message: 'Order created successfully! Waiting for provider review.'
      });
      setTimeout(() => navigate('/customer/orders'), 2000);
    } catch (error) {
      console.error('Error creating order:', error);
      setAlertDialog({
        isOpen: true,
        type: 'error',
        title: 'Error',
        message: 'Failed to create order'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100">Create Order</h1>
        </div>

        {/* Step Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`px-4 py-2 rounded-lg font-medium transition-all ${step === 1 ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
              1. Select Items
            </div>
            <div className={`px-4 py-2 rounded-lg font-medium transition-all ${step === 2 ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
              2. Set Location
            </div>
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            {/* Available Garments */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100">Available Garments</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {garments.map((garment) => (
                  <div
                    key={garment._id}
                    className="border-2 border-slate-200 dark:border-slate-700 p-4 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 cursor-pointer transition-all bg-white dark:bg-slate-900 hover:shadow-lg"
                    onClick={() => handleAddItem(garment)}
                  >
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">{garment.name}</h3>
                    <p className="text-blue-600 dark:text-blue-400 font-medium">₹{garment.price}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Item */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100">Add Custom Item</h2>
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Item name"
                  value={customItem.name}
                  onChange={(e) => setCustomItem({ ...customItem, name: e.target.value })}
                  className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  min="1"
                  value={customItem.quantity}
                  onChange={(e) => setCustomItem({ ...customItem, quantity: parseInt(e.target.value) })}
                  className="w-24 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleAddCustomItem}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-all"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Selected Items */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100">Selected Items</h2>
              {selectedItems.length === 0 ? (
                <p className="text-slate-500 dark:text-slate-400">No items selected</p>
              ) : (
                <div className="space-y-2">
                  {selectedItems.map((item, index) => (
                    <div key={index} className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2">
                      <div>
                        <span className="font-medium text-slate-900 dark:text-slate-100">{item.name}</span>
                        {item.isCustom && <span className="text-sm text-orange-600 dark:text-orange-400 ml-2">(Custom)</span>}
                        <span className="text-slate-600 dark:text-slate-400 ml-2">x {item.quantity}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-blue-600 dark:text-blue-400 font-medium">
                          {item.isCustom ? 'Price TBD' : `₹${item.basePrice * item.quantity}`}
                        </span>
                        <button
                          onClick={() => handleRemoveItem(index)}
                          className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="text-xl font-bold text-right pt-4 text-slate-900 dark:text-slate-100">
                    Estimated Total: ₹{calculateTotal()}
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 text-right">
                    (Final price will include pickup, delivery, and distance charges)
                  </p>
                </div>
              )}
              
              <button
                onClick={() => setStep(2)}
                disabled={selectedItems.length === 0}
                className="w-full mt-4 bg-gradient-to-r from-blue-600 to-violet-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-violet-700 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-all"
              >
                Next: Set Location
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100">Set Pickup Location</h2>
            <LocationPicker onLocationSelect={setLocation} />
            
            {location && (
              <div className="mt-4 space-y-4">
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="font-medium text-green-900 dark:text-green-100">Location confirmed!</p>
                  <p className="text-sm text-green-700 dark:text-green-300">{location.address}</p>
                </div>
                
                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300 py-3 rounded-lg hover:bg-slate-400 dark:hover:bg-slate-600 transition-all font-medium"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmitOrder}
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-violet-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-violet-700 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-all font-medium"
                  >
                    {loading ? 'Creating...' : 'Create Order'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
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

export default CreateOrder;
