import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';

/**
 * Configure the WebBrowser for OAuth flows
 * This helps handle redirects better, especially for social sign-in
 */
export const configureWebBrowser = () => {
  // Configure web browser to use appropriate settings
  if (Platform.OS === 'android') {
    // Use custom tabs on Android for better integration
    WebBrowser.maybeCompleteAuthSession();
    WebBrowser.enableCustomTabsAutomaticallyAsync();
  } else {
    // Normal browser for iOS
    WebBrowser.maybeCompleteAuthSession();
  }
};

/**
 * Initialize the web browser configuration
 * Call this in App.js or index.js
 */
export const initWebBrowserConfig = () => {
  try {
    configureWebBrowser();
  } catch (error) {
    console.error('WebBrowser config error:', error);
  }
}; 