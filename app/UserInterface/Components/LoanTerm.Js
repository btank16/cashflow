import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import colors from '../Colors/colors.Js';
import SliderIcon from '../../assets/icons/SliderIcon';

const LoanTerm = ({ label, value, onValueChange, infoPress }) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleSliderChange = (newValue) => {
    const roundedValue = Math.round(newValue);
    setLocalValue(roundedValue);
    onValueChange(roundedValue);
  };

  const renderSlicedTrack = () => {
    const slices = [];
    const activeSlices = Math.floor((localValue - 1) / 5);
    const partialSlice = (localValue - 1) % 5;

    for (let i = 0; i < 10; i++) {
      const isActive = i < activeSlices || (i === activeSlices && partialSlice > 0);
      let startColor, endColor;

      if (i < activeSlices) {
        startColor = endColor = `rgba(${interpolateColor(i / 10, colors.tertiaryBlue, colors.quaternaryBlue)}, 1)`;
      } else if (i === activeSlices && partialSlice > 0) {
        const fraction = partialSlice / 5;
        startColor = `rgba(${interpolateColor(i / 10, colors.tertiaryBlue, colors.quaternaryBlue)}, 1)`;
        endColor = colors.secondaryGrey;
      } else {
        startColor = endColor = colors.secondaryGrey;
      }

      slices.push(
        <View
          key={i}
          style={[
            styles.sliceTrack,
            i === 0 && styles.firstSlice,
            i === 9 && styles.lastSlice,
          ]}
        >
          <LinearGradient
            colors={[startColor, endColor]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </View>
      );
    }

    return <View style={styles.slicedTrackContainer}>{slices}</View>;
  };

  // Helper function to interpolate between two colors
  const interpolateColor = (fraction, startColor, endColor) => {
    const start = hexToRgb(startColor);
    const end = hexToRgb(endColor);
    const r = Math.round(start.r + fraction * (end.r - start.r));
    const g = Math.round(start.g + fraction * (end.g - start.g));
    const b = Math.round(start.b + fraction * (end.b - start.b));
    return `${r}, ${g}, ${b}`;
  };

  // Helper function to convert hex to rgb
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <TouchableOpacity onPress={infoPress} style={styles.infoButton}>
          <Ionicons name="information-circle-outline" size={16} color={colors.primaryGrey} />
        </TouchableOpacity>
        <Text style={styles.label}>{label}</Text>
      </View>
      <View style={styles.valueContainer}>
        <Text style={styles.valueText}>{localValue}</Text>
        <Text style={styles.yearText}>years</Text>
      </View>
      <View style={styles.sliderContainer}>
        {renderSlicedTrack()}
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={50}
          step={1}
          value={localValue}
          onValueChange={handleSliderChange}
          minimumTrackTintColor="transparent"
          maximumTrackTintColor="transparent"
          thumbTintColor="transparent"
        />
        <View style={[styles.sliderIconContainer, { left: `${((localValue - 1) / 49) * 100}%` }]}>
          <SliderIcon width={24} height={24} />
        </View>
      </View>
      <View style={styles.rangeContainer}>
        <Text style={styles.rangeText}>1 year</Text>
        <Text style={styles.rangeText}>50 years</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoButton: {
    marginRight: 5,
  },
  label: {
    fontSize: 14,
    fontWeight: 500,
    color: colors.primaryGrey,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.quaternaryBlue,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 8,
    alignSelf: 'center',
  },
  valueText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primaryBlack,
    minWidth: 30,
    textAlign: 'center',
  },
  yearText: {
    fontSize: 18,
    color: colors.primaryBlack,
    marginLeft: 5,
  },
  sliderContainer: {
    height: 40,
    position: 'relative',
  },
  slicedTrackContainer: {
    flexDirection: 'row',
    position: 'absolute',
    left: 0,
    right: 0,
    height: 4,
    top: 15,
  },
  sliceTrack: {
    flex: 1,
    height: 4,
    marginHorizontal: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  firstSlice: {
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  lastSlice: {
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  slider: {
    width: '100%',
    height: 40,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
  },
  sliderThumb: {
    width: 24,
    height: 24,
  },
  sliderIconContainer: {
    position: 'absolute',
    top: 6,
    marginLeft: -12, 
    zIndex: 0,
  },
  rangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rangeText: {
    fontSize: 12,
    color: colors.primaryGrey,
  },
});

export default LoanTerm;
