import React, { useState, useRef, useEffect } from 'react';
import { Platform, View, StyleSheet, SafeAreaView, StatusBar, ScrollView, KeyboardAvoidingView, Keyboard, Text, Animated, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';
import colors from '../../Colors/colors.Js';
import NumericInput from '../../Components/NumericInputBox.Js';
import CalcButton from '../../Components/CalcButton.Js';
const { rentalFunction } = require('../../../Calculations/RentalFunction.Js');
import SwitchableNumericInput from '../../Components/SwitchableNumericInput.Js';
import LoanTerm from '../../Components/LoanTerm.Js';
import Checkbox from '../../Components/InterestCheckbox.Js';
import TutorialOperatingExpense from '../../Components/TutorialOperatingExpense.Js';
import calculatorInfo from '../../../assets/text/info.json';
import { ChevronLeftIcon } from 'react-native-heroicons/solid';


function RentalCalcInTutor(props) {
    const navigation = useNavigation();
    const route = useRoute();
    const [purchasePrice, setPurchasePrice] = useState({
        value: '',
        isCashPurchase: false
    });
    const [rehabCost, setRehabCost] = useState('');
    const [loanTerm, setLoanTerm] = useState(30);
    const [monthRent, setMonthRent] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);
    const scrollViewRef = useRef();
    const [resultScreen, setResultScreen] = useState('RentalCalcOutTutor');
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [switchableInputs, setSwitchableInputs] = useState({
        downPayment: { value: '', isDollar: false },
        closingCost: { value: '', isDollar: false },
        propertyTax: { value: '', isDollar: false },
        capexEst: { value: '', isDollar: false }
    });
    const [showHeaderTitle, setShowHeaderTitle] = useState(false);
    const scrollY = useRef(new Animated.Value(0)).current;
    const [interestRateInput, setInterestRateInput] = useState({
        value: '',
        isInterestOnly: false
    });
    const [operatingExpensesActive, setOperatingExpensesActive] = useState(true);
    const [operatingExpenses, setOperatingExpenses] = useState([]);
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
    }, [purchasePrice, interestRateInput, monthRent, switchableInputs]);

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
                monthRent,
                capexEst,
                operatingExpenseArray,
                vacancyRate,
            } = route.params.inputValues;

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
            setMonthRent(monthRent?.toString() || '');
            setVacancyRate(vacancyRate?.toString() || '');

            setSwitchableInputs(prevInputs => ({
                ...prevInputs,
                downPayment: downPayment || { value: '', isDollar: false },
                closingCost: closingCost || { value: '', isDollar: false },
                propertyTax: propertyTax || { value: '', isDollar: false },
                capexEst: capexEst || { value: '', isDollar: false }
            }));

            if (operatingExpenseArray) {
                setOperatingExpensesActive(operatingExpenseArray.isActive);
                setOperatingExpenses(operatingExpenseArray.expenses);
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

    const onCalculatePress = () => {
        const toNumber = (value) => value === '' ? 0 : Number(value);

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
            capexEst: switchableInputs.capexEst,
            rehabCost: toNumber(rehabCost),
            monthRent: toNumber(monthRent),
            operatingExpenseArray: {
                isActive: operatingExpensesActive,
                expenses: operatingExpenses
            },
            vacancyRate: toNumber(vacancyRate) || '0'
        };

        const rentalResults = rentalFunction(
            inputValues.purchasePrice,
            inputValues.downPayment,
            inputValues.interestRate,
            inputValues.loanTerm,
            inputValues.propertyTax,
            inputValues.closingCost,
            inputValues.capexEst,
            inputValues.rehabCost,
            inputValues.monthRent,
            inputValues.vacancyRate,
            inputValues.operatingExpenseArray
        );

        const results = {
            mortgageCost: rentalResults[0],
            cashDown: rentalResults[1],
            DSCR: rentalResults[2],
            monthlyPropTax: rentalResults[3],
            monthlyCapEx: rentalResults[4],
            monthlyOpEx: rentalResults[5],
            cashflow: rentalResults[6],
            annualCashflow: rentalResults[7],
            cashOnCash: rentalResults[8],
            capRate: rentalResults[9],
            monthsTillEven: rentalResults[10],
        };
        
        // Navigate to the result screen
        navigation.navigate(resultScreen, {
            inputValues: inputValues,
            ...results
        });
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
            label: "Vacancy Rate",
            value: vacancyRate,
            onChangeText: setVacancyRate,
            placeholder: "ex. 5%",
            type: "%",
            infoTitle: calculatorInfo.calculator_input.vacancy_rate.title,
            infoDescription: calculatorInfo.calculator_input.vacancy_rate.description
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

    return (
        <SafeAreaView style={styles.masterBackground}>
            <View style={styles.logoContainer}>
                <TouchableOpacity 
                    style={styles.backButton} 
                    onPress={() => navigation.navigate('AltCalcHomeScreen')}
                >
                    <ChevronLeftIcon color={colors.primaryBlack} size={24} />
                </TouchableOpacity>
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
                    nestedScrollEnabled={true}
                >                
                    <Text style={styles.title}>Rental Calculator</Text>
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
                    <Text style={styles.secondaryTitle}>Property Expenses</Text>
                    <SwitchableNumericInput {...switchableInputsArray[2]}/>
                    <NumericInput {...numericInputsArray[2]}/>
                    <NumericInput {...numericInputsArray[3]}/>
                    <SwitchableNumericInput {...switchableInputsArray[3]}/>
                    <NumericInput {...numericInputsArray[4]}/>
                    <TutorialOperatingExpense
                        calculatorType="rental"
                        onActiveChange={setOperatingExpensesActive}
                        onExpensesChange={handleOperatingExpensesChange}
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
    backButton: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        zIndex: 1,
    },
});

export default RentalCalcInTutor;