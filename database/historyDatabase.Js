import * as SQLite from 'expo-sqlite';

let db = null;

const openDatabase = async () => {
  if (db === null) {
    db = await SQLite.openDatabaseAsync('historyDatabase.db');
  }
  return db;
};

const initHistoryDB = async () => {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    database.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS calculations (id INTEGER PRIMARY KEY AUTOINCREMENT, data TEXT)',
        [],
        () => resolve(),
        (_, error) => reject(error)
      );
    });
  });
};

const saveCalculation = async (calculatorType, inputValues, results) => {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const calculationData = JSON.stringify([
      new Date().toISOString(),
      calculatorType,
      inputValues,
      results
    ]);

    database.transaction(tx => {
      tx.executeSql(
        'INSERT INTO calculations (data) VALUES (?)',
        [calculationData],
        (_, result) => resolve(result.insertId),
        (_, error) => reject(error)
      );
    });
  });
};

const getAllCalculations = async () => {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    database.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM calculations ORDER BY id DESC',
        [],
        (_, { rows }) => {
          const calculations = rows._array.map(row => ({
            id: row.id,
            data: JSON.parse(row.data)
          }));
          resolve(calculations);
        },
        (_, error) => reject(error)
      );
    });
  });
};

const getCalculationsByType = async (type) => {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    database.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM calculations ORDER BY id DESC',
        [],
        (_, { rows }) => {
          const calculations = rows._array
            .map(row => ({
              id: row.id,
              data: JSON.parse(row.data)
            }))
            .filter(calc => calc.data[1] === type);
          resolve(calculations);
        },
        (_, error) => reject(error)
      );
    });
  });
};

const deleteCalculation = async (id) => {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    database.transaction(tx => {
      tx.executeSql(
        'DELETE FROM calculations WHERE id = ?',
        [id],
        () => resolve(),
        (_, error) => reject(error)
      );
    });
  });
};

export { initHistoryDB, saveCalculation, getAllCalculations, getCalculationsByType, deleteCalculation };