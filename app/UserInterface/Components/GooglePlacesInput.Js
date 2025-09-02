import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Keyboard } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import secretKeys from '../../../secretkeys.json';
import colors from '../Colors/colors.Js';

const GooglePlacesInput = forwardRef(({ onAddressSelect }, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const autocompleteRef = useRef(null);
  
  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    getAddressText: () => {
      return autocompleteRef.current?.getAddressText() || '';
    },
    setAddressText: (text) => {
      autocompleteRef.current?.setAddressText(text);
    },
    clear: () => {
      autocompleteRef.current?.clear();
    }
  }));
  
  const handleSelectAddress = (data) => {
    // Update the text in the input field
    autocompleteRef.current?.setAddressText(data.description);
    
    // Call the parent's onAddressSelect callback
    if (onAddressSelect) {
      onAddressSelect(data, null);
    }
    
    // Hide dropdown and dismiss keyboard
    setIsFocused(false);
    Keyboard.dismiss();
  };
  
  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        ref={autocompleteRef}
        placeholder='Enter property address...'
        fetchDetails={true}
        onPress={(data, details = null) => {
          // This is called when an item is selected from the dropdown
          if (onAddressSelect) {
            onAddressSelect(data, details);
          }
          setIsFocused(false);
        }}
        query={{
          key: secretKeys.googlemaps.apikey,
          language: 'en',
          types: 'address',
          components: 'country:us', // Limit search to USA
        }}
        styles={{
          container: {
            flex: 0,
            width: '100%',
          },
          textInputContainer: {
            backgroundColor: 'transparent',
            borderRadius: 0,
            borderWidth: 0,
            borderColor: 'transparent',
            paddingHorizontal: 0,
          },
          textInput: {
            height: 56,
            color: colors.iconWhite,
            fontSize: 16,
            backgroundColor: colors.darkGreenSecondary,
            paddingHorizontal: 24,
            borderWidth: 1,
            borderColor: colors.darkGreenTertiary,
            borderTopLeftRadius: 28,
            borderBottomLeftRadius: 28,
            borderRightWidth: 0,
          },
          listView: {
            backgroundColor: colors.darkGreenSecondary,
            borderWidth: 1,
            borderColor: colors.darkGreenTertiary,
            borderRadius: 12,
            marginTop: 8,
            position: 'absolute',
            top: 58,
            left: 0,
            right: 0,
            zIndex: 9999,
            elevation: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 3.84,
            maxHeight: 200,
          },
          row: {
            backgroundColor: colors.darkGreenSecondary,
            padding: 0,
          },
          separator: {
            height: 1,
            backgroundColor: colors.darkGreenTertiary,
          },
          description: {
            color: 'transparent', // Hide the default text
          },
        }}
        textInputProps={{
          placeholderTextColor: colors.sixthGrey,
          onFocus: () => setIsFocused(true),
        }}
        enablePoweredByContainer={false} // Remove "powered by Google" note
        debounce={300}
        minLength={2}
        keyboardShouldPersistTaps="handled"
        listEmptyComponent={() => null}
        predefinedPlaces={[]}
        nearbyPlacesAPI="GooglePlacesSearch"
        suppressDefaultStyles={false}
        renderRow={(data) => {
          return (
            <TouchableOpacity 
              style={styles.rowContainer}
              onPress={() => handleSelectAddress(data)}
            >
              <Text style={styles.rowText} numberOfLines={2}>
                {data.description}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 2,
    width: '100%',
  },
  rowContainer: {
    padding: 15,
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: colors.darkGreenTertiary,
  },
  rowText: {
    color: colors.iconWhite,
    fontSize: 14,
  },
});

export default GooglePlacesInput; 