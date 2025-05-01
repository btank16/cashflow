import * as WebBrowser from 'expo-web-browser';

/**
 * Configure the WebBrowser for OAuth flows
 * This helps handle redirects better, especially for social sign-in
 */
export const configureWebBrowser = () => {
    WebBrowser.maybeCompleteAuthSession();
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