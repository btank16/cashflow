import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, Platform, StatusBar, ScrollView, KeyboardAvoidingView, Keyboard, Image } from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';
import colors from '../Colors/colors.Js';
import NavBar from '../Components/NavBar.Js';
import LoanInput from '../Components/LoanInputs.Js';
import NumericInput from '../Components/NumericInputBox.Js';
import ExpenseArray from '../Components/ExpenseArray.Js';
import CalcButton from '../Components/CalcButton.Js';
import { firstTranslation } from '../../FunctionCalls/RentalFlipCalls.Js';
import HomeButton from '../Components/HomeButton.Js';
import CommonStyles from '../Colors/CommonStyles.Js';
import CustomTitle from '../Components/CustomTitle.Js';

function RentalCalcIn(props) {
    const navigation = useNavigation();
    const route = useRoute();
    const [purchasePrice, setPurchasePrice] = useState('');
    const [downPayment, setDownPayment] = useState('');
    const [interestRate, setInterestRate] = useState('');
    const [closingCost, setClosingCost] = useState('');
    const [propertyTax, setPropertyTax] = useState('');
    const [rehabCost, setRehabCost] = useState('');
    const [loanTerm, setLoanTerm] = useState(30);
    const [monthRent, setMonthRent] = useState('');
    const [capexEst, setCapexEst] = useState('');
    const [expenseArray, setExpenseArray] = useState(['', '', '']);
    const [isFormValid, setIsFormValid] = useState(false);
    const scrollViewRef = useRef();
    const [resultScreen, setResultScreen] = useState('RentalCalcOut');
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

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
    }, [purchasePrice, downPayment, interestRate, propertyTax, monthRent]);

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
                expenseArray
            } = route.params.inputValues;

            setPurchasePrice(purchasePrice?.toString() || '');
            setDownPayment(downPayment?.toString() || '');
            setInterestRate(interestRate?.toString() || '');
            setClosingCost(closingCost?.toString() || '');
            setPropertyTax(propertyTax?.toString() || '');
            setRehabCost(rehabCost?.toString() || '');
            setLoanTerm(loanTerm?.toString() || '30');
            setMonthRent(monthRent?.toString() || '');
            setCapexEst(capexEst?.toString() || '');
            setExpenseArray(expenseArray || ['', '', '']);
        }
    }, [route.params?.inputValues]);

    const checkFormValidity = () => {
        setIsFormValid(
            purchasePrice !== '' &&
            downPayment !== '' &&
            interestRate !== '' &&
            propertyTax !== '' &&
            monthRent !== ''
        );
    };

    const handleExpenseDataChange = (costValues) => {
        setExpenseArray(costValues);
      };

      const onCalculatePress = () => {
        firstTranslation({
          purchasePrice,
          downPayment,
          interestRate,
          loanTerm,
          propertyTax,
          capexEst,
          expenseArray,
          rehabCost,
          closingCost,
          monthRent
        }, navigation, resultScreen);
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
                    <LoanInput
                        purchasePrice={purchasePrice}
                        setPurchasePrice={setPurchasePrice}
                        downPayment={downPayment}
                        setDownPayment={setDownPayment}
                        interestRate={interestRate}
                        setInterestRate={setInterestRate}
                        closingCost={closingCost}
                        setClosingCost={setClosingCost}
                        propertyTax={propertyTax}
                        setPropertyTax={setPropertyTax}
                        rehabCost={rehabCost}
                        setRehabCost={setRehabCost}
                        loanTerm={loanTerm}
                        setLoanTerm={setLoanTerm}
                        isRequired={true}
                    />
                    <View style={styles.inputContainer}>
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
                            <View style={{ flex: 1 }}>
                                <NumericInput
                                    label="CapEx Estimate (%):"
                                    value={capexEst}
                                    onChangeText={setCapexEst}
                                    placeholder="ex. 5% of Rent"
                                />
                            </View>
                        </View>
                    </View>
                    <View style={styles.inputContainer}>
                        <ExpenseArray onDataChange={handleExpenseDataChange}/>
                    </View>
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
    inputContainer: {
        alignItems: 'flex-start',
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