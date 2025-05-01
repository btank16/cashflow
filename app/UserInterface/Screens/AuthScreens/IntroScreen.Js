import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import colors from '../../Colors/colors.Js';
import WhiteTextLogo from '../../../assets/icons/WhiteTextLogo.jsx';
import ScreenLayoutWithFooter from '../../UtilScreens/ScreenLayoutWithFooter.Js';

// Get screen dimensions
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Calculate responsive font sizes
const calculateFontSize = (baseSize) => {
  // Use a reference screen width (iPhone 11 Pro - 375)
  const baseWidth = 375;
  const scaleFactor = screenWidth / baseWidth;
  
  // Apply a minimum and maximum constraint to ensure readability
  return Math.max(baseSize * 0.8, Math.min(baseSize * 1.2, baseSize * scaleFactor));
};

const titleFontSize = calculateFontSize(32);
const subtitleFontSize = calculateFontSize(20);

const IntroScreen = () => {
  const navigation = useNavigation();

  // Calculate image dimensions while maintaining aspect ratio
  const imageWidth = screenWidth; // Full screen width
  const imageHeight = (screenWidth * 347) / 375; // maintain original aspect ratio

  const renderHeader = () => (
    <View style={styles.logoContainer}>
      <View style={styles.logoWrapper}>
        <WhiteTextLogo />
      </View>
    </View>
  );

  const renderFooter = () => (
    <View style={styles.buttonContainer}>
      <TouchableOpacity 
        style={styles.signInButton}
        onPress={() => navigation.navigate('SignIn')}
      >
        <Text style={styles.signInText}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.signUpButton}
        onPress={() => navigation.navigate('SignUpFirst')}
      >
        <Text style={styles.signUpText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScreenLayoutWithFooter
      header={renderHeader()}
      footer={renderFooter()}
      backgroundColor={colors.darkGreenPrimary}
      scrollable={false}
    >
      <View style={styles.contentContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={require('../../../assets/images/IntroImage.png')}
            style={[styles.image, { width: imageWidth, height: imageHeight }]}
            resizeMode="cover"
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={[styles.title, { fontSize: titleFontSize }]}>
            Accurate & Mobile Friendly Real Estate Underwriting
          </Text>
          <Text style={[styles.subtitle, { fontSize: subtitleFontSize }]}>
            Trust the numbers. Maximize Cashflow.
          </Text>
        </View>
      </View>
    </ScreenLayoutWithFooter>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  logoWrapper: {
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    resizeMode: 'cover',
  },
  textContainer: {
    width: '100%',
    marginTop: 'auto',
    marginBottom: 'auto',
    alignItems: 'flex-start',
  },
  title: {
    fontWeight: 'bold',
    color: colors.iconWhite,
    textAlign: 'left',
    marginBottom: 16,
  },
  subtitle: {
    color: colors.sixthGrey,
    textAlign: 'left',
    lineHeight: 24,
    marginRight: Platform.OS === 'android' ? -10 : 0,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  signInButton: {
    flex: 0.45,
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.iconWhite,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    marginRight: 8,
  },
  signUpButton: {
    flex: 0.45,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryGreen,
    marginLeft: 8,
  },
  signInText: {
    color: colors.iconWhite,
    fontSize: 16,
    fontWeight: 'bold',
  },
  signUpText: {
    color: colors.iconWhite,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default IntroScreen;
