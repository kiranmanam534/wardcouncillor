import { Alert, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { Colors } from "../constant/Colors";
import { useEffect, useState } from "react";
import { formattedAmount, formattedCurrency } from "../utility/FormattedAmmount";
import { useSelector } from "react-redux";
import { getRandomColor } from "../utility/getRandomColor";
import { BarChart } from 'react-native-gifted-charts';
const data = [
  { value: 50, label: 'Jan', frontColor: '#ff6384' },
  { value: 80, label: 'Feb', frontColor: '#36a2eb' },
  { value: 70, label: 'Mar', frontColor: '#ffcd56' },
  { value: 90, label: 'Apr', frontColor: '#4bc0c0' },
  { value: 100, label: 'May', frontColor: '#9966ff' },
  { value: 60, label: 'Jun', frontColor: '#ff9f40' },
];

const OutstandingCategoriesChartScreen = ({ route }) => {

  const { items: OutstandingItems } = useSelector(
    state => state.OustandingCategoriesReducer,
  );


  const { title } = route.params;
  console.log("OutstandingItems----->", title, OutstandingItems);

  const [items, setItems] = useState([])

  // const PieColors = [Colors.red, Colors.black, Colors.yellow, Colors.blue]


  // Reducer function to calculate sum
  const sumReducer = (accumulator, currentValue) => accumulator + parseFloat(currentValue.value);

  // Calculate the sum using reduce()
  const totalSum = OutstandingItems?.reduce(sumReducer, 0); // Initial value is 0

  console.log('Total Sum:', totalSum); // Output: Total Sum: 60
  useEffect(() => {
    OutstandingItems?.map((item, index) => {
      console.log(index, item)
      if (item.name != 'N/A') {
        const newObject = {
          value: parseFloat(item.value),
          label: index, frontColor: getRandomColor()
        };
        setItems(prevData => [...prevData, newObject]);
      }
      // setItems([...items,{ value: item.value, color: getRandomColor() }])
    });

  }, [])


  const getFocusedIndex = () => {
    let maxIndex = 0;
    let maxValue = OutstandingItems[0].value;
    OutstandingItems.forEach((item, index) => {
      if (item.value > maxValue) {
        maxValue = item.value;
        maxIndex = index;
      }
    });
    return maxIndex;
  };

  console.log("items-----", items);

  const renderLegend = (text, color, value) => {

    let ItemVal = ` ${formattedAmount(
      parseFloat(value),
      'en-ZA',
      'ZAR',
      'currency',
    )} ( ${parseFloat((parseFloat(value) * 100) / totalSum).toFixed(2)} `
    return (

      <View style={{ flexDirection: 'row', marginBottom: 12 }} key={text}>
        <View
          style={{
            height: 18,
            width: 18,
            marginRight: 10,
            borderRadius: 4,
            backgroundColor: color || 'white',
          }}
        />
        <Text style={{ color: 'white', fontSize: 13 }}>
          {text == 'D30_DAYS' && '30 Days : ' + ItemVal + '% ) '}
          {text == 'D60_DAYS' && '60 Days : ' + ItemVal + '% ) '}
          {text == 'D90_DAYS' && '90 Days : ' + ItemVal + '% ) '}
          {text == 'D120_PLUS' && '120+ Days : ' + ItemVal + '% ) '}
        </Text>
      </View>
    );
  };


  const renderTooltip = ({value,label}) => {
    console.log(value)
    const tooltipPosition = value > 80 ? { bottom:  10 } : { top: 20 };
    return (
      <View style={[styles.tooltipContainer]}>
        <Text style={styles.tooltipLabel}>Name : {OutstandingItems[label].name}</Text>
        <Text style={styles.tooltipText}>Ammount : 
        {formattedAmount(
                parseFloat(value),
                'en-ZA',
                'ZAR',
                'currency',
              )}</Text>
      </View>
    );
  };


  return (
    <SafeAreaView style={styles.container}>
     <View style={{ margin: 10, backgroundColor: Colors.white, padding: 5, borderRadius: 5, }}>
            <Text
              style={{
                color: Colors.blue,
                fontSize: 25,
                fontWeight: 'bold',
                marginBottom: 12,
                textAlign:'center'
              }}>
             Category wise outstanding
            </Text>
            {/* <Text style={{ color: Colors.blue, fontSize: 16, fontWeight: '600',textAlign:'center' }}>
              Total :  {formattedAmount(
                parseFloat(totalSum),
                'en-ZA',
                'ZAR',
                'currency',
              )}
            </Text> */}
          </View>
     <View style={{marginVertical:40}}>
     <BarChart
     barStyle={styles.barStyle}
        data={items}
        barWidth={30}
        barBorderRadius={4}
        yAxisThickness={0}
        xAxisThickness={0}
        hideRules
        initialSpacing={10}
        yAxisTextStyle={styles.yAxisText}
        xAxisLabelTextStyle={styles.xLabelText}
        labelWidth={50}
        renderLabel={({ label, index }) => (
          <View key={index} style={styles.labelContainer}>
            <Text style={styles.labelText}>{label}</Text>
          </View>
        )}
        renderTooltip={renderTooltip}
        // renderTooltip={({ value,label, index }) => (
        //   <View key={index} style={styles.tooltipContainer}>
        //     <Text style={styles.tooltipText}>{OutstandingItems[label].name}</Text>
        //     <Text style={styles.tooltipText}>{value}</Text>
        //   </View>
        // )}
      />
     </View>
    </SafeAreaView>
  );
};
export default OutstandingCategoriesChartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 50,
    justifyContent: 'center',
    backgroundColor: Colors.primary
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  yAxisText: {
    color: Colors.white,
    fontSize: 12,
  },
  labelContainer: {
    alignItems: 'center',
    marginTop: 10,
    width:100
  },
  labelText: {
    fontSize: 12,
    color: Colors.white,
  },
  xLabelText: {
    color: Colors.white,
  },
  barStyle:{
  // marginTop:40
  },
  tooltipContainer: {
    backgroundColor: Colors.blue,
    padding: 5,
    borderRadius: 4,
    position: 'absolute',
    zIndex: 1,
    // alignItems: 'center',
  },
  tooltipLabel: {
    color: Colors.white,
    fontSize: 10,
    
  },
  tooltipText: {
    color: Colors.white,
    paddingVertical:10,
    fontSize: 10,
  },
});

