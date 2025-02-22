import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import colors from '../Colors/colors.Js';

const NormTextbox = ({ 
  label, 
  value, 
  onChangeText, 
  placeholder, 
  keyboardType = 'default',
  autoCapitalize = 'none',
  isFocused,
  onFocus,
  onBlur
}) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={[
        styles.inputWrapper,
        isFocused ? styles.inputWrapperFocused : styles.inputWrapperBlurred
      ]}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={colors.sixthGrey}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default NormTextbox; 