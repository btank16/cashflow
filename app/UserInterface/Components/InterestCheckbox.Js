import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../Colors/colors.Js';

const Checkbox = ({ label, value, onValueChange }) => {
    return (
        <TouchableOpacity onPress={() => onValueChange(!value)} style={styles.container}>
            <View style={[styles.checkbox, value && styles.checked]}>
                {value && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.label}>{label}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 16,
        marginBottom: 16,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderColor: colors.quaternaryGrey,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checked: {
        backgroundColor: colors.primaryBlack,
    },
    checkmark: {
        color: colors.iconWhite,
        fontSize: 14,
    },
    label: {
        marginLeft: 8,
        fontSize: 14,
        fontWeight: 500,
        color: colors.primaryBlack,
    },
});

export default Checkbox;

