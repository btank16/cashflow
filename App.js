import React, { useEffect, useRef, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Linking } from 'react-native';
import AppNavigator from './AppNavigator.Js';
import { SQLiteProvider } from 'expo-sqlite';
import { initHistoryDB } from './database/cashflowDatabase.Js';
import { Amplify } from 'aws-amplify';
import * as WebBrowser from 'expo-web-browser';
import awsconfig from './amplify_outputs.json';
import { forceCheckAuthAndRedirect, hasActiveSession, checkIsFirstTimeUser } from './app/UserInterface/Utils/AuthUtils.Js';
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
  const navigationRef = useRef(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState('Auth');
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);

  // Check for any deep links or handle authentication at startup
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setIsLoading(true);
        // Check if we have an active session
        const sessionActive = await hasActiveSession();
        
        if (sessionActive) {
          // If session is active, get user status
          const userStatus = await checkIsFirstTimeUser();
          
          if (userStatus.isAuthenticated) {
            setIsAuthenticated(true);
            setIsFirstTimeUser(userStatus.isFirstTimeUser);
            
            // Determine initial route based on user status
            if (userStatus.isFirstTimeUser) {
              setInitialRoute('Auth');
              // We'll navigate to the SignUpThird screen after mounting
            } else {
              setInitialRoute('Main');
            }
          } else {
            setIsAuthenticated(false);
            setInitialRoute('Auth');
          }
        } else {
          setIsAuthenticated(false);
          setInitialRoute('Auth');
        }
      } catch (error) {
        console.log('Error checking authentication status:', error);
        setIsAuthenticated(false);
        setInitialRoute('Auth');
      } finally {
        setIsLoading(false);
      }
    };

    // Check auth status when app starts
    checkAuthStatus();
    
    // Set up a listener to handle when the app returns from background
    const subscription = Linking.addEventListener('url', ({ url }) => {
      // After a short delay, check auth status again
      setTimeout(async () => {
        try {
          await checkAuthStatus();
        } catch (error) {
          console.log('Error handling URL event:', error);
        }
      }, 300);
    });
    
    return () => subscription.remove();
  }, []);

  // Effect to handle navigation after authentication is determined
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      if (isFirstTimeUser) {
        // Navigate to complete profile for first time users
        if (navigationRef.current) {
          navigationRef.current.navigate('SignUpThird', { isOAuthUser: true });
        }
      } else if (initialRoute === 'Main') {
        // Navigate to home screen for returning users
        if (navigationRef.current) {
          navigationRef.current.navigate('Main', { screen: 'CalcHomeScreen' });
        }
      }
    }
  }, [isLoading, isAuthenticated, isFirstTimeUser, initialRoute]);

  // Don't render anything while checking authentication
  if (isLoading) {
    return null; // Or a loading spinner if you prefer
  }

  return (
    <SQLiteProvider databaseName="cashflow.db" onInit={initHistoryDB}>
      <NavigationContainer
        ref={navigationRef}
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
        <AppNavigator initialRouteName={initialRoute} />
      </NavigationContainer>
    </SQLiteProvider>
  );
}

export default App;

//   <SQLiteProvider databaseName="cashflow.db" onInit={async (db) => {await initHistoryDB(db); await logDatabasePath();}}>