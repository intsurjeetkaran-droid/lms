// Network debugging utility for mobile
export const logNetworkRequest = (config) => {
  console.log('🌐 Network Request:');
  console.log('   Method:', config.method?.toUpperCase());
  console.log('   URL:', config.url);
  console.log('   Base URL:', config.baseURL);
  console.log('   Full URL:', `${config.baseURL || ''}${config.url}`);
  console.log('   Headers:', JSON.stringify(config.headers, null, 2));
  if (config.data) {
    console.log('   Data:', JSON.stringify(config.data, null, 2));
  }
  return config;
};

export const logNetworkResponse = (response) => {
  console.log('✅ Network Response:');
  console.log('   Status:', response.status);
  console.log('   Status Text:', response.statusText);
  console.log('   Data:', JSON.stringify(response.data, null, 2));
  return response;
};

export const logNetworkError = (error) => {
  console.error('❌ Network Error:');
  console.error('   Message:', error.message);
  if (error.response) {
    console.error('   Response Status:', error.response.status);
    console.error('   Response Data:', JSON.stringify(error.response.data, null, 2));
  } else if (error.request) {
    console.error('   No Response Received');
    console.error('   Request:', error.request);
  } else {
    console.error('   Error Details:', error);
  }
  return Promise.reject(error);
};
