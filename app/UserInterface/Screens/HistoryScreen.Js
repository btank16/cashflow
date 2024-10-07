import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDatabase } from '../../../database/cashflowDatabase.Js';
import colors from '../Colors/colors.Js';
import CommonStyles from '../Colors/CommonStyles.Js';
import CustomTitle from '../Components/CustomTitle.Js';
import HistoryItem from '../Components/HistoryItem.Js';

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
        onPress={() => navigation.navigate(getNavigationScreen(item.calculator_type), {
          inputValues: {
            ...JSON.parse(item.input_values),
            id: item.unique_id
          },
          ...JSON.parse(item.results)
        })}
      >
        <HistoryItem item={item} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={CommonStyles.container}>
      <CustomTitle title="Search history" />
      <FlatList
        data={calculations}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
});

export default HistoryScreen;