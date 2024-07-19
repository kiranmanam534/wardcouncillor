import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, Image, Dimensions, Alert } from 'react-native';
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

const screenWidth = Dimensions.get('window').width;

const PaymentHistoryScreen = ({ route }) => {
    const dispatch = useDispatch();

    const { accountNo } = route.params;

    const loggedUser = useSelector(state => state.loginReducer.items);

    const { items, isLoading, error, statusCode } = useSelector(
        state => state.PaymentHistoryReducer,
    );


    useEffect(() => {
        dispatch(PaymentHistoryActions.clearWards())
        dispatch(GetPaymentHistoryApi(accountNo))

    }, [loggedUser?.warD_NO]);




    console.log('====================================');
    console.log('accountNo', accountNo);
    console.log('====================================');

    console.log("Payment history==>", items)



    return (
        <View style={styles1.container}>

            <LoaderModal visible={isLoading} loadingText="Please wait, Data is Loading..." />
            
            {items ?
                (items?.length > 0) ?
                    <ScrollView style={styles.container}>


                        <View style={[styles.socialMediaSection, { borderBottomWidth: 0 }]}>
                            <View style={{ flexDirection: 'row', marginLeft: -15 }}>
                                <Icon name={'hand-o-right'} size={20} style={styles.infoIcon} />
                                <Text style={styles.sectionTitle}>Account No : ({items[0]?.accountNumber})</Text>
                            </View>

                            {items?.length > 0 ?
                                items?.map((item, index) => (
                                    <View style={[styles.socialMediaSection, { padding: 0 }]}
                                        key={'Meter_' + index}>
                                        <Text style={{ padding: 5, fontWeight: '600', fontSize: 15, color: Colors.white, backgroundColor: Colors.blue }}>#{index + 1}</Text>
                                        {/* <InfoRow icon="map-marker" label={'Account No'} text={item?.accountNumber} /> */}
                                        <InfoRow icon="envelope" label={'Payemnt Date'} text={FormateDate(item?.paymentDateTime)} />
                                        <InfoRow icon="info-circle" label={'Amount Paid'} text={formattedAmount(
                                            parseFloat(item?.amountPaid),
                                            'en-ZA',
                                            'ZAR',
                                            'currency',
                                        )} />
                                        <InfoRow icon="map-marker" label={'Payment Type'} text={item?.paymentType} />
                                    </View>
                                )) :
                                <View style={[styles.socialMediaSection, { padding: 0, justifyContent: 'center', alignSelf: 'center' }]}>
                                    <Text style={{ color: Colors.red }}>No data found!</Text>
                                </View>
                            }


                        </View>


                    </ScrollView> :

                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ShowMessageCenter message={'No data found.'} />
                    </View>

                : ""}
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
        backgroundColor: Colors.lightgray2,
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
        marginTop: 10,
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
});


const styles1 = StyleSheet.create({
    container: {
        flex: 1,
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

export default PaymentHistoryScreen;
