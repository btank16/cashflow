import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';
import colors from '../Colors/colors.Js';

const BackButton = ({ inputValues, destinationScreen }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate(destinationScreen, { inputValues });
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handlePress}>
      <ChevronLeftIcon size={24} color={colors.primaryBlack} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    zIndex: 1,
  },
});

export default BackButton;