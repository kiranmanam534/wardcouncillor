import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, Dimensions, Image, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { TextInput } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker'
import { FormateDate } from '../utility/FormateDate'
import { Colors } from '../constant/Colors'
import { getTime } from '../utility/formattedTime';
import { useDispatch, useSelector } from 'react-redux';
import ErrorModal from '../components/ErrorModal';
import { CreateHotspotApi } from '../services/councillorWardApi';
import { createRoadClosureActions } from '../redux/createRoadClosureSlice';
import HotspotValidationSchema from '../validation/HotspotSchema';
import { createHotspotActions } from '../redux/createHotspotSlice';
import { Picker } from '@react-native-picker/picker';
import { getCategoriesApi } from '../services/masterDataApi';

import RNPickerSelect from 'react-native-picker-select';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { launchImageLibrary as _launchImageLibrary, launchCamera as _launchCamera } from 'react-native-image-picker';
// import RNPickerSelect, { defaultStyles } from './debug';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import BinaryImageModal from '../components/BinaryImageModal';
import CameraModal from '../components/CameraModal';
let launchImageLibrary = _launchImageLibrary;
let launchCamera = _launchCamera;

import Icon from 'react-native-vector-icons/dist/FontAwesome';
import Ionicon from 'react-native-vector-icons/dist/Ionicons';

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

function HotspotScreen() {


  const dispatch = useDispatch();

  const [formValues, setFormValues] = useState({});
  const [favSport4, setFavSport4] = useState('')
  const [sports1, setSports1] = useState([])

  const loggedUser = useSelector(state => state.loginReducer.items);

  const { items: Categories, isLoading: categoriesLodaing, error: categoryError, statusCode: categoryStatusCode } = useSelector(
    state => state.CategoriesReducer,
  );



  const { data, isLoading, error, statusCode } = useSelector(
    state => state.createHotspotReducer,
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



  useEffect(() => {
    dispatch(getCategoriesApi('Hotspots'));
  }, [])


  useEffect(() => {
    if (Categories) {
      setSports1(Categories.map(item => ({
        label: item.name,
        value: item.name,
      })))
    }

  }, [Categories])


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

      await HotspotValidationSchema.validate(formValues, { abortEarly: false });
      if (selectedImages.length == 0) return Alert.alert("Required", "Image is required!")

      let formData =
      {
        "crimE_DATE": formValues.crimE_DATE,
        "location": formValues.location,
        "latitude": "0.00",//Platform.OS == "ios" ? formValues.latitude : "0.00",
        "longitude": "0.00",//Platform.OS == "ios" ? formValues.longitude : "0.00",
        "crimE_TYPE": formValues.crimE_TYPE,
        "crimE_DETAILS": formValues.crimE_DETAILS,
        "expirY_DATE": formValues.crimE_DATE,
        "userid": loggedUser?.userid,
        "warD_NO": loggedUser?.warD_NO,
      }


      let postData = {
        "hotspotInputData": formData,
        "imG_LIST": selectedImages
      }



      console.log('Form data:', formData);

      dispatch(CreateHotspotApi(postData));


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
          dispatch(createHotspotActions.clear());
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
        <Text style={styles.title}>Create Hotspot</Text>
        <View style={styles.inputView}>
          <Pressable onPress={() => { toggleDatePicker('crimE_DATE') }}>
            <TextInput
              mode="outlined"
              label={'Crime Date'}
              style={{ backgroundColor: Colors.white }}
              placeholder='2024-01-01'
              value={
                formValues?.crimE_DATE
              }
              onChangeText={value => handleInputChange('crimE_DATE', value)}
              placeholderTextColor={'#11182744'}
              editable={false}
              onPressIn={() => { toggleDatePicker('crimE_DATE') }}
            />
             <View style={{ position: 'absolute', right: 10, top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
              <Icon name="calendar" size={25} color={Colors.blue} />
            </View>
          </Pressable>
          {errors?.crimE_DATE && (
            <Text style={{ color: 'red' }}>{errors?.crimE_DATE}</Text>
          )}

        </View>

        {/* <View style={styles.inputView}>
          <TextInput
            mode="outlined"
            label={'Location'}
            style={{ backgroundColor: Colors.white }}
            placeholder='Location'
            value={
              formValues.location
            }
            autoCorrect={false}
            keyboardType='default'
            autoCapitalize="none"
            onChangeText={value => handleInputChange('location', value)}
            placeholderTextColor={'#11182744'}

          />
          {errors?.location && (
            <Text style={{ color: 'red' }}>{errors?.location}</Text>
          )}
        </View> */}

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
            <Text style={{ color: 'red' }}>{errors?.location}</Text>
          )}
        </View>


        <View style={styles.inputView}>

          <RNPickerSelect
            placeholder={{ label: 'Crime type...', value: null }}
            items={sports1}
            onValueChange={value => handleInputChange('crimE_TYPE', value)}
            style={{
              ...pickerSelectStyles,
              iconContainer: {
                top: 10,
                right: 12,
              },
            }}
            value={
              formValues?.crimE_TYPE ? (formValues?.crimE_TYPE) : null
            }
            useNativeAndroidPickerStyle={false}
            textInputProps={{ underlineColor: 'yellow' }}
            Icon={() => {
              return <MaterialIcon name="keyboard-arrow-down" size={24} color="gray" />;
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
            <Text style={{ color: 'red' }}>{errors?.crimE_TYPE}</Text>
          )}
          {/* </View> */}
        </View>

        <View style={styles.inputView}>
          <TextInput
            mode="outlined"
            label={'Crime Details'}
            numberOfLines={5}
            multiline={true}
            style={{ backgroundColor: Colors.white }}
            placeholder='Crime Details'
            value={
              formValues?.crimE_DETAILS ? (formValues?.crimE_DETAILS) : ''
            }
            autoCorrect={false}
            keyboardType='default'
            autoCapitalize="none"
            onChangeText={value => handleInputChange('crimE_DETAILS', value)}
            placeholderTextColor={'#11182744'}
            height={100}
            textAlignVertical='top'


          />
          {errors?.crimE_DETAILS && (
            <Text style={{ color: 'red' }}>{errors?.crimE_DETAILS}</Text>
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

        {showDatePicker == "crimE_DATE" && (
          <>
            <DateTimePicker
              mode='date'
              display='spinner'
              value={date}
              onChange={(event, selectedDate) =>
                onChageDatePicker(
                  event,
                  selectedDate,
                  'crimE_DATE'
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
                  onPress={() => { confoirmIOSDate('crimE_DATE') }}
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

export default HotspotScreen

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
  }
  ,
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
    backgroundColor: Colors.white
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
    backgroundColor: Colors.white
  },
});