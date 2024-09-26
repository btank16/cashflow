import React from 'react';
import { View, StyleSheet, SafeAreaView, Platform, StatusBar, Text, Image } from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';
import colors from '../Colors/colors.Js';
import NavBar from '../Components/NavBar.Js';
import ResultDisplay from '../Components/ResultDisplay.Js';
import BackButton from '../Components/BackButton.Js';
import CommonStyles from '../Colors/CommonStyles.Js';
import CustomTitle from '../Components/CustomTitle.Js';

function WholesaleCalcOut(props) {
    const navigation = useNavigation();
    const route = useRoute();
    const { inputValues, results } = route.params;
    const { purchasePrice } = inputValues;

    const formatDollar = (value) => {
        const number = parseFloat(value);
        return isNaN(number) ? '$0.00' : '$' + number.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
    };

    return (
        <SafeAreaView style={styles.masterBackground}>
            <View style={styles.logoContainer}>
                <BackButton 
                    inputValues={inputValues} 
                    destinationScreen='WholesaleCalcIn'
                />
                <Image source={require('../../assets/CashflowText.png')} style={CommonStyles.logo} />
            </View>
            <View style={styles.contentContainer}>
                <CustomTitle title="Wholesaling Output" />   
                <ResultDisplay label="Your Current Offer" value={`$${purchasePrice}`} />
                <ResultDisplay label="Maximum Allowable Offer" value={`$${results.maximumAllowableOffer}`} />                        
                <ResultDisplay label="Expenses Incurred" value={`$${results.totalExpenses}`} />
                <View style={styles.columnsContainer}>
                    <View style={styles.column}>
                        <Text style={styles.columnTitle}>Fee @ 5% of ARV</Text>
                        <ResultDisplay label="Fee Charged" value={formatDollar(results.fee5Perc)} />
                        <ResultDisplay label="Sale Price" value={formatDollar(results.sale5Perc)} />
                    </View>
                    <View style={styles.columnDivider} />
                    <View style={styles.column}>
                        <Text style={styles.columnTitle}>Fee @ 15% of ARV</Text>
                        <ResultDisplay label="Fee Charged" value={formatDollar(results.fee15Perc)} />
                        <ResultDisplay label="Sale Price" value={formatDollar(results.sale15Perc)} />
                    </View>
                </View>
            </View>
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
        borderBottomColor: 'rgba(0, 0, 0, 0.1)',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 5,
    },
    contentContainer: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'center',
    },
    menuContainer: {
        height: 56,
        backgroundColor: colors.background,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0, 0, 0, 0.1)',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 5,
    },
    columnsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    column: {
        flex: 1,
        alignItems: 'center',
    },
    columnTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.basicText,
        marginBottom: 10,
    },
    columnDivider: {
        width: 1,
        backgroundColor: colors.accent,
        marginHorizontal: 10,
    },
});

export default WholesaleCalcOut;