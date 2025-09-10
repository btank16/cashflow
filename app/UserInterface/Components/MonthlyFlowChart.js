import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Modal } from 'react-native';
import Svg, { Rect, Line, Text as SvgText, G } from 'react-native-svg';
import { Picker } from '@react-native-picker/picker';
import { ChevronDownIcon } from 'react-native-heroicons/outline';
import colors from '../Colors/colors.Js';

const { width: screenWidth } = Dimensions.get('window');
const CHART_PADDING = 20;
const CHART_WIDTH = screenWidth - 32 - (CHART_PADDING * 2); // 32 for container padding
const CHART_HEIGHT = 250;
const Y_AXIS_WIDTH = 60;
const X_AXIS_HEIGHT = 30;
const TOP_PADDING = 15; // Extra space at top for positive bars

const MonthlyFlowChart = ({ 
    monthlyRent = 0,
    monthlyExpenses = 0,
    customExpenseArray = [],
    containerStyle = {},
    maxYears = 10 // Maximum number of years to show in dropdown
}) => {
    // Get current date information
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth(); // 0-based (0 = January)
    const startMonth = (currentMonth + 1) % 12; // Next month (0-based)
    const startYear = currentMonth === 11 ? currentYear + 1 : currentYear; // If December, start next year
    
    const [selectedYear, setSelectedYear] = useState(startYear); // Default to first year
    const [isPickerVisible, setIsPickerVisible] = useState(false);
    const [tempYear, setTempYear] = useState(startYear);
    
    // Generate year options for next 10 years
    const yearOptions = useMemo(() => {
        const options = [];
        for (let i = 0; i < 10; i++) {
            options.push(startYear + i);
        }
        return options;
    }, [startYear]);

    // Month labels to display
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Calculate which months to show for selected year
    const getMonthsForYear = (year) => {
        const monthsToShow = [];
        
        if (year === startYear) {
            // First year: show only remaining months of the year
            for (let m = startMonth; m < 12; m++) {
                monthsToShow.push(m);
            }
        } else {
            // All other years: show full 12 months from January to December
            for (let m = 0; m < 12; m++) {
                monthsToShow.push(m);
            }
        }
        
        return monthsToShow;
    };

    // Calculate monthly cashflow data for the selected year
    const monthlyData = useMemo(() => {
        const data = [];
        const baseMonthlyFlow = monthlyRent - monthlyExpenses;
        const monthsToShow = getMonthsForYear(selectedYear);
        const yearsSinceStart = selectedYear - startYear;
        
        monthsToShow.forEach((monthIndex, i) => {
            let monthFlow = baseMonthlyFlow;
            
            // Calculate the actual calendar year and month for this data point
            const actualYear = selectedYear;
            const actualMonth = monthIndex;
            
            // Apply custom expenses for this month
            customExpenseArray.forEach(expense => {
                if (expense.pattern === 'monthly') {
                    // Check if this month is in the months applied
                    if (expense.monthsApplied.includes(actualMonth)) {
                        monthFlow -= expense.cost;
                    }
                } else if (expense.pattern === 'annual') {
                    // Check if this is the right month for the expense
                    if (actualMonth === expense.monthsApplied[0]) {
                        const yearsSinceStart = actualYear - startYear;
                        
                        // Determine if expense should apply this year
                        let shouldApply = false;
                        
                        if (expense.firstYear) {
                            // For first-year expenses:
                            // Check if this is the first occurrence
                            if (yearsSinceStart === 0 && actualMonth >= startMonth) {
                                // First occurrence in year 0 (if month hasn't passed)
                                shouldApply = true;
                            } else if (yearsSinceStart === 1 && actualMonth < startMonth) {
                                // First occurrence in year 1 (if month already passed in year 0)
                                shouldApply = true;
                            } else if (yearsSinceStart >= 1) {
                                // For subsequent years, check the interval
                                // Determine when the first occurrence happened
                                let yearOfFirstOccurrence = 0;
                                if (actualMonth < startMonth) {
                                    // If expense month comes before start month, first occurrence was in year 1
                                    yearOfFirstOccurrence = 1;
                                }
                                
                                // Calculate years since first occurrence
                                const yearsSinceFirstOccurrence = yearsSinceStart - yearOfFirstOccurrence;
                                
                                // Apply if it's been N years since first occurrence (or multiples of N)
                                if (yearsSinceFirstOccurrence > 0 && yearsSinceFirstOccurrence % expense.yearInterval === 0) {
                                    shouldApply = true;
                                }
                            }
                        } else {
                            // For non-first-year expenses:
                            // First occurrence should be at year = yearInterval
                            // Then repeat every yearInterval years after that
                            if (yearsSinceStart === expense.yearInterval) {
                                // First occurrence at the interval year
                                shouldApply = true;
                            } else if (yearsSinceStart > expense.yearInterval) {
                                // Check if it's a multiple of the interval from the first occurrence
                                const yearsSinceFirstOccurrence = yearsSinceStart - expense.yearInterval;
                                if (yearsSinceFirstOccurrence % expense.yearInterval === 0) {
                                    shouldApply = true;
                                }
                            }
                        }
                        
                        if (shouldApply) {
                            monthFlow -= expense.cost;
                        }
                    }
                }
            });
            
            data.push({
                month: monthIndex + 1,
                monthLabel: months[monthIndex],
                actualYear: actualYear,
                value: monthFlow
            });
        });
        
        return data;
    }, [monthlyRent, monthlyExpenses, customExpenseArray, selectedYear, startYear, startMonth]);

    // Calculate min and max values for scaling
    const { minValue, maxValue } = useMemo(() => {
        const values = monthlyData.map(d => d.value);
        const min = Math.min(...values, 0);
        const max = Math.max(...values, 0);
        
        // Round to nearest 10
        const roundedMin = Math.floor(min / 10) * 10;
        const roundedMax = Math.ceil(max / 10) * 10;
        
        return {
            minValue: roundedMin,
            maxValue: roundedMax
        };
    }, [monthlyData]);

    const valueRange = maxValue - minValue;
    const effectiveChartHeight = CHART_HEIGHT - TOP_PADDING;
    const zeroY = TOP_PADDING + effectiveChartHeight - ((0 - minValue) / valueRange * effectiveChartHeight);

    // Calculate bar width based on actual number of months shown
    const monthsShown = monthlyData.length;
    const barWidth = (CHART_WIDTH - Y_AXIS_WIDTH) / Math.max(monthsShown, 1) - 4;
    const barSpacing = 4;

    // Generate Y-axis labels
    const yAxisLabels = useMemo(() => {
        const labels = [];
        const steps = 5; // Number of labels
        for (let i = 0; i <= steps; i++) {
            const value = minValue + (valueRange * i / steps);
            labels.push({
                value,
                y: TOP_PADDING + effectiveChartHeight - (i * effectiveChartHeight / steps)
            });
        }
        return labels;
    }, [minValue, valueRange]);

    const formatDollar = (value) => {
        const absValue = Math.abs(value);
        if (absValue >= 1000) {
            return `${value < 0 ? '-' : ''}$${(absValue / 1000).toFixed(0)}k`;
        }
        return `$${value.toFixed(0)}`;
    };

    return (
        <View style={[styles.container, containerStyle]}>
            <Text style={styles.title}>Monthly Cash Flow</Text>
            
            {/* Year Selector */}
            <View style={styles.yearSelectorRow}>
                <Text style={styles.yearLabel}>Year:</Text>
                <TouchableOpacity 
                    style={styles.yearButton}
                    onPress={() => {
                        setTempYear(selectedYear);
                        setIsPickerVisible(true);
                    }}
                >
                    <Text style={styles.yearButtonText}>{selectedYear}</Text>
                    <ChevronDownIcon size={16} color={colors.primaryGrey} />
                </TouchableOpacity>
            </View>
            
            {/* Picker Modal */}
            <Modal
                visible={isPickerVisible}
                transparent={true}
                animationType="slide"
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.pickerHeader}>
                            <TouchableOpacity 
                                onPress={() => setIsPickerVisible(false)} 
                                style={styles.headerButton}
                            >
                                <Text style={styles.cancelButton}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress={() => {
                                    setSelectedYear(tempYear);
                                    setIsPickerVisible(false);
                                }} 
                                style={styles.headerButton}
                            >
                                <Text style={styles.doneButton}>Done</Text>
                            </TouchableOpacity>
                        </View>
                        <Picker
                            selectedValue={tempYear}
                            onValueChange={setTempYear}
                            style={styles.picker}
                        >
                            {yearOptions.map((year) => (
                                <Picker.Item 
                                    key={year} 
                                    label={year.toString()} 
                                    value={year}
                                    color={colors.primaryBlack}
                                />
                            ))}
                        </Picker>
                    </View>
                </View>
            </Modal>

            {/* Chart */}
            <View style={styles.chartWrapper}>
                <Svg width={screenWidth - 32} height={CHART_HEIGHT + X_AXIS_HEIGHT}>
                    {/* Y-axis labels */}
                    <G>
                        {yAxisLabels.map((label, index) => (
                            <SvgText
                                key={index}
                                x={Y_AXIS_WIDTH - 5}
                                y={label.y + 5}
                                fontSize="12"
                                fill={colors.primaryGrey}
                                textAnchor="end"
                            >
                                {formatDollar(label.value)}
                            </SvgText>
                        ))}
                    </G>

                    {/* Grid lines */}
                    <G>
                        {yAxisLabels.map((label, index) => (
                            <Line
                                key={index}
                                x1={Y_AXIS_WIDTH}
                                y1={label.y}
                                x2={screenWidth - 32 - CHART_PADDING}
                                y2={label.y}
                                stroke={colors.quaternaryGrey}
                                strokeWidth="1"
                                strokeDasharray={label.value === 0 ? "0" : "3,3"}
                            />
                        ))}
                    </G>

                    {/* Zero line */}
                    <Line
                        x1={Y_AXIS_WIDTH}
                        y1={zeroY}
                        x2={screenWidth - 32 - CHART_PADDING}
                        y2={zeroY}
                        stroke={colors.primaryGrey}
                        strokeWidth="2"
                    />

                    {/* Bars */}
                    <G>
                        {monthlyData.map((data, index) => {
                            const barHeight = Math.abs(data.value) / valueRange * effectiveChartHeight;
                            const barX = Y_AXIS_WIDTH + (index * (barWidth + barSpacing)) + barSpacing;
                            const barY = data.value >= 0 ? zeroY - barHeight : zeroY;
                            const barColor = data.value >= 0 ? colors.primaryGreen : colors.quaternaryRed;
                            
                            return (
                                <Rect
                                    key={index}
                                    x={barX}
                                    y={barY}
                                    width={barWidth}
                                    height={barHeight}
                                    fill={barColor}
                                />
                            );
                        })}
                    </G>

                    {/* X-axis labels */}
                    <G>
                        {monthlyData.map((data, index) => {
                            const labelX = Y_AXIS_WIDTH + (index * (barWidth + barSpacing)) + barSpacing + (barWidth / 2);
                            return (
                                <SvgText
                                    key={index}
                                    x={labelX}
                                    y={CHART_HEIGHT + 15}
                                    fontSize="10"
                                    fill={colors.primaryGrey}
                                    textAnchor="middle"
                                >
                                    {data.monthLabel}
                                </SvgText>
                            );
                        })}
                    </G>
                </Svg>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.iconWhite,
        borderRadius: 8,
        padding: 16,
        marginVertical: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.primaryBlack,
        marginBottom: 12,
    },
    yearSelectorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    yearLabel: {
        fontSize: 16,
        color: colors.primaryBlack,
        marginRight: 12,
    },
    yearButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.tertiaryGrey,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.quaternaryGrey,
        paddingHorizontal: 12,
        paddingVertical: 8,
        minWidth: 90,
    },
    yearButtonText: {
        fontSize: 16,
        color: colors.primaryBlack,
        marginRight: 6,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: colors.iconWhite,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    pickerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.quaternaryGrey,
    },
    headerButton: {
        padding: 5,
    },
    cancelButton: {
        fontSize: 16,
        color: colors.primaryGrey,
    },
    doneButton: {
        fontSize: 16,
        color: colors.primaryGreen,
        fontWeight: '600',
    },
    picker: {
        width: '100%',
        height: 200,
    },
    chartWrapper: {
        marginTop: 5,
        marginBottom: 10,
    },
});

export default MonthlyFlowChart;