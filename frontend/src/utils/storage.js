import { Preferences } from '@capacitor/preferences';

// Check if running in Capacitor (mobile)
const isCapacitor = () => {
  return window.Capacitor !== undefined;
};

/**
 * Store data securely
 * @param {string} key 
 * @param {any} value 
 */
export const setItem = async (key, value) => {
  try {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    
    if (isCapacitor()) {
      // Mobile: Use Capacitor Preferences (secure storage)
      await Preferences.set({ key, value: stringValue });
    } else {
      // Web: Use localStorage
      localStorage.setItem(key, stringValue);
    }
  } catch (error) {
    console.error('Error storing data:', error);
  }
};

/**
 * Get stored data
 * @param {string} key 
 * @returns {Promise<any>}
 */
export const getItem = async (key) => {
  try {
    if (isCapacitor()) {
      // Mobile: Use Capacitor Preferences
      const { value } = await Preferences.get({ key });
      return value;
    } else {
      // Web: Use localStorage
      return localStorage.getItem(key);
    }
  } catch (error) {
    console.error('Error getting data:', error);
    return null;
  }
};

/**
 * Remove stored data
 * @param {string} key 
 */
export const removeItem = async (key) => {
  try {
    if (isCapacitor()) {
      // Mobile: Use Capacitor Preferences
      await Preferences.remove({ key });
    } else {
      // Web: Use localStorage
      localStorage.removeItem(key);
    }
  } catch (error) {
    console.error('Error removing data:', error);
  }
};

/**
 * Clear all stored data
 */
export const clear = async () => {
  try {
    if (isCapacitor()) {
      // Mobile: Use Capacitor Preferences
      await Preferences.clear();
    } else {
      // Web: Use localStorage
      localStorage.clear();
    }
  } catch (error) {
    console.error('Error clearing data:', error);
  }
};

// Token management helpers
export const setToken = (token) => setItem('token', token);
export const getToken = () => getItem('token');
export const removeToken = () => removeItem('token');

// User management helpers
export const setUser = (user) => setItem('user', user);
export const getUser = async () => {
  const user = await getItem('user');
  return user ? JSON.parse(user) : null;
};
export const removeUser = () => removeItem('user');
