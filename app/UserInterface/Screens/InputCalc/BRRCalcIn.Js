import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, Platform, StatusBar, ScrollView, KeyboardAvoidingView, Keyboard, Text, Animated } from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';
import colors from '../../Colors/colors.Js';
import NumericInput from '../../Components/NumericInputBox.Js';
import CalcButton from '../../Components/CalcButton.Js';
import { expenses } from '../../../Calculations/ExpenseFunction.Js';
import { BuyRefi } from '../../../Calculations/BRRROutput.Js';
import LoanTerm from '../../Components/LoanTerm.Js';
import HomeButton from '../../Components/HomeButton.Js';
import SwitchableNumericInput from '../../Components/SwitchableNumericInput.Js';
import { useDatabase } from '../../../../database/cashflowDatabase.Js';
import Checkbox from '../../Components/InterestCheckbox.Js';
import OperatingExpenses from '../../Components/OperatingExpenses.Js';

function BRRCalcIn(props) {
    const navigation = useNavigation();
    const route = useRoute();
    const [purchasePrice, setPurchasePrice] = useState({
        value: '',
        isCashPurchase: false
    });
    const [rehabCost, setRehabCost] = useState('');
    const [loanTerm, setLoanTerm] = useState(30);
    const [newloanTerm, setnewLoanTerm] = useState(30);
    const [BRRmonthRent, setBRRmonthRent] = useState('');
    const [afterRev, setAfterRev] = useState('');
    const [rehabTime, setRehabTime] = useState('');
    const [refinanceCost, setRefinanceCost] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);
    const scrollViewRef = useRef();
    const [resultScreen, setResultScreen] = useState('BRRCalcOut');
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [switchableInputs, setSwitchableInputs] = useState({
        downPayment: { value: '', isDollar: false },
        closingCost: { value: '', isDollar: false },
        propertyTax: { value: '', isDollar: false },
        BRRcapexEst: { value: '', isDollar: false }
    });
    const { saveCalculation, saveExpense } = useDatabase();
    const [interestRateInput, setInterestRateInput] = useState({
        initialInterest: { value: '', isInterestOnly: false },
        newInterest: { value: '', isInterestOnly: false }
    });
    
    const [calculationId, setCalculationId] = useState(null);
    const [showHeaderTitle, setShowHeaderTitle] = useState(false);
    const scrollY = useRef(new Animated.Value(0)).current;
    const [operatingExpensesActive, setOperatingExpensesActive] = useState(true);
    const [operatingExpenses, setOperatingExpenses] = useState([]);
    const [saveNewExpenses, setSaveNewExpenses] = useState(false);
    const [vacancyRate, setVacancyRate] = useState();

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
    }, [purchasePrice, interestRateInput, BRRmonthRent, afterRev, switchableInputs]);

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
                BRRcapexEst,
                afterRev,
                rehabTime,
                newloanTerm,
                BRRmonthRent,
                refinanceCost,
                newInterest,
                operatingExpenseArray,
                vacancyRate,
            } = route.params.inputValues;

            setCalculationId(id);
            setPurchasePrice({
                value: purchasePrice?.value?.toString() || '',
                isCashPurchase: purchasePrice?.isCashPurchase || false
            });
            setVacancyRate(vacancyRate?.toString() || '');
            setInterestRateInput(prevInputs => ({
                ...prevInputs,
                initialInterest : interestRate || { value: '', isInterestOnly: false },
                newInterest: newInterest || { value: '', isInterestOnly: false }
            }));
            setRehabCost(rehabCost?.toString() || '');
            setLoanTerm(loanTerm?.toString() || '30');
            setAfterRev(afterRev?.toString() || '');
            setRehabTime(rehabTime?.toString() || '');
            setnewLoanTerm(newloanTerm?.toString() || '30');
            setBRRmonthRent(BRRmonthRent?.toString() || '');
            setRefinanceCost(refinanceCost?.toString() || '');
            setSwitchableInputs(prevInputs => ({
                ...prevInputs,
                downPayment: downPayment || { value: '', isDollar: false },
                closingCost: closingCost || { value: '', isDollar: false },
                propertyTax: propertyTax || { value: '', isDollar: false },
                BRRcapexEst: BRRcapexEst || { value: '', isDollar: false }
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
                interestRateInput.initialInterest.value !== ''
            )) &&
            switchableInputs.propertyTax.value !== '' &&
            BRRmonthRent !== '' &&
            afterRev !== '' &&
            interestRateInput.newInterest.value !== ''
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

    const handleInfoPress = (infoText) => {
        console.log(infoText);
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
                            ['brrrr']
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
                value: interestRateInput.initialInterest.value || '0',
                isInterestOnly: interestRateInput.initialInterest.isInterestOnly
            },
            loanTerm: toNumber(loanTerm),
            propertyTax: switchableInputs.propertyTax,
            BRRcapexEst: switchableInputs.BRRcapexEst,
            rehabCost: toNumber(rehabCost),
            closingCost: switchableInputs.closingCost,
            BRRmonthRent: toNumber(BRRmonthRent),
            afterRev: toNumber(afterRev),
            rehabTime: toNumber(rehabTime),
            refinanceCost: toNumber(refinanceCost),
            newInterest: interestRateInput.newInterest,
            newloanTerm: toNumber(newloanTerm),
            operatingExpenseArray: {
                isActive: operatingExpensesActive,
                expenses: operatingExpenses,
                saveNewExpenses: saveNewExpenses
            },
            vacancyRate: toNumber(vacancyRate)
        };

        const initialExpenseResults = expenses(
            inputValues.purchasePrice,
            inputValues.downPayment,
            inputValues.interestRate,
            inputValues.loanTerm,
            inputValues.propertyTax,
            0,
            inputValues.BRRcapexEst,
            inputValues.rehabCost,
            inputValues.closingCost,
            0,
            inputValues.rehabTime,
            inputValues.operatingExpenseArray
        );

        const buyRefiResults = BuyRefi(
            inputValues.purchasePrice,
            inputValues.refinanceCost,
            inputValues.newInterest,
            inputValues.afterRev,
            inputValues.rehabTime,
            inputValues.BRRmonthRent,
            inputValues.BRRcapexEst,
            initialExpenseResults[2],
            initialExpenseResults[0],
            initialExpenseResults[1],
            initialExpenseResults[3],
            inputValues.newloanTerm,
            initialExpenseResults[4],
            inputValues.propertyTax,
            initialExpenseResults[8],
            inputValues.vacancyRate
        );

        const results = {
            mortgageCost: initialExpenseResults[0],
            monthlyCost: initialExpenseResults[1],
            cashDown: initialExpenseResults[2],
            monthEx: initialExpenseResults[3],
            monthlyPropTax: initialExpenseResults[6],
            monthlyCapEx: 0,
            monthlyOpEx: initialExpenseResults[8],
            BRRMortgageCost: buyRefiResults[0],
            BRRMonthlyCost: buyRefiResults[1],
            BRRCashflow: buyRefiResults[2],
            BRRAnnualCashflow: buyRefiResults[3],
            MaxEquity: buyRefiResults[4],
            EquityReturn: buyRefiResults[5],
            EquityReturnPerc: buyRefiResults[6],
            BRRCapEx: buyRefiResults[7],
            BRRPropTax: buyRefiResults[8],
            CashOnCash: buyRefiResults[9]
        };

        try {
            const savedId = await saveCalculation('brrr', inputValues, results, calculationId);
            
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
            infoPress: () => handleInfoPress("Information about Purchase Price")
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
            value: BRRmonthRent,
            onChangeText: setBRRmonthRent,
            placeholder: "ex. $1000",
            isRequired: true,
            type: "$"
        },
        {
            label: "After Repair Value",
            value: afterRev,
            onChangeText: setAfterRev,
            placeholder: "ex. $300,000",
            isRequired: true,
            type: "$"
        },
        {
            label: "Rehab Time",
            value: rehabTime,
            onChangeText: setRehabTime,
            placeholder: "ex. 10 months",
            type: "Months"
        },
        {
            label: "Refinance Costs",
            value: refinanceCost,
            onChangeText: setRefinanceCost,
            placeholder: "ex. $1000",
            type: "$"
        },
        {
            label: "Vacancy Rate",
            value: vacancyRate,
            onChangeText: setVacancyRate,
            placeholder: "ex. 5%",
            type: "%"
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
            value: switchableInputs.BRRcapexEst.value,
            isDollar: switchableInputs.BRRcapexEst.isDollar,
            onChangeValue: (value) => handleSwitchableInputChange('BRRcapexEst', value),
            onToggleMode: (newIsDollar) => handleSwitchableInputToggle('BRRcapexEst', newIsDollar),
            placeholder: switchableInputs.BRRcapexEst.isDollar ? "ex. $3,000" : "ex. 5%"
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
                    <Text style={styles.headerTitle}>BRRRR Calculator</Text>
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
                   <Text style={styles.title}>BRRRR Calculator</Text>
                   <Text style={styles.secondaryTitle}>Loan Details</Text>                    
                   <NumericInput {...numericInputsArray[0]} />
                   <Checkbox
                        label="Initial Cash Purchase?"
                        value={purchasePrice.isCashPurchase}
                        onValueChange={(newValue) => {
                            setPurchasePrice(prev => ({ ...prev, isCashPurchase: newValue }));
                            if (newValue) {
                                setInterestRateInput(prev => ({ ...prev, initialInterest: { ...prev.initialInterest, value: '' } }));
                                setSwitchableInputs(prev => ({
                                    ...prev,
                                    downPayment: { ...prev.downPayment, value: '' }
                                }));
                            }
                        }}
                    />
                    {!purchasePrice.isCashPurchase && (
                        <>
                            <SwitchableNumericInput {...switchableInputsArray[0]} />
                            <NumericInput 
                                label="Interest Rate"
                                value={interestRateInput.initialInterest.value}
                                onChangeText={(value) => setInterestRateInput(prev => ({ ...prev, initialInterest: { ...prev.initialInterest, value } }))}
                                placeholder="ex. 5%"
                                isRequired={true}
                                type="%"
                            />
                            <Checkbox
                                label="Interest Only?"
                                value={interestRateInput.initialInterest.isInterestOnly}
                                onValueChange={(newValue) => setInterestRateInput(prev => ({ ...prev, initialInterest: { ...prev.initialInterest, isInterestOnly: newValue } }))}
                            />
                            <LoanTerm
                                label="Loan Term"
                                value={loanTerm}
                                onValueChange={(itemValue) => setLoanTerm(itemValue)}
                            />
                        </>
                    )}
                   <SwitchableNumericInput {...switchableInputsArray[1]} />
                   <SwitchableNumericInput {...switchableInputsArray[2]} />
                   <Text style={styles.secondaryTitle}>Rehab Details</Text>                    
                   <NumericInput {...numericInputsArray[1]} />
                   <NumericInput {...numericInputsArray[4]} />
                   <Text style={styles.secondaryTitle}>Rent Details</Text>
                   <NumericInput {...numericInputsArray[2]} />
                   <SwitchableNumericInput {...switchableInputsArray[3]} />
                   <NumericInput {...numericInputsArray[6]} />
                   <Text style={styles.secondaryTitle}>Refinance Details</Text>
                   <NumericInput {...numericInputsArray[3]} />
                   <NumericInput {...numericInputsArray[5]} />
                   <NumericInput 
                        label="New Interest Rate"
                        value={interestRateInput.newInterest.value}
                        onChangeText={(value) => setInterestRateInput(prev => ({ ...prev, newInterest: { ...prev.newInterest, value } }))}
                        placeholder="ex. 5%"
                        isRequired={true}
                        type="%"
                   />
                   <Checkbox
                        label="Interest Only?"
                        value={interestRateInput.newInterest.isInterestOnly}
                        onValueChange={(newValue) => setInterestRateInput(prev => ({ ...prev, newInterest: { ...prev.newInterest, isInterestOnly: newValue } }))}
                    />
                   <LoanTerm
                        label="New Loan Term"
                        value={newloanTerm}
                        onValueChange={(itemValue) => setnewLoanTerm(itemValue)}
                    />
                    <OperatingExpenses
                        calculatorType="brrrr"
                        onActiveChange={setOperatingExpensesActive}
                        onExpensesChange={handleOperatingExpensesChange}
                        onSaveNewExpensesChange={handleSaveNewExpensesChange}
                        initialExpenses={operatingExpenses}
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

export default BRRCalcIn;
