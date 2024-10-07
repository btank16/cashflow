import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ClockIcon } from 'react-native-heroicons/outline';
import colors from '../Colors/colors.Js';
import RentalIcon from '../../assets/icons/RentalIcon.jsx';
import FlipIcon from '../../assets/icons/FlipIcon.jsx';
import BRRRRIcon from '../../assets/icons/BRRRIcon.jsx';
import WholesaleIcon from '../../assets/icons/WholesaleIcon.jsx';
import TargetIcon from '../../assets/icons/TargetIcon.jsx';

const getCalculatorDetails = (item) => {
  const inputValues = JSON.parse(item.input_values);
  const results = JSON.parse(item.results);

  switch (item.calculator_type.toLowerCase()) {
    case 'rental':
      return {
        icon: <RentalIcon width={20} height={20} fill={colors.primaryGreen} />,
        details: [
          { title: 'Purchase Price', value: `$${inputValues.purchasePrice}` },
          { title: 'Monthly Rent', value: `$${inputValues.monthRent}` },
          { title: 'DSCR', value: `${results.DSCR}%` },
        ],
      };
    case 'flip':
      return {
        icon: <FlipIcon width={20} height={20} fill={colors.primaryOrange} />,
        details: [
          { title: 'Purchase Price', value: `$${inputValues.purchasePrice}` },
          { title: 'ARV', value: `$${inputValues.afterRev}` },
          { title: 'ROI', value: `$${results.returnPerc}` },
        ],
      };
    case 'brrr':
      return {
        icon: <BRRRRIcon width={20} height={20} fill={colors.primaryBlue} />,
        details: [
          { title: 'Purchase Price', value: `$${inputValues.purchasePrice}` },
          { title: 'ARV', value: `$${inputValues.afterRev}` },
          { title: 'Monthly Cashflow', value: `$${results.BRRCashflow}` },
        ],
      };
    case 'wholesale':
      return {
        icon: <WholesaleIcon width={20} height={20} fill={colors.brightGreen} />,
        details: [
          { title: 'Contract Price', value: `$${inputValues.purchasePrice}` },
          { title: 'Min Sale Price', value: `$${results.sale5Perc}` },
          { title: 'Max Sale Price', value: `$${results.sale15Perc}` },
        ],
      };
    case 'projection':
      return {
        icon: <TargetIcon width={20} height={20} fill={colors.primaryPurple} />,
        details: [
          { title: 'Cashflow Target', value: `$${inputValues.monthCashflow}` },
          { title: 'Target Price', value: `$${results.TargetPrice}` },
          { title: 'Break Even', value: `$${results.NetZeroPrice}` },
        ],
      };
    default:
      return {
        icon: null,
        details: [],
      };
  }
};

const HistoryItem = ({ item }) => {
  const { icon, details } = getCalculatorDetails(item);

  return (
    <View style={styles.historyItem}>
      <View style={styles.mainInfo}>
        <View style={styles.detailsContainer}>
          {details.map((detail, index) => (
            <View key={index} style={styles.detailItem}>
              <Text style={styles.detailTitle}>{detail.title}</Text>
              <Text style={styles.detailValue}>{detail.value}</Text>
              <Text style={styles.detailValue}>{detail.value}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.bottomRow}>
        <View style={styles.calculatorType}>
          {icon}
          <Text style={styles.calculatorTypeText}>{item.calculator_type}</Text>
        </View>
        <View style={styles.timeAgo}>
          <ClockIcon color={colors.mainShade} size={16} />
          <Text style={styles.timeAgoText}>{new Date(item.date).toLocaleString()}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  historyItem: {
    backgroundColor: colors.darkGreenSecondary,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  mainInfo: {
    marginBottom: 8,
  },
  purchasePrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.iconWhite,
    marginBottom: 4,
  },
  secondaryInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondaryText: {
    fontSize: 14,
    color: colors.mainShade,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calculatorType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calculatorTypeText: {
    fontSize: 14,
    color: colors.iconWhite,
    marginLeft: 4,
  },
  timeAgo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeAgoText: {
    fontSize: 12,
    color: colors.mainShade,
    marginLeft: 4,
  },
  detailsContainer: {
    marginTop: 8,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  detailTitle: {
    fontSize: 14,
    color: colors.mainShade,
  },
  detailValue: {
    fontSize: 14,
    color: colors.iconWhite,
    fontWeight: 'bold',
  },
});

export default HistoryItem;