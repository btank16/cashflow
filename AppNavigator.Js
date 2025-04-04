import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CalcHomeScreen from './app/UserInterface/Screens/CalcHomeScreen.Js'
import FeedbackScreen from './app/UserInterface/Screens/FeedbackScreen.Js';
import BRRCalcIn from './app/UserInterface/Screens/InputCalc/BRRCalcIn.Js'
import BRRCalcOut from './app/UserInterface/Screens/OutputCalc/BRRCalcOut.Js'
import FlipCalcIn from './app/UserInterface/Screens/InputCalc/FlipCalcIn.Js'
import FlipCalcOut from './app/UserInterface/Screens/OutputCalc/FlipCalcOut.Js'
import ProjectionCalcIn from './app/UserInterface/Screens/InputCalc/ProjectionCalcIn.Js'
import ProjectionCalcOut from './app/UserInterface/Screens/OutputCalc/ProjectionCalcOut.Js'
import RentalCalcIn from './app/UserInterface/Screens/InputCalc/RentalCalcIn.Js'
import RentalCalcOut from './app/UserInterface/Screens/OutputCalc/RentalCalcOut.Js'
import WholesaleCalcIn from './app/UserInterface/Screens/InputCalc/WholesaleCalcIn.Js';
import WholesaleCalcOut from './app/UserInterface/Screens/OutputCalc/WholesaleCalcOut.Js';
import HistoryScreen from './app/UserInterface/Screens/HistoryScreen.Js';
import CommercialCalcIn from './app/UserInterface/Screens/InputCalc/CommercialCalcIn.Js';
import CommercialCalcOut from './app/UserInterface/Screens/OutputCalc/CommercialCalcOut.Js';
import UserScreen from './app/UserInterface/Screens/AccountScreens/UserScreen.Js';
import ExpenseScreen from './app/UserInterface/Screens/AccountScreens/ExpenseScreen.Js';
import FirstAddExpense from './app/UserInterface/Screens/AccountScreens/FirstAddExpense.Js';
import SecondAddExpense from './app/UserInterface/Screens/AccountScreens/SecondAddExpense.Js';

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
      <Stack.Screen name="CommercialCalcIn" component={CommercialCalcIn} />
      <Stack.Screen name="CommercialCalcOut" component={CommercialCalcOut} />
      <Stack.Screen name="WholesaleCalcIn" component={WholesaleCalcIn} />
      <Stack.Screen name="WholesaleCalcOut" component={WholesaleCalcOut} />
      <Stack.Screen name="HistoryScreen" component={HistoryScreen} />
      <Stack.Screen name="UserScreen" component={UserScreen} />
      <Stack.Screen name="ExpenseScreen" component={ExpenseScreen} />
      <Stack.Screen name="FirstAddExpense" component={FirstAddExpense} />
      <Stack.Screen name="SecondAddExpense" component={SecondAddExpense} />
    </Stack.Navigator>
  );
}

export default AppNavigator;