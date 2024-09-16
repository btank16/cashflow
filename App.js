import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './AppNavigator.Js';
import { initHistoryDB } from './database/historyDatabase.Js';
import { initExpenseDB } from './database/expenseDatabase.Js';

function App() {

  useEffect(() => {
    const setupDatabases = async () => {
      try {
        await initHistoryDB();
        console.log('History database initialized successfully');
        
        await initExpenseDB();
        console.log('Expense database initialized successfully');
      } catch (error) {
        console.error('Database initialization failed:', error);
      }
    };

    setupDatabases();
  }, []);

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}

export default App;