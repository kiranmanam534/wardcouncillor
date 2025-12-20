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
import React, {useEffect, useState} from 'react';
import Geolocation from '@react-native-community/geolocation';

import {
  authorize,
  refresh,
  revoke,
  prefetchConfiguration,
} from 'react-native-app-auth';

import {Buffer} from 'buffer';

import {Colors} from './src/constant/Colors';
const banner = require('./src/assets/images/germiston-lake-banner.jpg');
const logo = require('./src/assets/images/sixtep-logo.jpeg');

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
  // issuer: 'https://coeiamtest.ekurhuleni.gov.za/oauth2/token',
  issuer: 'https://mycity.ekurhuleni.gov.za/oauth2/token',
  clientId: 'afH1F2cPhSyLRdvkqQyYmwu3C4ka',
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
  const [location, setLocation] = useState({
    latitude: '0.00',
    longitude: '0.00',
  });
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

  useEffect(() => {
    // Request the user's location
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setLocation({latitude, longitude});
        console.log(
          `${Platform.OS}: Latitude: ${latitude}, Longitude: ${longitude}`,
        );
      },
      error => {
        console.log(error);
      },
      {enableHighAccuracy: true, timeout: 60000, maximumAge: 1000},
    );
  }, []);

  const login = async loginformData => {
    try {
      console.log('loginformData===>', loginformData);
      const response = await axios.post(
        `${apiUrl}/api/auth/login`,
        loginformData,
      );
      const user = response.data.data;
      console.log('Logged User info===>', user);
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
      console.log('================1====================');
      console.log(data.groups);
      console.log('=================2===================');
      const IAM_Email = data.email;
      console.log('=================3===================');
      console.log(IAM_Email);
      console.log(JSON.stringify(data));
      console.log('=================4===================');

      const exists = data.groups?.includes('Application/Councillor_Mayor');

      if (IAM_Email) {
        console.log('exists', exists);
        login({
          username: IAM_Email,
          password: 'password',
          usertype: 'C',
          device: Platform.OS,
          userlattitude: location.latitude.toString(),
          userlongitude: location.longitude.toString(),
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
      <ImageBackground source={null} style={styles.imageBackground}>
        <View style={styles.overlay} />

        <TouchableOpacity style={styles.versionBadge}>
          <Text style={styles.versionText}>V.1.0-beta</Text>
        </TouchableOpacity>

        <View style={styles.contentContainer}>
          <View style={styles.logoContainer}>
            <View style={styles.box}>
              <Image source={logo} style={styles.img} />
            </View>
          </View>

          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>WELCOME</Text>
            <View style={styles.divider} />
            <Text style={styles.poweredByText}>
              Powered by Sixtep Technologies
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.btn, {width: isIAMAuthenticate ? 220 : 200}]}
            activeOpacity={0.8}
            onPress={() => {
              // !isIAMAuthenticate ? handleIAMLogin() : null;
              handleNavigation('Mayor / Councillor');
            }}>
            {isIAMAuthenticate ? (
              <ActivityIndicator animating color={Colors.indigo} size="small" />
            ) : (
              <Icon name="user-circle" size={22} color={Colors.indigo} />
            )}
            <Text style={styles.text}>
              {isIAMAuthenticate ? 'Authenticating...' : 'LOGIN'}
            </Text>
          </TouchableOpacity>
        </View>
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
    backgroundColor: Colors.royalBlue,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 1,
  },
  logoContainer: {
    marginBottom: 40,
  },
  box: {
    width: screenWidth / 1.8,
    height: screenWidth / 1.8,
    borderWidth: 2,
    borderColor: Colors.yellow,
    borderRadius: screenWidth / 1.8 / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: Colors.yellow,
        shadowOffset: {width: 0, height: 8},
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  img: {
    width: screenWidth / 2.2,
    height: screenWidth / 2.2,
    resizeMode: 'cover',
    borderRadius: screenWidth / 2.2 / 2,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 50,
  },
  welcomeText: {
    fontSize: 32,
    color: Colors.yellow,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 15,
  },
  divider: {
    width: 80,
    height: 3,
    backgroundColor: Colors.yellow,
    borderRadius: 2,
    marginBottom: 15,
  },
  poweredByText: {
    fontSize: 14,
    color: Colors.white,
    opacity: 0.9,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.yellow,
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: Colors.white,
    ...Platform.select({
      ios: {
        shadowColor: Colors.yellow,
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  text: {
    marginLeft: 10,
    color: Colors.indigo,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
  },
  versionBadge: {
    position: 'absolute',
    bottom: screenHeight / 20,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.yellow,
    zIndex: 2,
  },
  versionText: {
    color: Colors.yellow,
    fontSize: 12,
    fontWeight: '600',
  },
});
