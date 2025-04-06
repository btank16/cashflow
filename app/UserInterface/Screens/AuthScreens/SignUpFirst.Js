import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { fetchAuthSession } from '@aws-amplify/auth';
import colors from '../../Colors/colors.Js';
import BackButton from '../../Components/BackButton.Js';
import MailIcon from '../../../assets/icons/MailIcon.jsx';
import NormTextbox from '../../Components/NormTextbox.Js';
import SocialSignInButton from '../../Components/SocialSignInButton.Js';
import { handleOAuthRedirect, forceCheckAuthAndRedirect, hasActiveSession } from '../../Utils/AuthUtils.Js';

const SignUpFirst = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [isButtonActive, setIsButtonActive] = useState(false);
  const [isSocialSignUpLoading, setIsSocialSignUpLoading] = useState(false);
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
            setIsSocialSignUpLoading(false);
            return;
          }
          
          setCheckingAuth(true);
          // We have an active session, handle the OAuth redirect
          await handleOAuthRedirect(navigation);
        } catch (error) {
          // Silently handle errors
        } finally {
          setCheckingAuth(false);
          setIsSocialSignUpLoading(false);
        }
      };

      // Only run the check when the component mounts or screen focuses
      checkAuthStatus();
      
      // Cleanup function
      return () => {
        // Any cleanup needed
      };
    }, [navigation])
  );

  // Check if email is filled
  React.useEffect(() => {
    setIsButtonActive(email.length > 0);
  }, [email]);

  const handleContinue = () => {
    if (isButtonActive && !checkingAuth) {
      navigation.navigate('SignUpSec', {
        email,
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <BackButton destinationScreen="IntroScreen" />
          <View style={styles.progressContainer}>
            <View style={styles.progressLineActive} />
            <View style={styles.progressLine} />
            <View style={styles.progressLine} />
          </View>
        </View>

        <View style={styles.mainContent}>
          <View>
            <View style={styles.iconContainer}>
              <View style={styles.iconCircle}>
                <MailIcon width={24} height={24} />
              </View>
            </View>

            <Text style={styles.title}>Enter your email</Text>
            
            <View style={styles.signInContainer}>
              <Text style={styles.hasAccountText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                <Text style={styles.signInText}>Sign In</Text>
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

            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialButtonsContainer}>
              <SocialSignInButton 
                provider="google" 
                onSignInStart={(loading = true) => setIsSocialSignUpLoading(loading)}
                style={isSocialSignUpLoading || checkingAuth ? styles.loadingButton : null}
              />
              <SocialSignInButton 
                provider="apple" 
                onSignInStart={(loading = true) => setIsSocialSignUpLoading(loading)}
                style={isSocialSignUpLoading || checkingAuth ? styles.loadingButton : null}
              />
            </View>
          </View>

          <View style={styles.bottomContent}>
            <TouchableOpacity 
              style={[
                styles.continueButton,
                isButtonActive ? styles.activeButton : styles.inactiveButton,
                checkingAuth && styles.loadingButton
              ]}
              onPress={handleContinue}
              disabled={!isButtonActive || checkingAuth}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
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
  progressContainer: {
    flexDirection: 'row',
    position: 'absolute',
    top: 28,
    left: 48,
    right: 16,
    gap: 4,
  },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: colors.tertiaryGrey,
    borderRadius: 1,
  },
  progressLineActive: {
    flex: 1,
    height: 2,
    backgroundColor: colors.primaryGreen,
    borderRadius: 1,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  iconContainer: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 24,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.secondaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primaryBlack,
    textAlign: 'center',
    marginBottom: 8,
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  hasAccountText: {
    color: colors.primaryBlack,
  },
  signInText: {
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
    marginBottom: 24,
  },
  loadingButton: {
    opacity: 0.8,
  },
  continueButton: {
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  activeButton: {
    backgroundColor: colors.primaryGreen,
  },
  inactiveButton: {
    backgroundColor: colors.tertiaryGreen,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.iconWhite,
  },
  bottomContent: {
    marginTop: 'auto',
  },
});

export default SignUpFirst;
