import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Keyboard,
  SafeAreaView,
  ScrollView,
  Platform,
  StatusBar,
  Modal
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';
import ExpenseLogo from '../../../assets/icons/ExpenseLogo.jsx';
import colors from '../../Colors/colors.Js';
import CalcButton from '../../Components/CalcButton.Js';
import NumericInput from '../../Components/NumericInputBox.Js';
import ExpenseItem from '../../Components/ExpenseItem.Js';
import { useDatabase } from '../../../../database/cashflowDatabase.Js';

const ExpenseScreen = () => {
  const navigation = useNavigation();
  const bottomSheetRef = useRef(null);
  const [isCategoryFocused, setIsCategoryFocused] = useState(false);
  const [isCostFocused, setIsCostFocused] = useState(false);
  const [category, setCategory] = useState('');
  const [cost, setCost] = useState('');
  const [frequency, setFrequency] = useState('Monthly');
  const [showFrequencyOptions, setShowFrequencyOptions] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [filter, setFilter] = useState('All');
  const db = useDatabase();

  const calculatorTypes = [
    'All',
    'rental',
    'flip',
    'brrrr',
    'target',
    'wholesale',
    'commercial'
  ];

  const snapPoints = useMemo(() => ['90%'], []);

  const formatNumber = (value) => {
    if (!value) return '';
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const unformatNumber = (value) => {
    return value.replace(/,/g, '');
  };

  const AddExpenseModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={() => setIsModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setIsModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>

          <Text style={styles.modalTitle}>Add your{'\n'}operating expenses</Text>

          <View style={styles.inputSection}>
            <View style={styles.categoryInput}>
              <Text style={styles.inputLabel}>Expense category</Text>
              <TouchableOpacity style={styles.selectButton}>
                <Text style={styles.selectButtonText}>Select category</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.frequencyAndCost}>
              <View style={styles.frequencyInput}>
                <Text style={styles.inputLabel}>Frequency</Text>
                <TouchableOpacity style={styles.selectButton}>
                  <Text style={styles.selectButtonText}>Monthly</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.costInput}>
                <NumericInput
                  label="Cost"
                  value={expenseAmount}
                  onChangeText={setExpenseAmount}
                  placeholder="0"
                  type="$"
                  isRequired={true}
                />
              </View>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.nextButton}
            onPress={() => {
              // Handle saving the expense
              setIsModalVisible(false);
            }}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  useFocusEffect(
    useCallback(() => {
      loadExpenses();
    }, [filter])
  );

  const loadExpenses = async () => {
    try {
      const savedExpenses = await db.getSavedExpenses();
      if (filter === 'All') {
        setExpenses(savedExpenses);
      } else {
        const filteredExpenses = savedExpenses.filter(expense => {
          const calculators = JSON.parse(expense.applicable_calculators);
          return calculators.includes(filter.toLowerCase());
        });
        setExpenses(filteredExpenses);
      }
    } catch (error) {
      console.error('Error loading expenses:', error);
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      await db.deleteExpense(id);
      loadExpenses();
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const FilterButton = ({ title }) => (
    <TouchableOpacity
      style={[styles.filterButton, filter === title && styles.activeFilterButton]}
      onPress={() => setFilter(title)}
    >
      <Text style={[styles.filterButtonText, filter === title && styles.activeFilterButtonText]}>
        {title === 'All' ? 'All' : 
         title === 'rental' ? 'Rental' :
         title === 'flip' ? 'Fix & Flip' :
         title === 'brrrr' ? 'BRRRR' :
         title === 'target' ? 'Price Target' :
         title === 'wholesale' ? 'Wholesale' :
         title === 'commercial' ? 'Commercial' : title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.masterBackground}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.navigate('UserScreen')}
          style={styles.backButton}
        >
          <ChevronLeftIcon size={24} color={colors.primaryBlack} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Default operating expenses</Text>
      </View>

      <View style={styles.filterContainer}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {calculatorTypes.map((type) => (
            <FilterButton key={type} title={type} />
          ))}
        </ScrollView>
      </View>

      <ScrollView 
        style={styles.contentContainer}
        contentContainerStyle={styles.scrollContent}
      >
        {expenses.length > 0 ? (
          expenses.map((expense) => (
            <ExpenseItem
              key={expense.id}
              expense={expense}
              onDelete={handleDeleteExpense}
            />
          ))
        ) : (
          <View style={styles.centerContent}>
            <View style={styles.logoWrapper}>
              <ExpenseLogo />
            </View>
            <Text style={styles.title}>
              You don't have any{'\n'}Operating Expenses
            </Text>
            <Text style={styles.description}>
              Add expenses that you regularly use for each calculator. This may include property insurance, maintenance, utilities, management fees, etc.
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.menuContainer}>
        <CalcButton
          title="+  Add Operating Expenses"
          onPress={() => navigation.navigate('FirstAddExpense')}
        />
      </View>

      <AddExpenseModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  masterBackground: {
    flex: 1,
    backgroundColor: colors.iconWhite,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 32,
    paddingHorizontal: 16,
    position: 'relative',
  },
  backButton: {
    padding: 8,
    position: 'absolute',
    left: 8,
    zIndex: 1,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
    color: colors.primaryBlack,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollContent: {
    flexGrow: 1,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  logoWrapper: {
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.primaryBlack,
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: colors.primaryGrey,
    textAlign: 'center',
    lineHeight: 24,
  },
  menuContainer: {
    height: 56,
    backgroundColor: colors.iconWhite,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sheetContainer: {
    flex: 1,
    padding: 20,
  },
  closeButton: {
    alignSelf: 'flex-start',
    padding: 10,
  },
  closeButtonText: {
    fontSize: 24,
    color: colors.primaryBlack,
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  sheetTitle: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 30,
    color: colors.primaryBlack,
  },
  inputsContainer: {
    gap: 20,
  },
  inputWrapper: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primaryGrey,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    backgroundColor: colors.tertiaryGrey,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.quaternaryGrey,
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
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  flex1: {
    flex: 1,
  },
  frequencySelector: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: colors.tertiaryGrey,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.quaternaryGrey,
  },
  frequencyText: {
    fontSize: 16,
    color: colors.primaryBlack,
  },
  currencyContainer: {
    backgroundColor: colors.secondaryGrey,
    height: '85%',
    justifyContent: 'center',
    paddingHorizontal: 8,
    marginRight: 4,
    borderRadius: 10,
  },
  currencyText: {
    fontSize: 16,
    color: colors.fifthGrey,
  },
  nextButton: {
    backgroundColor: colors.primaryGreen,
    height: 56,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
  },
  nextButtonText: {
    color: colors.iconWhite,
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.iconWhite,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: '90%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 20,
  },
  inputSection: {
    marginTop: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primaryGrey,
    marginBottom: 8,
  },
  selectButton: {
    height: 50,
    backgroundColor: colors.tertiaryGrey,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.quaternaryGrey,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  selectButtonText: {
    color: colors.primaryBlack,
    fontSize: 16,
  },
  frequencyAndCost: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 16,
  },
  frequencyInput: {
    flex: 1,
  },
  costInput: {
    flex: 1,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.iconWhite,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: colors.tertiaryGrey,
    borderWidth: 1,
    borderColor: colors.quaternaryGrey,
    marginRight: 4,
  },
  activeFilterButton: {
    backgroundColor: colors.primaryGreen,
    borderColor: colors.primaryGreen,
  },
  filterButtonText: {
    color: colors.primaryBlack,
    fontSize: 14,
  },
  activeFilterButtonText: {
    color: colors.iconWhite,
    fontWeight: 'bold',
  },
});

export default ExpenseScreen;