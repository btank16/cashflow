import * as SQLite from 'expo-sqlite';

let db = null;

const openDatabase = async () => {
  if (db === null) {
    db = await SQLite.openDatabaseAsync('expenseDatabase.db');
  }
  return db;
};

const initExpenseDB = async () => {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    database.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS expenses (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, amount REAL, date TEXT)',
        [],
        () => resolve(),
        (_, error) => reject(error)
      );
    });
  });
};

const addExpense = async (name, amount) => {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    database.transaction(tx => {
      tx.executeSql(
        'INSERT INTO expenses (name, amount, date) VALUES (?, ?, ?)',
        [name, amount, new Date().toISOString()],
        (_, result) => resolve(result.insertId),
        (_, error) => reject(error)
      );
    });
  });
};

const getAllExpenses = async () => {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    database.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM expenses ORDER BY date DESC',
        [],
        (_, { rows }) => resolve(rows._array),
        (_, error) => reject(error)
      );
    });
  });
};

const deleteExpense = async (id) => {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    database.transaction(tx => {
      tx.executeSql(
        'DELETE FROM expenses WHERE id = ?',
        [id],
        () => resolve(),
        (_, error) => reject(error)
      );
    });
  });
};

export { initExpenseDB, addExpense, getAllExpenses, deleteExpense };