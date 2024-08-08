import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';

import {
  authorize,
  refresh,
  revoke,
  prefetchConfiguration,
} from 'react-native-app-auth';

import {Buffer} from 'buffer';

import {Colors} from './src/constant/Colors';
const banner = require('./src/assets/images/germiston-lake-banner.jpg');
const logo = require('./src/assets/images/BCX-LOGO.png');

import Icon from 'react-native-vector-icons/dist/FontAwesome';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {loginApi} from './src/services/loginApi';
import {apiUrl} from './src/constant/CommonData';
import {authSliceActions} from './src/redux/loginSlice';
import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const config_new = {
  issuer: 'https://coeiamtest.ekurhuleni.gov.za/oauth2/token',
  clientId: 'F7aubwPETI6TBfCGuUNajDtbreka',
  redirectUrl: 'wardcouncillor:/oauthredirect',
  additionalParameters: {},
  // scopes: ['openid', 'profile', 'email','groups','role'],
  scopes: ['openid', 'profile', 'email'],
};

const TestHomeScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  // const { items, isLoading, error } = useSelector(state => state.loginReducer);
  const [isIAMAuthenticate, setIAMAuthenticate] = useState(false);

  const handleNavigation = title => {
    // console.log(title)
    navigation.navigate('SignIn', {title: title});
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
          },
        },
      ],
      {cancelable: false},
    );
  };

  const login = async loginformData => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/auth/login`,
        loginformData,
      );
      console.log(response.data);
      const user = response.data.data;
      dispatch(authSliceActions.setLoggedUser(user));
      setIAMAuthenticate(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Alert.alert(error.code)
        console.log('Axios Error Message:', error.message);
        console.log('Axios Error Code:', error.code);

        if (error.response) {
          // Server responded with a status other than 200 range
          console.log('Response Data:', error.response.data);
          console.log('Response Status:', error.response.status);
        } else if (error.request) {
          // Request was made but no response was received
          console.log('Request:', error.request);
        } else {
          // Something happened in setting up the request
          console.log('Error Message:', error.message);
        }

        if (error.code == 'ERR_NETWORK') {
          ShowAlert('Network Error!', 'Please check your network!');
        } else if (error.code == 'ERR_BAD_REQUEST') {
          ShowAlert('Authentication', "User doesn't exist in database!");
        } else {
          ShowAlert('Error', 'Something went wrong!');
        }
        setIAMAuthenticate(false);
      } else {
        console.log('General Error:', error);
        const errorData = error?.response?.data;
        console.log('error.response.data===>', error.response.data);

        if (errorData?.statusCode === 401) {
          ShowAlert('Error', "User doesn't exist in database!");
        } else {
          ShowAlert('Error', 'Something went wrong!');
        }

        setIAMAuthenticate(false);
      }
    }
  };

  const IAMLogin = async () => {
    try {
      setIAMAuthenticate(true);
      // authenticate()
      const authState = await authorize(config_new);
      // console.log(authState);
      const jwtBody = authState.idToken.split('.')[1];
      const base64 = jwtBody.replace('-', '+').replace('_', '/');
      const decodedJwt = Buffer.from(base64, 'base64');
      const data = JSON.parse(decodedJwt.toString('ascii'));
      //Alert.alert('DATA: ', JSON.stringify(data));
      console.log('====================================');
      console.log(data.groups);
      console.log('====================================');
      const IAM_Email = data.sub;
      console.log('====================================');
      console.log(IAM_Email);
      // console.log(JSON.stringify(data));
      console.log('====================================');

      const exists = data.groups?.includes('Application/Councillor_Mayor');

      if (IAM_Email) {
        console.log(exists);
        login({
          username: IAM_Email,
          password: 'password',
          usertype: 'C',
        });
      }
    } catch (error) {
      setIAMAuthenticate(false);
      console.log('******authorizeError*******');
      console.log('====================================');
      console.log('==>', error);
      console.log('====================================');
      // Convert error to object
      const errorObject = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };

      // Handle the specific error message
      if (
        error.message === 'User cancelled flow' ||
        error.message ==
          'The operation couldn’t be completed. (org.openid.appauth.general error -3.)'
      ) {
        // You can add more custom properties if needed
        errorObject.message =
          'The user has cancelled the authentication process.';
      }

      console.log(errorObject);
      //if(error.Error)
      ShowAlert('Error!', errorObject.message);
      // console.log(JSON.stringify(error));
      //Alert.alert('Failed to log in', ""+JSON.stringify(error));
    }
  };

  const handleIAMLogin = async () => {
    console.log('here!!');
    NetInfo.fetch()
      .then(state => {
        console.log('====================================');
        console.log(state);
        console.log('isInternetReachable', state.isInternetReachable);
        console.log('====================================');

        if (state.isInternetReachable !== false) {
          IAMLogin();
          // if (Platform.OS == 'ios' && state.isInternetReachable != null) {
          //     // handleNavigation("Mayor / Councillor");
          //     IAMLogin();
          // }
          // else if (Platform.OS == 'android') {
          //     IAMLogin();
          // } else {
          //     ShowAlert("Network!", "Please check your network!")
          // }
        } else {
          ShowAlert('Network!', 'Please check your network!');
        }
      })
      .catch(error => {
        console.error('Error fetching network status:', error);
        ShowAlert('Network Error!', 'Please check your network!');
      });
  };

  return (
    <View style={{flex: 1}}>
      <ImageBackground source={banner} style={styles.imageBackground}>
        <View
          style={{
            position: 'absolute',
            bottom: screenHeight / 25,
            backgroundColor: Colors.primary,
            padding: 5,
            borderRadius: 5,
            borderWidth: 1,
            borderColor: Colors.white,
          }}>
          <Text style={{color: Colors.white}}>V.1.0</Text>
        </View>

        <View style={styles.box}>
          <Image source={logo} style={styles.img} />
        </View>

        <Text
          style={{
            fontSize: 20,
            color: Colors.yellow,
            paddingTop: 10,
            fontWeight: 'bold',
          }}>
          WELCOME
        </Text>
        <Text style={{fontSize: 15, color: Colors.white, paddingTop: 10}}>
          BCX is your partner in digital transformation
        </Text>
        {/* <Text style={{ fontSize: 15, color: Colors.white, paddingTop: 10 }}>You can now submit your meter readings online</Text> */}

        <TouchableOpacity
          style={[
            styles.btn,
            {width: isIAMAuthenticate ? 200 : 150, justifyContent: 'center'},
          ]}
          onPress={() => {
            handleNavigation('ward councillor');
            // !isIAMAuthenticate ? handleIAMLogin() : null;
            // handleNavigation("Mayor / Councillor")
          }}>
          {isIAMAuthenticate ? (
            <ActivityIndicator animatin color={Colors.white} size="small" />
          ) : (
            <Icon name="user-circle" size={20} color={Colors.white} />
          )}

          <Text style={styles.text}>
            {' '}
            {isIAMAuthenticate ? 'Authenticating...' : 'LOGIN'}
          </Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

export default TestHomeScreen;

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  box: {
    width: screenWidth / 2,
    height: screenWidth / 2,
    borderWidth: 1.5, // Border width in pixels
    borderColor: Colors.primary,
    borderRadius: (screenWidth - 50) / 2, // Border radius (optional)
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: Colors.white,
    // ...Platform.select({
    //     ios: {
    //       shadowColor: Colors.blue,
    //       shadowOffset: { width: 0, height: 0 },
    //       shadowOpacity: 0.2,
    //       shadowRadius: 1.41,
    //     },
    //     android: {
    //       elevation: 1,
    //     },
    //   }),
    alignSelf: 'center',
  },
  img: {
    width: screenWidth / 2 - 60,
    height: screenWidth / 2 - 60,
    resizeMode: 'contain',
  },
  btn: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.white,
  },
  text: {
    marginLeft: 10,
    color: Colors.yellow,
    fontFamily: 'open sans',
    fontSize: 16,
    fontWeight: '800',
  },
});
