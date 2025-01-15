import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TrashIcon, EllipsisVerticalIcon } from 'react-native-heroicons/outline';
import { Swipeable } from 'react-native-gesture-handler';
import colors from '../Colors/colors.Js';
import RentalIcon from '../../assets/icons/RentalIcon.jsx';
import FlipIcon from '../../assets/icons/FlipIcon.jsx';
import BRRRRIcon from '../../assets/icons/BRRRIcon.jsx';
import WholesaleIcon from '../../assets/icons/WholesaleIcon.jsx';
import TargetIcon from '../../assets/icons/TargetIcon.jsx';
import CommercialIcon from '../../assets/icons/CommercialIcon.jsx';

const formatNumber = (number) => {
  return Number(number).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

const calculatorConfig = {
  'rental': {
    icon: (props) => <RentalIcon {...props} fill={colors.iconWhite} />,
    name: 'Rental property',
    primColor: colors.secondaryGreen,
    secColor: colors.primaryGreen
  },
  'flip': {
    icon: (props) => <FlipIcon {...props} fill={colors.iconWhite} />,
    name: 'Fix & Flip',
    primColor: colors.secondaryOrange,
    secColor: colors.primaryOrange
  },
  'brrrr': {
    icon: (props) => <BRRRRIcon {...props} fill={colors.iconWhite} />,
    name: 'BRRRR',
    primColor: colors.secondaryBlue,
    secColor: colors.primaryBlue
  },
  'wholesale': {
    icon: (props) => <WholesaleIcon {...props} fill={colors.iconWhite} />,
    name: 'Wholesaling',
    primColor: colors.secondaryBrightGreen,
    secColor: colors.brightGreen
  },
  'target': {
    icon: (props) => <TargetIcon {...props} fill={colors.iconWhite} />,
    name: 'Price Target',
    primColor: colors.secondaryPurple,
    secColor: colors.primaryPurple
  },
  'commercial': {
    icon: (props) => <CommercialIcon {...props} color={colors.iconWhite} />,
    name: 'Commercial Multi-Family',
    primColor: colors.secondaryPink,
    secColor: colors.primaryPink
  }
};

const ExpenseItem = ({ expense, onDelete }) => {
  const swipeableRef = useRef(null);
  const { category, cost, frequency, applicable_calculators } = expense;
  const calculators = JSON.parse(applicable_calculators);

  const renderRightActions = (progress, dragX) => {
    return (
      <View style={styles.deleteButtonContainer}>
        <TouchableOpacity 
          style={styles.deleteButton} 
          onPress={() => onDelete(expense.id)}
        >
          <TrashIcon color={colors.quaternaryRed} size={24} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Swipeable 
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      rightThreshold={40}
    >
      <View style={styles.expenseItem}>
        <View style={styles.header}>
          <View style={styles.categoryContainer}>
            <Text style={styles.category} numberOfLines={2}>
              {category} <Text style={styles.frequency}>({frequency})</Text>
            </Text>
          </View>
          <TouchableOpacity 
            onPress={() => swipeableRef.current?.openRight()}
            style={styles.menuButton}
          >
            <EllipsisVerticalIcon size={20} color={colors.primaryBlack} />
          </TouchableOpacity>
        </View>
        <Text style={styles.cost}>${formatNumber(cost)}</Text>
        
        <View style={styles.calculatorsRow}>
          {calculators.map((calc, index) => {
            const config = calculatorConfig[calc];
            if (!config) return null;
            
            return (
              <View 
                key={index} 
                style={[styles.calculatorType, { backgroundColor: config.primColor }]}
              >
                <View style={[styles.iconCircle, { backgroundColor: config.secColor }]}>
                  {config.icon({ width: 12, height: 12 })}
                </View>
                <Text style={[styles.calculatorTypeText, { color: config.secColor }]}>
                  {config.name}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  expenseItem: {
    backgroundColor: colors.tertiaryGrey,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.quaternaryGrey,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuButton: {
    padding: 4,
  },
  categoryContainer: {
    flex: 1,
    paddingRight: 8,
  },
  category: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.primaryBlack,
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  frequency: {
    fontWeight: '400',
    color: colors.primaryGrey,
  },
  cost: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.primaryBlack,
    marginBottom: 12,
  },
  calculatorsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  calculatorType: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  iconCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calculatorTypeText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
    marginRight: 8,
  },
  deleteButtonContainer: {
    width: 80,
    marginLeft: 8,
    marginBottom: 8,
    justifyContent: 'center',
  },
  deleteButton: {
    backgroundColor: colors.secondaryRed,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.tertiaryRed,
  },
});

export default ExpenseItem;
