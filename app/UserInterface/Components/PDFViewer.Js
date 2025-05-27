import React, { useState } from 'react';
import { View, Modal, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import Pdf from 'react-native-pdf';
import { Ionicons } from '@expo/vector-icons';
import colors from '../Colors/colors.Js';

const PDFViewer = ({ source, visible = false, onClose }) => {
  const [loading, setLoading] = useState(true);

  const handleLoadComplete = () => {
    setLoading(false);
  };

  const handleError = (error) => {
    console.log('PDF Error:', error);
    setLoading(false);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.pdfContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color={colors.iconWhite} />
          </TouchableOpacity>
          
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primaryGreen} />
            </View>
          )}
          
          <Pdf
            source={source}
            onLoadComplete={handleLoadComplete}
            onError={handleError}
            style={styles.pdf}
            trustAllCerts={false}
            enablePaging={false}
            spacing={3}
            horizontal={false}
            enableAnnotationRendering={true}
            fitPolicy={0}
            renderActivityIndicator={() => null}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  pdfContainer: {
    width: Dimensions.get('window').width * 0.9,
    height: Dimensions.get('window').height * 0.85,
    backgroundColor: colors.tertiaryGrey,
    borderRadius: 10,
    overflow: 'hidden',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
    backgroundColor: colors.primaryGrey,
    padding: 8,
    borderRadius: 15,
  },
  pdf: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0,
  },
});

export default PDFViewer;
