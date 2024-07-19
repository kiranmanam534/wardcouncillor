import React, { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Dimensions,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import RNPickerSelect from 'react-native-picker-select';

import { Colors } from '../constant/Colors';
import InputFeild from '../components/InputFeild';
import { SingupFileds } from '../constant/SignupFeilds';
import SignupValidationSchema from '../validation/SignupSchema';
import { useDispatch, useSelector } from 'react-redux';
import { CommunityMemberRegisterApi } from '../services/communityMemberApi';
import { ActivityIndicator, TextInput } from 'react-native-paper';
import ErrorModal from '../components/ErrorModal';

import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
const logo = require('../assets/images/COE_logo_portrait.png');

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;



const TitlesList = [
  {
    label: 'Mr',
    value: 'Mr',
  },
  {
    label: 'Mrs',
    value: 'Mrs',
  },
  {
    label: 'Dr',
    value: 'Dr',
  },
];


export default function SignupScreen({ route }) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { title } = route.params;

  const { data, isLoading, error, statusCode } = useSelector(
    state => state.communityMemberRegisterReducer,
  );

  console.log(statusCode);

  const [showErrorModal, setShowErrorModal] = useState(false);

  const [formValues, setFormValues] = useState({});
  const [errors, setErrors] = useState({});

  const handleInputChange = (fieldName, value) => {
    setFormValues(prevValues => ({
      ...prevValues,
      [fieldName]: value,
    }));
    setErrors(prevValues => ({
      ...prevValues,
      [fieldName]: '',
    }));
  };

  const handleSubmit = async () => {
    try {
      await SignupValidationSchema.validate(formValues, { abortEarly: false });
      // Form is valid, submit the data
      // console.log('Form data:', formValues);

      // let formData = {
      //   title: 'string',
      //   firstName: 'string',
      //   lastName: 'string',
      //   idNumber: 'string',
      //   email: 'string2',
      //   cellNumber: 'string',
      //   address: 'string',
      //   password: 'string',
      //   wardNo: 'string',
      // };

      formValues.IDNumber='1234';

      dispatch(CommunityMemberRegisterApi(formValues));
    } catch (error) {
      // Validation failed, set errors
      console.log(error);
      const validationErrors = {};
      error.inner.forEach(e => {
        console.log(e.message)
        validationErrors[e.path] = e.message;
      });
      setErrors(validationErrors);
    }
  };

  useEffect(() => {
    if (!isLoading && error) {
      setShowErrorModal(true);
    }
  }, [error, isLoading]);

  const closeModal = () => {
    setShowErrorModal(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ErrorModal
        visible={showErrorModal}
        ErrorModalText={error}
        closeModal={closeModal}
        onPress={() => {
          if (statusCode === 200) {
            navigation.navigate('Home');
          } else {
            closeModal();
          }
        }}
      />

      <ScrollView>
        <View style={styles.box}>
          <Image source={logo} style={styles.img} />
        </View>
        <Text style={styles.title}>{title}</Text>

        <View style={styles.inputView}>
          <RNPickerSelect
            placeholder={{ label: 'Title...', value: null }}
            items={TitlesList}
            onValueChange={value => handleInputChange('title', value)}
            style={{
              ...pickerSelectStyles,
              iconContainer: {
                top: 10,
                right: 12,
              },
            }}
            value={formValues.title}
            useNativeAndroidPickerStyle={false}
            textInputProps={{ underlineColor: 'yellow' }}
            Icon={() => {
              return <MaterialIcon name="keyboard-arrow-down" size={24} color="gray" />;
            }}
          />

          {errors?.title && (
            <Text style={{ color: 'red' }}>{errors?.title}</Text>
          )}
        </View>

        <View style={styles.inputView}>
          <TextInput
            mode="outlined"
            label={'First Name'}
            style={{ backgroundColor: Colors.white }}
            placeholder='firstName'
            value={
              formValues.firstName
            }
            onChangeText={value => handleInputChange('firstName', value)}
            placeholderTextColor={'#11182744'}
          />
          {errors?.firstName && (
            <Text style={{ color: 'red' }}>{errors?.firstName}</Text>
          )}
        </View>
        <View style={styles.inputView}>
          <TextInput
            mode="outlined"
            label={'Last Name'}
            style={{ backgroundColor: Colors.white }}
            placeholder='lastName'
            value={
              formValues.lastName
            }
            onChangeText={value => handleInputChange('lastName', value)}
            placeholderTextColor={'#11182744'}
          />
          {errors?.lastName && (
            <Text style={{ color: 'red' }}>{errors?.lastName}</Text>
          )}
        </View>

        <View style={styles.inputView}>
          <TextInput
            mode="outlined"
            label={'Cell Number'}
            style={{ backgroundColor: Colors.white }}
            placeholder='cell Number'
            value={
              formValues.cellNumber
            }
            keyboardType='number-pad'
            onChangeText={value => handleInputChange('cellNumber', value)}
            placeholderTextColor={'#11182744'}
          />
          {errors?.cellNumber && (
            <Text style={{ color: 'red' }}>{errors?.cellNumber}</Text>
          )}
        </View>

        <View style={styles.inputView}>
          <TextInput
            mode="outlined"
            label={'Email'}
            style={{ backgroundColor: Colors.white }}
            placeholder='Email'
            value={
              formValues.email
            }
            keyboardType='email-address'
            onChangeText={value => handleInputChange('email', value)}
            placeholderTextColor={'#11182744'}
          />
          {errors?.email && (
            <Text style={{ color: 'red' }}>{errors?.email}</Text>
          )}
        </View>
        {/* <View style={styles.inputView}>
          <TextInput
            mode="outlined"
            label={'ID Number'}
            style={{ backgroundColor: Colors.white }}
            placeholder='IDNumber'
            value={
              formValues.IDNumber
            }
            keyboardType='number-pad'
            onChangeText={value => handleInputChange('IDNumber', value)}
            placeholderTextColor={'#11182744'}
          />
          {errors?.IDNumber && (
            <Text style={{ color: 'red' }}>{errors?.IDNumber}</Text>
          )}
        </View> */}

        <View style={styles.inputView}>
          <TextInput
            mode="outlined"
            label={'Password'}
            style={{ backgroundColor: Colors.white }}
            placeholder='password'
            value={
              formValues.password
            }
            secureTextEntry
            keyboardType='default'
            onChangeText={value => handleInputChange('password', value)}
            placeholderTextColor={'#11182744'}
          />
          {errors?.password && (
            <Text style={{ color: 'red' }}>{errors?.password}</Text>
          )}
        </View>

        <View style={styles.inputView}>
          <TextInput
            mode="outlined"
            label={'Confirm Password'}
            style={{ backgroundColor: Colors.white }}
            placeholder='confirmPassword'
            value={
              formValues.confirmPassword
            }
            secureTextEntry
            keyboardType='default'
            onChangeText={value => handleInputChange('confirmPassword', value)}
            placeholderTextColor={'#11182744'}
          />
          {errors?.confirmPassword && (
            <Text style={{ color: 'red' }}>{errors?.confirmPassword}</Text>
          )}
        </View>
        <View style={styles.inputView}>
          {Platform.OS == 'android' &&
            <TextInput
              mode="outlined"
              label={'Address'}
              style={{ backgroundColor: Colors.white }}
              placeholder='Location'
              value={
                formValues.address
              }
              autoCorrect={false}
              keyboardType='default'
              autoCapitalize="none"
              onChangeText={value => handleInputChange('address', value)}
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
                  // formValues.latitude = details?.geometry?.location?.lat.toString();
                  // formValues.longitude = details?.geometry?.location?.lng.toString();
                  handleInputChange('address', data?.description)
                }}
                onFail={(error) => console.error(error)}

              />
            </View>
          }

          {errors?.address && (
            <Text style={{ color: 'red' }}>{errors?.address}</Text>
          )}
        </View>

        <View style={styles.inputView}>
          <TextInput
            mode="outlined"
            label={'Ward Number'}
            style={{ backgroundColor: Colors.white }}
            placeholder='wardNo'
            value={
              formValues.wardNo
            }
            keyboardType='default'
            onChangeText={value => handleInputChange('wardNo', value)}
            placeholderTextColor={'#11182744'}
          />
          {errors?.wardNo && (
            <Text style={{ color: 'red' }}>{errors?.wardNo}</Text>
          )}
        </View>
    



        <View style={styles.buttonView}>
          <Pressable style={styles.button} onPress={() => handleSubmit()}>
            <Text style={styles.buttonText}>
              {isLoading && (
                <ActivityIndicator size={20} color={Colors.white} />
              )}{' '}
              CREATE AN ACCOUNT
            </Text>
          </Pressable>
        </View>
        <Text style={styles.footerText}>
          Already a member?
          <Text
            style={styles.signup}
            onPress={() => {
              navigation.navigate('SignIn', { title: title });
            }}>
            {' '}
            Sign In
          </Text>
        </Text>
      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    // alignItems: 'center',
    flex: 1,
    marginTop: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textTransform: 'uppercase',
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
    width: screenWidth / 2,
    height: screenWidth / 2,
    borderWidth: 1, // Border width in pixels
    borderColor: Colors.blue,
    borderRadius: (screenWidth - 50) / 2, // Border radius (optional)
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    elevation: 1,
    alignSelf: 'center',
  },
  img: {
    width: screenWidth / 2 - 60,
    height: screenWidth / 2 - 60,
    resizeMode: 'contain',
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
