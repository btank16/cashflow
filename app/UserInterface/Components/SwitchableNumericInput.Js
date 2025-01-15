import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../Colors/colors.Js';

const formatNumber = (value) => {
  if (!value) return '';
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const unformatNumber = (value) => {
  return value.replace(/,/g, '');
};

const SwitchableNumericInput = ({ 
  label, 
  value,
  isDollar,
  onChangeValue,
  onToggleMode,
  placeholder, 
  isRequired,
  infoPress
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  const handleChangeText = (text) => {
    const unformattedValue = unformatNumber(text);
    onChangeValue(unformattedValue);
  };

  const handleToggleMode = (newIsDollar) => {
    if (newIsDollar !== isDollar) {
      onToggleMode(newIsDollar);
      onChangeValue('');
    }
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <TouchableOpacity onPress={infoPress} style={styles.infoButton}>
          <Ionicons name="information-circle-outline" size={16} color={colors.primaryGrey} />
        </TouchableOpacity>
        <Text style={styles.label}>
          {label}
          {!isRequired && <Text style={styles.optionalText}> (optional)</Text>}
        </Text>
      </View>
      <View style={[
        styles.inputContainer,
        isFocused ? styles.inputContainerFocused : styles.inputContainerBlurred
      ]}>
        <TextInput
          style={styles.input}
          onChangeText={handleChangeText}
          value={formatNumber(value)}
          placeholder={placeholder}
          placeholderTextColor={colors.sixthGrey}
          keyboardType="numeric"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.typeContainer}>
          <Text style={styles.typeText}>{isDollar ? '$' : '%'}</Text>
          <Ionicons name="chevron-down" size={16} color={colors.fifthGrey} />
        </TouchableOpacity>
      </View>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.header}>
              <Text style={styles.headerText}>Select the Value</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.primaryGrey} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => handleToggleMode(false)}
            >
              <View style={styles.iconContainer}>
                <Text style={styles.iconText}>%</Text>
              </View>
              <Text style={styles.optionText}>Percent</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => handleToggleMode(true)}
            >
              <View style={styles.iconContainer}>
                <Text style={styles.iconText}>$</Text>
              </View>
              <Text style={styles.optionText}>Dollars</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    width: '100%',
    paddingHorizontal: 15,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  infoButton: {
    marginRight: 5,
  },
  label: {
    fontSize: 14,
    fontWeight: 500,
    color: colors.primaryGrey,
  },
  optionalText: {
    fontSize: 14,
    fontWeight: 500,
    color: colors.primaryBlack,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    overflow: 'hidden',
    height: 50,
  },
  inputContainerBlurred: {
    backgroundColor: colors.tertiaryGrey,
    borderColor: colors.quaternaryGrey,
    borderWidth: 1,
  },
  inputContainerFocused: {
    backgroundColor: colors.iconWhite,
    borderColor: colors.primaryGreen,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 10,
    fontSize: 16,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondaryGrey,
    paddingHorizontal: 8,
    height: '85%',
    justifyContent: 'center',
    borderRadius: 10,
    marginRight: 4,
  },
  typeText: {
    color: colors.fifthGrey,
    fontSize: 16,
    marginRight: 4,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    backgroundColor: colors.tertiaryGrey,
    marginBottom: 10,
  },
  iconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primaryGreen,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  iconText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  optionText: {
    fontSize: 16,
  },
});

export default SwitchableNumericInput;
