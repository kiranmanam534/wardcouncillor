import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, Image, Dimensions, Alert, FlatList, Platform, Button } from 'react-native';
import { TextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/dist/MaterialIcons';
const logo = require('../assets/images/COE_logo_portrait.png');
import { Colors } from '../constant/Colors';
import { useDispatch, useSelector } from 'react-redux';
import LoaderModal from '../components/LoaderModal';
import { GetPaymentHistoryApi } from '../services/councillorWardApi';
import { PaymentHistoryActions } from '../redux/PaymentHistorySlice';
import { formattedAmount } from '../utility/FormattedAmmount';
import { FormateDate } from '../utility/FormateDate';
import ShowMessageCenter from '../components/ShowMessageCenter';
import { apiUrl } from '../constant/CommonData';
import axios from 'axios';
import RNPickerSelect from 'react-native-picker-select';
import { DataTable } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import CustomButton from '../components/CustomButton';

const screenWidth = Dimensions.get('window').width;



const CollectionsSummaryScreen = () => {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear;
    const years = Array.from(
        { length: currentYear - startYear+1 },
        (v, i) => ({ label: (startYear + i).toString(), value: (startYear + i) })
    );

    const months = [
        { label: 'January', value: 'January' },
        { label: 'February', value: 'February' },
        { label: 'March', value: 'March' },
        { label: 'April', value: 'April' },
        { label: 'May', value: 'May' },
        { label: 'June', value: 'June' },
        { label: 'July', value: 'July' },
        { label: 'August', value: 'August' },
        { label: 'September', value: 'September' },
        { label: 'October', value: 'October' },
        { label: 'November', value: 'November' },
        { label: 'December', value: 'December' },
    ];

    const [formValues, setFormValues] = useState({});

    const [IsSubmitted, setIsSubmitted] = useState(false);
    const [statusCode, setStatusCode] = useState(null);
    const [WardCollectionsData, setWardCollectionsData] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    // const [Years, setYears] = useState([]);
    const [isMonthEnable, setisMonthEnable] = useState(false);
    const [pickerVisible, setPickerVisible] = useState(false);

    const loggedUser = useSelector(state => state.loginReducer.items);


    const getWardwiseCollections = async (year1, month) => {
        // console.log(month)
        setIsSubmitted(true);
        setStatusCode(null);
        try {
            const search = '';
            const currentYear = new Date().getFullYear();

            console.log("=======>", month, year1); // This will log the current year, e.g., 2024
            // const response = await axios.post('http://192.168.1.7:5055/api/CouncillorWard/72')
            console.log(`${apiUrl}/api/Collection/get-ward-wise-monthly-collections?Year=${year1}&Month=${month}`)
            const response = await axios.get(`${apiUrl}/api/Collection/get-ward-wise-monthly-collections?Year=${year1}&Month=${month}`);
            console.log(response.data);

            setStatusCode(response.status);
            if (response.status == 200) {
                setWardCollectionsData(response.data.data);
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

            setWardCollectionsData([]);

        }
    }


    // useEffect(() => {
    //     // Generate an array of years from 2000 to 2024
    //     const currentYear = new Date().getFullYear();
    //     const startYear = currentYear - 2;
    //     const years = Array.from(
    //         { length: currentYear - startYear + 1 },
    //         (v, i) => ({ label: (startYear + i).toString(), value: (startYear + i) })
    //     );
    //     setYears(years);

    // }, []);



    const handleInputChangeYear = () => {
        console.log("IOS Year", formValues?.year)
        // setSelectedMonth('')
        // setSelectedYear(selectedYear);
        setisMonthEnable(formValues?.year ? true : false)
    };



    const handleValueChangeYear = useCallback((value, fieldName) => {
        console.log("Year Value changed to: ", value, fieldName);
        setFormValues({
            'month': ''
        });

        setFormValues(prevValues => ({
            ...prevValues,
            [fieldName]: value,
        }));
        // setSelectedYear(value);
        // setSelectedMonth('')
        // setisMonthEnable(value ? true : false)
    }, []);


    const handleInputChange = () => {
        console.log("IOS month - year", formValues)
        // getWardwiseCollections(selectedMonth, selectedYear)
    };

    const handleValueChange = useCallback((value, fieldName) => {
        console.log(fieldName, value)
        setFormValues(prevValues => ({
            ...prevValues,
            [fieldName]: value,
        }));


        // // setSelectedMonth(value);
        // if (Platform.OS == 'android') {
        //     getWardwiseCollections(formValues?.year, value)
        // }
    }, []);

    // console.log(formValues)

    const SearchCollections = () => {
        console.log(formValues)
        if (!formValues?.year || !formValues?.month) {
            ShowAlert("Required", "All feilds are required!")
        } else {
            getWardwiseCollections(formValues?.year, formValues?.month)
        }

    }


    const ShowAlert = (type, mess) => {
        Alert.alert(
            type,
            mess,
            [
                {
                    text: "OK", onPress: () => {
                        console.log("OK Pressed")


                    }
                }
            ]
        );
    }



    // const handleValueChange = (value) => {

    //     console.log('Selected month:', value);
    //     // setSelectedMonth(value);
    //     getWardwiseCollections(value)
    // };


    const calculateTotal = () => {
        return WardCollectionsData?.reduce((sum, item) => sum + parseFloat(item.value), 0).toFixed(2);
    };



    const renderItem = ({ item }) => (
        <DataTable.Row style={styles.infoRow}>
            <DataTable.Cell>{item?.name}</DataTable.Cell>
            <DataTable.Cell>{formattedAmount(parseFloat(item?.value), 'en-ZA', 'ZAR', 'currency')}</DataTable.Cell>
        </DataTable.Row>
    );
    const Footer = ({ total }) => (
        <DataTable.Header style={{ backgroundColor: Colors.yellow,marginBottom:5 }}>
            <DataTable.Title> <Text style={{ color: Colors.black }}>Total</Text></DataTable.Title>
            <DataTable.Title><Text style={{ color: Colors.black }}>{formattedAmount(parseFloat(total), 'en-ZA', 'ZAR', 'currency')}</Text></DataTable.Title>
        </DataTable.Header>

    );




    return (
        <View style={styles1.container}>

            {/* {IsSubmitted && <LoaderModal visible={IsSubmitted} loadingText="Please wait, Data is Loading..." />} */}
            <View style={{ flexDirection: 'row', width: '100%' }}>
                <View style={[styles2.container2, { width: '50%' }]}>

                    <Text style={styles2.label}>Select a year</Text>
                    <View style={styles.inputView}>
                        <RNPickerSelect
                            value={formValues?.year}

                            onValueChange={(value) => { handleValueChangeYear(value, 'year') }}
                            onDonePress={handleInputChangeYear}
                            items={years}
                            placeholder={{
                                label: 'Select a year...',
                                value: null,
                            }}
                            style={{
                                ...pickerSelectStyles,
                                iconContainer: {
                                    top: 10,
                                    right: 12,
                                },
                            }}
                            useNativeAndroidPickerStyle={false}
                            textInputProps={{ underlineColor: 'yellow' }}
                            doneText={Platform.OS === 'ios' ? 'Done' : null}

                            Icon={() => {
                                return <MaterialIcon name="keyboard-arrow-down" size={24} color="gray" />;
                            }}
                        />

                    </View>

                    {/* {selectedMonth && <Text style={styles2.selectedText}>Selected Month: {selectedMonth}</Text>} */}
                </View>
                <View style={[styles2.container2, { width: '50%' }]}>

                    <Text style={styles2.label}>Select a month</Text>
                    <View style={styles.inputView}>
                        <RNPickerSelect
                            value={formValues?.month}
                            onValueChange={(value) => { handleValueChange(value, 'month') }}
                            onDonePress={handleInputChange}
                            items={months}
                            disabled={formValues?.year ? false : true}
                            placeholder={{
                                label: 'Select a month...',
                                value: null,
                            }}
                            style={{
                                ...pickerSelectStyles,
                                iconContainer: {
                                    top: 10,
                                    right: 12,
                                },
                            }}
                            useNativeAndroidPickerStyle={false}
                            textInputProps={{ underlineColor: 'yellow' }}
                            doneText={Platform.OS === 'ios' ? 'Done' : null}

                            Icon={() => {
                                return <MaterialIcon name="keyboard-arrow-down" size={24} color="gray" />;
                            }}
                        />

                    </View>

                    {/* {selectedMonth && <Text style={styles2.selectedText}>Selected Month: {selectedMonth}</Text>} */}
                </View>
            </View>
            <View style={styles2.container2}>
                <CustomButton title={IsSubmitted ? 'Loading...' : 'Search'} onPress={SearchCollections} iconName='search-outline' isClicked={IsSubmitted} />
                {/* <Button disabled={!(formValues?.year && formValues.month)} title='Search' color={Colors.primary} onPress={SearchCollections}></Button> */}
            </View>


            {statusCode && statusCode !== 200 && statusCode != 401 &&
                <ShowMessageCenter message={'Something went wrong!'} />}


            {statusCode && (statusCode === 200 || statusCode === 401) && WardCollectionsData.length == 0 && (
                <ShowMessageCenter message={'No data found.'} />
            )}

            {statusCode === 200 && !IsSubmitted && WardCollectionsData.length > 0 &&
                <View style={[styles.container, { marginVertical: 15, marginHorizontal: 5 }]} h>
                <Footer total={calculateTotal()} />
                    <DataTable style={{ marginBottom: 10, }}>
                        <DataTable.Header style={{ backgroundColor: Colors.blue }}>
                            <DataTable.Title> <Text style={{ color: Colors.white }}>Ward No</Text></DataTable.Title>
                            <DataTable.Title><Text style={{ color: Colors.white }}>Amount</Text></DataTable.Title>
                        </DataTable.Header>
                        {/* <Text>{calculateTotal()}</Text> */}

                        <FlatList
                            data={WardCollectionsData}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => index.toString()}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 100 }} // Adjust the padding as needed
                            ListFooterComponent={<Footer total={calculateTotal()} />}
                        />

                        {/* {WardCollectionsData?.map((item, index) => (

                                <DataTable.Row key={'Collection_' + index}>
                                    <DataTable.Cell>{item?.name}</DataTable.Cell>
                                    <DataTable.Cell>{item?.value}</DataTable.Cell>
                                </DataTable.Row>

                            ))
                            } */}
                    </DataTable>


                </View>


            }




        </View>
    );
};


const InfoRow = ({ icon, text, label, type }) => (

    <View style={styles.infoRow}>
        {/* <Icon name={icon} size={20} style={styles.infoIcon} /> */}
        <Text style={styles.infoText}>{label}</Text>
        <Text style={styles.infoText}>{text}</Text>
    </View>
);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: Colors.primary,
    },
    profilePicture: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 10,
    },
    username: {
        fontSize: 18,
        color: 'gray',
    },
    infoSection: {
        backgroundColor: '#fff',
        padding: 20,
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    infoRow: {
        flexDirection: 'row',
        // alignItems: 'center',
        justifyContent: 'space-between',
        // marginBottom: 10,
        padding: 5,
        borderWidth: 0,
        margin: 2,
        backgroundColor: Colors.lightgray,
        borderRadius: 5

    },
    infoIcon: {
        marginRight: 10,
    },
    infoText: {
        fontSize: 16,
    },
    socialMediaSection: {
        backgroundColor: '#fff',
        padding: 20,
        // marginTop: 10,
        // borderBottomWidth: 1,
        // borderBottomColor: Colors.yellow,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: Colors.blue
    },
    socialMediaIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    socialIcon: {
        marginRight: 10,
    },
    socialText: {
        fontSize: 16,
    },
    activitySection: {
        backgroundColor: '#fff',
        padding: 20,
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    activityItem: {
        fontSize: 16,
        marginBottom: 10,
    },
    box: {
        width: screenWidth / 4,
        height: screenWidth / 4,
        borderWidth: 1, // Border width in pixels
        borderColor: Colors.blue,
        borderRadius: (screenWidth - 50) / 4, // Border radius (optional)
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primary,
        alignSelf: 'center',
        elevation: 1,
        marginTop: 10
    },
    img: {
        width: screenWidth / 3 - 70,
        height: screenWidth / 3 - 70,
        resizeMode: 'contain',
    },
    doneButton: {
        marginTop: 16,
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 4,
        alignItems: 'center',
    },
    doneButtonText: {
        color: 'white',
        fontSize: 16,
    },
});


const styles1 = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        padding: 10,
        elevation: 1, // for Android shadow
        shadowColor: '#000', // for iOS shadow
        shadowOffset: { width: 0, height: 0.5 }, // for iOS shadow
        shadowOpacity: 0.5, // for iOS shadow
        shadowRadius: 2, // for iOS shadow
        zIndex: 10, // ensure it is above other components
    },
    avatar: {
        width: 100,
        height: 100,
        borderWidth: 1,
        borderRadius: 50,
        // marginBottom: 10,
    },
    textInput: {
        height: 40,
        // borderColor: 'gray',
        // borderWidth: 1,
        paddingHorizontal: 10,
        // borderRadius:10
    },
    scrollContent: {
        paddingTop: 60, // make space for the fixed header
        paddingHorizontal: 10,
    },
    text: {
        fontSize: 16,
        paddingVertical: 10,
    },
});

const styles2 = StyleSheet.create({
    container2: {
        //   flex: 1,
        justifyContent: 'center',
        //   alignItems: 'center',
        paddingHorizontal: 10,
        paddingTop: 16,
        backgroundColor: Colors.white,


    },
    label: {
        fontSize: 18,
        marginBottom: 8,
    },
    selectedText: {
        // marginTop: 16,
        fontSize: 16,
    },
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
        position: 'relative'
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: 'purple',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
});


export default CollectionsSummaryScreen;
