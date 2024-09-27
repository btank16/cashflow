import { useSQLiteContext } from 'expo-sqlite';

export const initHistoryDB = async (db) => {
  return db.execAsync(`
    CREATE TABLE IF NOT EXISTS calculations_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT,
      calculator_type TEXT,
      input_values TEXT,
      results TEXT
    );
    CREATE TABLE IF NOT EXISTS saved_expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT,
      name TEXT,
      amount REAL,
      frequency TEXT,
      applicable_calculators TEXT
    );
  `);
};

export function useDatabase() {
  const db = useSQLiteContext();

  const saveCalculation = async (calculatorType, inputValues, results) => {
    if (inputValues.id) {
      // If an id exists, update the existing calculation
      await db.runAsync(
        `UPDATE calculations_history 
         SET input_values = ?, results = ?, date = ? 
         WHERE id = ? AND calculator_type = ?`,
        [
          JSON.stringify(inputValues),
          JSON.stringify(results),
          new Date().toISOString(),
          inputValues.id,
          calculatorType
        ]
      );
    } else {
      // If no id exists, insert a new calculation
      await db.runAsync(
        `INSERT INTO calculations_history (calculator_type, input_values, results, date) 
         VALUES (?, ?, ?, ?)`,
        [
          calculatorType,
          JSON.stringify(inputValues),
          JSON.stringify(results),
          new Date().toISOString()
        ]
      );
    }
  };

  const saveExpense = async (name, amount, frequency, applicableCalculators) => {
    const date = new Date().toISOString();
    const applicableCalculatorsJSON = JSON.stringify(applicableCalculators);

    return db.runAsync(
      'INSERT INTO saved_expenses (date, name, amount, frequency, applicable_calculators) VALUES (?, ?, ?, ?, ?)',
      [date, name, amount, frequency, applicableCalculatorsJSON]
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