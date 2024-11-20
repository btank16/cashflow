import React from 'react';
import { Platform, View, StyleSheet, SafeAreaView, StatusBar, ScrollView, Image } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import colors from '../Colors/colors.Js';
import NavBar from '../Components/NavBar.Js';
import ResultDisplay from '../Components/ResultDisplay.Js';
import BackButton from '../Components/BackButton.Js';
import CommonStyles from '../Colors/CommonStyles.Js';
import CustomTitle from '../Components/CustomTitle.Js';

function RentalCalcOut(props) {
    const navigation = useNavigation();
    const route = useRoute();
    const { inputValues, ...results } = route.params;

    const formatDollar = (value) => {
        const number = parseFloat(value);
        return isNaN(number) ? '$0.00' : '$' + number.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
    };
    
    const formatPercent = (value) => {
        const number = parseFloat(value);
        return isNaN(number) ? '0.00%' : number.toFixed(2) + '%';
    };

    const formatDSCR = (value) => {
        const number = parseFloat(value);
        return isNaN(number) ? '0.00' : number.toFixed(2);
    };

    return (
        <SafeAreaView style={styles.masterBackground}>
            <View style={styles.logoContainer}>
                <BackButton 
                    inputValues={inputValues} 
                    destinationScreen='RentalCalcIn'
                />
                <Image source={require('../../assets/images/WhiteTextLogo.png')} style={CommonStyles.logo} />
            </View>
            <ScrollView style={styles.contentContainer}>
                <CustomTitle title="Rental Output" />                           
                <ResultDisplay label="Cash Down" value={formatDollar(results.cashDown)} />
                <ResultDisplay label="Debt Service Coverage Ratio (DSCR)" value={formatDSCR(results.DSCR)} />
                <ResultDisplay label="Mortgage Cost" value={formatDollar(results.mortgageCost)} />
                <ResultDisplay label="Monthly Expenses" value={formatDollar(results.monthEx)} />
                <ResultDisplay label="Total Monthly Costs" value={formatDollar(results.monthlyCost)} />
                <ResultDisplay label="Monthly Cashflow" value={formatDollar(results.cashflow)} />
                <ResultDisplay label="Annual Cashflow" value={formatDollar(results.annualCashflow)} />
                <ResultDisplay label="Cash on Cash Return" value={formatPercent(results.cashOnCash)} />
                <ResultDisplay label="Cap Rate" value={formatPercent(results.capRate)} />
                <ResultDisplay label="Months to Break Even" value={Math.round(results.monthsTillEven).toString()} />
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
        alignItems: 'center',
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
        flex: 1,
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

export default RentalCalcOut;