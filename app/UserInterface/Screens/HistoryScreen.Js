import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDatabase } from '../../../database/cashflowDatabase.Js';
import colors from '../Colors/colors.Js';
import CommonStyles from '../Colors/CommonStyles.Js';
import CustomTitle from '../Components/CustomTitle.Js';

function HistoryScreen() {
  const [calculations, setCalculations] = useState([]);
  const { getAllCalculations } = useDatabase();
  const navigation = useNavigation();

  useEffect(() => {
    loadCalculations();
  }, []);

  const loadCalculations = async () => {
    const allCalculations = await getAllCalculations();
    setCalculations(allCalculations);
  };

  const renderItem = ({ item }) => {
    const calculationData = JSON.parse(item.input_values);
    const resultsData = JSON.parse(item.results);

    const getNavigationScreen = (calculatorType) => {
      switch (calculatorType.toLowerCase()) {
        case 'rental':
          return 'RentalCalcOut';
        case 'flip':
          return 'FlipCalcOut';
        case 'brrr':
          return 'BRRCalcOut';
        case 'projection':
          return 'ProjectionCalcOut';
        case 'wholesale':
          return 'WholesaleCalcOut';
        default:
          return `${calculatorType}CalcOut`; // Fallback to original behavior
      }
    };

    return (
      <TouchableOpacity 
        style={styles.item}
        onPress={() => navigation.navigate(getNavigationScreen(item.calculator_type), {
          inputValues: calculationData,
          ...resultsData
        })}
      >
        <Text style={styles.title}>{item.calculator_type} Calculation</Text>
        <Text style={styles.date}>{new Date(item.date).toLocaleString()}</Text>
        <Text style={styles.details}>
          Purchase Price: ${calculationData.purchasePrice}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={CommonStyles.container}>
      <CustomTitle title="Calculation History" />
      <FlatList
        data={calculations}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: colors.white,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  date: {
    fontSize: 14,
    color: colors.secondary,
    marginTop: 4,
  },
  details: {
    fontSize: 16,
    color: colors.text,
    marginTop: 8,
  },
});

export default HistoryScreen;