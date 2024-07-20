// Common Loan inputs organized for other screens
//Including Purchase Price, Down Payment Percent, Loan Term, Closing Cost, Property Tax

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import NumericInput from './NumericInputBox.Js';
import LoanTerm from './LoanTerm.Js';

const LoanInput = () => {
  const [purchasePrice, setPurchasePrice] = useState('');
  const [downPayment, setDownPayment] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [closingCost, setClosingCost] = useState('');
  const [loanTerm, setLoanTerm] = useState(30);

  return (
    <View style={styles.container}> 
        <View style={styles.rowCont}>
            <View style={{ flex: 2 }}>
                <NumericInput
                    label="Purchase Price ($):"
                    value={purchasePrice}
                    onChangeText={setPurchasePrice}
                    placeholder="Enter purchase price"
                />
            </View>
            <View style={{ flex: 1 }}>
                <NumericInput
                    label="Down Payment (%):"
                    value={downPayment}
                    onChangeText={setDownPayment}
                    placeholder="ex. 20%"
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
                    label="Loan Term (years):"
                    value={loanTerm}
                    onValueChange={(itemValue) => setLoanTerm(itemValue)}
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
    marginBottom: 10,
  }
});

export default LoanInput;