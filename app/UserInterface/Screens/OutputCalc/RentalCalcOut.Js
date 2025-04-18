import React from 'react';
import { Platform, View, StyleSheet, SafeAreaView, StatusBar, ScrollView, Text, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import colors from '../../Colors/colors.Js';
import ResultDisplay from '../../Components/ResultDisplay.Js';
import BackButton from '../../Components/BackButton.Js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ExpensePieChart from '../../Components/ExpensePieChart.Js';
import DarkTextLogo from '../../../assets/icons/DarkTextLogo.jsx';

function RentalCalcOut(props) {
    const navigation = useNavigation();
    const route = useRoute();
    const { inputValues, ...results } = route.params;

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
            infoPress: () => handleInfoPress("Information about Monthly Cashflow")
        },
        {
            label: "Cash Down",
            value: results.cashDown,
            type: "dollar",
            textColor: colors.primaryBlack,
            infoPress: () => handleInfoPress("Information about Cash Down")
        },
        {
            label: "Cash on Cash Return",
            value: results.cashOnCash,
            type: "percentage",
            infoPress: () => handleInfoPress("Information about Cash on Cash Return")
        },
        {
            label: "Cap Rate",
            value: results.capRate,
            type: "percentage",
            infoPress: () => handleInfoPress("Information about Cap Rate")
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
            infoPress: () => handleInfoPress("Information about DSCR"),
            fullWidth: true
        },
        {
            label: "Months to Break Even",
            value: results.monthsTillEven >= 0 ? Math.round(results.monthsTillEven) : "N/A",
            type: "integer",
            additionalText: breakEvenText(results.monthsTillEven),
            textColor: colors.primaryBlack,
            infoPress: () => handleInfoPress("Information about Break Even"),
            fullWidth: true
        }
    ];

    const handleInfoPress = (infoText) => {
        console.log(infoText);
    };

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

    return (
        <SafeAreaView style={styles.masterBackground}>
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
            <ScrollView style={styles.contentContainer}>
                <View style={styles.mainResultContainer}>
                    <View style={styles.mainLabelContainer}>
                        <Text style={styles.mainLabel}>Annual Cashflow</Text>
                        <TouchableOpacity onPress={() => handleInfoPress("Information about Annual Cashflow")}>
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
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    masterBackground: {
        flex: 1,
        backgroundColor: colors.iconWhite,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    logoContainer: {
        flexDirection: 'row',
        height: 32,
        alignItems: 'center',
        backgroundColor: colors.iconWhite,
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    logoWrapper: {
        position: 'absolute',
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    contentContainer: {
        backgroundColor: colors.iconWhite,
    },
    headerTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.primaryBlack,
        position: 'absolute',
        left: 0,
        right: 0,
        textAlign: 'center',
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