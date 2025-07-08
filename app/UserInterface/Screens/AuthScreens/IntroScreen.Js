import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import colors from '../../Colors/colors.Js';
import WhiteTextLogo from '../../../assets/icons/WhiteTextLogo.jsx';
import ScreenLayoutWithFooter from '../../UtilScreens/ScreenLayoutWithFooter.Js';
import PDFViewer from '../../Components/PDFViewer.Js';
import secretKeys from '../../../../secretkeys.json';

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

// Adjust title font size based on screen height
const titleFontSize = calculateFontSize(screenHeight < 850 ? 26 : 32);
const subtitleFontSize = calculateFontSize(20);

// Determine if screen is too small to show subtitle
const isVerySmallScreen = screenHeight < 750;

const IntroScreen = () => {
  const navigation = useNavigation();
  const [termsVisible, setTermsVisible] = useState(false);
  const [privacyVisible, setPrivacyVisible] = useState(false);
  
  // Use the direct PDF URLs from secretkeys.json
  const termsSource = { uri: secretKeys.policy_links.termsOfUse };
  const privacySource = { uri: secretKeys.policy_links.privacyPolicy };

  // Calculate image dimensions while maintaining aspect ratio
  const imageWidth = screenWidth; // Full screen width
  const imageHeight = (screenWidth * 347) / 375; // maintain original aspect ratio

  const handleTermsPress = () => {
    setTermsVisible(true);
  };

  const handlePrivacyPress = () => {
    setPrivacyVisible(true);
  };

  const renderHeader = () => (
    <View style={styles.logoContainer}>
      <View style={styles.logoWrapper}>
        <WhiteTextLogo />
      </View>
    </View>
  );

  const renderFooter = () => (
    <View style={styles.footerContainer}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.signInButton}
          onPress={() => navigation.navigate('SignIn')}
        >
          <Text style={styles.signInText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.signUpButton}
          onPress={() => navigation.navigate('AltCalcHomeScreen')}
        >
          <Text style={styles.signUpText}>Get Started</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity 
        style={styles.createAccountContainer}
        onPress={() => navigation.navigate('SignUpFirst')}
      >
        <Text style={styles.createAccountText}>Create Account</Text>
      </TouchableOpacity>
      
      <View style={styles.termsTextContainer}>
        <Text style={styles.termsText}>
          By clicking Get Started you agree to our{' '}
        </Text>
        <TouchableOpacity onPress={handleTermsPress} activeOpacity={0.7}>
          <Text style={[styles.termsText, styles.highlightedText]}>Terms of Use</Text>
        </TouchableOpacity>
        <Text style={styles.termsText}>{' & '}</Text>
        <TouchableOpacity onPress={handlePrivacyPress} activeOpacity={0.7}>
          <Text style={[styles.termsText, styles.highlightedText]}>Privacy Policy</Text>
        </TouchableOpacity>
      </View>
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
            {isVerySmallScreen 
              ? "Mobile Real Estate Calculator" 
              : "Accurate & Mobile Friendly Real Estate Underwriting"
            }
          </Text>
          {!isVerySmallScreen && (
            <Text style={[styles.subtitle, { fontSize: subtitleFontSize }]}>
              Trust the numbers. Maximize Cashflow.
            </Text>
          )}
        </View>
      </View>
      
      <PDFViewer 
        source={termsSource}
        visible={termsVisible}
        onClose={() => setTermsVisible(false)}
      />
      
      <PDFViewer 
        source={privacySource}
        visible={privacyVisible}
        onClose={() => setPrivacyVisible(false)}
      />
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
  footerContainer: {
    width: '100%',
    alignItems: 'center',
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
  createAccountContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  createAccountText: {
    color: colors.primaryGreen,
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  termsTextContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 12,
    paddingHorizontal: 0,
    width: '100%',
  },
  termsText: {
    color: colors.sixthGrey,
    fontSize: 12,
    textAlign: 'center',
  },
  highlightedText: {
    color: colors.iconWhite,
    fontWeight: '500',
  },
});

export default IntroScreen;
