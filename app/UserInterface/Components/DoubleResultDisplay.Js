import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../Colors/colors.Js';
import InfoComponent from './InfoComponent.Js';

const DoubleResultDisplay = ({ 
  topLabel, 
  topValue, 
  bottomLabel, 
  bottomValue,
  topInfoTitle,
  topInfoDescription,
  bottomInfoTitle,
  bottomInfoDescription,
  fullWidth 
}) => {
  const [topInfoModalVisible, setTopInfoModalVisible] = useState(false);
  const [bottomInfoModalVisible, setBottomInfoModalVisible] = useState(false);

  const handleTopInfoPress = () => {
    if (topInfoTitle || topInfoDescription) {
      setTopInfoModalVisible(true);
    }
  };

  const handleBottomInfoPress = () => {
    if (bottomInfoTitle || bottomInfoDescription) {
      setBottomInfoModalVisible(true);
    }
  };

  return (
    <View style={[styles.container, fullWidth && styles.fullWidth]}>
      <View style={styles.resultSection}>
        <View style={styles.labelContainer}>
          <Text style={styles.label} numberOfLines={2}>{topLabel}</Text>
          <View style={styles.infoButtonContainer}>
            <TouchableOpacity onPress={handleTopInfoPress}>
              <Ionicons name="information-circle-outline" size={20} color={colors.sixthGrey} />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={[styles.value]} numberOfLines={1}>{topValue}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.resultSection}>
        <View style={styles.labelContainer}>
          <Text style={styles.label} numberOfLines={2}>{bottomLabel}</Text>
          <View style={styles.infoButtonContainer}>
            <TouchableOpacity onPress={handleBottomInfoPress}>
              <Ionicons name="information-circle-outline" size={20} color={colors.sixthGrey} />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={[styles.value]} numberOfLines={1}>{bottomValue}</Text>
      </View>

      <InfoComponent
        visible={topInfoModalVisible}
        onClose={() => setTopInfoModalVisible(false)}
        title={topInfoTitle || topLabel}
        description={topInfoDescription || "No additional information available."}
      />

      <InfoComponent
        visible={bottomInfoModalVisible}
        onClose={() => setBottomInfoModalVisible(false)}
        title={bottomInfoTitle || bottomLabel}
        description={bottomInfoDescription || "No additional information available."}
      />
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
    minHeight: 180, 
  },
  fullWidth: {
    width: '100%',
  },
  resultSection: {
    flex: 1,
    justifyContent: 'center',
  },
  labelContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    minHeight: 40,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 14,
    color: colors.primaryBlack,
    flex: 1,
    paddingRight: 28,
  },
  infoButtonContainer: {
    marginLeft: 4,
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primaryBlack,
    marginBottom: 4,
  },
  divider: {
    height: 1,
    backgroundColor: colors.quaternaryGrey,
    marginVertical: 12,
  },
});

export default DoubleResultDisplay;
