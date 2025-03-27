import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Linking } from 'react-native';
import AppNavigator from './AppNavigator.Js';
import { SQLiteProvider } from 'expo-sqlite';
import { initHistoryDB } from './database/cashflowDatabase.Js';
import { Amplify } from 'aws-amplify';
import * as WebBrowser from 'expo-web-browser';
import awsconfig from './amplify_outputs.json';
import { forceCheckAuthAndRedirect, hasActiveSession } from './app/UserInterface/Utils/AuthUtils.Js';
import { initWebBrowserConfig } from './app/UserInterface/Utils/WebBrowserConfig.Js';

// Initialize WebBrowser configuration for OAuth
initWebBrowserConfig();

// URL opener for handling OAuth flows
const urlOpener = async (url, redirectUrl) => {
  try {
    // On some mobile environments, a check for canOpenURL may be required
    const canOpen = await Linking.canOpenURL(url);
    if (!canOpen) {
      console.warn('Cannot open URL:', url);
      // Try to open anyway
    }
    
    // Simply use the system browser to open the URL
    // The redirect will be handled by the app's deep linking
    await Linking.openURL(url);
  } catch (error) {
    console.error('Error opening URL:', error);
  }
};

// Configure Amplify with Gen 2 format
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: awsconfig.auth.user_pool_id,
      userPoolClientId: awsconfig.auth.user_pool_client_id,
      identityPoolId: awsconfig.auth.identity_pool_id,
      signUpVerificationMethod: 'code',
      loginWith: {
        oauth: {
          domain: awsconfig.auth.oauth.domain,
          scopes: awsconfig.auth.oauth.scopes,
          redirectSignIn: awsconfig.auth.oauth.redirect_sign_in_uri,
          redirectSignOut: awsconfig.auth.oauth.redirect_sign_out_uri,
          responseType: awsconfig.auth.oauth.response_type,
          clientId: awsconfig.auth.user_pool_client_id,
          providers: awsconfig.auth.oauth.identity_providers
        },
        username: true,
        email: true
      }
    }
  }
});

// Handle deep links
const handleDeepLink = (event) => {
  const url = event.url;
};

Linking.addEventListener('url', handleDeepLink);

function App() {
  // Check for any deep links or handle authentication at startup
  useEffect(() => {
    const handleInitialURL = async () => {
      try {
        // Get any URL that may have launched the app
        const initialUrl = await Linking.getInitialURL();
        
        // Only check auth if there's an active session
        const sessionActive = await hasActiveSession();
        if (sessionActive) {
          await forceCheckAuthAndRedirect(null);
        }
      } catch (error) {
        // Silently handle errors
      }
    };

    handleInitialURL();
    
    // Set up a listener to handle when the app returns from background
    const subscription = Linking.addEventListener('url', ({ url }) => {
      // After a short delay, safely check auth status
      setTimeout(async () => {
        try {
          const sessionActive = await hasActiveSession();
          if (sessionActive) {
            await forceCheckAuthAndRedirect(null);
          }
        } catch (error) {
          // Silently handle errors
        }
      }, 300);
    });
    
    return () => subscription.remove();
  }, []);

  return (
    <SQLiteProvider databaseName="cashflow.db" onInit={initHistoryDB}>
      <NavigationContainer
        linking={{
          prefixes: ['cashflow://', 'https://3f63ead00107678794a4.auth.us-east-1.amazoncognito.com'],
          config: {
            screens: {
              SignIn: 'signin',
              SignUpThird: 'completeprofile',
              Main: {
                screens: {
                  CalcHomeScreen: 'home'
                }
              }
            }
          },
          onError: (error) => {
            console.error('Deep linking error:', error);
          }
        }}
      >
        <AppNavigator />
      </NavigationContainer>
    </SQLiteProvider>
  );
}

export default App;

//   <SQLiteProvider databaseName="cashflow.db" onInit={async (db) => {await initHistoryDB(db); await logDatabasePath();}}>