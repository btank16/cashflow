import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import colors from '../Colors/colors.Js'

const CalcButton = ({ title, onPress, destination, style, disabled }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    if (onPress) {
      onPress();
    }
    if (destination) {
      navigation.navigate(destination);
    }
  };

  return (
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
    backgroundColor: colors.primary,
    paddingHorizontal: 50,
    borderRadius: 50,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#ccc',
    paddingHorizontal: 50,
    borderRadius: 50,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButtonText: {
    color: colors.basicText,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CalcButton;