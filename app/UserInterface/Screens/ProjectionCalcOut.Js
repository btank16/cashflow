import React from 'react';
import { View, StyleSheet, SafeAreaView, Platform, StatusBar, Text } from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';
import colors from '../Colors/colors.Js';
import NavBar from '../Components/NavBar.Js';
import ResultDisplay from '../Components/ResultDisplay.Js';
import { LinearGradient } from 'expo-linear-gradient';
import BackButton from '../Components/BackButton.Js';

function RentalCalcOut(props) {
    const navigation = useNavigation();
    const route = useRoute();
    const { inputValues, ...results } = route.params;
    const { monthCashflow } = inputValues;

    const targetPriceNum = Number(parseFloat(results.TargetPrice).toFixed(2));
    const netZeroPriceNum = Number(parseFloat(results.NetZeroPrice).toFixed(2));

    const isTargetLower = targetPriceNum <= netZeroPriceNum;

    const leftPrice = isTargetLower ? targetPriceNum : netZeroPriceNum;
    const rightPrice = isTargetLower ? netZeroPriceNum : targetPriceNum;

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
                    destinationScreen='ProjectionCalcIn'
                />
            </View>
            <View style={styles.contentContainer}>
                <ResultDisplay label="Monthly Cashflow Target" value={`$${monthCashflow}`} />
                <View style={styles.rowCont}>
                    <View style={styles.priceBox}>
                        <Text style={styles.priceLabel} numberOfLines={2} adjustsFontSizeToFit>
                            {isTargetLower ? "Target Price:" : "Net Zero Price:"}
                        </Text>
                        <LinearGradient
                            colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.05)', 'rgba(0,0,0,0)']}
                            style={styles.gradientContainer}
                        >
                            <View style={styles.priceValueContainer}>
                                <Text style={styles.priceValue} adjustsFontSizeToFit>{formatDollar(leftPrice)}</Text>
                            </View>
                        </LinearGradient>
                        <View style={styles.arrow} />
                    </View>
                    <View style={styles.priceBox}>
                        <Text style={styles.priceLabel} numberOfLines={2} adjustsFontSizeToFit>
                            {isTargetLower ? "Net Zero Price:" : "Target Price:"}
                        </Text>
                        <LinearGradient
                            colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.05)', 'rgba(0,0,0,0)']}
                            style={styles.gradientContainer}
                        >
                            <View style={styles.priceValueContainer}>
                                <Text style={styles.priceValue} adjustsFontSizeToFit>{formatDollar(rightPrice)}</Text>
                            </View>
                        </LinearGradient>
                        <View style={styles.arrow} />
                    </View>
                </View>
                <View style={styles.trendlineContainer}>
                    <View
                        style={styles.trendline}
                    >
                        <View style={[styles.dot, styles.leftDot]} />
                        <View style={[styles.dot, styles.rightDot]} />
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
    trendlineContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 6,
    },
    priceBox: {
        width: 140,
        alignItems: 'center',
    },
    priceLabel: {
        fontSize: 16,
        color: colors.basicText,
        marginBottom: 5,
        fontWeight: 'bold',
    },
    gradientContainer: {
        borderRadius: 10,
        padding: 2,
    },
    priceValueContainer: {
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: colors.fieldColor,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
        alignItems: 'center',
        justifyContent: 'center',
        height: 30,
        width: '100%',
    },
    priceValue: {
        fontSize: 16,
        color: colors.basicText,
    },
    arrow: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderTopWidth: 10,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: 'rgba(0,0,0,0.1)',
    },
    trendline: {
        flex: 1,
        height: 4,
        borderRadius: 2,
        marginHorizontal: 70,
        backgroundColor: colors.accent,
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: colors.basicText,
        position: 'absolute',
        top: -4,
    },
    leftDot: {
        left: -6,
    },
    rightDot: {
        right: -6,
    },
    rowCont: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
      }
});

export default RentalCalcOut;