import React from 'react';
import { Platform, View, StyleSheet, SafeAreaView, StatusBar, ScrollView, Text, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';
import colors from '../../Colors/colors.Js';
import BackButton from '../../Components/BackButton.Js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DarkTextLogo from '../../../assets/icons/DarkTextLogo.jsx';
import DoubleResultDisplay from '../../Components/DoubleResultDisplay.Js';
import ResultDisplay from '../../Components/ResultDisplay.Js';

function WholesaleCalcOut(props) {
    const navigation = useNavigation();
    const route = useRoute();
    const { inputValues, ...results } = route.params;
    const { purchasePrice } = inputValues;

    const formatDollar = (value) => {
        const number = parseFloat(value);
        return isNaN(number) ? '$0.00' : '$' + number.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
    };

    const fullWidthDisplays = [
        {
            label: "Total Expenses",
            value: results.totalExpenses,
            type: "dollar",
            infoPress: () => handleInfoPress("Information about Total Expenses"),
            fullWidth: true,
            textColor: colors.primaryBlack,
            additionalText: "Total expenses incurred during the holding period",
        }
    ];

    return (
        <SafeAreaView style={styles.masterBackground}>
            <View style={styles.logoContainer}>
                <BackButton 
                    inputValues={inputValues}
                    destinationScreen="WholesaleCalcIn"
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
                        <Text style={styles.mainLabel}>Maximum Allowable Offer</Text>
                        <TouchableOpacity onPress={() => handleInfoPress("Information about Maximum Allowable Offer")}>
                            <Ionicons name="information-circle-outline" size={16} color={colors.primaryGrey} />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.mainValue}>
                        {formatDollar(results.maximumAllowableOffer)}
                    </Text>
                    <View style={styles.subLabelContainer}>
                        <Text style={styles.subLabelText}>Contract Price: </Text>
                        <Text style={[
                            styles.subLabelValue,
                            { color: inputValues.purchasePrice > results.maximumAllowableOffer 
                                ? colors.quaternaryRed 
                                : colors.primaryGreen 
                            }
                        ]}>
                            {formatDollar(inputValues.purchasePrice)}
                        </Text>
                    </View>
                </View>
                <View style={styles.resultsGrid}>
                    <DoubleResultDisplay
                        topLabel="Minimum Sale Price"
                        topValue={formatDollar(results.sale5Perc)}
                        bottomLabel="Minimum Fee"
                        bottomValue={formatDollar(results.fee5Perc)}
                        topInfoPress={() => handleInfoPress("Information about 5% Sale Price")}
                        bottomInfoPress={() => handleInfoPress("Information about 5% Fee")}
                    />
                    <DoubleResultDisplay
                        topLabel="Maximum Sale Price"
                        topValue={formatDollar(results.sale15Perc)}
                        bottomLabel="Maximum Fee"
                        bottomValue={formatDollar(results.fee15Perc)}
                        topInfoPress={() => handleInfoPress("Information about 15% Sale Price")}
                        bottomInfoPress={() => handleInfoPress("Information about 15% Fee")}
                    />
                    {fullWidthDisplays.map((item, index) => (
                        <ResultDisplay 
                            key={`full-${index}`}
                            {...item}
                        />
                    ))}
                </View>
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
    subLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    subLabelText: {
        fontSize: 14,
        color: colors.primaryGrey,
    },
    subLabelValue: {
        fontSize: 14,
        fontWeight: '500',
    },
});

export default WholesaleCalcOut;