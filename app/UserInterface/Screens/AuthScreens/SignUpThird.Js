import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { signUp, updateUserAttributes, fetchUserAttributes } from '@aws-amplify/auth';
import colors from '../../Colors/colors.Js';
import NormTextbox from '../../Components/NormTextbox.Js';
import StateDropdown from '../../Components/StateDropdown.Js';
import StateMultiselect from '../../Components/StateMultiselect.Js';
import InvestmentStrategyMultiselect from '../../Components/InvestmentStrategyMultiselect.Js';
import InterestCheckbox from '../../Components/InterestCheckbox.Js';
import PrimaryButton from '../../Components/PrimaryButton.Js';
import ScreenLayoutWithFooter from '../../UtilScreens/ScreenLayoutWithFooter.Js';
import PDFViewer from '../../Components/PDFViewer.Js';
import secretKeys from '../../../../secretkeys.json';

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
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [firstNameFocused, setFirstNameFocused] = useState(false);
  const [lastNameFocused, setLastNameFocused] = useState(false);
  const [isButtonActive, setIsButtonActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [termsVisible, setTermsVisible] = useState(false);
  const [privacyVisible, setPrivacyVisible] = useState(false);
  
  // Use the direct PDF URLs from secretkeys.json
  const termsSource = { uri: secretKeys.policy_links.termsOfUse };
  const privacySource = { uri: secretKeys.policy_links.privacyPolicy };

  // Add handler functions for Terms and Privacy
  const handleTermsPress = () => {
    setTermsVisible(true);
  };

  const handlePrivacyPress = () => {
    setPrivacyVisible(true);
  };

  // Helper function to extract first and last name from a full name
  const extractNamesFromFullName = (fullName) => {
    if (!fullName) return { firstName: '', lastName: '' };
    
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) {
      // Only one word, use it as the first name
      return { firstName: parts[0], lastName: '' };
    } else {
      // First word is first name, everything else combined is last name
      const firstName = parts[0];
      const lastName = parts.slice(1).join(' ');
      return { firstName, lastName };
    }
  };

  // If user is coming from OAuth, try to prefill values
  useEffect(() => {
    if (isOAuthUser) {
      const getOAuthUserDetails = async () => {
        try {
          const userAttributes = await fetchUserAttributes();
          console.log('OAuth user attributes:', userAttributes);

          // Prefill email if available
          if (userAttributes.email) {
            setUserEmail(userAttributes.email);
          }
          
          // First check for custom attributes that might already be set
          if (userAttributes['custom:firstName'] && userAttributes['custom:lastName']) {
            setFirstName(userAttributes['custom:firstName']);
            setLastName(userAttributes['custom:lastName']);
          } 
          // Then check for Google-style attributes (given_name, family_name)
          else if (userAttributes.given_name || userAttributes.family_name) {
            setFirstName(userAttributes.given_name || '');
            setLastName(userAttributes.family_name || '');
          }
          // Finally, handle Apple-style attributes (single 'name' field)
          else if (userAttributes.name) {
            const { firstName, lastName } = extractNamesFromFullName(userAttributes.name);
            setFirstName(firstName);
            setLastName(lastName);
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
      investmentStrategies.length > 0 &&
      acceptTerms // Require terms acceptance to enable button
    );
  }, [firstName, lastName, state, targetStates, investmentStrategies, acceptTerms]);

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

  // Helper function to render terms with colored parts and checkbox
  const renderTermsText = () => {
    return (
      <View style={styles.termsContainer}>
        <View style={styles.termsCheckboxRow}>
          <InterestCheckbox
            value={acceptTerms}
            onValueChange={setAcceptTerms}
            style={styles.termsCheckbox}
          />
          <View style={styles.termsTextContainer}>
            <Text style={styles.termsText}>
              I accept the{' '}
            </Text>
            <TouchableOpacity onPress={handleTermsPress} activeOpacity={0.7}>
              <Text style={[styles.termsText, styles.highlightedText]}>Terms of Use</Text>
            </TouchableOpacity>
            <Text style={styles.termsText}> and </Text>
            <TouchableOpacity onPress={handlePrivacyPress} activeOpacity={0.7}>
              <Text style={[styles.termsText, styles.highlightedText]}>Privacy Policy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.progressContainer}>
        <View style={styles.progressLineActive} />
        <View style={styles.progressLineActive} />
        <View style={styles.progressLineActive} />
      </View>
    </View>
  );

  const renderFooter = () => (
    <View style={styles.bottomSection}>
      <PrimaryButton
        label="Continue"
        loadingLabel={isOAuthUser ? 'Saving Profile...' : 'Creating Account...'}
        isActive={isButtonActive}
        isLoading={isLoading}
        onPress={handleSignUp}
      />
    </View>
  );

  return (
    <ScreenLayoutWithFooter
      header={renderHeader()}
      footer={renderFooter()}
    >
      <View style={styles.mainContent}>
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
        <View style={styles.agreementSection}>
          <InterestCheckbox
            label="Yes, I want to receive email updates from Cashflow"
            value={optInEmail}
            onValueChange={setOptInEmail}
          />
          {renderTermsText()}
        </View>
      </View>

      <PDFViewer 
        source={termsSource}
        visible={termsVisible}
        onClose={() => setTermsVisible(false)}
      />
      
      <PDFViewer 
        source={privacySource}
        visible={privacyVisible}
        onClose={() => setPrivacyVisible(false)}
      />

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
    paddingTop: 8,
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
    width: '100%',
  },
  agreementSection: {
    marginBottom: 16,
    marginLeft: -16,
  },
  termsContainer: {
    marginTop: 8,
  },
  termsCheckboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  termsCheckbox: {
    marginTop: 1,
    marginRight: 8,
  },
  termsTextContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  termsText: {
    color: colors.primaryBlack,
    fontSize: 14,
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
