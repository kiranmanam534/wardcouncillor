import {
  ActivityIndicator,
  Alert,
  Button,
  Dimensions,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Card} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';

import {Colors} from '../constant/Colors';
import {getCouncillorWardDashboardApi} from '../services/councillorWardApi';
import {getValueByKey} from '../utility/getValueByKey';
import {formattedAmount} from '../utility/FormattedAmmount';
import LoaderModal from '../components/LoaderModal';
import {GetwardHeaderTitle} from '../utility/Commom';
import {MayorSelectedWardActions} from '../redux/MayorSelectedWardSlice';
import {apiUrl} from '../constant/CommonData';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const logo = require('../assets/images/sixtep-logo.jpeg');

const screenWidth = Dimensions.get('window').width;

const DashboardScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [isRefresh, setIsRefresh] = useState(false);
  const [IsDataMaintaince, setIsDataMaintaince] = useState(false);
  const [DataMaintaince, setDataMaintaince] = useState(null);
  const [IsDataMaintainceLoding, setIsDataMaintainceLoding] = useState(false);

  const loggedUser = useSelector(state => state.loginReducer.items);

  const loggedUserNme = useSelector(state => state.loginReducer.loggedUserName);

  const {items, isLoading, error} = useSelector(
    state => state.WardDashboardReducer,
  );

  // const { items: DataLoadedItems, isLoading: isDataLoading, error: errorDataLoaded, isDataLoaded } = useSelector(
  //   state => state.DataLoadDetailsReducer,
  // );

  // console.log("DataLoadedItems", DataLoadedItems)
  // console.log("isDataLoaded", isDataLoaded)
  console.log('items', items);

  const getDataMaintainceInfo = async () => {
    try {
      setIsDataMaintainceLoding(true);
      console.log(
        'getDataMaintainceInfo',
        `${apiUrl}/api/CouncillorWard/GetDataLoadDetails`,
      );
      const response = await axios.post(
        `${apiUrl}/api/CouncillorWard/GetDataLoadDetails`,
      );
      console.log(response.data.data);
      const res = response.data.data;
      if (res[0].name == 'LOADED') {
        console.log(res[0]);
        setIsDataMaintaince(false);
        setDataMaintaince(res[0]);
        dispatch(getCouncillorWardDashboardApi(loggedUser?.warD_NO));
      } else {
        setIsDataMaintaince(true);
      }
      setIsDataMaintainceLoding(false);
      setIsRefresh(false);
    } catch (error) {
      console.log(error);
      setIsDataMaintaince(true);
      setIsDataMaintainceLoding(false);
      setIsRefresh(false);
    }
  };

  useEffect(() => {
    getDataMaintainceInfo();
  }, [loggedUser?.warD_NO]);

  // useEffect(() => {
  //   dispatch(GetDataLoadDetailsApi());
  // }, []);

  const RefreshData = () => {
    setIsRefresh(true);
    // dispatch(GetDataLoadDetailsApi());
    getDataMaintainceInfo();
  };

  const formatNumber = value => {
    const parsed = parseFloat(value);
    if (isNaN(parsed)) return 'N/A';

    const absValue = Math.abs(parsed);
    const sign = parsed < 0 ? '-' : '';

    if (absValue >= 1000000000) {
      return (
        sign + (absValue / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B'
      );
    } else if (absValue >= 1000000) {
      return sign + (absValue / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    } else if (absValue >= 100000) {
      return sign + (absValue / 100000).toFixed(1).replace(/\.0$/, '') + 'L';
    } else if (absValue >= 1000) {
      return sign + (absValue / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return parsed.toString();
  };

  const safeParseInt = value => {
    const parsed = parseInt(value);
    return isNaN(parsed) ? 'N/A' : formatNumber(parsed);
  };

  const safeParseFloat = value => {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 'N/A' : formatNumber(parsed);
  };

  const handleDetailsNavigation = (navigationText, title, wardType) => {
    dispatch(MayorSelectedWardActions.clearSelectedWardNo());
    navigation.navigate(navigationText, {
      title:
        loggedUser?.warD_NO != 0
          ? loggedUser?.warD_NO + ' - ' + GetwardHeaderTitle(wardType, title)
          : GetwardHeaderTitle(wardType, title),
      wardType: wardType,
    });
  };

  if (IsDataMaintainceLoding && !isRefresh) {
    return (
      <LoaderModal visible={IsDataMaintainceLoding} loadingText="Loading..." />
    );
  }

  const ShowMessageData = () => {
    return (
      <View style={styles.container}>
        <View style={styles.headerCard}>
          <View style={styles.userSection}>
            <View style={styles.userIconCircle}>
              <Icon name="user-circle" size={24} color={Colors.yellow} />
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.greetingText}>Hello,</Text>
              <Text style={styles.userName}>{loggedUserNme}</Text>
            </View>
          </View>
          <View style={styles.headerRow}>
            <View style={styles.refreshInfo}>
              <MaterialIcon name="update" size={16} color={Colors.primary} />
              <Text style={styles.refreshText}>
                Last refreshed: {DataMaintaince?.value ?? 'N/A'}
              </Text>
            </View>
            <View style={styles.wardBadge}>
              <Text style={styles.wardLabel}>Ward </Text>
              <Text style={styles.wardNumber}>{loggedUser?.warD_NO}</Text>
            </View>
          </View>
        </View>

        <View style={styles1.container}>
          <View style={styles1.card}>
            <View style={styles1.iconWrapper}>
              <View style={styles1.box}>
                <Image source={logo} style={styles1.img} />
              </View>
            </View>

            <View style={styles1.contentWrapper}>
              <MaterialIcon
                name="build"
                size={32}
                color={Colors.yellow}
                style={{marginBottom: 12}}
              />
              <Text style={styles1.title}>Under Maintenance</Text>
              <Text style={styles1.description}>
                Due to planned system maintenance, the application will not be
                accessible during this period.
              </Text>
              <View style={styles1.infoBox}>
                <Icon name="info-circle" size={16} color={Colors.primary} />
                <Text style={styles1.infoText}>
                  We appreciate your patience during this time!
                </Text>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={RefreshData}
              style={styles1.refreshButton}>
              {isRefresh ? (
                <ActivityIndicator
                  animating={true}
                  color={Colors.white}
                  size="small"
                />
              ) : (
                <>
                  <MaterialIcon name="refresh" size={20} color={Colors.white} />
                  <Text style={styles1.refreshButtonText}>Refresh</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <>
      {IsDataMaintaince ? (
        <ShowMessageData />
      ) : (
        <View style={styles.container}>
          <View style={styles.headerCard}>
            <View style={styles.userSection}>
              <View style={styles.userIconCircle}>
                <Icon name="user-circle" size={24} color={Colors.yellow} />
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.greetingText}>Hello,</Text>
                <Text style={styles.userName}>{loggedUserNme}</Text>
              </View>
            </View>
            <View style={styles.headerRow}>
              <View style={styles.refreshInfo}>
                <MaterialIcon name="update" size={16} color={Colors.primary} />
                <Text style={styles.refreshText}>
                  Last refreshed: {DataMaintaince?.value ?? 'N/A'}
                </Text>
              </View>
              <View style={styles.wardBadge}>
                <Text style={styles.wardLabel}>Ward </Text>
                <Text style={styles.wardNumber}>{loggedUser?.warD_NO}</Text>
              </View>
            </View>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{marginBottom: 150}}>
              <View style={styles.gridRow}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    if (loggedUser?.warD_NO == 0) {
                      handleDetailsNavigation(
                        'MayorOutstandingDashboard',
                        'Outstanding Dashboard',
                        'Outstanding',
                      );
                    } else {
                      handleDetailsNavigation(
                        'CouncillorDetails',
                        'Outstanding Debt',
                        'Outstanding',
                      );
                    }
                  }}
                  style={styles.gridCard}>
                  <View style={styles.gridCardHeader}>
                    <Icon name="money" size={24} color={Colors.yellow} />
                  </View>
                  <Text style={styles.gridCardTitle}>Outstanding Debt</Text>
                  {isLoading ? (
                    <ActivityIndicator size="small" color={Colors.primary} />
                  ) : (
                    <Text style={styles.gridCardValue}>
                      {formattedAmount(
                        parseFloat(getValueByKey(items, 'Outstanding Amount')),
                        'en-ZA',
                        'ZAR',
                        'currency',
                      )}
                    </Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    handleDetailsNavigation(
                      'CouncillorDetails',
                      'Interims',
                      'Interims',
                    );
                  }}
                  style={styles.gridCard}>
                  <View style={styles.gridCardHeader}>
                    <Icon name="file-text" size={24} color={Colors.yellow} />
                  </View>
                  <Text style={styles.gridCardTitle}>Interims</Text>
                  {isLoading ? (
                    <ActivityIndicator size="small" color={Colors.primary} />
                  ) : (
                    <Text style={styles.gridCardValue}>
                      {safeParseInt(getValueByKey(items, 'Interims'))}
                    </Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    handleDetailsNavigation(
                      'CouncillorDetails',
                      'Incidents/Complaints',
                      'IMS',
                    );
                  }}
                  style={styles.gridCard}>
                  <View style={styles.gridCardHeader}>
                    <Icon name="warning" size={24} color={Colors.yellow} />
                  </View>
                  <Text style={styles.gridCardTitle}>Incidents</Text>
                  {isLoading ? (
                    <ActivityIndicator size="small" color={Colors.primary} />
                  ) : (
                    <Text style={styles.gridCardValue}>
                      {safeParseInt(getValueByKey(items, 'IMS'))}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>

              <View style={styles.gridRow}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    handleDetailsNavigation(
                      'CouncillorDetails',
                      'Total Water and Electricity Meters',
                      'Meter',
                    );
                  }}
                  style={styles.gridCard}>
                  <View style={styles.gridCardHeader}>
                    <Icon name="tachometer" size={24} color={Colors.yellow} />
                  </View>
                  <Text style={styles.gridCardTitle}>Meters</Text>
                  {isLoading ? (
                    <ActivityIndicator size="small" color={Colors.primary} />
                  ) : (
                    <Text style={styles.gridCardValue}>
                      {safeParseFloat(
                        getValueByKey(items, 'Water and Electricity Meters'),
                      )}
                    </Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    handleDetailsNavigation(
                      'CouncillorDetails',
                      "City's Total Properties",
                      'Property',
                    );
                  }}
                  style={styles.gridCard}>
                  <View style={styles.gridCardHeader}>
                    <Icon name="building" size={24} color={Colors.yellow} />
                  </View>
                  <Text style={styles.gridCardTitle}>Properties</Text>
                  {isLoading ? (
                    <ActivityIndicator size="small" color={Colors.primary} />
                  ) : (
                    <Text style={styles.gridCardValue}>
                      {safeParseInt(getValueByKey(items, 'Total Properties'))}
                    </Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    handleDetailsNavigation(
                      'CouncillorDetails',
                      "City's Total Customers",
                      'Customer',
                    );
                  }}
                  style={styles.gridCard}>
                  <View style={styles.gridCardHeader}>
                    <Icon name="users" size={24} color={Colors.yellow} />
                  </View>
                  <Text style={styles.gridCardTitle}>Customers</Text>
                  {isLoading ? (
                    <ActivityIndicator size="small" color={Colors.primary} />
                  ) : (
                    <Text style={styles.gridCardValue}>
                      {safeParseInt(getValueByKey(items, 'Total Customers'))}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>

              <View style={styles.gridRow}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    handleDetailsNavigation(
                      'CouncillorDetails',
                      'Meters Not Read',
                      'MetersNotRead',
                    );
                  }}
                  style={styles.gridCard}>
                  <View style={styles.gridCardHeader}>
                    <Icon
                      name="exclamation-triangle"
                      size={24}
                      color={Colors.yellow}
                    />
                  </View>
                  <Text style={styles.gridCardTitle}>Not Read</Text>
                  {isLoading ? (
                    <ActivityIndicator size="small" color={Colors.primary} />
                  ) : (
                    <Text style={styles.gridCardValue}>
                      {safeParseInt(getValueByKey(items, 'Not Read Meters'))}
                    </Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    handleDetailsNavigation(
                      'Customer360',
                      'Customer 360',
                      'Customer360',
                    );
                  }}
                  style={styles.gridCard}>
                  <View style={styles.gridCardHeader}>
                    <Icon name="pie-chart" size={24} color={Colors.yellow} />
                  </View>
                  <Text style={styles.gridCardTitle}>Customer 360</Text>
                  <Text style={styles.gridCardSubtext}>View Insights</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    if (loggedUser?.warD_NO == 0) {
                      handleDetailsNavigation(
                        'Collections',
                        'Collections',
                        'Collections',
                      );
                    } else {
                      handleDetailsNavigation(
                        'Collections',
                        'Collections',
                        'Collections',
                      );
                    }
                  }}
                  style={styles.gridCard}>
                  <View style={styles.gridCardHeader}>
                    <Icon name="credit-card" size={24} color={Colors.yellow} />
                  </View>
                  <Text style={styles.gridCardTitle}>Collections</Text>
                  <Text style={styles.gridCardSubtext}>Payments</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.gridRow}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    handleDetailsNavigation(
                      'IndegentDashboard',
                      'Indigent',
                      'Indigent',
                    );
                  }}
                  style={styles.gridCard}>
                  <View style={styles.gridCardHeader}>
                    <Icon name="hand-paper-o" size={24} color={Colors.yellow} />
                  </View>
                  <Text style={styles.gridCardTitle}>Indigent</Text>
                  {isLoading ? (
                    <ActivityIndicator size="small" color={Colors.primary} />
                  ) : (
                    <Text style={styles.gridCardValue}>
                      {safeParseInt(getValueByKey(items, 'Indigent'))}
                    </Text>
                  )}
                </TouchableOpacity>

                <View style={[styles.gridCard, {opacity: 0}]}>
                  <View style={styles.gridCardHeader}>
                    <Icon name="money" size={24} color={Colors.yellow} />
                  </View>
                  <Text style={styles.gridCardTitle}>Placeholder</Text>
                  <Text style={styles.gridCardValue}>0</Text>
                </View>

                <View style={[styles.gridCard, {opacity: 0}]}>
                  <View style={styles.gridCardHeader}>
                    <Icon name="money" size={24} color={Colors.yellow} />
                  </View>
                  <Text style={styles.gridCardTitle}>Placeholder</Text>
                  <Text style={styles.gridCardValue}>0</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      )}
    </>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 10,
  },
  headerCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 25,
    padding: 10,
    marginTop: 16,
    marginBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  userIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  greetingText: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '500',
    marginBottom: 3,
    letterSpacing: 0.3,
  },
  userName: {
    fontWeight: '700',
    fontSize: 18,
    color: '#1E3A8A',
    letterSpacing: 0.2,
  },
  wardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.yellow,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  wardLabel: {
    fontSize: 13,
    color: Colors.white,
    fontWeight: '600',
    letterSpacing: 0.5,
    opacity: 0.9,
  },
  wardNumber: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: 0.5,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0,
  },
  refreshInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  refreshText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 8,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  gridCard: {
    width: '32%',
    padding: 12,
    alignItems: 'center',
  },
  gridCardHeader: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  gridCardTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 16,
    letterSpacing: 0.3,
  },
  gridCardValue: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.primary,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  gridCardSubtext: {
    fontSize: 11,
    fontWeight: '700',
    color: '#3B82F6',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  fullWidthCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 20,
    marginBottom: 12,
    marginHorizontal: 2,
    shadowColor: '#3B82F6',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.06)',
  },
  cardIconWrapper: {
    marginRight: 18,
  },
  cardHeader: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 6,
    letterSpacing: 0.3,
    lineHeight: 18,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E3A8A',
    letterSpacing: 0.3,
  },
  cardSubtext: {
    fontSize: 13,
    fontWeight: '600',
    color: '#60A5FA',
    letterSpacing: 0.2,
  },
  cardArrow: {
    marginLeft: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dashboardCard: {
    width: '48%',
    paddingVertical: 20,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  viewButton: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.primary,
    marginRight: 4,
  },
  card1: {
    width: '48%',
    marginVertical: 3,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  card: {
    width: '48%',
    marginVertical: 8,
    borderRadius: 24,
    borderWidth: 0.2,
    borderColor: Colors.orange,
    backgroundColor: Colors.primary,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
    paddingVertical: 6,
    paddingHorizontal: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.white,
    textAlign: 'center',
    marginVertical: 8,
  },
  button: {
    width: '100%',
    marginTop: 8,
    borderTopColor: Colors.white,
    borderTopWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 6,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 15,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
});

const styles1 = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    shadowColor: Colors.black,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: Colors.lightgray1,
    alignItems: 'center',
  },
  iconWrapper: {
    marginBottom: 20,
  },
  box: {
    width: 80,
    height: 80,
    borderWidth: 3,
    borderColor: Colors.yellow,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
    overflow: 'hidden',
  },
  img: {
    width: 50,
    height: 50,
    resizeMode: 'cover',
    borderRadius: 25,
  },
  contentWrapper: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: Colors.primary,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    color: Colors.darkgray,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightBlue,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
    marginLeft: 8,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 25,
    shadowColor: Colors.primary,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    minWidth: 140,
  },
  refreshButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
});
