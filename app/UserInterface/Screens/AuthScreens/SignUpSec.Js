import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import colors from '../../Colors/colors.Js';
import BackButton from '../../Components/BackButton.Js';
import { EyeIcon, EyeSlashIcon } from "react-native-heroicons/outline";
import LockIcon from '../../../assets/icons/LockIcon.jsx';

const SignUpSec = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { email, optInEmail, acceptTerms } = route.params;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
  const [isButtonActive, setIsButtonActive] = useState(false);

  // Check if both passwords are filled and match
  React.useEffect(() => {
    setIsButtonActive(password.length > 0 && password === confirmPassword);
  }, [password, confirmPassword]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <BackButton destinationScreen="SignUpFirst" />
          <View style={styles.progressContainer}>
            <View style={styles.progressLineActive} />
            <View style={styles.progressLineActive} />
            <View style={styles.progressLine} />
          </View>
        </View>

        <View style={styles.mainContent}>
          <View>
            <View style={styles.iconContainer}>
              <View style={styles.iconCircle}>
                <LockIcon width={24} height={24} color={colors.primaryGreen} />
              </View>
            </View>

            <Text style={styles.title}>Create password</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={[
                styles.inputWrapper,
                passwordFocused ? styles.inputWrapperFocused : styles.inputWrapperBlurred
              ]}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter password"
                  placeholderTextColor={colors.sixthGrey}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                />
                <TouchableOpacity 
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeIcon size={24} color={colors.primaryBlack} />
                  ) : (
                    <EyeSlashIcon size={24} color={colors.sixthGrey} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Confirm Password</Text>
              <View style={[
                styles.inputWrapper,
                confirmPasswordFocused ? styles.inputWrapperFocused : styles.inputWrapperBlurred
              ]}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter password"
                  placeholderTextColor={colors.sixthGrey}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  onFocus={() => setConfirmPasswordFocused(true)}
                  onBlur={() => setConfirmPasswordFocused(false)}
                />
                <TouchableOpacity 
                  style={styles.eyeIcon}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeIcon size={24} color={colors.primaryBlack} />
                  ) : (
                    <EyeSlashIcon size={24} color={colors.sixthGrey} />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <TouchableOpacity 
            style={[
              styles.continueButton,
              isButtonActive ? styles.activeButton : styles.inactiveButton
            ]}
            onPress={() => {
              if (isButtonActive) {
                // Handle sign up logic
              }
            }}
            disabled={!isButtonActive}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
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
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: colors.primaryGrey,
    marginBottom: 8,
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    height: 50,
    overflow: 'hidden',
  },
  inputWrapperBlurred: {
    backgroundColor: colors.tertiaryGrey,
    borderColor: colors.quaternaryGrey,
    borderWidth: 1,
  },
  inputWrapperFocused: {
    backgroundColor: colors.iconWhite,
    borderColor: colors.primaryGreen,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 10,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 10,
    marginRight: 4,
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
});

export default SignUpSec;
