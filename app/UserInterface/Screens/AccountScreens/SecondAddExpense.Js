import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView,
  Platform,
  StatusBar,
  ScrollView
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { XMarkIcon, CheckIcon } from 'react-native-heroicons/outline';
import ExpenseLogo from '../../../assets/icons/ExpenseLogo.jsx';
import RentalIcon from '../../../assets/icons/RentalIcon.jsx';
import FlipIcon from '../../../assets/icons/FlipIcon.jsx';
import BRRRRIcon from '../../../assets/icons/BRRRIcon.jsx';
import WholesaleIcon from '../../../assets/icons/WholesaleIcon.jsx';
import TargetIcon from '../../../assets/icons/TargetIcon.jsx';
import CommercialIcon from '../../../assets/icons/CommercialIcon.jsx';
import colors from '../../Colors/colors.Js';
import { useDatabase } from '../../../../database/cashflowDatabase.Js';

const calculatorData = [
  {
    id: 'rental',
    name: 'Rental property calculator',
    Icon: RentalIcon,
    color: colors.primaryGreen,
    type: 'rental'
  },
  {
    id: 'flip',
    name: 'Fix & Flip Calculator',
    Icon: FlipIcon,
    color: colors.primaryOrange,
    type: 'flip'
  },
  {
    id: 'brrrr',
    name: 'BRRRR Calculator',
    Icon: BRRRRIcon,
    color: colors.primaryBlue,
    type: 'brrrr'
  },
  {
    id: 'target',
    name: 'Price Target Calculator',
    Icon: TargetIcon,
    color: colors.primaryPurple,
    type: 'target'
  },
  {
    id: 'wholesale',
    name: 'Wholesaling calculator',
    Icon: WholesaleIcon,
    color: colors.brightGreen,
    type: 'wholesale'
  },
  {
    id: 'commercial',
    name: 'Commercial Multi-Family',
    Icon: CommercialIcon,
    color: colors.primaryPink,
    type: 'commercial'
  },
];

const SecondAddExpense = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { category, frequency, cost } = route.params;
  const [activeCalculators, setActiveCalculators] = useState([]);
  const db = useDatabase();

  const toTitleCase = (str) => {
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  useEffect(() => {
    const loadExistingExpense = async () => {
      try {
        const formattedCategory = toTitleCase(category);
        const { calculators } = await db.checkExistingExpense(
          formattedCategory,
          cost,
          frequency
        );
        setActiveCalculators(calculators);
      } catch (error) {
        console.error('Error loading existing expense:', error);
        setActiveCalculators([]);
      }
    };

    loadExistingExpense();
  }, [category, frequency, cost]);

  const toggleCalculator = (calculatorType) => {
    setActiveCalculators(prev => {
      if (prev.includes(calculatorType)) {
        return prev.filter(type => type !== calculatorType);
      } else {
        return [...prev, calculatorType];
      }
    });
  };

  const handleAddExpense = async () => {
    try {
      const formattedCategory = toTitleCase(category);
      await db.saveExpense(
        formattedCategory,
        cost,
        frequency,
        activeCalculators
      );
      navigation.navigate('ExpenseScreen');
    } catch (error) {
      console.error('Error saving expense:', error);
    }
  };

  const CalculatorBox = ({ name, Icon, color, type, isActive }) => (
    <TouchableOpacity
      style={[
        styles.calculatorBox,
        isActive ? styles.activeBox : styles.inactiveBox,
      ]}
      onPress={() => toggleCalculator(type)}
    >
      <View style={styles.calculatorContent}>
        <View style={[styles.iconContainer, { backgroundColor: color }]}>
          {Icon && (
            Icon === CommercialIcon ? 
              <Icon width={24} height={24} color={colors.iconWhite} /> :
              <Icon width={24} height={24} fill={colors.iconWhite} />
          )}
        </View>
        <Text style={styles.calculatorName}>{name}</Text>
      </View>
      <View style={[
        styles.checkbox,
        isActive ? styles.activeCheckbox : styles.inactiveCheckbox
      ]}>
        {isActive && <CheckIcon size={16} color={colors.iconWhite} />}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity 
        style={styles.closeButton}
        onPress={() => navigation.navigate('ExpenseScreen')}
      >
        <XMarkIcon size={24} color={colors.primaryBlack} />
      </TouchableOpacity>

      <ScrollView style={styles.content}>
        <ExpenseLogo style={styles.logo} />
        <Text style={styles.title}>
          Where would you like to{'\n'}add the operating{'\n'}expenses?
        </Text>

        <View style={styles.calculatorList}>
          {calculatorData.map((calc) => (
            <CalculatorBox
              key={calc.id}
              {...calc}
              isActive={activeCalculators.includes(calc.type)}
            />
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity 
        style={styles.addButton}
        onPress={handleAddExpense}
      >
        <Text style={styles.addButtonText}>Add operating expense</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.iconWhite,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  closeButton: {
    padding: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  logo: {
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 32,
    color: colors.primaryBlack,
  },
  calculatorList: {
    gap: 12,
  },
  calculatorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
  },
  activeBox: {
    backgroundColor: colors.tertiaryGrey,
    borderColor: colors.secondaryGrey,
  },
  inactiveBox: {
    backgroundColor: colors.iconWhite,
    borderColor: colors.secondaryGrey,
  },
  calculatorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calculatorName: {
    fontSize: 16,
    color: colors.primaryBlack,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
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
  addButton: {
    height: 56,
    backgroundColor: colors.primaryGreen,
    borderRadius: 10,
    marginHorizontal: 16,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: colors.iconWhite,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SecondAddExpense;
