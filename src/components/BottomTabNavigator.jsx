import React from 'react';
import { View, StatusBar, Platform, Pressable } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from '../screens/HomeScreen';
import { Colors } from '../constant/Colors';
import WardMemberInfoScreen from '../screens/WardMemberInfoScreen';
import DashboardScreen from '../screens/DashboardScreen';
import MainDashboardScreen from '../screens/MainDashboardScreen';
import { useDispatch } from 'react-redux';
import { clearData } from '../session/session';
import { authSliceActions } from '../redux/loginSlice';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  const dispatch = useDispatch();
  const handleLogout = () => {
    clearData();
    dispatch(authSliceActions.logout());
  };
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarHideOnKeyboard: true,

        tabBarStyle: {
          display: 'flex',
          position: 'absolute',
          bottom: 10,
          left: 0,
          right: 0,
          elevation: 5,
          backgroundColor: Colors.primary,
          borderRadius: 50,
          margin: 20,
          height: 60,
        },
        tabBarLabelStyle: {
          color: Colors.white,
          fontSize: 15,
          paddingBottom: Platform.OS == 'ios' ? 0 : 10,
          marginTop: 16
        },
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        headerTintColor: Colors.white,
        headerTitleAlign: 'center',
        tabBarShowLabel: true,
        headerShown: true,
        headerRight: () => (
          <Pressable onPress={handleLogout} style={{ paddingRight: 15 }}>
            <FontAwesome name="sign-out" size={25} color={Colors.white} />
          </Pressable>
        ),
      })}>
      <Tab.Screen
        name="DASHBOARD"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                top: Platform.OS === 'ios' ? focused ? -10 : 0 : focused ? -10 : -5,
                width: Platform.OS === 'ios' ? focused ? 50 : 30 : focused ? 60 : 30,
                height: Platform.OS === 'ios' ? focused ? 50 : 30 : focused ? 60 : 30,
                borderRadius:
                  Platform.OS === 'ios'
                    ? focused
                      ? 25
                      : 15
                    : focused
                      ? 30
                      : 15,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: focused ? Colors.white : Colors.lightgray,
              }}>
              <MaterialCommunityIcons
                name="view-dashboard-outline"
                size={
                  Platform.OS === 'ios'
                    ? focused
                      ? 40
                      : 25
                    : focused
                      ? 40
                      : 25
                }
                color={focused ? Colors.blue : Colors.red}
              />
            </View>
          ),
          tabBarIconStyle: {},

        }}
      />
      <Tab.Screen
        name="HOME"
        component={MainDashboardScreen}
        options={{
          tabBarLabel: 'Home',
          // tabBarLabelStyle:{
          //   marginTop:17,
          //   color:Colors.white
          // },
          headerShown: true,
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                top: Platform.OS === 'ios' ? focused ? -10 : 0 : focused ? -10 : -5,
                width: Platform.OS === 'ios' ? focused ? 50 : 30 : focused ? 60 : 30,
                height: Platform.OS === 'ios' ? focused ? 50 : 30 : focused ? 60 : 30,
                borderRadius: Platform.OS === 'ios' ? 25 : 30,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: Colors.lightgray,
              }}>
              <MaterialCommunityIcons
                name="home"
                size={
                  Platform.OS === 'ios'
                    ? focused
                      ? 40
                      : 25
                    : focused
                      ? 40
                      : 25
                }
                color={focused ? Colors.blue : Colors.red}
              />
            </View>
          ),
          tabBarIconStyle: {},
        }}
      />
    </Tab.Navigator>
  );
}
