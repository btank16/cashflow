import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import colors from '../../Colors/colors.Js';
import ResultDisplay from '../../Components/ResultDisplay.Js';
import BackButton from '../../Components/BackButton.Js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ExpensePieChart from '../../Components/ExpensePieChart.Js';
import DarkTextLogo from '../../../assets/icons/DarkTextLogo.jsx';
import InfoComponent from '../../Components/InfoComponent.Js';
import calculatorInfo from '../../../assets/text/info.json';
import ScreenLayout from '../../UtilScreens/ScreenLayout.Js';

function RentalCalcOut(props) {
    const navigation = useNavigation();
    const route = useRoute();
    const { inputValues, ...results } = route.params;
    const [infoModalVisible, setInfoModalVisible] = useState(false);

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
        const number = parseFloat(breakEvenValue);
        if (isNaN(number)) return '';
        
        
        if (number >= 0) {
            return `Monthly Cashflow will repay the Cash Down in ${number} months`;
        } else {
            return `This property has negative cashflow`;
        }
    };

    const resultDisplayArray = [
        {
            label: "Monthly Cashflow",
            value: results.cashflow,
            type: "dollar",
            infoTitle: calculatorInfo.calculator_output.monthly_cashflow.title,
            infoDescription: calculatorInfo.calculator_output.monthly_cashflow.description
        },
        {
            label: "Cash Down",
            value: results.cashDown,
            type: "dollar",
            textColor: colors.primaryBlack,
            infoTitle: calculatorInfo.calculator_output.cash_down.title,
            infoDescription: calculatorInfo.calculator_output.cash_down.description
        },
        {
            label: "Cash on Cash Return",
            value: results.cashOnCash,
            type: "percentage",
            infoTitle: calculatorInfo.calculator_output.cash_on_cash.title,
            infoDescription: calculatorInfo.calculator_output.cash_on_cash.description
        },
        {
            label: "Cap Rate",
            value: results.capRate,
            type: "percentage",
            infoTitle: calculatorInfo.calculator_output.cap_rate.title,
            infoDescription: calculatorInfo.calculator_output.cap_rate.description
        }
    ];

    const fullWidthDisplays = [
        {
            label: "Debt Service Coverage Ratio (DSCR)",
            value: results.DSCR === 'N/A' ? 'N/A' : results.DSCR,
            type: "float",
            additionalText: results.DSCR === 'N/A' ? 
                'Not applicable for Cash Purchases' : 
                getDSCRText(results.DSCR),
            fullWidth: true,
            infoTitle: calculatorInfo.calculator_output.dscr.title,
            infoDescription: calculatorInfo.calculator_output.dscr.description
        },
        {
            label: "Months to Break Even",
            value: results.monthsTillEven >= 0 ? Math.round(results.monthsTillEven) : "N/A",
            type: "integer",
            additionalText: breakEvenText(results.monthsTillEven),
            textColor: colors.primaryBlack,
            fullWidth: true,
            infoTitle: calculatorInfo.calculator_output.break_even.title,
            infoDescription: calculatorInfo.calculator_output.break_even.description
        }
    ];


    const expenseChartData = [
        {
            name: 'Mortgage Cost',
            value: results.mortgageCost,
            color: colors.primaryGreen,
        },
        {
            name: 'Property Taxes',
            value: results.monthlyPropTax,
            color: colors.primaryPurple,
        },
        {
            name: 'Operating Expenses',
            value: results.monthlyOpEx,
            color: colors.primaryOrange,
        },
        {
            name: 'Capital Expenditure',
            value: results.monthlyCapEx,
            color: colors.brightGreen,
        },
    ];

    const renderHeader = () => (
        <View style={styles.logoContainer}>
            <BackButton 
                inputValues={inputValues}
                destinationScreen="RentalCalcIn"
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
            <View style={styles.mainResultContainer}>
                <View style={styles.mainLabelContainer}>
                    <Text style={styles.mainLabel}>Annual Cashflow</Text>
                    <TouchableOpacity onPress={() => setInfoModalVisible(true)}>
                        <Ionicons name="information-circle-outline" size={16} color={colors.primaryGrey} />
                    </TouchableOpacity>
                </View>
                <Text style={[
                    styles.mainValue,
                    { color: results.annualCashflow >= 0 ? colors.primaryGreen : colors.quaternaryRed }
                ]}>
                    {formatDollar(results.annualCashflow)}
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
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    logoWrapper: {
        position: 'absolute',
        left: 0,
        right: 0,
        alignItems: 'center',
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
});

export default RentalCalcOut;