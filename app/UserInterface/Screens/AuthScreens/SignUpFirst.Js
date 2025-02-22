import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import colors from '../../Colors/colors.Js';
import BackButton from '../../Components/BackButton.Js';
import MailIcon from '../../../assets/icons/MailIcon.jsx';
import GoogleIcon from '../../../assets/icons/GoogleIcon.jsx';
import AppleIcon from '../../../assets/icons/AppleIcon.jsx';
import InterestCheckbox from '../../Components/InterestCheckbox.Js';
import NormTextbox from '../../Components/NormTextbox.Js';

const SignUpFirst = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [optInEmail, setOptInEmail] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isButtonActive, setIsButtonActive] = useState(false);

  // Check if email is filled and terms are accepted
  React.useEffect(() => {
    setIsButtonActive(email.length > 0 && acceptTerms);
  }, [email, acceptTerms]);

  const handleContinue = () => {
    if (isButtonActive) {
      navigation.navigate('SignUpSec', {
        email,
        optInEmail,
        acceptTerms
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
              <TouchableOpacity style={styles.socialButton}>
                <View style={styles.socialIconContainer}>
                  <GoogleIcon />
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <View style={styles.socialIconContainer}>
                  <AppleIcon />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.bottomContent}>
            <View style={styles.checkboxContainer}>
              <InterestCheckbox
                label="Do you want opt into our email?"
                value={optInEmail}
                onValueChange={setOptInEmail}
              />
              <InterestCheckbox
                label="By clicking Continue you accept our Terms & Conditions and Privacy Policy"
                value={acceptTerms}
                onValueChange={setAcceptTerms}
              />
            </View>

            <TouchableOpacity 
              style={[
                styles.continueButton,
                isButtonActive ? styles.activeButton : styles.inactiveButton
              ]}
              onPress={handleContinue}
              disabled={!isButtonActive}
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
  checkboxContainer: {
    marginLeft: -16,
    marginBottom: 8,
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
