import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { ChevronDownIcon } from "react-native-heroicons/outline";
import colors from '../Colors/colors.Js';

const INVESTMENT_STRATEGIES = [
  "Residential Long Term Rental", 
  "Residential Short Term Rental (i.e., Airbnb)", 
  "Fix & Flip", 
  "Wholesaling", 
  "BRRRR", 
  "Commercial Multifamily", 
  "Other"
];

function InvestmentStrategyMultiselect({ 
  label, 
  value = [], 
  onValueChange,
  placeholder = "Select investment strategies"
}) {
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [selectedStrategies, setSelectedStrategies] = useState(value);
  
  const displayValue = value.length > 0 
    ? value.join(", ") 
    : placeholder;

  const handleStrategyToggle = (strategy) => {
    const newSelection = selectedStrategies.includes(strategy)
      ? selectedStrategies.filter(s => s !== strategy)
      : [...selectedStrategies, strategy];
    setSelectedStrategies(newSelection);
  };

  const handleDone = () => {
    onValueChange(selectedStrategies);
    setIsPickerVisible(false);
  };

  const handleCancel = () => {
    setSelectedStrategies(value);
    setIsPickerVisible(false);
  };

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TouchableOpacity 
        activeOpacity={0.7}
        onPress={() => {
          setSelectedStrategies(value);
          setIsPickerVisible(true);
        }}
        style={styles.touchableWrapper}
      >
        <View style={styles.inputWrapper}>
          <Text 
            style={[
              styles.displayText,
              !value.length && styles.placeholderText
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {displayValue}
          </Text>
          <ChevronDownIcon size={20} color={colors.primaryBlack} style={styles.icon} />
        </View>
      </TouchableOpacity>

      <Modal
        visible={isPickerVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.pickerHeader}>
              <TouchableOpacity onPress={handleCancel} style={styles.headerButton}>
                <Text style={styles.cancelButton}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.selectedCount}>
                {selectedStrategies.length} selected
              </Text>
              <TouchableOpacity onPress={handleDone} style={styles.headerButton}>
                <Text style={styles.doneButton}>Done</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.strategyList}>
              {INVESTMENT_STRATEGIES.map((strategy) => (
                <TouchableOpacity
                  key={strategy}
                  style={styles.strategyItem}
                  onPress={() => handleStrategyToggle(strategy)}
                >
                  <Text style={styles.strategyText}>{strategy}</Text>
                  <View style={[
                    styles.checkbox,
                    selectedStrategies.includes(strategy) && styles.checkboxSelected
                  ]}>
                    {selectedStrategies.includes(strategy) && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 16,
    zIndex: 1000,
  },
  inputLabel: {
    fontSize: 14,
    color: colors.primaryGrey,
    marginBottom: 8,
    fontWeight: '500',
  },
  touchableWrapper: {
    width: '100%',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    height: 50,
    backgroundColor: colors.tertiaryGrey,
    borderColor: colors.quaternaryGrey,
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  displayText: {
    flex: 1,
    fontSize: 16,
    color: colors.primaryBlack,
  },
  placeholderText: {
    color: colors.sixthGrey,
  },
  icon: {
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalContent: {
    backgroundColor: colors.iconWhite,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.quaternaryGrey,
    padding: 16,
  },
  headerButton: {
    paddingHorizontal: 8,
  },
  selectedCount: {
    color: colors.primaryGrey,
    fontSize: 14,
  },
  doneButton: {
    color: colors.primaryGreen,
    fontSize: 16,
    fontWeight: '500',
  },
  cancelButton: {
    color: colors.primaryGrey,
    fontSize: 16,
  },
  strategyList: {
    paddingVertical: 8,
  },
  strategyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  strategyText: {
    fontSize: 16,
    color: colors.primaryBlack,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.quaternaryGrey,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: colors.primaryGreen,
    borderColor: colors.primaryGreen,
  },
  checkmark: {
    color: colors.iconWhite,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default InvestmentStrategyMultiselect; 