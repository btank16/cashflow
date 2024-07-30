import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeftCircleIcon } from 'react-native-heroicons/outline';
import colors from '../Colors/colors.Js';

const BackButton = ({ inputValues, destinationScreen }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate(destinationScreen, { inputValues });
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handlePress}>
      <ArrowLeftCircleIcon color={colors.accent} size={40} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    left: 10,
    paddingVertical: 8
  },
});

export default BackButton;