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
import {Colors} from '../constant/Colors';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {GetwardHeaderTitle} from '../utility/Commom';
import {MayorSelectedWardActions} from '../redux/MayorSelectedWardSlice';
import {IndegentDashboardList} from '../constant/MainDashboardList';
const IndegentDashboardScreen = () => {
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
    if (item.name == 'StatusWise') {
      navigation.navigate('CouncillorDetails', {
        title:
          loggedUser?.warD_NO != 0
            ? loggedUser?.warD_NO +
              ' - ' +
              GetwardHeaderTitle('Collections', 'Indigent')
            : GetwardHeaderTitle('Collections', 'Indigent'),
        wardType: 'Indigent',
      });
    } else {
      navigation.navigate('IndegentConsumptions', {
        title:
          loggedUser?.warD_NO != 0
            ? loggedUser?.warD_NO +
              ' - ' +
              GetwardHeaderTitle('Indigent', 'Indigent Consumptions')
            : GetwardHeaderTitle('Indigent', 'Indigent Consumptions'),
        wardType: 'Indigent',
      });
    }
  };

  const renderMenuList = item => {
    console.log(loggedUser?.warD_NO);
    return (
      <Animated.View
        key={item.id}
        style={[
          {
            opacity: fadeAnim,
            transform: [{translateY: slideAnim}],
          },
        ]}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => handleDetailsNavigation(item)}>
          <View style={styles.card}>
            <View style={styles.leftSection}>
              <View style={styles.iconCircle}>{item.icon}</View>
              <View style={styles.textSection}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.subtitle}>Tap to view details</Text>
              </View>
            </View>
            <View style={styles.arrowCircle}>
              <Icon name="chevron-right" size={18} color={Colors.primary} />
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          {IndegentDashboardList.map(item => renderMenuList(item))}
        </View>
      </ScrollView>
    </View>
  );
};

export default IndegentDashboardScreen;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 120 : 120,
  },
  container: {
    padding: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.yellow,
    shadowColor: '#1E40AF',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
  textSection: {
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
  arrowCircle: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
