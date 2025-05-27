import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, TextInput, Keyboard, TouchableWithoutFeedback, Modal } from 'react-native';
import { PlusIcon, CheckIcon, TrashIcon, ArrowLongRightIcon, ChevronDownIcon } from 'react-native-heroicons/outline';
import ExpenseLogo from '../../assets/icons/ExpenseLogo.jsx';
import colors from '../Colors/colors.Js';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import InfoComponent from './InfoComponent.Js';
import { getExpenses } from '../Utils/DataCache.Js';

const frequencies = [
  { label: 'Monthly', value: 'Monthly' },
  { label: 'Annually', value: 'Annually' },
  { label: 'Non-recurring', value: 'Non-recurring' },
];

const OperatingExpenses = ({ 
  calculatorType, 
  onActiveChange, 
  onExpensesChange,
  onSaveNewExpensesChange,
  initialExpenses = [],
  sectionTitle = "Operating Expenses",
  viewAllButtonText = "View all Saved Expenses",
  infoTitle,
  infoDescription
}) => {
  const [isActive, setIsActive] = useState(true);
  const [activeExpenses, setActiveExpenses] = useState([{ 
    category: '', 
    frequency: 'Monthly', 
    cost: '',
    showFrequency: false 
  }]);
  const [savedExpenses, setSavedExpenses] = useState([]);
  const [saveNewExpenses, setSaveNewExpenses] = useState(false);
  const [focusedInputs, setFocusedInputs] = useState({});
  const [removedSavedExpenses, setRemovedSavedExpenses] = useState([]);
  const navigation = useNavigation();
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [activePickerIndex, setActivePickerIndex] = useState(null);
  const [tempFrequency, setTempFrequency] = useState('');
  const [infoModalVisible, setInfoModalVisible] = useState(false);

  useEffect(() => {
    if (initialExpenses && initialExpenses.length > 0) {
      const areExpensesDifferent = JSON.stringify(initialExpenses) !== JSON.stringify(activeExpenses);
      if (areExpensesDifferent) {
        // First set active expenses
        setActiveExpenses(initialExpenses.map(expense => ({
          ...expense,
          showFrequency: false
        })));

        // Then load saved expenses with the updated active expenses
        loadSavedExpenses();
      }
    }
  }, [initialExpenses]);

  useEffect(() => {
    if (activeExpenses.length > 0) {
      loadSavedExpenses();
    }
  }, [JSON.stringify(activeExpenses)]);

  useEffect(() => {
    // Only pass active expenses to parent component
    onExpensesChange(activeExpenses);
  }, [activeExpenses]);

  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        // Close all frequency dropdowns when keyboard hides
        setActiveExpenses(activeExpenses.map(exp => ({
          ...exp,
          showFrequency: false
        })));
      }
    );

    return () => {
      keyboardDidHideListener.remove();
    };
  }, [activeExpenses]);

  const loadSavedExpenses = async () => {
    try {
      // Get all expenses from DataCache
      const allExpenses = await getExpenses();
      
      const filteredExpenses = allExpenses.filter(expense => {
        try {
          const calculators = JSON.parse(expense.applicable_calculators || '[]');
          
          // Check if this saved expense is already in activeExpenses
          const isAlreadyActive = activeExpenses.some(activeExp => 
            activeExp.category === expense.category && 
            parseFloat(activeExp.cost) === parseFloat(expense.cost) &&
            activeExp.frequency === expense.frequency
          );
  
          return calculators.includes(calculatorType) && !isAlreadyActive;
        } catch (error) {
          console.error('Error parsing applicable_calculators:', error);
          return false;
        }
      });
      
      setSavedExpenses(filteredExpenses);
    } catch (error) {
      console.error('Error loading expenses:', error);
      setSavedExpenses([]);
    }
  };

  const handleToggleActive = (value) => {
    setIsActive(value);
    onActiveChange(value);
  };

  const addNewExpense = () => {
    setActiveExpenses([
      ...activeExpenses, 
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

  const toggleSaveNewExpenses = () => {
    const newValue = !saveNewExpenses;
    setSaveNewExpenses(newValue);
    onSaveNewExpensesChange(newValue);
  };

  const updateActiveExpense = (index, field, value) => {
    const updated = activeExpenses.map((expense, i) => 
      i === index ? { ...expense, [field]: value } : expense
    );
    setActiveExpenses(updated);
  };

  const deleteExpense = (indexToDelete) => {
    const expenseToDelete = activeExpenses[indexToDelete];
    
    // If the expense was from saved expenses, restore it
    if (expenseToDelete.fromSaved) {
      // Restore to saved expenses
      setSavedExpenses([...savedExpenses, expenseToDelete.originalSaved]);
    }

    // Remove from active expenses
    setActiveExpenses(activeExpenses.filter((_, index) => index !== indexToDelete));
  };

  const addSavedExpenseToActive = (savedExpense) => {
    // Add to active expenses with a flag indicating it came from saved
    setActiveExpenses([
      ...activeExpenses,
      {
        category: savedExpense.category,
        frequency: savedExpense.frequency,
        cost: savedExpense.cost,
        showFrequency: false,
        fromSaved: true,
        originalSaved: savedExpense
      }
    ]);

    // Remove from saved expenses
    setSavedExpenses(savedExpenses.filter(expense => expense.id !== savedExpense.id));
  };

  const openFrequencyPicker = (index) => {
    Keyboard.dismiss();
    setActivePickerIndex(index);
    setTempFrequency(activeExpenses[index].frequency);
    setIsPickerVisible(true);
  };

  const handleFrequencyDone = () => {
    if (activePickerIndex !== null && tempFrequency !== activeExpenses[activePickerIndex].frequency) {
      updateActiveExpense(activePickerIndex, 'frequency', tempFrequency);
    }
    setIsPickerVisible(false);
    setActivePickerIndex(null);
  };

  const handleFrequencyCancel = () => {
    setIsPickerVisible(false);
    setActivePickerIndex(null);
  };

  const handleInfoPress = () => {
    if (infoTitle || infoDescription) {
      setInfoModalVisible(true);
    }
  };

  const renderExpenseInput = (expense, index) => (
    <React.Fragment key={index}>
      <View style={styles.expenseInputs}>
        <View style={[
          styles.expenseHeader,
          activeExpenses.length === 1 && styles.expenseHeaderSingle
        ]}>
          <View style={[
            styles.inputContainer,
            activeExpenses.length > 1 && styles.inputContainerWithDelete
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
                onChangeText={(value) => updateActiveExpense(index, 'category', value)}
                onFocus={() => setFocusedInputs(prev => ({ ...prev, [`category-${index}`]: true }))}
                onBlur={() => setFocusedInputs(prev => ({ ...prev, [`category-${index}`]: false }))}
                placeholderTextColor={colors.sixthGrey}
              />
            </View>
          </View>
          
          {activeExpenses.length > 1 && (
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
              activeOpacity={0.7}
              onPress={() => openFrequencyPicker(index)}
              style={styles.touchableWrapper}
            >
              <View style={styles.frequencyButton}>
                <Text style={styles.frequencyButtonText}>{expense.frequency}</Text>
                <ChevronDownIcon size={20} color={colors.primaryBlack} style={styles.icon} />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.costInput}>
            <Text style={styles.inputLabel}>Cost</Text>
            <View style={[
              styles.textInputContainer,
              focusedInputs[`cost-${index}`] && styles.inputFocused
            ]}>
              <TextInput
                style={styles.costInputField}
                placeholder="ex. 100"
                value={expense.cost}
                onChangeText={(value) => updateActiveExpense(index, 'cost', value)}
                keyboardType="numeric"
                onFocus={() => setFocusedInputs(prev => ({ ...prev, [`cost-${index}`]: true }))}
                onBlur={() => setFocusedInputs(prev => ({ ...prev, [`cost-${index}`]: false }))}
                placeholderTextColor={colors.sixthGrey}
              />
              <View style={styles.typeContainer}>
                <Text style={styles.typeText}>$</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      {index < activeExpenses.length - 1 && (
        <View style={styles.expenseDivider} />
      )}
    </React.Fragment>
  );

  const SavedExpenseItem = ({ expense, onAdd }) => (
    <View style={styles.savedExpenseItem}>
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
          onPress={() => onAdd(expense)}
        >
          <PlusIcon size={16} color={colors.iconWhite} />
        </TouchableOpacity>
      </View>
    </View>
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
      <View style={styles.savedExpensesOuterContainer}>
        <ScrollView 
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.savedExpensesContainer}
          nestedScrollEnabled={true}
        >
          {savedExpenses.map((expense) => (
            <SavedExpenseItem
              key={expense.id}
              expense={expense}
              onAdd={addSavedExpenseToActive}
            />
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={styles.titleWithInfoContainer}>
            <TouchableOpacity onPress={handleInfoPress} style={styles.infoButton}>
              <Ionicons name="information-circle-outline" size={16} color={colors.primaryGrey} />
            </TouchableOpacity>
            <Text style={styles.title}>{sectionTitle}</Text>
          </View>
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
          {activeExpenses.map((expense, index) => renderExpenseInput(expense, index))}
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
          </TouchableOpacity>
          
          <View style={styles.divider} />

          <View style={styles.savedExpensesSection}>
            <Text style={styles.sectionTitle}>Saved Expenses</Text>
            {renderSavedExpenses()}
            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={() => navigation.navigate('ExpenseScreen')}
            >
              <Text style={styles.viewAllButtonText}>{viewAllButtonText}</Text>
              <ArrowLongRightIcon size={18} color={colors.primaryGreen} style={{ marginBottom: -2 }}/>
            </TouchableOpacity>
          </View>
          
          <Modal
            visible={isPickerVisible}
            transparent={true}
            animationType="slide"
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.pickerHeader}>
                  <TouchableOpacity onPress={handleFrequencyCancel} style={styles.headerButton}>
                    <Text style={styles.cancelButton}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleFrequencyDone} style={styles.headerButton}>
                    <Text style={styles.doneButton}>Done</Text>
                  </TouchableOpacity>
                </View>
                <Picker
                  selectedValue={tempFrequency}
                  onValueChange={setTempFrequency}
                  style={styles.picker}
                >
                  {frequencies.map((option) => (
                    <Picker.Item 
                      key={option.value} 
                      label={option.label} 
                      value={option.value}
                      color={colors.primaryBlack}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          </Modal>
        </View>
      )}

      <InfoComponent
        visible={infoModalVisible}
        onClose={() => setInfoModalVisible(false)}
        title={infoTitle || sectionTitle}
        description={infoDescription || "No additional information available."}
      />
    </View>
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
  titleWithInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.primaryBlack,
  },
  infoButton: {
    marginRight: 5,
  },
  content: {
    backgroundColor: colors.tertiaryGrey,
    paddingHorizontal: 16,
    paddingVertical: 16,
    width: '100%',
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
  inputContainer: {
    flex: 1,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primaryGrey,
    marginBottom: 8,
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
  costInputField: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.primaryBlack,
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
  savedExpenseHeader: {
    marginBottom: 8,
    height: 44,
  },
  savedExpenseCategory: {
    fontSize: 14,
    color: colors.primaryGrey,
    fontWeight: '500',
    marginBottom: 2,
    lineHeight: 18,
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
  savedExpensesSection: {
    width: '100%',
  },
  savedExpensesOuterContainer: {
    marginLeft: -16,
    marginRight: -16,
    paddingLeft: 16,
    height: 124,
  },
  savedExpensesContainer: {
    flexDirection: 'row',
    paddingRight: 16,
    paddingLeft: 2,
  },
  savedExpenseItem: {
    backgroundColor: colors.iconWhite,
    borderRadius: 8,
    padding: 12,
    width: 160,
    marginRight: 8,
    height: 120,
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  viewAllButtonText: {
    color: colors.primaryGreen,
    fontSize: 14,
    fontWeight: '500',
  },
  typeContainer: {
    backgroundColor: colors.secondaryGrey,
    paddingHorizontal: 8,
    height: '85%',
    justifyContent: 'center',
    borderRadius: 10,
    marginRight: 4,
  },
  typeText: {
    color: colors.fifthGrey,
    fontSize: 16,
  },
  touchableWrapper: {
    width: '100%',
  },
  icon: {
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalContent: {
    backgroundColor: colors.iconWhite,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.quaternaryGrey,
    padding: 16,
  },
  headerButton: {
    paddingHorizontal: 8,
  },
  doneButton: {
    color: colors.primaryGreen,
    fontSize: 16,
    fontWeight: '500',
  },
  cancelButton: {
    color: colors.primaryGrey,
    fontSize: 16,
  },
  picker: {
    backgroundColor: colors.iconWhite,
  },
});

export default OperatingExpenses;
