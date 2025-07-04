import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeftIcon, ChevronRightIcon, TrashIcon } from "react-native-heroicons/outline";
import { signOut } from '@aws-amplify/auth';
import colors from '../../Colors/colors.Js';
import { getUserAttribute } from '../../Utils/UserAttributesCache.Js';
import { clearUserAttributesCache } from '../../Utils/UserAttributesCache.Js';
import ScreenLayout from '../../UtilScreens/ScreenLayout.Js';
import { clearDataCache } from '../../Utils/DataCache.Js';

// Import icons
import UserIcon from '../../../assets/icons/UserIcon.jsx';
import CalculatorIcon from '../../../assets/icons/CalculatorIcon.jsx';
import FeedbackIcon from '../../../assets/icons/FeedbackIcon.jsx';
import ExitIcon from '../../../assets/icons/ExitIcon.jsx';

const UserScreen = () => {
  const navigation = useNavigation();
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // First try to get the name attribute
        const nameValue = await getUserAttribute('name');
        
        if (nameValue) {
          setDisplayName(nameValue);
        } else {
          // If name is not available, fall back to email
          const emailValue = await getUserAttribute('email');
          setDisplayName(emailValue || '');
        }
      } catch (error) {
        console.error('Error fetching user attributes:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleSignOut = async () => {
    try {
      // Clear the user attributes cache when signing out
      clearUserAttributesCache();
      // Clear the data cache when signing out
      clearDataCache();
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

  // Custom icon wrapper for heroicons
  const HeroIconWrapper = ({ icon: Icon, size = 20, color = colors.iconWhite }) => {
    return <Icon size={size} color={color} />;
  };

  const renderHeader = () => (
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
  );

  return (
    <ScreenLayout
      header={renderHeader()}
      backgroundColor={colors.darkGreenPrimary}
      scrollable={false}
    >
      <View style={styles.profileInfo}>
        <Text style={styles.name}>{displayName}</Text>
      </View>

      <View style={styles.menuGroup}>
        <MenuButton
          icon={UserIcon}
          title="Personal info"
          color={colors.primaryGreen}
          onPress={() => navigation.navigate('AttributeScreen')}
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

      <View style={[styles.menuGroup, styles.deleteAccountButton]}>
        <MenuButton
          icon={() => <TrashIcon size={20} color={colors.iconWhite} />}
          title="Delete my Account"
          color={colors.quaternaryRed}
          onPress={() => navigation.navigate('DeleteAccount')}
        />
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
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
  menuGroup: {
    backgroundColor: colors.darkGreenSecondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.darkGreenTertiary,
    marginBottom: 16,
    overflow: 'hidden',
  },
  deleteAccountButton: {
    marginTop: 40,
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
