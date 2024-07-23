import React, {useEffect} from 'react';
import { View, StyleSheet, SafeAreaView, Platform, StatusBar, Text } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import colors from '../Colors/colors.Js';
import NavBar from '../Components/NavBar.Js';
import ResultDisplay from '../Components/ResultDisplay.Js';

function FlipCalcOut(props) {
    const navigation = useNavigation();

    const route = useRoute();
    const results = route.params;

    return (
        <SafeAreaView style={styles.masterBackground}>
            <View style={styles.logoContainer}></View>
            <View style={styles.contentContainer}>
                <ResultDisplay label="Cash Down" value={`$${results.cashDown}`} />
                <ResultDisplay label="Mortgage Cost" value={`$${results.mortgageCost}`} />
                <ResultDisplay label="Monthly Expenses" value={`$${results.monthEx}`} />
                <ResultDisplay label="Total Monthly Costs" value={`$${results.monthlyCost}`} />
                <ResultDisplay label="Net Profit" value={`$${results.totalProfit}`} />
                <ResultDisplay label="ROI" value={`${results.returnPerc}%`} />
                <ResultDisplay label="Cash on Cash ROI" value={`${results.cashROI}%`} />
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

export default FlipCalcOut;