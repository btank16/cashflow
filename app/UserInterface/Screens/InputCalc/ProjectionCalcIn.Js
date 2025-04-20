import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, Platform, StatusBar, ScrollView, KeyboardAvoidingView, Keyboard, Text, Animated } from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';
import colors from '../../Colors/colors.Js';
import NumericInput from '../../Components/NumericInputBox.Js';
import LoanTerm from '../../Components/LoanTerm.Js';
import CalcButton from '../../Components/CalcButton.Js';
import HomeButton from '../../Components/HomeButton.Js';
import SwitchableNumericInput from '../../Components/SwitchableNumericInput.Js';
import { useDatabase } from '../../../../database/cashflowDatabase.Js';
import { PriceSuggestion } from '../../../Calculations/SuggestPrice.Js';
import OperatingExpenses from '../../Components/OperatingExpenses.Js';
import calculatorInfo from '../../../assets/text/info.json';
function ProjectionCalcIn(props) {
    const navigation = useNavigation();
    const route = useRoute();
    const [purchasePrice, setPurchasePrice] = useState('');
    const [monthCashflow, setMonthCashflow] = useState('');
    const [downPayment, setDownPayment] = useState('');
    const [interestRate, setInterestRate] = useState('');
    const [propertyTax, setPropertyTax] = useState('');
    const [monthRent, setMonthRent] = useState('');
    const [loanTerm, setLoanTerm] = useState(30);
    const [rehabCost, setRehabCost] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);
    const scrollViewRef = useRef();
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [resultScreen, setResultScreen] = useState('ProjectionCalcOut');
    const [switchableInputs, setSwitchableInputs] = useState({
        closingCost: { value: '', isDollar: false },
        capexEst: { value: '', isDollar: false }
    });
    const { saveCalculation, saveExpense } = useDatabase();
    const [calculationId, setCalculationId] = useState(null);
    const [showHeaderTitle, setShowHeaderTitle] = useState(false);
    const scrollY = useRef(new Animated.Value(0)).current;
    const [operatingExpensesActive, setOperatingExpensesActive] = useState(true);
    const [operatingExpenses, setOperatingExpenses] = useState([]);
    const [saveNewExpenses, setSaveNewExpenses] = useState(false);

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
                id,
                purchasePrice,
                monthCashflow,
                downPayment,
                interestRate,
                propertyTax,
                loanTerm,
                monthRent,
                closingCost,
                capexEst,
                rehabCost,
                operatingExpenseArray
            } = route.params.inputValues;

            setCalculationId(id);
            setPurchasePrice(purchasePrice?.toString() || '');
            setMonthCashflow(monthCashflow?.toString() || '');
            setDownPayment(downPayment?.toString() || '');
            setInterestRate(interestRate?.toString() || '');
            setPropertyTax(propertyTax?.toString() || '');
            setLoanTerm(loanTerm?.toString() || '30');
            setMonthRent(monthRent?.toString() || '');
            setRehabCost(rehabCost?.toString() || '');
           
            setSwitchableInputs(prevInputs => ({
                ...prevInputs,
                closingCost: closingCost || { value: '', isDollar: false },
                capexEst: capexEst || { value: '', isDollar: false }
            }));

            if (operatingExpenseArray) {
                setOperatingExpensesActive(operatingExpenseArray.isActive);
                setOperatingExpenses(operatingExpenseArray.expenses);
                setSaveNewExpenses(operatingExpenseArray.saveNewExpenses);
            }
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

    const onCalculatePress = async () => {
        const toNumber = (value) => value === '' ? 0 : Number(value);

        if (saveNewExpenses && operatingExpenses.length > 0) {
            try {
                for (const expense of operatingExpenses) {
                    if (expense.category && expense.cost) {
                        const formattedCategory = expense.category
                            .toLowerCase()
                            .split(' ')
                            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(' ');

                        await saveExpense(
                            formattedCategory,
                            expense.cost,
                            expense.frequency,
                            ['target']
                        );
                    }
                }
            } catch (error) {
                console.error('Error saving operating expenses:', error);
            }
        }

        const inputValues = {
            purchasePrice: toNumber(purchasePrice),
            monthCashflow: toNumber(monthCashflow),
            downPayment: toNumber(downPayment),
            interestRate: toNumber(interestRate),
            loanTerm: toNumber(loanTerm),
            propertyTax: toNumber(propertyTax),
            capexEst: switchableInputs.capexEst,
            monthRent: toNumber(monthRent),
            closingCost: switchableInputs.closingCost,
            rehabCost: toNumber(rehabCost),
            operatingExpenseArray: {
                isActive: operatingExpensesActive,
                expenses: operatingExpenses,
                saveNewExpenses: saveNewExpenses
            }
        };

        const cashflowResults = PriceSuggestion(
            inputValues.monthCashflow,
            inputValues.downPayment,
            inputValues.interestRate,
            inputValues.loanTerm,
            inputValues.propertyTax,
            inputValues.capexEst,
            inputValues.monthRent,
            inputValues.closingCost,
            inputValues.rehabCost,
            inputValues.operatingExpenseArray
        );

        const results = {
            TargetPrice: cashflowResults[0],
            NetZeroPrice: cashflowResults[1],
            netZeroCash: cashflowResults[2],
            targetPriceCash: cashflowResults[3],
            netZeroExp: cashflowResults[4],
            targetExp: cashflowResults[5],
            netZeroTax: cashflowResults[6],
            targetTax: cashflowResults[7],
            monthlyCapEx: cashflowResults[8],
            totalMonthlyExpenses: cashflowResults[9],
            MaxZeroMortgage: cashflowResults[10],
            MaxCashflowMortgage: cashflowResults[11],
        };

        try {
            const savedId = await saveCalculation('projection', inputValues, results, calculationId);
            
            navigation.navigate(resultScreen, {
                inputValues: {...inputValues, id: savedId},
                ...results
            });
        } catch (error) {
            console.error('Error saving calculation to database:', error);
        }
    };

    const numericInputsArray = [
        {
            label: "Listing Price",
            value: purchasePrice,
            onChangeText: setPurchasePrice,
            placeholder: "ex. 225,000",
            type: "$",
            infoTitle: calculatorInfo.calculator_input.listing_price.title,
            infoDescription: calculatorInfo.calculator_input.listing_price.description
        },
        {
            label: "Monthly Cashflow Target",
            value: monthCashflow,
            onChangeText: setMonthCashflow,
            placeholder: "ex. $1000",
            isRequired: true,
            type: "$",
            infoTitle: calculatorInfo.calculator_input.month_cashflow.title,
            infoDescription: calculatorInfo.calculator_input.month_cashflow.description
        },
        {
            label: "Down Payment",
            value: downPayment,
            onChangeText: setDownPayment,
            placeholder: "ex. 20%",
            isRequired: true,
            type: "%",
            infoTitle: calculatorInfo.calculator_input.down_payment.title,
            infoDescription: calculatorInfo.calculator_input.down_payment.description
        },
        {
            label: "Interest Rate",
            value: interestRate,
            onChangeText: setInterestRate,
            placeholder: "ex. 5%",
            isRequired: true,
            type: "%",
            infoTitle: calculatorInfo.calculator_input.interest_rate.title,
            infoDescription: calculatorInfo.calculator_input.interest_rate.description
        },
        {
            label: "Gross Monthly Rent",
            value: monthRent,
            onChangeText: setMonthRent,
            placeholder: "ex. $1000",
            isRequired: true,
            type: "$",
            infoTitle: calculatorInfo.calculator_input.monthly_rent.title,
            infoDescription: calculatorInfo.calculator_input.monthly_rent.description
        },
        {
            label: "Annual Property Tax",
            value: propertyTax,
            onChangeText: setPropertyTax,
            placeholder: "ex. 2%",
            isRequired: true,
            type: "%",
            infoTitle: calculatorInfo.calculator_input.property_tax.title,
            infoDescription: calculatorInfo.calculator_input.property_tax.description
        }
    ];

    const switchableInputsArray = [
        {
            label: "Closing Cost",
            value: switchableInputs.closingCost.value,
            isDollar: switchableInputs.closingCost.isDollar,
            onChangeValue: (value) => handleSwitchableInputChange('closingCost', value),
            onToggleMode: (newIsDollar) => handleSwitchableInputToggle('closingCost', newIsDollar),
            placeholder: switchableInputs.closingCost.isDollar ? "ex. $5,000" : "ex. 2%",
            infoTitle: calculatorInfo.calculator_input.closing_costs.title,
            infoDescription: calculatorInfo.calculator_input.closing_costs.description
        },
        {
            label: "Annual CapEx Estimate",
            value: switchableInputs.capexEst.value,
            isDollar: switchableInputs.capexEst.isDollar,
            onChangeValue: (value) => handleSwitchableInputChange('capexEst', value),
            onToggleMode: (newIsDollar) => handleSwitchableInputToggle('capexEst', newIsDollar),
            placeholder: switchableInputs.capexEst.isDollar ? "ex. $3,000" : "ex. 5%",
            infoTitle: calculatorInfo.calculator_input.capex.title,
            infoDescription: calculatorInfo.calculator_input.capex.description
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
    };

    const handleSaveNewExpensesChange = (value) => {
        setSaveNewExpenses(value);
    };

    return (
        <SafeAreaView style={styles.masterBackground}>
            <View style={styles.logoContainer}>
                <HomeButton/>
                {showHeaderTitle && (
                    <Text style={styles.headerTitle}>Price Target Calculator</Text>
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
                    nestedScrollEnabled={true}
                >                
                    <Text style={styles.title}>Price Target Calculator</Text>
                    <Text style={styles.secondaryTitle}>Loan Details</Text>
                    <NumericInput {...numericInputsArray[0]} />
                    <NumericInput {...numericInputsArray[2]} />
                    <NumericInput {...numericInputsArray[3]} />
                    <SwitchableNumericInput {...switchableInputsArray[0]}/>   
                    <NumericInput {...numericInputsArray[5]} />                       
                    <LoanTerm
                        label="Loan Term"
                        value={loanTerm}
                        onValueChange={(itemValue) => setLoanTerm(itemValue)}
                        infoTitle={calculatorInfo.calculator_input.loan_term.title}
                        infoDescription={calculatorInfo.calculator_input.loan_term.description}
                    />
                    <Text style={styles.secondaryTitle}>Rent Details</Text>
                    <NumericInput {...numericInputsArray[1]} />
                    <NumericInput {...numericInputsArray[4]} />
                    <SwitchableNumericInput {...switchableInputsArray[1]}/>
                    <OperatingExpenses
                        calculatorType="target"
                        onActiveChange={setOperatingExpensesActive}
                        onExpensesChange={handleOperatingExpensesChange}
                        onSaveNewExpensesChange={handleSaveNewExpensesChange}
                        initialExpenses={operatingExpenses}
                        infoTitle={calculatorInfo.calculator_input.operating_expenses.title}
                        infoDescription={calculatorInfo.calculator_input.operating_expenses.description}
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
        width: '100%',
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

export default ProjectionCalcIn;