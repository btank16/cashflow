import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Modal, Image, Alert, Platform } from 'react-native';
import { MapPinIcon, SparklesIcon, ChevronDownIcon, MagnifyingGlassIcon, PlusIcon, XMarkIcon, PhotoIcon } from 'react-native-heroicons/outline';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import GooglePlacesInput from './GooglePlacesInput.Js';
import colors from '../Colors/colors.Js';

const AddressSearchBar = ({ onAddressSelect, onResidentAIInput }) => {
  const [mode, setMode] = useState('address'); // 'address' or 'residentAI'
  const [residentAIText, setResidentAIText] = useState('');
  const [condition, setCondition] = useState('');
  const [strategy, setStrategy] = useState('');
  const [isConditionPickerVisible, setIsConditionPickerVisible] = useState(false);
  const [isStrategyPickerVisible, setIsStrategyPickerVisible] = useState(false);
  const [tempCondition, setTempCondition] = useState('');
  const [tempStrategy, setTempStrategy] = useState('');
  const [selectedAddress, setSelectedAddress] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePickerVisible, setImagePickerVisible] = useState(false);
  const googlePlacesRef = useRef(null);
  
  // Check for image permissions on mount
  useEffect(() => {
    const checkImagePermissions = async () => {
      if (Platform.OS === 'ios' || Platform.OS === 'android') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          console.log('Media library permissions not granted');
        }
      }
    };
    
    checkImagePermissions();
  }, []);
  
  const handleConditionPress = () => {
    setTempCondition(condition || '');
    setIsConditionPickerVisible(true);
  };

  const handleStrategyPress = () => {
    setTempStrategy(strategy || '');
    setIsStrategyPickerVisible(true);
  };

  const handleConditionDone = () => {
    setCondition(tempCondition);
    setIsConditionPickerVisible(false);
  };

  const handleStrategyDone = () => {
    setStrategy(tempStrategy);
    setIsStrategyPickerVisible(false);
  };

  const handleConditionCancel = () => {
    setIsConditionPickerVisible(false);
    setTempCondition(condition || '');
  };

  const handleStrategyCancel = () => {
    setIsStrategyPickerVisible(false);
    setTempStrategy(strategy || '');
  };

  const handleAddressData = (data, details) => {
    setSelectedAddress(data.description);
  };

  const handleSearch = () => {
    if (mode === 'address') {
      if (selectedAddress && onAddressSelect) {
        onAddressSelect({ 
          description: selectedAddress,
          condition: condition || '',
          strategy: strategy || ''
        });
      }
    } else {
      // ResidentAI mode
      if (selectedImage) {
        // Handle image input
        if (onResidentAIInput) {
          onResidentAIInput({ 
            type: 'image', 
            data: selectedImage,
            condition: condition || '',
            strategy: strategy || ''
          });
        }
      } else if (residentAIText.trim() && onResidentAIInput) {
        // Handle text input
        onResidentAIInput({ 
          type: 'text', 
          data: residentAIText,
          condition: condition || '',
          strategy: strategy || ''
        });
      }
    }
  };
  
  const handleImageSelection = async (type) => {
    try {
      let result;
      
      if (type === 'camera') {
        // Request camera permission
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission needed', 'Please allow camera access to take photos');
          return;
        }
        
        // Launch camera without cropping
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: false,
          quality: 0.8,
        });
      } else {
        // Request media library permission
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission needed', 'Please allow photo library access to select images');
          return;
        }
        
        // Launch image picker without cropping
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: false,
          quality: 0.8,
        });
      }
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedImage(result.assets[0]);
        // Clear text when image is selected (mutually exclusive)
        setResidentAIText('');
      }
      
      setImagePickerVisible(false);
    } catch (error) {
      console.error('Error selecting image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
      setImagePickerVisible(false);
    }
  };
  
  const handlePlusButtonPress = () => {
    if (mode === 'residentAI') {
      setImagePickerVisible(true);
    }
  };
  
  const clearImage = () => {
    setSelectedImage(null);
  };
  
  const handleTextChange = (text) => {
    setResidentAIText(text);
    // Clear image when text is entered (mutually exclusive)
    if (text.trim() !== '' && selectedImage) {
      setSelectedImage(null);
    }
  };
  
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
          <View style={styles.inputWithButtonContainer}>
            <View style={styles.googlePlacesContainer}>
              <GooglePlacesInput 
                ref={googlePlacesRef}
                onAddressSelect={handleAddressData} 
              />
            </View>
            <TouchableOpacity 
              style={styles.searchButton}
              onPress={handleSearch}
            >
              <MagnifyingGlassIcon size={20} color={colors.iconWhite} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.inputWithButtonContainer}>
            {selectedImage ? (
              // Image attachment display inside search bar
              <View style={styles.imageAttachmentContainer}>
                <Image 
                  source={{ uri: selectedImage.uri }} 
                  style={styles.attachmentPreview} 
                />
                <View style={styles.attachmentInfo}>
                  <Text style={styles.attachmentName} numberOfLines={1}>
                    {selectedImage.uri.split('/').pop() || 'Image'}
                  </Text>
                </View>
                <TouchableOpacity 
                  style={styles.clearAttachmentButton}
                  onPress={clearImage}
                >
                  <XMarkIcon size={16} color={colors.iconWhite} />
                </TouchableOpacity>
              </View>
            ) : (
              // Text input
              <TextInput
                style={styles.residentAIInput}
                placeholder="Enter property details..."
                placeholderTextColor={colors.sixthGrey}
                value={residentAIText}
                onChangeText={handleTextChange}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
              />
            )}
            <TouchableOpacity 
              style={styles.plusButton}
              onPress={handlePlusButtonPress}
            >
              <PlusIcon size={20} color={colors.iconWhite} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.searchButton}
              onPress={handleSearch}
            >
              <MagnifyingGlassIcon size={20} color={colors.iconWhite} />
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      {/* Dropdown Menus */}
      <View style={styles.dropdownContainer}>
        <TouchableOpacity 
          style={styles.dropdownButton}
          onPress={handleConditionPress}
          activeOpacity={0.7}
        >
          <Text style={[styles.dropdownText, !condition && styles.placeholderText]}>
            {condition || 'Condition'}
          </Text>
          <ChevronDownIcon size={20} color={colors.iconWhite} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.dropdownButton, styles.secondDropdown]}
          onPress={handleStrategyPress}
          activeOpacity={0.7}
        >
          <Text style={[styles.dropdownText, !strategy && styles.placeholderText]}>
            {strategy || 'Strategy'}
          </Text>
          <ChevronDownIcon size={20} color={colors.iconWhite} />
        </TouchableOpacity>
      </View>
      
      {/* Condition Picker Modal */}
      <Modal
        visible={isConditionPickerVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.pickerHeader}>
              <TouchableOpacity onPress={handleConditionCancel} style={styles.headerButton}>
                <Text style={styles.cancelButton}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleConditionDone} style={styles.headerButton}>
                <Text style={styles.doneButton}>Done</Text>
              </TouchableOpacity>
            </View>
            <Picker
              selectedValue={tempCondition}
              onValueChange={setTempCondition}
              style={styles.picker}
            >
              <Picker.Item label="Select Condition" value="" color={colors.sixthGrey} />
              <Picker.Item label="Unsure" value="Unsure" color={colors.iconWhite} />
              <Picker.Item label="Heavy Rehab" value="Heavy Rehab" color={colors.iconWhite} />
              <Picker.Item label="Mild Rehab" value="Mild Rehab" color={colors.iconWhite} />
              <Picker.Item label="Light Rehab" value="Light Rehab" color={colors.iconWhite} />
              <Picker.Item label="Turnkey - Average" value="Turnkey - Average" color={colors.iconWhite} />
              <Picker.Item label="Turnkey - Premium" value="Turnkey - Premium" color={colors.iconWhite} />
            </Picker>
          </View>
        </View>
      </Modal>
      
      {/* Strategy Picker Modal */}
      <Modal
        visible={isStrategyPickerVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.pickerHeader}>
              <TouchableOpacity onPress={handleStrategyCancel} style={styles.headerButton}>
                <Text style={styles.cancelButton}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleStrategyDone} style={styles.headerButton}>
                <Text style={styles.doneButton}>Done</Text>
              </TouchableOpacity>
            </View>
            <Picker
              selectedValue={tempStrategy}
              onValueChange={setTempStrategy}
              style={styles.picker}
            >
              <Picker.Item label="Select Strategy" value="" color={colors.sixthGrey} />
              <Picker.Item label="Rental" value="Rental" color={colors.iconWhite} />
              <Picker.Item label="Flip" value="Flip" color={colors.iconWhite} />
            </Picker>
          </View>
        </View>
      </Modal>
      
      {/* Image Picker Modal */}
      <Modal
        visible={imagePickerVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.pickerHeader}>
              <TouchableOpacity onPress={() => setImagePickerVisible(false)} style={styles.headerButton}>
                <Text style={styles.cancelButton}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Select Image</Text>
              <View style={styles.headerButton} />
            </View>
            <View style={styles.imagePickerOptions}>
              <TouchableOpacity 
                style={styles.imagePickerOption}
                onPress={() => handleImageSelection('camera')}
              >
                <View style={styles.imagePickerIconContainer}>
                  <PhotoIcon size={32} color={colors.primaryGreen} />
                </View>
                <Text style={styles.imagePickerText}>Take Photo</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.imagePickerOption}
                onPress={() => handleImageSelection('gallery')}
              >
                <View style={styles.imagePickerIconContainer}>
                  <PhotoIcon size={32} color={colors.primaryGreen} />
                </View>
                <Text style={styles.imagePickerText}>Choose from Gallery</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    zIndex: 50,
    elevation: 3,
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
    zIndex: 50,
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
    zIndex: 50,
    position: 'relative',
  },
  inputWithButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 50,
  },
  googlePlacesContainer: {
    flex: 1,
    height: 56,
    zIndex: 50,
  },
  residentAIInput: {
    flex: 1,
    height: 56,
    backgroundColor: colors.darkGreenSecondary,
    paddingHorizontal: 24,
    color: colors.iconWhite,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.darkGreenTertiary,
    borderTopLeftRadius: 28,
    borderBottomLeftRadius: 28,
    borderRightWidth: 0,
  },
  imageAttachmentContainer: {
    flex: 1,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.darkGreenSecondary,
    borderWidth: 1,
    borderColor: colors.darkGreenTertiary,
    borderTopLeftRadius: 28,
    borderBottomLeftRadius: 28,
    borderRightWidth: 0,
    paddingLeft: 12,
    paddingRight: 12,
  },
  attachmentPreview: {
    width: 32,
    height: 32,
    borderRadius: 4,
    marginRight: 8,
  },
  attachmentInfo: {
    flex: 1,
  },
  attachmentName: {
    color: colors.iconWhite,
    fontSize: 14,
  },
  clearAttachmentButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  plusButton: {
    height: 56,
    width: 56,
    backgroundColor: colors.darkGreenSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.darkGreenTertiary,
  },
  searchButton: {
    height: 56,
    width: 56,
    backgroundColor: colors.primaryGreen,
    borderTopRightRadius: 28,
    borderBottomRightRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    width: '100%',
    zIndex: 40,
  },
  dropdownButton: {
    flex: 1,
    height: 56,
    backgroundColor: colors.darkGreenSecondary,
    borderRadius: 28,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.darkGreenTertiary,
  },
  secondDropdown: {
    marginLeft: 12,
  },
  dropdownText: {
    fontSize: 16,
    color: colors.iconWhite,
    fontWeight: '500',
  },
  placeholderText: {
    color: colors.sixthGrey,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: colors.darkGreenSecondary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: colors.darkGreenTertiary,
    zIndex: 1001,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.darkGreenTertiary,
    padding: 16,
    alignItems: 'center',
  },
  headerButton: {
    paddingHorizontal: 8,
    minWidth: 60,
  },
  doneButton: {
    color: colors.primaryGreen,
    fontSize: 16,
    fontWeight: '500',
  },
  cancelButton: {
    color: colors.sixthGrey,
    fontSize: 16,
  },
  picker: {
    backgroundColor: colors.darkGreenSecondary,
    color: colors.iconWhite,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.iconWhite,
  },
  imagePickerOptions: {
    padding: 20,
  },
  imagePickerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.darkGreenTertiary,
  },
  imagePickerIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.darkGreenTertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  imagePickerText: {
    fontSize: 16,
    color: colors.iconWhite,
  },
});

export default AddressSearchBar;