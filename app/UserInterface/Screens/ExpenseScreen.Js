import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Platform, StatusBar, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';
import colors from '../Colors/colors.Js';
import CalcButton from '../Components/CalcButton.Js';
import ExpenseLogo from '../../assets/icons/ExpenseLogo.jsx';

const ExpenseScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.masterBackground}>
      <View style={styles.logoContainer}>
        <TouchableOpacity 
          onPress={() => navigation.navigate('UserScreen')}
          style={styles.backButton}
        >
          <ChevronLeftIcon
            size={24}
            color={colors.primaryBlack}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Default operating expenses</Text>
      </View>

      <ScrollView 
        style={styles.contentContainer}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.centerContent}>
          <View style={styles.logoWrapper}>
            <ExpenseLogo />
          </View>

          <Text style={styles.title}>
            You don't have any{'\n'}Operating Expenses
          </Text>
          <Text style={styles.description}>
            Add expenses that you regularly use for each calculator. This may include property insurance, maintenance, utilities, management fees, etc.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.menuContainer}>
        <CalcButton
          title="+  Add Operating Expenses"
          onPress={() => {
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  masterBackground: {
    flex: 1,
    backgroundColor: colors.iconWhite,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  logoContainer: {
    flexDirection: 'row',
    height: 32,
    alignItems: 'center',
    backgroundColor: colors.iconWhite,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primaryBlack,
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: colors.iconWhite,
  },
  scrollContent: {
    flexGrow: 1,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  logoWrapper: {
    marginBottom: 12,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.primaryBlack,
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: colors.primaryGrey,
    textAlign: 'center',
    lineHeight: 24,
  },
  menuContainer: {
    height: 56,
    backgroundColor: colors.iconWhite,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backButton: {
    padding: 8,
    zIndex: 1,
  },
});

export default ExpenseScreen;