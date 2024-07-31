import React from 'react';
import { View, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { useTheme } from '@react-navigation/native'; // Optional, if using theme

const MultiBarChart = () => {
  const { colors } = useTheme(); // Optional, if using theme

  const screenWidth = Dimensions.get('window').width;

  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'], // X-axis labels
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43], // Dataset 1
        color: 'blue', // Optional, for color
      },
      {
        data: [30, 50, 20, 60, 80, 60], // Dataset 2
        color: 'blue', // Optional, for color
      },
    ],
    legend: ['Dataset 1', 'Dataset 2'], // Optional, if you want to add legend
    
  };

  return (
    <View style={{flex:1,justifyContent:'center'}}>
      <BarChart
        data={data}
        width={screenWidth - 16} // Adjust width as needed
        height={220}
        chartConfig={{
          backgroundGradientFrom: 'red',
          backgroundGradientTo: 'blue',
          decimalPlaces: 2,
          color: (opacity = 1) => `green`,
          labelColor: (opacity = 1) => `white`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: 'blue',
          },
        }}
        verticalLabelRotation={30}
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}

        fromZero={true}

      />
    </View>
  );
};

export default MultiBarChart;
