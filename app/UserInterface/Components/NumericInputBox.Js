// This will be used for Purchase Price, Down Payment Percent, Interest Rate, Property Tax ...
// ... Rehab Cost, Monthly Rent, Capex Percent, Closing Cost Percent, ARV, Months Held ...
// ... Agent Commission, BRRR Rent, Refinance Costs, BRRR Interest Rate, Cashflow Target ...

import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../Colors/colors.Js';

const formatNumber = (value) => {
  if (!value) return '';
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Places a comma between 3 digits
};

const unformatNumber = (value) => {
  return value.replace(/,/g, '');
};

const NumericInput = ({ label, value, onChangeText, placeholder, isRequired, type, infoPress }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleChangeText = (text) => {
    const unformattedValue = unformatNumber(text);
    onChangeText(unformattedValue);
  };

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <TouchableOpacity onPress={infoPress} style={styles.infoButton}>
          <Ionicons name="information-circle-outline" size={16} color={colors.primaryGrey} />
        </TouchableOpacity>
        <Text style={styles.label}>
          {label}
          {!isRequired && <Text style={styles.optionalText}> (optional)</Text>}
        </Text>
      </View>
      <View style={[
        styles.inputContainer,
        isFocused ? styles.inputContainerFocused : styles.inputContainerBlurred
      ]}>
        <TextInput
          style={styles.input}
          onChangeText={handleChangeText}
          value={formatNumber(value)}
          placeholder={placeholder}
          placeholderTextColor={colors.sixthGrey}
          keyboardType="numeric"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <View style={styles.typeContainer}>
          <Text style={styles.typeText}>{type}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    width: '100%',
    paddingHorizontal: 15,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  infoButton: {
    marginRight: 5,
  },
  label: {
    fontSize: 14,
    fontWeight: 500,
    color: colors.primaryGrey,
  },
  optionalText: {
    fontSize: 14,
    fontWeight: 500,
    color: colors.primaryBlack,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    overflow: 'hidden',
    height: 50, 
  },
  inputContainerBlurred: {
    backgroundColor: colors.tertiaryGrey,
    borderColor: colors.quaternaryGrey,
    borderWidth: 1,
  },
  inputContainerFocused: {
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
  typeContainer: {
    backgroundColor: colors.secondaryGrey,
    paddingHorizontal: 8,
    height: '85%',
    justifyContent: 'center',
    borderRadius: 10,
    marginRight: 4,
  },
  typeText: {
    color: colors.fifthGrey,
    fontSize: 16,
  },
});

export default NumericInput;