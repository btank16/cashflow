import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, TextInput, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { ChevronDownIcon, PlusIcon, ChevronUpIcon, CheckIcon, TrashIcon } from 'react-native-heroicons/outline';
import ExpenseLogo from '../../assets/icons/ExpenseLogo.jsx';
import colors from '../Colors/colors.Js';
import { useDatabase } from '../../../database/cashflowDatabase.Js';
import { Ionicons } from '@expo/vector-icons';

const frequencies = [
  { label: 'Monthly', value: 'Monthly' },
  { label: 'Annually', value: 'Annually' },
  { label: 'Non-recurring', value: 'Non-recurring' },
];

const OperatingExpenses = ({ 
  calculatorType, 
  onActiveChange, 
  onExpensesChange,
  onSaveNewExpensesChange
}) => {
  const [isActive, setIsActive] = useState(true);
  const [newExpenses, setNewExpenses] = useState([{ 
    category: '', 
    frequency: 'Monthly', 
    cost: '',
    showFrequency: false 
  }]);
  const [savedExpenses, setSavedExpenses] = useState([]);
  const [saveNewExpenses, setSaveNewExpenses] = useState(false);
  const db = useDatabase();
  const [focusedInputs, setFocusedInputs] = useState({});
  const [removedSavedExpenses, setRemovedSavedExpenses] = useState([]);

  useEffect(() => {
    loadSavedExpenses();
  }, [calculatorType]);

  useEffect(() => {
    // Combine new and saved expenses and notify parent
    const allExpenses = [...newExpenses, ...savedExpenses];
    onExpensesChange(allExpenses);
  }, [newExpenses, savedExpenses]);

  const loadSavedExpenses = async () => {
    try {
      const expenses = await db.getSavedExpenses();
      const filteredExpenses = expenses.filter(expense => {
        const calculators = JSON.parse(expense.applicable_calculators);
        return calculators.includes(calculatorType);
      });
      setSavedExpenses(filteredExpenses);
    } catch (error) {
      console.error('Error loading expenses:', error);
    }
  };

  const handleToggleActive = (value) => {
    setIsActive(value);
    onActiveChange(value);
  };

  const addNewExpense = () => {
    setNewExpenses([
      ...newExpenses, 
      { category: '', frequency: 'Monthly', cost: '', showFrequency: false }
    ]);
  };

  const toTitleCase = (str) => {
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const toggleSaveNewExpenses = async () => {
    const newValue = !saveNewExpenses;
    setSaveNewExpenses(newValue);
    onSaveNewExpensesChange(newValue);

    if (newValue) {
      // Save all new expenses that aren't from saved expenses
      try {
        const expensesToSave = newExpenses.filter(expense => !expense.fromSaved);
        
        for (const expense of expensesToSave) {
          const formattedCategory = toTitleCase(expense.category);
          
          // Check if expense already exists
          const { exists, calculators } = await db.checkExistingExpense(
            formattedCategory,
            expense.cost,
            expense.frequency
          );

          if (exists) {
            // If expense exists but doesn't include current calculator type,
            // add it to the applicable calculators
            if (!calculators.includes(calculatorType)) {
              const updatedCalculators = [...calculators, calculatorType];
              await db.saveExpense(
                formattedCategory,
                expense.cost,
                expense.frequency,
                updatedCalculators
              );
            }
          } else {
            // If expense doesn't exist, create new entry
            await db.saveExpense(
              formattedCategory,
              expense.cost,
              expense.frequency,
              [calculatorType]
            );
          }
        }
      } catch (error) {
        console.error('Error saving expenses:', error);
      }
    }
  };

  const updateNewExpense = async (index, field, value) => {
    const updated = newExpenses.map((expense, i) => 
      i === index ? { ...expense, [field]: value } : expense
    );
    setNewExpenses(updated);

    // If checkbox is checked and this isn't a saved expense, handle database operation
    if (saveNewExpenses && !updated[index].fromSaved) {
      try {
        const expenseToUpdate = updated[index];
        const formattedCategory = toTitleCase(expenseToUpdate.category);
        
        // Only proceed if we have both category and cost
        if (expenseToUpdate.category && expenseToUpdate.cost) {
          // Check if expense already exists
          const { exists, calculators } = await db.checkExistingExpense(
            formattedCategory,
            expenseToUpdate.cost,
            expenseToUpdate.frequency
          );

          if (exists) {
            // If expense exists but doesn't include current calculator type,
            // add it to the applicable calculators
            if (!calculators.includes(calculatorType)) {
              const updatedCalculators = [...calculators, calculatorType];
              await db.saveExpense(
                formattedCategory,
                expenseToUpdate.cost,
                expenseToUpdate.frequency,
                updatedCalculators
              );
            }
          } else {
            // If expense doesn't exist, create new entry
            await db.saveExpense(
              formattedCategory,
              expenseToUpdate.cost,
              expenseToUpdate.frequency,
              [calculatorType]
            );
          }
        }
      } catch (error) {
        console.error('Error saving expense:', error);
      }
    }
  };

  const deleteExpense = (indexToDelete) => {
    const expenseToDelete = newExpenses[indexToDelete];
    
    // If the expense was from saved expenses, restore it
    if (expenseToDelete.fromSaved) {
      // Find the original saved expense
      const originalSaved = removedSavedExpenses.find(saved => 
        saved.category === expenseToDelete.category &&
        saved.cost === expenseToDelete.cost &&
        saved.frequency === expenseToDelete.frequency
      );

      if (originalSaved) {
        // Restore to saved expenses
        setSavedExpenses([...savedExpenses, originalSaved]);
        // Remove from removed saved expenses
        setRemovedSavedExpenses(removedSavedExpenses.filter(saved => saved.id !== originalSaved.id));
      }
    }

    // Remove from active expenses
    setNewExpenses(newExpenses.filter((_, index) => index !== indexToDelete));
  };

  const addSavedExpenseToActive = (savedExpense) => {
    // Add to active expenses with a flag indicating it came from saved
    setNewExpenses([
      ...newExpenses,
      {
        category: savedExpense.category,
        frequency: savedExpense.frequency,
        cost: savedExpense.cost,
        showFrequency: false,
        fromSaved: true, // Add this flag
        originalSaved: savedExpense // Store the original saved expense
      }
    ]);

    // Remove from saved expenses and store in removed array
    setSavedExpenses(savedExpenses.filter(expense => expense.id !== savedExpense.id));
    setRemovedSavedExpenses([...removedSavedExpenses, savedExpense]);
  };

  const renderExpenseInput = (expense, index) => (
    <React.Fragment key={index}>
      <View style={styles.expenseInputs}>
        <View style={[
          styles.expenseHeader,
          newExpenses.length === 1 && styles.expenseHeaderSingle
        ]}>
          <View style={[
            styles.inputContainer,
            newExpenses.length > 1 && styles.inputContainerWithDelete
          ]}>
            <Text style={styles.inputLabel}>Expense category</Text>
            <View style={[
              styles.textInputContainer,
              focusedInputs[`category-${index}`] && styles.inputFocused
            ]}>
              <TextInput
                style={styles.input}
                placeholder="Select category"
                value={expense.category}
                onChangeText={(value) => updateNewExpense(index, 'category', value)}
                onFocus={() => setFocusedInputs(prev => ({ ...prev, [`category-${index}`]: true }))}
                onBlur={() => setFocusedInputs(prev => ({ ...prev, [`category-${index}`]: false }))}
                placeholderTextColor={colors.sixthGrey}
              />
            </View>
          </View>
          
          {newExpenses.length > 1 && (
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={() => deleteExpense(index)}
            >
              <TrashIcon size={20} color={colors.quaternaryRed} />
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.frequencyAndCost}>
          <View style={styles.frequencyInput}>
            <Text style={styles.inputLabel}>Frequency</Text>
            <TouchableOpacity 
              style={styles.frequencyButton}
              onPress={() => {
                Keyboard.dismiss();
                const updatedExpenses = newExpenses.map((exp, i) => ({
                  ...exp,
                  showFrequency: i === index ? !exp.showFrequency : false
                }));
                setNewExpenses(updatedExpenses);
              }}
            >
              <Text style={styles.frequencyButtonText}>{expense.frequency}</Text>
              <Ionicons 
                name={expense.showFrequency ? "chevron-up" : "chevron-down"} 
                size={16} 
                color={colors.fifthGrey} 
              />
            </TouchableOpacity>
            {expense.showFrequency && (
              <View style={styles.frequencyOptions}>
                {frequencies.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.frequencyOption,
                      option.value === frequencies[frequencies.length - 1].value && styles.lastFrequencyOption
                    ]}
                    onPress={() => {
                      const updatedExpenses = newExpenses.map((exp, i) => 
                        i === index 
                          ? { ...exp, frequency: option.value, showFrequency: false }
                          : exp
                      );
                      setNewExpenses(updatedExpenses);
                    }}
                  >
                    <Text style={styles.frequencyOptionText}>{option.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={styles.costInput}>
            <Text style={styles.inputLabel}>Cost</Text>
            <View style={[
              styles.textInputContainer,
              focusedInputs[`cost-${index}`] && styles.inputFocused
            ]}>
              <Text style={styles.dollarSign}>$</Text>
              <TextInput
                style={styles.costInputField}
                placeholder="ex. 500"
                value={expense.cost}
                onChangeText={(value) => updateNewExpense(index, 'cost', value)}
                keyboardType="numeric"
                onFocus={() => setFocusedInputs(prev => ({ ...prev, [`cost-${index}`]: true }))}
                onBlur={() => setFocusedInputs(prev => ({ ...prev, [`cost-${index}`]: false }))}
                placeholderTextColor={colors.sixthGrey}
              />
            </View>
          </View>
        </View>
      </View>
      {index < newExpenses.length - 1 && (
        <View style={styles.expenseDivider} />
      )}
    </React.Fragment>
  );

  const renderSavedExpenses = () => {
    if (savedExpenses.length === 0) {
      return (
        <View style={styles.emptySavedState}>
          <ExpenseLogo />
          <Text style={styles.emptySavedStateText}>No Saved Expenses</Text>
        </View>
      );
    }

    return (
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.savedExpensesContainer}
      >
        {savedExpenses.map((expense, index) => (
          <View key={expense.id} style={styles.savedExpenseItem}>
            <View style={styles.savedExpenseHeader}>
              <Text numberOfLines={2} style={styles.savedExpenseCategory}>
                {expense.category}
              </Text>
              <Text style={styles.savedExpenseFrequency}>
                ({expense.frequency})
              </Text>
            </View>
            <View style={styles.savedExpenseBottom}>
              <Text style={styles.savedExpenseCost}>${expense.cost}</Text>
              <TouchableOpacity
                style={styles.addSavedButton}
                onPress={() => addSavedExpenseToActive(expense)}
              >
                <PlusIcon size={16} color={colors.iconWhite} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={() => {
      Keyboard.dismiss();
      setNewExpenses(newExpenses.map(exp => ({...exp, showFrequency: false})));
    }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Operating Expenses</Text>
            <Switch
              value={isActive}
              onValueChange={handleToggleActive}
              trackColor={{ false: colors.quaternaryGrey, true: colors.primaryGreen }}
            />
          </View>
        </View>

        {isActive && (
          <View style={styles.content}>
            <Text style={styles.sectionTitle}>Active Expenses</Text>
            {newExpenses.map((expense, index) => renderExpenseInput(expense, index))}
            <TouchableOpacity 
              style={styles.addButton}
              onPress={addNewExpense}
            >
              <PlusIcon size={20} color={colors.primaryGreen} />
              <Text style={styles.addButtonText}>Add New Expense</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.checkboxContainer}
              onPress={toggleSaveNewExpenses}
            >
              <View style={[
                styles.checkbox,
                saveNewExpenses ? styles.activeCheckbox : styles.inactiveCheckbox
              ]}>
                {saveNewExpenses && <CheckIcon size={16} color={colors.iconWhite} />}
              </View>
              <Text style={styles.checkboxLabel}>
                Save new expenses for this calculator
              </Text>
              <Ionicons 
                name="information-circle-outline" 
                size={20} 
                color={colors.primaryGrey}
                style={styles.infoIcon}
              />
            </TouchableOpacity>
            
            <View style={styles.divider} />

            <Text style={styles.sectionTitle}>Saved Expenses</Text>
            {renderSavedExpenses()}
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.iconWhite,
    borderRadius: 8,
    marginVertical: 8,
  },
  header: {
    backgroundColor: colors.secondaryGrey,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.primaryBlack,
  },
  content: {
    backgroundColor: colors.tertiaryGrey,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.primaryBlack,
    marginBottom: 12,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  addButtonText: {
    color: colors.primaryGreen,
    fontSize: 14,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.primaryGrey,
    textAlign: 'center',
    marginTop: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primaryGrey,
    marginBottom: 8,
  },
  input: {
    height: 50,
    backgroundColor: colors.tertiaryGrey,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.quaternaryGrey,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.primaryBlack,
  },
  frequencyAndCost: {
    flexDirection: 'row',
    gap: 16,
  },
  frequencyInput: {
    flex: 1,
  },
  costInput: {
    flex: 1,
  },
  dollarSign: {
    paddingLeft: 16,
    fontSize: 16,
    color: colors.primaryBlack,
  },
  costInputField: {
    flex: 1,
    height: '100%',
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  frequencyButton: {
    height: 50,
    backgroundColor: colors.tertiaryGrey,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.quaternaryGrey,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  frequencyButtonText: {
    fontSize: 16,
    color: colors.primaryBlack,
  },
  frequencyOptions: {
    position: 'absolute',
    top: 75,
    left: 0,
    right: 0,
    backgroundColor: colors.iconWhite,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.quaternaryGrey,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  frequencyOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.quaternaryGrey,
  },
  lastFrequencyOption: {
    borderBottomWidth: 0,
  },
  frequencyOptionText: {
    fontSize: 16,
    color: colors.primaryBlack,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    marginRight: 12,
  },
  activeCheckbox: {
    backgroundColor: colors.primaryBlack,
    borderColor: colors.primaryBlack,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inactiveCheckbox: {
    backgroundColor: colors.iconWhite,
    borderColor: colors.secondaryGrey,
  },
  checkboxLabel: {
    fontSize: 14,
    color: colors.primaryBlack,
    flex: 1,
  },
  infoIcon: {
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: colors.secondaryGrey,
    marginVertical: 16,
  },
  textInputContainer: {
    height: 50,
    backgroundColor: colors.tertiaryGrey,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.quaternaryGrey,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputFocused: {
    backgroundColor: colors.iconWhite,
    borderColor: colors.primaryGreen,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.primaryBlack,
  },
  dollarSign: {
    paddingLeft: 16,
    fontSize: 16,
    color: colors.fifthGrey,
  },
  costInputField: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.primaryBlack,
    backgroundColor: 'transparent',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primaryGrey,
    marginBottom: 8,
  },
  expenseDivider: {
    height: 1,
    backgroundColor: colors.quaternaryGrey,
    marginVertical: 16,
  },
  expenseHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
  },
  expenseHeaderSingle: {
    paddingRight: 0,
  },
  inputContainer: {
    flex: 1,
    marginBottom: 16,
  },
  inputContainerWithDelete: {
    flex: 1,
    marginRight: 12, // Spacing between input and delete button
  },
  deleteButton: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: colors.secondaryRed,
    borderWidth: 1,
    borderColor: colors.tertiaryRed,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  emptySavedState: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  emptySavedStateText: {
    fontSize: 16,
    color: colors.primaryGrey,
  },
  savedExpensesContainer: {
    paddingVertical: 8,
    paddingRight: 16, // Add padding for last item
    gap: 8,
  },
  savedExpenseItem: {
    backgroundColor: colors.iconWhite,
    borderRadius: 8,
    padding: 12,
    width: 160,
    marginLeft: 8,
    justifyContent: 'space-between',
  },
  savedExpenseHeader: {
    marginBottom: 8,
  },
  savedExpenseCategory: {
    fontSize: 14,
    color: colors.primaryGrey,
    fontWeight: '500',
    marginBottom: 2,
  },
  savedExpenseFrequency: {
    fontSize: 12,
    color: colors.primaryGrey,
  },
  savedExpenseBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  savedExpenseCost: {
    fontSize: 16,
    color: colors.primaryBlack,
    fontWeight: '600',
  },
  addSavedButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primaryGreen,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default OperatingExpenses;
