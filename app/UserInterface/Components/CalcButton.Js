import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { usePostHog } from 'posthog-react-native';
import colors from '../Colors/colors.Js'

const CalcButton = ({ title, onPress, destination, style, disabled, captureEventName }) => {
  const navigation = useNavigation();
  const posthog = usePostHog();

  //Function to allow you to press the button and nothing happens
  //This allows the button to be "inactive"
  const handlePress = () => {
    // Capture button click event with optional custom event name
    if (!disabled) {
      posthog.capture(captureEventName ? captureEventName : 'calc_click');
    }
    
    if (onPress) {
      onPress();
    }
    if (destination) {
      navigation.navigate(destination);
    }
  };

  return (
    //Adjusts the style based on the status of disabled
    //The "style" and "title" props allow custom settings on each screen
    <TouchableOpacity 
      style={[styles.button, style, disabled ? styles.disabledButton : null]} 
      onPress={handlePress}
      disabled={disabled}
    >
      <Text style={[styles.buttonText, disabled ? styles.disabledButtonText : null]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primaryGreen,
    paddingHorizontal: 40,
    borderRadius: 16,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: colors.iconWhite,
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: colors.tertiaryGreen,
    paddingHorizontal: 40,
    borderRadius: 16,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButtonText: {
    color: colors.iconWhite,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CalcButton;