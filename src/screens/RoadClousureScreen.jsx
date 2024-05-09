

import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Dimensions, Image, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { TextInput } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker'
import { FormateDate } from '../utility/FormateDate'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Colors } from '../constant/Colors'
import { convertToDateTime, getTime } from '../utility/formattedTime';
import { useDispatch, useSelector } from 'react-redux';
import ErrorModal from '../components/ErrorModal';
import CreateRoadClosureScrema from '../validation/CreateRoadClosureSchema';
import { CreateRoadClosureApi } from '../services/councillorWardApi';
import { createRoadClosureActions } from '../redux/createRoadClosureSlice';

const logo = require('../assets/images/Ekurhuleni-Logo-889x1024.png');

const screenWidth = Dimensions.get('window').width;

function RoadClousureScreen() {
  

  const dispatch = useDispatch();

  const [formValues, setFormValues] = useState({});
  const loggedUser = useSelector(state => state.loginReducer.items);

  const { data, isLoading, error, statusCode } = useSelector(
      state => state.createRoadClosureReducer,
  );

  console.log(statusCode, isLoading);

  const [date, setDate] = useState(new Date())

  const [showDatePicker, setShowDatePicker] = useState('');
  const [showTimePicker, setShowTimePicker] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);

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


  const handleSubmit = async () => {
      try {

          await CreateRoadClosureScrema.validate(formValues, { abortEarly: false });

          let formData =
          {
              "roadclouseR_STARTDATE": formValues.roadclouseR_STARTDATE,
              "roadclouseR_STARTTIME": convertToDateTime(formValues.roadclouseR_STARTTIME),
              "roadclouseR_ENDDATE": formValues.roadclouseR_STARTDATE,
              "roadclouseR_ENDTIME": convertToDateTime(formValues.roadclouseR_ENDTIME),
              "location": formValues.location,
              "latitude": Platform.OS == "ios" ? formValues.latitude : "0.00",
              "longitude":Platform.OS == "ios" ? formValues.longitude : "0.00",
              "roaD_NAME": formValues.roaD_NAME,
              "roadclouseR_DETAILS": formValues.roadclouseR_DETAILS,
              "expirY_DATE": formValues.roadclouseR_ENDDATE,
              "userid": loggedUser?.userid,
              "warD_NO": loggedUser?.warD_NO
          }
          // {
          //     roadclouseR_STARTDATE: formValues.roadclouseR_STARTDATE,
          //     roadclouseR_STARTTIME: "2024-05-03T17:13:06.387Z",
          //     roadclouseR_ENDTDATE: formValues.roadclouseR_STARTDATE,
          //     roadclouseR_ENDTIME: "2024-05-03T17:13:06.387Z",
          //     location: formValues.location,
          //     roaD_NAME: formValues.roaD_NAME,
          //     roadclouseR_DETAILS: formValues.roadclouseR_DETAILS,
          //     LATITUDE: '0.00',
          //     LONGITUDE: '0.00',
          //     WARD_NO: '10',//loggedUser?.warD_NO,
          //     expirY_DATE: formValues.roadclouseR_ENDDATE,
          //     userid: '1'//loggedUser?.userid





          // }


          // formValues.expirY_DATE = formValues.roadclouseR_ENDDATE;

          // formValues.roadclouseR_STARTTIME = new Date(formValues.roadclouseR_STARTTIME);
          // formValues.roadclouseR_ENDTIME = new Date(formValues.roadclouseR_ENDTIME)

          console.log('Form data:', formData);

          dispatch(CreateRoadClosureApi(formData));

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
                  if (statusCode === 200) {
                      // navigation.navigate('Home');
                      setFormValues({});
                      dispatch(createRoadClosureActions.clear());
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
              <Text style={styles.title}>Create Road Closure</Text>
              <View style={styles.inputView}>
                  <Pressable onPress={() => { toggleDatePicker('roadclouseR_STARTDATE') }}>
                      <TextInput
                          mode="outlined"
                          label={'Start Date'}
                          style={{ backgroundColor: Colors.white }}
                          placeholder='2024-01-01'
                          value={
                              formValues.roadclouseR_STARTDATE
                          }
                          onChangeText={value => handleInputChange('roadclouseR_STARTDATE', value)}
                          placeholderTextColor={'#11182744'}
                          editable={false}
                          onPressIn={() => { toggleDatePicker('roadclouseR_STARTDATE') }}
                      />
                  </Pressable>
                  {errors?.roadclouseR_STARTDATE && (
                      <Text style={{ color: 'red' }}>{errors?.roadclouseR_STARTDATE}</Text>
                  )}

              </View>

              <View style={styles.inputView}>

                  <Pressable onPress={() => { toggleTimePicker('roadclouseR_STARTTIME') }}>
                      <TextInput
                          mode="outlined"
                          label={'Start Time'}
                          style={{ backgroundColor: Colors.white }}
                          placeholder='10:30 AM/PM'
                          value={
                              formValues.roadclouseR_STARTTIME
                          }
                          onChangeText={value => handleInputChange('roadclouseR_STARTTIME', value)}
                          placeholderTextColor={'#11182744'}
                          editable={false}
                          onPressIn={() => { toggleTimePicker('roadclouseR_STARTTIME') }}
                      />
                  </Pressable>

                  {errors?.roadclouseR_STARTTIME && (
                      <Text style={{ color: 'red' }}>{errors?.roadclouseR_STARTTIME}</Text>
                  )}

              </View>

              <View style={styles.inputView}>

                  <Pressable onPress={() => { toggleDatePicker('roadclouseR_ENDDATE') }}>
                      <TextInput
                          mode="outlined"
                          label={'End Date'}
                          style={{ backgroundColor: Colors.white }}
                          placeholder='2024-01-01'
                          value={
                              formValues.roadclouseR_ENDDATE
                          }
                          onChangeText={value => handleInputChange('roadclouseR_ENDDATE', value)}
                          placeholderTextColor={'#11182744'}
                          editable={false}
                          onPressIn={() => { toggleDatePicker('roadclouseR_ENDDATE') }}
                      />
                  </Pressable>
                  {errors?.roadclouseR_ENDDATE && (
                      <Text style={{ color: 'red' }}>{errors?.roadclouseR_ENDDATE}</Text>
                  )}

              </View>

              <View style={styles.inputView}>


                  <Pressable onPress={() => { toggleTimePicker('roadclouseR_ENDTIME') }}>
                      <TextInput
                          mode="outlined"
                          label={'End Time'}
                          style={{ backgroundColor: Colors.white }}
                          placeholder='10:30 AM/PM'
                          value={
                              formValues.roadclouseR_ENDTIME
                          }
                          onChangeText={value => handleInputChange('roadclouseR_ENDTIME', value)}
                          placeholderTextColor={'#11182744'}
                          editable={false}
                          onPressIn={() => { toggleTimePicker('roadclouseR_ENDTIME') }}
                      />
                  </Pressable>
                  {errors?.roadclouseR_ENDTIME && (
                      <Text style={{ color: 'red' }}>{errors?.roadclouseR_ENDTIME}</Text>
                  )}

              </View>

             
        <View style={styles.inputView}>
          {Platform.OS == 'android' &&
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
          }

          {Platform.OS == 'ios' &&
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
          }

          {errors?.location && (
            <Text style={{ color: 'red' }}>{errors?.location}</Text>
          )}
        </View>


              <View style={styles.inputView}>
                  <TextInput
                      mode="outlined"
                      label={'Name of the Road'}
                      style={{ backgroundColor: Colors.white }}
                      placeholder='Name of the Road'
                      value={
                          formValues.roaD_NAME
                      }
                      autoCorrect={false}
                      keyboardType='default'
                      autoCapitalize="none"
                      onChangeText={value => handleInputChange('roaD_NAME', value)}
                      placeholderTextColor={'#11182744'}

                  />
                  {errors?.roaD_NAME && (
                      <Text style={{ color: 'red' }}>{errors?.roaD_NAME}</Text>
                  )}
              </View>

              <View style={styles.inputView}>
                  <TextInput
                      mode="outlined"
                      label={'Details'}
                      numberOfLines={5}
                      multiline
                      style={{ backgroundColor: Colors.white }}
                      placeholder='Details'
                      value={
                          formValues.roadclouseR_DETAILS
                      }
                      autoCorrect={false}
                      keyboardType='default'
                      autoCapitalize="none"
                      onChangeText={value => handleInputChange('roadclouseR_DETAILS', value)}
                      placeholderTextColor={'#11182744'}

                  />
                  {errors?.roadclouseR_DETAILS && (
                      <Text style={{ color: 'red' }}>{errors?.roadclouseR_DETAILS}</Text>
                  )}
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


          </ScrollView>
          <View style={[{ position: 'absolute', bottom: 0, backgroundColor: Colors.white, width: '100%' }]}>

              {showDatePicker == "roadclouseR_STARTDATE" && (
                  <>
                      <DateTimePicker
                          mode='date'
                          display='spinner'
                          value={date}
                          onChange={(event, selectedDate) =>
                              onChageDatePicker(
                                  event,
                                  selectedDate,
                                  'roadclouseR_STARTDATE'
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
                                  onPress={() => { confoirmIOSDate('roadclouseR_STARTDATE') }}
                              >
                                  <Text style={styles.buttonText}>Confirm</Text>
                              </TouchableOpacity>
                          </View>
                      )}
                  </>

              )}


              {showTimePicker == 'roadclouseR_STARTTIME' && (
                  <>
                      <DateTimePicker
                          mode='time'
                          display='spinner'
                          value={date}
                          onChange={(event, selectedDate) =>
                              onChageTimePicker(
                                  event,
                                  selectedDate,
                                  'roadclouseR_STARTTIME'
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
                                  onPress={() => { confoirmIOSTime("roadclouseR_STARTTIME") }}
                              >
                                  <Text style={styles.buttonText}>Confirm</Text>
                              </TouchableOpacity>
                          </View>
                      )}

                  </>
              )}

              {showDatePicker == 'roadclouseR_ENDDATE' && (
                  <>
                      <DateTimePicker
                          mode='date'
                          display='spinner'
                          // minimumDate={new Date(formValues?.roadclouseR_STARTDATE)}
                          value={date}
                          onChange={(event, selectedDate) =>
                              onChageDatePicker(
                                  event,
                                  selectedDate,
                                  'roadclouseR_ENDDATE'
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
                                  onPress={() => { confoirmIOSDate('roadclouseR_ENDDATE') }}
                              >
                                  <Text style={styles.buttonText}>Confirm</Text>
                              </TouchableOpacity>
                          </View>
                      )}
                  </>
              )}


              {showTimePicker == 'roadclouseR_ENDTIME' && (
                  <>
                      <DateTimePicker
                          mode='time'
                          display='spinner'
                          value={date}
                          onChange={(event, selectedDate) =>
                              onChageTimePicker(
                                  event,
                                  selectedDate,
                                  'roadclouseR_ENDTIME'
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
                                  onPress={() => { confoirmIOSTime("roadclouseR_ENDTIME") }}
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

export default RoadClousureScreen

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
})