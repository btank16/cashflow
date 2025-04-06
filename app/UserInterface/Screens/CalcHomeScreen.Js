import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, Text, TouchableOpacity, Image, ScrollView, Modal, Platform } from "react-native";
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { InformationCircleIcon, ChevronRightIcon, XMarkIcon } from 'react-native-heroicons/outline';
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

const CalculatorButton = ({ name, screen, Icon, color, article, onInfoPress, fullWidth }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity 
      style={[styles.calculatorButton, { width: fullWidth ? '100%' : '48%' }]}
      onPress={() => navigation.navigate(screen)}
    >
      <TouchableOpacity 
        style={styles.infoIconContainer}
        onPress={() => onInfoPress(article)}
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
    </TouchableOpacity>
  );
};

const ArticleModal = ({ isVisible, onClose, article }) => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={isVisible}
    onRequestClose={onClose}
  >
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <XMarkIcon color={colors.darkGreenPrimary} size={24} />
        </TouchableOpacity>
        <ScrollView style={styles.modalScrollView}>
          <Image source={article?.image} style={styles.modalImage} />
          <Text style={styles.modalTitle}>{article?.title}</Text>
          <Text style={styles.modalDescription}>{article?.fullContent}</Text>
        </ScrollView>
      </View>
    </View>
  </Modal>
);

const ArticleItem = ({ item, onPress }) => (
  <TouchableOpacity style={styles.articleItem} onPress={onPress}>
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
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [firstName, setFirstName] = useState('');

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
      title: "Rental property calculator", 
      description: "How to input data (purchase price, rental income, expenses, etc.), calculate...", 
      image: require('../../assets/images/Rental.jpg'),
    },
    { 
      title: "Fix and Flip Calculator", 
      description: "How to estimate the potential profit from a real estate renovation project...", 
      image: require('../../assets/images/Flip.jpg') 
    },
    { 
      title: "BRRRR Calculator", 
      description: "How to calculate the potential return on investment for a 'Buy, Rehab, Rent...", 
      image: require('../../assets/images/BRRR.jpg') 
    },
    { 
      title: "Wholesale Calculator", 
      description: "How to calculate the potential return on investment for a wholesale deal...", 
      image: require('../../assets/images/Wholesale.jpg') 
    },
    { 
      title: "Price Target Calculator", 
      description: "How to determine a suitable purchase price for a property based on factors s...", 
      image: require('../../assets/images/Target.jpg') 
    },
  ];

  const calculators = [
    { 
      name: "Rental Property Calculator", 
      screen: "RentalCalcIn", 
      Icon: RentalIcon, 
      color: colors.primaryGreen,
      article: articles[0]
    },
    { 
      name: "Fix & Flip Calculator", 
      screen: "FlipCalcIn", 
      Icon: FlipIcon, 
      color: colors.primaryOrange,
      article: articles[1]
    },
    { 
      name: "BRRRR Calculator", 
      screen: "BRRCalcIn", 
      Icon: BRRRRIcon, 
      color: colors.primaryBlue,
      article: articles[2]
    },
    { 
      name: "Wholesale Calculator", 
      screen: "WholesaleCalcIn", 
      Icon: WholesaleIcon, 
      color: colors.brightGreen,
      article: articles[3]
    },
    { 
      name: "Price Target Calculator", 
      screen: "ProjectionCalcIn", 
      Icon: TargetIcon, 
      color: colors.primaryPurple,
      article: articles[4],
    },
    { 
      name: "Commercial Multi-Family", 
      screen: "CommercialCalcIn", 
      Icon: CommercialIcon, 
      color: colors.primaryPink,
      article: articles[5],
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
    setSelectedArticle(article);
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
              onInfoPress={handleArticlePress}
            />
          ))}
        </View>
        {renderHistorySection()}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, {marginBottom: 16}]}>Related Articles</Text>
          {articles.map((article, index) => (
            <ArticleItem key={index} item={article} onPress={() => handleArticlePress(article)} />
          ))}
        </View>
      </ScrollView>
      <ArticleModal
        isVisible={selectedArticle !== null}
        onClose={() => setSelectedArticle(null)}
        article={selectedArticle}
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: colors.iconWhite,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 12,
    height: '80%',
    width: '100%',
    paddingTop: 0, 
  },
  closeButton: {
    position: 'absolute', 
    top: 10, 
    right: 10, 
    zIndex: 1, 
  },
  modalScrollView: {
    width: '100%',
    marginTop: 40, 
  },
  modalImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.darkGreenPrimary,
    marginBottom: 16,
  },
  modalDescription: {
    fontSize: 16,
    color: colors.darkGreenPrimary,
    lineHeight: 24,
  },
});

export default CalcHomeScreen;