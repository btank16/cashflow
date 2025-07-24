import React, { useState, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Keyboard } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import secretKeys from '../../../secretkeys.json';
import colors from '../Colors/colors.Js';

const GooglePlacesInput = ({ onAddressSelect }) => {
  const [isFocused, setIsFocused] = useState(false);
  const autocompleteRef = useRef(null);
  
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
            backgroundColor: colors.darkGreenPrimary,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.darkGreenTertiary,
          },
          textInput: {
            height: 48,
            color: colors.iconWhite,
            fontSize: 16,
            backgroundColor: colors.darkGreenPrimary,
            paddingHorizontal: 16,
          },
          listView: {
            backgroundColor: colors.darkGreenSecondary,
            borderWidth: 1,
            borderColor: colors.darkGreenTertiary,
            borderRadius: 8,
            marginTop: 5,
            position: 'absolute',
            top: 50,
            left: 0,
            right: 0,
            zIndex: 9999,
            elevation: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
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
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 2,
    width: '100%',
  },
  rowContainer: {
    padding: 15,
    backgroundColor: colors.darkGreenPrimary,
    borderBottomWidth: 1,
    borderBottomColor: colors.darkGreenTertiary,
  },
  rowText: {
    color: colors.iconWhite,
    fontSize: 14,
  },
});

export default GooglePlacesInput; 