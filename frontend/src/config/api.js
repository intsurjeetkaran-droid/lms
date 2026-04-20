// API Configuration for Web and Mobile
const isCapacitor = () => {
  const result = window.Capacitor !== undefined;
  console.log('🔍 Checking if Capacitor:', result);
  console.log('   window.Capacitor:', window.Capacitor);
  return result;
};

// Production backend URL - HARDCODED for Render deployment
const PRODUCTION_BACKEND = 'https://lms-d0q1.onrender.com';

// Determine the API base URL based on environment
const getApiBaseUrl = () => {
  const isCap = isCapacitor();
  console.log('🔧 Getting API Base URL...');
  console.log('   Is Capacitor:', isCap);
  console.log('   Window Location:', window.location.origin);
  
  // ALWAYS use production backend
  const url = PRODUCTION_BACKEND;
  console.log('   🌐 Using Production Backend:', url);
  console.log('   ✅ Hardcoded Backend URL (No localhost)');
  
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
console.log('   ✅ Production Mode: Render Deployment');
console.log('   🎯 Backend Server: lms-d0q1.onrender.com');
console.log('='.repeat(60));

export default API_BASE_URL;
