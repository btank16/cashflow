import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { XMarkIcon } from 'react-native-heroicons/outline';
import colors from '../Colors/colors.Js';

/**
 * InfoComponent - A modal that displays information with a title and description
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.visible - Whether the modal is visible
 * @param {Function} props.onClose - Function to call when modal is closed
 * @param {string} props.title - Title of the modal
 * @param {string} props.description - Description text for the modal
 */
const InfoComponent = ({
  visible,
  onClose,
  title,
  description,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <XMarkIcon size={24} color={colors.primaryBlack} />
          </TouchableOpacity>
          
          <View style={styles.contentContainer}>
            {title && <Text style={styles.title}>{title}</Text>}
            {description && <Text style={styles.description}>{description}</Text>}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.85,
    backgroundColor: colors.iconWhite,
    borderRadius: 16,
    padding: 24,
    shadowColor: colors.primaryBlack,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
  },
  contentContainer: {
    marginTop: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.primaryBlack,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: colors.primaryGrey,
    lineHeight: 24,
  },
});

export default InfoComponent; 