import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { ActivityIndicator, Alert, Dimensions, FlatList, Image, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { TextInput } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker'
import { FormateDate } from '../utility/FormateDate'
import { Colors } from '../constant/Colors'
import { formatDateTime, getTime } from '../utility/formattedTime';
import { useDispatch, useSelector } from 'react-redux';
import ErrorModal from '../components/ErrorModal';
import { CreateHealthCareApi } from '../services/councillorWardApi';
import HealthCareValidationSchema from '../validation/HealthCareSchema';
import { createHealthCareActions } from '../redux/createHealthCareSlice';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import Ionicon from 'react-native-vector-icons/dist/Ionicons';
import MaterialIcon from 'react-native-vector-icons/dist/MaterialIcons';

import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { launchImageLibrary as _launchImageLibrary, launchCamera as _launchCamera } from 'react-native-image-picker';
import CameraModal from '../components/CameraModal';
import BinaryImageModal from '../components/BinaryImageModal';
import { useNavigation } from '@react-navigation/native';
import { AnnounceViewActions } from '../redux/announcementViewSlice';
import { apiUrl } from '../constant/CommonData';
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



function HealthCareScreen({ route }) {

  const { title, type, editItem } = route.params;
  console.log(title, type, editItem);
  const navigation = useNavigation();
   // Set the maximum date to today
   const today = new Date();

  const dispatch = useDispatch();

  const [formValues, setFormValues] = useState();
  const [isSubmitted, setIsSubmitted] = useState(false)

  const loggedUser = useSelector(state => state.loginReducer.items);

  // const { data, isLoading, error, statusCode } = useSelector(
  //   state => state.createHealthCareReducer,
  // );

  // console.log(statusCode, isLoading);

  const [date, setDate] = useState(new Date())

  const [showDatePicker, setShowDatePicker] = useState('');
  const [showTimePicker, setShowTimePicker] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);

  const [showCameraModal, setShowCameraModal] = useState(false);
  const [viewBinaryImage, setViewBinaryImage] = useState(null);
  const [isBinaryImage, setIsBinaryImage] = useState(false);

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


  useEffect(() => {
    if (editItem) {
      setFormValues({
        healthcarE_DATE: editItem.healthcarE_DATE && formatDateTime(editItem.healthcarE_DATE, 'date'),
        location: editItem.location,
        healthcarE_DETAILS: editItem.healthcarE_DETAILS
      })
    }
  }, [editItem])



  const toggleDatePicker = (value) => {
    setShowDatePicker(value)

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


  // useEffect(() => {
  //   if (!isLoading && error) {
  //     setShowErrorModal(true);
  //   }
  // }, [error, isLoading]);

  // const closeModal = () => {
  //   setShowErrorModal(false);

  //   if (editItem) {
  //     dispatch(AnnounceViewActions.clearAnnouncementsData())

  //     // navigation.goBack()
  //     navigation.navigate('ViewAnnouncement', { title: "Healthcare",isEdit:true })
  //   }
  // };




  const [selectedImages, setSelectedImages] = useState([]);
  // const [imageBinary, setImageBinary] = useState(null);



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

  const handleResponse = (response) => {
    setShowCameraModal(false)
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('Image picker error: ', response.error);
    } else {
      console.log('====================================');
      setSelectedImages([...selectedImages, response.assets]);

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

  const ShowAlert = (type, mess) => {
    Alert.alert(
      type,
      mess,
      [
        {
          text: "OK", onPress: () => {
            console.log("OK Pressed")
            if (type === 'Success' && !editItem) {
              dispatch(createHealthCareActions.clear());
              setFormValues();
              setSelectedImages([])
              setErrors()
            }
            else if (editItem) {
              dispatch(AnnounceViewActions.clearAnnouncementsData())
              navigation.navigate('ViewAnnouncement', { title: "Healthcare", isEdit: true })
            }

          }
        }
      ],
      { cancelable: false }
    );
  }




  const handleSubmit = async () => {
    try {

      await HealthCareValidationSchema.validate(formValues, { abortEarly: false });
      setIsSubmitted(true);
      if (editItem) {

        let data = {
          "id": editItem.id,
          "refnumber": editItem.refnumber,
          "healthcarE_DATE": formValues.healthcarE_DATE,
          "location": formValues.location,
          "latitude": "0.00",//Platform.OS == "ios" ? formValues.latitude : "0.00",
          "longitude": "0.00",//Platform.OS == "ios" ? formValues.longitude : "0.00",
          "healthcarE_DETAILS": formValues.healthcarE_DETAILS,
          "warD_NO": loggedUser?.warD_NO
        }

        // dispatch(CreateHealthCareApi({ data: formdata, type: 'edit' }));

        console.log(data)
        try {
          // const response = await axios.post('http://192.168.1.7:5055/api/CouncillorWard/72')
          const response = await axios.post(`${apiUrl}/api/Healthcare/update-healthcare-data`, data);
          console.log(response.data);
          setIsSubmitted(false);

          ShowAlert("Success", "HealthCare has been updated successfully!")

        } catch (error) {
          console.log(error);
          setIsSubmitted(false);
          ShowAlert("Error", "Something went wrong!")

        }

      } else {
        const formData = new FormData();
        // if (selectedImages.length == 0) return Alert.alert("Required", "Image is required!")
        let postData =
        {
          "HEALTHCARE_DATE": formValues.healthcarE_DATE,
          "LOCATION": formValues.location,
          "LATITUDE": "0.00",//Platform.OS == "ios" ? formValues.latitude : "0.00",
          "LONGITUDE": "0.00",//Platform.OS == "ios" ? formValues.longitude : "0.00",
          "HEALTHCARE_DETAILS": formValues.healthcarE_DETAILS,
          "EXPIRY_DATE": formValues.healthcarE_DATE,
          "USERID": loggedUser?.userid,
          "WARD_NO": loggedUser?.warD_NO,
        }

        // let postData = {
        //   "healthCareInputData": formData,
        //   "imG_LIST": selectedImages
        // }

        console.log('Form data:', postData);
        // dispatch(CreateHealthCareApi({ data: postData, type: 'create' }));

        if (selectedImages.length > 0) {
          selectedImages.forEach((image, index) => {
            console.log(`image===> ${index}`, image)
            formData.append(`files`, {
              uri: Platform.OS === 'ios' ? image[0].uri.replace('file://', '') : image[0].uri,
              type: image[0].type,
              name: image[0].fileName || `image_${index}.jpg`
            });
          });
        }
        formData.append("device", Platform.OS);
        formData.append("healthCareInputData", JSON.stringify(postData))

        try {
          // const response = await axios.post('http://192.168.1.7:5055/api/CouncillorWard/72')
          const response = await axios.post(`${apiUrl}/api/Create/save-healthcare`,

            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data'
              }


            });
          console.log(response.data);
          setIsSubmitted(false);

          ShowAlert("Success", "HealthCare has been saved successfully!")

        } catch (error) {
          console.log(error);
          setIsSubmitted(false);
          ShowAlert("Error", "Something went wrong!")

        }
      }

    } catch (error) {
      // Validation failed, set errors
      console.log(error)
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
      <ScrollView>
        <View style={styles.box}>
          <Image source={logo} style={styles.img} />
        </View>
        <Text style={styles.title}>
          {editItem ? 'Edit ' : 'Create '}
          HealthCare
        </Text>
        <View style={styles.inputView}>
          <Pressable onPress={() => { toggleDatePicker('healthcarE_DATE') }}
            style={{ position: 'relative' }}>
            <TextInput
              mode="outlined"
              label={'Healthcare Date'}
              style={{ backgroundColor: Colors.white }}
              placeholder='2024-01-01'
              value={
                formValues?.healthcarE_DATE
              }
              onChangeText={value => handleInputChange('healthcarE_DATE', value)}
              placeholderTextColor={'#11182744'}
              editable={false}
              onPressIn={() => { toggleDatePicker('healthcarE_DATE') }}
            />
            <View style={{ position: 'absolute', right: 10, top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
              <Icon name="calendar" size={25} color={Colors.blue} />
            </View>
          </Pressable>
          {errors?.healthcarE_DATE && (
            <Text style={{ color: 'red' }}>{errors?.healthcarE_DATE}</Text>
          )}

        </View>

        <View style={[styles.inputView, { position: 'relative' }]}>
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



        <View style={[styles.inputView, { position: 'relative' }]}>
          <TextInput
            mode="outlined"
            label={'Healthcare Details'}
            numberOfLines={5}
            multiline={true}
            style={{ backgroundColor: Colors.white }}
            placeholder='Healthcare Details'
            textAlignVertical="top" // Ensures text starts from the top of the input
            value={
              formValues?.healthcarE_DETAILS ? (formValues?.healthcarE_DETAILS) : ''
            }
            autoCorrect={false}
            keyboardType='default'
            autoCapitalize="none"
            onChangeText={value => handleInputChange('healthcarE_DETAILS', value)}
            placeholderTextColor={'#11182744'}
            height={100}

          />
          {/* <View style={{ position: 'absolute', right: 30, top: 5, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
            <MaterialIcon name="details" size={25} color={Colors.blue} />
          </View> */}
          {errors?.healthcarE_DETAILS && (
            <Text style={{ color: 'red' }}>{errors?.healthcarE_DETAILS}</Text>
          )}
        </View>
        {/* 
        <FlatList
          data={chunkArray(selectedImages, 5)}
          renderItem={renderRow}
          keyExtractor={(item, index) => index.toString()}
        /> */}

        {chunkArray(selectedImages, 5).map((item, index1) => (
          <View key={index1} style={styles.row}>
            {item.map((subItem, index) => (
              <View key={index} style={[styles.item, { position: 'relative' }]}

              >
                <TouchableOpacity onPress={() => { viewImageonModal(subItem[0].uri) }}>
                  <Image
                    source={{ uri: subItem[0].uri }}
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

        {/* {selectedImages.map((item) => (
          <Text>{item.filename}</Text>
        ))} */}

        {/* 

        

        {selectedImages.length > 0 &&
          <View style={[styles.buttonView,{flexDirection:'row',justifyContent:'center',alignItems:'center'}]}>

            {selectedImages.map((item) => (
              <Image key={item.filename}
                source={{ uri: item.image }}
                style={{ flex: 1 }}
                width={40}
                height={40}
              />
            ))

            }
          </View>} */}
        {editItem ? null :
          <View style={styles.buttonView}>
            <Pressable style={styles.CameraButton} onPress={() => setShowCameraModal(true)}>
              <Icon name="camera" size={25} color={Colors.blue} />
              <Text style={[styles.CameraText, { paddingLeft: 10 }]}>
                Capture images
              </Text>
            </Pressable>
          </View>}

        <View style={styles.buttonView}>
          <Pressable style={styles.button} onPress={() => {
            if (!isSubmitted) { handleSubmit() }
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
      <View style={[{ position: 'absolute', bottom: 0, backgroundColor: Colors.white, width: '100%' }]}>

        {showDatePicker == "healthcarE_DATE" && (
          <>
            <DateTimePicker
              mode='date'
              display='spinner'
              value={date}
              minimumDate={today}
              onChange={(event, selectedDate) =>
                onChageDatePicker(
                  event,
                  selectedDate,
                  'healthcarE_DATE'
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
                  onPress={() => { confoirmIOSDate('healthcarE_DATE') }}
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

export default HealthCareScreen

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
    borderColor: Colors.white,
    borderRadius: (screenWidth - 50) / 4, // Border radius (optional)
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    elevation: 1,
    alignSelf: 'center',
  },
  img: {
    width: screenWidth / 3 - 65,
    height: screenWidth / 3 - 65,
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