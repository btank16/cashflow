import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { HomeIcon } from 'react-native-heroicons/solid';
import colors from '../Colors/colors.Js';
import CommonStyles from '../Colors/CommonStyles.Js';

const HomeButton = (props) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('CalcHomeScreen');
  };

  return (
    <TouchableOpacity style={CommonStyles.barButtonContainer} onPress={handlePress}>
      <HomeIcon color={colors.accent} size={36} />
    </TouchableOpacity>
  );
};


export default HomeButton;