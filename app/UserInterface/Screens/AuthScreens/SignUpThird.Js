import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Platform, StatusBar, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { signUp, updateUserAttributes, fetchUserAttributes } from '@aws-amplify/auth';
import colors from '../../Colors/colors.Js';
import NormTextbox from '../../Components/NormTextbox.Js';
import StateDropdown from '../../Components/StateDropdown.Js';
import StateMultiselect from '../../Components/StateMultiselect.Js';
import InvestmentStrategyMultiselect from '../../Components/InvestmentStrategyMultiselect.Js';
import InterestCheckbox from '../../Components/InterestCheckbox.Js';
import PrimaryButton from '../../Components/PrimaryButton.Js';

const SignUpThird = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { email, password, confirmPassword, isOAuthUser } = route.params || {};

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userEmail, setUserEmail] = useState(email || '');
  const [state, setState] = useState('');
  const [targetStates, setTargetStates] = useState([]);
  const [investmentStrategies, setInvestmentStrategies] = useState([]);
  const [optInEmail, setOptInEmail] = useState(true);
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [firstNameFocused, setFirstNameFocused] = useState(false);
  const [lastNameFocused, setLastNameFocused] = useState(false);
  const [isButtonActive, setIsButtonActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // If user is coming from OAuth, try to prefill values
  useEffect(() => {
    if (isOAuthUser) {
      const getOAuthUserDetails = async () => {
        try {
          const userAttributes = await fetchUserAttributes();

          // Prefill values if available
          if (userAttributes.email) {
            setUserEmail(userAttributes.email);
          }
          // Try to get first name from custom attribute first, then fall back to given_name if available
          if (userAttributes['custom:firstName']) {
            setFirstName(userAttributes['custom:firstName']);
          } else if (userAttributes.given_name) {
            setFirstName(userAttributes.given_name);
          }
          // Try to get last name from custom attribute first, then fall back to family_name if available
          if (userAttributes['custom:lastName']) {
            setLastName(userAttributes['custom:lastName']);
          } else if (userAttributes.family_name) {
            setLastName(userAttributes.family_name);
          }
        } catch (error) {
          console.error('Auth error:', error);
        }
      };

      getOAuthUserDetails();
    }
  }, [isOAuthUser]);

  // Check if all fields are filled
  React.useEffect(() => {
    setIsButtonActive(
      firstName.length > 0 && 
      lastName.length > 0 && 
      state.length > 0 && 
      targetStates.length > 0 &&
      investmentStrategies.length > 0
    );
  }, [firstName, lastName, state, targetStates, investmentStrategies]);

  const handleSignUp = async () => {
    if (!isButtonActive || isLoading) return;

    setIsLoading(true);
    try {
      // Use target states as is, just joined together
      const targetStatesString = targetStates.join('');
      const investmentStrategiesString = investmentStrategies.join('');

      const userAttributes = {
        name: `${firstName} ${lastName}`,
        'custom:firstName': firstName,
        'custom:lastName': lastName,
        'custom:email_updates': String(optInEmail),
        'custom:terms': String(acceptTerms),
        'custom:origin_state': state,
        'custom:interest_state': targetStatesString,
        'custom:invest_strategy': investmentStrategiesString,
      };

      if (isOAuthUser) {
        // For OAuth users, update their attributes instead of signing up
        await updateUserAttributes({ userAttributes });

        // Navigate directly to main app for OAuth users
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main', params: { screen: 'CalcHomeScreen' } }],
        });
      } else {
        // For regular email users, proceed with sign up
        await signUp({
          username: userEmail,
          password,
          options: {
            userAttributes: {
              email: userEmail,
              ...userAttributes
            },
            autoSignIn: true
          }
        });

        // Regular users need to go through verification
        navigation.navigate('VerificationScreen', { email: userEmail });
      }
    } catch (error) {
      console.error('Auth error:', error);
      Alert.alert(
        'Sign Up Failed',
        error.message || 'Please check your information and try again.'
      );
      
      if (!isOAuthUser) {
        navigation.navigate('SignUpFirst');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to render terms with colored parts
  const renderTermsText = () => {
    return (
      <Text style={styles.termsText}>
        By clicking Continue you accept our <Text style={styles.highlightedText}>Terms & Conditions</Text> and <Text style={styles.highlightedText}>Privacy Policy</Text>
      </Text>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.progressContainer}>
            <View style={styles.progressLineActive} />
            <View style={styles.progressLineActive} />
            <View style={styles.progressLineActive} />
          </View>
        </View>

        <View style={styles.mainContent}>
          <View>
            <Text style={styles.title}>Let's get to know you</Text>

            <NormTextbox
              label="First Name"
              value={firstName}
              onChangeText={setFirstName}
              placeholder="First name"
              isFocused={firstNameFocused}
              onFocus={() => setFirstNameFocused(true)}
              onBlur={() => setFirstNameFocused(false)}
              autoCapitalize="words"
            />

            <NormTextbox
              label="Last Name"
              value={lastName}
              onChangeText={setLastName}
              placeholder="Last name"
              isFocused={lastNameFocused}
              onFocus={() => setLastNameFocused(true)}
              onBlur={() => setLastNameFocused(false)}
              autoCapitalize="words"
            />

            <StateDropdown
              label="Home State"
              value={state}
              onValueChange={setState}
              placeholder="Select your home state"
            />

            <StateMultiselect
              label="Target Investment State(s)"
              value={targetStates}
              onValueChange={setTargetStates}
              placeholder="Select your target market"
            />

            <InvestmentStrategyMultiselect
              label="Investment Strategy"
              value={investmentStrategies}
              onValueChange={setInvestmentStrategies}
              placeholder="Select your investment strategies"
            />
          </View>

          <View style={styles.bottomSection}>
            <View style={styles.agreementSection}>
              <InterestCheckbox
                label="Do you want opt into our email?"
                value={optInEmail}
                onValueChange={setOptInEmail}
              />
              {renderTermsText()}
            </View>

            <PrimaryButton
              label="Continue"
              loadingLabel={isOAuthUser ? 'Saving Profile...' : 'Creating Account...'}
              isActive={isButtonActive}
              isLoading={isLoading}
              onPress={handleSignUp}
              style={{ marginBottom: 16 }}
            />
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
    left: 16,
    right: 16,
    gap: 4,
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primaryBlack,
    textAlign: 'left',
    marginBottom: 24,
    marginTop: 8,
  },
  bottomSection: {
    marginTop: 16, 
  },
  agreementSection: {
    marginBottom: 16,
  },
  termsText: {
    color: colors.primaryBlack,
    textAlign: 'center',
    fontSize: 14,
    paddingHorizontal: 16,
  },
  highlightedText: {
    color: colors.primaryGreen,
    fontWeight: '500',
  },
  loadingButton: {
    opacity: 0.8,
  },
});

export default SignUpThird;
