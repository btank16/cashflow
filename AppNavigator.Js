import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CalcHomeScreen from './app/UserInterface/Screens/CalcHomeScreen.Js'
import FeedbackScreen from './app/UserInterface/Screens/FeedbackScreen.Js';
import BRRCalcIn from './app/UserInterface/Screens/BRRCalcIn.Js'
import FlipCalcIn from './app/UserInterface/Screens/FlipCalcIn.Js'
import ProjectionCalcIn from './app/UserInterface/Screens/ProjectionCalcIn.Js'
import RentalCalcIn from './app/UserInterface/Screens/RentalCalcIn.Js'

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // This hides the header for all screens
      }}
    >
      <Stack.Screen name="CalcHomeScreen" component={CalcHomeScreen} />
      <Stack.Screen name="FeedbackScreen" component={FeedbackScreen} />
      <Stack.Screen name="BRRCalcIn" component={BRRCalcIn} />
      <Stack.Screen name="FlipCalcIn" component={FlipCalcIn} />
      <Stack.Screen name="ProjectionCalcIn" component={ProjectionCalcIn} />
      <Stack.Screen name="RentalCalcIn" component={RentalCalcIn} />
    </Stack.Navigator>
  );
}

export default AppNavigator;