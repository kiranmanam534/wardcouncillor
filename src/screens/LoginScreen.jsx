import React, {useEffect, useState} from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {TextInput} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';

import Icon from 'react-native-vector-icons/dist/FontAwesome';

import {Colors} from '../constant/Colors';
import {loginApi} from '../services/loginApi';
import LoaderModal from '../components/LoaderModal';
import ErrorModal from '../components/ErrorModal';
import {authSliceActions} from '../redux/loginSlice';
const logo = require('../assets/images/COE_logo_portrait.png');

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function LoginScreen({route}) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {title} = route.params;

  const {items, isLoading, error} = useSelector(state => state.loginReducer);

  const isLoggedIn = useSelector(state => state.loginReducer.isLoggedIn);
  const [isShowPwd, setIsShowPwd] = useState(true);
  const [click, setClick] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(
    useSelector(state => (state.loginReducer.error ? true : false)),
  );
  // const [username, setUsername] = useState(title === 'community member' ? 'kannavenkateswarlu@gmail.com' : 'councillor2@gmail.com');
  const [username, setUsername] = useState('COESolarDev08@ekurhuleni.gov.za');
  const [password, setPassword] = useState('#Apps2024!?');
  // const [username, setUsername] = useState(
  //   title === 'community member'
  //     ? 'kannavenkateswarlu29@gmail.com'
  //     : 'jai1970@gmail.com',
  // );
  // const [password, setPassword] = useState('admin');

  console.log(showErrorModal, error);

  const handleLogin = () => {
    console.log(username);
    setShowErrorModal(false);
    dispatch(
      loginApi({
        username: username,
        password: password,
        usertype: title === 'community member' ? 'U' : 'C',
      }),
    );
  };
  // useEffect(() => {
  //   if (!items & !isLoading && error) {
  //     setShowErrorModal(true);
  //   }
  // }, [error, isLoading]);

  useEffect(() => {
    dispatch(authSliceActions.logout());
    if (items) {
      // navigation.navigate('Dashboard');
      dispatch(authSliceActions.login(items));
    }
  }, [items]);

  useEffect(() => {
    if (!isLoading && error) {
      // setShowErrorModal(true);
      Alert.alert(
        'Error',
        error == 'Network error!' ? error : 'username and password wrong.',
      );
    }
  }, [error, isLoading]);

  const closeModal = () => {
    dispatch(authSliceActions.logout());
    setTimeout(() => {
      setShowErrorModal(false);
    }, 500);
  };

  const showPwd = () => {
    setIsShowPwd(!isShowPwd);
  };
  return (
    <SafeAreaView style={styles.container}>
      <LoaderModal visible={isLoading} loadingText="Loading..." />

      <ErrorModal
        visible={showErrorModal}
        ErrorModalText={'username and password wrong.'}
        closeModal={closeModal}
        onPress={() => {
          closeModal();
        }}
      />
      <ScrollView>
        <View style={styles.box}>
          <Image source={logo} style={styles.img} />
        </View>
        {/* <Image source={logo} style={styles.image} resizeMode="contain" /> */}
        <Text style={styles.title}>{title}</Text>
        <View style={styles.inputView}>
          <View>
            <TextInput
              mode="outlined"
              label={'EMAIL OR USERNAME'}
              style={[styles.input, {position: 'relative'}]}
              // placeholder="EMAIL OR USERNAME"
              // placeholderTextColor={Colors.black}
              value={username}
              onChangeText={text => setUsername(text)}
              autoCorrect={false}
              autoCapitalize="none"
            />
            <Text
              style={{
                position: 'absolute',
                paddingVertical: 17,
                right: 10,
              }}>
              {' '}
              <Icon name="envelope-o" size={25} color={Colors.blue} />
            </Text>
          </View>
          <View>
            <TextInput
              mode="outlined"
              label={'PASSWORD'}
              style={styles.input}
              // placeholder="PASSWORD"
              // placeholderTextColor={Colors.black}
              secureTextEntry={isShowPwd}
              value={password}
              onChangeText={setPassword}
              autoCorrect={false}
              autoCapitalize="none"
            />
            {isShowPwd && (
              <TouchableOpacity
                onPress={showPwd}
                style={{
                  position: 'absolute',
                  paddingVertical: 17,
                  right: 10,
                }}>
                <Icon name="eye" size={25} color={Colors.blue} />
              </TouchableOpacity>
            )}
            {!isShowPwd && (
              <TouchableOpacity
                onPress={showPwd}
                style={{
                  position: 'absolute',
                  paddingVertical: 17,
                  right: 10,
                }}>
                <Icon name="eye-slash" size={25} color={Colors.blue} />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={styles.rememberView}>
          <View style={styles.switch}>
            <Switch
              value={click}
              onValueChange={setClick}
              trackColor={{true: Colors.primary, false: Colors.blue}}
            />
            <Text style={styles.rememberText}>Remember Me</Text>
          </View>
          <View>
            {/* <Pressable onPress={() => Alert.alert('Forget Password!')}>
              <Text style={styles.forgetText}>Forgot Password?</Text>
            </Pressable> */}
          </View>
        </View>

        <View style={styles.buttonView}>
          <Pressable
            style={styles.button}
            onPress={() =>
              // Alert.alert(
              //   'Login Successfuly!',
              //   'see you in my instagram if you have questions : must_ait6',
              // )
              handleLogin()
            }>
            <Text style={styles.buttonText}>SIGN IN</Text>
          </Pressable>
          {/* <Text style={styles.optionsText}>OR LOGIN WITH</Text> */}
        </View>

        {/* <View style={styles.mediaIcons}>
                <Image source={facebook} style={styles.icons}   />
                <Image source={tiktok} style={styles.icons}  />
                <Image source={linkedin} style={styles.icons}  />
        </View> */}
        {title === 'community member' && (
          <Text style={styles.footerText}>
            Don't Have Account?
            <Text
              style={styles.signup}
              onPress={() => {
                navigation.navigate('SignUp', {title: title});
              }}>
              {' '}
              Sign Up
            </Text>
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 10,
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
  input: {
    height: 50,
    paddingHorizontal: 5,
    borderColor: Colors.black,
    // borderWidth: 1,
    borderRadius: 7,
    color: Colors.black,
  },
  rememberView: {
    width: '100%',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 8,
  },
  switch: {
    flexDirection: 'row',
    gap: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rememberText: {
    fontSize: 14,
    color: Colors.red,
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
    gap: 10,
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
    alignSelf: 'center',
    elevation: 1,
    marginTop: 50,
  },
  img: {
    width: screenWidth / 2 - 60,
    height: screenWidth / 2 - 60,
    resizeMode: 'contain',
  },
});
