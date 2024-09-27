import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, Platform, StatusBar, ScrollView, KeyboardAvoidingView, Keyboard, Image } from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';
import colors from '../Colors/colors.Js';
import NavBar from '../Components/NavBar.Js';
import NumericInput from '../Components/NumericInputBox.Js';
import ExpenseArray from '../Components/ExpenseArray.Js';
import CalcButton from '../Components/CalcButton.Js';
import { expenses } from '../../Calculations/ExpenseFunction.Js';
import { outputs } from '../../Calculations/CoreOutputs.Js';
import HomeButton from '../Components/HomeButton.Js';
import CommonStyles from '../Colors/CommonStyles.Js';
import CustomTitle from '../Components/CustomTitle.Js';
import SwitchableNumericInput from '../Components/SwitchableNumericInput.Js';
import LoanTerm from '../Components/LoanTerm.Js';
import { useDatabase } from '../../../database/cashflowDatabase.Js';

function RentalCalcIn(props) {
    const navigation = useNavigation();
    const route = useRoute();
    const [purchasePrice, setPurchasePrice] = useState('');
    const [interestRate, setInterestRate] = useState('');
    const [rehabCost, setRehabCost] = useState('');
    const [loanTerm, setLoanTerm] = useState(30);
    const [monthRent, setMonthRent] = useState('');
    const [expenseArray, setExpenseArray] = useState(['', '', '']);
    const [isFormValid, setIsFormValid] = useState(false);
    const scrollViewRef = useRef();
    const [resultScreen, setResultScreen] = useState('RentalCalcOut');
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [switchableInputs, setSwitchableInputs] = useState({
        downPayment: { value: '', isDollar: false },
        closingCost: { value: '', isDollar: false },
        propertyTax: { value: '', isDollar: false },
        capexEst: { value: '', isDollar: false }
    });
    const { saveCalculation } = useDatabase();
    const [calculationId, setCalculationId] = useState(null);

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
    }, [purchasePrice, interestRate, monthRent, switchableInputs]);

    useEffect(() => {
        if (route.params?.inputValues) {
            const {
                id,
                purchasePrice,
                downPayment,
                interestRate,
                closingCost,
                propertyTax,
                rehabCost,
                loanTerm,
                monthRent,
                capexEst,
                expenseArray,
            } = route.params.inputValues;

            setCalculationId(id);
            setPurchasePrice(purchasePrice?.toString() || '');
            setInterestRate(interestRate?.toString() || '');
            setRehabCost(rehabCost?.toString() || '');
            setLoanTerm(loanTerm?.toString() || '30');
            setMonthRent(monthRent?.toString() || '');
            setExpenseArray(expenseArray || ['', '', '']);
            
            setSwitchableInputs(prevInputs => ({
                ...prevInputs,
                downPayment: downPayment || { value: '', isDollar: false },
                closingCost: closingCost || { value: '', isDollar: false },
                propertyTax: propertyTax || { value: '', isDollar: false },
                capexEst: capexEst || { value: '', isDollar: false }
            }));
        }
    }, [route.params?.inputValues]);

    const checkFormValidity = () => {
        setIsFormValid(
            purchasePrice !== '' &&
            switchableInputs.downPayment.value !== '' &&
            interestRate !== '' &&
            switchableInputs.propertyTax.value !== '' &&
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
        const toNumber = (value) => value === '' ? 0 : Number(value);

        const inputValues = {
            id: calculationId,
            purchasePrice: toNumber(purchasePrice),
            downPayment: switchableInputs.downPayment,
            interestRate: toNumber(interestRate),
            loanTerm: toNumber(loanTerm),
            propertyTax: switchableInputs.propertyTax,
            closingCost: switchableInputs.closingCost,
            capexEst: switchableInputs.capexEst,
            expenseArray: expenseArray.map(toNumber),
            rehabCost: toNumber(rehabCost),
            monthRent: toNumber(monthRent),
            // Add default values for missing properties
            propertyInsurance: 0,
            afterRev: 0,
            rehabTime: 0,
            agentCommish: { value: '0', isDollar: false }
        };

        // Call ExpenseFunction
        const expenseResults = expenses(
            inputValues.purchasePrice,
            inputValues.downPayment,
            inputValues.interestRate,
            inputValues.loanTerm,
            inputValues.propertyTax,
            inputValues.propertyInsurance,
            inputValues.capexEst,
            inputValues.expenseArray,
            inputValues.rehabCost,
            inputValues.closingCost,
            inputValues.monthRent,
            inputValues.rehabTime
        );

        // Call CoreOutputs function
        const outputResults = outputs(
            inputValues.afterRev,
            inputValues.rehabTime,
            inputValues.agentCommish,
            inputValues.monthRent,
            inputValues.purchasePrice,
            expenseResults[2], // cashDown
            expenseResults[1]  // monthlyCost
        );

        const results = {
            mortgageCost: expenseResults[0],
            monthlyCost: expenseResults[1],
            cashDown: expenseResults[2],
            monthEx: expenseResults[3],
            DSCR: expenseResults[5],
            totalProfit: outputResults[0],
            returnPerc: outputResults[1],
            cashROI: outputResults[2],
            cashflow: outputResults[3],
            annualCashflow: outputResults[4],
            cashOnCash: outputResults[5],
            capRate: outputResults[6],
            monthsTillEven: outputResults[7],
            totalCashCost: outputResults[8],
        };

        // Save the calculation to the database using expo-sqlite/next notation
        try {
            await saveCalculation('rental', inputValues, results);
        } catch (error) {
            console.error('Error saving calculation to database:', error);
        }

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
                    <CustomTitle title="Rental Calculator" />                           
                    <View style={styles.rowCont}>
                        <View style={{ flex: 2 }}>
                            <NumericInput
                                label="Purchase Price ($):"
                                value={purchasePrice}
                                onChangeText={setPurchasePrice}
                                placeholder="ex. $225,000"
                                isRequired={true}
                            />
                        </View>
                    </View>
                    <View style={styles.rowCont}>
                        <View style={{ flex: 1 }}>
                            <SwitchableNumericInput
                                label="Down Payment:"
                                value={switchableInputs.downPayment.value}
                                isDollar={switchableInputs.downPayment.isDollar}
                                onChangeValue={(value) => handleSwitchableInputChange('downPayment', value)}
                                onToggleMode={() => handleSwitchableInputToggle('downPayment')}
                                placeholder={switchableInputs.downPayment.isDollar ? "ex. $45,000" : "ex. 20%"}
                                isRequired={true}
                            />
                        </View>
                    </View>   
                    <View style={styles.rowCont}>
                        <View style={{ flex: 1 }}>
                            <NumericInput
                                label="Interest Rate (%):"
                                value={interestRate}
                                onChangeText={setInterestRate}
                                placeholder="ex. 5%"
                                isRequired={true}
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <LoanTerm
                                label="Loan Term (yrs):"
                                value={loanTerm}
                                onValueChange={(itemValue) => setLoanTerm(itemValue)}
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
                            <SwitchableNumericInput
                                label="Annual Property Tax:"
                                value={switchableInputs.propertyTax.value}
                                isDollar={switchableInputs.propertyTax.isDollar}
                                onChangeValue={(value) => handleSwitchableInputChange('propertyTax', value)}
                                onToggleMode={() => handleSwitchableInputToggle('propertyTax')}
                                placeholder={switchableInputs.propertyTax.isDollar ? "ex. $2,000" : "ex. 2%"}
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
        borderBottomColor: 'rgba(0, 0, 0, 0.1)',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 5,
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
        borderTopColor: 'rgba(0, 0, 0, 0.1)',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 5,
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

export default RentalCalcIn;