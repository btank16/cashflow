import React from 'react';
import { View, StyleSheet, SafeAreaView, Platform, StatusBar, Text, TextInput, ScrollView, Alert, Image } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Communications from 'react-native-communications';
import colors from '../Colors/colors.Js';
import NavBar from '../Components/NavBar.Js';
import HomeButton from '../Components/HomeButton.Js';
import CalcButton from '../Components/CalcButton.Js';
import CommonStyles from '../Colors/CommonStyles.Js';

const TextInputBox = ({ label, value, onChangeText, placeholder, multiline, style }) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <LinearGradient
        colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.05)', 'rgba(0,0,0,0)']}
        style={styles.gradientContainer}
      >
        <View style={[styles.textInputContainer, style]}>
          <TextInput
            style={[styles.input, multiline && styles.multilineInput]}
            onChangeText={onChangeText}
            value={value}
            placeholder={placeholder}
            multiline={multiline}
          />
        </View>
      </LinearGradient>
    </View>
  );
};

function FeedbackScreen(props) {
    const navigation = useNavigation();
    const [subject, setSubject] = React.useState('');
    const [feedback, setFeedback] = React.useState('');

    const handleSendFeedback = () => {
        if (subject.trim() === '' || feedback.trim() === '') {
            Alert.alert('Error', 'Please fill in both subject and feedback fields.');
            return;
        }

        const phoneNumber = '2164081883';
        const message = `Subject: ${subject}\n\nFeedback: ${feedback}`;

        Communications.text(phoneNumber, message);
        
        // Clear the input fields after sending
        setSubject('');
        setFeedback('');

        Alert.alert('Success', 'Your feedback has been sent!');
    };

    return (
        <SafeAreaView style={styles.masterBackground}>
            <View style={styles.logoContainer}>
                <HomeButton/>
                <Image source={require('../../assets/CashflowText.png')} style={CommonStyles.logo} />
            </View>
            <ScrollView style={styles.contentContainer}>
                <TextInputBox
                    label="Subject"
                    value={subject}
                    onChangeText={setSubject}
                    placeholder="Enter subject"
                />
                <TextInputBox
                    label="Feedback"
                    value={feedback}
                    onChangeText={setFeedback}
                    placeholder="Enter your feedback here"
                    multiline={true}
                    style={styles.feedbackInput}
                />
                <View style={styles.buttonContainer}>
                    <CalcButton
                        title="Send Feedback"
                        onPress={handleSendFeedback}
                    />
                </View>
            </ScrollView>
            <View style={styles.menuContainer}>
                <NavBar 
                    activeTab="Feedback"
                    onTabPress={(tabName) => {
                        if (tabName === 'Analyze') {
                            navigation.navigate('CalcHomeScreen');
                        }
                    }}
                />            
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    masterBackground: {
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 56,
        backgroundColor: colors.background,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.1)',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 5,
    },
    contentContainer: {
        flex: 8,
        backgroundColor: colors.background,
        padding: 15,
    },
    menuContainer: {
        height: 56,
        backgroundColor: colors.background,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0, 0, 0, 0.1)',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 5,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        fontWeight: 'bold',
        color: colors.basicText,
    },
    gradientContainer: {
        borderRadius: 10,
        padding: 2,
    },
    textInputContainer: {
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: colors.fieldColor,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
    },
    input: {
        height: 50,
        paddingHorizontal: 15,
        fontSize: 16,
        backgroundColor: colors.fieldColor,
    },
    multilineInput: {
        height: 150,
        textAlignVertical: 'top',
        paddingTop: 10,
    },
    feedbackInput: {
        height: 150,
    },
    buttonContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
});

export default FeedbackScreen;