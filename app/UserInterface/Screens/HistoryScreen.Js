import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, FlatList, StyleSheet, TouchableOpacity, Text, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';
import { useDatabase } from '../../../database/cashflowDatabase.Js';
import colors from '../Colors/colors.Js';
import HistoryItem from '../Components/HistoryItem.Js';
import FeedbackIcon from '../../assets/icons/FeedbackIcon.jsx';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

function HistoryScreen() {
  const [calculations, setCalculations] = useState([]);
  const [filter, setFilter] = useState('All');
  const { getAllCalculations, getCalculationsByType, deleteCalculation } = useDatabase();
  const navigation = useNavigation();

  const calculatorTypes = [
    'All',
    'rental',
    'flip',
    'brrr',
    'projection',
    'wholesale'
  ];

  useEffect(() => {
    loadCalculations();
  }, [filter]);

  const loadCalculations = async () => {
    if (filter === 'All') {
      const allCalculations = await getAllCalculations();
      setCalculations(allCalculations);
    } else {
      const filteredCalculations = await getCalculationsByType(filter);
      setCalculations(filteredCalculations);
    }
  };

  const handleDeleteCalculation = async (id) => {
    try {
      await deleteCalculation(id);
      loadCalculations(); // Reload the list after deletion
    } catch (error) {
      console.error('Error deleting calculation:', error);
      // Optionally, you can show an error message to the user here
    }
  };

  const renderItem = ({ item }) => (
    <HistoryItem
      item={item}
      onDelete={() => handleDeleteCalculation(item.id)}
      navigation={navigation}
    />
  );

  const FilterButton = ({ title }) => (
    <TouchableOpacity
      style={[styles.filterButton, filter === title && styles.activeFilterButton]}
      onPress={() => setFilter(title)}
    >
      <Text style={[styles.filterButtonText, filter === title && styles.activeFilterButtonText]}>
        {title === 'All' ? 'All' : 
         title === 'rental' ? 'Rental' :
         title === 'flip' ? 'Fix & Flip' :
         title === 'brrr' ? 'BRRRR' :
         title === 'projection' ? 'Price Target' :
         title === 'wholesale' ? 'Wholesale' : title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.masterBackground}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeftIcon color={colors.iconWhite} size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Search history</Text>
          <TouchableOpacity onPress={() => navigation.navigate('FeedbackScreen')}>
            <FeedbackIcon color={colors.iconWhite} size={24} />
          </TouchableOpacity>
        </View>
        <View style={styles.filterContainer}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {calculatorTypes.map((type) => (
              <FilterButton key={type} title={type} />
            ))}
          </ScrollView>
        </View>
        <FlatList
          data={calculations}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  masterBackground: {
    flex: 1,
    backgroundColor: colors.darkGreenPrimary,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    backgroundColor: colors.darkGreenPrimary,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.iconWhite,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: colors.darkGreenPrimary,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: colors.darkGreenSecondary,
    borderWidth: 1,
    borderColor: colors.darkGreenTertiary,
    marginRight: 4,
  },
  activeFilterButton: {
    backgroundColor: colors.primaryGreen,
  },
  filterButtonText: {
    color: colors.iconWhite,
    fontSize: 14,
  },
  activeFilterButtonText: {
    fontWeight: 'bold',
  },
  listContainer: {
    paddingHorizontal: 16,
  },
});

export default HistoryScreen;