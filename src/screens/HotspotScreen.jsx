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
        latitude: editItem?.latitude?.toString() || '0.00',
        longitude: editItem?.longitude?.toString() || '0.00',
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
      console.log(formValues);
      await HotspotValidationSchema.validate(formValues, {abortEarly: false});
      if (editItem) {
        setIsSubmitted(true);

        let data = {
          id: editItem.id,
          crimE_DATE: formValues.crimE_DATE,
          refnumber: editItem.refnumber,
          location: formValues.location,
          latitude: formValues?.latitude?.toString() || '0.00',
          longitude: formValues?.longitude?.toString() || '0.00',
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
          LATITUDE: formValues?.latitude?.toString() || '0.00',
          LONGITUDE: formValues?.longitude?.toString() || '0.00',
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
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerSection}>
          <View style={styles.iconContainer}>
            <MaterialIcon name="location-on" size={32} color={Colors.yellow} />
          </View>
          <Text style={styles.title}>
            {editItem ? 'Update' : 'Create'} Hotspot
          </Text>
          <Text style={styles.subtitle}>
            {editItem
              ? 'Edit hotspot information'
              : 'Report a new crime hotspot'}
          </Text>
        </View>

        <View style={styles.formCard}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Crime Date *</Text>
            <Pressable
              onPress={() => toggleDatePicker('crimE_DATE')}
              style={styles.inputWrapper}>
              <TextInput
                mode="outlined"
                style={styles.textInput}
                placeholder="Select date"
                value={formValues?.crimE_DATE}
                onChangeText={value => handleInputChange('crimE_DATE', value)}
                placeholderTextColor={'#9CA3AF'}
                editable={false}
                onPressIn={() => toggleDatePicker('crimE_DATE')}
                outlineColor="#E5E7EB"
                activeOutlineColor={Colors.primary}
                dense
              />
              <View style={styles.inputIcon}>
                <Icon name="calendar" size={20} color={Colors.primary} />
              </View>
            </Pressable>
            {errors?.crimE_DATE && (
              <Text style={styles.errorText}>{errors?.crimE_DATE}</Text>
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
            {errors?.location && (
              <Text style={styles.errorText}>{errors?.location}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Crime Type *</Text>
            <RNPickerSelect
              placeholder={{label: 'Select crime type...', value: null}}
              items={sports1}
              onValueChange={value => handleInputChange('crimE_TYPE', value)}
              style={{
                ...pickerSelectStyles,
                iconContainer: {
                  top: 12,
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
                    color={Colors.primary}
                  />
                );
              }}
            />
            {errors?.crimE_TYPE && (
              <Text style={styles.errorText}>{errors?.crimE_TYPE}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Crime Details *</Text>
            <TextInput
              mode="outlined"
              numberOfLines={4}
              multiline={true}
              style={styles.textInput}
              placeholder="Describe the incident..."
              value={formValues?.crimE_DETAILS ? formValues?.crimE_DETAILS : ''}
              autoCorrect={false}
              keyboardType="default"
              autoCapitalize="none"
              onChangeText={value => handleInputChange('crimE_DETAILS', value)}
              placeholderTextColor={'#9CA3AF'}
              outlineColor="#E5E7EB"
              activeOutlineColor={Colors.primary}
              dense
            />
            {errors?.crimE_DETAILS && (
              <Text style={styles.errorText}>{errors?.crimE_DETAILS}</Text>
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
                  {editItem ? 'UPDATE HOTSPOT' : 'SAVE HOTSPOT'}
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

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 14,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    color: Colors.black,
    paddingRight: 40,
    backgroundColor: Colors.white,
  },
  inputAndroid: {
    fontSize: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    color: Colors.black,
    paddingRight: 40,
    backgroundColor: Colors.white,
  },
});
