// Drop down menu for loan term from 1 to 30

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronUpDownIcon } from "react-native-heroicons/outline";
import colors from '../Colors/colors.Js';

const LoanTerm = ({ label, value, onValueChange }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const items = Array.from({ length: 30 }, (_, i) => i + 1);

  const openPicker = () => {
    if (Platform.OS === 'ios') {
      setModalVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label} numberOfLines={2} adjustsFontSizeToFit>
        {label}
      </Text>
      <LinearGradient
        colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.05)', 'rgba(0,0,0,0)']}
        style={styles.gradientContainer}
      >
        <TouchableOpacity onPress={openPicker} style={styles.pickerContainer}>
          <Text style={styles.pickerText}>{value}</Text>
          <ChevronUpDownIcon color="#000000" size={20} />
          {Platform.OS === 'android' && (
            <Picker
              style={styles.picker}
              selectedValue={value}
              onValueChange={onValueChange}
            >
              {items.map((item) => (
                <Picker.Item key={item} label={item.toString()} value={item} />
              ))}
            </Picker>
          )}
        </TouchableOpacity>
      </LinearGradient>

      {Platform.OS === 'ios' && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Picker
                selectedValue={value}
                onValueChange={(itemValue) => {
                  onValueChange(itemValue);
                  setModalVisible(false);
                }}
                style={styles.iosPicker}
              >
                {items.map((item) => (
                  <Picker.Item key={item} label={item.toString()} value={item} />
                ))}
              </Picker>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
    flexWrap: 'wrap',
    color: colors.basicText,
  },
  gradientContainer: {
    borderRadius: 10,
    padding: 2,
  },
  pickerContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.fieldColor,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  pickerText: {
    fontSize: 16,
    flex: 1,
  },
  picker: {
    height: 50,
    width: '100%',
    opacity: 0,
    position: 'absolute',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: colors.fieldColor,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  iosPicker: {
    width: '100%',
  },
});

export default LoanTerm;