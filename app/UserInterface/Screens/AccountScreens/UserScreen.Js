import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform, StatusBar, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeftIcon, ChevronRightIcon } from "react-native-heroicons/outline";
import { signOut } from '@aws-amplify/auth';
import colors from '../../Colors/colors.Js';

// Import icons
import UserIcon from '../../../assets/icons/UserIcon.jsx';
import LockIcon from '../../../assets/icons/LockIcon.jsx';
import CalculatorIcon from '../../../assets/icons/CalculatorIcon.jsx';
import FeedbackIcon from '../../../assets/icons/FeedbackIcon.jsx';
import ExitIcon from '../../../assets/icons/ExitIcon.jsx';

const UserScreen = () => {
  const navigation = useNavigation();

  const handleSignOut = async () => {
    try {
      await signOut();
      // Navigate to Auth stack after successful sign out
      navigation.reset({
        index: 0,
        routes: [{ name: 'Auth' }],
      });
    } catch (error) {
      Alert.alert(
        'Sign Out Failed',
        'There was an error signing out. Please try again.'
      );
    }
  };

  const MenuButton = ({ icon: Icon, title, color, onPress }) => (
    <TouchableOpacity style={styles.menuButton} onPress={onPress}>
      <View style={[styles.iconContainer, { backgroundColor: color }]}>
        <Icon />
      </View>
      <Text style={styles.menuButtonText}>{title}</Text>
      <ChevronRightIcon size={24} color={colors.iconWhite} style={{ opacity: 0.7 }} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.navigate('CalcHomeScreen')}
        >
          <ChevronLeftIcon size={28} color={colors.iconWhite} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <View style={styles.backButton} />
      </View>

      <View style={styles.profileInfo}>
        <Text style={styles.name}>John Smith</Text>
        <Text style={styles.username}>@john_smith</Text>
      </View>

      <View style={styles.menuGroup}>
        <MenuButton
          icon={UserIcon}
          title="Personal info"
          color={colors.primaryGreen}
          onPress={() => navigation.navigate('PersonalInfo')}
        />
        <MenuButton
          icon={LockIcon}
          title="Security"
          color={colors.primaryOrange}
          onPress={() => navigation.navigate('Security')}
        />
        <MenuButton
          icon={CalculatorIcon}
          title="Default operating expenses"
          color={colors.brightGreen}
          onPress={() => navigation.navigate('ExpenseScreen')}
        />
      </View>

      <View style={styles.menuGroup}>
        <MenuButton
          icon={FeedbackIcon}
          title="Leave feedback"
          color={colors.primaryPurple}
          onPress={() => navigation.navigate('FeedbackScreen')}
        />
      </View>

      <View style={styles.menuGroup}>
        <MenuButton
          icon={ExitIcon}
          title="Log out"
          color={colors.darkGreenTertiary}
          onPress={handleSignOut}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkGreenPrimary,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.iconWhite,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 32,
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.iconWhite,
    textAlign: 'center',
  },
  username: {
    fontSize: 16,
    color: colors.iconWhite,
    opacity: 0.7,
    marginTop: 8,
    textAlign: 'center',
  },
  menuGroup: {
    backgroundColor: colors.darkGreenSecondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.darkGreenTertiary,
    marginHorizontal: 20,
    marginBottom: 16,
    overflow: 'hidden',
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuButtonText: {
    flex: 1,
    color: colors.iconWhite,
    fontSize: 16,
  },
});

export default UserScreen;
