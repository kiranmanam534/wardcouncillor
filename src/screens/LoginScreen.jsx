import React, {useEffect, useState, useRef} from 'react';
import {
  Alert,
  BackHandler,
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
import {useNavigation, useFocusEffect} from '@react-navigation/native';
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

  const [isShowPwd, setIsShowPwd] = useState(true);
  const [click, setClick] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [username, setUsername] = useState('COESolarDev08@ekurhuleni.gov.za');
  const [password, setPassword] = useState('#Apps2024!?');
  const loginAttemptCount = useRef(0);

  console.log(
    '>>> RENDER - showErrorModal:',
    showErrorModal,
    'error:',
    error,
    'isLoading:',
    isLoading,
  );

  // Handle login button press
  const handleLogin = async () => {
    console.log('>>> LOGIN CLICKED - Attempt #', loginAttemptCount.current + 1);
    // Close any existing error modal
    setShowErrorModal(false);
    loginAttemptCount.current += 1;
    console.log('>>> Closed modal, dispatching login API');

    // Dispatch login API
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

  // Handle successful login
  useEffect(() => {
    if (items && !isLoading) {
      console.log('Login successful');
      dispatch(authSliceActions.login(items));
    }
  }, [items, isLoading, dispatch]);

  // Handle login error - show modal immediately when error appears after loading
  useEffect(() => {
    console.log('=== ERROR EFFECT ===');
    console.log('error:', error);
    console.log('isLoading:', isLoading);
    console.log('loginAttemptCount:', loginAttemptCount.current);

    if (error && !isLoading) {
      console.log('✓ Error detected after loading - showing modal immediately');
      // Use setTimeout to ensure state updates happen after render
      setTimeout(() => {
        setShowErrorModal(true);
        console.log('✓ showErrorModal set to TRUE');
      }, 100);
    }
    console.log('====================');
  }, [error, isLoading, loginAttemptCount.current]);

  // Close error modal and clear error from Redux
  const closeModal = () => {
    console.log('>>> CLOSE MODAL CALLED');
    setShowErrorModal(false);
    dispatch(authSliceActions.clearError());
    console.log('>>> Modal closed and error cleared');
  };

  const showPwd = () => {
    setIsShowPwd(!isShowPwd);
  };

  // Disable back button/gesture navigation
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        // Return true to prevent default back behavior
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );

  console.log('>>> ABOUT TO RENDER ErrorModal - visible:', showErrorModal);
  return (
    <SafeAreaView style={styles.container}>
      <LoaderModal visible={isLoading} loadingText="Loading..." />

      {!isLoading && (
        <ErrorModal
          key={error ? 'has-error' : 'no-error'}
          visible={showErrorModal}
          ErrorModalText={
            error === 'Network error!'
              ? 'Network error!'
              : 'Username and password wrong.'
          }
          closeModal={closeModal}
          onPress={() => {
            closeModal();
          }}
        />
      )}

      <View style={styles.gradientBackground}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={false}>
          {/* Compact Header */}
          <View style={styles.headerSection}>
            <View style={styles.logoContainer}>
              <Image source={logo} style={styles.logo} />
            </View>
            <Text style={styles.welcomeText}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue as {title}</Text>
          </View>

          {/* Compact Login Form */}
          <View style={styles.formCard}>
            <View style={styles.inputWrapper}>
              <Icon
                name="user"
                size={18}
                color={Colors.primary}
                style={styles.inputIconLeft}
              />
              <TextInput
                mode="flat"
                placeholder="Email or Username"
                style={styles.input}
                value={username}
                onChangeText={text => setUsername(text)}
                autoCorrect={false}
                autoCapitalize="none"
                underlineColor="transparent"
                activeUnderlineColor="transparent"
                theme={{
                  colors: {
                    primary: 'transparent',
                    text: Colors.black,
                    placeholder: '#9CA3AF',
                  },
                }}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Icon
                name="lock"
                size={18}
                color={Colors.primary}
                style={styles.inputIconLeft}
              />
              <TextInput
                mode="flat"
                placeholder="Password"
                style={styles.input}
                secureTextEntry={isShowPwd}
                value={password}
                onChangeText={setPassword}
                autoCorrect={false}
                autoCapitalize="none"
                underlineColor="transparent"
                activeUnderlineColor="transparent"
                theme={{
                  colors: {
                    primary: 'transparent',
                    text: Colors.black,
                    placeholder: '#9CA3AF',
                  },
                }}
              />
              <TouchableOpacity
                onPress={showPwd}
                style={styles.eyeIcon}
                activeOpacity={0.7}>
                <Icon
                  name={isShowPwd ? 'eye-slash' : 'eye'}
                  size={18}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.optionsRow}>
              <TouchableOpacity
                style={styles.rememberMe}
                onPress={() => setClick(!click)}
                activeOpacity={0.7}>
                <View style={[styles.checkbox, click && styles.checkboxActive]}>
                  {click && <Icon name="check" size={14} color={Colors.blue} />}
                </View>
                <Text style={styles.rememberText}>Remember me</Text>
              </TouchableOpacity>
            </View>

            <Pressable
              style={({pressed}) => [
                styles.button,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => handleLogin()}>
              <Text style={styles.buttonText}>Sign In</Text>
              <Icon name="arrow-right" size={18} color={Colors.blue} />
            </Pressable>
          </View>

          {title === 'community member' && (
            <View style={styles.footer}>
              <Text style={styles.footerText}>New here? </Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('SignUp', {title: title});
                }}
                activeOpacity={0.7}>
                <Text style={styles.signup}>Create Account</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4FF',
  },
  gradientBackground: {
    flex: 1,
    backgroundColor: '#F0F4FF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerSection: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 24,
  },
  logoContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: Colors.yellow,
    ...Platform.select({
      ios: {
        shadowColor: Colors.blue,
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.blue,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '400',
  },
  formCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    marginTop: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.08,
        shadowRadius: 16,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFF',
    borderRadius: 12,
    marginBottom: 14,
    paddingHorizontal: 14,
    height: 54,
    borderWidth: 1.5,
    borderColor: '#C8D9F7',
  },
  inputIconLeft: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    backgroundColor: 'transparent',
    fontSize: 15,
    height: 54,
    paddingHorizontal: 0,
  },
  eyeIcon: {
    padding: 8,
  },
  optionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 20,
  },
  rememberMe: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  checkboxActive: {
    backgroundColor: Colors.yellow,
    borderColor: Colors.yellow,
  },
  rememberText: {
    fontSize: 14,
    color: Colors.blue,
  },
  button: {
    backgroundColor: Colors.yellow,
    height: 54,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: Colors.blue,
    ...Platform.select({
      ios: {
        shadowColor: Colors.yellow,
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.35,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{scale: 0.98}],
  },
  buttonText: {
    color: Colors.blue,
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
    color: Colors.blue,
  },
  signup: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
});
