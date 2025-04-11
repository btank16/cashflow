import { useSQLiteContext } from 'expo-sqlite';
import { getUserId } from '../app/UserInterface/Utils/UserAttributesCache.Js';
// import * as FileSystem from 'expo-file-system';

// Note file path for iPhone 13 pro: file:///Users/blaketanski/Library/Developer/CoreSimulator/Devices/8C794453-2D71-462E-800E-0402490682C1/data/Containers/Data/Application/D4B08BA2-9C90-4B2B-A19C-ED40B8044CEF/Documents/ExponentExperienceData/@btanski/cashflow/SQLite/cashflow.db

export const initHistoryDB = async (db) => {
  return db.execAsync(`
    CREATE TABLE IF NOT EXISTS calculations_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT,
      date TEXT,
      calculator_type TEXT,
      input_values TEXT,
      results TEXT
    );
    CREATE TABLE IF NOT EXISTS saved_expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT,
      date TEXT,
      category TEXT,
      cost TEXT,
      frequency TEXT,
      applicable_calculators TEXT
    );
  `);
};

// export const logDatabasePath = async () => {
//   const databasePath = `${FileSystem.documentDirectory}SQLite/cashflow.db`;
//   console.log('Database path:', databasePath);
// };

export function useDatabase() {
  const db = useSQLiteContext();

  const saveCalculation = async (calculatorType, inputValues, results, id = null) => {
    // Get the userId from the cache
    const userId = await getUserId();
    console.log('Saving calculation with userId:', userId);
    
    // If id is provided, check if the calculation exists for update
    if (id) {
      const existingCalculation = await db.getFirstAsync(
        'SELECT id FROM calculations_history WHERE id = ? AND calculator_type = ? AND (user_id = ? OR user_id IS NULL)',
        [id, calculatorType, userId]
      );

      if (existingCalculation) {
        console.log('Updating existing calculation with ID:', id, 'for userId:', userId);
        // If the ID exists, update the existing calculation
        await db.runAsync(
          `UPDATE calculations_history 
           SET input_values = ?, results = ?, date = ?, user_id = ? 
           WHERE id = ? AND calculator_type = ?`,
          [
            JSON.stringify(inputValues),
            JSON.stringify(results),
            new Date().toISOString(),
            userId,
            id,
            calculatorType
          ]
        );
        return id;
      }
    }
    
    console.log('Creating new calculation for userId:', userId, 'calculator type:', calculatorType);
    // If no id provided or no existing calculation found, insert a new one
    const result = await db.runAsync(
      `INSERT INTO calculations_history (user_id, calculator_type, input_values, results, date) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        userId,
        calculatorType,
        JSON.stringify(inputValues),
        JSON.stringify(results),
        new Date().toISOString()
      ]
    );
    
    return result.lastInsertRowId;
  };

  const saveExpense = async (category, cost, frequency, applicableCalculators) => {
    const date = new Date().toISOString();
    const applicableCalculatorsJSON = JSON.stringify(applicableCalculators);
    const userId = await getUserId();
    console.log('Saving expense with userId:', userId, 'category:', category);

    try {
      // First check if an identical expense exists (matching category, cost, frequency and userId)
      const existingExpense = await db.getFirstAsync(
        'SELECT * FROM saved_expenses WHERE category = ? AND cost = ? AND frequency = ? AND (user_id = ? OR user_id IS NULL)',
        [category, cost, frequency, userId]
      );

      if (existingExpense) {
        console.log('Updating existing expense with ID:', existingExpense.id, 'for userId:', userId);
        // Parse existing calculators and merge with new ones
        const existingCalculators = JSON.parse(existingExpense.applicable_calculators);
        const updatedCalculators = [...new Set([...existingCalculators, ...applicableCalculators])];
        const updatedCalculatorsJSON = JSON.stringify(updatedCalculators);

        // Update the applicable_calculators and ensure userId is set for the existing expense
        return db.runAsync(
          'UPDATE saved_expenses SET applicable_calculators = ?, user_id = ? WHERE id = ?',
          [updatedCalculatorsJSON, userId, existingExpense.id]
        );
      } else {
        console.log('Creating new expense for userId:', userId, 'with category:', category);
        // If no matching expense exists, insert a new one with userId
        return db.runAsync(
          'INSERT INTO saved_expenses (user_id, date, category, cost, frequency, applicable_calculators) VALUES (?, ?, ?, ?, ?, ?)',
          [userId, date, category, cost, frequency, applicableCalculatorsJSON]
        );
      }
    } catch (error) {
      console.error('Error in saveExpense:', error);
      throw error;
    }
  };

  const getAllCalculations = async () => {
    const userId = await getUserId();
    return db.getAllAsync('SELECT * FROM calculations_history WHERE user_id = ? OR user_id IS NULL ORDER BY date DESC', [userId]);
  };

  const getCalculationsByType = async (type) => {
    const userId = await getUserId();
    return db.getAllAsync('SELECT * FROM calculations_history WHERE calculator_type = ? AND (user_id = ? OR user_id IS NULL) ORDER BY date DESC', [type, userId]);
  };

  const getSavedExpenses = async () => {
    const userId = await getUserId();
    return db.getAllAsync('SELECT * FROM saved_expenses WHERE user_id = ? OR user_id IS NULL ORDER BY date DESC', [userId]);
  };

  const deleteCalculation = async (id) => {
    const userId = await getUserId();
    return db.runAsync('DELETE FROM calculations_history WHERE id = ? AND (user_id = ? OR user_id IS NULL)', [id, userId]);
  };

  const deleteExpense = async (id) => {
    const userId = await getUserId();
    return db.runAsync('DELETE FROM saved_expenses WHERE id = ? AND (user_id = ? OR user_id IS NULL)', [id, userId]);
  };

  const checkExistingExpense = async (category, cost, frequency) => {
    const userId = await getUserId();
    try {
      const results = await db.getAllAsync(
        'SELECT * FROM saved_expenses WHERE category = ? AND cost = ? AND frequency = ? AND (user_id = ? OR user_id IS NULL)',
        [category, cost, frequency, userId]
      );
      
      if (results && results.length > 0) {
        return {
          exists: true,
          calculators: JSON.parse(results[0].applicable_calculators)
        };
      }
      
      return {
        exists: false,
        calculators: []
      };
    } catch (error) {
      console.error('Error checking existing expense:', error);
      return {
        exists: false,
        calculators: []
      };
    }
  };

  return {
    saveCalculation,
    saveExpense,
    getAllCalculations,
    getCalculationsByType,
    getSavedExpenses,
    deleteCalculation,
    deleteExpense,
    checkExistingExpense,
  };
}