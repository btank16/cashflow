import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../Colors/colors.Js';

const PriceBar = () => {
  return (
    <View style={styles.container}>
      <View style={styles.barContainer}>
        <View style={styles.targetSection}>
          <Text style={styles.sectionText}>Target</Text>
        </View>
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
        </View>
        <View style={styles.breakEvenSection}>
          <Text style={styles.sectionText}>Break even</Text>
        </View>
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
        </View>
        <View style={styles.lossSection} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  barContainer: {
    flexDirection: 'row',
    height: 24,
    borderRadius: 12,
    overflow: 'hidden',
  },
  targetSection: {
    flex: 3,
    backgroundColor: colors.tertiaryOrange,
    justifyContent: 'center',
    alignItems: 'center',
  },
  breakEvenSection: {
    flex: 4,
    backgroundColor: colors.primaryGreen,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lossSection: {
    flex: 3,
    backgroundColor: colors.quaternaryRed,
  },
  divider: {
    width: 2,
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
  },
  dividerLine: {
    width: '100%',
    height: '50%',
    backgroundColor: colors.darkGreenPrimary,
  },
  sectionText: {
    color: colors.primaryBlack,
    fontSize: 12,
    fontWeight: '500',
    position: 'absolute',
    bottom: -20,
  },
});

export default PriceBar;
