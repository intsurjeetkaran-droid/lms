// API Configuration for Web and Mobile
const isCapacitor = () => {
  const result = window.Capacitor !== undefined;
  console.log('🔍 Checking if Capacitor:', result);
  console.log('   window.Capacitor:', window.Capacitor);
  return result;
};

// Determine the API base URL based on environment
// For mobile: Use your computer's IP address (phone must be on same WiFi)
// For web: Use localhost
const getApiBaseUrl = () => {
  const isCap = isCapacitor();
  console.log('🔧 Getting API Base URL...');
  console.log('   Is Capacitor:', isCap);
  
  if (isCap) {
    // For Physical Device: Use your computer's IP address on same WiFi
    const url = 'http://192.168.1.98:5000';
    console.log('   📱 Mobile Mode - Using:', url);
    console.log('   ⚠️  Phone must be on same WiFi as computer!');
    return url;
  } else {
    // For web browser
    const url = 'http://localhost:5000';
    console.log('   🌐 Web Mode - Using:', url);
    return url;
  }
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
console.log('🔧 API Configuration Initialized');
console.log('   📱 Is Capacitor:', isCapacitor());
console.log('   🌐 API Base URL:', API_BASE_URL);
console.log('   🔗 Auth Endpoint:', API_ENDPOINTS.AUTH);
console.log('   💡 For Physical Phone: Ensure same WiFi network');
console.log('   💡 Your Computer IP: 192.168.1.98');
console.log('='.repeat(60));

export default API_BASE_URL;
