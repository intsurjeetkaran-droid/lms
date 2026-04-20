import { Geolocation } from '@capacitor/geolocation';

// Check if running in Capacitor (mobile)
const isCapacitor = () => {
  return window.Capacitor !== undefined;
};

/**
 * Get current position using Capacitor Geolocation (mobile) or browser API (web)
 * @returns {Promise<{lat: number, lng: number}>}
 */
export const getCurrentPosition = async () => {
  try {
    if (isCapacitor()) {
      // Mobile: Use Capacitor Geolocation
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      });
      
      return {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
    } else {
      // Web: Use browser Geolocation API
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
          },
          (error) => {
            reject(error);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
        );
      });
    }
  } catch (error) {
    console.error('Error getting location:', error);
    throw error;
  }
};

/**
 * Request location permissions (mainly for mobile)
 * @returns {Promise<boolean>}
 */
export const requestLocationPermission = async () => {
  try {
    if (isCapacitor()) {
      const permission = await Geolocation.requestPermissions();
      return permission.location === 'granted';
    }
    return true; // Browser handles permissions automatically
  } catch (error) {
    console.error('Error requesting location permission:', error);
    return false;
  }
};

/**
 * Check if location permissions are granted
 * @returns {Promise<boolean>}
 */
export const checkLocationPermission = async () => {
  try {
    if (isCapacitor()) {
      const permission = await Geolocation.checkPermissions();
      return permission.location === 'granted';
    }
    return true; // Browser handles permissions automatically
  } catch (error) {
    console.error('Error checking location permission:', error);
    return false;
  }
};
