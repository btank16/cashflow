import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { signIn, fetchAuthSession } from '@aws-amplify/auth';
import colors from '../../Colors/colors.Js';
import GreenLogo from '../../../assets/icons/GreenLogo.jsx';
import BackButton from '../../Components/BackButton.Js';
import NormTextbox from '../../Components/NormTextbox.Js';
import PasswordBox from '../../Components/PasswordBox.Js';
import SocialSignInButton from '../../Components/SocialSignInButton.Js';
import { handleOAuthRedirect, forceCheckAuthAndRedirect, hasActiveSession } from '../../Utils/AuthUtils.Js';
import { initUserAttributesCache, refreshUserAttributes } from '../../Utils/UserAttributesCache.Js';
import PrimaryButton from '../../Components/PrimaryButton.Js';
import ScreenLayout from '../../UtilScreens/ScreenLayout.Js';

const SignIn = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isButtonActive, setIsButtonActive] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSocialSignInLoading, setIsSocialSignInLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(false);

  // Check for active auth session when the screen mounts, but only if we have a session
  useEffect(() => {
    const initialAuthCheck = async () => {
      try {
        // First check if there's actually a session before proceeding
        const sessionActive = await hasActiveSession();
        if (sessionActive) {
          setCheckingAuth(true);
          await forceCheckAuthAndRedirect(navigation);
        }
      } catch (error) {
        // Silently handle errors
      } finally {
        setCheckingAuth(false);
      }
    };
    
    initialAuthCheck();
  }, []);

  // Check for OAuth redirects when screen focuses
  useFocusEffect(
    React.useCallback(() => {
      const checkAuthStatus = async () => {
        try {
          // Check if there's an active session before attempting auth operations
          const sessionActive = await hasActiveSession();
          if (!sessionActive) {
            setCheckingAuth(false);
            setIsSocialSignInLoading(false);
            return;
          }
          
          setCheckingAuth(true);
          // We have an active session, handle the OAuth redirect
          await handleOAuthRedirect(navigation);
        } catch (error) {
          // Silently handle errors
        } finally {
          setCheckingAuth(false);
          setIsSocialSignInLoading(false);
        }
      };

      // Only run the check when the component mounts or screen focuses
      checkAuthStatus();
    }, [navigation])
  );

  // Check if both email and password are filled
  React.useEffect(() => {
    setIsButtonActive(email.length > 0 && password.length > 0);
  }, [email, password]);

  const handleSignIn = async () => {
    if (!isButtonActive || isLoading) return;
    
    setIsLoading(true);
    try {
      const signInResult = await signIn({
        username: email.toLowerCase().trim(),
        password,
      });

      if (signInResult.isSignedIn) {
        // Initialize and refresh user attributes cache after successful sign in
        await initUserAttributesCache();
        await refreshUserAttributes();
        
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main', params: { screen: 'CalcHomeScreen' } }],
        });
      }
    } catch (error) {
      console.error('Sign in error:', error);

      let errorMessage = 'Please check your credentials and try again.';
      if (error.name === 'UserNotConfirmedException') {
        errorMessage = 'Please verify your email before signing in.';
      } else if (error.name === 'NotAuthorizedException') {
        errorMessage = 'Incorrect username or password.';
      } else if (error.name === 'UserNotFoundException') {
        errorMessage = 'No account found with this email.';
      }

      Alert.alert(
        'Sign In Failed',
        errorMessage
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <BackButton destinationScreen="IntroScreen" />
    </View>
  );

  return (
    <ScreenLayout
      header={renderHeader()}
    >
      <View style={styles.logoContainer}>
        <GreenLogo />
      </View>

      <Text style={styles.welcomeText}>Welcome back!</Text>
      
      <View style={styles.signUpContainer}>
        <Text style={styles.noAccountText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUpFirst')}>
          <Text style={styles.signUpText}>Sign Up</Text>
        </TouchableOpacity>
      </View>

      <NormTextbox
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="example@gmail.com"
        keyboardType="email-address"
        isFocused={emailFocused}
        onFocus={() => setEmailFocused(true)}
        onBlur={() => setEmailFocused(false)}
      />

      <PasswordBox
        label="Password"
        value={password}
        onChangeText={setPassword}
        isFocused={passwordFocused}
        onFocus={() => setPasswordFocused(true)}
        onBlur={() => setPasswordFocused(false)}
        showPassword={showPassword}
        onTogglePassword={() => setShowPassword(!showPassword)}
      />

      <TouchableOpacity 
        onPress={() => navigation.navigate('ForgetPassFirst')}
        style={styles.forgotPasswordContainer}
      >
        <Text style={styles.forgotPasswordText}>Forgot password?</Text>
      </TouchableOpacity>

      <PrimaryButton
        label="Sign In"
        loadingLabel="Signing In..."
        isActive={isButtonActive}
        isLoading={isLoading}
        onPress={handleSignIn}
        disabled={checkingAuth}
        style={{ marginBottom: 24 }}
      />

      <View style={styles.dividerContainer}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>or</Text>
        <View style={styles.dividerLine} />
      </View>

      <View style={styles.socialButtonsContainer}>
        <SocialSignInButton 
          provider="google" 
          onSignInStart={(loading = true) => setIsSocialSignInLoading(loading)}
          style={isSocialSignInLoading || checkingAuth ? styles.loadingButton : null}
        />
        <SocialSignInButton 
          provider="apple" 
          onSignInStart={(loading = true) => setIsSocialSignInLoading(loading)}
          style={isSocialSignInLoading || checkingAuth ? styles.loadingButton : null}
        />
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primaryBlack,
    textAlign: 'center',
    marginBottom: 8,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  noAccountText: {
    color: colors.primaryBlack,
  },
  signUpText: {
    color: colors.primaryGreen,
    fontWeight: '500',
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: colors.primaryGreen,
    fontWeight: '500',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.secondaryGrey,
  },
  dividerText: {
    marginHorizontal: 16,
    color: colors.primaryGrey,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  loadingButton: {
    opacity: 0.8,
  },
});

export default SignIn;
