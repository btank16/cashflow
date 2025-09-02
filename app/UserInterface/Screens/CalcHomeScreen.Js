import 'react-native-get-random-values';
import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, FlatList, KeyboardAvoidingView, Platform } from "react-native";
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
import AddressSearchBar from '../Components/AddressSearchBar.Js';
import { generateClient } from 'aws-amplify/api';

// Generate a GraphQL API client
const client = generateClient({
  authMode: 'userPool'
});

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
  const [residentAIInput, setResidentAIInput] = useState('');

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

  const handleAddressSelect = async (data, details = null) => {
    try {
      const address = details?.formatted_address || data.description || '';
      setSelectedAddress(address);
      console.log('Selected address:', address);
      console.log('Condition:', data.condition);
      console.log('Strategy:', data.strategy);

      // Call getUnitCount query
      if (address) {
        console.log('Calling getUnitCount for address:', address);
        
        const getUnitCountQuery = /* GraphQL */ `
          query GetUnitCount($address: String!) {
            getUnitCount(address: $address) {
              unit_count
              bedrooms
              bathrooms
              square_feet
            }
          }
        `;

        try {
          const result = await client.graphql({
            query: getUnitCountQuery,
            variables: {
              address: address
            }
          });

          console.log('getUnitCount response:', result);
          
          const unitData = result.data.getUnitCount;
          console.log('Property Information:');
          console.log('- Unit count:', unitData.unit_count);
          console.log('- Bedrooms:', unitData.bedrooms);
          console.log('- Bathrooms:', unitData.bathrooms);
          console.log('- Square feet:', unitData.square_feet);
          
          // Log detailed information for each unit
          if (unitData.unit_count > 0) {
            console.log('\nDetailed unit information:');
            for (let i = 0; i < unitData.unit_count; i++) {
              console.log(`Unit ${i + 1}:`);
              console.log(`  - Bedrooms: ${unitData.bedrooms[i] !== null ? unitData.bedrooms[i] : 'Unknown'}`);
              console.log(`  - Bathrooms: ${unitData.bathrooms[i] !== null ? unitData.bathrooms[i] : 'Unknown'}`);
              console.log(`  - Square feet: ${unitData.square_feet[i] !== null ? unitData.square_feet[i] : 'Unknown'}`);
            }
          }
          
          // Navigate to RentalCalcOutStatic with address data
          navigation.navigate('RentalCalcOutStatic', {
            source: 'address',
            address: address,
            condition: data.condition,
            strategy: data.strategy,
            unitData: unitData
          });
        } catch (apiError) {
          console.error('Error calling getUnitCount:', apiError);
          
          // Still navigate even if API fails
          navigation.navigate('RentalCalcOutStatic', {
            source: 'address',
            address: address,
            condition: data.condition,
            strategy: data.strategy
          });
        }
      }
    } catch (error) {
      console.error('Error selecting address:', error);
    }
  };

  const handleResidentAIInput = (input) => {
    if (input.type === 'text') {
      setResidentAIInput(input.data);
      console.log('ResidentAI text input:', input.data);
      console.log('Condition:', input.condition);
      console.log('Strategy:', input.strategy);
      
      // Navigate to the static demo screen when ResidentAI input is submitted
      navigation.navigate('RentalCalcOutStatic', {
        source: 'residentAI',
        inputType: 'text',
        text: input.data,
        condition: input.condition,
        strategy: input.strategy
      });
    } else if (input.type === 'image') {
      console.log('ResidentAI image input received');
      console.log('Condition:', input.condition);
      console.log('Strategy:', input.strategy);
      
      if (input.data && input.data.uri) {
        console.log('Image URI:', input.data.uri);
      }
      
      // Handle image input - navigate to the demo screen
      navigation.navigate('RentalCalcOutStatic', {
        source: 'residentAI',
        inputType: 'image',
        imageUri: input.data?.uri,
        condition: input.condition,
        strategy: input.strategy
      });
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

  const handleArticlePress = (article) => {
    if (article.markdownContent) {
      setCurrentMarkdownContent(article.markdownContent);
      setMarkdownModalVisible(true);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.navigate('UserScreen')}>
        <UserIcon color={colors.iconWhite} size={24} />
      </TouchableOpacity>
      <View style={styles.logoContainer}>
        <WhiteTextLogo width={120} height={28} />
      </View>
      <View style={styles.headerIcons}>
        <TouchableOpacity onPress={() => navigation.navigate('HistoryScreen')} style={styles.headerIcon}>
          <HistoryIcon color={colors.iconWhite} size={24} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('FeedbackScreen')} style={styles.headerIcon}>
          <FeedbackIcon color={colors.iconWhite} size={24} />
        </TouchableOpacity>
      </View>
    </View>
  );

  // Prepare data for FlatList
  const flatListData = [
    { key: 'search', type: 'search' },
    { key: 'welcome', type: 'welcome' },
    { key: 'calculators-title', type: 'section-title', title: 'Investment Calculators' },
    { key: 'calculators-grid', type: 'calculators-grid' },
    { key: 'history-title', type: 'history-title' },
    ...(history.length > 0 
      ? history.map(item => ({ ...item, key: `history-${item.id}`, type: 'history' }))
      : [{ key: 'empty-history', type: 'empty-history' }]
    ),
    { key: 'resources-title', type: 'section-title', title: 'Resources' },
    ...articles.map((article, index) => ({ ...article, key: `article-${index}`, type: 'article' })),
  ];

  const renderFlatListItem = ({ item }) => {
    switch (item.type) {
      case 'search':
        return (
          <View style={styles.searchSection}>
            <AddressSearchBar 
              onAddressSelect={handleAddressSelect} 
              onResidentAIInput={handleResidentAIInput}
            />
          </View>
        );
      case 'welcome':
        return (
          <Text style={styles.welcomeText}>
            {firstName ? `Welcome, ${firstName}!` : 'Welcome to Cashflow!'}
          </Text>
        );
      case 'section-title':
        return (
          <View style={styles.sectionHeaderContainer}>
            <Text style={styles.sectionTitle}>{item.title}</Text>
          </View>
        );
      case 'calculators-grid':
        return (
          <View style={styles.calculatorsGrid}>
            {calculators.map((calc, index) => (
              <CalculatorButton 
                key={`calc-${index}`}
                {...calc} 
              />
            ))}
          </View>
        );
      case 'calculator':
        const { key, type, ...calculatorProps } = item;
        return (
          <CalculatorButton {...calculatorProps} />
        );
      case 'history-title':
        return (
          <TouchableOpacity 
            style={styles.sectionTitleContainer}
            onPress={() => navigation.navigate('HistoryScreen')}
          >
            <Text style={styles.sectionTitle}>Recent Calculations</Text>
            <ChevronRightIcon color={colors.darkGreenQuaternary} size={24} />
          </TouchableOpacity>
        );
      case 'history':
        return (
          <HistoryItem
            item={item}
            onDelete={() => handleDeleteCalculation(item.id)}
            navigation={navigation}
            captureEventName={`${item.calculator_type.toLowerCase()}_history`}
          />
        );
      case 'empty-history':
        return (
          <Text style={styles.emptyHistoryText}>
            {isLoading ? 'Loading calculations...' : 'Your recent calculations will appear here'}
          </Text>
        );
      case 'article':
        return (
          <ArticleItem item={item} onPress={() => handleArticlePress(item)} />
        );
      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <View style={styles.container}>
        {renderHeader()}
        <FlatList
          data={flatListData}
          renderItem={renderFlatListItem}
          contentContainerStyle={styles.listContent}
          keyExtractor={(item) => item.key}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
          removeClippedSubviews={false}
        />
      </View>

      <MarkdownModal 
        visible={markdownModalVisible}
        onClose={() => setMarkdownModalVisible(false)}
        markdownContent={currentMarkdownContent}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkGreenPrimary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
  },
  logoContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    top: Platform.OS === 'ios' ? 60 : 40,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.iconWhite,
    paddingTop: 16,
    paddingBottom: 16,
    textAlign: 'left',
    letterSpacing: 0.5,
    zIndex: 1,
  },
  searchSection: {
    backgroundColor: colors.darkGreenSecondary,
    borderRadius: 16,
    padding: 20,
    marginTop: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.darkGreenTertiary,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 2,
  },
  calculatorButton: {
    aspectRatio: undefined,
    height: 120,
    borderRadius: 16,
    marginBottom: 12,
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
    fontSize: 14,
    fontWeight: '600',
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
  sectionHeaderContainer: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.iconWhite,
  },
  emptyHistoryText: {
    textAlign: 'center',
    color: colors.sixthGrey,
    fontStyle: 'italic',
    fontSize: 14,
    paddingVertical: 16,
  },
  articleItem: {
    flexDirection: 'row',
    backgroundColor: colors.darkGreenSecondary,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.darkGreenTertiary,
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
  itemSeparator: {
    height: 0,
  },
  calculatorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
    width: '100%',
  },
});

export default CalcHomeScreen;