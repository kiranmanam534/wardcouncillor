import React, {useEffect, useState} from 'react';
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
  TextInput,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {Colors} from '../constant/Colors';
import InputFeild from '../components/InputFeild';
import {SingupFileds} from '../constant/SignupFeilds';
import SignupValidationSchema from '../validation/SignupSchema';
import {useDispatch, useSelector} from 'react-redux';
import {CommunityMemberRegisterApi} from '../services/communityMemberApi';
import {ActivityIndicator} from 'react-native-paper';
import ErrorModal from '../components/ErrorModal';
const logo = require('../assets/images/BCX-LOGO.png');

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function SignupScreen({route}) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {title} = route.params;

  const {data, isLoading, error, statusCode} = useSelector(
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
      await SignupValidationSchema.validate(formValues, {abortEarly: false});
      // Form is valid, submit the data
      // console.log('Form data:', formValues);

      let formData = {
        title: 'string',
        firstName: 'string',
        lastName: 'string',
        idNumber: 'string',
        email: 'string2',
        cellNumber: 'string',
        address: 'string',
        password: 'string',
        wardNo: 'string',
      };

      dispatch(CommunityMemberRegisterApi(formValues));
    } catch (error) {
      // Validation failed, set errors
      console.log(error);
      const validationErrors = {};
      error.inner.forEach(e => {
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
          {SingupFileds.map(item => (
            <View key={item.id}>
              <InputFeild
                item={item}
                value={formValues[item.name] || ''}
                onChangeText={value => handleInputChange(item.name, value)}
              />
              {errors[item.name] && (
                <Text style={{color: 'red'}}>{errors[item.name]}</Text>
              )}
            </View>
          ))}
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
              navigation.navigate('SignIn', {title: title});
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
    borderRadius: (screenWidth - 50) / 4, // Border radius (optional)
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
