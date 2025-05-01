import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { resetPassword } from '@aws-amplify/auth';
import colors from '../../Colors/colors.Js';
import BackButton from '../../Components/BackButton.Js';
import LockIcon from '../../../assets/icons/LockIcon.jsx';
import NormTextbox from '../../Components/NormTextbox.Js';
import PrimaryButton from '../../Components/PrimaryButton.Js';
import ScreenLayoutWithFooter from '../../UtilScreens/ScreenLayoutWithFooter.Js';

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

  const renderHeader = () => (
    <View style={styles.header}>
      <BackButton destinationScreen="SignIn" />
    </View>
  );

  const renderFooter = () => (
    <PrimaryButton
      label="Send recovery code"
      loadingLabel="Sending..."
      isActive={isButtonActive}
      isLoading={isLoading}
      onPress={handleResetPassword}
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
    </ScreenLayoutWithFooter>
  );
};

const styles = StyleSheet.create({
  header: {
    justifyContent: 'center',
    width: '100%',
    height: '100%',
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