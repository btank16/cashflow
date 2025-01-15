import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PieChart from 'react-native-pie-chart';
import colors from '../Colors/colors.Js';

function ExpensePieChart({ 
    chartData,
    chartTitle = "Total Monthly Expenses",
    containerStyle = {}
}) {
    // Calculate total amount by summing all values in chartData
    const totalAmount = chartData.reduce((sum, item) => sum + Number(item.value), 0);

    const formatDollar = (value) => {
        return `$${value.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    };

    const formatPercent = (value) => {
        return `${(value * 100).toFixed(1)}%`;
    };

    // Extract series and colors from chartData
    const series = chartData.map(item => item.value);
    const sliceColor = chartData.map(item => item.color);
    const chartSize = 300;

    return (
        <View style={[styles.container, containerStyle]}>
            <View style={styles.chartContainer}>
                <PieChart
                    widthAndHeight={chartSize}
                    series={series}
                    sliceColor={sliceColor}
                    coverRadius={0.65}
                    coverFill={'#FFF'}
                />
                <View style={styles.centerLabel}>
                    <Text style={styles.centerLabelTitle}>{chartTitle}</Text>
                    <Text style={styles.centerLabelValue}>{formatDollar(totalAmount)}</Text>
                </View>
            </View>
            <View style={styles.legend}>
                {chartData.map((item, index) => (
                    <View key={index} style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                        <Text style={styles.legendLabel}>
                            {item.name} ({formatPercent(item.value / totalAmount)})
                        </Text>
                        <Text style={styles.legendValue}>{formatDollar(item.value)}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    chartContainer: {
        alignItems: 'center',
        position: 'relative',
        height: 300,
    },
    centerLabel: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 20,
    },
    centerLabelTitle: {
        fontSize: 14,
        color: colors.primaryGrey,
        marginBottom: 4,
        textAlign: 'center',
        lineHeight: 20,
    },
    centerLabelValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.primaryBlack,
    },
    legend: {
        marginTop: 16,
        gap: 12,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    legendDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 8,
    },
    legendLabel: {
        flex: 1,
        fontSize: 14,
        color: colors.primaryGrey,
    },
    legendValue: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.primaryBlack,
    },
});

export default ExpensePieChart;
