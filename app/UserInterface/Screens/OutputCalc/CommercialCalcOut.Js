import React, { useState } from 'react';
import { Platform, View, StyleSheet, SafeAreaView, StatusBar, ScrollView, Text, TouchableOpacity } from "react-native";
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

function CommercialCalcOut(props) {
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
            label: "Total Acquisition Costs",
            value: results.totalAcquisitionCosts,
            type: "dollar"
        },
        {
            label: "Capital Reserve",
            value: inputValues.capitalReserve,
            type: "dollar",
            textColor: colors.primaryBlack
        },
        {
            label: "Cash on Cash Return",
            value: results.cashOnCash,
            type: "percentage"
        },
        {
            label: "Cap Rate",
            value: results.capRate,
            type: "percentage"
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
            fullWidth: true
        },
        {
            label: "Months to Break Even",
            value: results.monthsTillEven >= 0 ? Math.round(results.monthsTillEven) : "N/A",
            type: "integer",
            additionalText: breakEvenText(results.monthsTillEven),
            textColor: colors.primaryBlack,
            fullWidth: true
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
        {
            name: 'Vacancy Loss',
            value: results.monthlyVacancy,
            color: colors.primaryRed,
        }
    ];

    return (
        <SafeAreaView style={styles.masterBackground}>
            <View style={styles.logoContainer}>
                <BackButton 
                    inputValues={inputValues}
                    destinationScreen="CommercialCalcIn"
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
            </ScrollView>

            <InfoComponent
                visible={infoModalVisible}
                onClose={() => setInfoModalVisible(false)}
                title="Annual Cashflow"
                description="The total amount of cash flow generated by the commercial property over a year."
            />
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

export default CommercialCalcOut;