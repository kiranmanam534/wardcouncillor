import { Alert, StyleSheet, Text, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { Colors } from "../constant/Colors";
import { useEffect, useState } from "react";
import { formattedAmount, formattedCurrency } from "../utility/FormattedAmmount";
import { useSelector } from "react-redux";

const OustandingChartsScreen = ({ route }) => {

  const { items:OutstandingItems} = useSelector(
    state => state.WardOustandingReducer,
  );


  const { title } = route.params;
  console.log("OutstandingItems----->", title, OutstandingItems);

  const [items, setItems] = useState([])

  const PieColors = [Colors.red, Colors.black, Colors.yellow, Colors.blue]

  const ddd = [
    { color: "#C92B22", value: "1706319.36" },
    { color: "#1F3C80", value: "1357384.69" },
    { color: "#EEAF2C", value: "1327239.69" },
    { color: "#047245", value: "58343165.33" }
  ];


  // Reducer function to calculate sum
  const sumReducer = (accumulator, currentValue) => accumulator + parseFloat(currentValue.value);

  // Calculate the sum using reduce()
  const totalSum = OutstandingItems?.reduce(sumReducer, 0); // Initial value is 0

  console.log('Total Sum:', totalSum); // Output: Total Sum: 60
  useEffect(() => {
    OutstandingItems?.map((item, index) => {
      console.log(index, item)
      const newObject = { value: parseInt((parseFloat(item.value) * 100) / totalSum), color: PieColors[index] };
      setItems(prevData => [...prevData, newObject]);
      // setItems([...items,{ value: item.value, color: PieColors[index] }])
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

  return (
    <View style={{
      flex: 1, backgroundColor: Colors.primary, marginTop: 1
    }}>
      {items.length > 0 &&
        <View
          style={{

            // marginVertical: 100,
            marginHorizontal: 5,
            borderRadius: 10,
            paddingVertical: 50,
            backgroundColor: Colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
          }}>


          {/*********************    Custom Header component      ********************/}

          <View style={{ marginVertical: 10, backgroundColor: Colors.white, padding: 5, borderRadius: 5 }}>
            <Text
              style={{
                color: Colors.blue,
                fontSize: 25,
                fontWeight: 'bold',
                marginBottom: 12,
              }}>
              Outstanding Amount
            </Text>
            <Text style={{ color: Colors.blue, fontSize: 16, fontWeight: '600',textAlign:'center' }}>
              Total :  {formattedAmount(
                parseFloat(totalSum),
                'en-ZA',
                'ZAR',
                'currency',
              )}
            </Text>
          </View>
          {/****************************************************************************/}


          <PieChart
            strokeColor={Colors.white}
            strokeWidth={2}
            donut
            sectionAutoFocus
            data={
              items
              // [
              //   { value: parseInt((1706319.36 * 100) / (1706319.36 + 1357384.69 + 1327239.69 + 58343165.33)), color: Colors.yellow },
              //   { value: parseInt((1357384.69 * 100) / (1706319.36 + 1357384.69 + 1327239.69 + 58343165.33)), color: Colors.primary },
              //   { value: parseInt((1327239.69 * 100) / (1706319.36 + 1357384.69 + 1327239.69 + 58343165.33)), color: Colors.red },
              //   { value: parseInt((58343165.33 * 100) / (1706319.36 + 1357384.69 + 1327239.69 + 58343165.33)), color: Colors.blue },
              // ]
            }
            innerCircleColor={Colors.lightgray}
            innerCircleBorderWidth={2}
            innerCircleBorderColor={Colors.white}
            showValuesAsLabels={true}
            // showText
            // labelsPosition="mid"
            textSize={18}
            focusOnPress
            focusIndex={getFocusedIndex()}
            // inwardExtraLengthForFocused={70}
        extraRadiusForFocused={20}
            
            // textBackgroundRadius={Colors.blue}
            showTextBackground={true}
            centerLabelComponent={() => {
              return (
                <View>
                  <Text style={{ color: Colors.primary, fontSize: 25 }}>100%</Text>
                  {/* <Text style={{ color: Colors.primary, fontSize: 18, textAlign: 'center' }}>Total</Text> */}
                </View>
              );
            }}
          />


          {/*********************    Custom Legend component      ********************/}
          <View
            style={{
              width: '100%',
              flexDirection: 'column',
              justifyContent: 'space-evenly',
              marginTop: 20,
            }}>
            {OutstandingItems.map((item, index) => (
              renderLegend(item.name, PieColors[index], item.value)
            ))}
            {/* {renderLegend('60 Days', 'lightgreen')}
            {renderLegend('90 Days', 'orange')}
            {renderLegend('120+ Days', Colors.blue)} */}
          </View>
          {/****************************************************************************/}

        </View>
      }
      {/* {items.map((item,index) => (
          <Text key={index}>{item.value}</Text>
        ))} */}
    </View>
  );
}

export default OustandingChartsScreen

const styles = StyleSheet.create({})