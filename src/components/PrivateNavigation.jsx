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
import IndegentConsumptionsMapScreen from '../screens/IndegentConsumptionsMapScreen';
const AI_Icon = require('../assets/images/AI-chat2.jpeg');
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
    navigation.navigate('AIChatBot', {title: 'I AM SIXTEP AI CHAT BOT'});
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
            headerShown: !(loggedUser?.warD_NO != 0),
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
            headerTitleAlign: 'left',
            title: route.params.title,
            headerShown: true,
          })}
        />

        <PrivateStack.Screen
          name="IndegentConsumptionsMap"
          component={IndegentConsumptionsMapScreen}
          options={({navigation, route}) => ({
            headerTitleAlign: 'left',
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
        <Pressable
          style={({pressed}) => [
            styles.toggleButton,
            pressed && styles.toggleButtonPressed,
          ]}
          onPress={goToAIChatBot}>
          <View style={styles.iconWrapper}>
            <Image source={AI_Icon} style={styles.img} />
          </View>
          <View style={styles.badge}>
            <Icon name="comments" size={14} color={Colors.white} />
          </View>
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
    right: 20,
    backgroundColor: Colors.yellow,
    borderRadius: 35,
    height: 70,
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.blue,
    shadowColor: Colors.black,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  toggleButtonPressed: {
    transform: [{scale: 0.95}],
    opacity: 0.9,
  },
  iconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
});
