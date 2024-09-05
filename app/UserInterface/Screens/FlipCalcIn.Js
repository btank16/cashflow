import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, Platform, StatusBar, ScrollView, KeyboardAvoidingView, Keyboard, Image } from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';
import colors from '../Colors/colors.Js';
import NavBar from '../Components/NavBar.Js';
import NumericInput from '../Components/NumericInputBox.Js';
import ExpenseArray from '../Components/ExpenseArray.Js';
import CalcButton from '../Components/CalcButton.Js';
import { firstTranslation } from '../../FunctionCalls/RentalFlipCalls.Js';
import HomeButton from '../Components/HomeButton.Js';
import CommonStyles from '../Colors/CommonStyles.Js';
import CustomTitle from '../Components/CustomTitle.Js';
import SwitchableNumericInput from '../Components/SwitchableNumericInput.Js';
import LoanTerm from '../Components/LoanTerm.Js';

function FlipCalcIn(props) {
    const navigation = useNavigation();
    const route = useRoute();
    const [purchasePrice, setPurchasePrice] = useState('');
    // const [downPayment, setDownPayment] = useState('');
    const [interestRate, setInterestRate] = useState('');
    // const [closingCost, setClosingCost] = useState('');
    // const [propertyTax, setPropertyTax] = useState('');
    const [rehabCost, setRehabCost] = useState('');
    const [loanTerm, setLoanTerm] = useState(30);
    const [afterRev, setAfterRev] = useState('');
    const [rehabTime, setRehabTime] = useState('');
    // const [agentCommish, setAgentCommish] = useState('');
    const [expenseArray, setExpenseArray] = useState(['', '', '']);
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
    }, [purchasePrice, interestRate, afterRev, switchableInputs]);

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
                expenseArray,
                afterRev,
                rehabTime,
                agentCommish
            } = route.params.inputValues;

            setPurchasePrice(purchasePrice?.toString() || '');
            // setDownPayment(downPayment?.toString() || '');
            setInterestRate(interestRate?.toString() || '');
            // setClosingCost(closingCost?.toString() || '');
            // setPropertyTax(propertyTax?.toString() || '');
            setRehabCost(rehabCost?.toString() || '');
            setLoanTerm(loanTerm?.toString() || '30');
            setExpenseArray(expenseArray || ['', '', '']);
            setAfterRev(afterRev?.toString() || '');
            setRehabTime(rehabTime?.toString() || '');
            // setAgentCommish(agentCommish?.toString() || '');
       
            setSwitchableInputs(prevInputs => ({
                ...prevInputs,
                downPayment: downPayment || { value: '', isDollar: false },
                closingCost: closingCost || { value: '', isDollar: false },
                propertyTax: propertyTax || { value: '', isDollar: false },
                agentCommish: agentCommish || { value: '', isDollar: false }
            }));
        }
    }, [route.params?.inputValues]);

    const checkFormValidity = () => {
        setIsFormValid(
            purchasePrice !== '' &&
            switchableInputs.downPayment.value !== '' &&
            interestRate !== '' &&
            switchableInputs.propertyTax.value !== '' &&
            afterRev !== ''
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

      const onCalculatePress = () => {
        firstTranslation({
          purchasePrice,
          downPayment: switchableInputs.downPayment,
          interestRate,
          loanTerm,
          propertyTax: switchableInputs.propertyTax,
          expenseArray,
          rehabCost,
          closingCost: switchableInputs.closingCost,
          afterRev,
          rehabTime,
          agentCommish: switchableInputs.agentCommish,
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
                    <CustomTitle title="Fix & Flip Calculator" />                           
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
                                label="After Repair Value ($):"
                                value={afterRev}
                                onChangeText={setAfterRev}
                                placeholder="ex. $300,000"
                                isRequired={true}
                            />
                        </View>
                    </View>
                    <View style={styles.rowCont}>
                        <View style={{ flex: 1 }}>
                            <NumericInput
                                label="Rehab Time (Months):"
                                value={rehabTime}
                                onChangeText={setRehabTime}
                                placeholder="ex. 10 months"
                            />
                        </View>
                    </View>
                    <View style={styles.rowCont}>
                        <View style={{ flex: 1 }}>
                            <SwitchableNumericInput
                                label="Agent Commission:"
                                value={switchableInputs.agentCommish.value}
                                isDollar={switchableInputs.agentCommish.isDollar}
                                onChangeValue={(value) => handleSwitchableInputChange('agentCommish', value)}
                                onToggleMode={() => handleSwitchableInputToggle('agentCommish')}
                                placeholder={switchableInputs.propertyTax.isDollar ? "ex. $5,000" : "ex. 6%"}
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
        alignItems: 'center',
        height: 56,
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

export default FlipCalcIn;