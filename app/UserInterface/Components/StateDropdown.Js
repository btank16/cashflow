import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { ChevronDownIcon } from "react-native-heroicons/outline";
import colors from '../Colors/colors.Js';

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
  "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
  "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
  "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
  "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
  "Wisconsin", "Wyoming", "International"
];

const StateDropdown = ({ 
  label, 
  value, 
  onValueChange,
  placeholder = "Select state"
}) => {
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const displayValue = value || placeholder;

  const handleDone = () => {
    if (tempValue !== value) {
      onValueChange(tempValue);
    }
    setIsPickerVisible(false);
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsPickerVisible(false);
  };

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TouchableOpacity 
        activeOpacity={0.7}
        onPress={() => {
          setTempValue(value);
          setIsPickerVisible(true);
        }}
        style={styles.touchableWrapper}
      >
        <View style={styles.inputWrapper}>
          <Text style={[
            styles.displayText,
            !value && styles.placeholderText
          ]}>
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
              <TouchableOpacity onPress={handleDone} style={styles.headerButton}>
                <Text style={styles.doneButton}>Done</Text>
              </TouchableOpacity>
            </View>
            <Picker
              selectedValue={tempValue}
              onValueChange={setTempValue}
              style={styles.picker}
            >
              <Picker.Item label={placeholder} value="" color={colors.sixthGrey} />
              {US_STATES.map((state) => (
                <Picker.Item 
                  key={state} 
                  label={state} 
                  value={state}
                  color={colors.primaryBlack}
                />
              ))}
            </Picker>
          </View>
        </View>
      </Modal>
    </View>
  );
};

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
    paddingBottom: 20,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.quaternaryGrey,
    padding: 16,
  },
  headerButton: {
    paddingHorizontal: 8,
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
  picker: {
    backgroundColor: colors.iconWhite,
  },
});

export default StateDropdown; 