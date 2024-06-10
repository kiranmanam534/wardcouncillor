import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { Colors } from "../constant/Colors";
import { useEffect, useState } from "react";
import { formattedAmount, formattedCurrency } from "../utility/FormattedAmmount";
import { useSelector } from "react-redux";
import { getRandomColor } from "../utility/getRandomColor";

const OutstandingCategoriesChartScreen = ({ route }) => {

  const { items:OutstandingItems} = useSelector(
    state => state.OustandingCategoriesReducer,
  );


  const { title } = route.params;
  console.log("OutstandingItems----->", title, OutstandingItems);

  const [items, setItems] = useState([])

  const PieColors = ["#25691F", "#481B38", "#3DBB80", "#EF4F1B", "#92886F", "#F7B4D6", "#AA5F76", "#7F27DF", "#374A87", "#7587C2", "#D26A02", "#DF22CF", "#BDA827", "#DE0BA3", "#C9594E", "#5C99AC", "#CF4C42", "#AD3A5D", "#971AAD", "#2B7091", "#D4DAD2", "#022013", "#0CEA6A", "#95B727", "#A8D077", "#97327B", "#6AC652", "#35EE9C", "#FE28DB", "#F1C348", "#6D5CE3", "#2197B7", "#7FC0A3", "#5FBBB3", "#6E3C71", "#EEF0C7", "#A530F9", "#0A17FF", "#33115D", "#B7BB7A", "#F15D8E", "#D9760D", "#205532", "#684FE9"]


  // Reducer function to calculate sum
  const sumReducer = (accumulator, currentValue) => accumulator + parseFloat(currentValue.value);

  // Calculate the sum using reduce()
  const totalSum = OutstandingItems?.reduce(sumReducer, 0); // Initial value is 0

  console.log('Total Sum:', totalSum); // Output: Total Sum: 60
  useEffect(() => {
    OutstandingItems?.map((item, index) => {
      console.log(index, item)
      if (item.name != 'N/A') {
        PieColors.push(getRandomColor())
      const newObject = { value: parseInt((parseFloat(item.value) * 100) / totalSum), color:PieColors[index]  };
      setItems(prevData => [...prevData, newObject]);
      }
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
    console.log(text,' === ',value)
    if(text!=='N/A'){

    let ItemVal = ` ${formattedAmount(
      parseFloat(value),
      'en-ZA',
      'ZAR',
      'currency',
    )} ( ${parseFloat((parseFloat(value) * 100) / totalSum).toFixed(2)} % )`
    return (
<>
      <View style={{ flexDirection: 'row', marginBottom: 5,margin:10 }} key={text}>
        <View
          style={{
            height: 18,
            width: 18,
            marginRight: 10,
            borderRadius: 4,
            backgroundColor: color || 'white',
          }}
        />
       <View>
       <Text style={{ color: 'white', fontSize: 13,textDecorationLine:'underline',textDecorationColor:Colors.yellow }}>
          {text}
        </Text>
       </View>
      
      </View>
      <View style={{margin:5,marginLeft:35}}>
       <Text style={{ color: Colors.yellow, fontSize: 13,fontWeight:'600' }}>
          {ItemVal}
        </Text>
       </View>
</>
    );
  }
  };

  return (
    <ScrollView style={{flex:1}}>
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
              )}{' '}
              ( {parseFloat((parseFloat(totalSum) * 100) / totalSum)} % )
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
              renderLegend(item.name, PieColors[index] , item.value)
              
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
    </ScrollView>
  );
}

export default OutstandingCategoriesChartScreen

const styles = StyleSheet.create({})











// import { Alert, SafeAreaView, StyleSheet, Text, View } from "react-native";
// import { PieChart } from "react-native-gifted-charts";
// import { Colors } from "../constant/Colors";
// import { useEffect, useState } from "react";
// import { formattedAmount, formattedCurrency } from "../utility/FormattedAmmount";
// import { useSelector } from "react-redux";
// import { getRandomColor } from "../utility/getRandomColor";
// import { BarChart } from 'react-native-gifted-charts';
// const data = [
//   { value: 50, label: 'Jan', frontColor: '#ff6384' },
//   { value: 80, label: 'Feb', frontColor: '#36a2eb' },
//   { value: 70, label: 'Mar', frontColor: '#ffcd56' },
//   { value: 90, label: 'Apr', frontColor: '#4bc0c0' },
//   { value: 100, label: 'May', frontColor: '#9966ff' },
//   { value: 60, label: 'Jun', frontColor: '#ff9f40' },
// ];

// const OutstandingCategoriesChartScreen = ({ route }) => {

//   const { items: OutstandingItems } = useSelector(
//     state => state.OustandingCategoriesReducer,
//   );


//   const { title } = route.params;
//   console.log("OutstandingItems----->", title, OutstandingItems);

//   const [items, setItems] = useState([])

//   // const PieColors = [Colors.red, Colors.black, Colors.yellow, Colors.blue]


//   // Reducer function to calculate sum
//   const sumReducer = (accumulator, currentValue) => accumulator + parseFloat(currentValue.value);

//   // Calculate the sum using reduce()
//   const totalSum = OutstandingItems?.reduce(sumReducer, 0); // Initial value is 0

//   console.log('Total Sum:', totalSum); // Output: Total Sum: 60
//   useEffect(() => {
//     OutstandingItems?.map((item, index) => {
//       console.log(index, item)
//       if (item.name != 'N/A') {
//         const newObject = {
//           value: parseFloat(item.value),
//           label: index, frontColor: getRandomColor()
//         };
//         setItems(prevData => [...prevData, newObject]);
//       }
//     });

//   }, [])


//   const getFocusedIndex = () => {
//     let maxIndex = 0;
//     let maxValue = OutstandingItems[0].value;
//     OutstandingItems.forEach((item, index) => {
//       if (item.value > maxValue) {
//         maxValue = item.value;
//         maxIndex = index;
//       }
//     });
//     return maxIndex;
//   };

//   console.log("items-----", items);

//   const renderLegend = (text, color, value) => {

//     let ItemVal = ` ${formattedAmount(
//       parseFloat(value),
//       'en-ZA',
//       'ZAR',
//       'currency',
//     )} ( ${parseFloat((parseFloat(value) * 100) / totalSum).toFixed(2)} `
//     return (

//       <View style={{ flexDirection: 'row', marginBottom: 12 }} key={text}>
//         <View
//           style={{
//             height: 18,
//             width: 18,
//             marginRight: 10,
//             borderRadius: 4,
//             backgroundColor: color || 'white',
//           }}
//         />
//         <Text style={{ color: 'white', fontSize: 13 }}>
//           {text == 'D30_DAYS' && '30 Days : ' + ItemVal + '% ) '}
//           {text == 'D60_DAYS' && '60 Days : ' + ItemVal + '% ) '}
//           {text == 'D90_DAYS' && '90 Days : ' + ItemVal + '% ) '}
//           {text == 'D120_PLUS' && '120+ Days : ' + ItemVal + '% ) '}
//         </Text>
//       </View>
//     );
//   };


//   const renderTooltip = ({value,label}) => {
//     console.log(value)
//     const tooltipPosition = value > 80 ? { bottom:  10 } : { top: 20 };
//     return (
//       <View style={[styles.tooltipContainer]}>
//         <Text style={styles.tooltipLabel}>Name : {OutstandingItems[label].name}</Text>
//         <Text style={styles.tooltipText}>Ammount : 
//         {formattedAmount(
//                 parseFloat(value),
//                 'en-ZA',
//                 'ZAR',
//                 'currency',
//               )}</Text>
//       </View>
//     );
//   };


//   return (
//     <SafeAreaView style={[styles.container,{marginTop:1}]}>
//      <View style={{ margin: 10, backgroundColor: Colors.white, padding: 5, borderRadius: 5, }}>
//             <Text
//               style={{
//                 color: Colors.blue,
//                 fontSize: 25,
//                 fontWeight: 'bold',
//                 marginBottom: 12,
//                 textAlign:'center'
//               }}>
//              Category wise outstanding
//             </Text>
//           </View>
//      <View style={{margin:10,borderWidth:0.5,borderColor:Colors.white,padding:10}}>
//      <BarChart
//      barStyle={styles.barStyle}
//         data={items}
//         barWidth={30}
//         barBorderRadius={4}
//         yAxisThickness={0}
//         xAxisThickness={0}
//         hideRules
//         initialSpacing={10}
//         yAxisTextStyle={styles.yAxisText}
//         xAxisLabelTextStyle={styles.xLabelText}
//         labelWidth={50}
//         renderLabel={({ label, index }) => (
//           <View key={index} style={styles.labelContainer}>
//             <Text style={styles.labelText}>{label}</Text>
//           </View>
//         )}
//         renderTooltip={renderTooltip}
//       />
//      </View>
//     </SafeAreaView>
//   );
// };
// export default OutstandingCategoriesChartScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 50,
//     justifyContent: 'center',
//     backgroundColor: Colors.primary
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   yAxisText: {
//     color: Colors.white,
//     fontSize: 12,
//   },
//   labelContainer: {
//     alignItems: 'center',
//     marginTop: 10,
//     width:100
//   },
//   labelText: {
//     fontSize: 12,
//     color: Colors.white,
//   },
//   xLabelText: {
//     color: Colors.white,
//   },
//   barStyle:{
  
//   },
//   tooltipContainer: {
//     backgroundColor: Colors.blue,
//     padding: 5,
//     borderRadius: 4,
//     position: 'absolute',
//     zIndex: 1,
   
//   },
//   tooltipLabel: {
//     color: Colors.white,
//     fontSize: 10,
    
//   },
//   tooltipText: {
//     color: Colors.white,
//     paddingVertical:10,
//     fontSize: 10,
//   },
// });

