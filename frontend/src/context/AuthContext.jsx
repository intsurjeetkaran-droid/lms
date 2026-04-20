import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api';
import { logNetworkRequest, logNetworkResponse, logNetworkError } from '../utils/networkDebug';

// Configure axios base URL for mobile/web
axios.defaults.baseURL = API_BASE_URL;

// Add request interceptor for debugging
axios.interceptors.request.use(logNetworkRequest, (error) => {
  console.error('❌ Request Interceptor Error:', error);
  return Promise.reject(error);
});

// Add response interceptor for debugging
axios.interceptors.response.use(logNetworkResponse, logNetworkError);

// ============================================
// AUTH CONTEXT - Global Authentication State
// ============================================
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // User state - stores current logged-in user data
  const [user, setUser] = useState(null);
  
  // Loading state - true while checking authentication
  const [loading, setLoading] = useState(true);

  // ============================================
  // INITIAL AUTHENTICATION CHECK
  // Runs once when app loads
  // ============================================
  useEffect(() => {
    console.log('🔍 Checking for existing authentication...');
    const token = localStorage.getItem('token');
    
    if (token) {
      console.log('✅ Token found in localStorage');
      console.log(`   🔑 Token: ${token.substring(0, 20)}...`);
      
      // Set default Authorization header for all axios requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log('   📤 Authorization header set for axios');
      
      // Fetch user data from backend
      fetchUser();
    } else {
      console.log('❌ No token found in localStorage');
      setLoading(false);
    }
  }, []);

  // ============================================
  // FETCH USER DATA
  // Gets current user info from backend using token
  // ============================================
  const fetchUser = async () => {
    try {
      console.log('👤 Fetching user data from backend...');
      const { data } = await axios.get('/api/auth/me');
      
      console.log('✅ User data received:');
      console.log(`   📧 Email: ${data.email}`);
      console.log(`   👤 Name: ${data.name}`);
      console.log(`   🎭 Role: ${data.role}`);
      
      setUser(data);
    } catch (error) {
      console.error('❌ Failed to fetch user data:', error.message);
      console.log('   🗑️  Clearing invalid token...');
      
      // Token is invalid, clear it
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // LOGIN FUNCTION
  // Authenticates user with email and password
  // ============================================
  const login = async (email, password) => {
    console.log('🔐 Login attempt started');
    console.log(`   📧 Email: ${email}`);
    console.log(`   🔑 Password: ${'*'.repeat(password.length)}`);
    console.log(`   🌐 API Base URL: ${axios.defaults.baseURL}`);
    
    try {
      console.log('   📤 Sending login request to backend...');
      console.log(`   🎯 Full URL: ${axios.defaults.baseURL}/api/auth/login`);
      
      const { data } = await axios.post('/api/auth/login', { email, password });
      
      console.log('✅ Login successful!');
      console.log(`   👤 Name: ${data.name}`);
      console.log(`   🎭 Role: ${data.role}`);
      console.log(`   🔑 Token received: ${data.token.substring(0, 20)}...`);
      
      // Store token in localStorage
      console.log('   💾 Storing token in localStorage...');
      localStorage.setItem('token', data.token);
      
      // Set Authorization header for future requests
      console.log('   📤 Setting Authorization header...');
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      
      // Update user state
      console.log('   ✅ Updating user state...');
      setUser(data);
      
      console.log('🎉 Login process completed successfully!');
      return data;
    } catch (error) {
      console.error('❌ Login failed:');
      console.error('   📍 Error details:', error);
      console.error('   🌐 Request URL:', error.config?.url);
      console.error('   📦 Request data:', error.config?.data);
      console.error('   📡 Response status:', error.response?.status);
      console.error('   💬 Response message:', error.response?.data?.message);
      console.error('   🔧 Full error:', error.message);
      throw error;
    }
  };

  // ============================================
  // REGISTER FUNCTION
  // Creates new user account
  // ============================================
  const register = async (userData) => {
    console.log('📝 Registration attempt started');
    console.log(`   📧 Email: ${userData.email}`);
    console.log(`   👤 Name: ${userData.name}`);
    console.log(`   🎭 Role: ${userData.role}`);
    
    try {
      console.log('   📤 Sending registration request to backend...');
      const { data } = await axios.post('/api/auth/register', userData);
      
      console.log('✅ Registration successful!');
      console.log(`   👤 Name: ${data.name}`);
      console.log(`   🎭 Role: ${data.role}`);
      console.log(`   🔑 Token received: ${data.token.substring(0, 20)}...`);
      
      // Store token in localStorage
      console.log('   💾 Storing token in localStorage...');
      localStorage.setItem('token', data.token);
      
      // Set Authorization header for future requests
      console.log('   📤 Setting Authorization header...');
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      
      // Update user state
      console.log('   ✅ Updating user state...');
      setUser(data);
      
      console.log('🎉 Registration process completed successfully!');
      return data;
    } catch (error) {
      console.error('❌ Registration failed:', error.response?.data?.message || error.message);
      throw error;
    }
  };

  // ============================================
  // LOGOUT FUNCTION
  // Clears authentication and redirects to login
  // ============================================
  const logout = () => {
    console.log('🚪 Logout initiated');
    
    console.log('   🗑️  Removing token from localStorage...');
    localStorage.removeItem('token');
    
    console.log('   🔓 Removing Authorization header from axios...');
    delete axios.defaults.headers.common['Authorization'];
    
    console.log('   👤 Clearing user state...');
    setUser(null);
    
    console.log('✅ Logout completed successfully');
  };

  // ============================================
  // PROVIDE AUTH CONTEXT TO APP
  // ============================================
  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
