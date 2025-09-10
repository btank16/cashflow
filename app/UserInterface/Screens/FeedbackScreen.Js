import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal, Alert } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { ChevronDownIcon } from "react-native-heroicons/outline";
import { send, EmailJSResponseStatus } from '@emailjs/react-native';
import colors from '../Colors/colors.Js';
import BackButton from '../Components/BackButton.Js';
import GreenLogo from '../../assets/icons/GreenLogo.jsx';
import PrimaryButton from '../Components/PrimaryButton.Js';
import { getUserAttribute } from '../Utils/UserAttributesCache.Js';
import secretKeys from '../../../secretkeys.json';
import ScreenLayout from '../UtilScreens/ScreenLayout.Js';
import { useAuth } from '../Utils/AuthContext.Js';

const SUBJECT_OPTIONS = [
  "Bug Report", 
  "Feature Request",
  "Usability Issue",
  "Data Accuracy",
  "New Calculator Suggestion",  
  "General Feedback",
  "Question",
  "Other"
];

const SubjectDropdown = ({ 
  label, 
  value, 
  onValueChange,
  placeholder = "Select"
}) => {
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const displayValue = value || placeholder;

  const handleDone = () => {
    if (tempValue !== value) {
      onValueChange(tempValue);
    }
    setIsPickerVisible(false);
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsPickerVisible(false);
  };

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TouchableOpacity 
        activeOpacity={0.7}
        onPress={() => {
          setTempValue(value);
          setIsPickerVisible(true);
        }}
        style={styles.touchableWrapper}
      >
        <View style={styles.inputWrapper}>
          <Text style={[
            styles.displayText,
            !value && styles.placeholderText
          ]}>
            {displayValue}
          </Text>
          <ChevronDownIcon size={20} color={colors.primaryBlack} style={styles.icon} />
        </View>
      </TouchableOpacity>

      <Modal
        visible={isPickerVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.pickerHeader}>
              <TouchableOpacity onPress={handleCancel} style={styles.headerButton}>
                <Text style={styles.cancelButton}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDone} style={styles.headerButton}>
                <Text style={styles.doneButton}>Done</Text>
              </TouchableOpacity>
            </View>
            <Picker
              selectedValue={tempValue}
              onValueChange={setTempValue}
              style={styles.picker}
            >
              <Picker.Item label={placeholder} value="" color={colors.sixthGrey} />
              {SUBJECT_OPTIONS.map((option) => (
                <Picker.Item 
                  key={option} 
                  label={option} 
                  value={option}
                  color={colors.primaryBlack}
                />
              ))}
            </Picker>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const MAX_FEEDBACK_CHARS = 500;

function FeedbackScreen() {
  const navigation = useNavigation();
  const { isAuthenticated } = useAuth();
  const [subject, setSubject] = useState('');
  const [feedback, setFeedback] = useState('');
  const [feedbackFocused, setFeedbackFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // Fetch user attributes when component mounts (only for authenticated users)
    const fetchUserData = async () => {
      if (!isAuthenticated) {
        setUserEmail('');
        return;
      }
      
      try {
        const email = await getUserAttribute('email') || '';
        setUserEmail(email);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUserEmail('');
      }
    };

    fetchUserData();
  }, [isAuthenticated]);

  const handleFeedbackChange = (text) => {
    if (text.length <= MAX_FEEDBACK_CHARS) {
      setFeedback(text);
    }
  };

  const sendFeedback = async () => {
    if (!subject || !feedback) {
      Alert.alert('Error', 'Please fill in both subject and feedback fields.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const templateParams = {
        email: userEmail || 'No Email Provided',
        title: subject,
        feedback: feedback
      };
      
      await send(
        secretKeys.emailjs.service_id,
        secretKeys.emailjs.template_id,
        templateParams,
        {
          publicKey: secretKeys.emailjs.user_id,
        }
      );
      
      // Clear form on success
      setSubject('');
      setFeedback('');
      
      Alert.alert(
        'Success',
        'Your feedback has been sent successfully. Thank you!'
      );
    } catch (error) {
      console.error('Failed to send feedback:', error);
      
      let errorMessage = 'Failed to send feedback. Please try again later.';
      
      if (error instanceof EmailJSResponseStatus) {
        console.log('EmailJS Request Failed...', error.text);
        errorMessage = `EmailJS Error: ${error.text}`;
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <BackButton destinationScreen="CalcHomeScreen" />
    </View>
  );

  return (
    <ScreenLayout header={renderHeader()}>
      <View style={styles.logoContainer}>
        <GreenLogo />
      </View>

      <Text style={styles.title}>Please share your experience with us</Text>
      
      <SubjectDropdown
        label="Subject"
        value={subject}
        onValueChange={setSubject}
        placeholder="Select"
      />
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Feedback</Text>
        <View style={[
          styles.feedbackWrapper,
          feedbackFocused ? styles.feedbackWrapperFocused : styles.feedbackWrapperBlurred
        ]}>
          <TextInput
            style={styles.feedbackInput}
            placeholder="Feedback"
            placeholderTextColor={colors.sixthGrey}
            value={feedback}
            onChangeText={handleFeedbackChange}
            multiline={true}
            textAlignVertical="top"
            onFocus={() => setFeedbackFocused(true)}
            onBlur={() => setFeedbackFocused(false)}
          />
        </View>
        <Text style={styles.characterCount}>
          {feedback.length}/{MAX_FEEDBACK_CHARS}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <PrimaryButton
          label="Send Feedback"
          loadingLabel="Sending..."
          isActive={subject.length > 0 && feedback.length > 0}
          isLoading={isLoading}
          onPress={sendFeedback}
          style={{ marginTop: 16 }}
        />
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primaryBlack,
    textAlign: 'center',
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: colors.primaryGrey,
    marginBottom: 8,
    fontWeight: '500',
  },
  touchableWrapper: {
    width: '100%',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    height: 50,
    backgroundColor: colors.tertiaryGrey,
    borderColor: colors.quaternaryGrey,
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  feedbackWrapper: {
    borderRadius: 10,
    height: 200,
    overflow: 'hidden',
  },
  feedbackWrapperBlurred: {
    backgroundColor: colors.tertiaryGrey,
    borderColor: colors.quaternaryGrey,
    borderWidth: 1,
  },
  feedbackWrapperFocused: {
    backgroundColor: colors.iconWhite,
    borderColor: colors.primaryGreen,
    borderWidth: 1,
  },
  feedbackInput: {
    height: '100%',
    paddingHorizontal: 10,
    paddingTop: 10,
    fontSize: 16,
  },
  characterCount: {
    fontSize: 12,
    color: colors.primaryGrey,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  displayText: {
    flex: 1,
    fontSize: 16,
    color: colors.primaryBlack,
  },
  placeholderText: {
    color: colors.sixthGrey,
  },
  icon: {
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalContent: {
    backgroundColor: colors.iconWhite,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.quaternaryGrey,
    padding: 16,
  },
  headerButton: {
    paddingHorizontal: 8,
  },
  doneButton: {
    color: colors.primaryGreen,
    fontSize: 16,
    fontWeight: '500',
  },
  cancelButton: {
    color: colors.primaryGrey,
    fontSize: 16,
  },
  picker: {
    backgroundColor: colors.iconWhite,
  },
  buttonContainer: {
    marginTop: 'auto',
    paddingTop: 16,
  },
});

export default FeedbackScreen;