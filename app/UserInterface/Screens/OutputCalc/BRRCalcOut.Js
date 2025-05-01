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


function BRRCalcOut(props) {
    const navigation = useNavigation();
    const route = useRoute();
    const { inputValues, ...results } = route.params;
    const [infoModalVisible, setInfoModalVisible] = useState(false);
    const [showRefinanced, setShowRefinanced] = useState(false);

    const formatDollar = (value) => {
        const number = parseFloat(value);
        if (isNaN(number)) return '$0.00';
        
        const absNumber = Math.abs(number);
        return `${number < 0 ? '-' : ''}$${absNumber.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}`;
    };

      const resultDisplayArray = [
        {
            label: "Monthly Cashflow (post-refinance)",
            value: results.BRRCashflow,
            type: "dollar",
            infoTitle: calculatorInfo.calculator_output.monthly_cashflow_refi.title,
            infoDescription: calculatorInfo.calculator_output.monthly_cashflow_refi.description
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
            value: results.CashOnCash,
            type: "percentage",
            infoTitle: calculatorInfo.calculator_output.cash_on_cash.title,
            infoDescription: calculatorInfo.calculator_output.cash_on_cash.description
        },
        {
            label: "Return on Equity (ROE)",
            value: results.EquityReturnPerc,
            type: "percentage",
            infoTitle: calculatorInfo.calculator_output.equity_roi.title,
            infoDescription: calculatorInfo.calculator_output.equity_roi.description
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

    const BRRexpenseChartData = [
        {
            name: 'Mortgage Cost',
            value: results.BRRMortgageCost,
            color: colors.primaryGreen,
        },
        {
            name: 'Property Taxes',
            value: results.BRRPropTax,
            color: colors.primaryPurple,
        },
        {
            name: 'Operating Expenses',
            value: results.monthlyOpEx,
            color: colors.primaryOrange,
        },
        {
            name: 'Capital Expenditure',
            value: results.BRRCapEx,
            color: colors.brightGreen,
        },
    ];

    const fullWidthDisplays = [
        {
            label: "Maximum Equity Usage",
            value: results.MaxEquity,
            type: "dollar",
            additionalText: "Assumes an 80% Loan-to-Value refinance",
            fullWidth: true,
            infoTitle: calculatorInfo.calculator_output.equity_usage.title,
            infoDescription: calculatorInfo.calculator_output.equity_usage.description
        },
    ];

    const renderHeader = () => (
        <View style={styles.logoContainer}>
            <BackButton 
                inputValues={inputValues}
                destinationScreen="BRRCalcIn"
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
                    <Text style={styles.mainLabel}>Annual Cashflow (post-refinance)</Text>
                    <TouchableOpacity onPress={() => setInfoModalVisible(true)}>
                        <Ionicons name="information-circle-outline" size={16} color={colors.primaryGrey} />
                    </TouchableOpacity>
                </View>
                <Text style={[
                    styles.mainValue,
                    { color: Number(results.BRRAnnualCashflow) >= 0 ? colors.primaryGreen : colors.quaternaryRed }
                ]}>
                    {formatDollar(results.BRRAnnualCashflow)}
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
            <View style={styles.toggleContainer}>
                <TouchableOpacity 
                    style={[
                        styles.toggleButton, 
                        !showRefinanced && styles.toggleButtonActive
                    ]}
                    onPress={() => setShowRefinanced(false)}
                >
                    <Text style={[
                        styles.toggleText,
                        !showRefinanced && styles.toggleTextActive
                    ]}>Initial Monthly Costs</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[
                        styles.toggleButton, 
                        showRefinanced && styles.toggleButtonActive
                    ]}
                    onPress={() => setShowRefinanced(true)}
                >
                    <Text style={[
                        styles.toggleText,
                        showRefinanced && styles.toggleTextActive
                    ]}>Post-Refinance Monthly Costs</Text>
                </TouchableOpacity>
            </View>
            <ExpensePieChart
                chartData={showRefinanced ? BRRexpenseChartData : expenseChartData}
                chartTitle={showRefinanced ? 
                    "Total Monthly Expenses\n(Post-Refinance)" : 
                    "Total Monthly Expenses\n(Initial)"
                }
            />

            <InfoComponent
                visible={infoModalVisible}
                onClose={() => setInfoModalVisible(false)}
                title={calculatorInfo.calculator_output.annual_cashflow_refi.title}
                description={calculatorInfo.calculator_output.annual_cashflow_refi.description}
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
    toggleContainer: {
        flexDirection: 'row',
        marginHorizontal: 16,
        borderRadius: 12,
        backgroundColor: colors.secondaryGrey,
        padding: 4,
        borderWidth: 1,
        borderColor: colors.tertiaryGrey,
    },
    toggleButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    toggleButtonActive: {
        backgroundColor: colors.primaryGreen,
    },
    toggleText: {
        fontSize: 14,
        color: colors.primaryBlack,
        textAlign: 'center',
    },
    toggleTextActive: {
        color: colors.iconWhite,
        fontWeight: '500',
    },
});

export default BRRCalcOut;