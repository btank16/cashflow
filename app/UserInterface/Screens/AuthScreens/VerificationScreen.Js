import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { confirmSignUp, resendSignUpCode } from '@aws-amplify/auth';
import colors from '../../Colors/colors.Js';
import MailIcon from '../../../assets/icons/MailIcon.jsx';
import SplitText from '../../Components/SplitText.Js';
import ScreenLayout from '../../UtilScreens/ScreenLayout.Js';

const VerificationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { email } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleVerification = async (code) => {
    setIsLoading(true);
    try {
      await confirmSignUp({
        username: email,
        confirmationCode: code,
      });

      // If verification is successful, navigate to main app
      navigation.reset({
        index: 0,
        routes: [{ 
          name: 'Main',
          params: { screen: 'CalcHomeScreen' }
        }],
      });
    } catch (error) {
      Alert.alert(
        'Verification Failed',
        error.message || 'Please check your verification code and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    try {
      await resendSignUpCode({
        username: email,
      });
      Alert.alert(
        'Code Sent',
        'A new verification code has been sent to your email.'
      );
    } catch (error) {
      Alert.alert(
        'Failed to Resend Code',
        error.message || 'Please try again later.'
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <ScreenLayout>
      <View style={styles.mainContent}>
        <View>
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <MailIcon width={24} height={24} color={colors.primaryGreen} />
            </View>
          </View>

          <Text style={styles.title}>Confirmation code sent</Text>
          <Text style={styles.subtitle}>
            A confirmation code has been sent to the email address associated with your account: {email}
          </Text>
          <Text style={styles.instruction}>Please check your inbox for the code.</Text>

          <View style={styles.codeContainer}>
            <SplitText onCodeComplete={handleVerification} />
          </View>

          <TouchableOpacity 
            style={styles.resendButton}
            onPress={handleResendCode}
            disabled={isResending}
          >
            <Text style={styles.resendText}>
              {isResending ? 'Sending...' : 'Resend'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  mainContent: {
    paddingTop: 56,
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
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 14,
    color: colors.primaryBlack,
    textAlign: 'center',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  instruction: {
    fontSize: 14,
    color: colors.primaryBlack,
    textAlign: 'center',
    marginBottom: 32,
  },
  codeContainer: {
    marginBottom: 24,
  },
  resendButton: {
    alignItems: 'center',
    padding: 16,
  },
  resendText: {
    color: colors.primaryGreen,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default VerificationScreen; 