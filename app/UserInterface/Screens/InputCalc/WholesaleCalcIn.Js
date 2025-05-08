import React, { useState, useRef, useEffect } from 'react';
import { Platform, View, StyleSheet, SafeAreaView, StatusBar, ScrollView, KeyboardAvoidingView, Keyboard, Text, Animated } from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';
import colors from '../../Colors/colors.Js';
import NumericInput from '../../Components/NumericInputBox.Js';
import CalcButton from '../../Components/CalcButton.Js';
import HomeButton from '../../Components/HomeButton.Js';
import { useDatabase } from '../../../../database/cashflowDatabase.Js';
import { wholesalefunction } from '../../../Calculations/WholesalingFunction.Js';
import OperatingExpenses from '../../Components/OperatingExpenses.Js';
import calculatorInfo from '../../../assets/text/info.json';
import { createCalculation, updateCalculation } from '../../Utils/AmplifyDataUtils.Js';

function WholesaleCalcIn(props) {
    const navigation = useNavigation();
    const route = useRoute();
    const [purchasePrice, setPurchasePrice] = useState('');
    const [rehabCost, setRehabCost] = useState('');
    const [afterRev, setAfterRev] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);
    const scrollViewRef = useRef();
    const [resultScreen, setResultScreen] = useState('WholesaleCalcOut');
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const { saveCalculation, saveExpense } = useDatabase();
    const [calculationId, setCalculationId] = useState(null);
    const [showHeaderTitle, setShowHeaderTitle] = useState(false);
    const scrollY = useRef(new Animated.Value(0)).current;
    const [operatingExpensesActive, setOperatingExpensesActive] = useState(true);
    const [operatingExpenses, setOperatingExpenses] = useState([]);
    const [saveNewExpenses, setSaveNewExpenses] = useState(false);
    const [monthsHeld, setMonthsHeld] = useState('');

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
    }, [purchasePrice, rehabCost, afterRev]);

    useEffect(() => {
        if (route.params?.inputValues) {
            const {
                id,
                purchasePrice,
                afterRev,
                rehabCost,
                monthsHeld,
                operatingExpenseArray
            } = route.params.inputValues;

            setPurchasePrice(purchasePrice?.toString() || '');
            setAfterRev(afterRev?.toString() || '');
            setRehabCost(rehabCost?.toString() || '');
            setMonthsHeld(monthsHeld?.toString() || '');
            setCalculationId(id);

            if (operatingExpenseArray) {
                setOperatingExpensesActive(operatingExpenseArray.isActive);
                setOperatingExpenses(operatingExpenseArray.expenses);
                setSaveNewExpenses(operatingExpenseArray.saveNewExpenses);
            }
        }
    }, [route.params?.inputValues]);

    const checkFormValidity = () => {
        setIsFormValid(
            purchasePrice !== '' &&
            rehabCost !== '' &&
            afterRev !== ''
        );
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
                            ['wholesale']
                        );
                    }
                }
            } catch (error) {
                console.error('Error saving operating expenses:', error);
            }
        }

        const inputValues = {
            purchasePrice: toNumber(purchasePrice),
            rehabCost: toNumber(rehabCost),
            afterRev: toNumber(afterRev),
            monthsHeld: toNumber(monthsHeld),
            operatingExpenseArray: {
                isActive: operatingExpensesActive,
                expenses: operatingExpenses,
                saveNewExpenses: saveNewExpenses
            }
        };

        // Call wholesalefunction directly
        const wholesaleResults = wholesalefunction(
            inputValues.purchasePrice,
            inputValues.rehabCost,
            inputValues.afterRev,
            inputValues.monthsHeld,
            inputValues.operatingExpenseArray
        );

        const results = {
            maximumAllowableOffer: wholesaleResults[0],
            totalExpenses: wholesaleResults[1],
            fee5Perc: wholesaleResults[2],
            fee15Perc: wholesaleResults[3],
            sale5Perc: wholesaleResults[4],
            sale15Perc: wholesaleResults[5],
        };

        try {
            let savedData;
            
            if (calculationId) {
                // Update existing calculation
                savedData = await updateCalculation(
                    calculationId,
                    'wholesale',
                    inputValues,
                    results
                );
            } else {
                // Create new calculation
                savedData = await createCalculation(
                    'wholesale',
                    inputValues,
                    results
                );
            }
            
            let savedId = calculationId;
            if (savedData && savedData.id) {
                savedId = savedData.id;
            }
            
            // Navigate to the result screen
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
            label: "Contract Price",
            value: purchasePrice,
            onChangeText: setPurchasePrice,
            placeholder: "ex. 225,000",
            isRequired: true,
            type: "$",
            infoTitle: calculatorInfo.calculator_input.contract_price.title,
            infoDescription: calculatorInfo.calculator_input.contract_price.description
        },
        {
            label: "Estimated Rehab Cost",
            value: rehabCost,
            onChangeText: setRehabCost,
            placeholder: "ex. $10,000",
            isRequired: true,
            type: "$",
            infoTitle: calculatorInfo.calculator_input.rehab_cost.title,
            infoDescription: calculatorInfo.calculator_input.rehab_cost.description
        },
        {
            label: "After Repair Value",
            value: afterRev,
            onChangeText: setAfterRev,
            placeholder: "ex. $250,000",
            isRequired: true,
            type: "$",
            infoTitle: calculatorInfo.calculator_input.arv.title,
            infoDescription: calculatorInfo.calculator_input.arv.description
        },
        {
            label: "Months Held",
            value: monthsHeld,
            onChangeText: setMonthsHeld,
            placeholder: "ex. 2 months",
            type: "Months",
            infoTitle: calculatorInfo.calculator_input.months_held.title,
            infoDescription: calculatorInfo.calculator_input.months_held.description
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
                    <Text style={styles.headerTitle}>Wholesaling Calculator</Text>
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
                    <Text style={styles.title}>Wholesaling Calculator</Text>
                    <NumericInput {...numericInputsArray[0]} />
                    <NumericInput {...numericInputsArray[1]} />
                    <NumericInput {...numericInputsArray[2]} />
                    <NumericInput {...numericInputsArray[3]} />
                    <OperatingExpenses
                        calculatorType="wholesale"
                        onActiveChange={setOperatingExpensesActive}
                        onExpensesChange={handleOperatingExpensesChange}
                        onSaveNewExpensesChange={handleSaveNewExpensesChange}
                        initialExpenses={operatingExpenses}
                        sectionTitle="Additional Expenses"
                        viewAllButtonText="View all Saved Expenses"
                        infoTitle={calculatorInfo.calculator_input.additional_expenses.title}
                        infoDescription={calculatorInfo.calculator_input.additional_expenses.description}
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

export default WholesaleCalcIn;