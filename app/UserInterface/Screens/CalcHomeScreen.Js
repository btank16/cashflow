import 'react-native-get-random-values';
import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { InformationCircleIcon, ChevronRightIcon } from 'react-native-heroicons/outline';
import { getUserAttribute } from '../Utils/UserAttributesCache.Js';
import colors from '../Colors/colors.Js';
import { useCalculations } from '../Utils/DataCache.Js';
import { deleteCalculation as deleteCalculationFromAPI } from '../Utils/AmplifyDataUtils.Js';
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
import InfoComponent from '../Components/InfoComponent.Js';
import calculatorInfo from '../../assets/text/info.json';
import GreenLogo from '../../assets/icons/GreenLogo.jsx';
import MarkdownModal from '../Components/ArticleModal.Js';
import introToCashflow from '../../assets/text/introToCashflow.Js';
import GooglePlacesInput from '../Components/GooglePlacesInput.Js';

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
          {Icon && <Icon width={24} height={24} fill={colors.iconWhite} />}
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
  const { calculations, isLoading, refreshCalculations } = useCalculations(null, true);
  const [history, setHistory] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [markdownModalVisible, setMarkdownModalVisible] = useState(false);
  const [currentMarkdownContent, setCurrentMarkdownContent] = useState('');
  const [selectedAddress, setSelectedAddress] = useState('');

  // Update history when calculations change
  useEffect(() => {
    if (calculations && calculations.length > 0) {
      // Take the 3 most recent calculations
      setHistory(calculations.slice(0, 3));
    } else {
      setHistory([]);
    }
  }, [calculations]);

  // Fetch user attributes when component mounts
  useEffect(() => {
    let isMounted = true;
    
    const fetchUserData = async () => {
      try {
        // First try to get given_name attribute
        const givenName = await getUserAttribute('given_name');
        if (!isMounted) return;
        
        if (givenName) {
          setFirstName(givenName);
        } else {
          // Fall back to custom:given_name if available
          const customGivenName = await getUserAttribute('custom:given_name');
          if (!isMounted) return;
          setFirstName(customGivenName || '');
        }
      } catch (error) {
        console.error('Error fetching user attributes:', error);
        if (!isMounted) return;
        setFirstName('');
      }
    };

    fetchUserData();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Make sure to limit the number of refreshes when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      // Refresh calculations when screen comes into focus
      // Only get from cache by default - no need to hit the cloud each time
      let isMounted = true;
      
      if (isMounted) {
        refreshCalculations(false);
      }
      
      return () => {
        isMounted = false;
      };
    }, [refreshCalculations])
  );

  const handleDeleteCalculation = async (id) => {
    try {
      await deleteCalculationFromAPI(id);
      // After deletion, force refresh to ensure we're showing accurate data
      refreshCalculations(false);
    } catch (error) {
      console.error('Error deleting calculation:', error);
      // Optionally, you can show an error message to the user here
    }
  };

  const handleAddressSelect = (data, details = null) => {
    try {
      const address = details?.formatted_address || data.description || '';
      setSelectedAddress(address);
      console.log('Selected address:', address);
    } catch (error) {
      console.error('Error selecting address:', error);
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
      infoDescription: calculatorInfo.calculator_type.target_calc.description,
      fullWidth: true
    },
  ];

  const renderHistorySection = () => (
    <View style={[styles.sectionContainer, styles.historySection]}>
      <TouchableOpacity 
        style={styles.sectionTitleContainer}
        onPress={() => navigation.navigate('HistoryScreen')}
      >
        <Text style={styles.sectionTitle}>Recent Calculations</Text>
        <ChevronRightIcon color={colors.darkGreenQuaternary} size={24} />
      </TouchableOpacity>
      {isLoading ? (
        <Text style={styles.emptyHistoryText}>Loading calculations...</Text>
      ) : history.length > 0 ? (
        history.map((item) => (
          <HistoryItem
            key={item.id}
            item={item}
            onDelete={() => handleDeleteCalculation(item.id)}
            navigation={navigation}
            captureEventName={`${item.calculator_type.toLowerCase()}_history`}
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

  const renderHeader = () => (
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
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      {renderHeader()}
      <View style={styles.contentContainer}>
        <Text style={styles.welcomeText}>
          {firstName ? `Welcome, ${firstName}!` : 'Welcome to Cashflow!'}
        </Text>
      
        {/* Address Search Section */}
        <View style={styles.searchSection}>
          <Text style={styles.sectionLabel}>Search Property</Text>
          <View style={styles.searchContainer}>
            <GooglePlacesInput onAddressSelect={handleAddressSelect} />
            {selectedAddress ? (
              <Text style={styles.selectedAddressText}>
                Selected: {selectedAddress}
              </Text>
            ) : null}
          </View>
        </View>
        
        {/* Calculators Section */}
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.calculatorsSection}>
            <Text style={styles.sectionLabel}>Investment Calculators</Text>
            <View style={styles.calculatorsGrid}>
              {calculators.map((calc, index) => (
                <CalculatorButton 
                  key={index} 
                  {...calc} 
                />
              ))}
            </View>
          </View>
          
          {renderHistorySection()}
          
          <View style={[styles.sectionContainer, styles.resourcesSection]}>
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
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkGreenPrimary,
  },
  contentContainer: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  logoContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.iconWhite,
    paddingTop: 20,
    paddingBottom: 24,
    textAlign: 'center',
    letterSpacing: 0.5,
    marginTop: 10,
  },
  calculatorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  calculatorButton: {
    aspectRatio: undefined,
    height: 120,
    borderRadius: 16,
    marginBottom: 12,
    backgroundColor: colors.darkGreenPrimary,
    borderWidth: 1,
    borderColor: colors.darkGreenTertiary,
    padding: 16,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
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
    marginBottom: 16,
  },
  historySection: {
    backgroundColor: colors.darkGreenSecondary,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.darkGreenTertiary,
  },
  resourcesSection: {
    backgroundColor: colors.darkGreenSecondary,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.darkGreenTertiary,
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
    color: colors.darkGreenQuaternary,
  },
  emptyHistoryText: {
    textAlign: 'center',
    color: colors.sixthGrey,
    fontStyle: 'italic',
    fontSize: 14,
  },
  articleItem: {
    flexDirection: 'row',
    backgroundColor: colors.darkGreenPrimary,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.darkGreenTertiary,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
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
    color: colors.iconWhite,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginLeft: 16,
  },
  searchSection: {
    backgroundColor: colors.darkGreenSecondary,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.darkGreenTertiary,
  },
  calculatorsSection: {
    backgroundColor: colors.darkGreenSecondary,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.darkGreenTertiary,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.darkGreenQuaternary,
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
    opacity: 0.8,
  },
  searchContainer: {
    paddingHorizontal: 0,
  },
  selectedAddressText: {
    marginTop: 10,
    color: colors.iconWhite,
    fontSize: 14,
    fontStyle: 'italic',
  },
});

export default CalcHomeScreen;