import React, { useEffect, useRef, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Linking, View, StyleSheet } from 'react-native';
import AppNavigator from './AppNavigator.Js';
import { Amplify } from 'aws-amplify';
import awsconfig from './amplify_outputs.json';
import { hasActiveSession, checkIsFirstTimeUser } from './app/UserInterface/Utils/AuthUtils.Js';
import { initWebBrowserConfig } from './app/UserInterface/Utils/WebBrowserConfig.Js';
import { initUserAttributesCache, clearUserAttributesCache } from './app/UserInterface/Utils/UserAttributesCache.Js';
import { initDataCache, clearDataCache } from './app/UserInterface/Utils/DataCache.Js';
import colors from './app/UserInterface/Colors/colors.Js';
import AnimationLoader from './app/UserInterface/Components/AnimationLoader.Js';
import { PostHogProvider } from 'posthog-react-native';
import secretKeys from './secretkeys.json';

// Initialize WebBrowser configuration for OAuth
initWebBrowserConfig();

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
        email: true,
      }
    }
  },
  // Correct format for Data API (using Gen 2 notation)
  API: {
    GraphQL: {
      endpoint: awsconfig.data.url,
      region: awsconfig.data.aws_region,
      defaultAuthMode: 'userPool'
    }
  },
  // Keep the Data configuration for backward compatibility
  Data: {
    endpoint: awsconfig.data.url,
    region: awsconfig.data.aws_region,
    authMode: 'userPool'
  }
});

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
          // Initialize user attributes cache if session is active
          await initUserAttributesCache();
          
          // Initialize data caches if session is active
          await initDataCache();
          
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
            // Clear attributes cache if not authenticated
            clearUserAttributesCache();
            clearDataCache();
          }
        } else {
          setIsAuthenticated(false);
          setInitialRoute('Auth');
          // Clear attributes cache if no session
          clearUserAttributesCache();
          clearDataCache();
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

  // Configure PostHog options
  const posthogOptions = {
    host: secretKeys.posthog.host,
    // Disable automatic screen tracking to prevent navigation errors
    disableNavigationTracking: true
  };

  return (
    <View style={styles.mainContainer}>
      <NavigationContainer
        ref={navigationRef}
        linking={{
          prefixes: ['cashflow://', `https://${awsconfig.auth.oauth.domain}`],
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
        onReady={() => {
          // Initialize PostHog after navigation is ready
          const routeNameRef = navigationRef.current?.getCurrentRoute()?.name;
          if (routeNameRef) {
            // You can manually track screen views here if needed
          }
        }}
        onStateChange={() => {
          const previousRouteName = navigationRef.current?.getCurrentRoute()?.name;
          const currentRouteName = navigationRef.current?.getCurrentRoute()?.name;
          
          if (previousRouteName !== currentRouteName) {
            // You can manually track screen changes here if needed
          }
        }}
      >
        <PostHogProvider 
          apiKey={secretKeys.posthog.apikey}
          options={posthogOptions}
        >
          <AppNavigator initialRouteName={initialRoute} />
        </PostHogProvider>
      </NavigationContainer>
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