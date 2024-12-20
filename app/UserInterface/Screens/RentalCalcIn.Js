import React, { useState, useRef, useEffect } from 'react';
import { Platform, View, StyleSheet, SafeAreaView, StatusBar, ScrollView, KeyboardAvoidingView, Keyboard, Text, Animated } from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';
import colors from '../Colors/colors.Js';
import NumericInput from '../Components/NumericInputBox.Js';
import ExpenseArray from '../Components/ExpenseArray.Js';
import CalcButton from '../Components/CalcButton.Js';
import { expenses } from '../../Calculations/ExpenseFunction.Js';
import { outputs } from '../../Calculations/CoreOutputs.Js';
import HomeButton from '../Components/HomeButton.Js';
import SwitchableNumericInput from '../Components/SwitchableNumericInput.Js';
import LoanTerm from '../Components/LoanTerm.Js';
import { useDatabase } from '../../../database/cashflowDatabase.Js';
import Checkbox from '../Components/InterestCheckbox.Js';
import OperatingExpenses from '../Components/OperatingExpenses.Js';

function RentalCalcIn(props) {
    const navigation = useNavigation();
    const route = useRoute();
    const [purchasePrice, setPurchasePrice] = useState('');
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
    const [showHeaderTitle, setShowHeaderTitle] = useState(false);
    const scrollY = useRef(new Animated.Value(0)).current;
    const [interestRateInput, setInterestRateInput] = useState({
        value: '',
        isInterestOnly: false
    });
    const [operatingExpensesActive, setOperatingExpensesActive] = useState(true);
    const [operatingExpenses, setOperatingExpenses] = useState([]);
    const [saveNewExpenses, setSaveNewExpenses] = useState(false);

    const uid = () => {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

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
    }, [purchasePrice, interestRateInput, monthRent, switchableInputs]);

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
            setInterestRateInput({
                value: interestRate?.value?.toString() || '',
                isInterestOnly: interestRate?.isInterestOnly || false
            });
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
            interestRateInput.value !== '' &&
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

    const handleSwitchableInputToggle = (inputName, newIsDollar) => {
        setSwitchableInputs(prevInputs => ({
            ...prevInputs,
            [inputName]: { 
                ...prevInputs[inputName],
                isDollar: newIsDollar 
            }
        }));
    };

    const handleInfoPress = (infoText) => {
        console.log(infoText);
    };

    const onCalculatePress = async () => {
        const toNumber = (value) => value === '' ? 0 : Number(value);

        const inputValues = {
            purchasePrice: toNumber(purchasePrice),
            downPayment: switchableInputs.downPayment,
            interestRate: interestRateInput,
            loanTerm: toNumber(loanTerm),
            propertyTax: switchableInputs.propertyTax,
            closingCost: switchableInputs.closingCost,
            capexEst: switchableInputs.capexEst,
            expenseArray: expenseArray.map(toNumber),
            rehabCost: toNumber(rehabCost),
            monthRent: toNumber(monthRent),
            propertyInsurance: 0,
            afterRev: 0,
            rehabTime: 0,
            agentCommish: { value: '0', isDollar: false }
        };

        const id = calculationId || uid();

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

        const outputResults = outputs(
            inputValues.afterRev,
            inputValues.rehabTime,
            inputValues.agentCommish,
            inputValues.monthRent,
            inputValues.purchasePrice,
            expenseResults[2],
            expenseResults[1]
        );

        const results = {
            mortgageCost: expenseResults[0],
            monthlyCost: expenseResults[1],
            cashDown: expenseResults[2],
            monthEx: expenseResults[3],
            DSCR: expenseResults[5],
            monthlyPropTax: expenseResults[6],
            monthlyCapEx: expenseResults[7],
            monthlyOpEx: expenseResults[8],
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

        try {
            await saveCalculation('rental', inputValues, results, id);
        } catch (error) {
            console.error('Error saving calculation to database:', error);
        }

        navigation.navigate(resultScreen, {
            inputValues: { ...inputValues, id },
            ...results
        });
    };

    const numericInputsArray = [
        {
            label: "Purchase Price",
            value: purchasePrice,
            onChangeText: setPurchasePrice,
            placeholder: "ex. 225,000",
            isRequired: true,
            type: "$",
            infoPress: () => handleInfoPress("Information about Purchase Price")
        },
        {
            label: "Interest Rate",
            value: interestRateInput.value,
            onChangeText: (value) => setInterestRateInput(prev => ({ ...prev, value })),
            placeholder: "ex. 5%",
            isRequired: true,
            type: "%"
        },
        {
            label: "Rehab Cost",
            value: rehabCost,
            onChangeText: setRehabCost,
            placeholder: "ex. $10,000",
            type: "$"
        },
        {
            label: "Gross Monthly Rent",
            value: monthRent,
            onChangeText: setMonthRent,
            placeholder: "ex. $1000",
            isRequired: true,
            type: "$"
        }
    ];

    const switchableInputsArray = [
        {
            label: "Down Payment",
            value: switchableInputs.downPayment.value,
            isDollar: switchableInputs.downPayment.isDollar,
            onChangeValue: (value) => handleSwitchableInputChange('downPayment', value),
            onToggleMode: (newIsDollar) => handleSwitchableInputToggle('downPayment', newIsDollar),
            placeholder: switchableInputs.downPayment.isDollar ? "ex. $45,000" : "ex. 20%",
            isRequired: true
        },
        {
            label: "Closing Cost",
            value: switchableInputs.closingCost.value,
            isDollar: switchableInputs.closingCost.isDollar,
            onChangeValue: (value) => handleSwitchableInputChange('closingCost', value),
            onToggleMode: (newIsDollar) => handleSwitchableInputToggle('closingCost', newIsDollar),
            placeholder: switchableInputs.closingCost.isDollar ? "ex. $5,000" : "ex. 2%"
        },
        {
            label: "Annual Property Tax",
            value: switchableInputs.propertyTax.value,
            isDollar: switchableInputs.propertyTax.isDollar,
            onChangeValue: (value) => handleSwitchableInputChange('propertyTax', value),
            onToggleMode: (newIsDollar) => handleSwitchableInputToggle('propertyTax', newIsDollar),
            placeholder: switchableInputs.propertyTax.isDollar ? "ex. $2,000" : "ex. 2%",
            isRequired: true
        },
        {
            label: "Annual CapEx Estimate",
            value: switchableInputs.capexEst.value,
            isDollar: switchableInputs.capexEst.isDollar,
            onChangeValue: (value) => handleSwitchableInputChange('capexEst', value),
            onToggleMode: (newIsDollar) => handleSwitchableInputToggle('capexEst', newIsDollar),
            placeholder: switchableInputs.capexEst.isDollar ? "ex. $3,000" : "ex. 5%"
        }
    ];

    const handleScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: false }
    );

    useEffect(() => {
        const titleHeight = 45;
        const listener = scrollY.addListener(({ value }) => {
            setShowHeaderTitle(value > titleHeight);
        });

        return () => {
            scrollY.removeListener(listener);
        };
    }, []);

    const handleOperatingExpensesChange = (expenses) => {
        setOperatingExpenses(expenses);
        // You can process the expenses here as needed for your calculations
    };

    const handleSaveNewExpensesChange = (value) => {
        setSaveNewExpenses(value);
    };

    return (
        <SafeAreaView style={styles.masterBackground}>
            <View style={styles.logoContainer}>
                <HomeButton />
                {showHeaderTitle && (
                    <Text style={styles.headerTitle}>Rental Calculator</Text>
                )}
            </View>
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyContainer}
            >
                <ScrollView
                    ref={scrollViewRef}
                    contentContainerStyle={styles.contentContainer}
                    keyboardShouldPersistTaps="handled"
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                >                
                    <Text style={styles.title}>Rental Calculator</Text>
                    <Text style={styles.secondaryTitle}>Loan Details</Text>
                    <NumericInput {...numericInputsArray[0]} />
                    <SwitchableNumericInput {...switchableInputsArray[0]}/>
                    <NumericInput {...numericInputsArray[1]} />
                    <Checkbox
                        label="Interest Only?"
                        value={interestRateInput.isInterestOnly}
                        onValueChange={(newValue) => setInterestRateInput(prev => ({ ...prev, isInterestOnly: newValue }))}
                    />
                    <SwitchableNumericInput {...switchableInputsArray[1]}/>
                    <LoanTerm
                        label="Loan Term"
                        value={loanTerm}
                        onValueChange={(itemValue) => setLoanTerm(itemValue)}
                        infoPress={() => handleInfoPress("Information about Loan Term")}
                    />
                    <Text style={styles.secondaryTitle}>Property Expenses</Text>
                    <SwitchableNumericInput {...switchableInputsArray[2]}/>
                    <NumericInput {...numericInputsArray[2]}/>
                    <NumericInput {...numericInputsArray[3]}/>
                    <SwitchableNumericInput {...switchableInputsArray[3]}/>
                    <OperatingExpenses
                        calculatorType="rental"
                        onActiveChange={setOperatingExpensesActive}
                        onExpensesChange={handleOperatingExpensesChange}
                        onSaveNewExpensesChange={handleSaveNewExpensesChange}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
            <View style={styles.menuContainer}>
                <CalcButton
                    title="Calculate"
                    onPress={onCalculatePress}
                    disabled={!isFormValid}
                />
            </View>
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
    keyContainer: {
        flex: 1,
    },
    contentContainer: {
        backgroundColor: colors.iconWhite,
    },
    menuContainer: {
        height: 56,
        backgroundColor: colors.iconWhite,
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 8,
    },
    title: {
        fontSize: 32,
        fontWeight: 500,
        color: colors.primaryBlack,
        marginBottom: 8,
        marginTop: 16,
        marginLeft: 16,
    },
    secondaryTitle: {
        fontSize: 18,
        fontWeight: 500,
        color: colors.primaryBlack,
        marginVertical: 16,
        marginLeft: 16,
    },
    headerTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.primaryBlack,
        position: 'absolute',
        left: 0,
        right: 0,
        textAlign: 'center',
    },
});

export default RentalCalcIn;