import React, { useState, useRef } from 'react';
import { View, StyleSheet, SafeAreaView, Platform, StatusBar, ScrollView, KeyboardAvoidingView } from "react-native";
import { useNavigation } from '@react-navigation/native';
import colors from '../Colors/colors.Js';
import NavBar from '../Components/NavBar.Js';
import LoanInput from '../Components/LoanInputs.Js';
import NumericInput from '../Components/NumericInputBox.Js';
import ExpenseArray from '../Components/ExpenseArray.Js';
import CalcButton from '../Components/CalcButton.Js';

function BRRCalcIn(props) {
    const navigation = useNavigation();
    const [monthRent, setMonthRent] = useState('');
    const [capexEst, setCapexEst] = useState('');
    const [afterRev, setAfterRev] = useState('');
    const [rehabTime, setRehabTime] = useState('');
    const [refinanceCost, setRefinanceCost] = useState('');
    const [newInterest, setNewInterest] = useState('');
    const scrollViewRef = useRef();

    return (
        <SafeAreaView style={styles.masterBackground}>
            <View style={styles.logoContainer}></View>
            <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyContainer}
            >
                <ScrollView
                ref={scrollViewRef}
                contentContainerStyle={styles.contentContainer}
                keyboardShouldPersistTaps="handled"
                >                
                    <LoanInput/>
                    <View style={styles.inputContainer}>
                        <View style={styles.rowCont}>
                            <View style={{ flex: 1 }}>
                                <NumericInput
                                    label="Gross Monthly Rent ($):"
                                    value={monthRent}
                                    onChangeText={setMonthRent}
                                    placeholder="ex. $1000"
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <NumericInput
                                    label="CapEx Estimate (%):"
                                    value={capexEst}
                                    onChangeText={setCapexEst}
                                    placeholder="ex. 5% of Rent"
                                />
                            </View>
                        </View>
                    </View>
                    <View style={styles.inputContainer}>
                        <View style={styles.rowCont}>
                            <View style={{ flex: 1 }}>
                                <NumericInput
                                    label="After Repair Value ($):"
                                    value={afterRev}
                                    onChangeText={setAfterRev}
                                    placeholder="ex. $300,000"
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <NumericInput
                                    label="Rehab Time (Months):"
                                    value={rehabTime}
                                    onChangeText={setRehabTime}
                                    placeholder="ex. 10 months"
                                />
                            </View>
                        </View>
                    </View>
                    <View style={styles.inputContainer}>
                        <View style={styles.rowCont}>
                            <View style={{ flex: 1 }}>
                                <NumericInput
                                    label="Refinance Costs ($):"
                                    value={refinanceCost}
                                    onChangeText={setRefinanceCost}
                                    placeholder="ex. $1000"
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <NumericInput
                                    label="New Interest Rate (%):"
                                    value={newInterest}
                                    onChangeText={setNewInterest}
                                    placeholder="ex. 5%"
                                />
                            </View>
                        </View>
                    </View>
                    <View style={styles.inputContainer}>
                        <ExpenseArray/>
                    </View>
                    <View style={styles.buttonSpaceholder} />
                </ScrollView>
            </KeyboardAvoidingView>
            <View style={styles.buttonContainer}>
                <CalcButton
                title="Calculate"
                destination="BRRCalcOut"
                onPress={() => console.log('Button pressed on Screen 1')}
                />
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
    keyContainer: {
        flex: 1,
    },
    contentContainer: {
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
    },
    inputContainer: {
        alignItems: 'flex-start',
    },
    rowCont: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'flex-end',
        width: '100%',
    },
    buttonSpaceholder: {
        height: 45, 
    },
    buttonContainer: {
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? 96 : 61,
        left: 0,
        right: 0,
        paddingHorizontal: 50,
    },
});

export default BRRCalcIn;