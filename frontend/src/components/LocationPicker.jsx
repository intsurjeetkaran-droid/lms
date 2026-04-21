import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function LocationMarker({ position, setPosition, setAddress, setLoadingAddress }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      // Reverse geocode to get address
      fetchAddress(e.latlng.lat, e.latlng.lng, setAddress, setLoadingAddress);
    },
  });

  return position ? <Marker position={position} /> : null;
}

// Function to fetch address from coordinates using Nominatim
const fetchAddress = async (lat, lng, setAddress, setLoadingAddress) => {
  if (setLoadingAddress) setLoadingAddress(true);
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
    );
    const data = await response.json();
    
    if (data && data.display_name) {
      setAddress(data.display_name);
    }
  } catch (error) {
    console.error('Error fetching address:', error);
  } finally {
    if (setLoadingAddress) setLoadingAddress(false);
  }
};

const LocationPicker = ({ onLocationSelect }) => {
  const [position, setPosition] = useState(null);
  const [address, setAddress] = useState('');
  const [loadingAddress, setLoadingAddress] = useState(false);

  useEffect(() => {
    // Get current location
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition({ lat: latitude, lng: longitude });
        // Fetch address for current location
        fetchAddress(latitude, longitude, setAddress, setLoadingAddress);
      },
      (error) => {
        console.error('Error getting location:', error);
        // Default to a location if geolocation fails
        setPosition({ lat: 28.6139, lng: 77.2090 }); // Delhi
      }
    );
  }, []);

  const handleConfirm = () => {
    if (position && address) {
      onLocationSelect({
        address,
        lat: position.lat,
        lng: position.lng
      });
    }
  };

  if (!position) {
    return <div className="text-slate-700 dark:text-slate-300">Loading map...</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2 text-slate-900 dark:text-slate-100">
          Pickup Address {loadingAddress && <span className="text-blue-600 dark:text-blue-400">(Loading...)</span>}
        </label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Click on map or enter address manually"
          className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-gray-500"
        />
      </div>

      <div className="h-96 rounded-lg overflow-hidden border-2 border-slate-200 dark:border-slate-700">
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <LocationMarker position={position} setPosition={setPosition} setAddress={setAddress} setLoadingAddress={setLoadingAddress} />
        </MapContainer>
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-400">
        💡 Click anywhere on the map to automatically fill the address
      </p>

      <button
        onClick={handleConfirm}
        disabled={!address}
        className="w-full bg-blue-600 dark:bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
      >
        Confirm Location
      </button>
    </div>
  );
};

export default LocationPicker;
