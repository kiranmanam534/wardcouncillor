import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {TextInput} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import {FormateDate} from '../utility/FormateDate';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {Colors} from '../constant/Colors';
import {
  convertToDateTime,
  formatDateTime,
  getTime,
} from '../utility/formattedTime';
import {useDispatch, useSelector} from 'react-redux';
import ErrorModal from '../components/ErrorModal';
import CreateRoadClosureScrema from '../validation/CreateRoadClosureSchema';
import {CreateRoadClosureApi} from '../services/councillorWardApi';
import {createRoadClosureActions} from '../redux/createRoadClosureSlice';

import Icon from 'react-native-vector-icons/dist/FontAwesome';
import Ionicon from 'react-native-vector-icons/dist/Ionicons';
import MaterialIcon from 'react-native-vector-icons/dist/MaterialIcons';
import BinaryImageModal from '../components/BinaryImageModal';
import CameraModal from '../components/CameraModal';

import {
  launchImageLibrary as _launchImageLibrary,
  launchCamera as _launchCamera,
} from 'react-native-image-picker';
import {useNavigation} from '@react-navigation/native';
import {AnnounceViewActions} from '../redux/announcementViewSlice';
import {apiUrl} from '../constant/CommonData';
import axios from 'axios';
import {getGeocode} from '../session/getGeocode';
import AddressModal from '../components/AddressModal';
let launchImageLibrary = _launchImageLibrary;
let launchCamera = _launchCamera;

const logo = require('../assets/images/COE_logo_portrait.png');

const screenWidth = Dimensions.get('window').width;

// Utility function to chunk the data
const chunkArray = (array, chunkSize) => {
  const result = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
};

function RoadClousureScreen({route}) {
  const {title, type, editItem} = route.params;
  console.log(title, type, editItem);
  const navigation = useNavigation();

  const dispatch = useDispatch();

  const [formValues, setFormValues] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [Isaddress, setIsaddress] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [autoLocation, setAutoLocation] = useState('');

  // Set the maximum date to today
  const today = new Date();
  const [selectedStartDate, setSelectedStartDate] = useState(today);
  const [selectedEndDate, setSelectedEndDate] = useState(null);

  const loggedUser = useSelector(state => state.loginReducer.items);

  const {data, isLoading, error, statusCode} = useSelector(
    state => state.createRoadClosureReducer,
  );

  console.log(statusCode, isLoading);

  const [date, setDate] = useState(new Date());

  const [showDatePicker, setShowDatePicker] = useState('');
  const [showTimePicker, setShowTimePicker] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);

  const [showCameraModal, setShowCameraModal] = useState(false);
  const [viewBinaryImage, setViewBinaryImage] = useState(null);
  const [isBinaryImage, setIsBinaryImage] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

  const [errors, setErrors] = useState({});

  const handleInputChange = (fieldName, value) => {
    console.log(fieldName, value);
    setFormValues(prevValues => ({
      ...prevValues,
      [fieldName]: value,
    }));

    setErrors(prevValues => ({
      ...prevValues,
      [fieldName]: '',
    }));
  };

  const toggleDatePicker = value => {
    setShowDatePicker(value);
  };

  const toggleTimePicker = value => {
    setShowTimePicker(value);
  };

  const onChageDatePicker = (event, selectedDate, fieldName) => {
    if (event.type == 'set') {
      const currentDate = selectedDate;
      setDate(currentDate);
      if (fieldName == 'roadclouseR_STARTDATE') {
        setSelectedStartDate(currentDate);
      } else if (fieldName == 'roadclouseR_ENDDATE') {
        setSelectedEndDate(currentDate);
      }
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
  };

  const onChageTimePicker = (event, selectedDate, fieldName) => {
    if (event.type == 'set') {
      const currentDate = selectedDate;
      setDate(currentDate);

      if (Platform.OS == 'android') {
        toggleTimePicker('no');
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
  };
  const confoirmIOSDate = fieldName => {
    console.log(fieldName);
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
  };

  const confoirmIOSTime = fieldName => {
    console.log(fieldName, date);
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
  };

  useEffect(() => {
    if (editItem) {
      setFormValues({
        roadclouseR_STARTDATE:
          editItem.roadclouseR_STARTDATE &&
          formatDateTime(editItem.roadclouseR_STARTDATE, 'date'),
        roadclouseR_STARTTIME:
          editItem.roadclouseR_STARTIME &&
          formatDateTime(editItem.roadclouseR_STARTIME, 'time'),
        roadclouseR_ENDDATE:
          editItem.roadclouseR_ENDDATE &&
          formatDateTime(editItem.roadclouseR_ENDDATE, 'date'),
        roadclouseR_ENDTIME:
          editItem.roadclouseR_ENDTIME &&
          formatDateTime(editItem.roadclouseR_ENDTIME, 'time'),
        location: editItem.location,
        latitude: editItem?.latitude?.toString() || '0.00',
        longitude: editItem?.longitude?.toString() || '0.00',
        roaD_NAME: editItem.roaD_NAME,
        roadclouseR_DETAILS: editItem.roadclouseR_DETAILS,
      });
    }
  }, [editItem]);

  // useEffect(() => {
  //     if (!isLoading && error) {
  //         setShowErrorModal(true);
  //     }
  // }, [error, isLoading]);

  // const closeModal = () => {
  //     setShowErrorModal(false);
  //     if (editItem) {
  //         dispatch(AnnounceViewActions.clearAnnouncementsData())

  //         // navigation.goBack()
  //         navigation.navigate('ViewAnnouncement', { title: "Road Closure", isEdit: true })
  //     }
  // };

  const openImagePicker = () => {
    const options = {
      mediaType: 'photo',
      // includeBase64: true,
      // maxHeight: 2000,
      // maxWidth: 2000,
    };

    launchImageLibrary(options, handleResponse);
  };

  const handleCameraLaunch = () => {
    const options = {
      mediaType: 'photo',
      // includeBase64: true,
      // maxHeight: 2000,
      // maxWidth: 2000,
    };

    launchCamera(options, handleResponse);
  };

  const handleResponse = response => {
    setShowCameraModal(false);
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('Image picker error: ', response.error);
    } else {
      console.log('====================================');
      setSelectedImages([...selectedImages, response.assets]);
    }
  };

  const removeSelectedImage = index => {
    setSelectedImages(
      selectedImages.filter((item, index1) => {
        return index1 != index;
      }),
    );
  };

  const viewImageonModal = binaryImg => {
    setIsBinaryImage(true);
    setViewBinaryImage(binaryImg);
  };

  const onCloseBinaryImageModal = binaryImg => {
    setIsBinaryImage(false);
  };

  const closeCameraModal = () => {
    setShowCameraModal(false);
  };

  const ShowAlert = (type, mess) => {
    Alert.alert(
      type,
      mess,
      [
        {
          text: 'OK',
          onPress: () => {
            console.log('OK Pressed');
            if (type === 'Success' && !editItem) {
              dispatch(createRoadClosureActions.clear());
              setFormValues();
              setSelectedImages([]);
              setErrors();
            } else if (editItem && type !== 'Error') {
              dispatch(AnnounceViewActions.clearAnnouncementsData());
              navigation.navigate('ViewAnnouncement', {
                title: 'Road Closure',
                isEdit: true,
              });
            }
          },
        },
      ],
      {cancelable: false},
    );
  };

  const handleSearch = async () => {
    setIsaddress(true);
    try {
      const results = await getGeocode(autoLocation);
      setCandidates(results);
    } catch (error) {
      console.log('Error fetching geocode:', error);
      setIsaddress(false);
    }
  };

  // Trigger API call when query changes
  useEffect(() => {
    setIsaddress(false);
    setCandidates([]);
    if (autoLocation) {
      handleSearch();
    }
  }, [autoLocation]);

  // Function to show modal
  const openModal = () => {
    setModalVisible(true);
  };

  // Function to hide modal
  const closeModal = () => {
    setModalVisible(false);
  };

  const handleSubmit = async () => {
    try {
      // console.log(formValues.roadclouseR_STARTDATE,convertToDateTime(formValues.roadclouseR_STARTTIME))

      await CreateRoadClosureScrema.validate(formValues, {abortEarly: false});
      setIsSubmitted(true);
      if (editItem) {
        let data = {
          id: editItem.id,
          refnumber: editItem.refnumber,
          roadclouseR_STARTDATE: formValues.roadclouseR_STARTDATE,
          roadclouseR_STARTIME: convertToDateTime(
            formValues.roadclouseR_STARTTIME,
          ).toJSON(),
          roadclouseR_ENDDATE: formValues.roadclouseR_ENDDATE,
          roadclouseR_ENDTIME: convertToDateTime(
            formValues.roadclouseR_ENDTIME,
          ).toJSON(),
          location: formValues.location,
          latitude: formValues?.latitude?.toString() || '0.00',
          longitude: formValues?.longitude?.toString() || '0.00',
          roaD_NAME: formValues.roaD_NAME,
          roadclouseR_DETAILS: formValues.roadclouseR_DETAILS,
          // "expirY_DATE": formValues.roadclouseR_ENDDATE,
          // "userid": loggedUser?.userid,
          warD_NO: loggedUser?.warD_NO,
        };

        console.log('Submitted--->', data);

        // return false;

        // dispatch(CreateRoadClosureApi({ data: formData, type: 'edit' }));

        try {
          // const response = await axios.post('http://192.168.1.7:5055/api/CouncillorWard/72')
          const response = await axios.post(
            `${apiUrl}/api/RoadClosure/update-road-closure-data`,
            data,
          );
          console.log(response.data);
          setIsSubmitted(false);

          ShowAlert('Success', 'Road Closure has been updated successfully!');
        } catch (error) {
          console.log(error);
          setIsSubmitted(false);
          ShowAlert('Error', 'Something went wrong!');
        }
      } else {
        const formData = new FormData();
        let postData = {
          ROADCLOUSER_STARTDATE: formValues.roadclouseR_STARTDATE,
          ROADCLOUSER_STARTTIME: convertToDateTime(
            formValues.roadclouseR_STARTTIME,
          ),
          ROADCLOUSER_ENDDATE: formValues.roadclouseR_ENDDATE,
          ROADCLOUSER_ENDTIME: convertToDateTime(
            formValues.roadclouseR_ENDTIME,
          ),
          LOCATION: formValues.location,
          LATITUDE: formValues?.latitude?.toString() || '0.00',
          LONGITUDE: formValues?.longitude?.toString() || '0.00',
          ROAD_NAME: formValues.roaD_NAME,
          ROADCLOUSER_DETAILS: formValues.roadclouseR_DETAILS,
          EXPIRY_DATE: formValues.roadclouseR_ENDDATE,
          USERID: loggedUser?.userid,
          WARD_NO: loggedUser?.warD_NO,
        };
        // let postData = {
        //     "roadClouserInputData": formData,
        //     "imG_LIST": selectedImages
        // }
        console.log('Form data:', postData);

        // dispatch(CreateRoadClosureApi({ data: postData, type: 'create' }));

        if (selectedImages.length > 0) {
          selectedImages.forEach((image, index) => {
            console.log(`image===> ${index}`, image);
            formData.append(`files`, {
              uri:
                Platform.OS === 'ios'
                  ? image[0].uri.replace('file://', '')
                  : image[0].uri,
              type: image[0].type,
              name: image[0].fileName || `image_${index}.jpg`,
            });
          });
        }
        formData.append('device', Platform.OS);
        formData.append('roadClouserInputData', JSON.stringify(postData));

        try {
          // const response = await axios.post('http://192.168.1.7:5055/api/CouncillorWard/72')
          const response = await axios.post(
            `${apiUrl}/api/Create/save-road-clouser`,

            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            },
          );
          console.log(response.data);
          setIsSubmitted(false);

          ShowAlert('Success', 'Road Closure has been saved successfully!');
        } catch (error) {
          console.log(error);
          setIsSubmitted(false);
          ShowAlert('Error', 'Something went wrong!');
        }
      }
    } catch (error) {
      // Validation failed, set errors
      console.log(error);
      const validationErrors = {};
      error.inner.forEach(e => {
        validationErrors[e.path] = e.message;
        console.log(e.message);
      });
      setErrors(validationErrors);
      setIsSubmitted(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <ErrorModal
                visible={showErrorModal}
                ErrorModalText={statusCode && (statusCode !== 200 ? 'Something went wrong!' : error)}
                closeModal={closeModal}
                onPress={() => {
                    dispatch(createRoadClosureActions.clear());
                    if (statusCode === 200) {
                        setFormValues();
                        setSelectedImages([])
                        setErrors()
                        closeModal();
                    } else {
                        closeModal();
                    }
                }}
            /> */}
      <ScrollView>
        <View style={styles.box}>
          <Image source={logo} style={styles.img} />
        </View>
        <Text style={styles.title}>
          {editItem ? 'Edit ' : 'Create '} Road Closure
        </Text>
        <View style={styles.inputView}>
          <Pressable
            onPress={() => {
              toggleDatePicker('roadclouseR_STARTDATE');
            }}>
            <TextInput
              mode="outlined"
              label={'Start Date'}
              style={{backgroundColor: Colors.white}}
              placeholder="2024-01-01"
              value={formValues?.roadclouseR_STARTDATE}
              onChangeText={value =>
                handleInputChange('roadclouseR_STARTDATE', value)
              }
              placeholderTextColor={'#11182744'}
              editable={false}
              onPressIn={() => {
                toggleDatePicker('roadclouseR_STARTDATE');
              }}
            />
            <View
              style={{
                position: 'absolute',
                right: 10,
                top: 0,
                bottom: 0,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Icon name="calendar" size={25} color={Colors.blue} />
            </View>
          </Pressable>
          {errors?.roadclouseR_STARTDATE && (
            <Text style={{color: 'red'}}>{errors?.roadclouseR_STARTDATE}</Text>
          )}
        </View>

        <View style={styles.inputView}>
          <Pressable
            onPress={() => {
              toggleTimePicker('roadclouseR_STARTTIME');
            }}>
            <TextInput
              mode="outlined"
              label={'Start Time'}
              style={{backgroundColor: Colors.white}}
              placeholder="10:30 AM/PM"
              value={formValues?.roadclouseR_STARTTIME}
              onChangeText={value =>
                handleInputChange('roadclouseR_STARTTIME', value)
              }
              placeholderTextColor={'#11182744'}
              editable={false}
              onPressIn={() => {
                toggleTimePicker('roadclouseR_STARTTIME');
              }}
            />
            <View
              style={{
                position: 'absolute',
                right: 10,
                top: 0,
                bottom: 0,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <MaterialIcon name="timer" size={25} color={Colors.blue} />
            </View>
          </Pressable>

          {errors?.roadclouseR_STARTTIME && (
            <Text style={{color: 'red'}}>{errors?.roadclouseR_STARTTIME}</Text>
          )}
        </View>

        <View style={styles.inputView}>
          <Pressable
            onPress={() => {
              toggleDatePicker('roadclouseR_ENDDATE');
            }}>
            <TextInput
              mode="outlined"
              label={'End Date'}
              style={{backgroundColor: Colors.white}}
              placeholder="2024-01-01"
              value={formValues?.roadclouseR_ENDDATE}
              onChangeText={value =>
                handleInputChange('roadclouseR_ENDDATE', value)
              }
              placeholderTextColor={'#11182744'}
              editable={false}
              onPressIn={() => {
                toggleDatePicker('roadclouseR_ENDDATE');
              }}
            />
            <View
              style={{
                position: 'absolute',
                right: 10,
                top: 0,
                bottom: 0,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Icon name="calendar" size={25} color={Colors.blue} />
            </View>
          </Pressable>
          {errors?.roadclouseR_ENDDATE && (
            <Text style={{color: 'red'}}>{errors?.roadclouseR_ENDDATE}</Text>
          )}
        </View>

        <View style={styles.inputView}>
          <Pressable
            onPress={() => {
              toggleTimePicker('roadclouseR_ENDTIME');
            }}>
            <TextInput
              mode="outlined"
              label={'End Time'}
              style={{backgroundColor: Colors.white}}
              placeholder="10:30 AM/PM"
              value={formValues?.roadclouseR_ENDTIME}
              onChangeText={value =>
                handleInputChange('roadclouseR_ENDTIME', value)
              }
              placeholderTextColor={'#11182744'}
              editable={false}
              onPressIn={() => {
                toggleTimePicker('roadclouseR_ENDTIME');
              }}
            />
            <View
              style={{
                position: 'absolute',
                right: 10,
                top: 0,
                bottom: 0,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <MaterialIcon name="timer" size={25} color={Colors.blue} />
            </View>
          </Pressable>
          {errors?.roadclouseR_ENDTIME && (
            <Text style={{color: 'red'}}>{errors?.roadclouseR_ENDTIME}</Text>
          )}
        </View>

        <View style={styles.inputView}>
          {/* {Platform.OS == 'android' && */}
          <TouchableOpacity onPress={openModal} activeOpacity={0.8}>
            <TextInput
              mode="outlined"
              label={'Location'}
              style={{backgroundColor: Colors.white}}
              placeholder="Location"
              value={formValues?.location ? formValues?.location : ''}
              autoCorrect={false}
              keyboardType="default"
              autoCapitalize="none"
              multiline
              editable={false}
              onChangeText={value => handleInputChange('location', value)}
              placeholderTextColor={'#11182744'}
              onFocus={openModal} // Trigger modal when focused
              onPress={openModal}
            />

            <View
              style={{
                position: 'absolute',
                right: 10,
                top: 5,
                bottom: 0,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <MaterialIcon name="my-location" size={25} color={Colors.blue} />
            </View>
          </TouchableOpacity>
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
            <Text style={{color: 'red'}}>{errors?.location}</Text>
          )}
        </View>

        <View style={styles.inputView}>
          <TextInput
            mode="outlined"
            label={'Name of the Road'}
            style={{backgroundColor: Colors.white}}
            placeholder="Name of the Road"
            value={formValues?.roaD_NAME ? formValues?.roaD_NAME : ''}
            autoCorrect={false}
            keyboardType="default"
            autoCapitalize="none"
            onChangeText={value => handleInputChange('roaD_NAME', value)}
            placeholderTextColor={'#11182744'}
          />
          <View
            style={{
              position: 'absolute',
              right: 30,
              top: 5,
              bottom: 0,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Icon name="road" size={25} color={Colors.blue} />
          </View>
          {errors?.roaD_NAME && (
            <Text style={{color: 'red'}}>{errors?.roaD_NAME}</Text>
          )}
        </View>

        <View style={styles.inputView}>
          <TextInput
            mode="outlined"
            label={'Details'}
            numberOfLines={5}
            multiline
            style={{backgroundColor: Colors.white}}
            placeholder="Details"
            value={
              formValues?.roadclouseR_DETAILS
                ? formValues?.roadclouseR_DETAILS
                : ''
            }
            autoCorrect={false}
            keyboardType="default"
            autoCapitalize="none"
            onChangeText={value =>
              handleInputChange('roadclouseR_DETAILS', value)
            }
            placeholderTextColor={'#11182744'}
            textAlignVertical="top"
            height={100}
          />
          {errors?.roadclouseR_DETAILS && (
            <Text style={{color: 'red'}}>{errors?.roadclouseR_DETAILS}</Text>
          )}
        </View>

        {chunkArray(selectedImages, 5).map((item, index1) => (
          <View key={index1} style={styles.row}>
            {item.map((subItem, index) => (
              <View key={index} style={[styles.item, {position: 'relative'}]}>
                <TouchableOpacity
                  onPress={() => {
                    viewImageonModal(subItem[0].uri);
                  }}>
                  <Image
                    source={{uri: subItem[0].uri}}
                    // style={{ flex: 1 }}
                    width={40}
                    height={40}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => removeSelectedImage(index)}
                  style={{position: 'absolute', right: 0}}>
                  <Ionicon
                    name={'close-circle-outline'}
                    size={25}
                    color={Colors.blue}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ))}
        {editItem ? null : (
          <View style={styles.buttonView}>
            <Pressable
              style={styles.CameraButton}
              onPress={() => setShowCameraModal(true)}>
              <Icon name="camera" size={25} color={Colors.blue} />
              <Text style={[styles.CameraText, {paddingLeft: 10}]}>
                Capture images
              </Text>
            </Pressable>
          </View>
        )}

        <View style={styles.buttonView}>
          <Pressable
            style={styles.button}
            onPress={() => {
              if (!isSubmitted) {
                handleSubmit();
              }
            }}>
            <Text style={styles.buttonText}>
              {isSubmitted && (
                <ActivityIndicator size={20} color={Colors.white} />
              )}{' '}
              {editItem ? 'UPDATE' : 'SAVE'}
            </Text>
          </Pressable>
        </View>

        <BinaryImageModal
          visible={isBinaryImage}
          isBinary={false}
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
      <View
        style={[
          {
            position: 'absolute',
            bottom: 0,
            backgroundColor: Colors.white,
            width: '100%',
          },
        ]}>
        {showDatePicker == 'roadclouseR_STARTDATE' && (
          <>
            <DateTimePicker
              mode="date"
              display="spinner"
              value={date}
              // minimumDate={today}
              maximumDate={selectedEndDate}
              onChange={(event, selectedDate) =>
                onChageDatePicker(event, selectedDate, 'roadclouseR_STARTDATE')
              }
              style={Platform.OS == 'ios' && styles.datePicker}
            />
            {Platform.OS == 'ios' && (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  position: 'absolute',
                  bottom: 20,
                  width: '100%',
                }}>
                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.pickerButton,
                    {backgroundColor: '#11182711'},
                  ]}
                  onPress={() => {
                    toggleDatePicker('No');
                  }}>
                  <Text style={[styles.buttonText, {color: '#075985'}]}>
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.pickerButton]}
                  onPress={() => {
                    confoirmIOSDate('roadclouseR_STARTDATE');
                  }}>
                  <Text style={styles.buttonText}>Confirm</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}

        {showTimePicker == 'roadclouseR_STARTTIME' && (
          <>
            <DateTimePicker
              mode="time"
              display="spinner"
              value={date}
              onChange={(event, selectedDate) =>
                onChageTimePicker(event, selectedDate, 'roadclouseR_STARTTIME')
              }
              style={Platform.OS == 'ios' && styles.datePicker}
            />
            {Platform.OS == 'ios' && (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  position: 'absolute',
                  bottom: 20,
                  width: '100%',
                }}>
                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.pickerButton,
                    {backgroundColor: '#11182711'},
                  ]}
                  onPressIn={() => {
                    toggleTimePicker('No');
                  }}>
                  <Text style={[styles.buttonText, {color: '#075985'}]}>
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.pickerButton]}
                  onPress={() => {
                    confoirmIOSTime('roadclouseR_STARTTIME');
                  }}>
                  <Text style={styles.buttonText}>Confirm</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}

        {showDatePicker == 'roadclouseR_ENDDATE' && (
          <>
            <DateTimePicker
              mode="date"
              display="spinner"
              // minimumDate={new Date(formValues?.roadclouseR_STARTDATE)}
              value={date}
              minimumDate={selectedStartDate}
              onChange={(event, selectedDate) =>
                onChageDatePicker(event, selectedDate, 'roadclouseR_ENDDATE')
              }
              style={Platform.OS == 'ios' && styles.datePicker}
            />
            {Platform.OS == 'ios' && (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  position: 'absolute',
                  bottom: 20,
                  width: '100%',
                }}>
                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.pickerButton,
                    {backgroundColor: '#11182711'},
                  ]}
                  onPress={() => {
                    toggleDatePicker('No');
                  }}>
                  <Text style={[styles.buttonText, {color: '#075985'}]}>
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.pickerButton]}
                  onPress={() => {
                    confoirmIOSDate('roadclouseR_ENDDATE');
                  }}>
                  <Text style={styles.buttonText}>Confirm</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}

        {showTimePicker == 'roadclouseR_ENDTIME' && (
          <>
            <DateTimePicker
              mode="time"
              display="spinner"
              value={date}
              onChange={(event, selectedDate) =>
                onChageTimePicker(event, selectedDate, 'roadclouseR_ENDTIME')
              }
              style={Platform.OS == 'ios' && styles.datePicker}
            />
            {Platform.OS == 'ios' && (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  position: 'absolute',
                  bottom: 20,
                  width: '100%',
                }}>
                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.pickerButton,
                    {backgroundColor: '#11182711'},
                  ]}
                  onPressIn={() => {
                    toggleTimePicker('No');
                  }}>
                  <Text style={[styles.buttonText, {color: '#075985'}]}>
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.pickerButton]}
                  onPress={() => {
                    confoirmIOSTime('roadclouseR_ENDTIME');
                  }}>
                  <Text style={styles.buttonText}>Confirm</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}

        {/* Modal Component */}
        <AddressModal
          modalVisible={modalVisible}
          closeModal={closeModal}
          Isaddress={Isaddress}
          autoLocation={autoLocation}
          setAutoLocation={setAutoLocation}
          candidates={candidates}
          handleInputChange={handleInputChange}
          formValues={formValues}
        />
      </View>
    </SafeAreaView>
  );
}

export default RoadClousureScreen;

const styles = StyleSheet.create({
  container: {
    // alignItems: 'center',
    flex: 1,
    marginTop: 10,
    position: 'relative',
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
    borderWidth: 1, // Border width in pixels
    borderColor: Colors.blue,
    borderRadius: (screenWidth - 50) / 4, // Border radius (optional)
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
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
    backgroundColor: '#075985',
  },
  buttonText1: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
  },
  pickerButton: {
    paddingHorizontal: 20,
  },
  datePicker: {
    height: 300,
    bottom: 50,
  },

  dropdown: {
    width: '100%',
    height: 50,
    paddingLeft: 7,
    borderColor: Colors.black,
    borderWidth: 1,
    borderRadius: 7,
    color: Colors.black,
    backgroundColor: Colors.white,
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
    paddingLeft: 10,
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
});
