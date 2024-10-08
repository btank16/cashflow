import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ClockIcon } from 'react-native-heroicons/outline';
import colors from '../Colors/colors.Js';
import RentalIcon from '../../assets/icons/RentalIcon.jsx';
import FlipIcon from '../../assets/icons/FlipIcon.jsx';
import BRRRRIcon from '../../assets/icons/BRRRIcon.jsx';
import WholesaleIcon from '../../assets/icons/WholesaleIcon.jsx';
import TargetIcon from '../../assets/icons/TargetIcon.jsx';

// Add this helper function to format numbers
const formatNumber = (number) => {
  return Number(number).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

// Add this function to calculate and format the time elapsed
const getTimeElapsed = (date) => {
  const now = new Date();
  const calculationDate = new Date(date);
  const diffInHours = Math.floor((now - calculationDate) / (1000 * 60 * 60));

  if (diffInHours < 1) {
    return 'New';
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else if (diffInHours < 24 * 30) {
    const days = Math.floor(diffInHours / 24);
    return `${days}d ago`;
  } else if (diffInHours < 24 * 365) {
    const months = Math.floor(diffInHours / (24 * 30));
    return `${months}m ago`;
  } else {
    const years = Math.floor(diffInHours / (24 * 365));
    return `${years}y ago`;
  }
};

const getCalculatorDetails = (item) => {
  const inputValues = JSON.parse(item.input_values);
  const results = JSON.parse(item.results);

  switch (item.calculator_type.toLowerCase()) {
    case 'rental':
      return {
        icon: <RentalIcon width={12} height={12} fill={colors.iconWhite} />,
        details: [
          { title: 'Purchase Price', value: `$${formatNumber(inputValues.purchasePrice)}` },
          { title: 'Monthly Rent', value: `$${formatNumber(inputValues.monthRent)}` },
          { title: 'DSCR', value: `${formatNumber(results.DSCR)}` },
        ],
        name: 'Rental Property',
        primColor: colors.secondaryGreen,
        secColor: colors.primaryGreen
      };
    case 'flip':
      return {
        icon: <FlipIcon width={12} height={12} fill={colors.iconWhite} />,
        details: [
          { title: 'Purchase Price', value: `$${formatNumber(inputValues.purchasePrice)}` },
          { title: 'ARV', value: `$${formatNumber(inputValues.afterRev)}` },
          { title: 'ROI', value: `${formatNumber(results.returnPerc)}%` },
        ],
        name: 'Fix & Flip',
        primColor: colors.secondaryOrange,
        secColor: colors.primaryOrange
      };
    case 'brrr':
      return {
        icon: <BRRRRIcon width={12} height={12} fill={colors.iconWhite} />,
        details: [
          { title: 'Purchase Price', value: `$${formatNumber(inputValues.purchasePrice)}` },
          { title: 'ARV', value: `$${formatNumber(inputValues.afterRev)}` },
          { title: 'Monthly Cashflow', value: `$${formatNumber(results.BRRCashflow)}` },
        ],
        name: 'BRRRR',
        primColor: colors.secondaryBlue,
        secColor: colors.primaryBlue
      };
    case 'wholesale':
      return {
        icon: <WholesaleIcon width={12} height={12} fill={colors.iconWhite} />,
        details: [
          { title: 'Contract Price', value: `$${formatNumber(inputValues.purchasePrice)}` },
          { title: 'Min Sale Price', value: `$${formatNumber(results.sale5Perc)}` },
          { title: 'Max Sale Price', value: `$${formatNumber(results.sale15Perc)}` },
        ],
        name: 'Wholesale',
        primColor: colors.secondaryBrightGreen,
        secColor: colors.brightGreen
      };
    case 'projection':
      return {
        icon: <TargetIcon width={12} height={12} fill={colors.iconWhite} />,
        details: [
          { title: 'Cashflow Target', value: `$${formatNumber(inputValues.monthCashflow)}` },
          { title: 'Target Price', value: `$${formatNumber(results.TargetPrice)}` },
          { title: 'Break Even', value: `$${formatNumber(results.NetZeroPrice)}` },
        ],
        name: 'Price Target',
        primColor: colors.secondaryPurple,
        secColor: colors.primaryPurple
      };
    default:
      return {
        icon: null,
        details: [],
      };
  }
};

const HistoryItem = ({ item }) => {
  const { icon, details, name, primColor, secColor } = getCalculatorDetails(item);
  const timeElapsed = getTimeElapsed(item.date);

  return (
    <View style={[styles.historyItem, { backgroundColor: colors.iconWhite }]}>
      <View style={styles.mainInfo}>
        <View style={styles.detailsContainer}>
          {details.map((detail, index) => (
            <View key={index} style={styles.detailItem}>
              <Text style={styles.detailTitle}>{detail.title}</Text>
              <Text style={styles.detailValue}>{detail.value}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.bottomRow}>
        <View style={[styles.calculatorType, { backgroundColor: primColor }]}>
          <View style={[styles.iconCircle, { backgroundColor: secColor }]}>
            {icon}
          </View>
          <Text style={[styles.calculatorTypeText, { color: secColor }]}>{name}</Text>
        </View>
        <View style={[styles.calculatorType, { backgroundColor: colors.tertiaryGrey }]}>
          <View style={[styles.iconCircle, { backgroundColor: colors.secondaryGrey }]}>
            <ClockIcon color={colors.primaryGrey} size={12} />
          </View>
          <Text style={[styles.calculatorTypeText, { color: colors.primaryGrey }]}>{timeElapsed}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  historyItem: {
    backgroundColor: colors.iconWhite,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
  },
  mainInfo: {
    marginBottom: 12,
  },
  detailsContainer: {
    flexDirection: 'row',
  },
  detailItem: {
    alignItems: 'flex-start',
    width: '33%',
  },
  detailTitle: {
    fontSize: 12,
    color: colors.primaryBlack,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    color: colors.primaryBlack,
    fontWeight: 'bold',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calculatorType: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryGreen,
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 4,
    marginRight: 8,
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
  }
});

export default HistoryItem;