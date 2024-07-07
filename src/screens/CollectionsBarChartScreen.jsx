
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Text, ScrollView } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { useSelector } from 'react-redux';
import { apiUrl } from '../constant/CommonData';
import LoaderModal from '../components/LoaderModal';
import ShowMessageCenter from '../components/ShowMessageCenter';
import { Colors } from '../constant/Colors';
import { formattedAmount } from '../utility/FormattedAmmount';
import { formatNumber } from '../utility/formatNumber';


const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const CollectionsBarChartScreen = ({ route }) => {


    const PieColors = ["#25691F", "#481B38", "#3DBB80", "#EF4F1B", "#92886F", "#F7B4D6", "#AA5F76", "#7F27DF", "#374A87", "#7587C2", "#D26A02", "#DF22CF", "#BDA827", "#DE0BA3", "#C9594E", "#5C99AC", "#CF4C42", "#AD3A5D", "#971AAD", "#2B7091", "#D4DAD2", "#022013", "#0CEA6A", "#95B727", "#A8D077", "#97327B", "#6AC652", "#35EE9C", "#FE28DB", "#F1C348", "#6D5CE3", "#2197B7", "#7FC0A3", "#5FBBB3", "#6E3C71", "#EEF0C7", "#A530F9", "#0A17FF", "#33115D", "#B7BB7A", "#F15D8E", "#D9760D", "#205532", "#684FE9"]


    const { wardType,selectedWardNo } = route.params;

    const [IsSubmitted, setIsSubmitted] = useState(false);
    const [statusCode, setStatusCode] = useState(null);
    const [WardCollectionsData, setWardCollectionsData] = useState([]);
    const [maxAbsValue, setMaxAbsValue] = useState();
    const loggedUser = useSelector(state => state.loginReducer.items);

    console.log(loggedUser?.warD_NO, wardType,selectedWardNo)


    const getMonthwiseCollections = async () => {
        try {
            const search = '';
            const currentYear = new Date().getFullYear();
            console.log(currentYear); // This will log the current year, e.g., 2024
            // const response = await axios.post('http://192.168.1.7:5055/api/CouncillorWard/72')
            console.log(`${apiUrl}/api/Collection/get-month-wise-collections?WardNo=${selectedWardNo?selectedWardNo:loggedUser?.warD_NO}&Year=${currentYear}`)
            const response = await axios.get(`${apiUrl}/api/Collection/get-month-wise-collections?WardNo=${selectedWardNo?selectedWardNo:loggedUser?.warD_NO}&Year=${currentYear}`);
            console.log(response.data);

            setStatusCode(response.status);
            if (response.status == 200) {
                console.log('====================================');
                console.log(response.data.data);
                console.log('====================================');
                const barchartData = response.data.data;

                // Determine the maximum absolute value to set the chart's scaling correctly
                const maxPositiveValue = Math.max(...barchartData.map(item => parseInt(item.value) >= 0 ? parseInt(item.value) : 0));
                const maxNegativeValue = Math.min(...barchartData.map(item => parseInt(item.value) < 0 ? parseInt(item.value) : 0));
                setMaxAbsValue(Math.max(maxPositiveValue, Math.abs(maxNegativeValue)));

                setWardCollectionsData(barchartData.map(item => ({
                    value: Math.abs(parseInt(item.value)),
                    label: item.label,
                    frontColor: parseInt(item.value) >= 0 ? '#4CAF50' : '#FF5252',
                    topLabelComponent: () => (
                        <Text style={styles.topLabel}>{parseInt(item.value) > 0 ? formatNumber(parseInt(item.value)) : ''}</Text>
                    ),
                    bottomLabelComponent: () => (
                        <Text style={styles.bottomLabel}>{parseInt(item.value) < 0 ? formatNumber(parseInt(item.value)) : ''}</Text>
                    ),
                    barBackgroundPattern: parseInt(item.value) < 0 ? styles.negativeBar : styles.positiveBar,
                })));

            }

            setIsSubmitted(false);

        } catch (error) {
            console.log(error);
            setIsSubmitted(false);
            setStatusCode(500);
            setWardCollectionsData([]);

        }
    }

    // Utility function to format numbers
    const formatNumberWithoutText = (number) => {
        console.log(number)
        // if (number >= 1000000000) {
        //     return Math.round((number / 1000000000));
        // } else
         if (number >= 1000000) {
            return Math.round((number / 1000000));
        } else if (number >= 1000) {
            return Math.round((number / 1000));// + 'k';
        }
        return number.toString();
    };

    const generateYAxisLabels = (maxValue) => {
        const labels = [];
        const step = maxValue / 4;
        console.log('step=>', step)
        for (let i = 0; i < WardCollectionsData.length; i++) {
            // console.log(formatNumberWithoutText(step * i))
            labels.push(formatNumberWithoutText(step * i));
        }
        return labels;
    };



    useEffect(() => {
        setIsSubmitted(true);
        getMonthwiseCollections()
    }, [loggedUser?.warD_NO, wardType]);




    if (IsSubmitted) {
        return <LoaderModal visible={IsSubmitted} loadingText="Please wait chart is Loading..." />;
    }


    const renderLegend = (text, color, value) => {
        console.log(text, ' === ', value)


        return (
            <View key={text}>
                <View style={{ flexDirection: 'row', marginBottom: 5, margin: 20 }} >
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ color: Colors.primary, fontSize: 13, textDecorationLine: 'underline', textDecorationColor: Colors.yellow }}>
                            {text} : {' '}
                        </Text>
                        <Text style={{ color: Colors.yellow, fontSize: 13, fontWeight: '600' }}>
                            {formattedAmount(
                                parseFloat(value),
                                'en-ZA',
                                'ZAR',
                                'currency',
                            )}

                        </Text>
                    </View>

                </View>
            </View>
        );
    }



    return (
        <ScrollView style={{ flex: 1 }}>
            <View style={styles.container}>

                {statusCode && statusCode !== 200 &&
                    <ShowMessageCenter message={'Something went wrong!'} />}


                {statusCode && statusCode === 200 && WardCollectionsData.length == 0 && (
                    <ShowMessageCenter message={'No data found.'} />
                )}

                {/*********************    Custom Header component      ********************/}

                <View style={{ marginVertical: 10, backgroundColor: Colors.white, padding: 5, borderRadius: 5 }}>
                    <Text
                        style={{
                            color: Colors.blue,
                            fontSize: 25,
                            fontWeight: 'bold',
                            marginBottom: 12,
                        }}>
                        Collections Amount(millions)
                    </Text>
                    {/* <Text style={{ color: Colors.blue, fontSize: 16, fontWeight: '600',textAlign:'center' }}>
              Total :  {formattedAmount(
                parseFloat(74728721),
                'en-ZA',
                'ZAR',
                'currency',
              )}{' '}
              ( {parseFloat((parseFloat(74728721) * 100) / 74728721)} % )
            </Text> */}
                </View>
                {/****************************************************************************/}


                {!IsSubmitted && WardCollectionsData.length > 0 &&

                    <BarChart
                        data={WardCollectionsData}
                        height={400}
                        barWidth={40}
                        maxValue={maxAbsValue}

                        spacing={20}
                        roundedTop
                        yAxisThickness={1}
                        xAxisThickness={1}
                        isAnimated
                        noOfSections={10}
                        // frontColor="#4CAF50"
                        barBorderRadius={4}
                        sideWidth={6}
                        isThreeD
                        // side="right"
                        cappedBars
                        capColor={'rgba(78, 0, 142)'}
                        capThickness={4}
                        showGradient
                        gradientColor={'rgba(200, 100, 244,0.8)'}
                        frontColor={'rgba(219, 182, 249,0.2)'}
                        hideYAxisText
                        // stepHeight={100}
                        showLine
                        lineConfig={{
                            color: '#4CAF50',
                            thickness: 2,
                            curved: true,
                        }}
                        
                        xAxisLabelTextStyle={styles.labelTextStyle}
                        // yAxisLabelTexts={generateYAxisLabels(maxAbsValue)}
                    // yAxisLabelWidth={80} // Adjust the width here as per your requirement
                        renderTooltip={(item, index) => {
                            return (
                                <View
                                    style={{
                                        marginBottom: 0,
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


                }

                {/*********************    Custom Legend component      ********************/}
                <View
                    style={{
                        width: '100%',
                        flexDirection: 'column',
                        justifyContent: 'space-evenly',
                        marginTop: 20,
                    }}>
                    {WardCollectionsData.map((item, index) => (
                        renderLegend(item.label, PieColors[0], item.value)

                    ))}
                    {/* {renderLegend('60 Days', 'lightgreen')}
            {renderLegend('90 Days', 'orange')}
            {renderLegend('120+ Days', Colors.blue)} */}
                </View>
                {/****************************************************************************/}


            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        marginVertical: 20
    },
    labelTextStyle: {
        color: '#4CAF50',
        fontSize: 12,
        fontWeight: 'bold',
    },
    topLabel: {
        color: '#4CAF50',
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: -15
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

export default CollectionsBarChartScreen;
