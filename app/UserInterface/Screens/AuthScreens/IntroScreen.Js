import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, Platform, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import colors from '../../Colors/colors.Js';
import WhiteTextLogo from '../../../assets/icons/WhiteTextLogo.jsx';

// Get screen dimensions
const { width: screenWidth } = Dimensions.get('window');

const IntroScreen = () => {
  const navigation = useNavigation();

  // Calculate image dimensions while maintaining aspect ratio
  const imageWidth = screenWidth; // Full screen width
  const imageHeight = (screenWidth * 347) / 375; // maintain original aspect ratio

  return (
    <SafeAreaView style={styles.masterBackground}>
      <View style={styles.logoContainer}>
        <View style={styles.logoWrapper}>
          <WhiteTextLogo />
        </View>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={require('../../../assets/images/IntroImage.png')}
            style={[styles.image, { width: imageWidth, height: imageHeight }]}
            resizeMode="cover"
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>
            Accurate & Mobile-Friendly Real Estate Calculator
          </Text>
          <Text style={styles.subtitle}>
            Intuitive Tools to Master Cashflow and Maximize Returns
          </Text>
        </View>

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
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  masterBackground: {
    flex: 1,
    backgroundColor: colors.darkGreenPrimary,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  logoContainer: {
    flexDirection: 'row',
    height: 32,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  logoWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
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
    paddingHorizontal: 16,
    marginTop: 'auto',
    marginBottom: 'auto',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.iconWhite,
    textAlign: 'left',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: colors.sixthGrey,
    textAlign: 'left',
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 'auto',
    marginBottom: 16,
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
