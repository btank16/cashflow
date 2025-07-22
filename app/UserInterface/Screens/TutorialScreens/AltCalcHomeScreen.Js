import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, Alert } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { InformationCircleIcon, ChevronRightIcon } from 'react-native-heroicons/outline';
import colors from '../../Colors/colors.Js';
import RentalIcon from '../../../assets/icons/RentalIcon.jsx';
import FlipIcon from '../../../assets/icons/FlipIcon.jsx';
import BRRRRIcon from '../../../assets/icons/BRRRIcon.jsx';
import WholesaleIcon from '../../../assets/icons/WholesaleIcon.jsx';
import TargetIcon from '../../../assets/icons/TargetIcon.jsx';
import WhiteTextLogo from '../../../assets/icons/WhiteTextLogo.jsx';
import FeedbackIcon from '../../../assets/icons/FeedbackIcon.jsx';
import HistoryIcon from '../../../assets/icons/HistoryIcon.jsx';
import UserIcon from '../../../assets/icons/UserIcon.jsx';
import InfoComponent from '../../Components/InfoComponent.Js';
import calculatorInfo from '../../../assets/text/info.json';
import GreenLogo from '../../../assets/icons/GreenLogo.jsx';
import MarkdownModal from '../../Components/ArticleModal.Js';
import introToCashflow from '../../../assets/text/introToCashflow.Js';
import ScreenLayout from '../../UtilScreens/ScreenLayout.Js';

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

function AltCalcHomeScreen() {
  const navigation = useNavigation();
  const [markdownModalVisible, setMarkdownModalVisible] = useState(false);
  const [currentMarkdownContent, setCurrentMarkdownContent] = useState('');

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
      screen: "RentalCalcInTutor", 
      Icon: RentalIcon, 
      color: colors.primaryGreen,
      infoTitle: calculatorInfo.calculator_type.rental_calc.title,
      infoDescription: calculatorInfo.calculator_type.rental_calc.description
    },
    { 
      name: "Fix & Flip Calculator", 
      screen: "FlipCalcInTutor", 
      Icon: FlipIcon, 
      color: colors.primaryOrange,
      infoTitle: calculatorInfo.calculator_type.flip_calc.title,
      infoDescription: calculatorInfo.calculator_type.flip_calc.description
    },
    { 
      name: "BRRRR Calculator", 
      screen: "BRRCalcInTutor", 
      Icon: BRRRRIcon, 
      color: colors.primaryBlue,
      infoTitle: calculatorInfo.calculator_type.brrrr_calc.title,
      infoDescription: calculatorInfo.calculator_type.brrrr_calc.description
    },
    { 
      name: "Wholesale Calculator", 
      screen: "WholesaleCalcInTutor", 
      Icon: WholesaleIcon, 
      color: colors.brightGreen,
      infoTitle: calculatorInfo.calculator_type.wholesale_calc.title,
      infoDescription: calculatorInfo.calculator_type.wholesale_calc.description
    },
    { 
      name: "Price Target Calculator", 
      screen: "ProjectionCalcInTutor", 
      Icon: TargetIcon, 
      color: colors.primaryPurple,
      infoTitle: calculatorInfo.calculator_type.target_calc.title,
      infoDescription: calculatorInfo.calculator_type.target_calc.description,
      fullWidth: true
    },
  ];

  const showSignupAlert = () => {
    Alert.alert(
      'Create an Account',
      'Create an account to use these features',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Sign Up',
          onPress: () => navigation.navigate('SignUpFirst')
        }
      ],
      { cancelable: true }
    );
  };

  const renderHistorySection = () => (
    <View style={styles.sectionContainer}>
      <TouchableOpacity 
        style={styles.sectionTitleContainer}
        onPress={showSignupAlert}
      >
        <Text style={styles.sectionTitle}>Recent Calculations</Text>
        <ChevronRightIcon color={colors.iconWhite} size={24} />
      </TouchableOpacity>
      <View style={styles.emptyHistoryContainer}>
        <Text style={styles.emptyHistoryText}>
          <Text 
            style={styles.createAccountText}
            onPress={showSignupAlert}
          >
            Create an Account
          </Text>
          <Text> to Save Your Calculations</Text>
        </Text>
      </View>
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
      <TouchableOpacity style={styles.headerIcon} onPress={showSignupAlert}>
        <UserIcon color={colors.primary} size={24} />
      </TouchableOpacity>
      <View style={styles.logoContainer}>
        <WhiteTextLogo width={120} height={28} />
      </View>
      <View style={styles.headerIcons}>
        <TouchableOpacity onPress={showSignupAlert} style={styles.headerIcon}>
          <HistoryIcon color={colors.primary} size={24} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('AltFeedbackScreen')} style={styles.headerIcon}>
          <FeedbackIcon color={colors.primary} size={24} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScreenLayout
      header={renderHeader()}
      backgroundColor={colors.darkGreenPrimary}
    >
      <Text style={styles.welcomeText}>
        {'Welcome to Cashflow!'}
      </Text>
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

      <MarkdownModal 
        visible={markdownModalVisible}
        onClose={() => setMarkdownModalVisible(false)}
        markdownContent={currentMarkdownContent}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  logoContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: -1,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.iconWhite,
    paddingVertical: 16,
    textAlign: 'center',
  },
  calculatorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 8,
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
    marginBottom: 16,
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
  emptyHistoryContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  emptyHistoryText: {
    textAlign: 'center',
    color: colors.mainShade,
    fontStyle: 'italic',
  },
  createAccountText: {
    color: colors.primaryGreen,
    fontStyle: 'italic',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
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

export default AltCalcHomeScreen;