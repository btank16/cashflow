import React, { useState, useEffect } from 'react';
import { TouchableOpacity, View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { signInWithRedirect } from '@aws-amplify/auth';
import * as WebBrowser from 'expo-web-browser';
import { useNavigation } from '@react-navigation/native';
import colors from '../Colors/colors.Js';
import GoogleIcon from '../../assets/icons/GoogleIcon.jsx';
import AppleIcon from '../../assets/icons/AppleIcon.jsx';
import { hasActiveSession, forceCheckAuthAndRedirect } from '../Utils/AuthUtils.Js';
import { initUserAttributesCache, refreshUserAttributes } from '../Utils/UserAttributesCache.Js';

// Initialize WebBrowser
WebBrowser.maybeCompleteAuthSession();

const SocialSignInButton = ({ provider, onSignInStart, style }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  
  // Use an effect to clean up timeouts when component unmounts
  useEffect(() => {
    let checkSessionTimer = null;
    
    // Register a cleanup function to clear the timer if component unmounts
    return () => {
      if (checkSessionTimer) clearTimeout(checkSessionTimer);
    };
  }, []);

  const handleSignIn = async () => {
    try {
      // Update loading state
      setIsLoading(true);
      if (onSignInStart) {
        onSignInStart(true);
      }
      
      // Get the provider name in the format Amplify expects
      const providerName = provider === 'google' ? 'Google' : 'Apple';
      
      // Initiate the sign-in with redirect
      await signInWithRedirect({
        provider: providerName,
        options: {
          // Adding a custom state helps prevent caching issues
          customState: Date.now().toString()
        }
      });
      
      // Set up a timer to check session after redirect
      // This will run when the app regains focus after the OAuth process
      setTimeout(async () => {
        try {
          // First check if there's an active session before proceeding
          const sessionActive = await hasActiveSession();
          if (sessionActive) {
            // Initialize and refresh user attributes cache after successful OAuth sign-in
            await initUserAttributesCache();
            await refreshUserAttributes();
            
            await forceCheckAuthAndRedirect(navigation);
          }
        } catch (error) {
          // Silently handle errors
        } finally {
          setIsLoading(false);
          if (onSignInStart) {
            onSignInStart(false);
          }
        }
      }, 500);
      
    } catch (error) {
      // Just show a generic error without detailed logging
      Alert.alert(
        'Sign In Error',
        `Unable to sign in with ${provider.charAt(0).toUpperCase() + provider.slice(1)}. Please try again later.`
      );
      setIsLoading(false);
      if (onSignInStart) {
        onSignInStart(false);
      }
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.socialButton, style, isLoading && styles.disabledButton]} 
      onPress={handleSignIn}
      disabled={isLoading}
    >
      <View style={styles.socialIconContainer}>
        {isLoading ? (
          <ActivityIndicator size="small" color={colors.primaryGreen} />
        ) : (
          provider === 'google' ? <GoogleIcon /> : <AppleIcon />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.tertiaryGrey,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialIconContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.7,
  }
});

export default SocialSignInButton; 