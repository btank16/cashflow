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
      unique_id TEXT,
      date TEXT,
      name TEXT,
      amount REAL,
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

  const saveExpense = async (uniqueId, name, amount, frequency, applicableCalculators) => {
    const date = new Date().toISOString();
    const applicableCalculatorsJSON = JSON.stringify(applicableCalculators);

    return db.runAsync(
      'INSERT INTO saved_expenses (unique_id, date, name, amount, frequency, applicable_calculators) VALUES (?, ?, ?, ?, ?, ?)',
      [uniqueId, date, name, amount, frequency, applicableCalculatorsJSON]
    );
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

  return {
    saveCalculation,
    saveExpense,
    getAllCalculations,
    getCalculationsByType,
    getSavedExpenses,
    deleteCalculation,
    deleteExpense
  };
}