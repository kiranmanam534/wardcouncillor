import { View, Text } from 'react-native'
import React from 'react'
import {createNativeStackNavigator} from '@react-navigation/native-stack';


import SplashScreen from '../screens/SplashScreen';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import {Colors} from '../constant/Colors';
import SignupScreen from '../screens/SignupScreen';

const PubllicNavigation = () => {

    
  const PublickStack = createNativeStackNavigator();

  return (
    <PublickStack.Navigator
    screenOptions={{
      // navigationBarHidden: true,
      navigationBarColor: Colors.primary,
      statusBarColor: Colors.primary,
      headerStyle: {
        backgroundColor: Colors.primary,
      },
      headerTitleStyle: {
        fontWeight: 'bold',
        color: Colors.white,
      },
      headerTintColor: Colors.white,
    }}>
    <PublickStack.Screen
      name="Splsah"
      component={SplashScreen}
      options={{headerShown: false}}
    />
    <PublickStack.Screen
      name="Home"
      component={HomeScreen}
      options={{headerShown: false}}
    />
    <PublickStack.Screen
      name="SignIn"
      component={LoginScreen}
      options={({navigation, route}) => ({
        title: 'SIGN IN',
        headerShown: true,
      })}
    />

    <PublickStack.Screen
      name="SignUp"
      component={SignupScreen}
      options={({navigation, route}) => ({
        title: 'SIGN UP',
        headerShown: true,
      })}
    />
  </PublickStack.Navigator>
  )
}

export default PubllicNavigation