import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import { deleteUser } from 'aws-amplify/auth';
import colors from '../../Colors/colors.Js';
import PrimaryButton from '../../Components/PrimaryButton.Js';
import ScreenLayout from '../../UtilScreens/ScreenLayout.Js';
import { clearUserAttributesCache } from '../../Utils/UserAttributesCache.Js';
import { clearDataCache } from '../../Utils/DataCache.Js';

const DeleteAccount = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteAccount = () => {
    // Show confirmation alert
    Alert.alert(
      'Delete Account',
      'Are you sure you would like to delete your account? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Yes, Delete My Account',
          style: 'destructive',
          onPress: confirmDeleteAccount
        }
      ],
      { cancelable: true }
    );
  };

  const confirmDeleteAccount = async () => {
    setIsLoading(true);
    try {
      // Delete the user's account
      await deleteUser();
      
      // Clear local caches
      clearUserAttributesCache();
      clearDataCache();
      
      // Navigate to Auth stack after successful deletion
      navigation.reset({
        index: 0,
        routes: [{ name: 'Auth' }],
      });
      
      // Show success message
      setTimeout(() => {
        Alert.alert(
          'Account Deleted',
          'Your account has been successfully deleted.'
        );
      }, 500);
    } catch (error) {
      console.error('Error deleting account:', error);
      Alert.alert(
        'Delete Account Failed',
        error.message || 'There was an error deleting your account. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.navigate('UserScreen')}
      >
        <ChevronLeftIcon size={28} color={colors.iconWhite} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Delete Account</Text>
      <View style={styles.backButton} />
    </View>
  );

  return (
    <ScreenLayout
      header={renderHeader()}
      backgroundColor={colors.darkGreenPrimary}
      scrollable={false}
    >
      <View style={styles.mainContent}>
        <View style={styles.centerButtonContainer}>
          <PrimaryButton
            label={isLoading ? 'Deleting Account...' : 'Delete My Account'}
            isActive={true}
            isLoading={isLoading}
            onPress={handleDeleteAccount}
            style={styles.deleteButton}
          />
        </View>
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
    textAlign: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  centerButtonContainer: {
    width: '100%',
  },
  deleteButton: {
    backgroundColor: colors.quaternaryRed,
  },
});

export default DeleteAccount; 