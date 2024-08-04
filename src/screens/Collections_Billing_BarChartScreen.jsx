import {
  ActivityIndicator,
  Alert,
  Button,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import WardsComparisionSchema from '../validation/WardsComparisionSchema';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {TextInput} from 'react-native-paper';
import {Colors} from '../constant/Colors';

import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import axios from 'axios';
import {apiUrl} from '../constant/CommonData';
import {useSelector} from 'react-redux';
import {BarChart} from 'react-native-gifted-charts';
import {formattedAmount} from '../utility/FormattedAmmount';
import {formatNumber} from '../utility/formatNumber';
const {width} = Dimensions.get('window');

const Collections_Billing_BarChartScreen = ({route}) => {
  const [IsSubmitted, setIsSubmitted] = useState(false);
  const [statusCode, setStatusCode] = useState(null);
  const [WardCompareData, setWardCompareData] = useState([]);
  const [SelectedWarData, setSelectedWarData] = useState();
  const [SelectedWarInfo, setSelectedWarInfo] = useState();
  const [selectedIndex, setSelectedIndex] = useState(null);

  const {wardType, selectedWardNo} = route.params;

  console.log(wardType, selectedWardNo);

  const [yAxisLabels, setYAxisLabels] = useState([]);

  const [maxAbsValue, setMaxAbsValue] = useState();

  const loggedUser = useSelector(state => state.loginReducer.items);

  let ddd = [
    {
      label: 'Jun',
      value: '8776',
      type: 'Billing',
      monthNumber: 6,
    },
    {
      label: 'Jul',
      value: '560512',
      type: 'Billing',
      monthNumber: 7,
    },
    {
      label: 'Mar',
      value: '8488348378',
      type: 'Billing',
      monthNumber: 3,
    },
    {
      label: 'Apr',
      value: '84883483',
      type: 'Billing',
      monthNumber: 4,
    },
    {
      label: 'Feb',
      value: '8488378',
      type: 'Billing',
      monthNumber: 2,
    },
    {
      label: 'May',
      value: '460454',
      type: 'Collection',
      monthNumber: 5,
    },
    {
      label: 'Jun',
      value: '1902715929',
      type: 'Collection',
      monthNumber: 6,
    },
    {
      label: 'Jul',
      value: '978001553',
      type: 'Collection',
      monthNumber: 7,
    },
    {
      label: 'Mar',
      value: '75100',
      type: 'Collection',
      monthNumber: 3,
    },
    {
      label: 'Apr',
      value: '560512',
      type: 'Collection',
      monthNumber: 4,
    },
    {
      label: 'Feb',
      value: '300',
      type: 'Collection',
      monthNumber: 2,
    },
    {
      label: 'May',
      value: '8488348378',
      type: 'Billing',
      monthNumber: 5,
    },
  ];

  // Sort users by name
  ddd = [...ddd].sort((a, b) => a.type.localeCompare(b.type));
  // console.log(sortedUsers1);
  ddd = [...ddd].sort(
    (a, b) => parseInt(a.monthNumber) - parseInt(b.monthNumber),
  );
  // console.log(sortedUsers);

  //const response = await axios.get(`${apiUrl}/api/Collection/get-month-wise-billing-collections?WardNo=${ward1}&Year=${currentYear}`);
  // Utility function to format numbers
  const formatNumber1 = number => {
    // if (number >= 1000000000) {
    //     return (number / 1000000000).toFixed(1);
    // } else
    // if (number >= 1000000) {
    //     return (number / 1000000).toFixed(1);
    // }
    // else if (number >= 1000) {
    //     return (number / 1000).toFixed(1);
    // }
    return (number / 1000).toFixed(1);
  };

  const chart_km = () => {
    setSelectedWarData({type1: 'Collection', type2: 'Billing'});

    // Determine the maximum value from the data
    const maxValue = Math.max(
      ...ddd.map(item => parseInt(formatNumber1(item.value))),
    );
    const maxValue1 = Math.max(...ddd.map(item => parseInt(item.value)));
    setMaxAbsValue(maxValue);

    const sectionValue = Math.round(maxValue / 5);
    console.log(sectionValue);

    setYAxisLabels(
      Array.from({length: 10 + 1}, (_, i) => formatYLabel(sectionValue * i)),
    );

    setWardCompareData(
      ddd?.map(item => ({
        type: item.type,
        month: item.label,
        actualValue: item.value,
        value: item.value,
        label: item.type == 'Collection' ? `${item.label}` : '',
        // spacing: 10,
        // labelWidth: 50,
        labelTextStyle: {color: 'white', textAlign: 'center'},
        frontColor: item.type == 'Collection' ? '#177AD5' : '#ED6665',
      })),
    );
  };

  const getWardwiseCollections = async () => {
    // console.log(month)
    setIsSubmitted(true);
    setStatusCode(null);
    setSelectedWarData();
    try {
      const search = '';
      const currentYear = new Date().getFullYear();
      console.log(currentYear); // This will log the current year, e.g., 2024
      // const response = await axios.post('http://192.168.1.7:5055/api/CouncillorWard/72')
      const response = await axios.get(
        `${apiUrl}/api/Collection/get-month-wise-billing-collections?WardNo=${selectedWardNo}&Year=${currentYear}`,
      );
      console.log(response.data);
      setSelectedWarData({type1: 'Collection', type2: 'Billing'});
      setStatusCode(response.status);
      if (response.status == 200) {
        let barchartData = response.data.data;
        // Sort users by name
        barchartData = [...barchartData].sort((a, b) =>
          a.type.localeCompare(b.type),
        );
        // console.log(sortedUsers1);
        barchartData = [...barchartData].sort(
          (a, b) => parseInt(a.monthNumber) - parseInt(b.monthNumber),
        );
        // console.log(sortedUsers);

        // Determine the maximum value from the data
        const maxValue = Math.max(
          ...barchartData.map(item => parseInt(formatNumber1(item.value))),
        );
        setMaxAbsValue(maxValue);

        const sectionValue = Math.round(maxValue / 5);
        console.log(sectionValue);

        setYAxisLabels(
          Array.from({length: 10 + 1}, (_, i) =>
            formatYLabel(sectionValue * i),
          ),
        );

        setWardCompareData(
          barchartData?.map(item => ({
            type: item.type,
            month: item.label,
            actualValue: item.value,
            value: item.value,
            label: item.type == 'Collection' ? `${item.label}` : '',
            // spacing: 10,
            // labelWidth: 50,
            labelTextStyle: {color: 'white', textAlign: 'center'},
            frontColor: item.type == 'Collection' ? '#177AD5' : '#ED6665',
          })),
        );
      }
      setIsSubmitted(false);
    } catch (error) {
      console.log(error?.response?.status);
      setIsSubmitted(false);
      if (error?.response?.status == 401) {
        setStatusCode(401);
      } else {
        setStatusCode(500);
      }

      setWardCompareData([]);
    }
  };

  const handleBarPress = (event, index) => {
    console.log('1111=> ', event, index);
    setSelectedIndex(index);
    const selectedData = WardCompareData[index];
    console.log('Selected Data:', selectedData);
    // WardCompareData.forEach((val, index1) => {
    //     // console.log(val,index1)
    //     WardCompareData[index1].frontColor = selectedData.type === "Collection" ? '#177AD5' : '#ED6665'
    // })
    // WardCompareData[index].frontColor = Colors.primary;

    setSelectedWarInfo(selectedData);
    // Do something with the selected data
    // For example, navigate to another screen or show a modal with details
  };

  // Function to format Y-axis labels
  const formatYLabel = value => {
    return (value / 1000000).toFixed(1);
  };

  useEffect(() => {
    getWardwiseCollections();
    // chart_km()
  }, []);

  // console.log(WardCompareData)

  const renderTitle = () => {
    return (
      <View style={{marginVertical: 20}}>
        <Text
          style={{
            color: 'white',
            fontSize: 20,
            fontWeight: 'bold',
            textAlign: 'center',
          }}>
          Collection vs Billing
        </Text>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 24,
            // backgroundColor: 'yellow',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View
              style={{
                height: 12,
                width: 12,
                borderRadius: 6,
                backgroundColor: '#177AD5',
                marginRight: 8,
              }}
            />
            <Text
              style={{
                // width: 60,
                height: 16,
                color: 'lightgray',
              }}>
              {SelectedWarData.type1}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: 10,
            }}>
            <View
              style={{
                height: 12,
                width: 12,
                borderRadius: 6,
                backgroundColor: '#ED6665',
                marginRight: 8,
              }}
            />
            <Text
              style={{
                // width: 60,
                height: 16,
                color: 'lightgray',
              }}>
              {SelectedWarData.type2}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{marginTop: 10}}>
        {IsSubmitted && (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
            }}>
            <ActivityIndicator size={40} color={Colors.primary} />
          </View>
        )}
        {!IsSubmitted && WardCompareData.length > 0 && (
          <View
            style={{
              flex: 1,
              backgroundColor: '#333340',
              paddingBottom: 40,
              borderRadius: 10,
              margin: 5,
            }}>
            {renderTitle()}
            <BarChart
              data={WardCompareData}
              // data={WardCompareData.map((item, index) => ({
              //     ...item,
              //     frontColor: selectedIndex === index ? 'red' : 'blue', // Highlight selected bar
              // }))}

              barWidth={20}
              width={width}
              maxValue={maxAbsValue}
              spacing={10}
              xAxisThickness={0}
              yAxisThickness={0}
              yAxisTextStyle={{color: Colors.white}}
              xAxisLabelTextStyle={{color: Colors.white, textAlign: 'center'}}
              yAxisLabelTexts={yAxisLabels}
              hideYAxisText
              // yAxisLabelWidth={160}
              // isAnimated
              noOfSections={6}
              barStyle={{
                minBarHeight: 5, // Ensuring a minimum height for bars, even if the value is 0
              }}
              xAxisProps={{
                thickness: 2, // Set the thickness of the x-axis
                color: 'blue', // Set the color of the x-axis
              }}
              hideRules={false} // Hide the grid lines
              // initialSpacing={20} // Adjust initial spacing to center labels
              onPress={(event, dataPoint) => handleBarPress(event, dataPoint)}
              renderTooltip={(item, index) => {
                return (
                  <View
                    style={{
                      // marginBottom: 40,
                      marginLeft: -6,
                      backgroundColor: '#ffcefe',
                      paddingHorizontal: 6,
                      paddingVertical: 4,
                      borderRadius: 4,
                    }}>
                    <Text>
                      {formattedAmount(
                        parseFloat(item.value),
                        'en-ZA',
                        'ZAR',
                        'currency',
                      )}
                    </Text>
                  </View>
                );
              }}
            />

            {SelectedWarInfo && (
              <View
                style={{
                  margin: 10,
                  backgroundColor: Colors.primary,
                  padding: 10,
                  borderRadius: 10,
                }}>
                {/* <Text>{JSON.stringify(SelectedWarInfo)}</Text> */}
                <Text style={{color: Colors.white, padding: 5}}>
                  Type : {SelectedWarInfo?.type}
                </Text>
                <Text style={{color: Colors.white, padding: 5}}>
                  Month : {SelectedWarInfo?.month}
                </Text>
                <Text style={{color: Colors.white, padding: 5}}>
                  Amount :{' '}
                  {formattedAmount(
                    parseFloat(SelectedWarInfo?.actualValue),
                    'en-ZA',
                    'ZAR',
                    'currency',
                  )}
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Collections_Billing_BarChartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    position: 'relative',
  },
  inputView: {
    gap: 10,
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 5,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
  },
  barChart: {},

  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 16,
    borderRadius: 4,
  },
  error: {
    color: 'red',
    marginBottom: 8,
  },
  tooltip: {
    padding: 5,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
});
