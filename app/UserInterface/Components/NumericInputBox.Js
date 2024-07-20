// This will be used for Purchase Price, Down Payment Percent, Interest Rate, Property Tax ...
// ... Rehab Cost, Monthly Rent, Capex Percent, Closing Cost Percent, ARV, Months Held ...
// ... Agent Commission, BRRR Rent, Refinance Costs, BRRR Interest Rate, Cashflow Target ...

import React from 'react';
import { View, TextInput, Text, StyleSheet, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../Colors/colors.Js';

const NumericInput = ({ label, value, onChangeText, placeholder }) => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Text style={styles.label} numberOfLines={2} adjustsFontSizeToFit>
          {label}
        </Text>
        <LinearGradient
          colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.05)', 'rgba(0,0,0,0)']}
          style={styles.gradientContainer}
        >
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              onChangeText={onChangeText}
              value={value}
              placeholder={placeholder}
              keyboardType="numeric"
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
              blurOnSubmit={false}
            />
          </View>
        </LinearGradient>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    paddingHorizontal: 15,
    width: 'auto',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
    flexWrap: 'wrap',
    color: colors.basicText,
  },
  gradientContainer: {
    borderRadius: 10,
    padding: 2,
  },
  inputContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.fieldColor,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  input: {
    height: 50,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: colors.fieldColor,
  },
});

export default NumericInput;