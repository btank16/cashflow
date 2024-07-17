import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CalcHomeScreen from './app/UserInterface/Screens/CalcHomeScreen.Js'
import FeedbackScreen from './app/UserInterface/Screens/FeedbackScreen.Js';

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
    </Stack.Navigator>
  );
}

export default AppNavigator;