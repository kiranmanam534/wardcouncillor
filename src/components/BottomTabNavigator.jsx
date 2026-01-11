import React from 'react';
import {View, StatusBar, Platform, Pressable} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from '../screens/HomeScreen';
import {Colors} from '../constant/Colors';
import WardMemberInfoScreen from '../screens/WardMemberInfoScreen';
import DashboardScreen from '../screens/DashboardScreen';
import MainDashboardScreen from '../screens/MainDashboardScreen';
import {useDispatch} from 'react-redux';
import {clearData} from '../session/session';
import {authSliceActions} from '../redux/loginSlice';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  const dispatch = useDispatch();
  const handleLogout = () => {
    clearData();
    dispatch(authSliceActions.logout());
  };
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          height: 70,
          backgroundColor: Colors.white,
          borderRadius: 35,
          paddingBottom: 0,
          paddingTop: 0,
          borderWidth: 0,
          borderColor: 'transparent',
          ...Platform.select({
            ios: {
              shadowColor: Colors.primary,
              shadowOffset: {width: 0, height: -2},
              shadowOpacity: 0.1,
              shadowRadius: 20,
            },
            android: {
              elevation: 10,
            },
          }),
        },
        tabBarActiveTintColor: Colors.white,
        tabBarInactiveTintColor: '#6B7280',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginTop: -5,
          marginBottom: 8,
          letterSpacing: 0.3,
        },
        headerStyle: {
          backgroundColor: Colors.primary,
          borderBottomWidth: 3,
          borderBottomColor: Colors.yellow,
          ...Platform.select({
            ios: {
              shadowColor: Colors.blue,
              shadowOffset: {width: 0, height: 3},
              shadowOpacity: 0.25,
              shadowRadius: 6,
            },
            android: {
              elevation: 6,
            },
          }),
        },
        headerTitleStyle: {
          fontSize: 19,
          fontWeight: '800',
          letterSpacing: 0.5,
        },
        headerTintColor: Colors.yellow,
        headerTitleAlign: 'center',
        tabBarShowLabel: true,
        headerShown: true,
        headerRight: () => (
          <Pressable
            onPress={handleLogout}
            style={({pressed}) => [
              {
                marginRight: 12,
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: pressed ? '#FFD700' : Colors.yellow,
                borderWidth: 2,
                borderColor: Colors.white,
                justifyContent: 'center',
                alignItems: 'center',
                ...Platform.select({
                  ios: {
                    shadowColor: Colors.yellow,
                    shadowOffset: {width: 0, height: 2},
                    shadowOpacity: pressed ? 0.5 : 0.3,
                    shadowRadius: pressed ? 4 : 3,
                  },
                  android: {
                    elevation: pressed ? 5 : 3,
                  },
                }),
                transform: [{scale: pressed ? 0.9 : 1}],
              },
            ]}>
            <FontAwesome name="sign-out" size={16} color={Colors.blue} />
          </Pressable>
        ),
      })}>
      <Tab.Screen
        name="DASHBOARD"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({focused}) => (
            <View
              style={{
                position: 'absolute',
                top: -30,
                width: 70,
                height: 70,
                borderRadius: 35,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: focused ? Colors.yellow : Colors.primary,
                borderWidth: 5,
                borderColor: Colors.white,
                ...Platform.select({
                  ios: {
                    shadowColor: focused ? Colors.yellow : Colors.primary,
                    shadowOffset: {width: 0, height: 4},
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                  },
                  android: {
                    elevation: 8,
                  },
                }),
              }}>
              <MaterialCommunityIcons
                name="view-dashboard"
                size={32}
                color={focused ? Colors.blue : Colors.white}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="HOME"
        component={MainDashboardScreen}
        options={{
          tabBarLabel: 'Home',
          headerShown: true,
          tabBarIcon: ({focused}) => (
            <View
              style={{
                position: 'absolute',
                top: -30,
                width: 70,
                height: 70,
                borderRadius: 35,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: focused ? Colors.yellow : Colors.primary,
                borderWidth: 5,
                borderColor: Colors.white,
                ...Platform.select({
                  ios: {
                    shadowColor: focused ? Colors.yellow : Colors.primary,
                    shadowOffset: {width: 0, height: 4},
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                  },
                  android: {
                    elevation: 8,
                  },
                }),
              }}>
              <MaterialCommunityIcons
                name="home"
                size={32}
                color={focused ? Colors.blue : Colors.white}
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
