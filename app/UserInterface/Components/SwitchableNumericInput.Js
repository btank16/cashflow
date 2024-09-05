import React from 'react';
import { View, TextInput, Text, StyleSheet, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../Colors/colors.Js';

const formatNumber = (value) => {
  if (!value) return '';
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const unformatNumber = (value) => {
  return value.replace(/,/g, '');
};

const SwitchableNumericInput = ({ 
  label, 
  value,
  isDollar,
  onChangeValue,
  onToggleMode,
  placeholder, 
  isRequired
}) => {
  const handleChangeText = (text) => {
    const unformattedValue = unformatNumber(text);
    onChangeValue(unformattedValue);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Text style={styles.label} numberOfLines={2} adjustsFontSizeToFit>
          {label}{isRequired && <Text style={styles.requiredStar}>*</Text>}
        </Text>
        <LinearGradient
          colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.05)', 'rgba(0,0,0,0)']}
          style={styles.gradientContainer}
        >
          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={onToggleMode} style={styles.switcherContainer}>
              <View style={[styles.switcherOption, isDollar && styles.activeOption]}>
                <Text style={[styles.switcherText, isDollar && styles.activeText]}>$</Text>
              </View>
              <View style={[styles.switcherOption, !isDollar && styles.activeOption]}>
                <Text style={[styles.switcherText, !isDollar && styles.activeText]}>%</Text>
              </View>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              onChangeText={handleChangeText}
              value={formatNumber(value)}
              placeholder={placeholder}
              keyboardType="numeric"
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
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
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.fieldColor,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  switcherContainer: {
    flexDirection: 'row',
    width: 60,
    height: 50,
    borderRightWidth: 1,
    borderRightColor: '#ccc',
  },
  switcherOption: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeOption: {
    backgroundColor: colors.accent,
  },
  switcherText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.basicText,
  },
  activeText: {
    color: colors.background,
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: colors.fieldColor,
  },
  requiredStar: {
    color: '#FF3131',
    marginLeft: 5,
  },
});

export default SwitchableNumericInput;