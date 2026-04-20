import { App } from '@capacitor/app';
import { SplashScreen } from '@capacitor/splash-screen';

// Check if running in Capacitor (mobile)
export const isCapacitor = () => {
  return window.Capacitor !== undefined;
};

/**
 * Initialize Capacitor plugins and setup
 */
export const initializeCapacitor = async () => {
  if (!isCapacitor()) {
    console.log('Running in web mode');
    return;
  }

  console.log('Initializing Capacitor...');

  try {
    // Hide splash screen after app is ready
    await SplashScreen.hide();

    // Listen for app state changes
    App.addListener('appStateChange', ({ isActive }) => {
      console.log('App state changed. Is active:', isActive);
    });

    // Listen for back button (Android)
    App.addListener('backButton', ({ canGoBack }) => {
      if (!canGoBack) {
        App.exitApp();
      } else {
        window.history.back();
      }
    });

    console.log('Capacitor initialized successfully');
  } catch (error) {
    console.error('Error initializing Capacitor:', error);
  }
};

/**
 * Get app info
 */
export const getAppInfo = async () => {
  if (!isCapacitor()) {
    return {
      name: 'LaundryApp',
      version: '1.0.0',
      build: '1',
      platform: 'web'
    };
  }

  try {
    const info = await App.getInfo();
    return {
      name: info.name,
      version: info.version,
      build: info.build,
      platform: 'mobile'
    };
  } catch (error) {
    console.error('Error getting app info:', error);
    return null;
  }
};
