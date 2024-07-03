import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';

const TestBarchart = () => {
    const barData = [
        { value: 45000, label: 'Jan' },
        { value: -30000, label: 'Feb' },
        { value: 60000, label: 'Mar' },
        { value: -50000, label: 'Apr' },
        { value: 70000, label: 'May' },
        { value: -40000, label: 'Jun' },
        { value: 90000, label: 'Jul' },
        { value: -80000, label: 'Aug' },
        { value: 55000, label: 'Sep' },
        { value: 65000, label: 'Oct' },
        { value: -35000, label: 'Nov' },
        { value: 75000, label: 'Dec' },
    ];

    // Utility function to format numbers
    const formatNumber = (number) => {
        if (number >= 1000000000) {
            return Math.round((number / 1000000000));
        } else if (number >= 1000000) {
            return Math.round((number / 1000000));
        } else if (number >= 1000) {
            return Math.round((number / 1000));// + 'k';
        }
        return number.toString();
    };

    const adjustedBarData = barData.map(item => ({
        value: Math.abs(item.value),
        label: item.label,
        frontColor: item.value >= 0 ? '#4CAF50' : '#FF5252',
        topLabelComponent: () => (
            <Text style={styles.topLabel}>{item.value >= 0 ? formatNumber(item.value) : ''}</Text>
        ),
        bottomLabelComponent: () => (
            <Text style={styles.bottomLabel}>{item.value < 0 ? formatNumber(item.value) : ''}</Text>
        ),
    }));

    const maxPositiveValue = Math.max(...barData.map(item => item.value >= 0 ? item.value : 0));
    const maxNegativeValue = Math.min(...barData.map(item => item.value < 0 ? item.value : 0));
    const maxAbsValue = Math.max(maxPositiveValue, Math.abs(maxNegativeValue));

    const generateYAxisLabels = (maxValue) => {
        const labels = [];
        const step = maxValue / 4;
        for (let i = 0; i <= 10; i++) {
            console.log(formatNumber(step * i))
            labels.push(formatNumber(step * i));
        }
        return labels;
    };

    return (
        <View style={styles.container}>
            <BarChart
                data={adjustedBarData}
                barWidth={22}
                spacing={10}
                roundedTop
                yAxisThickness={0}
                xAxisThickness={0}
                isAnimated
                noOfSections={4}
                maxValue={maxAbsValue}
                showLine
                lineConfig={{
                    color: '#000',
                    thickness: 1,
                }}
                xAxisLabelTextStyle={styles.labelTextStyle}
                yAxisTextStyle={styles.yAxisTextStyle}
                yAxisLabelTexts={generateYAxisLabels(maxAbsValue)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    topLabel: {
        color: '#4CAF50',
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    bottomLabel: {
        color: '#FF5252',
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    yAxisTextStyle: {
        color: '#000',
        fontSize: 10,
    },
    xAxisLabelTextStyle: {
        color: '#000',
        fontSize: 12,
        fontWeight: 'bold',
    },
});

export default TestBarchart;
