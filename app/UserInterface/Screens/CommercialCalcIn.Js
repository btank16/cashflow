import React, { useState, useRef, useEffect } from 'react';
import { Platform, View, StyleSheet, SafeAreaView, StatusBar, ScrollView, KeyboardAvoidingView, Keyboard, Text, Animated } from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';
import colors from '../Colors/colors.Js';
import NumericInput from '../Components/NumericInputBox.Js';
import ExpenseArray from '../Components/ExpenseArray.Js';
import CalcButton from '../Components/CalcButton.Js';
import HomeButton from '../Components/HomeButton.Js';
import SwitchableNumericInput from '../Components/SwitchableNumericInput.Js';
import LoanTerm from '../Components/LoanTerm.Js';
import { useDatabase } from '../../../database/cashflowDatabase.Js';
import Checkbox from '../Components/InterestCheckbox.Js';
import { CommercialCalc } from '../../Calculations/CommercialCalc.Js';

function CommercialCalcIn(props) {
    const navigation = useNavigation();
    const route = useRoute();
    const [purchasePrice, setPurchasePrice] = useState('');
    const [loanTerm, setLoanTerm] = useState(30);
    const [expenseArray, setExpenseArray] = useState(['', '', '']);
    const [isFormValid, setIsFormValid] = useState(false);
    const scrollViewRef = useRef();
    const [resultScreen, setResultScreen] = useState('CommercialCalcOut');
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [switchableInputs, setSwitchableInputs] = useState({
        downPayment: { value: '', isDollar: false },
        acquisitionCosts: { value: '', isDollar: false },
        closingCost: { value: '', isDollar: false },
        propertyTax: { value: '', isDollar: false },
        capexEst: { value: '', isDollar: false },
        vacancyLoss: { value: '', isDollar: false }
    });
    const { saveCalculation } = useDatabase();
    const [calculationId, setCalculationId] = useState(null);
    const [showHeaderTitle, setShowHeaderTitle] = useState(false);
    const scrollY = useRef(new Animated.Value(0)).current;
    const [interestRateInput, setInterestRateInput] = useState({
        value: '',
        isInterestOnly: false
    });
    const [grossFees, setGrossFees] = useState('');
    const [capitalReserve, setCapitalReserve] = useState('');
    const [grossRent, setGrossRent] = useState('');

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
    }, [purchasePrice, interestRateInput, grossRent, switchableInputs]);

    useEffect(() => {
        if (route.params?.inputValues) {
            const {
                id,
                purchasePrice,
                downPayment,
                capitalReserve,
                acquisitionCosts,
                interestRate,
                closingCost,
                loanTerm,
                grossRent,
                rentFees,
                vacancy,
                capEx,
                propertyTax,
                expenseArray,
            } = route.params.inputValues;

            setCalculationId(id);
            setPurchasePrice(purchasePrice?.toString() || '');
            setInterestRateInput({
                value: interestRate?.value?.toString() || '',
                isInterestOnly: interestRate?.isInterestOnly || false
            });
            setLoanTerm(loanTerm?.toString() || 30);
            setGrossRent(grossRent?.toString() || '');
            setGrossFees(rentFees?.toString() || '');
            setCapitalReserve(capitalReserve?.toString() || '');
            setExpenseArray(expenseArray || ['', '', '']);
            
            setSwitchableInputs(prevInputs => ({
                ...prevInputs,
                downPayment: downPayment || { value: '', isDollar: false },
                acquisitionCosts: acquisitionCosts || { value: '', isDollar: false },
                closingCost: closingCost || { value: '', isDollar: false },
                propertyTax: propertyTax || { value: '', isDollar: false },
                capexEst: capEx || { value: '', isDollar: false },
                vacancyLoss: vacancy || { value: '', isDollar: false }
            }));
        }
    }, [route.params?.inputValues]);

    const checkFormValidity = () => {
        setIsFormValid(
            purchasePrice !== '' &&
            switchableInputs.downPayment.value !== '' &&
            interestRateInput.value !== '' &&
            switchableInputs.propertyTax.value !== '' &&
            grossRent !== ''
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
            capitalReserve: toNumber(capitalReserve),
            acquisitionCosts: switchableInputs.acquisitionCosts,
            interestRate: interestRateInput,
            closingCost: switchableInputs.closingCost,
            loanTerm: toNumber(loanTerm),
            grossRent: toNumber(grossRent),
            rentFees: toNumber(grossFees),
            vacancy: switchableInputs.vacancyLoss,
            capEx: switchableInputs.capexEst,
            propertyTax: switchableInputs.propertyTax,
            expenseArray: expenseArray.map(toNumber),
        };

        const id = calculationId || uid();

        try {
            const funcResults = CommercialCalc(
                toNumber(purchasePrice),
                switchableInputs.downPayment,
                switchableInputs.acquisitionCosts,
                interestRateInput,
                switchableInputs.closingCost,
                toNumber(loanTerm),
                toNumber(grossRent),
                toNumber(grossFees),
                switchableInputs.vacancyLoss,
                switchableInputs.capexEst,
                switchableInputs.propertyTax,
                expenseArray.map(toNumber)
            );

            const results = {
                mortgageCost: funcResults[0],
                monthlyCost: funcResults[1],
                totalAcquisitionCosts: funcResults[2],
                monthEx: funcResults[3],
                DSCR: funcResults[4],
                monthlyPropTax: funcResults[5],
                monthlyCapEx: funcResults[6],
                monthlyOpEx: funcResults[7],
                monthlyVacancy: funcResults[8],
                cashOnCash: funcResults[9],
                capRate: funcResults[10],
                monthsTillEven: funcResults[11],
                annualCashflow: funcResults[12]
            };

        try {
            await saveCalculation('commercial', inputValues, results, id);
        } catch (error) {
            console.error('Error saving calculation to database:', error);
        }

            navigation.navigate(resultScreen, {
                inputValues: { ...inputValues, id },
                ...results
            });
        } catch (error) {
            console.error('Error in calculation:', error);
        }
    };

    const numericInputsArray = [
        {
            label: "Purchase Price",
            value: purchasePrice,
            onChangeText: setPurchasePrice,
            placeholder: "ex. 1,250,000",
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
            label: "Capital Reserve",
            value: capitalReserve,
            onChangeText: setCapitalReserve,
            placeholder: "ex. $100,000",
            type: "$"
        },
        {
            label: "Gross Potential Rent",
            value: grossRent,
            onChangeText: setGrossRent,
            placeholder: "ex. $12,500",
            isRequired: true,
            type: "$"
        },
        {
            label: "Gross Fees and Other Income",
            value: grossFees,
            onChangeText: setGrossFees,
            placeholder: "ex. $5,000",
            type: "$"
        },
    ];

    const switchableInputsArray = [
        {
            label: "Down Payment",
            value: switchableInputs.downPayment.value,
            isDollar: switchableInputs.downPayment.isDollar,
            onChangeValue: (value) => handleSwitchableInputChange('downPayment', value),
            onToggleMode: (newIsDollar) => handleSwitchableInputToggle('downPayment', newIsDollar),
            placeholder: switchableInputs.downPayment.isDollar ? "ex. $250,000" : "ex. 20%",
            isRequired: true
        },
        {
            label: "Additional Acquisition Costs",
            value: switchableInputs.acquisitionCosts.value,
            isDollar: switchableInputs.acquisitionCosts.isDollar,
            onChangeValue: (value) => handleSwitchableInputChange('acquisitionCosts', value),
            onToggleMode: (newIsDollar) => handleSwitchableInputToggle('acquisitionCosts', newIsDollar),
            placeholder: switchableInputs.acquisitionCosts.isDollar ? "ex. $100,000" : "ex. 10%",
        },
        {
            label: "Closing Cost",
            value: switchableInputs.closingCost.value,
            isDollar: switchableInputs.closingCost.isDollar,
            onChangeValue: (value) => handleSwitchableInputChange('closingCost', value),
            onToggleMode: (newIsDollar) => handleSwitchableInputToggle('closingCost', newIsDollar),
            placeholder: switchableInputs.closingCost.isDollar ? "ex. $25,000" : "ex. 2%"
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
        },
        {
            label: "Annual Vacancy Loss",
            value: switchableInputs.vacancyLoss.value,
            isDollar: switchableInputs.vacancyLoss.isDollar,
            onChangeValue: (value) => handleSwitchableInputChange('vacancyLoss', value),
            onToggleMode: (newIsDollar) => handleSwitchableInputToggle('vacancyLoss', newIsDollar),
            placeholder: switchableInputs.vacancyLoss.isDollar ? "ex. $3,000" : "ex. 5%"
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
                    <Text style={styles.title}>Commercial Multi-Family Calculator</Text>
                    <Text style={styles.secondaryTitle}>Acquisition Details</Text>
                    <NumericInput {...numericInputsArray[0]} />
                    <SwitchableNumericInput {...switchableInputsArray[0]} />
                    <NumericInput {...numericInputsArray[2]} />
                    <SwitchableNumericInput {...switchableInputsArray[1]} />

                    <Text style={styles.secondaryTitle}>Loan Details</Text>
                    <NumericInput {...numericInputsArray[1]} />
                    <Checkbox
                        label="Interest Only?"
                        value={interestRateInput.isInterestOnly}
                        onValueChange={(newValue) => setInterestRateInput(prev => ({ ...prev, isInterestOnly: newValue }))}
                    />
                    <SwitchableNumericInput {...switchableInputsArray[2]} />
                    <LoanTerm
                        label="Loan Term"
                        value={loanTerm}
                        onValueChange={(itemValue) => setLoanTerm(itemValue)}
                    />

                    <Text style={styles.secondaryTitle}>Annual Rent Details</Text>
                    <NumericInput {...numericInputsArray[3]} />
                    <NumericInput {...numericInputsArray[4]} />

                    <Text style={styles.secondaryTitle}>Property Expenses</Text>
                    <SwitchableNumericInput {...switchableInputsArray[3]} />
                    <SwitchableNumericInput {...switchableInputsArray[4]} />
                    <SwitchableNumericInput {...switchableInputsArray[5]} />
                    
                    <ExpenseArray onDataChange={handleExpenseDataChange} />
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

export default CommercialCalcIn;