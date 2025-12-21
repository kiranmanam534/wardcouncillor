import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
} from 'react-native';
import React, {useRef, useEffect} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  CollectionsDashboardList,
  MayorOustandingDashboardList,
} from '../constant/MainDashboardList';
import {Colors} from '../constant/Colors';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {GetwardHeaderTitle} from '../utility/Commom';
import {MayorSelectedWardActions} from '../redux/MayorSelectedWardSlice';
const CollectionsScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const loggedUser = useSelector(state => state.loginReducer.items);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // const handleDetailsNavigation = (navigationText, title, wardType) => {
  //     navigation.navigate(navigationText, {
  //         title: loggedUser?.warD_NO != 0 ? loggedUser?.warD_NO + ' - ' + GetwardHeaderTitle(wardType, title) : GetwardHeaderTitle(wardType, title),
  //         wardType: wardType,
  //     });
  // };

  const handleDetailsNavigation = item => {
    dispatch(MayorSelectedWardActions.clearSelectedWardNo());
    if (item.name == 'WardCollections') {
      navigation.navigate('WardWiseCollections', {
        title:
          loggedUser?.warD_NO != 0
            ? loggedUser?.warD_NO +
              ' - ' +
              GetwardHeaderTitle('Collections', 'Ward wise collections')
            : GetwardHeaderTitle('Collections', 'Ward wise collections'),
        wardType: 'Collections',
      });
    } else if (item.name == 'MonthWiseCollections') {
      navigation.navigate('CollectionsBarChart', {
        title:
          loggedUser?.warD_NO != 0
            ? loggedUser?.warD_NO +
              ' - ' +
              GetwardHeaderTitle('Collections', 'Month wise collections')
            : GetwardHeaderTitle('Collections', 'Month wise collections'),
        wardType: 'Collections',
      });
    } else if (item.name == 'CollectionsSummary') {
      navigation.navigate('CollectionsSummary', {
        title: GetwardHeaderTitle('Collections', 'Collections Summary'),
        wardType: 'Collections',
      });
    } else if (item.name == 'WardsWiseComparison') {
      navigation.navigate('WardsWiseComparison', {
        title: GetwardHeaderTitle('Wards Comparision', 'Wards Comparision'),
        wardType: 'Wards Comparision',
      });
    } else if (item.name == 'WardBillingCollections') {
      // handleDetailsNavigation(
      //   'CollectionsBarChart',
      //   'Collections Bar chart',
      //   'Collections',
      // );

      let navText =
        loggedUser?.warD_NO == 0
          ? 'WardBillingCollections'
          : 'Collections_Billing_BarChart';
      // navigation.navigate('Collections_Billing_BarChart', {
      //   title:
      //     'Ward : ' +
      //     name +
      //     ' - ' +
      //     GetwardHeaderTitle('Collections', 'Collections vs Billing Barchat'),
      //   wardType: 'Collections',
      //   selectedWardNo: name,
      // });
      navigation.navigate(navText, {
        title:
          loggedUser?.warD_NO != 0
            ? loggedUser?.warD_NO +
              ' - ' +
              GetwardHeaderTitle('Collections', 'Billing vs Collections')
            : GetwardHeaderTitle('Collections', 'Billing vs Collections  '),
        wardType:
          loggedUser?.warD_NO == 0 ? 'WardBillingCollections' : 'Collections',
        selectedWardNo: loggedUser?.warD_NO,
      });
    }
  };

  const renderMenuList = item => {
    console.log(loggedUser?.warD_NO);
    if (
      (loggedUser?.warD_NO != 0 && item.name == 'WardBillingCollections') ||
      item.name == 'MonthWiseCollections'
    ) {
      return (
        <Animated.View
          key={item.id}
          style={[
            {
              opacity: fadeAnim,
              transform: [{translateY: slideAnim}],
            },
          ]}>
          <TouchableOpacity onPress={() => handleDetailsNavigation(item)}>
            <View style={styles.card}>
              <View style={styles.iconCircle}>{item.icon}</View>
              <View style={styles.content}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.subtitle}>Tap to view details</Text>
              </View>
              <View style={styles.arrowContainer}>
                <Icon name="chevron-right" size={20} color={Colors.primary} />
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
      );
    } else if (loggedUser?.warD_NO == 0) {
      return (
        <Animated.View
          key={item.id}
          style={[
            {
              opacity: fadeAnim,
              transform: [{translateY: slideAnim}],
            },
          ]}>
          <TouchableOpacity onPress={() => handleDetailsNavigation(item)}>
            <View style={styles.card}>
              <View style={styles.iconCircle}>{item.icon}</View>
              <View style={styles.content}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.subtitle}>Tap to view details</Text>
              </View>
              <View style={styles.arrowContainer}>
                <Icon name="chevron-right" size={20} color={Colors.primary} />
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
      );
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}>
      <View style={{marginBottom: Platform.OS === 'ios' ? 120 : 120}}>
        {CollectionsDashboardList.map(item => renderMenuList(item))}
      </View>
    </ScrollView>
  );
};

export default CollectionsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: '#F0F4F8',
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    margin: 8,
    borderLeftWidth: 4,
    borderLeftColor: Colors.yellow,
    shadowColor: '#1E40AF',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E3A8A',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  arrowContainer: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
