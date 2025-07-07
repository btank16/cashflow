import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, TextInput, Keyboard, Modal, Alert } from 'react-native';
import { PlusIcon, TrashIcon, ChevronDownIcon } from 'react-native-heroicons/outline';
import { useNavigation } from '@react-navigation/native';
import colors from '../Colors/colors.Js';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import InfoComponent from './InfoComponent.Js';

const frequencies = [
  { label: 'Monthly', value: 'Monthly' },
  { label: 'Annually', value: 'Annually' },
  { label: 'Non-recurring', value: 'Non-recurring' },
];

const TutorialOperatingExpense = ({ 
  calculatorType, 
  onActiveChange, 
  onExpensesChange,
  initialExpenses = [],
  sectionTitle = "Operating Expenses",
  infoTitle,
  infoDescription
}) => {
  const navigation = useNavigation();
  const [isActive, setIsActive] = useState(true);
  const [activeExpenses, setActiveExpenses] = useState([{ 
    category: '', 
    frequency: 'Monthly', 
    cost: '',
    showFrequency: false 
  }]);
  const [focusedInputs, setFocusedInputs] = useState({});
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [activePickerIndex, setActivePickerIndex] = useState(null);
  const [tempFrequency, setTempFrequency] = useState('');
  const [infoModalVisible, setInfoModalVisible] = useState(false);

  useEffect(() => {
    if (initialExpenses && initialExpenses.length > 0) {
      const areExpensesDifferent = JSON.stringify(initialExpenses) !== JSON.stringify(activeExpenses);
      if (areExpensesDifferent) {
        setActiveExpenses(initialExpenses.map(expense => ({
          ...expense,
          showFrequency: false
        })));
      }
    }
  }, [initialExpenses]);

  useEffect(() => {
    // Pass active expenses to parent component
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

  const updateActiveExpense = (index, field, value) => {
    const updated = activeExpenses.map((expense, i) => 
      i === index ? { ...expense, [field]: value } : expense
    );
    setActiveExpenses(updated);
  };

  const deleteExpense = (indexToDelete) => {
    // Remove from active expenses
    setActiveExpenses(activeExpenses.filter((_, index) => index !== indexToDelete));
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

  const showSignupAlert = () => {
    Alert.alert(
      'Create an Account',
      'Create an account to use these features',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Sign Up',
          onPress: () => navigation.navigate('SignUpFirst')
        }
      ],
      { cancelable: true }
    );
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
          
          <View style={styles.divider} />
          
          <View style={styles.savedExpensesSection}>
            <Text style={styles.sectionTitle}>Saved Expenses</Text>
            <View style={styles.emptySavedState}>
              <Text style={styles.emptySavedStateText}>
                <Text 
                  style={styles.createAccountText}
                  onPress={showSignupAlert}
                >
                  Create an Account
                </Text>
                <Text> to Save Your Expenses</Text>
              </Text>
            </View>
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
    marginRight: 12,
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
  savedExpensesSection: {
    width: '100%',
  },
  emptySavedState: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  emptySavedStateText: {
    textAlign: 'center',
    color: colors.primaryGrey,
    fontStyle: 'italic',
  },
  createAccountText: {
    color: colors.primaryGreen,
    fontStyle: 'italic',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default TutorialOperatingExpense; 