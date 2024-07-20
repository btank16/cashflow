import React from 'react';
import { View, StyleSheet, Text, TouchableHighlight } from "react-native";
import { useNavigation } from '@react-navigation/native';
import colors from '../Colors/colors.Js';
import { ChartBarIcon, MegaphoneIcon } from 'react-native-heroicons/outline'
import { ChartBarIcon as ChartBarSolid, MegaphoneIcon as MegaphoneSolid } from 'react-native-heroicons/solid' 

function NavBar({ activeTab, onTabPress }) {
    const navigation = useNavigation();
    const iconColor = (tabName) => activeTab === tabName ? colors.accent : colors.mainShade;
    const textStyle = (tabName) => [styles.tabText, activeTab === tabName && styles.activeTabText];
    
    const handleTabPress = (tabName) => {
        if (tabName === 'Analyze') {
            navigation.navigate('CalcHomeScreen');
        } else if (tabName === 'Feedback') {
            navigation.navigate('FeedbackScreen');
        }
    };
    
    return (
        <View style={styles.tabCont}>
            <TouchableHighlight 
                style={styles.tabItem}
                underlayColor={colors.mainShade} 
                activeOpacity={0.05}
                onPress={() => onTabPress('Analyze')}
            >
                <View style={styles.tabItemContent}>
                    {activeTab === 'Analyze' ? 
                    <ChartBarSolid color={iconColor('Analyze')} size={24} /> : 
                    <ChartBarIcon color={iconColor('Analyze')} size={24} />
                    }
                    <Text style={textStyle('Analyze')}>Analyze</Text>
                </View>
            </TouchableHighlight>
            
            <View style={styles.divider} />

            <TouchableHighlight 
                style={styles.tabItem}
                underlayColor={colors.mainShade}
                activeOpacity={0.05} 
                onPress={() => onTabPress('Feedback')}
            >
                <View style={styles.tabItemContent}>
                    {activeTab === 'Feedback' ? 
                    <MegaphoneSolid color={iconColor('Feedback')} size={24} /> : 
                    <MegaphoneIcon color={iconColor('Feedback')} size={24} />
                    }
                    <Text style={textStyle('Feedback')}>Feedback</Text>
                </View>
            </TouchableHighlight>
        </View>  
    );
}

const styles = StyleSheet.create({
    tabCont: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: '100%',
        backgroundColor: colors.backgroundColor,
    },
    tabItem: {
        alignItems: 'center',
        alignContent: 'center',
        flex: 1,
        borderRadius: 6,
      },
    tabItemContent: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabText: {
        fontSize: 12,
        marginTop: 4,
        color: colors.mainShade,
      },
    activeTabText: {
        color: colors.accent,
      },
    divider: {
        width: 1, // Width of the divider
        height: '60%', // Height of the divider (adjust as needed)
        backgroundColor: colors.mainShade, // Color of the divider
        alignItems: 'center',
        justifyContent: 'center',
    },
})

export default NavBar;