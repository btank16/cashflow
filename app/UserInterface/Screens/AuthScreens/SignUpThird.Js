import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import colors from '../../Colors/colors.Js';
import NormTextbox from '../../Components/NormTextbox.Js';
import StateDropdown from '../../Components/StateDropdown.Js';
import StateMultiselect from '../../Components/StateMultiselect.Js';

const SignUpThird = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { email, optInEmail, acceptTerms, password, confirmPassword } = route.params;

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [state, setState] = useState('');
  const [targetStates, setTargetStates] = useState([]);
  const [firstNameFocused, setFirstNameFocused] = useState(false);
  const [lastNameFocused, setLastNameFocused] = useState(false);
  const [isButtonActive, setIsButtonActive] = useState(false);

  // Check if all fields are filled
  React.useEffect(() => {
    setIsButtonActive(
      firstName.length > 0 && 
      lastName.length > 0 && 
      state.length > 0 && 
      targetStates.length > 0
    );
  }, [firstName, lastName, state, targetStates]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.progressContainer}>
            <View style={styles.progressLineActive} />
            <View style={styles.progressLineActive} />
            <View style={styles.progressLineActive} />
          </View>
        </View>

        <View style={styles.mainContent}>
          <View>
            <Text style={styles.title}>Let's get to know you</Text>

            <NormTextbox
              label="First Name"
              value={firstName}
              onChangeText={setFirstName}
              placeholder="First name"
              isFocused={firstNameFocused}
              onFocus={() => setFirstNameFocused(true)}
              onBlur={() => setFirstNameFocused(false)}
            />

            <NormTextbox
              label="Last Name"
              value={lastName}
              onChangeText={setLastName}
              placeholder="Last name"
              isFocused={lastNameFocused}
              onFocus={() => setLastNameFocused(true)}
              onBlur={() => setLastNameFocused(false)}
            />

            <StateDropdown
              label="Home State"
              value={state}
              onValueChange={(itemValue) => {
                setState(itemValue);
              }}
              placeholder="Select your home state"
            />

            <StateMultiselect
              label="Target Investment State(s)"
              value={targetStates}
              onValueChange={setTargetStates}
              placeholder="Select your target market"
            />
          </View>

          <TouchableOpacity 
            style={[
              styles.continueButton,
              isButtonActive ? styles.activeButton : styles.inactiveButton
            ]}
            onPress={() => {
              if (isButtonActive) {
                // Handle sign up completion logic
              }
            }}
            disabled={!isButtonActive}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.iconWhite,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    height: 56,
    justifyContent: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    position: 'absolute',
    top: 28,
    left: 16,
    right: 16,
    gap: 4,
  },
  progressLineActive: {
    flex: 1,
    height: 2,
    backgroundColor: colors.primaryGreen,
    borderRadius: 1,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primaryBlack,
    textAlign: 'left',
    marginBottom: 24,
    marginTop: 8,
  },
  continueButton: {
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  activeButton: {
    backgroundColor: colors.primaryGreen,
  },
  inactiveButton: {
    backgroundColor: colors.tertiaryGreen,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.iconWhite,
  },
});

export default SignUpThird;
