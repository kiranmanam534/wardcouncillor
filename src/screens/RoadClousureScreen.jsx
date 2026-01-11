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

const logo = require('../assets/images/sixtep-logo.jpeg');

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
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerSection}>
          <View style={styles.iconContainer}>
            <MaterialIcon name="block" size={32} color={Colors.yellow} />
          </View>
          <Text style={styles.title}>
            {editItem ? 'Update' : 'Create'} Road Closure
          </Text>
          <Text style={styles.subtitle}>
            {editItem
              ? 'Edit road closure information'
              : 'Report a new road closure'}
          </Text>
        </View>

        <View style={styles.formCard}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Start Date *</Text>
            <Pressable
              onPress={() => toggleDatePicker('roadclouseR_STARTDATE')}
              style={styles.inputWrapper}>
              <TextInput
                mode="outlined"
                style={styles.textInput}
                placeholder="Select start date"
                value={formValues?.roadclouseR_STARTDATE}
                onChangeText={value =>
                  handleInputChange('roadclouseR_STARTDATE', value)
                }
                placeholderTextColor={'#9CA3AF'}
                editable={false}
                onPressIn={() => toggleDatePicker('roadclouseR_STARTDATE')}
                outlineColor="#E5E7EB"
                activeOutlineColor={Colors.primary}
                dense
              />
              <View style={styles.inputIcon}>
                <Icon name="calendar" size={20} color={Colors.primary} />
              </View>
            </Pressable>
            {errors?.roadclouseR_STARTDATE && (
              <Text style={styles.errorText}>
                {errors?.roadclouseR_STARTDATE}
              </Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Start Time *</Text>
            <Pressable
              onPress={() => toggleTimePicker('roadclouseR_STARTTIME')}
              style={styles.inputWrapper}>
              <TextInput
                mode="outlined"
                style={styles.textInput}
                placeholder="Select start time"
                value={formValues?.roadclouseR_STARTTIME}
                onChangeText={value =>
                  handleInputChange('roadclouseR_STARTTIME', value)
                }
                placeholderTextColor={'#9CA3AF'}
                editable={false}
                onPressIn={() => toggleTimePicker('roadclouseR_STARTTIME')}
                outlineColor="#E5E7EB"
                activeOutlineColor={Colors.primary}
                dense
              />
              <View style={styles.inputIcon}>
                <MaterialIcon name="timer" size={20} color={Colors.primary} />
              </View>
            </Pressable>
            {errors?.roadclouseR_STARTTIME && (
              <Text style={styles.errorText}>
                {errors?.roadclouseR_STARTTIME}
              </Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>End Date *</Text>
            <Pressable
              onPress={() => toggleDatePicker('roadclouseR_ENDDATE')}
              style={styles.inputWrapper}>
              <TextInput
                mode="outlined"
                style={styles.textInput}
                placeholder="Select end date"
                value={formValues?.roadclouseR_ENDDATE}
                onChangeText={value =>
                  handleInputChange('roadclouseR_ENDDATE', value)
                }
                placeholderTextColor={'#9CA3AF'}
                editable={false}
                onPressIn={() => toggleDatePicker('roadclouseR_ENDDATE')}
                outlineColor="#E5E7EB"
                activeOutlineColor={Colors.primary}
                dense
              />
              <View style={styles.inputIcon}>
                <Icon name="calendar" size={20} color={Colors.primary} />
              </View>
            </Pressable>
            {errors?.roadclouseR_ENDDATE && (
              <Text style={styles.errorText}>
                {errors?.roadclouseR_ENDDATE}
              </Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>End Time *</Text>
            <Pressable
              onPress={() => toggleTimePicker('roadclouseR_ENDTIME')}
              style={styles.inputWrapper}>
              <TextInput
                mode="outlined"
                style={styles.textInput}
                placeholder="Select end time"
                value={formValues?.roadclouseR_ENDTIME}
                onChangeText={value =>
                  handleInputChange('roadclouseR_ENDTIME', value)
                }
                placeholderTextColor={'#9CA3AF'}
                editable={false}
                onPressIn={() => toggleTimePicker('roadclouseR_ENDTIME')}
                outlineColor="#E5E7EB"
                activeOutlineColor={Colors.primary}
                dense
              />
              <View style={styles.inputIcon}>
                <MaterialIcon name="timer" size={20} color={Colors.primary} />
              </View>
            </Pressable>
            {errors?.roadclouseR_ENDTIME && (
              <Text style={styles.errorText}>
                {errors?.roadclouseR_ENDTIME}
              </Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Location *</Text>
            <TouchableOpacity onPress={openModal} activeOpacity={0.8}>
              <TextInput
                mode="outlined"
                style={styles.textInput}
                placeholder="Tap to select location"
                value={formValues?.location ? formValues?.location : ''}
                autoCorrect={false}
                keyboardType="default"
                autoCapitalize="none"
                multiline
                editable={false}
                onChangeText={value => handleInputChange('location', value)}
                placeholderTextColor={'#9CA3AF'}
                onFocus={openModal}
                onPress={openModal}
                outlineColor="#E5E7EB"
                activeOutlineColor={Colors.primary}
                dense
              />
              <View style={styles.inputIcon}>
                <MaterialIcon
                  name="my-location"
                  size={20}
                  color={Colors.primary}
                />
              </View>
            </TouchableOpacity>

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
              <Text style={styles.errorText}>{errors?.location}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Road Name *</Text>
            <TextInput
              mode="outlined"
              style={styles.textInput}
              placeholder="Enter road name"
              value={formValues?.roaD_NAME ? formValues?.roaD_NAME : ''}
              autoCorrect={false}
              keyboardType="default"
              autoCapitalize="none"
              onChangeText={value => handleInputChange('roaD_NAME', value)}
              placeholderTextColor={'#9CA3AF'}
              outlineColor="#E5E7EB"
              activeOutlineColor={Colors.primary}
              dense
            />
            {errors?.roaD_NAME && (
              <Text style={styles.errorText}>{errors?.roaD_NAME}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Closure Details *</Text>
            <TextInput
              mode="outlined"
              numberOfLines={4}
              multiline
              style={styles.textInput}
              placeholder="Describe the reason for closure..."
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
              placeholderTextColor={'#9CA3AF'}
              outlineColor="#E5E7EB"
              activeOutlineColor={Colors.primary}
              dense
            />
            {errors?.roadclouseR_DETAILS && (
              <Text style={styles.errorText}>
                {errors?.roadclouseR_DETAILS}
              </Text>
            )}
          </View>

          {selectedImages.length > 0 && (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Attached Images</Text>
              <View style={styles.imageGrid}>
                {selectedImages.map((subItem, index) => (
                  <View key={index} style={styles.imageItem}>
                    <TouchableOpacity
                      onPress={() => viewImageonModal(subItem[0].uri)}
                      activeOpacity={0.8}>
                      <Image
                        source={{uri: subItem[0].uri}}
                        style={styles.imagePreview}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => removeSelectedImage(index)}
                      style={styles.removeImageButton}>
                      <Ionicon
                        name={'close-circle'}
                        size={24}
                        color={Colors.yellow}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          )}

          {!editItem && (
            <TouchableOpacity
              style={styles.captureButton}
              onPress={() => setShowCameraModal(true)}
              activeOpacity={0.8}>
              <Icon name="camera" size={20} color={Colors.primary} />
              <Text style={styles.captureButtonText}>Add Photos</Text>
              <View style={styles.captureBadge}>
                <Text style={styles.captureBadgeText}>
                  {selectedImages.length}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              isSubmitted && styles.submitButtonDisabled,
            ]}
            onPress={() => {
              if (!isSubmitted) {
                handleSubmit();
              }
            }}
            activeOpacity={0.8}
            disabled={isSubmitted}>
            {isSubmitted ? (
              <ActivityIndicator size={22} color={Colors.white} />
            ) : (
              <>
                <MaterialIcon
                  name={editItem ? 'check-circle' : 'save'}
                  size={20}
                  color={Colors.white}
                />
                <Text style={styles.submitButtonText}>
                  {editItem ? 'UPDATE CLOSURE' : 'SAVE CLOSURE'}
                </Text>
              </>
            )}
          </TouchableOpacity>
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
    flex: 1,
    backgroundColor: '#F0F4FF',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  headerSection: {
    backgroundColor: Colors.primary,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(238, 175, 44, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 3,
    borderColor: Colors.yellow,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.white,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 8,
  },
  inputWrapper: {
    position: 'relative',
  },
  textInput: {
    backgroundColor: Colors.white,
    fontSize: 14,
  },
  inputIcon: {
    position: 'absolute',
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  imageItem: {
    position: 'relative',
    width: (screenWidth - 88) / 3,
    height: (screenWidth - 88) / 3,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removeImageButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: Colors.primary,
    borderRadius: 12,
  },
  captureButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F4FF',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
    gap: 8,
    marginTop: 8,
  },
  captureButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  captureBadge: {
    backgroundColor: Colors.yellow,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  captureBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.white,
  },
  actionButtons: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  submitButton: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: Colors.yellow,
    ...Platform.select({
      ios: {
        shadowColor: Colors.primary,
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  pickerButton: {
    paddingHorizontal: 20,
  },
  datePicker: {
    height: 300,
    bottom: 50,
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
});
