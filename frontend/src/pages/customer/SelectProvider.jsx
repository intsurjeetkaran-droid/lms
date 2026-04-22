import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DashboardLayout from '../../components/DashboardLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import ErrorMessage from '../../components/ErrorMessage';
import { Store, MapPin } from 'lucide-react';

const SelectProvider = () => {
  const [providers, setProviders] = useState([]);
  const [providerRanges, setProviderRanges] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user's current location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        fetchProviders(latitude, longitude);
      },
      (error) => {
        console.error('Error getting location:', error);
        // Use default location (Delhi)
        setLocation({ lat: 28.6139, lng: 77.2090 });
        fetchProviders(28.6139, 77.2090);
      }
    );
  }, []);

  const fetchProviders = async (lat, lng) => {
    try {
      setError(null);
      const { data } = await axios.get(`/api/providers/nearby?lat=${lat}&lng=${lng}`);
      setProviders(data);

      // Fetch price range for each provider in parallel
      const ranges = {};
      await Promise.all(
        data.map(async (provider) => {
          try {
            const { data: range } = await axios.get(`/api/garments/price-range/${provider.userId._id}`);
            ranges[provider.userId._id] = range;
          } catch {
            ranges[provider.userId._id] = { minPrice: 20, maxPrice: 100 };
          }
        })
      );
      setProviderRanges(ranges);
    } catch (error) {
      console.error('Error fetching providers:', error);
      setError(error.response?.data?.message || 'Failed to load providers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    if (location) {
      setLoading(true);
      fetchProviders(location.lat, location.lng);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingSpinner message="Finding nearby providers..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">Select a Service Provider</h1>
          <p className="text-slate-600 dark:text-slate-400">Choose from available laundry services near you</p>
        </div>

        {error && (
          <div className="mb-6">
            <ErrorMessage 
              title="Unable to Load Providers"
              message={error}
              onRetry={handleRetry}
              variant="error"
            />
          </div>
        )}
        
        {!error && providers.length === 0 ? (
          <EmptyState
            icon={Store}
            title="No Providers Available"
            message="There are no laundry service providers in your area at the moment. Please check back later or try a different location."
            variant="info"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers.map((provider) => (
              <div
                key={provider._id}
                className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-soft hover:shadow-soft-lg transition-all cursor-pointer border border-slate-200 dark:border-slate-700 card-hover"
                onClick={() => navigate(`/customer/create-order/${provider.userId._id}`)}
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-3 bg-sky-100 dark:bg-sky-900/30 rounded-lg">
                    <Store className="text-sky-600 dark:text-sky-400" size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-1">{provider.shopName}</h3>
                    <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                      <MapPin size={14} />
                      <span>{provider.address}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Service Radius:</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">{provider.serviceRadius} km</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Contact:</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">{provider.userId.phone}</span>
                  </div>
                  {providerRanges[provider.userId._id] && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Custom item range:</span>
                      <span className="font-medium text-amber-600 dark:text-amber-400">
                        ₹{providerRanges[provider.userId._id].minPrice} – ₹{providerRanges[provider.userId._id].maxPrice}
                      </span>
                    </div>
                  )}
                </div>
                
                <button className="w-full bg-gradient-to-r from-sky-500 to-indigo-600 text-white py-3 rounded-lg hover:from-sky-600 hover:to-indigo-700 transition-all font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  Select Provider
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SelectProvider;
