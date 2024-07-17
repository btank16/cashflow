import React from 'react';
import { View, StyleSheet, Text, TouchableHighlight } from "react-native";
import colors from '../Colors/colors.Js';
import { ChartBarIcon, MegaphoneIcon } from 'react-native-heroicons/outline'
import { ChartBarIcon as ChartBarSolid, MegaphoneIcon as MegaphoneSolid } from 'react-native-heroicons/solid'

function NavBar({ activeTab, onTabPress }) {
    const iconColor = (tabName) => activeTab === tabName ? colors.accent : colors.mainShade;
    const textStyle = (tabName) => [styles.tabText, activeTab === tabName && styles.activeTabText];
    return (
        <View style={styles.tabCont}>
            <TouchableHighlight 
                style={styles.tabItem} 
                onPress={() => onTabPress('Analyze')}
            >
                <View>
                    {activeTab === 'Analyze' ? 
                    <ChartBarSolid color={iconColor('Analyze')} size={24} /> : 
                    <ChartBarIcon color={iconColor('Analyze')} size={24} />
                    }
                    <Text style={textStyle('Analyze')}>Analyze</Text>
                </View>
            </TouchableHighlight>

            <TouchableHighlight 
                style={[styles.tabItem, {borderRightWidth: 0}]} 
                onPress={() => onTabPress('Feedback')}
            >
                <View>
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
        borderRightWidth: 1,
        borderRightColor: colors.mainShade,
      },
    tabText: {
        fontSize: 12,
        marginTop: 4,
        color: colors.mainShade,
      },
    activeTabText: {
        color: colors.accent,
      },
})

export default NavBar;