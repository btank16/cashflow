import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import colors from '../../Colors/colors.Js';
import BackButton from '../../Components/BackButton.Js';
import MailIcon from '../../../assets/icons/MailIcon.jsx';
import NormTextbox from '../../Components/NormTextbox.Js';
import SocialSignInButton from '../../Components/SocialSignInButton.Js';
import { handleOAuthRedirect, forceCheckAuthAndRedirect, hasActiveSession } from '../../Utils/AuthUtils.Js';
import PrimaryButton from '../../Components/PrimaryButton.Js';
import ScreenLayoutWithFooter from '../../UtilScreens/ScreenLayoutWithFooter.Js';

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

  const renderHeader = () => (
    <View style={styles.header}>
      <BackButton destinationScreen="IntroScreen" />
      <View style={styles.progressContainer}>
        <View style={styles.progressLineActive} />
        <View style={styles.progressLine} />
        <View style={styles.progressLine} />
      </View>
    </View>
  );

  const renderFooter = () => (
    <PrimaryButton
      label="Continue"
      isActive={isButtonActive}
      isLoading={false}
      disabled={checkingAuth}
      onPress={handleContinue}
    />
  );

  return (
    <ScreenLayoutWithFooter
      header={renderHeader()}
      footer={renderFooter()}
    >
      <View style={styles.mainContent}>
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
    </ScreenLayoutWithFooter>
  );
};

const styles = StyleSheet.create({
  header: {
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  progressContainer: {
    flexDirection: 'row',
    position: 'absolute',
    alignItems: 'center',
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
    paddingTop: 24,
  },
  iconContainer: {
    alignItems: 'center',
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
});

export default SignUpFirst;
