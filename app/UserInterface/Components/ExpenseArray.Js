import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import Collapsible from 'react-native-collapsible';
import colors from '../Colors/colors.Js'
import { PlusIcon, MinusIcon } from 'react-native-heroicons/outline'

const formatNumber = (value) => {
  if (!value) return ''; //Ensures that the values is not a falsy (e.g., NaN, undefined, 0, etc.)
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ','); //Places commas between every 3 digits while avoiding placing one at the beginning and end
};

const unformatNumber = (value) => {
  return value.replace(/,/g, ''); //Removes the commas from the "value"
};

const ExpenseArray = ({ onDataChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [tableData, setTableData] = useState([
    // Sets a shell table that may add rows and be filled in on a data change
    { id: 1, expense: '', cost: '' },
    { id: 2, expense: '', cost: '' },
    { id: 3, expense: '', cost: '' },
  ]);

  useEffect(() => {
    updateParentData(tableData); //This sets an auxilary array that will be sent to functions
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  //adds a row and the associated data to the data table
  const addRow = () => {
    const newId = tableData.length + 1;
    const updatedData = [
      ...tableData,
      { id: newId, expense: '', cost: '' },
    ];
    setTableData(updatedData);
    updateParentData(updatedData);
  };
  //updates the cell in the table and unformats it if it is "cost"
  const updateCell = (id, field, value) => {
    const updatedData = tableData.map(row => 
      row.id === id ? { ...row, [field]: field === 'cost' ? unformatNumber(value) : value } : row
    );
    setTableData(updatedData);
    updateParentData(updatedData);
  };
  //unformats the number in each row in the cost column
  const updateParentData = (data) => {
    if (onDataChange) {
      const costValues = data.map(row => unformatNumber(row.cost));
      onDataChange(costValues);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <TouchableOpacity onPress={toggleCollapse} style={styles.header}> 
          {isCollapsed ? 
          <PlusIcon color={colors.accent} size={24} /> : 
          <MinusIcon color={colors.accent} size={24} />
          }
          <Text style={styles.headerText}>Itemized Expenses</Text>
        </TouchableOpacity>

        <Collapsible collapsed={isCollapsed}>
          <ScrollView style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={styles.headerCell}>Monthly Expense:</Text>
              <Text style={styles.headerCell}>Cost ($):</Text>
            </View>
            {tableData.map((row) => (
              <View key={row.id} style={styles.tableRow}>
                <TextInput
                  style={styles.cell}
                  value={row.expense}
                  onChangeText={(text) => updateCell(row.id, 'expense', text)}
                  placeholder="Enter expense"
                  onSubmitEditing={Keyboard.dismiss}
                />
                <TextInput
                  style={styles.cell}
                  value={formatNumber(row.cost)}
                  onChangeText={(text) => updateCell(row.id, 'cost', text)}
                  placeholder="Enter cost"
                  keyboardType="numeric"
                  onSubmitEditing={Keyboard.dismiss}
                />
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity onPress={addRow} style={styles.addButton}>
            <Text style={styles.addButtonText}>Add Expense</Text>
          </TouchableOpacity>
        </Collapsible>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  header: {
    backgroundColor: colors.background,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.accent,
    alignContent: 'flex-end',
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.basicText
  },
  tableContainer: {
    maxHeight: 200, // Adjust this value as needed
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#e0e0e0',
  },
  headerCell: {
    flex: 1,
    padding: 10,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cell: {
    flex: 1,
    padding: 10,
    borderRightWidth: 1,
    borderRightColor: '#ccc',
  },
  addButton: {
    backgroundColor: colors.mainShade,
    padding: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: colors.basicText,
    fontWeight: 'bold',
  },
});

export default ExpenseArray;