import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, Platform, StatusBar, ScrollView, KeyboardAvoidingView, Keyboard, Text, Animated } from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';
import colors from '../../Colors/colors.Js';
import NumericInput from '../../Components/NumericInputBox.Js';
import CalcButton from '../../Components/CalcButton.Js';
import HomeButton from '../../Components/HomeButton.Js';
import SwitchableNumericInput from '../../Components/SwitchableNumericInput.Js';
import LoanTerm from '../../Components/LoanTerm.Js';
import { useDatabase } from '../../../../database/cashflowDatabase.Js';
import { expenses } from '../../../Calculations/ExpenseFunction.Js';
import { outputs } from '../../../Calculations/CoreOutputs.Js';
import Checkbox from '../../Components/InterestCheckbox.Js';
import OperatingExpenses from '../../Components/OperatingExpenses.Js';
import calculatorInfo from '../../../assets/text/info.json';
function FlipCalcIn(props) {
    const navigation = useNavigation();
    const route = useRoute();
    const [purchasePrice, setPurchasePrice] = useState({
        value: '',
        isCashPurchase: false
    });
    const [rehabCost, setRehabCost] = useState('');
    const [loanTerm, setLoanTerm] = useState(30);
    const [afterRev, setAfterRev] = useState('');
    const [rehabTime, setRehabTime] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);
    const scrollViewRef = useRef();
    const [resultScreen, setResultScreen] = useState('FlipCalcOut');
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [switchableInputs, setSwitchableInputs] = useState({
        downPayment: { value: '', isDollar: false },
        closingCost: { value: '', isDollar: false },
        propertyTax: { value: '', isDollar: false },
        agentCommish: { value: '', isDollar: false }
    });
    const [interestRateInput, setInterestRateInput] = useState({
        value: '',
        isInterestOnly: false
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
    }, [purchasePrice, interestRateInput, afterRev, switchableInputs]);

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
                afterRev,
                rehabTime,
                agentCommish,
                operatingExpenseArray
            } = route.params.inputValues;

            setCalculationId(id);
            setPurchasePrice({
                value: purchasePrice?.value?.toString() || '',
                isCashPurchase: purchasePrice?.isCashPurchase || false
            });
            setInterestRateInput({
                value: interestRate?.value?.toString() || '',
                isInterestOnly: interestRate?.isInterestOnly || false
            });
            setRehabCost(rehabCost?.toString() || '');
            setLoanTerm(loanTerm?.toString() || '30');
            setAfterRev(afterRev?.toString() || '');
            setRehabTime(rehabTime?.toString() || '');
       
            setSwitchableInputs(prevInputs => ({
                ...prevInputs,
                downPayment: downPayment || { value: '', isDollar: false },
                closingCost: closingCost || { value: '', isDollar: false },
                propertyTax: propertyTax || { value: '', isDollar: false },
                agentCommish: agentCommish || { value: '', isDollar: false }
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
            purchasePrice.value !== '' &&
            (purchasePrice.isCashPurchase || (
                switchableInputs.downPayment.value !== '' &&
                interestRateInput.value !== ''
            )) &&
            switchableInputs.propertyTax.value !== '' &&
            afterRev !== ''
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
                            ['flip']
                        );
                    }
                }
            } catch (error) {
                console.error('Error saving operating expenses:', error);
            }
        }
        
        const inputValues = {
            purchasePrice: purchasePrice,
            downPayment: {
                value: switchableInputs.downPayment.value || '0',
                isDollar: switchableInputs.downPayment.isDollar
            },
            interestRate: {
                value: interestRateInput.value || '0',
                isInterestOnly: interestRateInput.isInterestOnly
            },
            loanTerm: toNumber(loanTerm),
            propertyTax: switchableInputs.propertyTax,
            closingCost: switchableInputs.closingCost,
            rehabCost: toNumber(rehabCost),
            afterRev: toNumber(afterRev),
            rehabTime: toNumber(rehabTime),
            agentCommish: switchableInputs.agentCommish,
            capexEst: { value: '0', isDollar: false },
            monthRent: 0,
            operatingExpenseArray: {
                isActive: operatingExpensesActive,
                expenses: operatingExpenses,
                saveNewExpenses: saveNewExpenses
            }
        };

        const expenseResults = expenses(
            inputValues.purchasePrice,
            inputValues.downPayment,
            inputValues.interestRate,
            inputValues.loanTerm,
            inputValues.propertyTax,
            inputValues.capexEst,
            inputValues.rehabCost,
            inputValues.closingCost,
            inputValues.monthRent,
            inputValues.rehabTime,
            inputValues.operatingExpenseArray
        );

        const outputResults = outputs(
            inputValues.afterRev,
            inputValues.rehabTime,
            inputValues.agentCommish,
            inputValues.monthRent,
            inputValues.purchasePrice,
            expenseResults[2],
            expenseResults[1],
            '0',
            expenseResults[4]
        );

        const results = {
            mortgageCost: expenseResults[0],
            monthlyCost: expenseResults[1],
            cashDown: expenseResults[2],
            monthEx: expenseResults[3],
            DSCR: expenseResults[5],
            monthlyPropTax: expenseResults[6],
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
            const savedId = await saveCalculation('flip', inputValues, results, calculationId);
            
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
            label: "Purchase Price",
            value: purchasePrice.value,
            onChangeText: (value) => setPurchasePrice(prev => ({ ...prev, value })),
            placeholder: "ex. 225,000",
            isRequired: true,
            type: "$",
            infoTitle: calculatorInfo.calculator_input.purchase_price.title,
            infoDescription: calculatorInfo.calculator_input.purchase_price.description
        },
        {
            label: "Interest Rate",
            value: interestRateInput.value,
            onChangeText: (value) => setInterestRateInput(prev => ({ ...prev, value })),
            placeholder: "ex. 5%",
            isRequired: true,
            type: "%",
            infoTitle: calculatorInfo.calculator_input.interest_rate.title,
            infoDescription: calculatorInfo.calculator_input.interest_rate.description
        },
        {
            label: "Rehab Cost",
            value: rehabCost,
            onChangeText: setRehabCost,
            placeholder: "ex. $10,000",
            type: "$",
            infoTitle: calculatorInfo.calculator_input.rehab_cost.title,
            infoDescription: calculatorInfo.calculator_input.rehab_cost.description
        },
        {
            label: "After Repair Value",
            value: afterRev,
            onChangeText: setAfterRev,
            placeholder: "ex. $300,000",
            isRequired: true,
            type: "$",
            infoTitle: calculatorInfo.calculator_input.arv.title,
            infoDescription: calculatorInfo.calculator_input.arv.description
        },
        {
            label: "Rehab Time",
            value: rehabTime,
            onChangeText: setRehabTime,
            placeholder: "ex. 10 months",
            type: "Months",
            infoTitle: calculatorInfo.calculator_input.rehab_time.title,
            infoDescription: calculatorInfo.calculator_input.rehab_time.description
        },
    ];

    const switchableInputsArray = [
        {
            label: "Down Payment",
            value: switchableInputs.downPayment.value,
            isDollar: switchableInputs.downPayment.isDollar,
            onChangeValue: (value) => handleSwitchableInputChange('downPayment', value),
            onToggleMode: (newIsDollar) => handleSwitchableInputToggle('downPayment', newIsDollar),
            placeholder: switchableInputs.downPayment.isDollar ? "ex. $45,000" : "ex. 20%",
            isRequired: true,
            infoTitle: calculatorInfo.calculator_input.down_payment.title,
            infoDescription: calculatorInfo.calculator_input.down_payment.description
        },
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
            label: "Annual Property Tax",
            value: switchableInputs.propertyTax.value,
            isDollar: switchableInputs.propertyTax.isDollar,
            onChangeValue: (value) => handleSwitchableInputChange('propertyTax', value),
            onToggleMode: (newIsDollar) => handleSwitchableInputToggle('propertyTax', newIsDollar),
            placeholder: switchableInputs.propertyTax.isDollar ? "ex. $2,000" : "ex. 2%",
            isRequired: true,
            infoTitle: calculatorInfo.calculator_input.property_tax.title,
            infoDescription: calculatorInfo.calculator_input.property_tax.description
        },
        {
            label: "Agent Commission",
            value: switchableInputs.agentCommish.value,
            isDollar: switchableInputs.agentCommish.isDollar,
            onChangeValue: (value) => handleSwitchableInputChange('agentCommish', value),
            onToggleMode: (newIsDollar) => handleSwitchableInputToggle('agentCommish', newIsDollar),
            placeholder: switchableInputs.agentCommish.isDollar ? "ex. $5,000" : "ex. 6%",
            infoTitle: calculatorInfo.calculator_input.agent_commission.title,
            infoDescription: calculatorInfo.calculator_input.agent_commission.description
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
                    <Text style={styles.headerTitle}>Fix & Flip Calculator</Text>
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
                   <Text style={styles.title}>Fix & Flip Calculator</Text>
                   <Text style={styles.secondaryTitle}>Loan Details</Text>                    
                   <NumericInput {...numericInputsArray[0]} />
                   <Checkbox
                        label="Cash Purchase?"
                        value={purchasePrice.isCashPurchase}
                        onValueChange={(newValue) => {
                            setPurchasePrice(prev => ({ ...prev, isCashPurchase: newValue }));
                            if (newValue) {
                                setInterestRateInput(prev => ({ ...prev, value: '' }));
                                setSwitchableInputs(prev => ({
                                    ...prev,
                                    downPayment: { ...prev.downPayment, value: '' }
                                }));
                            }
                        }}
                    />
                    {!purchasePrice.isCashPurchase && (
                        <>
                            <SwitchableNumericInput {...switchableInputsArray[0]}/>
                            <NumericInput {...numericInputsArray[1]} />
                            <Checkbox
                                label="Interest Only?"
                                value={interestRateInput.isInterestOnly}
                                onValueChange={(newValue) => setInterestRateInput(prev => ({ ...prev, isInterestOnly: newValue }))}
                            />
                            <LoanTerm
                                label="Loan Term"
                                value={loanTerm}
                                onValueChange={(itemValue) => setLoanTerm(itemValue)}
                                infoTitle={calculatorInfo.calculator_input.loan_term.title}
                                infoDescription={calculatorInfo.calculator_input.loan_term.description}
                            />
                        </>
                    )}
                    <SwitchableNumericInput {...switchableInputsArray[1]}/>
                    <SwitchableNumericInput {...switchableInputsArray[2]}/>
                    <Text style={styles.secondaryTitle}>Rehab Details</Text>
                    <NumericInput {...numericInputsArray[2]} />
                    <NumericInput {...numericInputsArray[4]} />
                    <Text style={styles.secondaryTitle}>Sale Details</Text>
                    <NumericInput {...numericInputsArray[3]} />
                    <SwitchableNumericInput {...switchableInputsArray[3]} />
                    <OperatingExpenses
                        calculatorType="flip"
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
        paddingTop: 8,
        marginBottom: Platform.OS === "android" ? 16 : 0,
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

export default FlipCalcIn;