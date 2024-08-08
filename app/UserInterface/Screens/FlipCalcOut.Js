import React, {useEffect} from 'react';
import { View, StyleSheet, SafeAreaView, Platform, StatusBar, Text , ScrollView, Image } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import colors from '../Colors/colors.Js';
import NavBar from '../Components/NavBar.Js';
import ResultDisplay from '../Components/ResultDisplay.Js';
import BackButton from '../Components/BackButton.Js';
import CommonStyles from '../Colors/CommonStyles.Js';
import CustomTitle from '../Components/CustomTitle.Js';

function FlipCalcOut(props) {
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

    return (
        <SafeAreaView style={styles.masterBackground}>
            <View style={styles.logoContainer}>
                <BackButton 
                    inputValues={inputValues} 
                    destinationScreen='FlipCalcIn'
                />
                <Image source={require('../../assets/CashflowText.png')} style={CommonStyles.logo} />
            </View>
            <ScrollView style={styles.contentContainer}>
                <CustomTitle title="Fix & Flip Output" />                           
                <ResultDisplay label="Cash Down" value={formatDollar(results.cashDown)} />
                <ResultDisplay label="Mortgage Cost" value={formatDollar(results.mortgageCost)} />
                <ResultDisplay label="Monthly Expenses" value={formatDollar(results.monthEx)} />
                <ResultDisplay label="Total Monthly Costs" value={formatDollar(results.monthlyCost)} />
                <ResultDisplay label="Total Cash Costs" value={formatDollar(results.totalCashCost)} />
                <ResultDisplay label="Net Profit" value={formatDollar(results.totalProfit)} />
                <ResultDisplay label="ROI" value={formatPercent(results.returnPerc)} />
                <ResultDisplay label="Cash on Cash ROI" value={formatPercent(results.cashROI)} />
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

export default FlipCalcOut;