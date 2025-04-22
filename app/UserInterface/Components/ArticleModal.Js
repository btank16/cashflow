import React, { useState, useEffect } from 'react';
import { Modal, View, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { ChevronLeftIcon, XMarkIcon } from 'react-native-heroicons/outline';
import colors from '../Colors/colors.Js';

/**
 * A modal component that displays markdown content
 * @param {Object} props
 * @param {boolean} props.visible - Whether the modal is visible
 * @param {function} props.onClose - Function to call when the modal is closed
 * @param {string} props.title - Title of the markdown content
 * @param {string} props.markdownContent - The markdown content to display
 * @param {string} props.markdownFile - Path to a markdown file (alternative to markdownContent)
 * @returns {JSX.Element}
 */
const MarkdownModal = ({ visible, onClose, title, markdownContent, markdownFile }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      if (markdownContent) {
        setContent(markdownContent);
      } else if (markdownFile) {
        setLoading(true);
        // Dynamic import of the markdown file
        try {
          const fetchMarkdown = async () => {
            const response = await fetch(markdownFile);
            const text = await response.text();
            setContent(text);
            setLoading(false);
          };
          
          fetchMarkdown();
        } catch (error) {
          console.error('Error loading markdown file:', error);
          setContent(`# Error\nFailed to load markdown content: ${error.message}`);
          setLoading(false);
        }
      }
    }
  }, [visible, markdownContent, markdownFile]);

  // Markdown styling configuration
  const markdownStyles = {
    body: {
      color: colors.primaryBlack,
      fontSize: 16,
      lineHeight: 24,
      paddingHorizontal: 2,
      width: '100%',
    },
    heading1: {
      fontSize: 24,
      marginTop: 24,
      marginBottom: 16,
      fontWeight: 'bold',
      color: colors.primaryGreen,
      lineHeight: 32,
      flexWrap: 'wrap',
      width: '100%',
    },
    heading2: {
      fontSize: 20,
      marginTop: 20,
      marginBottom: 12,
      fontWeight: 'bold',
      color: colors.primaryGreen,
      lineHeight: 28,
      flexWrap: 'wrap',
      width: '100%',
    },
    heading3: {
      fontSize: 18,
      marginTop: 16,
      marginBottom: 8,
      fontWeight: 'bold',
      color: colors.primaryGreen,
      lineHeight: 24,
      flexWrap: 'wrap',
      width: '100%',
    },
    paragraph: {
      marginVertical: 8,
      width: '100%',
    },
    list_item: {
      marginVertical: 4,
      flexDirection: 'row',
      width: '100%',
    },
    link: {
      color: colors.primaryBlue,
      textDecorationLine: 'underline',
    },
    blockquote: {
      backgroundColor: colors.mainTint,
      borderLeftWidth: 4,
      borderLeftColor: colors.primaryGreen,
      paddingHorizontal: 12,
      paddingVertical: 8,
      marginVertical: 8,
      width: '100%',
    },
    code_block: {
      backgroundColor: colors.darkGreenTertiary,
      padding: 10,
      borderRadius: 4,
      fontFamily: 'Courier',
      color: colors.iconWhite,
      width: '100%',
    },
    code_inline: {
      backgroundColor: colors.darkGreenTertiary,
      padding: 4,
      borderRadius: 4,
      fontFamily: 'Courier',
      color: colors.iconWhite,
    },
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <XMarkIcon color={colors.primaryBlack} size={24} />
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          style={styles.contentContainer} 
          contentContainerStyle={styles.contentContainerStyle}
          showsVerticalScrollIndicator={true}
          scrollEventThrottle={16}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primaryGreen} />
            </View>
          ) : (
            <View style={styles.markdownContainer}>
              <Markdown style={markdownStyles}>
                {content}
              </Markdown>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.iconWhite,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.mainTint,
  },
  closeButton: {
    padding: 4,
  },
  contentContainer: {
    flex: 1,
  },
  contentContainerStyle: {
    paddingBottom: 40,
  },
  markdownContainer: {
    padding: 16,
    width: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default MarkdownModal; 