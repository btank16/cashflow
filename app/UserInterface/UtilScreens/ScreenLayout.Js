import React from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, Platform, ScrollView } from 'react-native';
import colors from '../Colors/colors.Js';

/**
 * ScreenLayout - A responsive layout component for screens
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.header - Header content to display at top
 * @param {React.ReactNode} props.children - Content to display in the scrollable area
 * @param {Object} props.style - Additional styles for the container
 * @param {Object} props.contentContainerStyle - Styles for the scrollview content container
 * @param {boolean} props.scrollable - Whether content should be scrollable (default: true)
 * @param {string} props.backgroundColor - Background color for the screen (default: white)
 * @param {number} props.horizontalPadding - Horizontal padding to apply to the layout (default: 16)
 * @param {number} props.headerHeight - Height of the header component (default: 56)
 * @returns {React.ReactNode}
 */
const ScreenLayout = ({ 
  header, 
  children, 
  style, 
  contentContainerStyle,
  scrollable = true,
  backgroundColor = colors.iconWhite,
  horizontalPadding = 16,
  headerHeight = 56
}) => {
  return (
    <SafeAreaView style={[
      styles.safeArea, 
      { backgroundColor }
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
    paddingBottom: 24,
  },
});

export default ScreenLayout; 