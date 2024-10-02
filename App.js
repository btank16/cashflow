import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './AppNavigator.Js';
import { SQLiteProvider } from 'expo-sqlite';
import { initHistoryDB } from './database/cashflowDatabase.Js';

function App() {
  return (
    <SQLiteProvider databaseName="cashflow.db" onInit={initHistoryDB}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </SQLiteProvider>
  );
}

export default App;

//   <SQLiteProvider databaseName="cashflow.db" onInit={async (db) => {await initHistoryDB(db); await logDatabasePath();}}>