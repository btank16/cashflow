import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import colors from '../../Colors/colors.Js';
import NormTextbox from '../../Components/NormTextbox.Js';
import StateDropdown from '../../Components/StateDropdown.Js';
import StateMultiselect from '../../Components/StateMultiselect.Js';
import InvestmentStrategyMultiselect from '../../Components/InvestmentStrategyMultiselect.Js';
import InterestCheckbox from '../../Components/InterestCheckbox.Js';
import PrimaryButton from '../../Components/PrimaryButton.Js';
import ScreenLayoutWithFooter from '../../UtilScreens/ScreenLayoutWithFooter.Js';
import { getUserAttributes, updateUserAttributesWithCache } from '../../Utils/UserAttributesCache.Js';

// State and strategy mapping constants
const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
  "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
  "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
  "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
  "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
  "Wisconsin", "Wyoming", "International"
];

const INVESTMENT_STRATEGIES = [
  "Residential Long Term Rental", 
  "Residential Short Term Rental (i.e., Airbnb)", 
  "Fix & Flip", 
  "Wholesaling", 
  "BRRRR", 
  "Commercial Multifamily", 
  "Other"
];

const AttributeScreen = () => {
  const navigation = useNavigation();

  // State for user attributes
  const [given_name, setGiven_name] = useState('');
  const [family_name, setFamily_name] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [state, setState] = useState('');
  const [targetStates, setTargetStates] = useState([]);
  const [investmentStrategies, setInvestmentStrategies] = useState([]);
  const [optInEmail, setOptInEmail] = useState(true);
  
  // State for field focus
  const [given_nameFocused, setGiven_nameFocused] = useState(false);
  const [family_nameFocused, setFamily_nameFocused] = useState(false);
  
  // State for tracking original values and changes
  const [originalValues, setOriginalValues] = useState({});
  const [isButtonActive, setIsButtonActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Helper function to parse stored state codes into full state names
  const parseStateValues = (stateString) => {
    if (!stateString) return [];
    console.log('Parsing state string:', stateString);
    
    // Try comma-separated format first
    if (stateString.includes(',')) {
      const stateArray = stateString.split(',').map(s => s.trim()).filter(Boolean);
      return stateArray.filter(state => US_STATES.includes(state));
    }
    
    // For concatenated strings without separators, we need a different approach
    // Since state names are unique, we can attempt to extract them from the string
    const foundStates = [];
    
    // Sort states by length (longest first) to avoid partial matches
    const sortedStates = [...US_STATES].sort((a, b) => b.length - a.length);
    
    // Iterate through each state and check if it's in the string
    for (const state of sortedStates) {
      if (stateString.toLowerCase().includes(state.toLowerCase())) {
        foundStates.push(state);
      }
    }
    
    console.log('Found states:', foundStates);
    return foundStates;
  };

  // Helper function to parse stored strategy codes into full strategy names
  const parseStrategyValues = (strategyString) => {
    if (!strategyString) return [];
    console.log('Parsing strategy string:', strategyString);
    
    // Try comma-separated format first
    if (strategyString.includes(',')) {
      const strategyArray = strategyString.split(',').map(s => s.trim()).filter(Boolean);
      return strategyArray.filter(strategy => INVESTMENT_STRATEGIES.includes(strategy));
    }
    
    // Hardcoded mappings for common strategy strings
    // Map common concatenated values to their actual strategies
    const strategiesMap = {
      'BRRRR': 'BRRRR',
      'Fix&Flip': 'Fix & Flip',
      'FixandFlip': 'Fix & Flip',
      'Fix&flip': 'Fix & Flip',
      'ResidentialLongTermRental': 'Residential Long Term Rental',
      'ResidentialShortTermRental': 'Residential Short Term Rental (i.e., Airbnb)',
      'CommercialMultifamily': 'Commercial Multifamily',
      'Wholesaling': 'Wholesaling',
      'Other': 'Other'
    };
    
    // Look for exact matches in our map
    const foundStrategies = [];
    for (const [key, value] of Object.entries(strategiesMap)) {
      if (strategyString.includes(key)) {
        foundStrategies.push(value);
      }
    }
    
    // If we found specific matches, return them
    if (foundStrategies.length > 0) {
      console.log('Found strategies using map:', foundStrategies);
      return foundStrategies;
    }
    
    // If no matches from map, try direct comparison with our strategy list
    // Sort strategies by length (longest first) to avoid partial matches
    const sortedStrategies = [...INVESTMENT_STRATEGIES].sort((a, b) => b.length - a.length);
    
    // Iterate through each strategy and check if it's in the string
    for (const strategy of sortedStrategies) {
      // Create a simplified version of the strategy (no spaces, lowercase) for matching
      const simplifiedStrategy = strategy.toLowerCase().replace(/[^a-z0-9]/g, '');
      const simplifiedString = strategyString.toLowerCase().replace(/[^a-z0-9]/g, '');
      
      if (simplifiedString.includes(simplifiedStrategy)) {
        foundStrategies.push(strategy);
      }
    }
    
    console.log('Found strategies using simplified matching:', foundStrategies);
    return foundStrategies;
  };

  // Fetch user attributes when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Use the cached user attributes instead of making a direct API call
        const userAttributes = await getUserAttributes();
        console.log('User attributes from cache:', userAttributes);

        // Parse target states and investment strategies from stored format
        const parsedTargetStates = parseStateValues(userAttributes['custom:interest_state']);
        const parsedInvestmentStrategies = parseStrategyValues(userAttributes['custom:invest_strategy']);
        
        console.log('Parsed target states:', parsedTargetStates);
        console.log('Parsed investment strategies:', parsedInvestmentStrategies);

        // If no strategies were found, try a direct approach with specific values
        let finalInvestmentStrategies = parsedInvestmentStrategies;
        if (parsedInvestmentStrategies.length === 0 && userAttributes['custom:invest_strategy']) {
          const strategyStr = userAttributes['custom:invest_strategy'];
          console.log('Trying direct strategy matching for:', strategyStr);
          
          finalInvestmentStrategies = [];
          if (strategyStr.includes('BRRRR')) finalInvestmentStrategies.push('BRRRR');
          if (strategyStr.includes('Fix & Flip') || strategyStr.includes('Fix&Flip')) finalInvestmentStrategies.push('Fix & Flip');
          if (strategyStr.includes('Wholesaling')) finalInvestmentStrategies.push('Wholesaling');
          if (strategyStr.includes('Residential Long Term Rental')) finalInvestmentStrategies.push('Residential Long Term Rental');
          if (strategyStr.includes('Residential Short Term Rental')) finalInvestmentStrategies.push('Residential Short Term Rental (i.e., Airbnb)');
          if (strategyStr.includes('Commercial Multifamily')) finalInvestmentStrategies.push('Commercial Multifamily');
          if (strategyStr.includes('Other')) finalInvestmentStrategies.push('Other');
          
          console.log('Direct matched strategies:', finalInvestmentStrategies);
        }

        // Store original values for change detection
        const originalData = {
          given_name: userAttributes['given_name'] || '',
          family_name: userAttributes['family_name'] || '',
          email: userAttributes.email || '',
          state: userAttributes['custom:origin_state'] || '',
          targetStates: parsedTargetStates,
          investmentStrategies: finalInvestmentStrategies,
          optInEmail: userAttributes['custom:email_updates'] === 'true'
        };
        
        setOriginalValues(originalData);

        // Set current values
        setGiven_name(originalData.given_name);
        setFamily_name(originalData.family_name);
        setUserEmail(originalData.email);
        setState(originalData.state);
        setTargetStates(originalData.targetStates);
        setInvestmentStrategies(originalData.investmentStrategies);
        setOptInEmail(originalData.optInEmail);
      } catch (error) {
        console.error('Error fetching user attributes:', error);
        Alert.alert(
          'Error',
          'Could not load your profile data. Please try again later.'
        );
      }
    };

    fetchUserData();
  }, []);

  // Check if any fields have changed to enable the save button
  useEffect(() => {
    if (Object.keys(originalValues).length === 0) return;

    const hasChanged = 
      given_name !== originalValues.given_name ||
      family_name !== originalValues.family_name ||
      state !== originalValues.state ||
      JSON.stringify(targetStates) !== JSON.stringify(originalValues.targetStates) ||
      JSON.stringify(investmentStrategies) !== JSON.stringify(originalValues.investmentStrategies) ||
      optInEmail !== originalValues.optInEmail;

    setIsButtonActive(
      given_name.length > 0 && 
      family_name.length > 0 && 
      state.length > 0 && 
      targetStates.length > 0 &&
      investmentStrategies.length > 0 &&
      hasChanged
    );
  }, [given_name, family_name, state, targetStates, investmentStrategies, optInEmail, originalValues]);

  const handleSave = async () => {
    if (!isButtonActive || isLoading) return;

    setIsLoading(true);
    try {
      // Log values before saving
      console.log('Saving target states:', targetStates);
      console.log('Saving investment strategies:', investmentStrategies);
      
      // Use a consistent storage format for values - store as comma-separated for better future compatibility
      const targetStatesString = targetStates.join(',');
      const investmentStrategiesString = investmentStrategies.join(',');
      
      console.log('Saved target states string:', targetStatesString);
      console.log('Saved investment strategies string:', investmentStrategiesString);

      const userAttributes = {
        name: `${given_name} ${family_name}`,
        'given_name': given_name,
        'family_name': family_name,
        'custom:email_updates': String(optInEmail),
        'custom:origin_state': state,
        'custom:interest_state': targetStatesString,
        'custom:invest_strategy': investmentStrategiesString,
      };

      // Update user attributes using the cache utility - updates both AWS and local cache
      const success = await updateUserAttributesWithCache(userAttributes);
      
      if (success) {
        // Navigate to home screen
        navigation.navigate('CalcHomeScreen');
        
        // Show success message
        Alert.alert(
          'Success',
          'Your profile has been updated successfully.'
        );
      } else {
        throw new Error('Failed to update attributes');
      }
    } catch (error) {
      console.error('Update error:', error);
      Alert.alert(
        'Update Failed',
        error.message || 'Please check your information and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.navigate('UserScreen')}
      >
        <ChevronLeftIcon size={28} color={colors.primaryBlack} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Edit Profile</Text>
      <View style={styles.backButton} />
    </View>
  );

  const renderFooter = () => (
    <View style={styles.agreementSection}>
      <InterestCheckbox
        label="Yes, I want to receive email updates from Cashflow"
        value={optInEmail}
        onValueChange={setOptInEmail}
      />
      <PrimaryButton
        label={isLoading ? 'Saving...' : 'Save'}
        isActive={isButtonActive}
        isLoading={isLoading}
        onPress={handleSave}
      />
    </View>
  );

  return (
    <ScreenLayoutWithFooter
      header={renderHeader()}
      footer={renderFooter()}
    >
      <View style={styles.mainContent}>
        <NormTextbox
          label="First Name"
          value={given_name}
          onChangeText={setGiven_name}
          placeholder="First name"
          isFocused={given_nameFocused}
          onFocus={() => setGiven_nameFocused(true)}
          onBlur={() => setGiven_nameFocused(false)}
          autoCapitalize="words"
        />

        <NormTextbox
          label="Last Name"
          value={family_name}
          onChangeText={setFamily_name}
          placeholder="Last name"
          isFocused={family_nameFocused}
          onFocus={() => setFamily_nameFocused(true)}
          onBlur={() => setFamily_nameFocused(false)}
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
    </ScreenLayoutWithFooter>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primaryBlack,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContent: {
    flex: 1,
    paddingTop: 16,
  },
  agreementSection: {
    width: '100%',
    paddingVertical: 8,
  },
});

export default AttributeScreen; 