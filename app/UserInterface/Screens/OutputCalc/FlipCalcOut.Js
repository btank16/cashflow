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

function FlipCalcOut(props) {
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
    

    const resultDisplayArray = [
        {
            label: "ROI",
            value: results.returnPerc,
            type: "percentage",
            infoPress: () => handleInfoPress("Information about Monthly Cashflow")
        },
        {
            label: "Cash on Cash ROI",
            value: results.cashROI,
            type: "percentage",
            infoPress: () => handleInfoPress("Information about Cash Down")
        }
    ];

    const fullWidthDisplays = [
        {
            label: "Cash Down",
            value: results.cashDown,
            type: "dollar",
            textColor: colors.primaryBlack,
            additionalText: "Down Payment and Rehab Cost",
            infoPress: () => handleInfoPress("Information about DSCR"),
            fullWidth: true
        },
        {
            label: "Total Cash Costs",
            value: results.totalCashCost,
            type: "dollar",
            textColor: colors.primaryBlack,
            additionalText: "The sum of all Cash Costs, including Expenses during the Rehab Period",
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
    ];

    return (
        <SafeAreaView style={styles.masterBackground}>
            <View style={styles.logoContainer}>
                <BackButton 
                    inputValues={inputValues}
                    destinationScreen="FlipCalcIn"
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
                        <Text style={styles.mainLabel}>Net Profit</Text>
                        <TouchableOpacity onPress={() => handleInfoPress("Information about Annual Cashflow")}>
                            <Ionicons name="information-circle-outline" size={16} color={colors.primaryGrey} />
                        </TouchableOpacity>
                    </View>
                    <Text style={[
                        styles.mainValue,
                        { color: results.totalProfit >= 0 ? colors.primaryGreen : colors.quaternaryRed }
                    ]}>
                        {formatDollar(results.totalProfit)}
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

export default FlipCalcOut;