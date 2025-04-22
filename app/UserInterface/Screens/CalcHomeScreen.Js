import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, Text, TouchableOpacity, Image, ScrollView, Platform, Alert } from "react-native";
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { InformationCircleIcon, ChevronRightIcon } from 'react-native-heroicons/outline';
import { getUserAttribute } from '../Utils/UserAttributesCache.Js';
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
import CommercialIcon from '../../assets/icons/CommercialIcon.jsx';
import InfoComponent from '../Components/InfoComponent.Js';
import calculatorInfo from '../../assets/text/info.json';
import GreenLogo from '../../assets/icons/GreenLogo.jsx';
import MarkdownModal from '../Components/ArticleModal.Js';
import introToCashflow from '../../assets/text/introToCashflow.Js';

const CalculatorButton = ({ name, screen, Icon, color, infoTitle, infoDescription, fullWidth }) => {
  const navigation = useNavigation();
  const [infoModalVisible, setInfoModalVisible] = useState(false);

  const handleInfoPress = () => {
    if (infoTitle || infoDescription) {
      setInfoModalVisible(true);
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.calculatorButton, { width: fullWidth ? '100%' : '48%' }]}
      onPress={() => navigation.navigate(screen)}
    >
      <TouchableOpacity 
        style={styles.infoIconContainer}
        onPress={handleInfoPress}
      >
        <View style={styles.infoIconCircle}>
          <InformationCircleIcon color={colors.iconWhite} size={16} />
        </View>
      </TouchableOpacity>
      <View style={styles.calculatorButtonContent}>
        <View style={[styles.iconCircle, { backgroundColor: color }]}>
          {Icon && (
            Icon === CommercialIcon ? 
              <Icon width={24} height={24} color={colors.iconWhite} /> :
              <Icon width={24} height={24} fill={colors.iconWhite} />
          )}
        </View>
        <Text style={styles.calculatorButtonText}>{name}</Text>
      </View>

      <InfoComponent
        visible={infoModalVisible}
        onClose={() => setInfoModalVisible(false)}
        title={infoTitle || name}
        description={infoDescription || "No additional information available."}
      />
    </TouchableOpacity>
  );
};

const ArticleItem = ({ item, onPress }) => (
  <TouchableOpacity style={styles.articleItem} onPress={onPress}>
    <View style={styles.articleImageContainer}>
      {item.icon ? (
        item.icon
      ) : (
        <Image source={item.image} style={styles.articleImage} />
      )}
    </View>
    <View style={styles.articleContent}>
      <Text style={styles.articleTitle}>{item.title}</Text>
    </View>
  </TouchableOpacity>
);

function CalcHomeScreen() {
  const navigation = useNavigation();
  const { getAllCalculations, deleteCalculation } = useDatabase();
  const [history, setHistory] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [markdownModalVisible, setMarkdownModalVisible] = useState(false);
  const [currentMarkdownContent, setCurrentMarkdownContent] = useState('');

  const loadHistory = useCallback(async () => {
    const allCalculations = await getAllCalculations();
    setHistory(allCalculations.slice(0, 3)); // Get only the 3 most recent calculations
  }, [getAllCalculations]);

  // Fetch user attributes when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Use the cached user attributes instead of making a direct API call
        const firstNameValue = await getUserAttribute('custom:firstName');
        if (firstNameValue) {
          setFirstName(firstNameValue);
        } else {
          // Fallback to get given_name if custom:firstName is not available
          const givenName = await getUserAttribute('given_name');
          setFirstName(givenName || 'User');
        }
      } catch (error) {
        console.error('Error fetching user attributes:', error);
        setFirstName('User');
      }
    };

    fetchUserData();
  }, []);

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

  const articles = [
    { 
      title: "Intro to Cashflow", 
      icon: <GreenLogo width={120} height={120} />,
      markdownContent: introToCashflow,
    },
  ];

  const calculators = [
    { 
      name: "Rental Property Calculator", 
      screen: "RentalCalcIn", 
      Icon: RentalIcon, 
      color: colors.primaryGreen,
      infoTitle: calculatorInfo.calculator_type.rental_calc.title,
      infoDescription: calculatorInfo.calculator_type.rental_calc.description
    },
    { 
      name: "Fix & Flip Calculator", 
      screen: "FlipCalcIn", 
      Icon: FlipIcon, 
      color: colors.primaryOrange,
      infoTitle: calculatorInfo.calculator_type.flip_calc.title,
      infoDescription: calculatorInfo.calculator_type.flip_calc.description
    },
    { 
      name: "BRRRR Calculator", 
      screen: "BRRCalcIn", 
      Icon: BRRRRIcon, 
      color: colors.primaryBlue,
      infoTitle: calculatorInfo.calculator_type.brrrr_calc.title,
      infoDescription: calculatorInfo.calculator_type.brrrr_calc.description
    },
    { 
      name: "Wholesale Calculator", 
      screen: "WholesaleCalcIn", 
      Icon: WholesaleIcon, 
      color: colors.brightGreen,
      infoTitle: calculatorInfo.calculator_type.wholesale_calc.title,
      infoDescription: calculatorInfo.calculator_type.wholesale_calc.description
    },
    { 
      name: "Price Target Calculator", 
      screen: "ProjectionCalcIn", 
      Icon: TargetIcon, 
      color: colors.primaryPurple,
      infoTitle: calculatorInfo.calculator_type.target_calc.title,
      infoDescription: calculatorInfo.calculator_type.target_calc.description
    },
    { 
      name: "Commercial Multi-Family", 
      screen: "CommercialCalcIn", 
      Icon: CommercialIcon, 
      color: colors.primaryPink,
      infoTitle: calculatorInfo.calculator_type.commercial_calc.title,
      infoDescription: calculatorInfo.calculator_type.commercial_calc.description
    },
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

  const handleArticlePress = (article) => {
    if (article.markdownContent) {
      setCurrentMarkdownContent(article.markdownContent);
      setMarkdownModalVisible(true);
    }
  };

  return (
    <SafeAreaView style={styles.masterBackground}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.navigate('UserScreen')}>
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
        <Text style={styles.welcomeText}>Welcome, {firstName || 'User'}!</Text>
        <View style={styles.calculatorsGrid}>
          {calculators.map((calc, index) => (
            <CalculatorButton 
              key={index} 
              {...calc} 
            />
          ))}
        </View>
        {renderHistorySection()}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, {marginBottom: 16}]}>Resources</Text>
          {articles.map((article, index) => (
            <ArticleItem key={index} item={article} onPress={() => handleArticlePress(article)} />
          ))}
        </View>
      </ScrollView>

      <MarkdownModal 
        visible={markdownModalVisible}
        onClose={() => setMarkdownModalVisible(false)}
        markdownContent={currentMarkdownContent}
      />
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
    position: 'relative', 
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
  articleItem: {
    flexDirection: 'row',
    backgroundColor: colors.iconWhite,
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  articleImageContainer: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  articleImage: {
    width: 100,
    height: 100,
  },
  articleContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primaryBlack,
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