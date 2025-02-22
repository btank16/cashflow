import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { EyeIcon, EyeSlashIcon } from "react-native-heroicons/outline";
import colors from '../Colors/colors.Js';

const PasswordBox = ({ 
  label, 
  value, 
  onChangeText, 
  placeholder = "Enter password",
  isFocused,
  onFocus,
  onBlur,
  showPassword,
  onTogglePassword
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
          secureTextEntry={!showPassword}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        <TouchableOpacity 
          style={styles.eyeIcon}
          onPress={onTogglePassword}
        >
          {showPassword ? (
            <EyeIcon size={24} color={colors.primaryBlack} />
          ) : (
            <EyeSlashIcon size={24} color={colors.sixthGrey} />
          )}
        </TouchableOpacity>
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
  eyeIcon: {
    padding: 10,
    marginRight: 4,
  },
});

export default PasswordBox; 