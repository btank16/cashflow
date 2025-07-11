import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';
import colors from '../Colors/colors.Js';
import HistoryItem from '../Components/HistoryItem.Js';
import FeedbackIcon from '../../assets/icons/FeedbackIcon.jsx';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ScreenLayout from '../UtilScreens/ScreenLayout.Js';
import { useCalculations } from '../Utils/DataCache.Js';
import { deleteCalculation as deleteCalculationFromAPI } from '../Utils/AmplifyDataUtils.Js';

function HistoryScreen() {
  const [filter, setFilter] = useState('All');
  const { calculations, isLoading, refreshCalculations } = useCalculations(null, true);
  const [filteredCalculations, setFilteredCalculations] = useState([]);
  const navigation = useNavigation();

  const calculatorTypes = [
    'All',
    'rental',
    'flip',
    'brrr',
    'projection',
    'wholesale',
    'commercial'
  ];

  useEffect(() => {
    if (filter === 'All') {
      setFilteredCalculations(calculations);
    } else {
      setFilteredCalculations(calculations.filter(calc => calc.calculator_type.toLowerCase() === filter));
    }
  }, [filter, calculations]);

  const handleDeleteCalculation = async (id) => {
    try {
      await deleteCalculationFromAPI(id);
      // Refresh calculations after deletion
      refreshCalculations(false);
    } catch (error) {
      console.error('Error deleting calculation:', error);
    }
  };

  const renderItem = ({ item }) => (
    <HistoryItem
      item={item}
      onDelete={() => handleDeleteCalculation(item.id)}
      navigation={navigation}
      captureEventName={`${item.calculator_type.toLowerCase()}_history`}
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
         title === 'wholesale' ? 'Wholesale' :
         title === 'commercial' ? 'Commercial' : title}
      </Text>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <ChevronLeftIcon color={colors.iconWhite} size={24} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Search history</Text>
      <TouchableOpacity onPress={() => navigation.navigate('FeedbackScreen')}>
        <FeedbackIcon color={colors.iconWhite} size={24} />
      </TouchableOpacity>
    </View>
  );
  
  const renderContent = () => (
    <>
      <View style={styles.filterContainer}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {calculatorTypes.map((type) => (
            <FilterButton key={type} title={type} />
          ))}
        </ScrollView>
      </View>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading calculations...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredCalculations}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
        />
      )}
    </>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScreenLayout
        header={renderHeader()}
        scrollable={false}
        backgroundColor={colors.darkGreenPrimary}
      >
        {renderContent()}
      </ScreenLayout>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.iconWhite,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: colors.iconWhite,
    fontSize: 16,
  },
});

export default HistoryScreen;