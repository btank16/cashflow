import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, TextInput } from 'react-native';
import { XMarkIcon, CheckIcon } from 'react-native-heroicons/outline';
import colors from '../Colors/colors.Js';

const months = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'
];

const monthsShort = [
  'Jan', 'Feb', 'Mar', 'Apr',
  'May', 'Jun', 'Jul', 'Aug',
  'Sep', 'Oct', 'Nov', 'Dec'
];

const CustomFrequencyModal = ({ 
  visible, 
  onClose, 
  onSave,
  initialData = null
}) => {
  const [activeTab, setActiveTab] = useState('monthly');
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [yearInterval, setYearInterval] = useState('1');
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [occursFirstYear, setOccursFirstYear] = useState(true);

  // Load initial data when modal opens
  useEffect(() => {
    if (visible && initialData) {
      try {
        const data = typeof initialData === 'string' ? JSON.parse(initialData) : initialData;
        if (data.type === 'custom') {
          if (data.pattern === 'monthly') {
            setActiveTab('monthly');
            setSelectedMonths(data.months || []);
          } else if (data.pattern === 'annual') {
            setActiveTab('annual');
            setYearInterval(String(data.years || 1));
            setSelectedMonth(data.month || 0);
            setOccursFirstYear(data.firstYear !== false);
          }
        }
      } catch (error) {
        // Reset to defaults if parsing fails
        resetToDefaults();
      }
    } else if (visible) {
      resetToDefaults();
    }
  }, [visible, initialData]);

  const resetToDefaults = () => {
    setActiveTab('monthly');
    setSelectedMonths([]);
    setYearInterval('1');
    setSelectedMonth(0);
    setOccursFirstYear(true);
  };

  const toggleMonth = (monthIndex) => {
    setSelectedMonths(prev => {
      if (prev.includes(monthIndex)) {
        return prev.filter(m => m !== monthIndex);
      } else {
        return [...prev, monthIndex].sort((a, b) => a - b);
      }
    });
  };

  // Clear selections when switching tabs
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'monthly') {
      // Clear annual selections
      setYearInterval('1');
      setSelectedMonth(0);
      setOccursFirstYear(true);
    } else {
      // Clear monthly selections
      setSelectedMonths([]);
    }
  };

  // Handle year interval input with validation
  const handleYearIntervalChange = (text) => {
    // Remove non-numeric characters
    const numericText = text.replace(/[^0-9]/g, '');
    
    if (numericText === '') {
      setYearInterval('');
    } else {
      const num = parseInt(numericText);
      if (num >= 1 && num <= 10) {
        setYearInterval(numericText);
      } else if (num > 10) {
        setYearInterval('10');
      }
    }
  };

  const handleSave = () => {
    let customData;
    
    if (activeTab === 'monthly') {
      customData = {
        type: 'custom',
        pattern: 'monthly',
        months: selectedMonths
      };
    } else {
      customData = {
        type: 'custom',
        pattern: 'annual',
        years: parseInt(yearInterval) || 1,
        month: selectedMonth,
        firstYear: occursFirstYear
      };
    }
    
    onSave(JSON.stringify(customData));
    onClose();
  };

  const isValidToSave = () => {
    if (activeTab === 'monthly') {
      return selectedMonths.length > 0;
    } else {
      const num = parseInt(yearInterval);
      return yearInterval !== '' && num >= 1 && num <= 10;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Custom Frequency</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <XMarkIcon size={24} color={colors.primaryGrey} />
            </TouchableOpacity>
          </View>

          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'monthly' && styles.activeTab]}
              onPress={() => handleTabChange('monthly')}
            >
              <Text style={[styles.tabText, activeTab === 'monthly' && styles.activeTabText]}>
                Monthly
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'annual' && styles.activeTab]}
              onPress={() => handleTabChange('annual')}
            >
              <Text style={[styles.tabText, activeTab === 'annual' && styles.activeTabText]}>
                Annual
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {activeTab === 'monthly' ? (
              <View>
                <Text style={styles.sectionTitle}>Select applicable months</Text>
                <View style={styles.monthsGrid}>
                  {months.map((month, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.monthButton,
                        selectedMonths.includes(index) && styles.monthButtonSelected
                      ]}
                      onPress={() => toggleMonth(index)}
                    >
                      <Text style={[
                        styles.monthButtonText,
                        selectedMonths.includes(index) && styles.monthButtonTextSelected
                      ]}>
                        {monthsShort[index]}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {selectedMonths.length > 0 && (
                  <Text style={styles.selectionSummary}>
                    Selected: {selectedMonths.map(i => monthsShort[i]).join(', ')}
                  </Text>
                )}
              </View>
            ) : (
              <View>
                <Text style={styles.sectionTitle}>Frequency</Text>
                <View style={styles.yearSelectorContainer}>
                  <Text style={styles.yearLabel}>Every</Text>
                  <TextInput
                    style={styles.yearInput}
                    value={yearInterval}
                    onChangeText={handleYearIntervalChange}
                    keyboardType="numeric"
                    maxLength={2}
                    placeholder="1"
                    placeholderTextColor={colors.sixthGrey}
                  />
                  <Text style={styles.yearLabel}>year{parseInt(yearInterval) > 1 ? 's' : ''}</Text>
                </View>
                <Text style={styles.helperText}>Enter a value between 1-10</Text>

                <Text style={styles.sectionTitle}>Select month</Text>
                <View style={styles.monthsGrid}>
                  {months.map((month, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.monthButton,
                        selectedMonth === index && styles.monthButtonSelected
                      ]}
                      onPress={() => setSelectedMonth(index)}
                    >
                      <Text style={[
                        styles.monthButtonText,
                        selectedMonth === index && styles.monthButtonTextSelected
                      ]}>
                        {monthsShort[index]}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity
                  style={styles.checkboxContainer}
                  onPress={() => setOccursFirstYear(!occursFirstYear)}
                >
                  <View style={[
                    styles.checkbox,
                    occursFirstYear && styles.checkboxChecked
                  ]}>
                    {occursFirstYear && <CheckIcon size={16} color={colors.iconWhite} />}
                  </View>
                  <Text style={styles.checkboxLabel}>Occurs first year?</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.saveButton, !isValidToSave() && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={!isValidToSave()}
            >
              <Text style={[styles.saveButtonText, !isValidToSave() && styles.saveButtonTextDisabled]}>
                Save
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.iconWhite,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.quaternaryGrey,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primaryBlack,
  },
  closeButton: {
    padding: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: colors.quaternaryGrey,
  },
  activeTab: {
    borderBottomColor: colors.primaryGreen,
  },
  tabText: {
    fontSize: 16,
    color: colors.primaryGrey,
    fontWeight: '500',
  },
  activeTabText: {
    color: colors.primaryGreen,
  },
  content: {
    padding: 20,
    minHeight: 300,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.primaryBlack,
    marginBottom: 12,
    marginTop: 8,
  },
  monthsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },
  monthButton: {
    width: '31%',
    paddingVertical: 14,
    backgroundColor: colors.tertiaryGrey,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.quaternaryGrey,
  },
  monthButtonSelected: {
    backgroundColor: colors.primaryGreen,
    borderColor: colors.primaryGreen,
  },
  monthButtonText: {
    fontSize: 14,
    color: colors.primaryBlack,
    fontWeight: '500',
  },
  monthButtonTextSelected: {
    color: colors.iconWhite,
  },
  selectionSummary: {
    marginTop: 16,
    fontSize: 14,
    color: colors.primaryGrey,
    fontStyle: 'italic',
  },
  yearSelectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  yearLabel: {
    fontSize: 16,
    color: colors.primaryBlack,
    marginHorizontal: 8,
  },
  yearInput: {
    width: 60,
    height: 50,
    backgroundColor: colors.tertiaryGrey,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.quaternaryGrey,
    textAlign: 'center',
    fontSize: 16,
    color: colors.primaryBlack,
  },
  helperText: {
    fontSize: 12,
    color: colors.primaryGrey,
    marginBottom: 20,
    fontStyle: 'italic',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.quaternaryGrey,
    backgroundColor: colors.iconWhite,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primaryGreen,
    borderColor: colors.primaryGreen,
  },
  checkboxLabel: {
    fontSize: 14,
    color: colors.primaryBlack,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors.quaternaryGrey,
  },
  saveButton: {
    backgroundColor: colors.primaryGreen,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: colors.quaternaryGrey,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.iconWhite,
  },
  saveButtonTextDisabled: {
    color: colors.primaryGrey,
  },
});

export default CustomFrequencyModal;