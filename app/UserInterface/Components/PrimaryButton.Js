import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import colors from '../Colors/colors.Js';

/**
 * PrimaryButton - A reusable button component for primary actions
 * 
 * @param {Object} props - Component props
 * @param {string} props.label - Button text
 * @param {Function} props.onPress - Function to call when button is pressed
 * @param {boolean} props.isActive - Whether the button is active/enabled
 * @param {boolean} props.isLoading - Whether the button is in loading state
 * @param {string} props.loadingLabel - Text to show when button is loading
 * @param {Object} props.style - Additional styles for the button container
 * @param {Object} props.textStyle - Additional styles for the button text
 * @param {boolean} props.disabled - Whether the button is disabled
 */
const PrimaryButton = ({
  label,
  onPress,
  isActive = true,
  isLoading = false,
  loadingLabel,
  style,
  textStyle,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        isActive ? styles.activeButton : styles.inactiveButton,
        isLoading && styles.loadingButton,
        style,
      ]}
      onPress={onPress}
      disabled={!isActive || isLoading || disabled}
    >
      <Text style={[styles.buttonText, textStyle]}>
        {isLoading && loadingLabel ? loadingLabel : label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: colors.iconWhite,
    fontSize: 16,
    fontWeight: '600',
  },
  activeButton: {
    backgroundColor: colors.primaryGreen,
  },
  inactiveButton: {
    backgroundColor: colors.quaternaryGrey,
  },
  loadingButton: {
    opacity: 0.7,
  },
});

export default PrimaryButton; 