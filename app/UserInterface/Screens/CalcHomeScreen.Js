import React, { useState, useCallback } from 'react';
import { View, StyleSheet, SafeAreaView, Platform, StatusBar, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { InformationCircleIcon, ChevronRightIcon } from 'react-native-heroicons/outline';
import colors from '../Colors/colors.Js';
import { useDatabase } from '../../../database/cashflowDatabase.Js';
import RentalIcon from '../../assets/icons/RentalIcon.jsx';
import FlipIcon from '../../assets/icons/FlipIcon.jsx';
import BRRRRIcon from '../../assets/icons/BRRRIcon.jsx';
import WholesaleIcon from '../../assets/icons/WholesaleIcon.jsx';
import TargetIcon from '../../assets/icons/TargetIcon.jsx';
import WhiteTextLogo from '../../assets/icons/WhiteTextLogo.jsx';
import HistoryItem from '../Components/HistoryItem.Js';
import FeedbackIcon from '../../assets/icons/FeedbackIcon.jsx';
import HistoryIcon from '../../assets/icons/HistoryIcon.jsx';
import UserIcon from '../../assets/icons/UserIcon.jsx';

const CalculatorButton = ({ name, screen, Icon, color }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity 
      style={[styles.calculatorButton, { width: name === "Price Target Calculator" ? '100%' : '48%' }]}
      onPress={() => navigation.navigate(screen)}
    >
      <View style={styles.infoIconContainer}>
        <View style={styles.infoIconCircle}>
          <InformationCircleIcon color={colors.iconWhite} size={16} />
        </View>
      </View>
      <View style={styles.calculatorButtonContent}>
        <View style={[styles.iconCircle, { backgroundColor: color }]}>
          {Icon && <Icon width={24} height={24} fill={colors.iconWhite} />}
        </View>
        <Text style={styles.calculatorButtonText}>{name}</Text>
      </View>
    </TouchableOpacity>
  );
};

const ArticleItem = ({ item }) => (
  <TouchableOpacity style={styles.articleItem}>
    <Image source={item.image} style={styles.articleImage} />
    <View style={styles.articleContent}>
      <Text style={styles.articleTitle}>{item.title}</Text>
      <Text style={styles.articleDescription} numberOfLines={2}>{item.description}</Text>
    </View>
  </TouchableOpacity>
);

function CalcHomeScreen() {
  const navigation = useNavigation();
  const { getAllCalculations, deleteCalculation } = useDatabase();
  const [history, setHistory] = useState([]);

  const loadHistory = useCallback(async () => {
    const allCalculations = await getAllCalculations();
    setHistory(allCalculations.slice(0, 3)); // Get only the 3 most recent calculations
  }, [getAllCalculations]);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [loadHistory])
  );

  const handleDeleteCalculation = async (id) => {
    try {
      await deleteCalculation(id);
      await loadHistory(); // Reload the history after deletion
    } catch (error) {
      console.error('Error deleting calculation:', error);
      // Optionally, you can show an error message to the user here
    }
  };

  const calculators = [
    { name: "Rental Property Calculator", screen: "RentalCalcIn", Icon: RentalIcon, color: colors.primaryGreen },
    { name: "Fix & Flip Calculator", screen: "FlipCalcIn", Icon: FlipIcon, color: colors.primaryOrange },
    { name: "BRRRR Calculator", screen: "BRRCalcIn", Icon: BRRRRIcon, color: colors.primaryBlue },
    { name: "Wholesale Calculator", screen: "WholesaleCalcIn", Icon: WholesaleIcon, color: colors.brightGreen },
    { name: "Price Target Calculator", screen: "ProjectionCalcIn", Icon: TargetIcon, color: colors.primaryPurple },
  ];

  const articles = [
    { title: "Rental property calculator", description: "How to input data (purchase price, rental income, expenses, etc.), calculate...", image: require('../../assets/images/Rental.jpg') },
    { title: "Fix and Flip Calculator", description: "How to estimate the potential profit from a real estate renovation project...", image: require('../../assets/images/Flip.jpg') },
    { title: "BRRRR Calculator", description: "How to calculate the potential return on investment for a 'Buy, Rehab, Rent...", image: require('../../assets/images/BRRR.jpg') },
    { title: "Wholesale Calculator", description: "How to calculate the potential return on investment for a wholesale deal...", image: require('../../assets/images/Wholesale.jpg') },
    { title: "Price Target Calculator", description: "How to determine a suitable purchase price for a property based on factors s...", image: require('../../assets/images/Target.jpg') },
  ];

  const renderHistorySection = () => (
    <View style={styles.sectionContainer}>
      <TouchableOpacity 
        style={styles.sectionTitleContainer}
        onPress={() => navigation.navigate('HistoryScreen')}
      >
        <Text style={styles.sectionTitle}>Recent Calculations</Text>
        <ChevronRightIcon color={colors.iconWhite} size={24} />
      </TouchableOpacity>
      {history.length > 0 ? (
        history.map((item) => (
          <HistoryItem
            key={item.id}
            item={item}
            onDelete={() => handleDeleteCalculation(item.id)}
            navigation={navigation}
          />
        ))
      ) : (
        <Text style={styles.emptyHistoryText}>Your recent calculations will appear here</Text>
      )}
    </View>
  );

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
        return `${calculatorType}CalcOut`;
    }
  };

  return (
    <SafeAreaView style={styles.masterBackground}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon}>
          <UserIcon color={colors.primary} size={24} />
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <WhiteTextLogo width={120} height={28} />
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => navigation.navigate('HistoryScreen')} style={styles.headerIcon}>
            <HistoryIcon color={colors.primary} size={24} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('FeedbackScreen')} style={styles.headerIcon}>
            <FeedbackIcon color={colors.primary} size={24} />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={styles.contentContainer}>
        <Text style={styles.welcomeText}>Welcome, User!</Text>
        <View style={styles.calculatorsGrid}>
          {calculators.map((calc, index) => (
            <CalculatorButton key={index} {...calc} />
          ))}
        </View>
        {renderHistorySection()}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, {marginBottom: 16}]}>Related Articles</Text>
          {/* <View style={styles.tabContainer}>
            <TouchableOpacity style={[styles.tab, styles.activeTab]}>
              <Text style={[styles.tabText, styles.activeTabText]}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tab}>
              <Text style={styles.tabText}>Calculator Functions</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tab}>
              <Text style={styles.tabText}>Investment Strategy</Text>
            </TouchableOpacity>
          </View> */}
          {articles.map((article, index) => (
            <ArticleItem key={index} item={article} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  masterBackground: {
    flex: 1,
    backgroundColor: colors.darkGreenPrimary,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  logoContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: -1,
  },
  contentContainer: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.iconWhite,
    padding: 16,
    textAlign: 'center',
  },
  calculatorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 16,
  },
  calculatorButton: {
    aspectRatio: undefined,
    height: 120,
    borderRadius: 20,
    marginBottom: 8,
    backgroundColor: colors.darkGreenSecondary,
    borderWidth: 1,
    borderColor: colors.darkGreenTertiary,
    padding: 16,
    position: 'relative', // Add this to allow absolute positioning of child elements
  },
  calculatorButtonContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 30,
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calculatorButtonText: {
    color: colors.iconWhite,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  infoIconContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
  },
  infoIconCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.darkGreenTertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionContainer: {
    padding: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.iconWhite,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.darkGreenSecondary,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  historyItemText: {
    fontSize: 14,
    color: colors.iconWhite,
  },
  historyItemType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyItemIcon: {
    width: 20,
    height: 20,
    marginRight: 4,
  },
  historyItemTypeText: {
    fontSize: 12,
    color: colors.mainShade,
  },
  historyItemTime: {
    fontSize: 12,
    color: colors.mainShade,
  },
  emptyHistoryText: {
    textAlign: 'center',
    color: colors.mainShade,
    fontStyle: 'italic',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: colors.mainShade,
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabText: {
    color: colors.iconWhite,
    fontSize: 14,
  },
  activeTabText: {
    color: colors.iconWhite,
  },
  articleItem: {
    flexDirection: 'row',
    backgroundColor: colors.darkGreenSecondary,
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  articleImage: {
    width: 100,
    height: 100,
  },
  articleContent: {
    flex: 1,
    padding: 12,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.iconWhite,
    marginBottom: 4,
  },
  articleDescription: {
    fontSize: 14,
    color: colors.mainShade,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginLeft: 16,
  },
});

export default CalcHomeScreen;