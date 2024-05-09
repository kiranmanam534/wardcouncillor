import {Alert, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';

import DashboardScreen from '../screens/DashboardScreen';
import CouncillorDetailsScreen from '../screens/CouncillorDetailsScreen';
import CouncillorDetailScreen from '../screens/CouncillorDetailScreen';
import CouncilloriViewScreen from '../screens/CouncilloriViewScreen';
import {Colors} from '../constant/Colors';
import {clearData} from '../session/session';
import {authSliceActions} from '../redux/loginSlice';
import WardMemberInfoScreen from '../screens/WardMemberInfoScreen';
import CMDashboardScreen from '../screens/CMDashboardScreen';

const CMPrivateNavigation = () => {
  const PrivateStack = createNativeStackNavigator();
  const dispatch = useDispatch();

  const navigation = useNavigation();
  const handleLogout = () => {
    clearData();
    dispatch(authSliceActions.logout());
  };

  return (
    <PrivateStack.Navigator
    initialRouteName='Index'
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
        headerTitleAlign:'center'
      }}>
        <PrivateStack.Screen
        name="Index"
        
        component={CMDashboardScreen}
        options={({navigation, route}) => ({
          title: 'DASHBOARD',
        //   headerShown: false,
          navigationBarHidden: true,
          headerRight: () => (
            <Pressable onPress={handleLogout}>
              <Icon name="sign-out" size={25} color={Colors.white} />
            </Pressable>
          ),
          // headerLeft: null, // Hide the left navigation icon
        })}
      />
      
      <PrivateStack.Screen
        name="CouncillorDetails"
        component={CouncillorDetailsScreen}
        options={({navigation, route}) => ({
          title: route.params.title,
          headerShown: true,
        })}
      />
      <PrivateStack.Screen
        name="CouncillorDetail"
        component={CouncillorDetailScreen}
        options={({navigation, route}) => ({
          title: route.params.title,
          headerShown: true,
        })}
      />
      <PrivateStack.Screen
        name="CouncillorView"
        component={CouncilloriViewScreen}
        options={({navigation, route}) => ({
          title: route.params.title,
          headerShown: true,
        })}
      />
    </PrivateStack.Navigator>
  );
};

export default CMPrivateNavigation;
