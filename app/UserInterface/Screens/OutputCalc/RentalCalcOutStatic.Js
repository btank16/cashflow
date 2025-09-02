import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';
import colors from '../../Colors/colors.Js';
import ResultDisplay from '../../Components/ResultDisplay.Js';
import BackButton from '../../Components/BackButton.Js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ExpensePieChart from '../../Components/ExpensePieChart.Js';
import DarkTextLogo from '../../../assets/icons/DarkTextLogo.jsx';
import InfoComponent from '../../Components/InfoComponent.Js';
import calculatorInfo from '../../../assets/text/info.json';
import ScreenLayout from '../../UtilScreens/ScreenLayout.Js';

function RentalCalcOutStatic() {
  const navigation = useNavigation();
  const route = useRoute();
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('average'); // 'poor', 'average', 'premium'
  
  // Extract data from route params
  const { 
    source = 'demo', 
    condition = '', 
    strategy = '',
    address = '',
    text = '',
    imageUri = '',
    unitData = null
  } = route.params || {};
  
  // Determine if we should show tabs based on condition
  const showTabs = condition.toLowerCase() === 'unsure';
  
  // Set up demo data for different sources and conditions
  const getDemoResults = () => {
    // Base data for all scenarios
    const baseData = {
      cashflow: 750,
      cashDown: 45000,
      cashOnCash: 20.0,
      capRate: 7.5,
      DSCR: 1.25,
      monthsTillEven: 60,
      annualCashflow: 9000,
      mortgageCost: 1200,
      monthlyPropTax: 350,
      monthlyOpEx: 450,
      monthlyCapEx: 150
    };
    
    // Address-specific data (slightly better numbers)
    const addressData = {
      ...baseData,
      cashflow: 850,
      cashOnCash: 22.67,
      capRate: 8.2,
      annualCashflow: 10200
    };
    
    // ResidentAI text data (slightly worse numbers)
    const residentAITextData = {
      ...baseData,
      cashflow: 650,
      cashOnCash: 17.33,
      capRate: 6.8,
      annualCashflow: 7800
    };
    
    // ResidentAI image data (average numbers)
    const residentAIImageData = {
      ...baseData,
      cashflow: 700,
      cashOnCash: 18.67,
      capRate: 7.2,
      annualCashflow: 8400
    };
    
    // Data for different quality levels when condition is "unsure"
    const poorData = {
      cashflow: 400,
      cashDown: 40000,
      cashOnCash: 12.0,
      capRate: 5.0,
      DSCR: 1.05,
      monthsTillEven: 100,
      annualCashflow: 4800,
      mortgageCost: 1100,
      monthlyPropTax: 300,
      monthlyOpEx: 600,
      monthlyCapEx: 200
    };
    
    const averageData = {
      cashflow: 750,
      cashDown: 45000,
      cashOnCash: 20.0,
      capRate: 7.5,
      DSCR: 1.25,
      monthsTillEven: 60,
      annualCashflow: 9000,
      mortgageCost: 1200,
      monthlyPropTax: 350,
      monthlyOpEx: 450,
      monthlyCapEx: 150
    };
    
    const premiumData = {
      cashflow: 1100,
      cashDown: 60000,
      cashOnCash: 22.0,
      capRate: 8.5,
      DSCR: 1.45,
      monthsTillEven: 55,
      annualCashflow: 13200,
      mortgageCost: 1500,
      monthlyPropTax: 450,
      monthlyOpEx: 350,
      monthlyCapEx: 100
    };
    
    // If condition is "unsure", return data based on active tab
    if (condition.toLowerCase() === 'unsure') {
      switch (activeTab) {
        case 'poor':
          return poorData;
        case 'premium':
          return premiumData;
        case 'average':
        default:
          return averageData;
      }
    }
    
    // Otherwise, return data based on source
    switch (source) {
      case 'address':
        return addressData;
      case 'residentAI':
        return imageUri ? residentAIImageData : residentAITextData;
      default:
        return baseData;
    }
  };
  
  // Get the appropriate demo data
  const demoResults = getDemoResults();
  
  // Generate a title based on the source and condition
  const getTitle = () => {
    if (source === 'address' && address) {
      return address.split(',')[0]; // First part of the address
    } else if (source === 'residentAI') {
      if (imageUri) {
        return 'Image Analysis';
      } else if (text) {
        return text.length > 25 ? text.substring(0, 25) + '...' : text;
      }
    }
    return 'Property Analysis';
  };

  const formatDollar = (value) => {
    const number = parseFloat(value);
    if (isNaN(number)) return '$0.00';
    
    const absNumber = Math.abs(number);
    return `${number < 0 ? '-' : ''}$${absNumber.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  const getDSCRText = (dscrValue) => {
    const number = parseFloat(dscrValue);
    if (isNaN(number)) return '';
    
    const percentDiff = ((number - 1) * 100).toFixed(0);
    const absPercent = Math.abs(percentDiff);
    
    if (number > 1) {
      return `Your property generates ${absPercent}% more income than needed to cover mortgage payments`;
    } else if (number < 1) {
      return `Your property generates ${absPercent}% less income than needed to cover mortgage payments`;
    } else {
      return 'Your property generates exactly enough income to cover mortgage payments';
    }
  };

  const breakEvenText = (breakEvenValue) => {
    if (breakEvenValue === 'N/A') {
      return 'This property has negative cashflow';
    } else if (isNaN(breakEvenValue)) {
      return '';
    } else {
      const number = parseFloat(breakEvenValue);
      return `Monthly Cashflow will repay the Cash Down in ${number} months when all units are occupied`;
    }
  };

  const resultDisplayArray = [
    {
      label: "Monthly Cashflow",
      value: demoResults.cashflow,
      type: "dollar",
      infoTitle: calculatorInfo.calculator_output.monthly_cashflow.title,
      infoDescription: calculatorInfo.calculator_output.monthly_cashflow.description
    },
    {
      label: "Cash Down",
      value: demoResults.cashDown,
      type: "dollar",
      textColor: colors.primaryBlack,
      infoTitle: calculatorInfo.calculator_output.cash_down.title,
      infoDescription: calculatorInfo.calculator_output.cash_down.description
    },
    {
      label: "Cash on Cash Return",
      value: demoResults.cashOnCash,
      type: "percentage",
      infoTitle: calculatorInfo.calculator_output.cash_on_cash.title,
      infoDescription: calculatorInfo.calculator_output.cash_on_cash.description
    },
    {
      label: "Cap Rate",
      value: demoResults.capRate,
      type: "percentage",
      infoTitle: calculatorInfo.calculator_output.cap_rate.title,
      infoDescription: calculatorInfo.calculator_output.cap_rate.description
    }
  ];

  const fullWidthDisplays = [
    {
      label: "Debt Service Coverage Ratio (DSCR)",
      value: demoResults.DSCR === 'N/A' ? 'N/A' : demoResults.DSCR,
      type: "float",
      additionalText: demoResults.DSCR === 'N/A' ? 
        'Not applicable for Cash Purchases' : 
        getDSCRText(demoResults.DSCR),
      fullWidth: true,
      infoTitle: calculatorInfo.calculator_output.dscr.title,
      infoDescription: calculatorInfo.calculator_output.dscr.description
    },
    {
      label: "Months to Break Even",
      value: demoResults.monthsTillEven,
      type: "integer",
      additionalText: breakEvenText(demoResults.monthsTillEven),
      textColor: colors.primaryBlack,
      fullWidth: true,
      infoTitle: calculatorInfo.calculator_output.break_even.title,
      infoDescription: calculatorInfo.calculator_output.break_even.description
    }
  ];

  const expenseChartData = [
    {
      name: 'Mortgage Cost',
      value: demoResults.mortgageCost,
      color: colors.primaryGreen,
    },
    {
      name: 'Property Taxes',
      value: demoResults.monthlyPropTax,
      color: colors.primaryPurple,
    },
    {
      name: 'Operating Expenses',
      value: demoResults.monthlyOpEx,
      color: colors.primaryOrange,
    },
    {
      name: 'Capital Expenditure',
      value: demoResults.monthlyCapEx,
      color: colors.brightGreen,
    },
  ];

  const renderHeader = () => (
    <View style={styles.logoContainer}>
      <BackButton 
        inputValues={{}} // No input values needed for back button
        destinationScreen="CalcHomeScreen"
      />
      <TouchableOpacity 
        style={styles.logoWrapper}
        onPress={() => navigation.navigate('CalcHomeScreen')}
      >
        <DarkTextLogo />
      </TouchableOpacity>
    </View>
  );

  return (
    <ScreenLayout
      header={renderHeader()}
      headerHeight={32}
      backgroundColor={colors.iconWhite}
      horizontalPadding={0}
    >
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>{getTitle()}</Text>
          {strategy && (
            <View style={styles.tagContainer}>
              <Text style={styles.tagText}>{strategy}</Text>
            </View>
          )}
          {condition && condition !== 'Unsure' && (
            <View style={[styles.tagContainer, styles.conditionTag]}>
              <Text style={styles.tagText}>{condition}</Text>
            </View>
          )}
        </View>
        
        {showTabs && (
          <View style={styles.tabsContainer}>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'poor' && styles.activeTab]}
              onPress={() => setActiveTab('poor')}
            >
              <Text style={[styles.tabText, activeTab === 'poor' && styles.activeTabText]}>Poor</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'average' && styles.activeTab]}
              onPress={() => setActiveTab('average')}
            >
              <Text style={[styles.tabText, activeTab === 'average' && styles.activeTabText]}>Average</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'premium' && styles.activeTab]}
              onPress={() => setActiveTab('premium')}
            >
              <Text style={[styles.tabText, activeTab === 'premium' && styles.activeTabText]}>Premium</Text>
            </TouchableOpacity>
          </View>
        )}
        
        <View style={styles.mainResultContainer}>
          <View style={styles.mainLabelContainer}>
            <Text style={styles.mainLabel}>Annual Cashflow</Text>
            <TouchableOpacity onPress={() => setInfoModalVisible(true)}>
              <Ionicons name="information-circle-outline" size={16} color={colors.primaryGrey} />
            </TouchableOpacity>
          </View>
          <Text style={[
            styles.mainValue,
            { color: demoResults.annualCashflow >= 0 ? colors.primaryGreen : colors.quaternaryRed }
          ]}>
            {formatDollar(demoResults.annualCashflow)}
          </Text>
        </View>
        
        <View style={styles.resultsGrid}>
          {resultDisplayArray.map((item, index) => (
            <ResultDisplay 
              key={index}
              {...item}
            />
          ))}
          {fullWidthDisplays.map((item, index) => (
            <ResultDisplay 
              key={`full-${index}`}
              {...item}
            />
          ))}
        </View>
        
        <ExpensePieChart
          chartData={expenseChartData}
        />
        
        {/* Display unit data if available */}
        {unitData && unitData.unit_count > 0 && (
          <View style={styles.unitDataContainer}>
            <Text style={styles.unitDataTitle}>Property Details</Text>
            <Text style={styles.unitDataSubtitle}>{unitData.unit_count} unit{unitData.unit_count > 1 ? 's' : ''}</Text>
            
            {Array.from({ length: unitData.unit_count }).map((_, index) => (
              <View key={`unit-${index}`} style={styles.unitCard}>
                <Text style={styles.unitTitle}>Unit {index + 1}</Text>
                <View style={styles.unitDetails}>
                  <Text style={styles.unitDetail}>
                    {unitData.bedrooms[index] || '?'} bed
                  </Text>
                  <Text style={styles.unitDetail}>
                    {unitData.bathrooms[index] || '?'} bath
                  </Text>
                  <Text style={styles.unitDetail}>
                    {unitData.square_feet[index] ? `${unitData.square_feet[index]} sqft` : '? sqft'}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <InfoComponent
        visible={infoModalVisible}
        onClose={() => setInfoModalVisible(false)}
        title={calculatorInfo.calculator_output.annual_cashflow.title}
        description={calculatorInfo.calculator_output.annual_cashflow.description}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    width: '100%',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
  },
  logoWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  titleContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primaryBlack,
    marginRight: 8,
  },
  tagContainer: {
    backgroundColor: colors.primaryGreen,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 4,
  },
  conditionTag: {
    backgroundColor: colors.primaryBlue,
  },
  tagText: {
    color: colors.iconWhite,
    fontSize: 12,
    fontWeight: '600',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.primaryGreen,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: colors.iconWhite,
  },
  activeTab: {
    backgroundColor: colors.primaryGreen,
  },
  tabText: {
    color: colors.primaryGreen,
    fontWeight: '600',
  },
  activeTabText: {
    color: colors.iconWhite,
  },
  mainResultContainer: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 8,
  },
  mainLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mainLabel: {
    fontSize: 16,
    color: colors.primaryGrey,
  },
  mainValue: {
    fontSize: 40,
    fontWeight: 'bold',
    color: colors.primaryBlack,
  },
  resultsGrid: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  unitDataContainer: {
    padding: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  unitDataTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primaryBlack,
    marginBottom: 4,
  },
  unitDataSubtitle: {
    fontSize: 14,
    color: colors.primaryGrey,
    marginBottom: 16,
  },
  unitCard: {
    backgroundColor: colors.darkGreenSecondary,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  unitTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.iconWhite,
    marginBottom: 8,
  },
  unitDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  unitDetail: {
    color: colors.iconWhite,
    fontSize: 14,
  },
});

export default RentalCalcOutStatic;