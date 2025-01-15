import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { PlayIcon } from "react-native-heroicons/solid";
import colors from '../Colors/colors.Js';

const PriceBar = ({ listingPrice, targetPrice, evenPrice }) => {
  const getCarrotPosition = () => {
    if (!listingPrice) return null;
    
    // Calculate how far listingPrice differs from target and even prices (as percentages)
    const targetDiff = ((listingPrice - targetPrice) / targetPrice) * 100;
    const evenDiff = ((listingPrice - evenPrice) / evenPrice) * 100;
    const priceDiff = ((targetPrice - evenPrice) / evenPrice) * 100;

    // SECTION 1: PRICE IS BELOW TARGET PRICE
    if (targetDiff < 0) {
        if (Math.abs(targetDiff) <= 2) {
            return { left: '29.75%' };  // Within 2% of target price
        } else if (targetDiff < -50) {
            return { left: '10%' };     // More than 50% below target price
        } else {
            return { left: '20%' };     // Between 2% and 50% below target price
        }
    } 
    
    // SECTION 2: PRICE IS BETWEEN TARGET AND EVEN PRICE
    else if (evenDiff < 0) {
        if (Math.abs(targetDiff) <= 2) {
            return { left: '29.75%' };  // Within 2% of target price
        } else if (Math.abs(evenDiff) <= 2) {
            return { left: '69.75%' };  // Within 2% of even price
        } else {
            // Position based on how close the price is to target vs even price
            if (Math.abs(evenDiff) > ((Math.abs(priceDiff)/3)*2)) {
                return { left: '40%' };     // Closer to target price
            } else if (Math.abs(evenDiff) < Math.abs(priceDiff)/3) {
                return { left: '60%' };     // Closer to even price
            } else {
                return { left: '50%' };     // In the middle section
            }
        }
    }
    
    // SECTION 3: PRICE IS ABOVE EVEN PRICE
    else {
        if (Math.abs(evenDiff) <= 2) {
            return { left: '69.75%' };  // Within 2% of even price
        } else if (evenDiff > 50) {
            return { left: '90%' };     // More than 50% above even price
        } else {
            return { left: '80%' };     // Between 2% and 50% above even price
        }
    }
};

  const carrotPosition = getCarrotPosition();

  return (
    <View style={styles.container}>
      {carrotPosition && (
        <View style={[styles.carrot, carrotPosition]}>
          <PlayIcon 
            size={16} 
            color={colors.darkGreenPrimary}
            style={styles.carrotIcon} 
          />
        </View>
      )}
      <View style={styles.barContainer}>
        <View style={styles.targetSection} />
        <View style={[styles.divider, { left: '29.75%' }]} />
        <Text style={[styles.label, { left: '17%' }]}>Target</Text>
        <View style={styles.breakEvenSection} />
        <View style={[styles.divider, { left: '69.75%' }]} />
        <Text style={[styles.label, { left: '57%' }]}>Break Even</Text>
        <View style={styles.lossSection} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    height: 45,
  },
  barContainer: {
    flexDirection: 'row',
    height: 16,
    borderRadius: 8,
    position: 'relative',
    marginBottom: 25,
  },
  targetSection: {
    flex: 3,
    backgroundColor: colors.tertiaryOrange,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  breakEvenSection: {
    flex: 4,
    backgroundColor: colors.primaryGreen,
  },
  lossSection: {
    flex: 3,
    backgroundColor: colors.quaternaryRed,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  divider: {
    width: 2,
    height: 10,
    position: 'absolute',
    backgroundColor: colors.darkGreenPrimary,
    zIndex: 1,
    bottom: -2,
  },
  label: {
    position: 'absolute',
    fontSize: 12,
    bottom: -16,
    width: 100,
    textAlign: 'center',
    color: colors.primaryBlack,
  },
  carrot: {
    position: 'absolute',
    top: 0,
    zIndex: 2,
    transform: [
      { translateX: 1.25 }],
    alignItems: 'center',
    justifyContent: 'center',
  },
  carrotIcon: {
    transform: [{ rotate: '90deg' }],
  },
});

export default PriceBar;
