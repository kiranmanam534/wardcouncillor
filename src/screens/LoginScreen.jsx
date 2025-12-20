import React, {useEffect, useState} from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Platform,
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
const logo = require('../assets/images/sixtep-logo.jpeg');

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
        device: 'string',
        userlattitude: 'string',
        userlongitude: 'string',
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
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View style={styles.headerSection}>
          <View style={styles.logoWrapper}>
            <View style={styles.box}>
              <Image source={logo} style={styles.img} />
            </View>
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.titleUnderline} />
          </View>
        </View>

        <View style={styles.formCard}>
          <View style={styles.inputView}>
            <View style={styles.inputContainer}>
              <TextInput
                mode="outlined"
                label="Email or Username"
                style={styles.input}
                value={username}
                onChangeText={text => setUsername(text)}
                autoCorrect={false}
                autoCapitalize="none"
                outlineColor={Colors.blue}
                activeOutlineColor={Colors.primary}
                theme={{
                  colors: {
                    primary: Colors.primary,
                    text: Colors.black,
                  },
                  roundness: 12,
                }}
              />
              <View style={styles.inputIcon}>
                <Icon name="envelope-o" size={22} color={Colors.blue} />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                mode="outlined"
                label="Password"
                style={styles.input}
                secureTextEntry={isShowPwd}
                value={password}
                onChangeText={setPassword}
                autoCorrect={false}
                autoCapitalize="none"
                outlineColor={Colors.blue}
                activeOutlineColor={Colors.primary}
                theme={{
                  colors: {
                    primary: Colors.primary,
                    text: Colors.black,
                  },
                  roundness: 12,
                }}
              />
              <TouchableOpacity
                onPress={showPwd}
                style={styles.inputIcon}
                activeOpacity={0.7}>
                <Icon
                  name={isShowPwd ? 'eye' : 'eye-slash'}
                  size={22}
                  color={Colors.blue}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.rememberView}>
            <View style={styles.switch}>
              <Switch
                value={click}
                onValueChange={setClick}
                trackColor={{true: Colors.primary, false: Colors.blue}}
                thumbColor={click ? Colors.yellow : Colors.white}
              />
              <Text style={styles.rememberText}>Remember Me</Text>
            </View>
          </View>

          <Pressable
            style={({pressed}) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => handleLogin()}>
            <Icon name="sign-in" size={20} color={Colors.indigo} />
            <Text style={styles.buttonText}>SIGN IN</Text>
          </Pressable>
        </View>

        {title === 'community member' && (
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('SignUp', {title: title});
              }}
              activeOpacity={0.7}>
              <Text style={styles.signup}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  headerSection: {
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 20,
    backgroundColor: Colors.white,
  },
  logoWrapper: {
    marginBottom: 20,
  },
  box: {
    width: screenWidth / 3,
    height: screenWidth / 3,
    borderWidth: 3,
    borderColor: Colors.yellow,
    borderRadius: screenWidth / 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: Colors.blue,
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  img: {
    width: screenWidth / 3.2,
    height: screenWidth / 3.2,
    resizeMode: 'cover',
    borderRadius: screenWidth / 6.4,
  },
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: Colors.primary,
    letterSpacing: 1.5,
  },
  titleUnderline: {
    width: 60,
    height: 3,
    backgroundColor: Colors.yellow,
    borderRadius: 2,
    marginTop: 8,
  },
  formCard: {
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    marginTop: 24,
    borderRadius: 16,
    paddingVertical: 30,
    paddingHorizontal: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  inputView: {
    gap: 20,
    marginBottom: 16,
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    height: 56,
    backgroundColor: Colors.white,
    fontSize: 15,
  },
  inputIcon: {
    position: 'absolute',
    right: 15,
    top: 17,
    zIndex: 1,
  },
  rememberView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 24,
  },
  switch: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  rememberText: {
    fontSize: 14,
    color: Colors.black,
    fontWeight: '500',
  },
  button: {
    backgroundColor: Colors.yellow,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: Colors.blue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
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
  buttonPressed: {
    opacity: 0.8,
    transform: [{scale: 0.98}],
  },
  buttonText: {
    color: Colors.indigo,
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    gap: 6,
  },
  footerText: {
    color: Colors.black,
    fontSize: 15,
  },
  signup: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
