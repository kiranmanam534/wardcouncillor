

import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Dimensions, Image, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { TextInput } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker'
import { FormateDate } from '../utility/FormateDate'
import { Colors } from '../constant/Colors'
import { convertToDateTime, getTime } from '../utility/formattedTime';
import { useDispatch, useSelector } from 'react-redux';
import ErrorModal from '../components/ErrorModal';
import { CreateWarningsApi } from '../services/councillorWardApi';
import { createWarningsActions } from '../redux/createWarningsSlice';
import CreateWarningsSchema from '../validation/CreateWarningsSchema';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import Ionicon from 'react-native-vector-icons/dist/Ionicons';
import MaterialIcon from 'react-native-vector-icons/dist/MaterialIcons';
import BinaryImageModal from '../components/BinaryImageModal';
import CameraModal from '../components/CameraModal';
import { launchImageLibrary as _launchImageLibrary, launchCamera as _launchCamera } from 'react-native-image-picker';
let launchImageLibrary = _launchImageLibrary;
let launchCamera = _launchCamera;

const logo = require('../assets/images/Ekurhuleni-Logo-889x1024.png');

const screenWidth = Dimensions.get('window').width;

// Utility function to chunk the data
const chunkArray = (array, chunkSize) => {
    const result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        result.push(array.slice(i, i + chunkSize));
    }
    return result;
};

function WarningssScreen() {


    const dispatch = useDispatch();

    const [formValues, setFormValues] = useState({});
    const loggedUser = useSelector(state => state.loginReducer.items);

    const { data, isLoading, error, statusCode } = useSelector(
        state => state.createWarningsReducer,
    );

    console.log(statusCode, isLoading);

    const [date, setDate] = useState(new Date())

    const [showDatePicker, setShowDatePicker] = useState('');
    const [showTimePicker, setShowTimePicker] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);

    const [showCameraModal, setShowCameraModal] = useState(false);
    const [viewBinaryImage, setViewBinaryImage] = useState(null);
    const [isBinaryImage, setIsBinaryImage] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);

    const [errors, setErrors] = useState({});

    const handleInputChange = (fieldName, value) => {
        console.log(fieldName, value)
        setFormValues(prevValues => ({
            ...prevValues,
            [fieldName]: value,
        }));

        setErrors(prevValues => ({
            ...prevValues,
            [fieldName]: '',
        }));
    };



    const toggleDatePicker = (value) => {
        setShowDatePicker(value)

    }

    const toggleTimePicker = (value) => {
        setShowTimePicker(value)

    }

    const onChageDatePicker = (event, selectedDate, fieldName) => {
        if (event.type == 'set') {
            const currentDate = selectedDate;
            setDate(currentDate)

            if (Platform.OS == 'android') {
                toggleDatePicker('NO');
                setTimeout(() => {
                    setFormValues(prevValues => ({
                        ...prevValues,
                        [fieldName]: FormateDate(currentDate),
                    }));
                    setErrors(prevValues => ({
                        ...prevValues,
                        [fieldName]: '',
                    }));

                }, 50);
            }


        } else {
            toggleDatePicker('NO');
        }
    }

    const onChageTimePicker = (event, selectedDate, fieldName) => {
        if (event.type == 'set') {
            const currentDate = selectedDate;
            setDate(currentDate)

            if (Platform.OS == 'android') {
                toggleTimePicker("no");
                setTimeout(() => {
                    setFormValues(prevValues => ({
                        ...prevValues,
                        [fieldName]: getTime(currentDate),
                    }));
                    setErrors(prevValues => ({
                        ...prevValues,
                        [fieldName]: '',
                    }));
                }, 50);
            }



        } else {
            toggleTimePicker('no');
        }
    }
    const confoirmIOSDate = (fieldName) => {
        console.log(fieldName)
        toggleDatePicker('No');
        setTimeout(() => {
            setFormValues(prevValues => ({
                ...prevValues,
                [fieldName]: FormateDate(date),
            }));
            setErrors(prevValues => ({
                ...prevValues,
                [fieldName]: '',
            }));
        }, 50);
    }

    const confoirmIOSTime = (fieldName) => {
        console.log(fieldName, date)
        toggleTimePicker('No');
        setTimeout(() => {
            setFormValues(prevValues => ({
                ...prevValues,
                [fieldName]: getTime(date),
            }));
            setErrors(prevValues => ({
                ...prevValues,
                [fieldName]: '',
            }));
        }, 50);
    }

    useEffect(() => {
        if (!isLoading && error) {
            setShowErrorModal(true);
        }
    }, [error, isLoading]);

    const closeModal = () => {
        setShowErrorModal(false);
    };


    const openImagePicker = () => {
        const options = {
            mediaType: 'photo',
            includeBase64: true,
            maxHeight: 2000,
            maxWidth: 2000,
        };

        launchImageLibrary(options, handleResponse);
    };

    const handleCameraLaunch = () => {

        const options = {
            mediaType: 'photo',
            includeBase64: true,
            maxHeight: 2000,
            maxWidth: 2000,

        };

        launchCamera(options, handleResponse);
    };

    const handleResponse = (response) => {
        setShowCameraModal(false)
        if (response.didCancel) {
            console.log('User cancelled image picker');
        } else if (response.error) {
            console.log('Image picker error: ', response.error);
        } else {
            console.log('====================================');
            // console.log(response);
            console.log('====================================');
            let imageUri = response.uri || response.assets?.[0]?.uri;
            // setSelectedImage(imageUri);

            // Convert to binary
            const asset = response.assets[0];
            const binary = asset.base64;
            const base64String = 'data:image/jpg;base64,' + binary;

            // console.log(base64String)

            const fileExtension = response.assets?.[0]?.fileName.split('.')[1];
            setSelectedImages([...selectedImages,
            {
                "id": 0,
                "image": binary,
                "extension": fileExtension,
                "device": Platform.OS,
                "useR_ID": loggedUser?.userid
            }

                //   {
                //   "filename": response.assets?.[0]?.fileName,
                //   "image": binary,
                //   "extension": fileExtension
                // }
            ]);


            // handlePostRequest(base64String, response.assets?.[0]?.fileName.split('.')[1])

        }
    };




    const removeSelectedImage = (index) => {
        setSelectedImages(
            selectedImages.filter((item, index1) => {
                return index1 != index
            })
        );
    }


    const viewImageonModal = (binaryImg) => {
        setIsBinaryImage(true)
        setViewBinaryImage(binaryImg)
    }


    const onCloseBinaryImageModal = (binaryImg) => {
        setIsBinaryImage(false)
    }



    const closeCameraModal = () => {
        setShowCameraModal(false);
    };

    const handleSubmit = async () => {
        try {

            await CreateWarningsSchema.validate(formValues, { abortEarly: false });

            let formData =
            {
                "warninG_DATE": formValues.warninG_DATE,
                "warninG_TIME": convertToDateTime(formValues.warninG_TIME),
                "location": formValues.location,
                "latitude": "0.00",//Platform.OS == "ios" ? formValues.latitude : "0.00",
                "longitude": "0.00",//Platform.OS == "ios" ? formValues.longitude : "0.00",
                "typeofwarning": formValues.typeofwarning,
                "warninG_DETAILS": formValues.warninG_DETAILS,
                "expirY_DATE": formValues.warninG_DATE,
                "userid": loggedUser?.userid,
                "warD_NO": loggedUser?.warD_NO
            }
            let postData = {
                "warningInputData": formData,
                "imG_LIST": selectedImages
            }

            console.log('Form data:', formData);

            dispatch(CreateWarningsApi(postData));

        } catch (error) {
            // Validation failed, set errors
            console.log(error)
            const validationErrors = {};
            error.inner.forEach(e => {
                validationErrors[e.path] = e.message;
                console.log(e.message);
            });
            setErrors(validationErrors);
        }
    };



    return (


        <SafeAreaView style={styles.container}>
            <ErrorModal
                visible={showErrorModal}
                ErrorModalText={statusCode && (statusCode !== 200 ? 'Something went wrong!' : error)}
                closeModal={closeModal}
                onPress={() => {
                    dispatch(createWarningsActions.clear());
                    if (statusCode === 200) {
                        setFormValues();
                        setSelectedImages([])
                        setErrors()

                        closeModal();
                    } else {
                        closeModal();
                    }
                }}
            />
            <ScrollView>
                <View style={styles.box}>
                    <Image source={logo} style={styles.img} />
                </View>
                <Text style={styles.title}>Create Warning</Text>
                <View style={styles.inputView}>
                    <Pressable onPress={() => { toggleDatePicker('warninG_DATE') }}>
                        <TextInput
                            mode="outlined"
                            label={'Warning Date'}
                            style={{ backgroundColor: Colors.white }}
                            placeholder='2024-01-01'
                            value={
                                formValues?.warninG_DATE
                            }
                            onChangeText={value => handleInputChange('warninG_DATE', value)}
                            placeholderTextColor={'#11182744'}
                            editable={false}
                            onPressIn={() => { toggleDatePicker('warninG_DATE') }}
                        />
                         <View style={{ position: 'absolute', right: 10, top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
                            <Icon name="calendar" size={25} color={Colors.blue} />
                        </View>
                    </Pressable>
                    {errors?.warninG_DATE && (
                        <Text style={{ color: 'red' }}>{errors?.warninG_DATE}</Text>
                    )}

                </View>

                <View style={styles.inputView}>

                    <Pressable onPress={() => { toggleTimePicker('warninG_TIME') }}>
                        <TextInput
                            mode="outlined"
                            label={'Warning Time'}
                            style={{ backgroundColor: Colors.white }}
                            placeholder='10:30 AM/PM'
                            value={
                                formValues?.warninG_TIME
                            }
                            onChangeText={value => handleInputChange('warninG_TIME', value)}
                            placeholderTextColor={'#11182744'}
                            editable={false}
                            onPressIn={() => { toggleTimePicker('warninG_TIME') }}
                        />
                         <View style={{ position: 'absolute', right: 10, top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
                            <MaterialIcon name="timer" size={25} color={Colors.blue} />
                        </View>
                    </Pressable>

                    {errors?.warninG_DATE && (
                        <Text style={{ color: 'red' }}>{errors?.warninG_DATE}</Text>
                    )}

                </View>


                <View style={styles.inputView}>
                    {/* {Platform.OS == 'android' && */}
                        <TextInput
                            mode="outlined"
                            label={'Location'}
                            style={{ backgroundColor: Colors.white }}
                            placeholder='Location'
                            value={
                                formValues?.location ? (formValues?.location) : ''
                            }
                            autoCorrect={false}
                            keyboardType='default'
                            autoCapitalize="none"
                            onChangeText={value => handleInputChange('location', value)}
                            placeholderTextColor={'#11182744'}

                        />
                          <View style={{ position: 'absolute', right: 30, top: 5, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
                        <MaterialIcon name="my-location" size={25} color={Colors.blue} />
                    </View>
                    {/* } */}

                    {/* {Platform.OS == 'ios' &&
                        <View style={{ borderWidth: 0.7, borderRadius: 5, borderColor: Colors.black, flex: 1 }}>
                            <GooglePlacesAutocomplete
                                GooglePlacesDetailsQuery={{ fields: "geometry" }}
                                fetchDetails={true} // you need this to fetch the details object onPress
                                placeholder="Search"
                                query={{
                                    key: "AIzaSyCG4Tc5v-7PBF4JO-6NKx2aX0xDNCZ4BVM",
                                    language: "en", // language of the results
                                }}
                                listViewDisplayed={true}
                                onPress={(data, details = null) => {
                                    console.log("data", data);
                                    console.log("details", details);
                                    console.log(JSON.stringify(details?.geometry?.location));
                                    console.log('lat', details?.geometry?.location?.lat);
                                    console.log('lat', details?.geometry?.location?.lng);
                                    formValues.latitude = details?.geometry?.location?.lat.toString();
                                    formValues.longitude = details?.geometry?.location?.lng.toString();
                                    handleInputChange('location', data?.description)
                                }}
                                onFail={(error) => console.error(error)}

                            />
                        </View>
                    } */}

                    {errors?.location && (
                        <Text style={{ color: 'red' }}>{errors?.location}</Text>
                    )}
                </View>

                <View style={styles.inputView}>
                    <TextInput
                        mode="outlined"
                        label={'Warning Type'}
                        style={{ backgroundColor: Colors.white }}
                        placeholder='Warning Type'
                        value={
                            formValues?.typeofwarning ? (formValues?.typeofwarning) : ''
                        }
                        autoCorrect={false}
                        keyboardType='default'
                        autoCapitalize="none"
                        onChangeText={value => handleInputChange('typeofwarning', value)}
                        placeholderTextColor={'#11182744'}

                    />
                    {errors?.typeofwarning && (
                        <Text style={{ color: 'red' }}>{errors?.typeofwarning}</Text>
                    )}
                </View>

                <View style={styles.inputView}>
                    <TextInput
                        mode="outlined"
                        label={'Warning Details'}
                        numberOfLines={5}
                        multiline
                        style={{ backgroundColor: Colors.white }}
                        placeholder='Warnings Details'
                        value={
                            formValues?.warninG_DETAILS ? (formValues?.warninG_DETAILS) : ''
                        }
                        autoCorrect={false}
                        keyboardType='default'
                        autoCapitalize="none"
                        onChangeText={value => handleInputChange('warninG_DETAILS', value)}
                        placeholderTextColor={'#11182744'}
                        height={100}
                        textAlignVertical='top'

                    />
                    {errors?.warninG_DETAILS && (
                        <Text style={{ color: 'red' }}>{errors?.warninG_DETAILS}</Text>
                    )}
                </View>

                {chunkArray(selectedImages, 5).map((item, index1) => (
          <View key={index1} style={styles.row}>
            {item.map((subItem, index) => (
              <View key={index} style={[styles.item, { position: 'relative' }]}

              >
                <TouchableOpacity onPress={() => { viewImageonModal(subItem.image) }}>
                  <Image
                    source={{ uri: 'data:image/jpg;base64,' + subItem.image }}
                    // style={{ flex: 1 }}
                    width={40}
                    height={40}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => removeSelectedImage(index)} style={{ position: 'absolute', right: 0 }}>
                  <Ionicon name={'close-circle-outline'} size={25} color={Colors.blue} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ))}

        <View style={styles.buttonView}>
          <Pressable style={styles.CameraButton} onPress={() => setShowCameraModal(true)}>
            <Icon name="camera" size={25} color={Colors.blue} />
            <Text style={[styles.CameraText, { paddingLeft: 10 }]}>
              Capture images
            </Text>
          </Pressable>
        </View>

                <View style={styles.buttonView}>
                    <Pressable style={styles.button} onPress={() => handleSubmit()}>
                        <Text style={styles.buttonText}>
                            {isLoading && (
                                <ActivityIndicator size={20} color={Colors.white} />
                            )}{' '}
                            SAVE
                        </Text>
                    </Pressable>
                </View>

                <BinaryImageModal
          visible={isBinaryImage}
          onClose={onCloseBinaryImageModal}
          binaryImageData={viewBinaryImage}
        />



        <CameraModal
          isVisible={showCameraModal}
          onClose={closeCameraModal}
          openCamera={handleCameraLaunch}
          openGallery={openImagePicker}
        />


            </ScrollView>
            <View style={[{ position: 'absolute', bottom: 0, backgroundColor: Colors.white, width: '100%' }]}>

                {showDatePicker == "warninG_DATE" && (
                    <>
                        <DateTimePicker
                            mode='date'
                            display='spinner'
                            value={date}
                            onChange={(event, selectedDate) =>
                                onChageDatePicker(
                                    event,
                                    selectedDate,
                                    'warninG_DATE'
                                )
                            }
                            style={Platform.OS == 'ios' && styles.datePicker}


                        />
                        {Platform.OS == 'ios' && (
                            <View style={{
                                flexDirection: 'row', justifyContent: 'space-evenly', position: 'absolute', bottom: 20,
                                width: '100%'
                            }}>
                                <TouchableOpacity style={[styles.button, styles.pickerButton,
                                { backgroundColor: '#11182711' }]}
                                    onPress={() => { toggleDatePicker('No') }}
                                >
                                    <Text style={[styles.buttonText, { color: '#075985' }]}>Cancel</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={[styles.button, styles.pickerButton,
                                ]}
                                    onPress={() => { confoirmIOSDate('warninG_DATE') }}
                                >
                                    <Text style={styles.buttonText}>Confirm</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </>

                )}


                {showTimePicker == 'warninG_TIME' && (
                    <>
                        <DateTimePicker
                            mode='time'
                            display='spinner'
                            value={date}
                            onChange={(event, selectedDate) =>
                                onChageTimePicker(
                                    event,
                                    selectedDate,
                                    'warninG_TIME'
                                )
                            }
                            style={Platform.OS == 'ios' && styles.datePicker}
                        />
                        {Platform.OS == 'ios' && (
                            <View style={{
                                flexDirection: 'row', justifyContent: 'space-evenly', position: 'absolute', bottom: 20,
                                width: '100%'
                            }}>
                                <TouchableOpacity style={[styles.button, styles.pickerButton,
                                { backgroundColor: '#11182711' }]}
                                    onPressIn={() => { toggleTimePicker('No') }}
                                >
                                    <Text style={[styles.buttonText, { color: '#075985' }]}>Cancel</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={[styles.button, styles.pickerButton,
                                ]}
                                    onPress={() => { confoirmIOSTime("warninG_TIME") }}
                                >
                                    <Text style={styles.buttonText}>Confirm</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                    </>
                )}

            </View>

        </SafeAreaView>
    );
}

export default WarningssScreen

const styles = StyleSheet.create({
    container: {
        // alignItems: 'center',
        flex: 1,
        marginTop: 10,
        position: 'relative'
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        // textTransform: 'uppercase',
        textAlign: 'center',
        paddingVertical: 20,
        color: Colors.primary,
    },
    inputView: {
        gap: 10,
        width: '100%',
        paddingHorizontal: 20,
        marginBottom: 5,
    },
    forgetText: {
        fontSize: 14,
        color: Colors.primary,
    },
    button: {
        backgroundColor: Colors.yellow,
        height: 45,
        borderColor: Colors.blue,
        borderWidth: 1,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
    buttonView: {
        width: '100%',
        paddingHorizontal: 20,
        marginTop: 10,
        marginBottom: 20,
    },
    optionsText: {
        textAlign: 'center',
        paddingVertical: 10,
        color: Colors.primary,
        fontSize: 13,
        marginBottom: 6,
    },
    mediaIcons: {
        flexDirection: 'row',
        gap: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 23,
    },
    icons: {
        width: 40,
        height: 40,
    },
    footerText: {
        textAlign: 'center',
        color: Colors.red,
        marginTop: 10,
        marginBottom: 30,
    },
    signup: {
        color: Colors.primary,
        fontSize: 16,
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
        elevation: 1,
        alignSelf: 'center',
    },
    img: {
        width: screenWidth / 3 - 60,
        height: screenWidth / 3 - 60,
        resizeMode: 'contain',
    },
    button1: {
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        marginTop: 10,
        marginBottom: 15,
        backgroundColor: '#075985'
    },
    buttonText1: {
        fontSize: 14,
        fontWeight: "500",
        color: "#fff"
    },
    pickerButton: {
        paddingHorizontal: 20
    },
    datePicker: {
        height: 300,
        bottom: 50
    },

    dropdown: {
        width: '100%',
        height: 50,
        paddingLeft: 7,
        borderColor: Colors.black,
        borderWidth: 1,
        borderRadius: 7,
        color: Colors.black,
        backgroundColor: Colors.white
    },
    itemStyle: {
        fontSize: 16,
        color: 'black', // Default text color
    },
    input: {
        width: '100%',
        height: 50,
        paddingHorizontal: 20,
        borderColor: Colors.black,
        borderWidth: 1,
        borderRadius: 7,
        color: Colors.black,
    },
    CameraButton: {
      backgroundColor: Colors.white,
      height: 45,
      borderColor: Colors.black,
      borderWidth: 0.5,
      borderRadius: 5,
      flexDirection: 'row',
      alignItems: 'center',
      // justifyContent: 'center',
      paddingLeft: 10
    },
    CameraText: {
      color: Colors.primary,
      fontSize: 18,
      fontWeight: 'bold',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 10,
    },
    item: {
      flex: 1,
      marginHorizontal: 5,
      padding: 10,
      backgroundColor: Colors.white,
      alignItems: 'center',
    },
})