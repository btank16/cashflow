import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { MapPinIcon, SparklesIcon } from 'react-native-heroicons/outline';
import GooglePlacesInput from './GooglePlacesInput.Js';
import colors from '../Colors/colors.Js';

const AddressSearchBar = ({ onAddressSelect, onResidentAIInput }) => {
  const [mode, setMode] = useState('address'); // 'address' or 'residentAI'
  const [residentAIText, setResidentAIText] = useState('');
  
  return (
    <View style={styles.container}>
      {/* Toggle Buttons */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            mode === 'address' && styles.toggleButtonActive
          ]}
          onPress={() => setMode('address')}
        >
          <MapPinIcon 
            size={18} 
            color={mode === 'address' ? colors.darkGreenPrimary : colors.iconWhite} 
          />
          <Text style={[
            styles.toggleText,
            mode === 'address' && styles.toggleTextActive
          ]}>
            Address
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.toggleButton,
            mode === 'residentAI' && styles.toggleButtonActive
          ]}
          onPress={() => setMode('residentAI')}
        >
          <SparklesIcon 
            size={18} 
            color={mode === 'residentAI' ? colors.darkGreenPrimary : colors.iconWhite} 
          />
          <Text style={[
            styles.toggleText,
            mode === 'residentAI' && styles.toggleTextActive
          ]}>
            ResidentAI
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Search Input */}
      <View style={styles.searchContainer}>
        {mode === 'address' ? (
          <GooglePlacesInput onAddressSelect={onAddressSelect} />
        ) : (
          <TextInput
            style={styles.textInput}
            placeholder="Enter property details..."
            placeholderTextColor={colors.sixthGrey}
            value={residentAIText}
            onChangeText={setResidentAIText}
            onSubmitEditing={() => {
              if (onResidentAIInput && residentAIText.trim()) {
                onResidentAIInput(residentAIText);
              }
            }}
            returnKeyType="search"
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: colors.darkGreenSecondary,
    borderRadius: 30,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.darkGreenTertiary,
    width: 240,
    alignSelf: 'flex-start',
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 26,
  },
  toggleButtonActive: {
    backgroundColor: colors.primaryGreen,
  },
  toggleText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    color: colors.sixthGrey,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  toggleTextActive: {
    color: colors.darkGreenPrimary,
  },
  searchContainer: {
    width: '100%',
  },
  textInput: {
    height: 56,
    backgroundColor: colors.darkGreenSecondary,
    borderRadius: 28,
    paddingHorizontal: 24,
    color: colors.iconWhite,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.darkGreenTertiary,
  },
});

export default AddressSearchBar;