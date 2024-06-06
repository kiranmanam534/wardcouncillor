import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import CouncillorDetailsScreen from '../screens/CouncillorDetailsScreen';
import CouncillorDetailScreen from '../screens/CouncillorDetailScreen';
import CouncilloriViewScreen from '../screens/CouncilloriViewScreen';
import { Colors } from '../constant/Colors';
import { clearData } from '../session/session';
import { authSliceActions } from '../redux/loginSlice';
import WardMemberInfoScreen from '../screens/WardMemberInfoScreen';
import BottomTabNavigator from './BottomTabNavigator';
import HotspotScreen from '../screens/HotspotScreen';
import RoadClousureScreen from '../screens/RoadClousureScreen';
import WardMeetingScreen from '../screens/WardMeetingScreen';
import WorkshopsScreen from '../screens/WorkshopsScreen';
import MissingPersonsScreen from '../screens/MissingPersonScreen';
import WarningssScreen from '../screens/WarningsScreen';
import HealthCareScreen from '../screens/HealthCareScreen';
import AllWardsOutstandingScreen from '../screens/AllWardsOutstandingScreen';
import DashboardScreen from '../screens/DashboardScreen';
import MayorOutstandingDashboardScreen from '../screens/MayorOutstandingDashboardScreen';
import CategoryOutstandingScreen from '../screens/CategoryOutstandingScreen';
import ShowMapModal from './ShowMapModal';
import Customer360Screen from '../screens/Customer360Screen';
import PaymentHistoryScreen from '../screens/PaymentHistoryScreen';
import ViewAnnouncementScreen from '../screens/ViewAnnouncementScreen';
import ViewImagesScreen from '../screens/ViewImagesScreen';

const PrivateNavigation = () => {
  const PrivateStack = createNativeStackNavigator();
  const dispatch = useDispatch();

  const navigation = useNavigation();


  const loggedUser = useSelector(state => state.loginReducer.items);

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
        headerBackTitleVisible: false,
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          color: Colors.white,
        },
        headerTintColor: Colors.white,
      }}>
      <PrivateStack.Screen
        name="Index"

        component={WardMemberInfoScreen}
        options={({ navigation, route }) => ({
          title: 'COUNCILLOR INFO',
          headerShown: true,
          headerTitleAlign: 'center',
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
        name="Dashboard"
        component={loggedUser?.warD_NO != 0 ? BottomTabNavigator : DashboardScreen}
        options={({ navigation, route }) => ({
          title: 'HOME',
          headerShown: loggedUser?.warD_NO != 0 ? false : true,
          navigationBarHidden: true,
          headerRight: () => (
            <Pressable onPress={handleLogout}>
              <Icon name="sign-out" size={25} color={Colors.white} />
            </Pressable>
          ),
          headerLeft: null, // Hides the headerLeft
        })}
      />
      <PrivateStack.Screen
        name="MayorOutstandingDashboard"
        component={MayorOutstandingDashboardScreen}
        options={({ navigation, route }) => ({
          title: route.params.title,
          headerShown: true,
        })}
      />
      <PrivateStack.Screen
        name="CategoryOutstanding"
        component={CategoryOutstandingScreen}
        options={({ navigation, route }) => ({
          title: route.params.title,
          headerShown: true,
        })}
      />
      <PrivateStack.Screen
        name="AllWards"
        component={AllWardsOutstandingScreen}
        options={({ navigation, route }) => ({
          title: route.params.title,
          headerShown: true,
        })}
      />
      <PrivateStack.Screen
        name="CouncillorDetails"
        component={CouncillorDetailsScreen}
        options={({ navigation, route }) => ({
          title: route.params.title,
          headerShown: true,
        })}
      />
      <PrivateStack.Screen
        name="CouncillorDetail"
        component={CouncillorDetailScreen}
        options={({ navigation, route }) => ({
          title: route.params.title,
          headerShown: true,
        })}
      />
      <PrivateStack.Screen
        name="CouncillorView"
        component={CouncilloriViewScreen}
        options={({ navigation, route }) => ({
          title: route.params.title,
          headerShown: true,
        })}
      />

      <PrivateStack.Screen
        name="Hotspots"
        component={HotspotScreen}
        options={({ navigation, route }) => ({
          title: route.params.title,
          headerShown: true,
        })}
      />
      <PrivateStack.Screen
        name="RoadClosure"
        component={RoadClousureScreen}
        options={({ navigation, route }) => ({
          title: route.params.title,
          headerShown: true,
        })}
      />
      <PrivateStack.Screen
        name="Meetings"
        component={WardMeetingScreen}
        options={({ navigation, route }) => ({
          title: route.params.title,
          headerShown: true,
        })}
      />
      <PrivateStack.Screen
        name="Workshops"
        component={WorkshopsScreen}
        options={({ navigation, route }) => ({
          title: route.params.title,
          headerShown: true,
        })}
      />

      <PrivateStack.Screen
        name="MissingPerson"
        component={MissingPersonsScreen}
        options={({ navigation, route }) => ({
          title: route.params.title,
          headerShown: true,
        })}
      />


      <PrivateStack.Screen
        name="Warnings"
        component={WarningssScreen}
        options={({ navigation, route }) => ({
          title: route.params.title,
          headerShown: true,
        })}
      />



      <PrivateStack.Screen
        name="Healthcare"
        component={HealthCareScreen}
        options={({ navigation, route }) => ({
          title: route.params.title,
          headerShown: true,
        })}
      />


      <PrivateStack.Screen
        name="ShowPropertyMap"
        component={ShowMapModal}
        options={({ navigation, route }) => ({
          title: route.params.title,
          headerShown: true,
        })}
      />

      <PrivateStack.Screen
        name="Customer360"
        component={Customer360Screen}
        options={({ navigation, route }) => ({
          title: route.params.title,
          headerShown: true,
        })}
      />


      <PrivateStack.Screen
        name="PaymentHistory"
        component={PaymentHistoryScreen}
        options={({ navigation, route }) => ({
          title: route.params.title,
          headerShown: true,
        })}
      />


      <PrivateStack.Screen
        name="ViewAnnouncement"
        component={ViewAnnouncementScreen}
        options={({ navigation, route }) => ({
          title: route.params.title,
          headerShown: true,
        })}
      />

      <PrivateStack.Screen
        name="ViewImages"
        component={ViewImagesScreen}
        options={({ navigation, route }) => ({
          title: route.params.title,
          headerShown: true,
        })}
      />
    </PrivateStack.Navigator>
  );
};

export default PrivateNavigation;
