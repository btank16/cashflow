import React from 'react';
import { View, StyleSheet, SafeAreaView, Platform, StatusBar, Text, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import colors from '../Colors/colors.Js';
import NavBar from '../Components/NavBar.Js';

function CalcHomeScreen(props) {
    const navigation = useNavigation();

    const buttons = [
        { name: "Rental Property Calculator", screen: "RentalCalcIn" },
        { name: "Fix and Flip Calculator", screen: "FlipCalcIn" },
        { name: "BRRR Calculator", screen: "BRRCalcIn" },
        { name: "Cashflow Price Target Calculator", screen: "ProjectionCalcIn" }
    ];

    return (
        <SafeAreaView style={styles.masterBackground}>
            <View style={styles.logoContainer}></View>
            <View style={styles.contentContainer}>
                {buttons.map((button, index) => (
                    <TouchableOpacity 
                        key={index} 
                        style={styles.button}
                        onPress={() => navigation.navigate(button.screen)}
                    >
                        <Text style={styles.buttonText}>{button.name}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <View style={styles.menuContainer}>
                <NavBar 
                    activeTab="Analyze"
                    onTabPress={(tabName) => {
                        if (tabName === 'Feedback') {
                            navigation.navigate('FeedbackScreen');
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
        height: 56,
        backgroundColor: colors.background,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.1)', // Faded black line
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 5, // for Android shadow
    },
    contentContainer: {
        flex: 8,
        backgroundColor: colors.background,
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    menuContainer: {
        height: 56,
        backgroundColor: colors.background,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0, 0, 0, 0.1)', // Faded black line
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 5, // for Android shadow
    },
    button: {
        width: '80%',
        height: '15%',
        backgroundColor: colors.accent,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        color: colors.background,
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default CalcHomeScreen;