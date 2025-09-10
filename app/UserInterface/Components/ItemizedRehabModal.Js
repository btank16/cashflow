import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  TextInput, 
  Modal,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { PlusIcon, TrashIcon } from 'react-native-heroicons/outline';
import colors from '../Colors/colors.Js';

const ItemizedRehabModal = ({ 
  visible, 
  onClose, 
  onSave,
  initialExpenses = []
}) => {
  const [expenses, setExpenses] = useState([{ category: '', cost: '' }]);
  const [focusedInputs, setFocusedInputs] = useState({});

  useEffect(() => {
    if (initialExpenses && initialExpenses.length > 0) {
      setExpenses(initialExpenses);
    } else {
      setExpenses([{ category: '', cost: '' }]);
    }
  }, [initialExpenses, visible]);

  const addNewExpense = () => {
    setExpenses([...expenses, { category: '', cost: '' }]);
  };

  const updateExpense = (index, field, value) => {
    const updated = expenses.map((expense, i) => 
      i === index ? { ...expense, [field]: value } : expense
    );
    setExpenses(updated);
  };

  const deleteExpense = (indexToDelete) => {
    if (expenses.length > 1) {
      setExpenses(expenses.filter((_, index) => index !== indexToDelete));
    }
  };

  const handleSave = () => {
    const validExpenses = expenses.filter(exp => exp.category && exp.cost);
    onSave(validExpenses);
    onClose();
  };

  const calculateTotal = () => {
    return expenses.reduce((total, expense) => {
      const cost = parseFloat(expense.cost) || 0;
      return total + cost;
    }, 0).toFixed(2);
  };

  const renderExpenseInput = (expense, index) => (
    <React.Fragment key={index}>
      <View style={styles.expenseRow}>
        <View style={styles.categoryContainer}>
          <Text style={styles.inputLabel}>Category</Text>
          <View style={[
            styles.textInputContainer,
            focusedInputs[`category-${index}`] && styles.inputFocused
          ]}>
            <TextInput
              style={styles.input}
              placeholder="ex. Flooring"
              value={expense.category}
              onChangeText={(value) => updateExpense(index, 'category', value)}
              onFocus={() => setFocusedInputs(prev => ({ ...prev, [`category-${index}`]: true }))}
              onBlur={() => setFocusedInputs(prev => ({ ...prev, [`category-${index}`]: false }))}
              placeholderTextColor={colors.sixthGrey}
            />
          </View>
        </View>
        
        <View style={styles.costContainer}>
          <Text style={styles.inputLabel}>Cost</Text>
          <View style={[
            styles.textInputContainer,
            focusedInputs[`cost-${index}`] && styles.inputFocused
          ]}>
            <TextInput
              style={styles.costInput}
              placeholder="ex. 5000"
              value={expense.cost}
              onChangeText={(value) => updateExpense(index, 'cost', value)}
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

        {expenses.length > 1 && (
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => deleteExpense(index)}
          >
            <TrashIcon size={20} color={colors.quaternaryRed} />
          </TouchableOpacity>
        )}
      </View>
      
      {index < expenses.length - 1 && (
        <View style={styles.expenseDivider} />
      )}
    </React.Fragment>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Itemized Rehab Costs</Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.contentWrapper}
        >
          <ScrollView 
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.content}>
              {expenses.map((expense, index) => renderExpenseInput(expense, index))}
              
              <TouchableOpacity 
                style={styles.addButton}
                onPress={addNewExpense}
              >
                <PlusIcon size={20} color={colors.primaryGreen} />
                <Text style={styles.addButtonText}>Add New Item</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        <View style={styles.footer}>
          <Text style={styles.totalLabel}>Total Rehab Cost:</Text>
          <Text style={styles.totalAmount}>${calculateTotal()}</Text>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: colors.iconWhite,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.quaternaryGrey,
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    color: colors.primaryGrey,
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primaryBlack,
  },
  saveButton: {
    padding: 8,
  },
  saveButtonText: {
    color: colors.primaryGreen,
    fontSize: 16,
    fontWeight: '500',
  },
  contentWrapper: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  content: {
    backgroundColor: colors.tertiaryGrey,
    margin: 16,
    padding: 16,
    borderRadius: 8,
  },
  expenseRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  categoryContainer: {
    flex: 1.5,
  },
  costContainer: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primaryGrey,
    marginBottom: 8,
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
  costInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.primaryBlack,
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
  deleteButton: {
    marginBottom: 15,
  },
  expenseDivider: {
    height: 1,
    backgroundColor: colors.quaternaryGrey,
    marginVertical: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    marginTop: 8,
  },
  addButtonText: {
    color: colors.primaryGreen,
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors.quaternaryGrey,
    backgroundColor: colors.iconWhite,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.primaryBlack,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.primaryBlack,
  },
});

export default ItemizedRehabModal;