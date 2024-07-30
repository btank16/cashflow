import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, Platform, StatusBar, ScrollView, KeyboardAvoidingView, Keyboard } from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';
import colors from '../Colors/colors.Js';
import NavBar from '../Components/NavBar.Js';
import LoanInput from '../Components/LoanInputs.Js';
import NumericInput from '../Components/NumericInputBox.Js';
import ExpenseArray from '../Components/ExpenseArray.Js';
import CalcButton from '../Components/CalcButton.Js';
import { secondTranslation } from '../../FunctionCalls/BRRRCalls.Js';
import LoanTerm from '../Components/LoanTerm.Js';
import HomeButton from '../Components/HomeButton.Js';

function BRRCalcIn(props) {
    const navigation = useNavigation();
    const route = useRoute();
    const [purchasePrice, setPurchasePrice] = useState('');
    const [downPayment, setDownPayment] = useState('');
    const [interestRate, setInterestRate] = useState('');
    const [closingCost, setClosingCost] = useState('');
    const [propertyTax, setPropertyTax] = useState('');
    const [rehabCost, setRehabCost] = useState('');
    const [loanTerm, setLoanTerm] = useState(30);
    const [newloanTerm, setnewLoanTerm] = useState(30);
    const [BRRmonthRent, setBRRmonthRent] = useState('');
    const [BRRcapexEst, setBRRcapexEst] = useState('');
    const [afterRev, setAfterRev] = useState('');
    const [rehabTime, setRehabTime] = useState('');
    const [refinanceCost, setRefinanceCost] = useState('');
    const [newInterest, setNewInterest] = useState('');
    const [expenseArray, setExpenseArray] = useState(['100', '', '']);
    const [isFormValid, setIsFormValid] = useState(false);
    const scrollViewRef = useRef();
    const [resultScreen, setResultScreen] = useState('BRRCalcOut');
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    

    useEffect(() => {
        checkFormValidity();

        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboardVisible(true);
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardVisible(false);
            }
        );

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, [purchasePrice, downPayment, interestRate, propertyTax, BRRmonthRent, afterRev, newInterest]);

    useEffect(() => {
        if (route.params?.inputValues) {
            const {
                purchasePrice,
                downPayment,
                interestRate,
                closingCost,
                propertyTax,
                rehabCost,
                loanTerm,
                BRRcapexEst,
                expenseArray,
                afterRev,
                rehabTime,
                newloanTerm,
                BRRmonthRent,
                refinanceCost,
                newInterest
            } = route.params.inputValues;

            setPurchasePrice(purchasePrice?.toString() || '');
            setDownPayment(downPayment?.toString() || '');
            setInterestRate(interestRate?.toString() || '');
            setClosingCost(closingCost?.toString() || '');
            setPropertyTax(propertyTax?.toString() || '');
            setRehabCost(rehabCost?.toString() || '');
            setLoanTerm(loanTerm?.toString() || '30');
            setBRRcapexEst(BRRcapexEst?.toString() || '');
            setExpenseArray(expenseArray || ['100', '', '']);
            setAfterRev(afterRev?.toString() || '');
            setRehabTime(rehabTime?.toString() || '');
            setnewLoanTerm(newloanTerm?.toString() || '30');
            setBRRmonthRent(BRRmonthRent?.toString() || '');
            setRefinanceCost(refinanceCost?.toString() || '');
            setNewInterest(newInterest?.toString() || '');
        }
    }, [route.params?.inputValues]);

    const checkFormValidity = () => {
        setIsFormValid(
            purchasePrice !== '' &&
            downPayment !== '' &&
            interestRate !== '' &&
            propertyTax !== '' &&
            BRRmonthRent !== '' &&
            afterRev !== '' &&
            newInterest !== ''
        );
    };

    const onCalculatePress = () => {
        secondTranslation({
            purchasePrice,
            downPayment,
            interestRate,
            loanTerm,
            propertyTax,
            BRRcapexEst,
            expenseArray,
            rehabCost,
            closingCost,
            BRRmonthRent,
            afterRev,
            rehabTime,
            refinanceCost,
            newInterest,
            newloanTerm
        }, navigation, resultScreen);
      };

    const handleExpenseDataChange = (costValues) => {
        setExpenseArray(costValues);
      };

    return (
        <SafeAreaView style={styles.masterBackground}>
            <View style={styles.logoContainer}>
                <HomeButton/>
            </View>
            <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyContainer}
            >
                <ScrollView
                ref={scrollViewRef}
                contentContainerStyle={styles.contentContainer}
                keyboardShouldPersistTaps="handled"
                >                
                    <LoanInput
                        purchasePrice={purchasePrice}
                        setPurchasePrice={setPurchasePrice}
                        downPayment={downPayment}
                        setDownPayment={setDownPayment}
                        interestRate={interestRate}
                        setInterestRate={setInterestRate}
                        closingCost={closingCost}
                        setClosingCost={setClosingCost}
                        propertyTax={propertyTax}
                        setPropertyTax={setPropertyTax}
                        rehabCost={rehabCost}
                        setRehabCost={setRehabCost}
                        loanTerm={loanTerm}
                        setLoanTerm={setLoanTerm}
                        isRequired={true}
                    />
                    <View style={styles.inputContainer}>
                        <View style={styles.rowCont}>
                            <View style={{ flex: 1 }}>
                                <NumericInput
                                    label="Gross Monthly Rent ($):"
                                    value={BRRmonthRent}
                                    onChangeText={setBRRmonthRent}
                                    placeholder="ex. $1000"
                                    isRequired={true}  
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <NumericInput
                                    label="CapEx Estimate (%):"
                                    value={BRRcapexEst}
                                    onChangeText={setBRRcapexEst}
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
                                    isRequired={true}
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
                                    isRequired={true}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <LoanTerm
                                    label="New Loan Term (yrs):"
                                    value={newloanTerm}
                                    onValueChange={(itemValue) => setnewLoanTerm(itemValue)}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={styles.inputContainer}>
                        <ExpenseArray onDataChange={handleExpenseDataChange}/>
                    </View>
                    <View style={styles.buttonSpaceholder} />
                </ScrollView>
            </KeyboardAvoidingView>
            {Platform.OS === 'ios' || !isKeyboardVisible ? (
                <View style={styles.buttonContainer}>
                    <CalcButton
                        title="Calculate"
                        onPress={onCalculatePress}
                        disabled={!isFormValid}
                    />
                </View>
            ) : null}
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