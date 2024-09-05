import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CalcHomeScreen from './app/UserInterface/Screens/CalcHomeScreen.Js'
import FeedbackScreen from './app/UserInterface/Screens/FeedbackScreen.Js';
import BRRCalcIn from './app/UserInterface/Screens/BRRCalcIn.Js'
import BRRCalcOut from './app/UserInterface/Screens/BRRCalcOut.Js'
import FlipCalcIn from './app/UserInterface/Screens/FlipCalcIn.Js'
import FlipCalcOut from './app/UserInterface/Screens/FlipCalcOut.Js'
import ProjectionCalcIn from './app/UserInterface/Screens/ProjectionCalcIn.Js'
import ProjectionCalcOut from './app/UserInterface/Screens/ProjectionCalcOut.Js'
import RentalCalcIn from './app/UserInterface/Screens/RentalCalcIn.Js'
import RentalCalcOut from './app/UserInterface/Screens/RentalCalcOut.Js'
import WholesaleCalcIn from './app/UserInterface/Screens/WholesaleCalcIn.Js';
import WholesaleCalcOut from './app/UserInterface/Screens/WholesaleCalcOut.Js';

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
      <Stack.Screen name="BRRCalcOut" component={BRRCalcOut} />
      <Stack.Screen name="FlipCalcIn" component={FlipCalcIn} />
      <Stack.Screen name="FlipCalcOut" component={FlipCalcOut} />
      <Stack.Screen name="ProjectionCalcIn" component={ProjectionCalcIn} />
      <Stack.Screen name="ProjectionCalcOut" component={ProjectionCalcOut} />
      <Stack.Screen name="RentalCalcIn" component={RentalCalcIn} />
      <Stack.Screen name="RentalCalcOut" component={RentalCalcOut} />
      <Stack.Screen name="WholesaleCalcIn" component={WholesaleCalcIn} />
      <Stack.Screen name="WholesaleCalcOut" component={WholesaleCalcOut} />
    </Stack.Navigator>
  );
}

export default AppNavigator;