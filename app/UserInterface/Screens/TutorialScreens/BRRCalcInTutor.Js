import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, Platform, StatusBar, ScrollView, KeyboardAvoidingView, Keyboard, Text, Animated, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';
import colors from '../../Colors/colors.Js';
import NumericInput from '../../Components/NumericInputBox.Js';
import CalcButton from '../../Components/CalcButton.Js';
const { BRRRRFunction } = require('../../../Calculations/BRRRFunction.Js');
import LoanTerm from '../../Components/LoanTerm.Js';
import SwitchableNumericInput from '../../Components/SwitchableNumericInput.Js';
import Checkbox from '../../Components/InterestCheckbox.Js';
import TutorialOperatingExpense from '../../Components/TutorialOperatingExpense.Js';
import calculatorInfo from '../../../assets/text/info.json';
import { ChevronLeftIcon } from 'react-native-heroicons/solid';
import ItemizedRehabModal from '../../Components/ItemizedRehabModal.Js';

function BRRCalcInTutor(props) {
    const navigation = useNavigation();
    const route = useRoute();
    const [purchasePrice, setPurchasePrice] = useState({
        value: '',
        isCashPurchase: false
    });
    const [rehabCost, setRehabCost] = useState('');
    const [itemizedRehab, setItemizedRehab] = useState({
        isItemized: false,
        items: []
    });
    const [showItemizedModal, setShowItemizedModal] = useState(false);
    const [loanTerm, setLoanTerm] = useState(30);
    const [newloanTerm, setnewLoanTerm] = useState(30);
    const [BRRmonthRent, setBRRmonthRent] = useState('');
    const [afterRev, setAfterRev] = useState('');
    const [rehabTime, setRehabTime] = useState('');
    const [refinanceCost, setRefinanceCost] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);
    const scrollViewRef = useRef();
    const [resultScreen, setResultScreen] = useState('BRRCalcOutTutor');
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [switchableInputs, setSwitchableInputs] = useState({
        downPayment: { value: '', isDollar: false },
        closingCost: { value: '', isDollar: false },
        propertyTax: { value: '', isDollar: false },
        BRRcapexEst: { value: '', isDollar: false }
    });
    const [interestRateInput, setInterestRateInput] = useState({
        initialInterest: { value: '', isInterestOnly: false },
        newInterest: { value: '', isInterestOnly: false }
    });
    
    const [showHeaderTitle, setShowHeaderTitle] = useState(false);
    const scrollY = useRef(new Animated.Value(0)).current;
    const [operatingExpensesActive, setOperatingExpensesActive] = useState(true);
    const [operatingExpenses, setOperatingExpenses] = useState([]);
    const [vacancyRate, setVacancyRate] = useState();
    const [insuranceCost, setInsuranceCost] = useState();

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
                insuranceCost,
            } = route.params.inputValues;

            setPurchasePrice({
                value: purchasePrice?.value?.toString() || '',
                isCashPurchase: purchasePrice?.isCashPurchase || false
            });
            setVacancyRate(vacancyRate?.toString() || '');
            setInsuranceCost(insuranceCost?.toString() || '');
            setInterestRateInput(prevInputs => ({
                ...prevInputs,
                initialInterest : interestRate || { value: '', isInterestOnly: false },
                newInterest: newInterest || { value: '', isInterestOnly: false }
            }));
            
            // Handle rehab cost - check if it's itemized
            if (rehabCost && typeof rehabCost === 'object' && rehabCost.isItemized) {
                setItemizedRehab(rehabCost);
                const total = rehabCost.items.reduce((sum, item) => sum + (parseFloat(item.cost) || 0), 0);
                setRehabCost(total.toString());
            } else {
                setRehabCost(rehabCost?.toString() || '');
            }
            
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

    const onCalculatePress = () => {
        const toNumber = (value) => value === '' ? 0 : Number(value);

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
            rehabCost: itemizedRehab.isItemized ? itemizedRehab : toNumber(rehabCost),
            closingCost: switchableInputs.closingCost,
            BRRmonthRent: toNumber(BRRmonthRent),
            afterRev: toNumber(afterRev),
            rehabTime: toNumber(rehabTime),
            refinanceCost: toNumber(refinanceCost),
            newInterest: interestRateInput.newInterest,
            newloanTerm: toNumber(newloanTerm),
            operatingExpenseArray: {
                isActive: operatingExpensesActive,
                expenses: operatingExpenses
            },
            vacancyRate: toNumber(vacancyRate) || '0',
            insuranceCost: toNumber(insuranceCost) || '0'
        };

        const BRRRresults = BRRRRFunction(
            inputValues.purchasePrice,
            inputValues.downPayment,
            inputValues.interestRate,
            inputValues.loanTerm,
            inputValues.propertyTax,
            inputValues.closingCost,
            inputValues.BRRcapexEst,
            inputValues.rehabCost,
            inputValues.rehabTime,
            inputValues.refinanceCost,
            inputValues.newInterest,
            inputValues.newloanTerm,
            inputValues.afterRev,
            inputValues.BRRmonthRent,
            inputValues.vacancyRate,
            inputValues.insuranceCost,
            inputValues.operatingExpenseArray
        );

        const results = {
            mortgageCost: BRRRresults[0],
            cashDown: BRRRresults[6],
            monthlyPropTax: BRRRresults[1],
            monthlyOpEx: BRRRresults[2],
            BRRMortgageCost: BRRRresults[3],
            BRRCashflow: BRRRresults[7],
            BRRAnnualCashflow: BRRRresults[8],
            MaxEquity: BRRRresults[10],
            EquityReturnPerc: BRRRresults[11],
            BRRCapEx: BRRRresults[5],
            BRRPropTax: BRRRresults[4],
            CashOnCash: BRRRresults[9],
            monthlyInsuranceCost: BRRRresults[12]
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
            label: "Rehab Cost",
            value: rehabCost,
            onChangeText: (value) => {
                if (!itemizedRehab.isItemized) {
                    setRehabCost(value);
                }
            },
            placeholder: "ex. $10,000",
            type: "$",
            infoTitle: calculatorInfo.calculator_input.rehab_cost.title,
            infoDescription: calculatorInfo.calculator_input.rehab_cost.description,
            disabled: itemizedRehab.isItemized
        },
        {
            label: "Gross Monthly Rent",
            value: BRRmonthRent,
            onChangeText: setBRRmonthRent,
            placeholder: "ex. $1000",
            isRequired: true,
            type: "$",
            infoTitle: calculatorInfo.calculator_input.monthly_rent.title,
            infoDescription: calculatorInfo.calculator_input.monthly_rent.description
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
        {
            label: "Refinance Costs",
            value: refinanceCost,
            onChangeText: setRefinanceCost,
            placeholder: "ex. $1000",
            type: "$",
            infoTitle: calculatorInfo.calculator_input.refinance_cost.title,
            infoDescription: calculatorInfo.calculator_input.refinance_cost.description
        },
        {
            label: "Vacancy Rate",
            value: vacancyRate,
            onChangeText: setVacancyRate,
            placeholder: "ex. 5%",
            type: "%",
            infoTitle: calculatorInfo.calculator_input.vacancy_rate.title,
            infoDescription: calculatorInfo.calculator_input.vacancy_rate.description
        },
        {
            label: "Annual Insurance Cost",
            value: insuranceCost,
            onChangeText: setInsuranceCost,
            placeholder: "ex. $2000",
            type: "$",
            infoTitle: calculatorInfo.calculator_input.insurance_cost.title,
            infoDescription: calculatorInfo.calculator_input.insurance_cost.description
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
            value: switchableInputs.BRRcapexEst.value,
            isDollar: switchableInputs.BRRcapexEst.isDollar,
            onChangeValue: (value) => handleSwitchableInputChange('BRRcapexEst', value),
            onToggleMode: (newIsDollar) => handleSwitchableInputToggle('BRRcapexEst', newIsDollar),
            placeholder: switchableInputs.BRRcapexEst.isDollar ? "ex. $3,000" : "ex. 5%",
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

    const handleItemizeRehab = () => {
        setShowItemizedModal(true);
    };

    const handleSaveItemizedRehab = (items) => {
        if (items.length === 0) {
            // If no items, clear itemized mode
            setItemizedRehab({
                isItemized: false,
                items: []
            });
            setRehabCost('');
        } else {
            const total = items.reduce((sum, item) => sum + (parseFloat(item.cost) || 0), 0);
            setItemizedRehab({
                isItemized: true,
                items: items
            });
            setRehabCost(total.toString());
        }
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
                                infoTitle={calculatorInfo.calculator_input.interest_rate.title}
                                infoDescription={calculatorInfo.calculator_input.interest_rate.description}
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
                                infoTitle={calculatorInfo.calculator_input.loan_term.title}
                                infoDescription={calculatorInfo.calculator_input.loan_term.description}
                            />
                        </>
                    )}
                   <SwitchableNumericInput {...switchableInputsArray[1]} />
                   <SwitchableNumericInput {...switchableInputsArray[2]} />
                   <Text style={styles.secondaryTitle}>Rehab Details</Text>                    
                   <NumericInput {...numericInputsArray[1]} />
                   <TouchableOpacity 
                       onPress={handleItemizeRehab} 
                       style={styles.itemizeLink}
                       activeOpacity={0.7}
                   >
                       <Text style={styles.itemizeLinkText}>
                           {itemizedRehab.isItemized ? '✓ ' : '+ '}
                           Itemize Rehab
                       </Text>
                   </TouchableOpacity>
                   <NumericInput {...numericInputsArray[4]} />
                   <Text style={styles.secondaryTitle}>Rent Details</Text>
                   <NumericInput {...numericInputsArray[2]} />
                   <SwitchableNumericInput {...switchableInputsArray[3]} />
                   <NumericInput {...numericInputsArray[6]} />
                   <NumericInput {...numericInputsArray[7]} />
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
                        infoTitle={calculatorInfo.calculator_input.interest_rate.title}
                        infoDescription={calculatorInfo.calculator_input.interest_rate.description}
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
                        infoTitle={calculatorInfo.calculator_input.loan_term.title}
                        infoDescription={calculatorInfo.calculator_input.loan_term.description}
                    />
                    <TutorialOperatingExpense
                        calculatorType="brrrr"
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
                    captureEventName="brrr_calc_tutor_press"
                />
            </View>
            <ItemizedRehabModal
                visible={showItemizedModal}
                onClose={() => setShowItemizedModal(false)}
                onSave={handleSaveItemizedRehab}
                initialExpenses={itemizedRehab.items}
            />
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
    itemizeLink: {
        marginTop: -6,
        marginBottom: 16,
        marginLeft: 16,
        paddingVertical: 4,
        paddingHorizontal: 12,
        backgroundColor: colors.secondaryBrightGreen,
        borderRadius: 6,
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderColor: colors.primaryGreen,
    },
    itemizeLinkText: {
        color: colors.primaryGreen,
        fontSize: 14,
        fontWeight: '600',
        letterSpacing: 0.2,
    },
});

export default BRRCalcInTutor;
