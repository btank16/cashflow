import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../Colors/colors.Js';

const ResultDisplay = ({ label, value }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label} numberOfLines={2} adjustsFontSizeToFit>
        {label}:
      </Text>
      <LinearGradient
        colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.05)', 'rgba(0,0,0,0)']}
        style={styles.gradientContainer}
      >
        <View style={styles.valueContainer}>
          <Text style={styles.value}>{value}</Text>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    padding: 15,
    width: '100%',
  },
  label: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    flexWrap: 'wrap',
    color: colors.basicText,
    marginRight: 10,
  },
  gradientContainer: {
    flex: 1,
    borderRadius: 10,
    padding: 2,
  },
  valueContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.fieldColor,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
    height: 30
  },
  value: {
    fontSize: 16,
    color: colors.basicText,
    textAlign: 'center',
  },
});

export default ResultDisplay;