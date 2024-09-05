import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, Platform, StatusBar, ScrollView, KeyboardAvoidingView, Keyboard, Image } from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';
import colors from '../Colors/colors.Js';
import NavBar from '../Components/NavBar.Js';
import NumericInput from '../Components/NumericInputBox.Js';
import ExpenseArray from '../Components/ExpenseArray.Js';
import CalcButton from '../Components/CalcButton.Js';
import HomeButton from '../Components/HomeButton.Js';
import CommonStyles from '../Colors/CommonStyles.Js';
import CustomTitle from '../Components/CustomTitle.Js';
import { fourthTranslation } from '../../FunctionCalls/WholesaleCalls.Js';

function WholesaleCalcIn(props) {
    const navigation = useNavigation();
    const route = useRoute();
    const [purchasePrice, setPurchasePrice] = useState('');
    const [rehabCost, setRehabCost] = useState('');
    const [afterRev, setAfterRev] = useState('');
    const [expenseArray, setExpenseArray] = useState(['', '', '']);
    const [isFormValid, setIsFormValid] = useState(false);
    const scrollViewRef = useRef();
    const [resultScreen, setResultScreen] = useState('WholesaleCalcOut');
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
    }, [purchasePrice, rehabCost, afterRev]);

    useEffect(() => {
        if (route.params?.inputValues) {
            const {
                purchasePrice,
                afterRev,
                rehabCost,
                expenseArray,
            } = route.params.inputValues;

            setPurchasePrice(purchasePrice?.toString() || '');
            setAfterRev(afterRev?.toString() || '');
            setRehabCost(rehabCost?.toString() || '');
            setExpenseArray(expenseArray || ['', '', '']);
        }
    }, [route.params?.inputValues]);

    const checkFormValidity = () => {
        setIsFormValid(
            purchasePrice !== '' &&
            rehabCost !== '' &&
            afterRev !== ''
        );
    };

    const handleExpenseDataChange = (costValues) => {
        setExpenseArray(costValues);
    };


    const onCalculatePress = () => {
        fourthTranslation({
            purchasePrice,
            expenseArray,
            rehabCost,
            afterRev
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
                    <CustomTitle title="Wholesaling Calculator" />                           
                    <View style={styles.rowCont}>
                        <View style={{ flex: 2 }}>
                            <NumericInput
                                label="Contract Price ($):"
                                value={purchasePrice}
                                onChangeText={setPurchasePrice}
                                placeholder="ex. $150,000"
                                isRequired={true}
                            />
                        </View>
                    </View>  
                    <View style={styles.rowCont}>
                        <View style={{ flex: 1 }}>
                            <NumericInput
                                label="Estimated Rehab Cost ($):"
                                value={rehabCost}
                                onChangeText={setRehabCost}
                                placeholder="ex. $5,000"
                                isRequired={true}
                            />
                        </View>
                    </View> 
                    <View style={styles.rowCont}>
                        <View style={{ flex: 2 }}>
                            <NumericInput
                                label="After Repair Value ($):"
                                value={afterRev}
                                onChangeText={setAfterRev}
                                placeholder="ex. $250,000"
                                isRequired={true}
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
        height: 56,
        alignItems: 'center',
        backgroundColor: colors.background,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.1)',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 5,
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
        borderTopColor: 'rgba(0, 0, 0, 0.1)',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 5,
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

export default WholesaleCalcIn;