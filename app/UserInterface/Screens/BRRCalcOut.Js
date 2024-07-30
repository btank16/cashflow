import React from 'react';
import { View, StyleSheet, SafeAreaView, Platform, StatusBar, Text, ScrollView } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import colors from '../Colors/colors.Js';
import NavBar from '../Components/NavBar.Js';
import ResultDisplay from '../Components/ResultDisplay.Js';
import BackButton from '../Components/BackButton.Js';


function BRRCalcOut(props) {
    const navigation = useNavigation();

    const route = useRoute();
    const { inputValues, ...results } = route.params;

    return (
        <SafeAreaView style={styles.masterBackground}>
            <View style={styles.logoContainer}>
                <BackButton 
                    inputValues={inputValues} 
                    destinationScreen='BRRCalcIn'
                />
            </View>
            <ScrollView style={styles.contentContainer}>
            <ResultDisplay label="Cash Down" value={`$${results.cashDown}`} />
                <ResultDisplay label="Mortgage Cost" value={`$${results.mortgageCost}`} />
                <ResultDisplay label="Total Monthly Costs" value={`$${results.monthlyCost}`} />
                <ResultDisplay label="Refinanced Mortgage Cost" value={`$${results.BRRMortgageCost}`} />
                <ResultDisplay label="Refinanced Total Monthly Costs" value={`$${results.BRRMonthlyCost}`} />
                <ResultDisplay label="Monthly Cashflow (post-Refinance)" value={`$${results.BRRCashflow}`} />
                <ResultDisplay label="Annual Cashflow (post-Refinance)" value={`$${results.BRRAnnualCashflow}`} />
                <ResultDisplay label="Maximum Equity Usage" value={`$${results.MaxEquity}`} />
                <ResultDisplay label="Net Equity Return" value={`$${results.EquityReturn}`} />
                <ResultDisplay label="Equity ROI" value={`${results.EquityReturnPerc}%`} />
            </ScrollView>
            <View style={styles.menuContainer}>
                <NavBar 
                    activeTab="Analyze"
                    onTabPress={(tabName) => {
                        if (tabName === 'Feedback') {
                            navigation.navigate('FeedbackScreen');
                        }
                        else if (tabName === 'Analyze') {
                            navigation.navigate('CalcHomeScreen');
                        }
                    }}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    masterBackground: {
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    logoContainer: {
        flexDirection: 'row',
        height: 56,
        backgroundColor: colors.background,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.1)', // Faded black line
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 5, // for Android shadow
    },
    contentContainer: {
        flex: 8,
        backgroundColor: colors.background,
    },
    menuContainer: {
        height: 56,
        backgroundColor: colors.background,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0, 0, 0, 0.1)', // Faded black line
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 5, // for Android shadow
    }
});

export default BRRCalcOut;