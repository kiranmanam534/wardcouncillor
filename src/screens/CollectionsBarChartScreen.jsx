
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { useSelector } from 'react-redux';
import { apiUrl } from '../constant/CommonData';
import LoaderModal from '../components/LoaderModal';
import ShowMessageCenter from '../components/ShowMessageCenter';


const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const CollectionsBarChartScreen = ({ route }) => {
    const barData = [
        { "label": "Jan", "value": "2580318260" },
        { "label": "Feb", "value": "2700349858" },
        { "label": "Mar", "value": "2698127008" },
        { "label": "Apr", "value": "2715351538" },
        { "label": "May", "value": "2774704147" },
        { "label": "Jun", "value": "1112271895" },
        { value: 2715351538, label: 'Jul' },
        { value: 1112271895, label: 'Aug' },
        { value: 2698127008, label: 'Sep' },
        { value: 1112271895, label: 'Oct' },
        { value: 2698127008, label: 'Nov' },
        { value: 2715351538, label: 'Dec' },
    ]
    const barData11 = [
        { value: 45, label: 'Jan' },
        { value: -30, label: 'Feb' },
        { value: 60, label: 'Mar' },
        { value: -50, label: 'Apr' },
        { value: 70, label: 'May' },
        { value: -40, label: 'Jun' },
        { value: 90, label: 'Jul' },
        { value: -80, label: 'Aug' },
        { value: 55, label: 'Sep' },
        { value: 65, label: 'Oct' },
        { value: -35, label: 'Nov' },
        { value: 75, label: 'Dec' },
    ];
    const barData1 = [
        { "value": "45", "label": "Jan" },
        // { value: 30, label: 'Feb' },
        // { value: 60, label: 'Mar' },
        // { value: 50, label: 'Apr' },
        // { value: 70, label: 'May' },
        // { value: 40, label: 'Jun' },
        // { value: 90, label: 'Jul' },
        // { value: 80, label: 'Aug' },
        // { value: 55, label: 'Sep' },
        // { value: 65, label: 'Oct' },
        // { value: 35, label: 'Nov' },
        // { value: 75, label: 'Dec' },
    ];

    const { wardType } = route.params;

    const [IsSubmitted, setIsSubmitted] = useState(false);
    const [statusCode, setStatusCode] = useState(null);
    const [WardCollectionsData, setWardCollectionsData] = useState([]);
    const [maxAbsValue, setMaxAbsValue] = useState([]);
    const loggedUser = useSelector(state => state.loginReducer.items);

    console.log(loggedUser?.warD_NO, wardType)


    const getMonthwiseCollections = async () => {
        try {
            const search = '';
            const currentYear = new Date().getFullYear();
            console.log(currentYear); // This will log the current year, e.g., 2024
            // const response = await axios.post('http://192.168.1.7:5055/api/CouncillorWard/72')
            console.log(`${apiUrl}/api/Collection/get-month-wise-collections?WardNo=${loggedUser?.warD_NO}&Year=${currentYear}`)
            const response = await axios.get(`${apiUrl}/api/Collection/get-month-wise-collections?WardNo=${loggedUser?.warD_NO}&Year=${currentYear}`);
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
                    // topLabelComponent: () => (
                    //   <Text style={styles.topLabel}>{item.value >= 0 ? item.value : ''}</Text>
                    // ),
                    bottomLabelComponent: () => (
                        <Text style={styles.bottomLabel}>{parseInt(item.value) < 0 ? parseInt(item.value) : ''}</Text>
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




    useEffect(() => {
        setIsSubmitted(true);
        getMonthwiseCollections()
    }, [loggedUser?.warD_NO, wardType]);



    if (IsSubmitted) {
        return <LoaderModal visible={IsSubmitted} loadingText="Please wait chart is Loading..." />;
    }



    return (
        <View style={styles.container}>

            {statusCode && statusCode !== 200 &&
                <ShowMessageCenter message={'Something went wrong!'} />}


            {statusCode && statusCode === 200 && WardCollectionsData.length == 0 && (
                <ShowMessageCenter message={'No data found.'} />
            )}

            {!IsSubmitted && WardCollectionsData.length > 0 &&
                <BarChart
                    data={WardCollectionsData}
                    height={400}
                    barWidth={20}
                    maxValue={maxAbsValue}

                    spacing={10}
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
                    // showLine
                    // lineConfig={{
                    //     color: '#4CAF50',
                    //     thickness: 2,
                    //     curved: true,
                    // }}
                    xAxisLabelTextStyle={styles.labelTextStyle}
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
                                <Text>{item.value}</Text>
                            </View>
                        );
                    }}

                />
            }

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
