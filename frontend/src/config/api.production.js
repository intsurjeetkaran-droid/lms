// Production API Configuration Template
// Copy this to api.js and replace with your actual backend URL after deployment

const isCapacitor = () => {
  const result = window.Capacitor !== undefined;
  console.log('🔍 Checking if Capacitor:', result);
  return result;
};

// REPLACE THIS URL WITH YOUR RENDER BACKEND URL
const PRODUCTION_BACKEND_URL = 'https://your-backend-url.onrender.com';

const getApiBaseUrl = () => {
  const isCap = isCapacitor();
  console.log('🔧 Getting API Base URL...');
  console.log('   Is Capacitor:', isCap);
  
  // Use production backend for both web and mobile
  const url = PRODUCTION_BACKEND_URL;
  console.log('   🌐 Using Production Backend:', url);
  
  return url;
};

export const API_BASE_URL = getApiBaseUrl();

export const API_ENDPOINTS = {
  AUTH: `${API_BASE_URL}/api/auth`,
  USERS: `${API_BASE_URL}/api/users`,
  PROVIDERS: `${API_BASE_URL}/api/providers`,
  GARMENTS: `${API_BASE_URL}/api/garments`,
  ORDERS: `${API_BASE_URL}/api/orders`,
  PAYMENTS: `${API_BASE_URL}/api/payments`,
  FEEDBACK: `${API_BASE_URL}/api/feedback`,
  COMPLAINTS: `${API_BASE_URL}/api/complaints`,
  ADMIN: `${API_BASE_URL}/api/admin`
};

console.log('='.repeat(60));
console.log('🔧 API Configuration Initialized (PRODUCTION)');
console.log('   📱 Is Capacitor:', isCapacitor());
console.log('   🌐 API Base URL:', API_BASE_URL);
console.log('   🔗 Auth Endpoint:', API_ENDPOINTS.AUTH);
console.log('='.repeat(60));

export default API_BASE_URL;
