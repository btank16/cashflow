import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  TouchableWithoutFeedback,
  Keyboard,
  Modal
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { XMarkIcon, ChevronDownIcon } from 'react-native-heroicons/outline';
import { Picker } from '@react-native-picker/picker';
import ExpenseLogo from '../../../assets/icons/ExpenseLogo.jsx';
import colors from '../../Colors/colors.Js';
import PrimaryButton from '../../Components/PrimaryButton.Js';
import ScreenLayoutWithFooter from '../../UtilScreens/ScreenLayoutWithFooter.Js';
import CustomFrequencyModal from '../../Components/CustomFrequencyModal.js';

const FirstAddExpense = () => {
  const navigation = useNavigation();
  const [category, setCategory] = useState('');
  const [frequency, setFrequency] = useState('Monthly');
  const [customFrequencyData, setCustomFrequencyData] = useState(null);
  const [cost, setCost] = useState('');
  const [isCategoryFocused, setIsCategoryFocused] = useState(false);
  const [isCostFocused, setIsCostFocused] = useState(false);
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [tempFrequency, setTempFrequency] = useState('Monthly');
  const [customModalVisible, setCustomModalVisible] = useState(false);
  
  const frequencies = [
    { label: 'Monthly', value: 'Monthly' },
    { label: 'Annually', value: 'Annually' },
    { label: 'Non-recurring', value: 'Non-recurring' },
    { label: 'Custom', value: 'Custom' }
  ];

  const formatNumber = (value) => {
    if (!value) return '';
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const unformatNumber = (value) => {
    return value.replace(/,/g, '');
  };

  const toTitleCase = (str) => {
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleNext = () => {
    const formattedCategory = toTitleCase(category);
    navigation.navigate('SecondAddExpense', {
      category: formattedCategory,
      frequency: frequency === 'Custom' && customFrequencyData ? customFrequencyData : frequency,
      cost: cost
    });
  };
  
  const openFrequencyPicker = () => {
    Keyboard.dismiss();
    setTempFrequency(frequency);
    setIsPickerVisible(true);
  };
  
  const handleFrequencyDone = () => {
    if (tempFrequency !== frequency) {
      setFrequency(tempFrequency);
      if (tempFrequency === 'Custom') {
        setCustomModalVisible(true);
      } else {
        setCustomFrequencyData(null);
      }
    }
    setIsPickerVisible(false);
  };
  
  const handleFrequencyCancel = () => {
    setIsPickerVisible(false);
  };

  const renderHeader = () => (
    <TouchableOpacity 
      style={styles.closeButton}
      onPress={() => navigation.goBack()}
    >
      <XMarkIcon size={24} color={colors.primaryBlack} />
    </TouchableOpacity>
  );

  const renderFooter = () => (
    <PrimaryButton
      label="Next"
      isActive={true}
      onPress={handleNext}
    />
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScreenLayoutWithFooter
        header={renderHeader()}
        footer={renderFooter()}
      >
        <View style={styles.content}>
          <ExpenseLogo style={styles.logo} />
          <Text style={styles.title}>Add your{'\n'}operating expenses</Text>

          {/* Category Input */}
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Expense Category</Text>
            <View style={[
              styles.textInputContainer,
              isCategoryFocused && styles.inputFocused
            ]}>
              <TextInput
                style={styles.textInput}
                value={category}
                onChangeText={setCategory}
                placeholder="Enter expense category"
                placeholderTextColor={colors.sixthGrey}
                onFocus={() => setIsCategoryFocused(true)}
                onBlur={() => setIsCategoryFocused(false)}
                keyboardType="default"
                returnKeyType="done"
                onSubmitEditing={Keyboard.dismiss}
              />
            </View>
          </View>

          {/* Frequency and Cost Row */}
          <View style={styles.row}>
            {/* Frequency Dropdown */}
            <View style={styles.frequencyWrapper}>
              <Text style={styles.inputLabel}>Frequency</Text>
              <TouchableOpacity 
                style={[styles.frequencyButton, frequency === 'Custom' && styles.customFrequencyButton]}
                onPress={() => {
                  if (frequency === 'Custom' && customFrequencyData) {
                    setCustomModalVisible(true);
                  } else {
                    openFrequencyPicker();
                  }
                }}
              >
                <Text style={styles.frequencyButtonText}>{frequency}</Text>
                <ChevronDownIcon size={20} color={colors.primaryBlack} />
              </TouchableOpacity>
            </View>

            {/* Cost Input */}
            <View style={styles.costWrapper}>
              <Text style={styles.inputLabel}>Cost</Text>
              <View style={[
                styles.textInputContainer,
                isCostFocused && styles.inputFocused
              ]}>
                <View style={styles.currencyContainer}>
                  <Text style={styles.currencyText}>$</Text>
                </View>
                <TextInput
                  style={styles.textInput}
                  value={formatNumber(cost)}
                  onChangeText={(text) => setCost(unformatNumber(text))}
                  placeholder="0"
                  placeholderTextColor={colors.sixthGrey}
                  keyboardType="numeric"
                  returnKeyType="done"
                  onSubmitEditing={Keyboard.dismiss}
                  onFocus={() => setIsCostFocused(true)}
                  onBlur={() => setIsCostFocused(false)}
                />
              </View>
            </View>
          </View>
          
          <Modal
            visible={isPickerVisible}
            transparent={true}
            animationType="slide"
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.pickerHeader}>
                  <TouchableOpacity onPress={handleFrequencyCancel} style={styles.headerButton}>
                    <Text style={styles.cancelButton}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleFrequencyDone} style={styles.headerButton}>
                    <Text style={styles.doneButton}>Done</Text>
                  </TouchableOpacity>
                </View>
                <Picker
                  selectedValue={tempFrequency}
                  onValueChange={setTempFrequency}
                  style={styles.picker}
                >
                  {frequencies.map((option) => (
                    <Picker.Item 
                      key={option.value} 
                      label={option.label} 
                      value={option.value}
                      color={colors.primaryBlack}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          </Modal>
          
          <CustomFrequencyModal
            visible={customModalVisible}
            onClose={() => setCustomModalVisible(false)}
            onSave={(customData) => {
              setCustomFrequencyData(customData);
            }}
            initialData={customFrequencyData}
          />
        </View>
      </ScreenLayoutWithFooter>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  closeButton: {
    padding: 16,
  },
  content: {
    flex: 1,
  },
  logo: {
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 32,
    color: colors.primaryBlack,
  },
  inputWrapper: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primaryGrey,
    marginBottom: 8,
  },
  textInputContainer: {
    height: 50,
    backgroundColor: colors.tertiaryGrey,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.quaternaryGrey,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputFocused: {
    backgroundColor: colors.iconWhite,
    borderColor: colors.primaryGreen,
  },
  textInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.primaryBlack,
  },
  currencyContainer: {
    marginLeft: 16,
  },
  currencyText: {
    fontSize: 16,
    color: colors.fifthGrey,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  frequencyWrapper: {
    flex: 1,
    position: 'relative',
  },
  frequencyButton: {
    height: 50,
    backgroundColor: colors.tertiaryGrey,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.quaternaryGrey,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  frequencyButtonText: {
    fontSize: 16,
    color: colors.primaryBlack,
  },
  frequencyOptions: {
    position: 'absolute',
    top: 70,
    left: 0,
    right: 0,
    backgroundColor: colors.iconWhite,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: colors.quaternaryGrey,
    zIndex: 1,
    elevation: 3,
  },
  frequencyOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.quaternaryGrey,
  },
  frequencyOptionText: {
    fontSize: 16,
    color: colors.primaryBlack,
  },
  costWrapper: {
    flex: 1,
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
  customFrequencyButton: {
    borderColor: colors.primaryGreen,
    backgroundColor: colors.secondaryBrightGreen,
  }
});

export default FirstAddExpense;