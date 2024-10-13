import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Image,
  Modal,
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
import {Colors} from '../constant/Colors';
import {formatDateTime} from '../utility/formattedTime';
import {useDispatch, useSelector} from 'react-redux';
import HotspotValidationSchema from '../validation/HotspotSchema';
import {createHotspotActions} from '../redux/createHotspotSlice';
import {getCategoriesApi} from '../services/masterDataApi';

import RNPickerSelect from 'react-native-picker-select';
// import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {
  launchImageLibrary as _launchImageLibrary,
  launchCamera as _launchCamera,
} from 'react-native-image-picker';
// import RNPickerSelect, { defaultStyles } from './debug';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import BinaryImageModal from '../components/BinaryImageModal';
import CameraModal from '../components/CameraModal';
let launchImageLibrary = _launchImageLibrary;
let launchCamera = _launchCamera;

import Icon from 'react-native-vector-icons/dist/FontAwesome';
import Ionicon from 'react-native-vector-icons/dist/Ionicons';
import {AnnounceViewActions} from '../redux/announcementViewSlice';
import {useNavigation} from '@react-navigation/native';

import {apiUrl} from '../constant/CommonData';
import {getGeocode} from '../session/getGeocode';
import axios from 'axios';
import AddressModal from '../components/AddressModal';

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

function HotspotScreen({route}) {
  const {title, type, editItem} = route.params;
  // console.log(title, type, editItem);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  // Set the maximum date to today
  const today = new Date();

  const [formValues, setFormValues] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [sports1, setSports1] = useState([]);

  const [date, setDate] = useState(new Date());

  const [Isaddress, setIsaddress] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [autoLocation, setAutoLocation] = useState('');

  const [showDatePicker, setShowDatePicker] = useState('');

  const [showCameraModal, setShowCameraModal] = useState(false);
  const [viewBinaryImage, setViewBinaryImage] = useState(null);
  const [isBinaryImage, setIsBinaryImage] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [errors, setErrors] = useState({});

  const loggedUser = useSelector(state => state.loginReducer.items);

  const {
    items: Categories,
    isLoading: categoriesLodaing,
    error: categoryError,
    statusCode: categoryStatusCode,
  } = useSelector(state => state.CategoriesReducer);

  useEffect(() => {
    dispatch(getCategoriesApi('Hotspots'));
  }, []);

  useEffect(() => {
    if (Categories) {
      setSports1(
        Categories.map(item => ({
          label: item.name,
          value: item.name,
        })),
      );
    }
  }, [Categories]);

  useEffect(() => {
    if (editItem) {
      setFormValues({
        crimE_DATE:
          editItem.crimE_DATE && formatDateTime(editItem.crimE_DATE, 'date'),
        crimE_TYPE: editItem.crimE_TYPE,
        location: editItem.location,
        crimE_DETAILS: editItem.crimE_DETAILS,
      });
    }
  }, [editItem]);

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

  const onChageDatePicker = (event, selectedDate, fieldName) => {
    if (event.type == 'set') {
      const currentDate = selectedDate;
      setDate(currentDate);

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

  const openImagePicker = () => {
    const options = {
      mediaType: 'photo',
      // includeBase64: false,
      // maxHeight: 2000,
      // maxWidth: 2000,
      // selectionLimit: 0
    };

    launchImageLibrary(options, handleResponse);
  };

  const handleCameraLaunch = () => {
    const options = {
      mediaType: 'photo',
      // includeBase64: false,
      // maxHeight: 2000,
      // maxWidth: 2000,
      // selectionLimit: 0
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
      // console.log(response.assets);

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
              dispatch(createHotspotActions.clear());
              setFormValues();
              setSelectedImages([]);
              setErrors();
            } else if (editItem) {
              dispatch(AnnounceViewActions.clearAnnouncementsData());
              navigation.navigate('ViewAnnouncement', {
                title: 'Hotspots',
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
      console.log(formValues);
      await HotspotValidationSchema.validate(formValues, {abortEarly: false});
      if (editItem) {
        setIsSubmitted(true);

        let data = {
          id: editItem.id,
          crimE_DATE: formValues.crimE_DATE,
          refnumber: editItem.refnumber,
          location: formValues.location,
          latitude: formValues.latitude || '0.00', //Platform.OS == "ios" ? formValues.latitude : "0.00",
          longitude: formValues.longitude || '0.00', //Platform.OS == "ios" ? formValues.longitude : "0.00",
          crimE_TYPE: formValues.crimE_TYPE,
          crimE_DETAILS: formValues.crimE_DETAILS,
          // "expirY_DATE": formValues.crimE_DATE,
          // "userid": loggedUser?.userid,
          warD_NO: loggedUser?.warD_NO,
        };

        // dispatch(CreateHotspotApi({ data: formdata, type: 'edit' }));

        console.log(data);

        try {
          // const response = await axios.post('http://192.168.1.7:5055/api/CouncillorWard/72')
          const response = await axios.post(
            `${apiUrl}/api/hotspot/update-hotspot-data`,
            data,
          );
          console.log(response.data);
          setIsSubmitted(false);

          ShowAlert('Success', 'Hotspot has been updated successfully!');
        } catch (error) {
          console.log(error);
          setIsSubmitted(false);
          ShowAlert('Error', 'Something went wrong!');
        }
      } else {
        setIsSubmitted(true);

        const formData = new FormData();

        // if (selectedImages.length == 0) return Alert.alert("Required", "Image is required!")

        let postData = {
          CRIME_DATE: formValues.crimE_DATE,
          LOCATION: formValues.location,
          LATITUDE: '0.00', //Platform.OS == "ios" ? formValues.latitude : "0.00",
          LONGITUDE: '0.00', //Platform.OS == "ios" ? formValues.longitude : "0.00",
          CRIME_TYPE: formValues.crimE_TYPE,
          CRIME_DETAILS: formValues.crimE_DETAILS,
          EXPIRY_DATE: formValues.crimE_DATE,
          USERID: loggedUser?.userid,
          WARD_NO: loggedUser?.warD_NO,
        };

        // let postData = {
        //   "hotspotInputData": formData1,
        //   "imG_LIST": selectedImages
        // }

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
        formData.append('hotspotInputData', JSON.stringify(postData));

        try {
          // const response = await axios.post('http://192.168.1.7:5055/api/CouncillorWard/72')
          const response = await axios.post(
            `${apiUrl}/api/Create/save-hotspot`,

            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            },
          );
          console.log(response.data);
          setIsSubmitted(false);

          ShowAlert('Success', 'Hotspot has been saved successfully!');
        } catch (error) {
          console.log(error);
          setIsSubmitted(false);
          ShowAlert('Error', 'Something went wrong!');
        }

        //dispatch(CreateHotspotApi({ data: formData, type: 'create' }));
      }
    } catch (error) {
      // Validation failed, set errors
      console.log(error);
      setIsSubmitted(false);
      const validationErrors = {};
      error.inner.forEach(e => {
        validationErrors[e.path] = e.message;
        console.log(e.message);
      });
      setErrors(validationErrors);
    }
  };

  // Function to handle click on the text input
  const handleTextClick = () => {
    Alert.alert('Text clicked!', 'You clicked on the read-only field.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.box}>
          <Image source={logo} style={styles.img} />
        </View>
        <Text style={styles.title}>
          {editItem ? 'Update' : 'Create'} Hotspot
        </Text>
        <View style={styles.inputView}>
          <Pressable
            onPress={() => {
              toggleDatePicker('crimE_DATE');
            }}>
            <TextInput
              mode="outlined"
              label={'Crime Date'}
              style={{backgroundColor: Colors.white}}
              placeholder="2024-01-01"
              value={formValues?.crimE_DATE}
              onChangeText={value => handleInputChange('crimE_DATE', value)}
              placeholderTextColor={'#11182744'}
              editable={false}
              onPressIn={() => {
                toggleDatePicker('crimE_DATE');
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
          {errors?.crimE_DATE && (
            <Text style={{color: 'red'}}>{errors?.crimE_DATE}</Text>
          )}
        </View>
        <View style={{position: 'relative', zIndex: 1}}>
          <View style={[styles.inputView]}>
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
                <MaterialIcon
                  name="my-location"
                  size={25}
                  color={Colors.blue}
                />
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
                  key: "AIzaSyAI6lFoXVFONS76oYT7XmjzOypAvJq6Kb4",
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
        </View>

        <View style={styles.inputView}>
          <RNPickerSelect
            placeholder={{label: 'Crime type...', value: null}}
            items={sports1}
            onValueChange={value => handleInputChange('crimE_TYPE', value)}
            style={{
              ...pickerSelectStyles,
              iconContainer: {
                top: 10,
                right: 12,
              },
            }}
            value={formValues?.crimE_TYPE ? formValues?.crimE_TYPE : null}
            useNativeAndroidPickerStyle={false}
            textInputProps={{underlineColor: 'yellow'}}
            Icon={() => {
              return (
                <MaterialIcon
                  name="keyboard-arrow-down"
                  size={24}
                  color="gray"
                />
              );
            }}
          />
          {/* {Platform.OS == 'android' &&
              <Picker
                selectedValue={formValues.crimE_TYPE}
                onValueChange={value => handleInputChange('crimE_TYPE', value)}
                mode="dialog"
                itemStyle={styles.itemStyle}
                selectionColor={Colors.primary}>
                <Picker.Item label={'Crime Type'} value="" />
                {Categories?.map((category) => (
                  <Picker.Item key={category.id} label={category.name} value={category.name} />
                ))}

              </Picker>
            } */}
          {/* <TextInput
            mode="outlined"
            label={'Crime Type'}
            style={{ backgroundColor: Colors.white }}
            placeholder='Crime Type'
            value={
              formValues.crimE_TYPE
            }
            autoCorrect={false}
            keyboardType='default'
            autoCapitalize="none"
            onChangeText={value => handleInputChange('crimE_TYPE', value)}
            placeholderTextColor={'#11182744'}

          /> */}
          {errors?.crimE_TYPE && (
            <Text style={{color: 'red'}}>{errors?.crimE_TYPE}</Text>
          )}
          {/* </View> */}
        </View>

        <View style={styles.inputView}>
          <TextInput
            mode="outlined"
            label={'Crime Details'}
            numberOfLines={5}
            multiline={true}
            style={{backgroundColor: Colors.white}}
            placeholder="Crime Details"
            value={formValues?.crimE_DETAILS ? formValues?.crimE_DETAILS : ''}
            autoCorrect={false}
            keyboardType="default"
            autoCapitalize="none"
            onChangeText={value => handleInputChange('crimE_DETAILS', value)}
            placeholderTextColor={'#11182744'}
            height={100}
            textAlignVertical="top"
          />
          {errors?.crimE_DETAILS && (
            <Text style={{color: 'red'}}>{errors?.crimE_DETAILS}</Text>
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
        {showDatePicker == 'crimE_DATE' && (
          <>
            <DateTimePicker
              mode="date"
              display="spinner"
              value={date}
              maximumDate={today}
              onChange={(event, selectedDate) =>
                onChageDatePicker(event, selectedDate, 'crimE_DATE')
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
                    confoirmIOSDate('crimE_DATE');
                  }}>
                  <Text style={styles.buttonText}>Confirm</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </View>
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
    </SafeAreaView>
  );
}

export default HotspotScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    position: 'relative',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
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

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 0.5,
    borderColor: Colors.black,
    borderRadius: 4,
    color: Colors.black,
    paddingRight: 30, // to ensure the text is never behind the icon
    backgroundColor: Colors.white,
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 0.5,
    borderColor: Colors.black,
    borderRadius: 4,
    color: Colors.black,
    paddingRight: 30, // to ensure the text is never behind the icon
    backgroundColor: Colors.white,
  },
});
