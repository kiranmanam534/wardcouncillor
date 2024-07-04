import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, Image, Dimensions, Alert, FlatList, Platform } from 'react-native';
import { TextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/dist/MaterialIcons';
const logo = require('../assets/images/Ekurhuleni-Logo-889x1024.png');
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

const screenWidth = Dimensions.get('window').width;



const CollectionsSummaryScreen = () => {

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


    const [IsSubmitted, setIsSubmitted] = useState(false);
    const [statusCode, setStatusCode] = useState(null);
    const [WardCollectionsData, setWardCollectionsData] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('January');
    const [pickerVisible, setPickerVisible] = useState(false);

    const loggedUser = useSelector(state => state.loginReducer.items);


    const getWardwiseCollections = async (month) => {
        // console.log(month)
        setIsSubmitted(true);
        setStatusCode(null);
        try {
            const search = '';
            const currentYear = new Date().getFullYear();
            console.log(currentYear); // This will log the current year, e.g., 2024
            // const response = await axios.post('http://192.168.1.7:5055/api/CouncillorWard/72')
            const response = await axios.get(`${apiUrl}/api/Collection/get-ward-wise-monthly-collections?Year=${currentYear}&Month=${month}`);
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


    useEffect(() => {

        getWardwiseCollections(selectedMonth)
    }, [selectedMonth]);


    const handleInputChange = () => {
        console.log("IOS", selectedMonth)


        getWardwiseCollections(selectedMonth)
    };


    const handleValueChange = (value) => {

        console.log('Selected month:', value);
        setSelectedMonth(value);
    };



    const renderItem = ({ item }) => (
        <DataTable.Row style={styles.infoRow}>
            <DataTable.Cell>{item?.name}</DataTable.Cell>
            <DataTable.Cell>{formattedAmount(parseFloat(item?.value), 'en-ZA', 'ZAR', 'currency')}</DataTable.Cell>
        </DataTable.Row>
    );



    return (
        <View style={styles1.container}>

            {IsSubmitted && <LoaderModal visible={IsSubmitted} loadingText="Please wait, Data is Loading..." />}

            <View style={styles2.container2}>

                <Text style={styles2.label}>Select a Month:</Text>
                <View style={styles.inputView}>
                    <RNPickerSelect
                        value={selectedMonth}
                        onValueChange={(value) => handleValueChange(value)}
                        // onDonePress={handleInputChange}
                        items={months}
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

                        Icon={() => {
                            return <MaterialIcon name="keyboard-arrow-down" size={24} color="gray" />;
                        }}
                    />

                </View>

                {/* {selectedMonth && <Text style={styles2.selectedText}>Selected Month: {selectedMonth}</Text>} */}
            </View>


            {statusCode && statusCode !== 200 && statusCode != 401 &&
                <ShowMessageCenter message={'Something went wrong!'} />}


            {statusCode && (statusCode === 200 || statusCode === 401) && WardCollectionsData.length == 0 && (
                <ShowMessageCenter message={'No data found.'} />
            )}

            {statusCode === 200 && !IsSubmitted && WardCollectionsData.length > 0 &&
                <View style={[styles.container, { marginVertical: 15, marginHorizontal: 5 }]} h>

                    <DataTable style={{ marginBottom: 10, }}>
                        <DataTable.Header style={{ backgroundColor: Colors.blue }}>
                            <DataTable.Title> <Text style={{ color: Colors.white }}>Ward No</Text></DataTable.Title>
                            <DataTable.Title><Text style={{ color: Colors.white }}>Amount</Text></DataTable.Title>
                        </DataTable.Header>

                        <FlatList
                            data={WardCollectionsData}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => index.toString()}
                            showsVerticalScrollIndicator={false}
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
        borderWidth: 2, // Border width in pixels
        borderColor: Colors.red,
        borderRadius: (screenWidth - 50) / 4, // Border radius (optional)
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.white,
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
