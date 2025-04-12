import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform, StatusBar, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { resetPassword } from '@aws-amplify/auth';
import colors from '../../Colors/colors.Js';
import BackButton from '../../Components/BackButton.Js';
import LockIcon from '../../../assets/icons/LockIcon.jsx';
import NormTextbox from '../../Components/NormTextbox.Js';
import PrimaryButton from '../../Components/PrimaryButton.Js';

const ForgetPassFirst = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [isButtonActive, setIsButtonActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if email is filled
  useEffect(() => {
    setIsButtonActive(email.length > 0);
  }, [email]);

  const handleResetPassword = async () => {
    if (!isButtonActive || isLoading) return;
    
    setIsLoading(true);
    try {
      const output = await resetPassword({
        username: email.toLowerCase().trim()
      });

      const { nextStep } = output;
      
      if (nextStep.resetPasswordStep === 'CONFIRM_RESET_PASSWORD_WITH_CODE') {
        navigation.navigate('ForgetPassSec', {
          email: email.toLowerCase().trim(),
          codeDeliveryDetails: nextStep.codeDeliveryDetails
        });
      }
    } catch (error) {
      console.error('Reset password error:', error);

      let errorMessage = 'Please check your email and try again.';
      if (error.name === 'UserNotFoundException') {
        errorMessage = 'No account found with this email.';
      } else if (error.name === 'LimitExceededException') {
        errorMessage = 'Too many attempts. Please try again later.';
      }

      Alert.alert(
        'Reset Password Failed',
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
          <BackButton destinationScreen="SignIn" />
        </View>

        <View style={styles.mainContent}>
          <View>
            <View style={styles.iconContainer}>
              <View style={styles.iconCircle}>
                <LockIcon width={24} height={24} color={colors.primaryGreen} />
              </View>
            </View>

            <Text style={styles.title}>Forgot password</Text>
            
            <Text style={styles.description}>
              To reset your password, please enter your registered email or phone number below. We'll send you a recovery code to verify your identity and help you create a new password.
            </Text>

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
          </View>

          <PrimaryButton
            label="Send recovery code"
            loadingLabel="Sending..."
            isActive={isButtonActive}
            isLoading={isLoading}
            onPress={handleResetPassword}
            style={{ marginTop: 24 }}
          />
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
  mainContent: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 24,
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
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: colors.primaryGrey,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  }
});

export default ForgetPassFirst; 