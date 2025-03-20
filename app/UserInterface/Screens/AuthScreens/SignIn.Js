import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Platform, StatusBar, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signIn } from '@aws-amplify/auth';
import colors from '../../Colors/colors.Js';
import GreenLogo from '../../../assets/icons/GreenLogo.jsx';
import GoogleIcon from '../../../assets/icons/GoogleIcon.jsx';
import AppleIcon from '../../../assets/icons/AppleIcon.jsx';
import BackButton from '../../Components/BackButton.Js';
import NormTextbox from '../../Components/NormTextbox.Js';
import PasswordBox from '../../Components/PasswordBox.Js';

const SignIn = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isButtonActive, setIsButtonActive] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if both email and password are filled
  React.useEffect(() => {
    setIsButtonActive(email.length > 0 && password.length > 0);
  }, [email, password]);

  const handleSignIn = async () => {
    if (!isButtonActive || isLoading) return;
    
    setIsLoading(true);
    try {
      console.log('Attempting to sign in with:', { username: email });
      
      const signInResult = await signIn({
        username: email.toLowerCase().trim(),
        password,
      });

      console.log('Sign in result:', signInResult);

      if (signInResult.isSignedIn) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main', params: { screen: 'CalcHomeScreen' } }],
        });
      }
    } catch (error) {
      console.error('Sign in error details:', {
        name: error.name,
        message: error.message,
        code: error.code
      });

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <BackButton destinationScreen="IntroScreen" />
        </View>

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
          onPress={() => navigation.navigate('ForgotPassword')}
          style={styles.forgotPasswordContainer}
        >
          <Text style={styles.forgotPasswordText}>Forgot password?</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.signInButton,
            isButtonActive ? styles.activeButton : styles.inactiveButton,
            isLoading && styles.loadingButton
          ]}
          onPress={handleSignIn}
          disabled={!isButtonActive || isLoading}
        >
          <Text style={styles.signInButtonText}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Text>
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.socialButtonsContainer}>
          <TouchableOpacity style={[styles.socialButton, styles.disabledButton]} disabled>
            <View style={styles.socialIconContainer}>
              <GoogleIcon />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.socialButton, styles.disabledButton]} disabled>
            <View style={styles.socialIconContainer}>
              <AppleIcon />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.iconWhite,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    height: 56,
    justifyContent: 'center',
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
  signInButton: {
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  activeButton: {
    backgroundColor: colors.primaryGreen,
  },
  inactiveButton: {
    backgroundColor: colors.tertiaryGreen,
  },
  signInButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.iconWhite,
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
  loadingButton: {
    opacity: 0.8,
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default SignIn;
