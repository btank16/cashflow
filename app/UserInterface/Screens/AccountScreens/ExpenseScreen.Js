import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';
import ExpenseLogo from '../../../assets/icons/ExpenseLogo.jsx';
import colors from '../../Colors/colors.Js';
import PrimaryButton from '../../Components/PrimaryButton.Js';
import ExpenseItem from '../../Components/ExpenseItem.Js';
import ScreenLayoutWithFooter from '../../UtilScreens/ScreenLayoutWithFooter.Js';
import { useExpenses } from '../../Utils/DataCache.Js';
import { deleteExpense as deleteExpenseFromAPI } from '../../Utils/AmplifyDataUtils.Js';

const ExpenseScreen = () => {
  const navigation = useNavigation();
  const [filter, setFilter] = useState('All');
  const { expenses, isLoading, refreshExpenses } = useExpenses(null, true);
  const [filteredExpenses, setFilteredExpenses] = useState([]);

  const calculatorTypes = [
    'All',
    'rental',
    'flip',
    'brrrr',
    'target',
    'wholesale',
    'commercial'
  ];

  // Update filtered expenses when expenses or filter changes
  useEffect(() => {
    loadExpenses();
  }, [expenses, filter]);

  const loadExpenses = () => {
    try {
      if (filter === 'All') {
        setFilteredExpenses(expenses);
      } else {
        const filtered = expenses.filter(expense => {
          try {
            const calculators = JSON.parse(expense.applicable_calculators || '[]');
            return calculators.includes(filter.toLowerCase());
          } catch (error) {
            console.error('Error parsing applicable_calculators:', error);
            return false;
          }
        });
        setFilteredExpenses(filtered);
      }
    } catch (error) {
      console.error('Error filtering expenses:', error);
      setFilteredExpenses([]);
    }
  };

  // Refresh expenses from API when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      refreshExpenses(false);
    }, [refreshExpenses])
  );

  const handleDeleteExpense = async (id) => {
    try {
      await deleteExpenseFromAPI(id);
      // Refresh expenses after deletion
      refreshExpenses(false);
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

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity 
        onPress={() => navigation.navigate('UserScreen')}
        style={styles.backButton}
      >
        <ChevronLeftIcon size={24} color={colors.primaryBlack} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Default Operating Expenses</Text>
    </View>
  );

  const renderFooter = () => (
    <PrimaryButton
      label="+  Add Operating Expenses"
      isActive={true}
      onPress={() => navigation.navigate('FirstAddExpense')}
    />
  );

  return (
    <ScreenLayoutWithFooter
      header={renderHeader()}
      footer={renderFooter()}
      headerHeight={32}
    >
      <View style={styles.filterContainer}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {calculatorTypes.map((type) => (
            <FilterButton key={type} title={type} />
          ))}
        </ScrollView>
      </View>

      {isLoading ? (
        <View style={styles.centerContent}>
          <Text style={styles.loadingText}>Loading expenses...</Text>
        </View>
      ) : filteredExpenses.length > 0 ? (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {filteredExpenses.map((expense) => (
            <ExpenseItem
              key={expense.id}
              expense={expense}
              onDelete={handleDeleteExpense}
            />
          ))}
        </ScrollView>
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
    </ScreenLayoutWithFooter>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  backButton: {
    padding: 8,
    position: 'absolute',
    zIndex: 1,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
    color: colors.primaryBlack,
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
  loadingText: {
    fontSize: 16,
    color: colors.primaryGrey,
    textAlign: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingVertical: 12,
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
  }
});

export default ExpenseScreen;