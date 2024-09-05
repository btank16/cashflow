// Common Loan inputs organized for other screens
//Including Purchase Price, Down Payment Percent, Loan Term, Closing Cost, Property Tax

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import NumericInput from './NumericInputBox.Js';
import LoanTerm from './LoanTerm.Js';

const LoanInput = ({
    purchasePrice, setPurchasePrice, 
    downPayment, setDownPayment, 
    interestRate, setInterestRate, 
    propertyTax, setPropertyTax, 
    closingCost, setClosingCost,
    rehabCost, setRehabCost,
    loanTerm, setLoanTerm,
    isRequired
}) => {

  return (
    <View style={styles.container}> 
        <View style={styles.rowCont}>
            <View style={{ flex: 2 }}>
                <NumericInput
                    label="Purchase Price ($):"
                    value={purchasePrice}
                    onChangeText={setPurchasePrice}
                    placeholder="ex. $225,000"
                    isRequired={isRequired}
                />
            </View>
            <View style={{ flex: 1 }}>
                <NumericInput
                    label="Down Payment (%):"
                    value={downPayment}
                    onChangeText={setDownPayment}
                    placeholder="ex. 20%"
                    isRequired={isRequired}
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
                    isRequired={isRequired}
                />
            </View>
            <View style={{ flex: 1 }}>
                <NumericInput
                    label="Closing Cost (%):"
                    value={closingCost}
                    onChangeText={setClosingCost}
                    placeholder="ex. 1%"
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
                <NumericInput
                    label="Property Tax (%):"
                    value={propertyTax}
                    onChangeText={setPropertyTax}
                    placeholder="ex. 2.5%"
                    isRequired={isRequired}
                />
            </View>
            <View style={{ flex: 2 }}>
                <NumericInput
                    label="Rehab Cost ($):"
                    value={rehabCost}
                    onChangeText={setRehabCost}
                    placeholder="ex. $10,000"
                />
            </View>
        </View>      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  rowCont: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'flex-end',
  }
});

export default LoanInput;