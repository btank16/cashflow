import React from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, Platform, StatusBar } from 'react-native';
import colors from '../Colors/colors.Js';

/**
 * ScreenLayoutWithFooter - A responsive layout component for screens with a footer
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.header - Header content to display at top
 * @param {React.ReactNode} props.footer - Footer content to display at bottom
 * @param {React.ReactNode} props.children - Content to display in the scrollable area
 * @param {Object} props.style - Additional styles for the container
 * @param {Object} props.contentContainerStyle - Styles for the scrollview content container
 * @param {Object} props.footerStyle - Additional styles for the footer container
 * @param {boolean} props.scrollable - Whether content should be scrollable (default: true)
 * @param {string} props.backgroundColor - Background color for the screen (default: white)
 * @param {number} props.horizontalPadding - Horizontal padding to apply to the layout (default: 16)
 * @param {number} props.headerHeight - Height of the header component (default: 56)
 * @param {number} props.marginBottomAndroid - Bottom margin for the footer on Android (default: 10)
 * @param {number} props.marginBottomIOS - Bottom margin for the footer on iOS (default: 0)
 * @returns {React.ReactNode}
 */
const ScreenLayoutWithFooter = ({ 
  header, 
  footer,
  children, 
  style, 
  contentContainerStyle,
  footerStyle,
  scrollable = true,
  backgroundColor = colors.iconWhite,
  horizontalPadding = 16,
  headerHeight = 56,
  marginBottomAndroid = 12,
  marginBottomIOS = 0
}) => {
  const footerMargin = Platform.OS === 'ios' ? marginBottomIOS : marginBottomAndroid;

  return (
    <SafeAreaView style={[
      styles.safeArea, 
      { 
        backgroundColor,
      }
    ]}>
      <View style={[styles.container, style]}>
        {header && (
          <View style={[
            styles.headerContainer, 
            { 
              paddingHorizontal: horizontalPadding,
              height: headerHeight 
            }
          ]}>
            {header}
          </View>
        )}
        
        {scrollable ? (
          <ScrollView 
            style={styles.content}
            contentContainerStyle={[
              styles.contentContainer, 
              { paddingHorizontal: horizontalPadding },
              contentContainerStyle
            ]}
          >
            {children}
          </ScrollView>
        ) : (
          <View style={[
            styles.content, 
            { paddingHorizontal: horizontalPadding },
            contentContainerStyle
          ]}>
            {children}
          </View>
        )}

        {footer && (
          <View style={[
            styles.footerContainer,
            { 
              paddingHorizontal: horizontalPadding,
              marginBottom: footerMargin,
              backgroundColor
            },
            footerStyle
          ]}>
            {footer}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  headerContainer: {
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 16,
  },
  footerContainer: {
    paddingTop: 8,
    paddingBottom: 0,
  },
});

export default ScreenLayoutWithFooter; 