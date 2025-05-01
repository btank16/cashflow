import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import colors from '../../Colors/colors.Js';
import BackButton from '../../Components/BackButton.Js';
import LockIcon from '../../../assets/icons/LockIcon.jsx';
import PasswordBox from '../../Components/PasswordBox.Js';
import PrimaryButton from '../../Components/PrimaryButton.Js';
import ScreenLayoutWithFooter from '../../UtilScreens/ScreenLayoutWithFooter.Js';

const SignUpSec = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { email } = route.params;

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

  const handleContinue = () => {
    if (isButtonActive) {
      navigation.navigate('SignUpThird', {
        email,
        password,
        confirmPassword
      });
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <BackButton destinationScreen="SignUpFirst" />
      <View style={styles.progressContainer}>
        <View style={styles.progressLineActive} />
        <View style={styles.progressLineActive} />
        <View style={styles.progressLine} />
      </View>
    </View>
  );

  const renderFooter = () => (
    <PrimaryButton
      label="Continue"
      isActive={isButtonActive}
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
            <LockIcon width={24} height={24} color={colors.primaryGreen} />
          </View>
        </View>

        <Text style={styles.title}>Create password</Text>

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
    marginBottom: 32,
  }
});

export default SignUpSec;
