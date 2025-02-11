import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../Colors/colors.Js';

const ResultDisplay = ({ label, value, type, additionalText, infoPress, fullWidth, textColor }) => {
  const getValueColor = () => {
    if (textColor) return textColor;
    
    const number = parseFloat(value);
    if (isNaN(number)) {
      // For non-numeric values like "N/A"
      return type === 'integer' ? colors.quaternaryRed : colors.primaryBlack;
    }

    switch (type) {
      case 'dollar':
      case 'percentage':
        return number >= 0 ? colors.primaryGreen : colors.quaternaryRed;
      case 'float':
        return number >= 1 ? colors.primaryGreen : colors.quaternaryRed;
      case 'integer':
        return number >= 0 ? colors.primaryGreen : colors.quaternaryRed;
      default:
        return colors.primaryBlack;
    }
  };

  const formatValue = () => {
    if (value === 'N/A') return 'N/A';
    
    const number = parseFloat(value);
    if (isNaN(number)) return '0';

    switch (type) {
      case 'dollar':
        const absNumber = Math.abs(number);
        return `${number < 0 ? '-' : ''}$${absNumber.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}`;
      case 'percentage':
        return `${number >= 0 ? '+' : ''}${number.toFixed(2)}%`;
      case 'float':
        return number.toFixed(2);
      case 'integer':
        return isNaN(number) ? value : Math.round(number).toString();
      default:
        return value;
    }
  };

  return (
    <View style={[styles.container, fullWidth && styles.fullWidth]}>
      <View style={[
        styles.labelContainer,
        fullWidth && styles.fullWidthLabelContainer
      ]}>
        <Text style={[
          styles.label,
          fullWidth && styles.fullWidthLabel
        ]} numberOfLines={2}>{label}</Text>
        <View style={styles.infoButtonContainer}>
          <TouchableOpacity onPress={infoPress}>
            <Ionicons name="information-circle-outline" size={20} color={colors.sixthGrey} />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={[styles.value, { color: getValueColor() }]} numberOfLines={1}>{formatValue()}</Text>
      {additionalText && (
        <Text style={styles.additionalText}>{additionalText}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.secondaryGrey,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.tertiaryGrey,
    width: '48%',
    minHeight: 90,
  },
  fullWidth: {
    width: '100%',
  },
  labelContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    minHeight: 40,
  },
  fullWidthLabelContainer: {
    minHeight: 24,
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    color: colors.primaryBlack,
    flex: 1,
    paddingRight: 12,
  },
  fullWidthLabel: {
    paddingRight: 32,
  },
  infoButtonContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  additionalText: {
    fontSize: 12,
    color: colors.primaryGrey,
  },
});

export default ResultDisplay;