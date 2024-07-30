import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { HomeIcon } from 'react-native-heroicons/solid';
import colors from '../Colors/colors.Js';

const HomeButton = (props) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('CalcHomeScreen');
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handlePress}>
      <HomeIcon color={colors.accent} size={36} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    left: 10,
    paddingVertical: 10
  },
});

export default HomeButton;