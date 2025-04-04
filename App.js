import React, { useEffect, useRef, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Linking, View, StyleSheet } from 'react-native';
import AppNavigator from './AppNavigator.Js';
import { SQLiteProvider } from 'expo-sqlite';
import { initHistoryDB } from './database/cashflowDatabase.Js';
import { Amplify } from 'aws-amplify';
import * as WebBrowser from 'expo-web-browser';
import awsconfig from './amplify_outputs.json';
import { forceCheckAuthAndRedirect, hasActiveSession, checkIsFirstTimeUser } from './app/UserInterface/Utils/AuthUtils.Js';
import { initWebBrowserConfig } from './app/UserInterface/Utils/WebBrowserConfig.Js';
import LottieView from 'lottie-react-native';
import colors from './app/UserInterface/Colors/colors.Js';
import AnimationLoader from './app/UserInterface/Components/AnimationLoader.Js';

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
  const animationRef = useRef(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState('Auth');
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);
  const [showAnimation, setShowAnimation] = useState(true);
  const [authCheckComplete, setAuthCheckComplete] = useState(false);
  const [animationDurationElapsed, setAnimationDurationElapsed] = useState(false);
  const [isAnimationReady, setIsAnimationReady] = useState(false);
  const [fadeOutAnimation, setFadeOutAnimation] = useState(false);

  // Check for any deep links or handle authentication at startup
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
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
        setAuthCheckComplete(true);
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

  // Hard-coded animation duration - 4000ms (4 seconds)
  const ANIMATION_DURATION = 1500;

  // Handle animation timing - with improved initialization
  useEffect(() => {
    // Set a timer for the minimum animation duration
    const animationTimer = setTimeout(() => {
      setAnimationDurationElapsed(true);
      
      // If auth check is complete, we can proceed
      if (authCheckComplete) {
        setShowAnimation(false);
        setIsLoading(false);
      }
    }, ANIMATION_DURATION);
    
    return () => clearTimeout(animationTimer);
  }, [authCheckComplete]);

  // Effect to handle the animation playing only when it's ready
  useEffect(() => {
    if (isAnimationReady && animationRef.current) {
      // Play animation only when the component is fully ready
      animationRef.current.play();
    }
  }, [isAnimationReady]);

  // Effect to proceed when both animation duration elapsed and auth are complete
  useEffect(() => {
    if (animationDurationElapsed && authCheckComplete) {
      // Start fade-out instead of immediately hiding
      setFadeOutAnimation(true);
      
      // After a short fade, hide the animation screen
      setTimeout(() => {
        setShowAnimation(false);
        setIsLoading(false);
      }, 300); // 300ms fade transition
    }
  }, [animationDurationElapsed, authCheckComplete]);

  // Effect to handle navigation after authentication is determined
  useEffect(() => {
    if (!showAnimation && !isLoading && isAuthenticated) {
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
  }, [showAnimation, isLoading, isAuthenticated, isFirstTimeUser, initialRoute]);

  // Show animation while loading or if animation needs to complete
  if (showAnimation) {
    return (
      <AnimationLoader 
        animationRef={animationRef}
        authCheckComplete={authCheckComplete}
        fadeOutAnimation={fadeOutAnimation}
        isAnimationReady={isAnimationReady}
        animationDurationElapsed={animationDurationElapsed}
        setIsAnimationReady={setIsAnimationReady}
        setFadeOutAnimation={setFadeOutAnimation}
        setShowAnimation={setShowAnimation}
        setIsLoading={setIsLoading}
      />
    );
  }

  return (
    <View style={styles.mainContainer}>
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
    </View>
  );
}

export default App;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.darkGreenPrimary, // Match animation background
  }
});

//   <SQLiteProvider databaseName="cashflow.db" onInit={async (db) => {await initHistoryDB(db); await logDatabasePath();}}>