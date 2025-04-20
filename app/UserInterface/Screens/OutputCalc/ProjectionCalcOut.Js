import React, { useState } from 'react';
import { Platform, View, StyleSheet, SafeAreaView, StatusBar, ScrollView, Text, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';
import colors from '../../Colors/colors.Js';
import ResultDisplay from '../../Components/ResultDisplay.Js';
import DoubleResultDisplay from '../../Components/DoubleResultDisplay.Js';
import BackButton from '../../Components/BackButton.Js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PriceBar from '../../Components/PriceBar.Js';
import DarkTextLogo from '../../../assets/icons/DarkTextLogo';
import ExpensePieChart from '../../Components/ExpensePieChart.Js';
import InfoComponent from '../../Components/InfoComponent.Js';
import calculatorInfo from '../../../assets/text/info.json';

const getListingPriceColor = (purchasePrice, targetPrice, netZeroPrice) => {
    if (purchasePrice < targetPrice) return colors.tertiaryOrange;
    if (purchasePrice <= netZeroPrice) return colors.primaryGreen;
    return colors.quaternaryRed;
};

const getListingPriceText = (purchasePrice, targetPrice, netZeroPrice) => {
    if (purchasePrice < targetPrice) {
        return "Property is either undervalued or other factors (ex. Property Distress) drive the Listing Price down";
    }
    if (purchasePrice <= netZeroPrice) {
        return "Purchase at the Listing Price will Break Even or have Positive Cashflow";
    }
    return "Purchase at the Listing Price will have Negative Cashflow";
};

function ProjectionCalcOut(props) {
    const navigation = useNavigation();
    const route = useRoute();
    const { inputValues, ...results } = route.params;
    const [showTargetPrice, setShowTargetPrice] = useState(true);
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

    const doubleResultDisplays = [
        {
            topLabel: "Target Price",
            topValue: formatDollar(results.TargetPrice),
            bottomLabel: "Cash Down",
            bottomValue: formatDollar(results.targetPriceCash),
            topInfoTitle: calculatorInfo.calculator_output.target_price.title,
            topInfoDescription: calculatorInfo.calculator_output.target_price.description,
            bottomInfoTitle: calculatorInfo.calculator_output.cash_down.title,
            bottomInfoDescription: calculatorInfo.calculator_output.cash_down.description
        },
        {
            topLabel: "Break Even Price",
            topValue: formatDollar(results.NetZeroPrice),
            bottomLabel: "Cash Down",
            bottomValue: formatDollar(results.netZeroCash),
            topInfoTitle: calculatorInfo.calculator_output.breakeven_price.title,
            topInfoDescription: calculatorInfo.calculator_output.breakeven_price.description,
            bottomInfoTitle: calculatorInfo.calculator_output.cash_down.title,
            bottomInfoDescription: calculatorInfo.calculator_output.cash_down.description
        }
    ];

    const targetExpenseChartData = [
        {
            name: 'Mortgage Cost',
            value: results.MaxCashflowMortgage,
            color: colors.primaryGreen,
        },
        {
            name: 'Property Taxes',
            value: results.targetTax,
            color: colors.primaryPurple,
        },
        {
            name: 'Operating Expenses',
            value: results.totalMonthlyExpenses,
            color: colors.primaryOrange,
        },
        {
            name: 'Capital Expenditure',
            value: results.monthlyCapEx,
            color: colors.brightGreen,
        },
    ];

    const breakEvenExpenseChartData = [
        {
            name: 'Mortgage Cost',
            value: results.MaxZeroMortgage,
            color: colors.primaryGreen,
        },
        {
            name: 'Property Taxes',
            value: results.netZeroTax,
            color: colors.primaryPurple,
        },
        {
            name: 'Operating Expenses',
            value: results.totalMonthlyExpenses,
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
                    destinationScreen="ProjectionCalcIn"
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
                        <Text style={styles.mainLabel}>Monthly Cashflow Target</Text>
                        <TouchableOpacity onPress={() => setInfoModalVisible(true)}>
                            <Ionicons name="information-circle-outline" size={16} color={colors.primaryGrey} />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.mainValue}>
                        {formatDollar(inputValues.monthCashflow)}
                    </Text>
                </View>
                
                <PriceBar 
                    listingPrice={inputValues.purchasePrice}
                    targetPrice={results.TargetPrice}
                    evenPrice={results.NetZeroPrice}
                />
                
                <View style={styles.resultsGrid}>
                    {inputValues.purchasePrice > 0 && (
                        <ResultDisplay 
                            label="Listing Price"
                            value={inputValues.purchasePrice}
                            type="dollar"
                            fullWidth={true}
                            textColor={getListingPriceColor(
                                inputValues.purchasePrice, 
                                results.TargetPrice, 
                                results.NetZeroPrice
                            )}
                            additionalText={getListingPriceText(
                                inputValues.purchasePrice, 
                                results.TargetPrice, 
                                results.NetZeroPrice
                            )}
                            infoTitle={calculatorInfo.calculator_input.listing_price.title}
                            infoDescription={calculatorInfo.calculator_input.listing_price.description}
                        />
                    )}
                    <View style={styles.doubleResultsRow}>
                        {doubleResultDisplays.map((item, index) => (
                            <DoubleResultDisplay 
                                key={index}
                                {...item}
                            />
                        ))}
                    </View>
                </View>
                
                <View style={styles.toggleContainer}>
                    <TouchableOpacity 
                        style={[
                            styles.toggleButton, 
                            showTargetPrice && styles.toggleButtonActive
                        ]}
                        onPress={() => setShowTargetPrice(true)}
                    >
                        <Text style={[
                            styles.toggleText,
                            showTargetPrice && styles.toggleTextActive
                        ]}>Target Price{'\n'}Monthly Costs</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[
                            styles.toggleButton, 
                            !showTargetPrice && styles.toggleButtonActive
                        ]}
                        onPress={() => setShowTargetPrice(false)}
                    >
                        <Text style={[
                            styles.toggleText,
                            !showTargetPrice && styles.toggleTextActive
                        ]}>Break Even Price{'\n'}Monthly Costs</Text>
                    </TouchableOpacity>
                </View>
                <ExpensePieChart
                    chartData={showTargetPrice ? targetExpenseChartData : breakEvenExpenseChartData}
                    chartTitle={showTargetPrice ? 
                        "Total Monthly Expenses\n(Target Price)" : 
                        "Total Monthly Expenses\n(Break Even Price)"
                    }
                />
            </ScrollView>

            <InfoComponent
                visible={infoModalVisible}
                onClose={() => setInfoModalVisible(false)}
                title={calculatorInfo.calculator_input.month_cashflow.title}
                description={calculatorInfo.calculator_input.month_cashflow.description}
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
        gap: 12,
    },
    doubleResultsRow: {
        flexDirection: 'row',
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

export default ProjectionCalcOut;