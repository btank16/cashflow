import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeftIcon } from 'react-native-heroicons/solid';
import colors from '../Colors/colors.Js';

const HomeButton = (props) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('CalcHomeScreen');
  };

  return (
    <TouchableOpacity style={styles.barButtonContainer} onPress={handlePress}>
      <ChevronLeftIcon color={colors.primaryBlack} size={24} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  barButtonContainer: {
    position: 'absolute',
    left: 10,
    paddingVertical: 10,
    zIndex: 1,
    alignSelf: 'center'
  }
});

export default HomeButton;