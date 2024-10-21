import {
  Alert,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';

import CouncillorDetailsScreen from '../screens/CouncillorDetailsScreen';
import CouncillorDetailScreen from '../screens/CouncillorDetailScreen';
import CouncilloriViewScreen from '../screens/CouncilloriViewScreen';
import {Colors} from '../constant/Colors';
import {clearData} from '../session/session';
import {authSliceActions} from '../redux/loginSlice';
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
import OustandingChartsScreen from '../screens/OustandingChartsScreen';
import OutstandingCategoriesChartScreen from '../screens/OutstandingCategoriesChartScreen';
import CollectionsScreen from '../screens/CollectionsScreen';
import WardWiseCollections from '../screens/WardWiseCollections';
import CollectionsBarChartScreen from '../screens/CollectionsBarChartScreen';
import CollectionsSummaryScreen from '../screens/CollectionsSummaryScreen';
import WardsWiseComparisonScreen from '../screens/WardsWiseComparisonScreen';
import WardsDBAIScreen from '../screens/WardsDBAIScreen';
import WardBillingCollectionsScreen from '../screens/WardBillingCollectionsScreen';
import Collections_Billing_BarChartScreen from '../screens/Collections_Billing_BarChartScreen';
import IndegentDashboardScreen from '../screens/IndegentDashboardScreen';
import IndegentConsumptionsScreen from '../screens/IndegentConsumptionsScreen';
const AI_Icon = require('../assets/images/AI_Icon.jpeg');
const screenWidth = Dimensions.get('window').width;

const PrivateNavigation = () => {
  const PrivateStack = createNativeStackNavigator();
  const dispatch = useDispatch();

  const navigation = useNavigation();

  const isVisible = useSelector(state => state.visibilityAI.isVisible);

  const loggedUser = useSelector(state => state.loginReducer.items);
  console.log('Navigation', loggedUser.warD_NO);

  const handleLogout = () => {
    clearData();
    dispatch(authSliceActions.logout());
  };

  const goToAIChatBot = () => {
    navigation.navigate('AIChatBot', {title: 'I AM TSEBO'});
  };

  return (
    <>
      <PrivateStack.Navigator
        initialRouteName="Index"
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
          options={({navigation, route}) => ({
            title:
              loggedUser.warD_NO == 0 ? `SPEAKER'S INFO` : 'COUNCILLOR INFO',
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
          component={
            loggedUser?.warD_NO != 0 ? BottomTabNavigator : DashboardScreen
          }
          options={({navigation, route}) => ({
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
          options={({navigation, route}) => ({
            title: route.params.title,
            headerShown: true,
          })}
        />
        <PrivateStack.Screen
          name="CategoryOutstanding"
          component={CategoryOutstandingScreen}
          options={({navigation, route}) => ({
            title: route.params.title,
            headerShown: true,
          })}
        />
        <PrivateStack.Screen
          name="AllWards"
          component={AllWardsOutstandingScreen}
          options={({navigation, route}) => ({
            title: route.params.title,
            headerShown: true,
          })}
        />

        <PrivateStack.Screen
          name="WardWiseCollections"
          component={WardWiseCollections}
          options={({navigation, route}) => ({
            title: route.params.title,
            headerShown: true,
          })}
        />

        <PrivateStack.Screen
          name="WardBillingCollections"
          component={WardBillingCollectionsScreen}
          options={({navigation, route}) => ({
            title: route.params.title,
            headerShown: true,
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

        <PrivateStack.Screen
          name="Hotspots"
          component={HotspotScreen}
          options={({navigation, route}) => ({
            title: route.params.title,
            headerShown: true,
          })}
        />
        <PrivateStack.Screen
          name="RoadClosure"
          component={RoadClousureScreen}
          options={({navigation, route}) => ({
            title: route.params.title,
            headerShown: true,
          })}
        />
        <PrivateStack.Screen
          name="Meetings"
          component={WardMeetingScreen}
          options={({navigation, route}) => ({
            title: route.params.title,
            headerShown: true,
          })}
        />
        <PrivateStack.Screen
          name="Workshops"
          component={WorkshopsScreen}
          options={({navigation, route}) => ({
            title: route.params.title,
            headerShown: true,
          })}
        />

        <PrivateStack.Screen
          name="MissingPerson"
          component={MissingPersonsScreen}
          options={({navigation, route}) => ({
            title: route.params.title,
            headerShown: true,
          })}
        />

        <PrivateStack.Screen
          name="Warnings"
          component={WarningssScreen}
          options={({navigation, route}) => ({
            title: route.params.title,
            headerShown: true,
          })}
        />

        <PrivateStack.Screen
          name="Healthcare"
          component={HealthCareScreen}
          options={({navigation, route}) => ({
            title: route.params.title,
            headerShown: true,
          })}
        />

        <PrivateStack.Screen
          name="ShowPropertyMap"
          component={ShowMapModal}
          options={({navigation, route}) => ({
            title: route.params.title,
            headerShown: true,
          })}
        />

        <PrivateStack.Screen
          name="Collections"
          component={CollectionsScreen}
          options={({navigation, route}) => ({
            title: route.params.title,
            headerShown: true,
          })}
        />
        <PrivateStack.Screen
          name="Customer360"
          component={Customer360Screen}
          options={({navigation, route}) => ({
            title: route.params.title,
            headerShown: true,
          })}
        />

        <PrivateStack.Screen
          name="PaymentHistory"
          component={PaymentHistoryScreen}
          options={({navigation, route}) => ({
            title: route.params.title,
            headerShown: true,
          })}
        />

        <PrivateStack.Screen
          name="ViewAnnouncement"
          component={ViewAnnouncementScreen}
          options={({navigation, route}) => ({
            title: route.params.title,
            headerShown: true,
          })}
        />

        <PrivateStack.Screen
          name="ViewImages"
          component={ViewImagesScreen}
          options={({navigation, route}) => ({
            title: route.params.title,
            headerShown: true,
          })}
        />

        <PrivateStack.Screen
          name="OustandingCharts"
          component={OustandingChartsScreen}
          options={({navigation, route}) => ({
            title: route.params.title,
            headerShown: true,
          })}
        />

        <PrivateStack.Screen
          name="OutstandingCategoriesChart"
          component={OutstandingCategoriesChartScreen}
          options={({navigation, route}) => ({
            title: route.params.title,
            headerShown: true,
          })}
        />

        <PrivateStack.Screen
          name="CollectionsBarChart"
          component={CollectionsBarChartScreen}
          options={({navigation, route}) => ({
            title: route.params.title,
            headerShown: true,
          })}
        />

        <PrivateStack.Screen
          name="Collections_Billing_BarChart"
          component={Collections_Billing_BarChartScreen}
          options={({navigation, route}) => ({
            title: route.params.title,
            headerShown: true,
          })}
        />

        <PrivateStack.Screen
          name="CollectionsSummary"
          component={CollectionsSummaryScreen}
          options={({navigation, route}) => ({
            title: route.params.title,
            headerShown: true,
          })}
        />

        <PrivateStack.Screen
          name="WardsWiseComparison"
          component={WardsWiseComparisonScreen}
          options={({navigation, route}) => ({
            title: route.params.title,
            headerShown: true,
          })}
        />

        <PrivateStack.Screen
          name="IndegentDashboard"
          component={IndegentDashboardScreen}
          options={({navigation, route}) => ({
            title: route.params.title,
            headerShown: true,
          })}
        />

        <PrivateStack.Screen
          name="IndegentConsumptions"
          component={IndegentConsumptionsScreen}
          options={({navigation, route}) => ({
            title: route.params.title,
            headerShown: true,
          })}
        />

        <PrivateStack.Screen
          name="AIChatBot"
          component={WardsDBAIScreen}
          options={({navigation, route}) => ({
            title: route.params.title,
            headerShown: true,
          })}
        />
      </PrivateStack.Navigator>
      {isVisible && (
        <Pressable style={styles.toggleButton} onPress={goToAIChatBot}>
          <Image source={AI_Icon} style={styles.img} />
        </Pressable>
      )}
    </>
  );
};

export default PrivateNavigation;

const styles = StyleSheet.create({
  toggleButton: {
    position: 'absolute',
    bottom: 100,
    right: 30,
    // top: Dimensions.get('screen').height/2,
    backgroundColor: Colors.primary,
    borderRadius: 25,
    height: 50,
    width: 50,
    // padding: 10,
    elevation: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.black, // For iOS
    shadowOffset: {width: 0, height: 2}, // For iOS
    shadowOpacity: 0.8, // For iOS
    shadowRadius: 20, // For iOS
    cursor: 'pointer',
  },
  img: {
    width: 60,
    height: 60,
    borderRadius: 30,
    // resizeMode: 'stretch',
  },
});
