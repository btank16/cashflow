import { useSQLiteContext } from 'expo-sqlite';
// import * as FileSystem from 'expo-file-system';

// Note file path for iPhone 13 pro: file:///Users/blaketanski/Library/Developer/CoreSimulator/Devices/8C794453-2D71-462E-800E-0402490682C1/data/Containers/Data/Application/D4B08BA2-9C90-4B2B-A19C-ED40B8044CEF/Documents/ExponentExperienceData/@btanski/cashflow/SQLite/cashflow.db

export const initHistoryDB = async (db) => {
  return db.execAsync(`
    CREATE TABLE IF NOT EXISTS calculations_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      unique_id TEXT,
      date TEXT,
      calculator_type TEXT,
      input_values TEXT,
      results TEXT
    );
    CREATE TABLE IF NOT EXISTS saved_expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
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

  const saveCalculation = async (calculatorType, inputValues, results, uniqueId) => {
    // Check if the specific ID exists in the database
    const existingCalculation = await db.getFirstAsync(
      'SELECT id FROM calculations_history WHERE unique_id = ? AND calculator_type = ?',
      [uniqueId, calculatorType]
    );

    if (existingCalculation) {
      // If the ID exists, update the existing calculation
      await db.runAsync(
        `UPDATE calculations_history 
         SET input_values = ?, results = ?, date = ? 
         WHERE unique_id = ? AND calculator_type = ?`,
        [
          JSON.stringify(inputValues),
          JSON.stringify(results),
          new Date().toISOString(),
          uniqueId,
          calculatorType
        ]
      );
    } else {
      // If the ID doesn't exist, insert a new calculation
      await db.runAsync(
        `INSERT INTO calculations_history (unique_id, calculator_type, input_values, results, date) 
         VALUES (?, ?, ?, ?, ?)`,
        [
          uniqueId,
          calculatorType,
          JSON.stringify(inputValues),
          JSON.stringify(results),
          new Date().toISOString()
        ]
      );
    }
  };

  const saveExpense = async (category, cost, frequency, applicableCalculators) => {
    const date = new Date().toISOString();
    const applicableCalculatorsJSON = JSON.stringify(applicableCalculators);

    try {
      // First check if an identical expense exists (matching category, cost, and frequency)
      const existingExpense = await db.getFirstAsync(
        'SELECT * FROM saved_expenses WHERE category = ? AND cost = ? AND frequency = ?',
        [category, cost, frequency]
      );

      if (existingExpense) {
        // Parse existing calculators and merge with new ones
        const existingCalculators = JSON.parse(existingExpense.applicable_calculators);
        const updatedCalculators = [...new Set([...existingCalculators, ...applicableCalculators])];
        const updatedCalculatorsJSON = JSON.stringify(updatedCalculators);

        // Update only the applicable_calculators for the existing expense
        return db.runAsync(
          'UPDATE saved_expenses SET applicable_calculators = ? WHERE id = ?',
          [updatedCalculatorsJSON, existingExpense.id]
        );
      } else {
        // If no matching expense exists, insert a new one
        return db.runAsync(
          'INSERT INTO saved_expenses (date, category, cost, frequency, applicable_calculators) VALUES (?, ?, ?, ?, ?)',
          [date, category, cost, frequency, applicableCalculatorsJSON]
        );
      }
    } catch (error) {
      console.error('Error in saveExpense:', error);
      throw error;
    }
  };

  const getAllCalculations = async () => {
    return db.getAllAsync('SELECT * FROM calculations_history ORDER BY date DESC');
  };

  const getCalculationsByType = async (type) => {
    return db.getAllAsync('SELECT * FROM calculations_history WHERE calculator_type = ? ORDER BY date DESC', [type]);
  };

  const getSavedExpenses = async () => {
    return db.getAllAsync('SELECT * FROM saved_expenses ORDER BY date DESC');
  };

  const deleteCalculation = async (id) => {
    return db.runAsync('DELETE FROM calculations_history WHERE id = ?', [id]);
  };

  const deleteExpense = async (id) => {
    return db.runAsync('DELETE FROM saved_expenses WHERE id = ?', [id]);
  };

  const checkExistingExpense = async (category, cost, frequency) => {
    try {
      const results = await db.getAllAsync(
        'SELECT * FROM saved_expenses WHERE category = ? AND cost = ? AND frequency = ?',
        [category, cost, frequency]
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