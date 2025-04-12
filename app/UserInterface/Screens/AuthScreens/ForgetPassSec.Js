import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform, StatusBar, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { confirmResetPassword } from '@aws-amplify/auth';
import colors from '../../Colors/colors.Js';
import BackButton from '../../Components/BackButton.Js';
import LockIcon from '../../../assets/icons/LockIcon.jsx';
import NormTextbox from '../../Components/NormTextbox.Js';
import PasswordBox from '../../Components/PasswordBox.Js';
import PrimaryButton from '../../Components/PrimaryButton.Js';

const ForgetPassSec = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { email, codeDeliveryDetails } = route.params || {};
  
  const [code, setCode] = useState('');
  const [codeFocused, setCodeFocused] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPasswordFocused, setNewPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isButtonActive, setIsButtonActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if code and passwords are filled and passwords match
  useEffect(() => {
    setIsButtonActive(code.length > 0 && newPassword.length > 0 && newPassword === confirmPassword);
  }, [code, newPassword, confirmPassword]);

  const handleConfirmResetPassword = async () => {
    if (!isButtonActive || isLoading) return;
    
    setIsLoading(true);
    try {
      await confirmResetPassword({
        username: email,
        confirmationCode: code,
        newPassword: newPassword,
      });

      Alert.alert(
        'Password Reset Successful',
        'Your password has been reset successfully. Please sign in with your new password.',
        [
          {
            text: 'Sign In',
            onPress: () => navigation.navigate('SignIn')
          }
        ]
      );
    } catch (error) {
      console.error('Confirm reset password error:', error);

      let errorMessage = 'Failed to reset password. Please try again.';
      if (error.name === 'CodeMismatchException') {
        errorMessage = 'Invalid verification code. Please try again.';
      } else if (error.name === 'LimitExceededException') {
        errorMessage = 'Too many attempts. Please try again later.';
      } else if (error.name === 'InvalidPasswordException') {
        errorMessage = 'Password does not meet requirements. Please use a stronger password.';
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
          <BackButton destinationScreen="ForgetPassFirst" />
        </View>

        <View style={styles.mainContent}>
          <View>
            <View style={styles.iconContainer}>
              <View style={styles.iconCircle}>
                <LockIcon width={24} height={24} color={colors.primaryGreen} />
              </View>
            </View>

            <Text style={styles.title}>Reset password</Text>
            
            <Text style={styles.description}>
              {`We've sent a verification code to your ${codeDeliveryDetails?.deliveryMedium?.toLowerCase() || 'email'}. Please enter the code below and create a new password.`}
            </Text>

            <NormTextbox
              label="Verification Code"
              value={code}
              onChangeText={setCode}
              placeholder="Enter verification code"
              keyboardType="number-pad"
              isFocused={codeFocused}
              onFocus={() => setCodeFocused(true)}
              onBlur={() => setCodeFocused(false)}
            />

            <PasswordBox
              label="New Password"
              value={newPassword}
              onChangeText={setNewPassword}
              isFocused={newPasswordFocused}
              onFocus={() => setNewPasswordFocused(true)}
              onBlur={() => setNewPasswordFocused(false)}
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
            />

            <PasswordBox
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              isFocused={confirmPasswordFocused}
              onFocus={() => setConfirmPasswordFocused(true)}
              onBlur={() => setConfirmPasswordFocused(false)}
              showPassword={showConfirmPassword}
              onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
            />
          </View>

          <PrimaryButton
            label="Reset Password"
            loadingLabel="Resetting..."
            isActive={isButtonActive}
            isLoading={isLoading}
            onPress={handleConfirmResetPassword}
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

export default ForgetPassSec; 