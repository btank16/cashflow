import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, Platform, StatusBar, ScrollView, KeyboardAvoidingView, Keyboard, Image } from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';
import colors from '../Colors/colors.Js';
import NavBar from '../Components/NavBar.Js';
import NumericInput from '../Components/NumericInputBox.Js';
import ExpenseArray from '../Components/ExpenseArray.Js';
import LoanTerm from '../Components/LoanTerm.Js';
import CalcButton from '../Components/CalcButton.Js';
import { thirdTranslation } from '../../FunctionCalls/CashflowCalls.Js';
import HomeButton from '../Components/HomeButton.Js';
import CommonStyles from '../Colors/CommonStyles.Js';
import CustomTitle from '../Components/CustomTitle.Js';
import SwitchableNumericInput from '../Components/SwitchableNumericInput.Js';
import { useDatabase } from '../../../database/cashflowDatabase.Js';

function ProjectionCalcIn(props) {
    const navigation = useNavigation();
    const route = useRoute();
    const [monthCashflow, setMonthCashflow] = useState('');
    const [downPayment, setDownPayment] = useState('');
    const [interestRate, setInterestRate] = useState('');
    const [propertyTax, setPropertyTax] = useState('');
    const [monthRent, setMonthRent] = useState('');
    // const [capexEst, setCapexEst] = useState('');
    const [loanTerm, setLoanTerm] = useState(30);
    const [rehabCost, setRehabCost] = useState('');
    const [expenseArray, setExpenseArray] = useState(['', '', '']);
    const [isFormValid, setIsFormValid] = useState(false);
    const scrollViewRef = useRef();
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [resultScreen, setResultScreen] = useState('ProjectionCalcOut');
    const [switchableInputs, setSwitchableInputs] = useState({
        closingCost: { value: '', isDollar: false },
        capexEst: { value: '', isDollar: false }
    });
    const { saveCalculation } = useDatabase();

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
    }, [monthCashflow, interestRate, monthRent, downPayment, propertyTax]);

    useEffect(() => {
        if (route.params?.inputValues) {
            const {
                monthCashflow,
                downPayment,
                interestRate,
                propertyTax,
                loanTerm,
                monthRent,
                // capexEst,
                expenseArray
            } = route.params.inputValues;

            setMonthCashflow(monthCashflow?.toString() || '');
            setDownPayment(downPayment?.toString() || '');
            setInterestRate(interestRate?.toString() || '');
            setPropertyTax(propertyTax?.toString() || '');
            setLoanTerm(loanTerm?.toString() || '30');
            setMonthRent(monthRent?.toString() || '');
            // setCapexEst(capexEst?.toString() || '');
            setExpenseArray(expenseArray || ['', '', '']);
           
            setSwitchableInputs(prevInputs => ({
                ...prevInputs,
                closingCost: closingCost || { value: '', isDollar: false },
                capexEst: capexEst || { value: '', isDollar: false }
            }));
        }
    }, [route.params?.inputValues]);

    const checkFormValidity = () => {
        setIsFormValid(
            monthCashflow !== '' &&
            downPayment !== '' &&
            interestRate !== '' &&
            propertyTax !== '' &&
            monthRent !== ''
        );
    };

    const handleExpenseDataChange = (costValues) => {
        setExpenseArray(costValues);
      };

      const handleSwitchableInputChange = (inputName, newValue) => {
        setSwitchableInputs(prevInputs => ({
            ...prevInputs,
            [inputName]: {
                ...prevInputs[inputName],
                value: newValue
            }
        }));
    };

    const handleSwitchableInputToggle = (inputName) => {
        setSwitchableInputs(prevInputs => ({
            ...prevInputs,
            [inputName]: { 
                ...prevInputs[inputName],
                isDollar: !prevInputs[inputName].isDollar 
            }
        }));
    };

      const onCalculatePress = async () => {
        const inputValues = {
            monthCashflow,
            downPayment,
            interestRate,
            loanTerm,
            propertyTax,
            capexEst: switchableInputs.capexEst,
            expenseArray,
            monthRent,
            closingCost: switchableInputs.closingCost,
            rehabCost
        };

        const results = await thirdTranslation(inputValues);

        // Save the calculation to the database
        await saveCalculation('projection', results.inputValues, results);

        // Navigate to the result screen
        navigation.navigate(resultScreen, {
            inputValues,
            ...results
        });
    };

    return (
        <SafeAreaView style={styles.masterBackground}>
            <View style={styles.logoContainer}>
                <HomeButton/>
                <Image source={require('../../assets/CashflowText.png')} style={CommonStyles.logo} />
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
                    <CustomTitle title="Cashflow Projection Calculator" />                           
                    <View style={styles.rowCont}>
                        <View style={{ flex: 1 }}>
                            <NumericInput
                                label="Monthly Cashflow Target ($):"
                                value={monthCashflow}
                                onChangeText={setMonthCashflow}
                                placeholder="ex. $1000"
                                isRequired={true}
                            />
                        </View>
                    </View>
                    <View style={styles.rowCont}>
                        <View style={{ flex: 1 }}>
                            <NumericInput
                                label="Down Payment (%):"
                                value={downPayment}
                                onChangeText={setDownPayment}
                                placeholder="ex. 20%"
                                isRequired={true}
                            />
                        </View>
                    </View>
                    <View style={styles.rowCont}>
                        <View style={{ flex: 1 }}>
                            <LoanTerm
                                label="Loan Term (years):"
                                value={loanTerm}
                                onValueChange={(itemValue) => setLoanTerm(itemValue)}
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <NumericInput
                                label="Interest Rate (%):"
                                value={interestRate}
                                onChangeText={setInterestRate}
                                placeholder="ex. 5%"
                                isRequired={true}
                            />
                        </View>
                    </View>
                    <View style={styles.rowCont}>
                        <View style={{ flex: 1 }}>
                            <SwitchableNumericInput
                                label="Closing Cost:"
                                value={switchableInputs.closingCost.value}
                                isDollar={switchableInputs.closingCost.isDollar}
                                onChangeValue={(value) => handleSwitchableInputChange('closingCost', value)}
                                onToggleMode={() => handleSwitchableInputToggle('closingCost')}
                                placeholder={switchableInputs.closingCost.isDollar ? "ex. $5,000" : "ex. 2%"}
                            />
                        </View>
                    </View>
                    <View style={styles.rowCont}>
                        <View style={{ flex: 1 }}>
                            <NumericInput
                                label="Property Tax (%):"
                                value={propertyTax}
                                onChangeText={setPropertyTax}
                                placeholder="ex. 2%"
                                isRequired={true}
                            />
                        </View>
                    </View>
                    <View style={styles.rowCont}>
                        <View style={{ flex: 1 }}>
                            <NumericInput
                                label="Gross Monthly Rent ($):"
                                value={monthRent}
                                onChangeText={setMonthRent}
                                placeholder="ex. $1000"
                                isRequired={true}
                            />
                        </View>
                    </View>
                    <View style={styles.rowCont}>
                        <View style={{ flex: 2 }}>
                            <NumericInput
                                label="Rehab Cost ($):"
                                value={rehabCost}
                                onChangeText={setRehabCost}
                                placeholder="ex. $10,000"
                            />
                        </View>
                    </View>
                    <View style={styles.rowCont}>
                        <View style={{ flex: 1 }}>
                            <SwitchableNumericInput
                                label="Annual CapEx Estimate:"
                                value={switchableInputs.capexEst.value}
                                isDollar={switchableInputs.capexEst.isDollar}
                                onChangeValue={(value) => handleSwitchableInputChange('capexEst', value)}
                                onToggleMode={() => handleSwitchableInputToggle('capexEst')}
                                placeholder={switchableInputs.capexEst.isDollar ? "ex. $3,000" : "ex. 5%"}
                            />
                        </View>
                    </View>
                    <ExpenseArray onDataChange={handleExpenseDataChange}/>
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

export default ProjectionCalcIn;