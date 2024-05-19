import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, Image, Dimensions, Alert } from 'react-native';
import { TextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/dist/MaterialIcons';
const logo = require('../assets/images/Ekurhuleni-Logo-889x1024.png');
import { Colors } from '../constant/Colors';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { GetCustomer360DataApi } from '../services/councillorWardApi';
import { customer360Actions } from '../redux/customer360Slice';
import LoaderModal from '../components/LoaderModal';
import CustomAlert from '../components/CustomAlert';
import { formattedAmount } from '../utility/FormattedAmmount';

const screenWidth = Dimensions.get('window').width;

const Customer360Screen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const [isAlertVisible, setAlertVisible] = useState(false);
    const [isAlertErrorVisible, setIsAlertErrorVisible] = useState(false);
    const [searchKey, setSearchKey] = useState('');

    const loggedUser = useSelector(state => state.loginReducer.items);

    const { items, isLoading, error, statusCode } = useSelector(
        state => state.customer360Reducer,
    );


    useEffect(() => {
        dispatch(customer360Actions.clearWards())

    }, [loggedUser?.warD_NO]);

    const handleSerach = () => {
        dispatch(customer360Actions.clearWards())
        setIsAlertErrorVisible(true);
        console.log(searchKey)
        if (searchKey) {
            dispatch(GetCustomer360DataApi({ wardNo: loggedUser?.warD_NO, accountNo: searchKey }));
        }
        else {
            //Alert.alert("Required!", "Please enter valid account number!")

            setAlertVisible(true);
        }

    }

    const closeAlert = () => {
        setAlertVisible(false);
    };


    const closeAlert1 = () => {
        setIsAlertErrorVisible(false);
    };



    console.log("360==>", items)




    // if (isLoading) {
    //     return <LoaderModal visible={isLoading} loadingText="Please wait, Data is Loading..." />;
    // }

    return (
        <View style={styles1.container}>
            <View style={styles1.header}>
                <TextInput
                    mode="outlined"
                    label={'Account Number'}
                    style={[styles.textInput, { position: 'relative' }]}
                    value={searchKey}
                    keyboardType='numeric'

                    onChangeText={(value) => {
                        const numericValue = value.replace(/[^0-9]/g, '');
                        setSearchKey(numericValue)
                    }}
                    placeholder="Search with account number..."
                />
                <TouchableOpacity onPress={handleSerach}
                    style={{
                        position: 'absolute',
                        top: 27,
                        right: 25,
                        bottom: 0
                    }}>
                    <Icon name="search" size={25} color={Colors.blue} />
                </TouchableOpacity>
            </View>
            <LoaderModal visible={isLoading} loadingText="Please wait, Data is Loading..." />
            <CustomAlert
                isVisible={isAlertVisible}
                onClose={closeAlert}
                message="Please enter valid account number!"
                imageSource={logo} // Replace with your image URL or local image source
            />
            {items ?
                (items?.outstandingData.length > 0 || items?.meterData.length > 0
                    || items?.propertyData.length > 0 || items?.interimsData.length > 0) ?
                    <ScrollView style={styles.container}>

                        <View style={styles.header}>
                            <View style={styles.box}>
                                <Image source={logo} style={styles.img} />
                            </View>
                            {/* <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.avatar} /> */}
                            <Text style={styles.name}>{items?.customerData[0]?.firstname} {items?.customerData[0]?.lastname}</Text>
                            <Text style={styles.username}>{items?.customerData[0]?.category}</Text>
                            {items?.customerData[0]?.cellphonenumber && <Text style={styles.bio}>{items?.customerData[0]?.cellphonenumber}</Text>}
                            <Text style={styles.bio}>{items?.customerData[0]?.address}</Text>
                        </View>
                        <View style={[styles.socialMediaSection, { borderBottomWidth: 0 }]}>
                            <View style={{ flexDirection: 'row', marginLeft: -15 }}>
                                <Icon name={'hand-o-right'} size={20} style={styles.infoIcon} />
                                <Text style={styles.sectionTitle}>Outstanding Amount</Text>
                            </View>
                            {items?.outstandingData.length > 0 ?
                                items?.outstandingData.map((item, index) => (
                                    <View style={[styles.socialMediaSection, { padding: 0 }]}
                                        key={'Outstanding_' + index}>
                                        <Text style={{ padding: 5, fontWeight: '600', fontSize: 15, color: Colors.white, backgroundColor: Colors.blue }}>#{index + 1}</Text>
                                        <InfoRow icon="info-circle" label={'30 days'} text={formattedAmount(
                                            parseFloat(item?.days30Amount),
                                            'en-ZA',
                                            'ZAR',
                                            'currency',
                                        )} />
                                        <InfoRow icon="map-marker" label={'60 days'} text={formattedAmount(
                                            parseFloat(item?.days60Amount),
                                            'en-ZA',
                                            'ZAR',
                                            'currency',
                                        )} />
                                        <InfoRow icon="map-marker" label={'90 days'} text={formattedAmount(
                                            parseFloat(item?.days90Amount),
                                            'en-ZA',
                                            'ZAR',
                                            'currency',
                                        )} />
                                        <InfoRow icon="map-marker" label={'120+ days'} text={formattedAmount(
                                            parseFloat(item?.days120plusAmount),
                                            'en-ZA',
                                            'ZAR',
                                            'currency',
                                        )} />
                                        <InfoRow icon="envelope" label={'Total'} text={formattedAmount(
                                            parseFloat(item?.totalAmount),
                                            'en-ZA',
                                            'ZAR',
                                            'currency',
                                        )}
                                            type="outstanding total" />
                                    </View>
                                )) :
                                <View style={[styles.socialMediaSection, { padding: 0, justifyContent: 'center', alignSelf: 'center' }]}>
                                    <Text style={{ color: Colors.red }}>No data found!</Text>
                                </View>
                            }

                        </View>
                        <View style={[styles.socialMediaSection, { borderBottomWidth: 0 }]}>
                            <View style={{ flexDirection: 'row', marginLeft: -15 }}>
                                <Icon name={'hand-o-right'} size={20} style={styles.infoIcon} />
                                <Text style={styles.sectionTitle}>Meters</Text>
                            </View>

                            {items?.meterData.length > 0 ?
                                items?.meterData.map((item, index) => (
                                    <View style={[styles.socialMediaSection, { padding: 0 }]}
                                        key={'Meter_' + index}>
                                        <Text style={{ padding: 5, fontWeight: '600', fontSize: 15, color: Colors.white, backgroundColor: Colors.blue }}>#{index + 1}</Text>
                                        <InfoRow icon="envelope" label={'Meter No'} text={item?.meteR_NO} />
                                        <InfoRow icon="info-circle" label={'Status'} text={item?.poD_STATUS} />
                                        <InfoRow icon="map-marker" label={'Address'} text={item?.address} />
                                        <InfoRow icon="map-marker" label={'Previous Reading'} text={item?.previouS_READING} />
                                        <InfoRow icon="map-marker" label={'Previous Reading Date'} text={item?.readinG_TAKEN_DATE?.split(' ')[0]} />
                                    </View>
                                )) :
                                <View style={[styles.socialMediaSection, { padding: 0, justifyContent: 'center', alignSelf: 'center' }]}>
                                    <Text style={{ color: Colors.red }}>No data found!</Text>
                                </View>
                            }


                        </View>
                        <View style={[styles.socialMediaSection, { borderBottomWidth: 0 }]}>
                            <View style={{ flexDirection: 'row', marginLeft: -15 }}>
                                <Icon name={'hand-o-right'} size={20} style={styles.infoIcon} />
                                <Text style={styles.sectionTitle}>Properties</Text>
                            </View>
                            {items?.propertyData.length > 0 ?
                                items?.propertyData.map((item, index) => (
                                    <View style={[styles.socialMediaSection, { padding: 0 }]}
                                        key={'Meter_' + index}>
                                        <Text style={{ padding: 5, fontWeight: '600', fontSize: 15, color: Colors.white, backgroundColor: Colors.blue }}>#{index + 1}</Text>
                                        <InfoRow icon="envelope" label={'Name'} text={item?.accountname} />
                                        <InfoRow icon="info-circle" label={'Cell No'} text={item?.cellphonenumber ? item?.cellphonenumber : 'N/A'} />
                                        <InfoRow icon="map-marker" label={'Address'} text={item?.addressdetails} />
                                        <InfoRow icon="map-marker" label={'Latitude'} text={item?.locationlatitude} />
                                        <InfoRow icon="map-marker" label={'Longitude'} text={item?.locationlongitude} />
                                    </View>
                                )) :
                                <View style={[styles.socialMediaSection, { padding: 0, justifyContent: 'center', alignSelf: 'center' }]}>
                                    <Text style={{ color: Colors.red }}>No data found!</Text>
                                </View>
                            }

                        </View>

                        <View style={[styles.socialMediaSection, { borderBottomWidth: 0 }]}>
                            <View style={{ flexDirection: 'row', marginLeft: -15 }}>
                                <Icon name={'hand-o-right'} size={20} style={styles.infoIcon} />
                                <Text style={styles.sectionTitle}>Interims</Text>
                            </View>

                            {items?.interimsData.length > 0 ?
                                items?.interimsData.map((item, index) => (
                                    <View style={[styles.socialMediaSection, { padding: 0 }]}
                                        key={'Interims_' + index}>
                                        <Text style={{ padding: 5, fontWeight: '600', fontSize: 15, color: Colors.white, backgroundColor: Colors.blue }}>#{index + 1}</Text>
                                        <InfoRow icon="envelope" label={'Meter No'} text={item?.meterNumber} />
                                        <InfoRow icon="envelope" label={'Name'} text={item?.debtorName} />
                                        <InfoRow icon="info-circle" label={'Service'} text={item?.serviceGroup} />
                                        <InfoRow icon="info-circle" label={'Reason'} text={item?.interimsReason} />
                                        <InfoRow icon="map-marker" label={'Township'} text={item?.township} />
                                        <InfoRow icon="envelope" label={'CCA'} text={item?.cca} />
                                        <InfoRow icon="envelope" label={'Cycle'} text={item?.cycle} />
                                        <InfoRow icon="map-marker" label={'Zone'} text={item?.zoning} />
                                        <InfoRow icon="map-marker" label={'Cell No'} text={item?.cellNo ? item?.cellNo : 'N/A'} />
                                    </View>
                                )) :
                                <View style={[styles.socialMediaSection, { padding: 0, justifyContent: 'center', alignSelf: 'center' }]}>
                                    <Text style={{ color: Colors.red }}>No data found!</Text>
                                </View>
                            }


                        </View>
                    </ScrollView> :
                    <CustomAlert
                        isVisible={isAlertErrorVisible}
                        onClose={closeAlert1}
                        message={`You entered account number is  "${searchKey}" doesn't exists.`}
                        message1={'Please enter correct account number!'}
                        imageSource={logo} // Replace with your image URL or local image source
                    />

                : <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: Colors.blue, fontSize: 16 }}>Please search with account number</Text>
                </View>}
        </View>
    );
};


const InfoRow = ({ icon, text, label, type }) => (

    <View style={styles.infoRow}>
        {/* <Icon name={icon} size={20} style={styles.infoIcon} /> */}
        <Text style={[styles.infoText, { fontWeight: (type == 'outstanding total' ? '800' : '500'),color: (type == 'outstanding total' ? Colors.primary : '') }]}>{label}</Text>
        <Text style={[styles.infoText, { fontWeight: (type == 'outstanding total' ? '800' : '500'),color: (type == 'outstanding total' ? Colors.primary : '') }]}>{text}</Text>
    </View>
);

const SocialMediaIcon = ({ name, handle }) => (
    <TouchableOpacity style={styles.socialMediaIcon}>
        <Icon name={name} size={20} style={styles.socialIcon} />
        <Text style={styles.socialText}>@{handle}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        marginTop: 80
    },
    header: {
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
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

export default Customer360Screen;
