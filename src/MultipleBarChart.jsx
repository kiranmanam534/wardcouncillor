import { ActivityIndicator, Alert, Button, Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';


import axios from 'axios';
import { apiUrl } from './constant/CommonData';
import { useSelector } from 'react-redux';
import { BarChart } from 'react-native-gifted-charts';
import { formattedAmount } from './utility/FormattedAmmount';
import { Colors } from './constant/Colors';
const { width } = Dimensions.get('window');

const Collections_Billing_BarChartScreen = () => {
    const [IsSubmitted, setIsSubmitted] = useState(false);
    const [statusCode, setStatusCode] = useState(null);
    const [WardCompareData, setWardCompareData] = useState([]);
    const [SelectedWarData, setSelectedWarData] = useState();
    const [SelectedWarInfo, setSelectedWarInfo] = useState();

    const [yAxisLabels, setYAxisLabels] = useState([])

    const [maxAbsValue, setMaxAbsValue] = useState();


    const loggedUser = useSelector(state => state.loginReducer.items);


    const getWardwiseCollections = async (ward1, ward2) => {
        // console.log(month)
        setWardCompareData([])
        setIsSubmitted(true);
        setStatusCode(null);
        setSelectedWarData()
        try {
            const search = '';
            const currentYear = new Date().getFullYear();
            console.log(currentYear); // This will log the current year, e.g., 2024
            // const response = await axios.post('http://192.168.1.7:5055/api/CouncillorWard/72')
            const response = await axios.get(`${apiUrl}/api/Collection/get-month-wise-ward-billing-collections?WardNo=${ward1}&Year=${currentYear}`);

            setSelectedWarData({ ward1: ward1, ward2: ward2 })
            setStatusCode(response.status);
            if (response.status == 200) {
                const barchartData = response.data.data;
                console.log(barchartData);
                // Determine the maximum absolute value to set the chart's scaling correctly
                const maxPositiveValue = Math.max(...barchartData.map(item => parseInt(item.billing) >= 0 ? parseInt(item.billing) : 0));
                const maxNegativeValue = Math.min(...barchartData.map(item => parseInt(item.billing) < 0 ? parseInt(item.billing) : 0));
                setMaxAbsValue(Math.max(maxPositiveValue, Math.abs(maxNegativeValue)));

                const sectionValue = (Math.max(maxPositiveValue, Math.abs(maxNegativeValue))) / 6;

                setYAxisLabels(Array.from({ length: 6 + 1 }, (_, i) =>
                    formatYLabel(sectionValue * i)
                ));


                barchartData?.forEach(item => {
                    // setWardCompareData([...WardCompareData,{
                    //     ward: 1,
                    //     month: item.label,
                    //     value: item.billing,
                    //     label: `${item.label}`,
                    //     spacing: 2,
                    //     labelWidth: 50,
                    //     labelTextStyle: { color: 'white' },
                    //     frontColor:  '#ED6665',
                    // }])

                    setWardCompareData([...WardCompareData,{
                        ward: 1,
                        month: item.label,
                        value: item.collection,
                        label: `${item.label}`,
                        spacing: 2,
                        labelWidth: 50,
                        labelTextStyle: { color: 'white' },
                        frontColor:  '#ED6665',
                    }])
                });
                // setWardCompareData(barchartData?.map(item => ({
                //     ward: item.ward,
                //     month: item.label,
                //     value: item.value,
                //     label: item.ward == ward1 ? `${item.label}` : '',
                //     spacing: 2,
                //     labelWidth: 50,
                //     labelTextStyle: { color: 'white' },
                //     frontColor: item.ward == ward1 ? '#177AD5' : '#ED6665',

                // })));
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
    }

    const handleBarPress = (index) => {
        const selectedData = WardCompareData[index];
        console.log('Selected Data:', selectedData);
        setSelectedWarInfo(selectedData)
        // Do something with the selected data
        // For example, navigate to another screen or show a modal with details
    };

    // Function to format Y-axis labels
    const formatYLabel = (value) => {
        return (value / 1000000).toFixed(1) + 'M';
    };


    useEffect(() => {
        getWardwiseCollections(1, 0)
    }, [])

    console.log(WardCompareData)


    const renderTitle = () => {
        return (
            <View style={{ marginVertical: 20 }}>
                <Text
                    style={{
                        color: 'white',
                        fontSize: 20,
                        fontWeight: 'bold',
                        textAlign: 'center',
                    }}>
                    Collection & Billing
                </Text>
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        marginTop: 24,
                        // backgroundColor: 'yellow',
                    }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
                            Ward : {SelectedWarData.ward1}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
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
                            Ward : {SelectedWarData.ward2}
                        </Text>
                    </View>
                </View>
            </View>
        )
    }


    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={{ marginTop: 10 }}>
                {IsSubmitted &&
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                        <ActivityIndicator size={40} color={Colors.primary} />
                    </View>
                }
                {!IsSubmitted && WardCompareData.length > 0 &&
                    <View style={{
                        flex: 1,
                        backgroundColor: '#333340',
                        paddingBottom: 40,
                        borderRadius: 10,
                        margin: 10,

                    }}>
                        {renderTitle()}
                        <BarChart
                            data={WardCompareData}
                            barWidth={25}
                            width={width}
                            // maxValue={maxAbsValue}
                            spacing={20}
                            xAxisThickness={0}
                            yAxisThickness={0}
                            yAxisTextStyle={{ color: Colors.white }}
                            xAxisLabelTextStyle={{ color: Colors.white, textAlign: 'center' }}
                            // yAxisLabelTexts={yAxisLabels}
                            hideYAxisText
                            // yAxisLabelWidth={80}
                            // isAnimated
                            noOfSections={6}

                            onPress={(event, dataPoint) => handleBarPress(dataPoint)}
                            renderTooltip={(item, index) => {
                                return (
                                    <View
                                        style={{
                                            marginBottom: -40,
                                            marginLeft: -6,
                                            backgroundColor: '#ffcefe',
                                            paddingHorizontal: 6,
                                            paddingVertical: 4,
                                            borderRadius: 4,
                                        }}>
                                        <Text>{formattedAmount(
                                            parseFloat(item.value),
                                            'en-ZA',
                                            'ZAR',
                                            'currency',
                                        )}</Text>
                                    </View>
                                );
                            }}
                        />

                        {SelectedWarInfo &&
                            <View style={{ margin: 10, backgroundColor: Colors.primary, padding: 10, borderRadius: 10 }}>
                                {/* <Text>{JSON.stringify(SelectedWarInfo)}</Text> */}
                                <Text style={{ color: Colors.white, padding: 5 }}>Ward No : {SelectedWarInfo?.ward}</Text>
                                <Text style={{ color: Colors.white, padding: 5 }}>Month : {SelectedWarInfo?.month}</Text>
                                <Text style={{ color: Colors.white, padding: 5 }}>Amount : {formattedAmount(
                                    parseFloat(SelectedWarInfo?.value),
                                    'en-ZA',
                                    'ZAR',
                                    'currency',
                                )}</Text>
                            </View>
                        }
                    </View>

                }

            </ScrollView>

        </SafeAreaView>

    )
}

export default Collections_Billing_BarChartScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 10,
        position: 'relative'
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
        alignItems: 'center'
    },
    buttonText: {
        color: Colors.white,
        fontSize: 16,
    },
    barChart: {

    },

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
})
