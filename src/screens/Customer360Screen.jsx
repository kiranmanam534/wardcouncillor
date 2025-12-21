import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  Animated,
} from 'react-native';
import {TextInput} from 'react-native-paper';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/dist/MaterialIcons';
const logo = require('../assets/images/sixtep-logo.jpeg');
import {Colors} from '../constant/Colors';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {GetCustomer360DataApi} from '../services/councillorWardApi';
import {customer360Actions} from '../redux/customer360Slice';
import LoaderModal from '../components/LoaderModal';
import CustomAlert from '../components/CustomAlert';
import {formattedAmount} from '../utility/FormattedAmmount';

const screenWidth = Dimensions.get('window').width;

const Customer360Screen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const [isAlertVisible, setAlertVisible] = useState(false);
  const [isAlertErrorVisible, setIsAlertErrorVisible] = useState(false);
  const [searchKey, setSearchKey] = useState();

  const loggedUser = useSelector(state => state.loginReducer.items);

  const {items, isLoading, error, statusCode} = useSelector(
    state => state.customer360Reducer,
  );

  useEffect(() => {
    dispatch(customer360Actions.clearWards());
  }, [loggedUser?.warD_NO]);

  useEffect(() => {
    if (items) {
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
    }
  }, [items]);

  const handleSerach = () => {
    dispatch(customer360Actions.clearWards());
    setIsAlertErrorVisible(true);
    console.log(searchKey);
    if (searchKey) {
      dispatch(
        GetCustomer360DataApi({
          wardNo: loggedUser?.warD_NO,
          accountNo: searchKey,
        }),
      );
    } else {
      //Alert.alert("Required!", "Please enter valid account number!")

      setAlertVisible(true);
    }
  };

  const closeAlert = () => {
    setAlertVisible(false);
  };

  const closeAlert1 = () => {
    setIsAlertErrorVisible(false);
  };

  const handlePaymentHistory = () => {
    navigation.navigate('PaymentHistory', {
      title: 'Payment History',
      accountNo: searchKey,
    });
  };

  console.log('360==>', items);

  // if (isLoading) {
  //     return <LoaderModal visible={isLoading} loadingText="Please wait, Data is Loading..." />;
  // }

  return (
    <View style={styles1.container}>
      <View style={styles1.header}>
        <View style={styles1.searchContainer}>
          <View style={styles1.inputWrapper}>
            <Icon
              name="credit-card"
              size={16}
              color={Colors.primary}
              style={styles1.inputIcon}
            />
            <TextInput
              mode="flat"
              style={styles1.textInput}
              contentStyle={styles1.textInputContent}
              value={searchKey}
              keyboardType="numeric"
              onChangeText={value => {
                const numericValue = value.replace(/[^0-9]/g, '');
                setSearchKey(numericValue);
              }}
              placeholder="Enter account number..."
              underlineColor="transparent"
              activeUnderlineColor="transparent"
              theme={{
                colors: {
                  primary: Colors.primary,
                  text: '#1E293B',
                  placeholder: '#94A3B8',
                },
              }}
            />
          </View>
          <TouchableOpacity onPress={handleSerach} style={styles1.searchButton}>
            <Icon name="search" size={18} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>
      <LoaderModal
        visible={isLoading}
        loadingText="Please wait, Data is Loading..."
      />
      <CustomAlert
        isVisible={isAlertVisible}
        onClose={closeAlert}
        message="Please enter valid account number!"
        imageSource={logo}
      />
      {items ? (
        items?.outstandingData.length > 0 ||
        items?.meterData.length > 0 ||
        items?.propertyData.length > 0 ||
        items?.interimsData.length > 0 ? (
          <ScrollView
            style={styles.container}
            contentContainerStyle={styles.scrollContent}>
            <Animated.View
              style={[
                styles.profileCard,
                {
                  opacity: fadeAnim,
                  transform: [{translateY: slideAnim}],
                },
              ]}>
              <View style={styles.profileHeader}>
                <View style={styles.logoContainer}>
                  <Image source={logo} style={styles.logo} />
                </View>
                <View style={styles.profileInfo}>
                  <Text style={styles.name}>
                    {items?.customerData[0]?.firstname}{' '}
                    {items?.customerData[0]?.lastname}
                  </Text>
                  <View style={styles.categoryBadge}>
                    <Icon name="tag" size={12} color={Colors.primary} />
                    <Text style={styles.categoryText}>
                      {items?.customerData[0]?.category}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.contactSection}>
                {items?.customerData[0]?.cellphonenumber && (
                  <View style={styles.contactRow}>
                    <View style={styles.iconCircle}>
                      <Icon name="phone" size={14} color={Colors.primary} />
                    </View>
                    <Text style={styles.contactText}>
                      {items?.customerData[0]?.cellphonenumber}
                    </Text>
                  </View>
                )}
                <View style={styles.contactRow}>
                  <View style={styles.iconCircle}>
                    <Icon name="map-marker" size={14} color={Colors.primary} />
                  </View>
                  <Text style={styles.contactText}>
                    {items?.customerData[0]?.address}
                  </Text>
                </View>
                <View style={styles.contactRow}>
                  <View style={styles.iconCircle}>
                    <Icon name="institution" size={12} color={Colors.primary} />
                  </View>
                  <Text style={styles.contactText}>
                    Ward: {items?.outstandingData[0]?.ward}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={handlePaymentHistory}
                style={styles.paymentButton}>
                <Icon name="history" size={16} color={Colors.white} />
                <Text style={styles.paymentButtonText}>Payment History</Text>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View
              style={[
                styles.sectionCard,
                {
                  opacity: fadeAnim,
                  transform: [{translateY: slideAnim}],
                },
              ]}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIconBadge}>
                  <Icon name="money" size={16} color={Colors.white} />
                </View>
                <Text style={styles.sectionTitle}>Outstanding Amount</Text>
              </View>

              {items?.outstandingData.length > 0 ? (
                items?.outstandingData.map((item, index) => (
                  <View style={styles.dataCard} key={'Outstanding_' + index}>
                    <View style={styles.cardIndexBadge}>
                      <Text style={styles.cardIndexText}>#{index + 1}</Text>
                    </View>
                    <View style={styles.dataGrid}>
                      <InfoRow
                        icon="calendar"
                        label={'30 days'}
                        text={formattedAmount(
                          parseFloat(item?.days30Amount),
                          'en-ZA',
                          'ZAR',
                          'currency',
                        )}
                      />
                      <InfoRow
                        icon="calendar"
                        label={'60 days'}
                        text={formattedAmount(
                          parseFloat(item?.days60Amount),
                          'en-ZA',
                          'ZAR',
                          'currency',
                        )}
                      />
                      <InfoRow
                        icon="calendar"
                        label={'90 days'}
                        text={formattedAmount(
                          parseFloat(item?.days90Amount),
                          'en-ZA',
                          'ZAR',
                          'currency',
                        )}
                      />
                      <InfoRow
                        icon="calendar"
                        label={'120+ days'}
                        text={formattedAmount(
                          parseFloat(item?.days120plusAmount),
                          'en-ZA',
                          'ZAR',
                          'currency',
                        )}
                      />
                      <InfoRow
                        icon="file-text"
                        label={'Levy Amount'}
                        text={formattedAmount(
                          parseFloat(item?.levyAmount ? item?.levyAmount : 0.0),
                          'en-ZA',
                          'ZAR',
                          'currency',
                        )}
                      />
                      <InfoRow
                        icon="calculator"
                        label={'Total'}
                        text={formattedAmount(
                          parseFloat(item?.totalAmount),
                          'en-ZA',
                          'ZAR',
                          'currency',
                        )}
                        type="outstanding total"
                      />
                    </View>
                  </View>
                ))
              ) : (
                <View style={styles.noDataContainer}>
                  <Icon
                    name="exclamation-circle"
                    size={40}
                    color={Colors.red}
                  />
                  <Text style={styles.noDataText}>
                    Outstanding data not found for account: {searchKey}
                  </Text>
                </View>
              )}
            </Animated.View>
            <Animated.View
              style={[
                styles.sectionCard,
                {
                  opacity: fadeAnim,
                  transform: [{translateY: slideAnim}],
                },
              ]}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIconBadge}>
                  <Icon name="tachometer" size={16} color={Colors.white} />
                </View>
                <Text style={styles.sectionTitle}>Meters</Text>
              </View>

              {items?.meterData.length > 0 ? (
                items?.meterData.map((item, index) => (
                  <View style={styles.dataCard} key={'Meter_' + index}>
                    <View style={styles.cardIndexBadge}>
                      <Text style={styles.cardIndexText}>#{index + 1}</Text>
                    </View>
                    <View style={styles.dataGrid}>
                      <InfoRow
                        icon="barcode"
                        label={'Meter No'}
                        text={item?.meteR_NO}
                      />
                      <InfoRow
                        icon="info-circle"
                        label={'Status'}
                        text={item?.poD_STATUS}
                      />
                      <InfoRow
                        icon="map-marker"
                        label={'Address'}
                        text={item?.address}
                      />
                      <InfoRow
                        icon="dashboard"
                        label={'Previous Reading'}
                        text={item?.previouS_READING}
                      />
                      <InfoRow
                        icon="calendar"
                        label={'Reading Date'}
                        text={item?.readinG_TAKEN_DATE?.split(' ')[0]}
                      />
                    </View>
                  </View>
                ))
              ) : (
                <View style={styles.noDataContainer}>
                  <Icon
                    name="exclamation-circle"
                    size={40}
                    color={Colors.red}
                  />
                  <Text style={styles.noDataText}>
                    Meter data not found for account: {searchKey}
                  </Text>
                </View>
              )}
            </Animated.View>
            <Animated.View
              style={[
                styles.sectionCard,
                {
                  opacity: fadeAnim,
                  transform: [{translateY: slideAnim}],
                },
              ]}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIconBadge}>
                  <Icon name="building" size={16} color={Colors.white} />
                </View>
                <Text style={styles.sectionTitle}>Properties</Text>
              </View>

              {items?.propertyData.length > 0 ? (
                items?.propertyData.map((item, index) => (
                  <View style={styles.dataCard} key={'Property_' + index}>
                    <View style={styles.cardIndexBadge}>
                      <Text style={styles.cardIndexText}>#{index + 1}</Text>
                    </View>
                    <View style={styles.dataGrid}>
                      <InfoRow
                        icon="user"
                        label={'Name'}
                        text={item?.accountname}
                      />
                      <InfoRow
                        icon="phone"
                        label={'Cell No'}
                        text={
                          item?.cellphonenumber ? item?.cellphonenumber : 'N/A'
                        }
                      />
                      <InfoRow
                        icon="map-marker"
                        label={'Address'}
                        text={item?.addressdetails}
                      />
                      <InfoRow
                        icon="location-arrow"
                        label={'Latitude'}
                        text={item?.locationlatitude}
                      />
                      <InfoRow
                        icon="location-arrow"
                        label={'Longitude'}
                        text={item?.locationlongitude}
                      />
                    </View>
                  </View>
                ))
              ) : (
                <View style={styles.noDataContainer}>
                  <Icon
                    name="exclamation-circle"
                    size={40}
                    color={Colors.red}
                  />
                  <Text style={styles.noDataText}>
                    Property data not found for account: {searchKey}
                  </Text>
                </View>
              )}
            </Animated.View>

            <Animated.View
              style={[
                styles.sectionCard,
                {
                  opacity: fadeAnim,
                  transform: [{translateY: slideAnim}],
                },
              ]}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIconBadge}>
                  <Icon name="file-text" size={16} color={Colors.white} />
                </View>
                <Text style={styles.sectionTitle}>Interims</Text>
              </View>

              {items?.interimsData.length > 0 ? (
                items?.interimsData.map((item, index) => (
                  <View style={styles.dataCard} key={'Interims_' + index}>
                    <View style={styles.cardIndexBadge}>
                      <Text style={styles.cardIndexText}>#{index + 1}</Text>
                    </View>
                    <View style={styles.dataGrid}>
                      <InfoRow
                        icon="barcode"
                        label={'Meter No'}
                        text={item?.meterNumber}
                      />
                      <InfoRow
                        icon="user"
                        label={'Name'}
                        text={item?.debtorName}
                      />
                      <InfoRow
                        icon="cogs"
                        label={'Service'}
                        text={item?.serviceGroup}
                      />
                      <InfoRow
                        icon="info-circle"
                        label={'Reason'}
                        text={item?.interimsReason}
                      />
                      <InfoRow
                        icon="map-marker"
                        label={'Township'}
                        text={item?.township}
                      />
                      <InfoRow icon="bookmark" label={'CCA'} text={item?.cca} />
                      <InfoRow
                        icon="refresh"
                        label={'Cycle'}
                        text={item?.cycle}
                      />
                      <InfoRow
                        icon="globe"
                        label={'Zone'}
                        text={item?.zoning}
                      />
                      <InfoRow
                        icon="phone"
                        label={'Cell No'}
                        text={item?.cellNo ? item?.cellNo : 'N/A'}
                      />
                    </View>
                  </View>
                ))
              ) : (
                <View style={styles.noDataContainer}>
                  <Icon
                    name="exclamation-circle"
                    size={40}
                    color={Colors.red}
                  />
                  <Text style={styles.noDataText}>
                    Interims data not found for account: {searchKey}
                  </Text>
                </View>
              )}
            </Animated.View>
            <Animated.View
              style={[
                styles.sectionCard,
                {
                  opacity: fadeAnim,
                  transform: [{translateY: slideAnim}],
                },
              ]}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIconBadge}>
                  <Icon name="hand-paper-o" size={16} color={Colors.white} />
                </View>
                <Text style={styles.sectionTitle}>Indigent</Text>
              </View>

              {items?.indigentData.length > 0 ? (
                items?.indigentData.map((item, index) => (
                  <View style={styles.dataCard} key={'Indigent_' + index}>
                    <View style={styles.cardIndexBadge}>
                      <Text style={styles.cardIndexText}>#{index + 1}</Text>
                    </View>
                    <View style={styles.dataGrid}>
                      <InfoRow
                        icon="credit-card"
                        label={'Account'}
                        text={item?.account}
                      />
                      <InfoRow icon="user" label={'Name'} text={item?.name} />
                      <InfoRow
                        icon="map-marker"
                        label={'Address'}
                        text={item?.address}
                      />
                      <InfoRow
                        icon="heart"
                        label={'Marital'}
                        text={item?.maritalStatus}
                      />
                      <InfoRow
                        icon="briefcase"
                        label={'Source Of Income'}
                        text={item?.sourceOfIncome}
                      />
                      <InfoRow
                        icon="money"
                        label={'Household Income'}
                        text={formattedAmount(
                          parseFloat(item?.householdIncome ?? 0),
                          'en-ZA',
                          'ZAR',
                          'currency',
                        )}
                      />
                      <InfoRow
                        icon="home"
                        label={'No Of Properties'}
                        text={item?.numberOfProperties}
                      />
                      <InfoRow
                        icon="dollar"
                        label={'Property Value'}
                        text={formattedAmount(
                          parseFloat(item?.propertyValue ?? 0),
                          'en-ZA',
                          'ZAR',
                          'currency',
                        )}
                      />
                      <InfoRow
                        icon="phone"
                        label={'Cell No'}
                        text={item?.cell ? item?.cell : 'N/A'}
                      />
                    </View>
                  </View>
                ))
              ) : (
                <View style={styles.noDataContainer}>
                  <Icon
                    name="exclamation-circle"
                    size={40}
                    color={Colors.red}
                  />
                  <Text style={styles.noDataText}>
                    Indigent data not found for account: {searchKey}
                  </Text>
                </View>
              )}
            </Animated.View>
          </ScrollView>
        ) : (
          <CustomAlert
            isVisible={isAlertErrorVisible}
            onClose={closeAlert1}
            message={`You entered account number is  "${searchKey}" doesn't exists${
              loggedUser?.warD_NO != 0
                ? ' under ward no:' + loggedUser?.warD_NO + '.'
                : '.'
            }`}
            message1={'Please enter correct account number!'}
            imageSource={logo} // Replace with your image URL or local image source
          />
        )
      ) : (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{color: Colors.blue, fontSize: 16}}>
            Please search with account number
          </Text>
        </View>
      )}
    </View>
  );
};

const InfoRow = ({icon, text, label, type}) => (
  <View style={styles.infoRow}>
    <View style={styles.infoLabelContainer}>
      <View style={styles.infoIconCircle}>
        <Icon name={icon} size={12} color={Colors.primary} />
      </View>
      <Text style={styles.infoLabel}>{label}</Text>
    </View>
    <Text
      style={[
        styles.infoValue,
        type === 'outstanding total' && styles.totalValue,
      ]}
      numberOfLines={2}>
      {text}
    </Text>
  </View>
);

const SocialMediaIcon = ({name, handle}) => (
  <TouchableOpacity style={styles.socialMediaIcon}>
    <Icon name={name} size={20} style={styles.socialIcon} />
    <Text style={styles.socialText}>@{handle}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  scrollContent: {
    paddingTop: 100,
    paddingBottom: 20,
  },

  // Profile Card Styles
  profileCard: {
    backgroundColor: Colors.white,
    margin: 12,
    marginTop: 0,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#1E40AF',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    borderLeftWidth: 5,
    borderLeftColor: Colors.yellow,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowColor: Colors.primary,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    overflow: 'hidden',
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    resizeMode: 'cover',
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E3A8A',
    marginBottom: 6,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
    marginLeft: 6,
  },
  contactSection: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  contactText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
    flex: 1,
  },
  paymentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: Colors.primary,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  paymentButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 8,
  },

  // Section Card Styles
  sectionCard: {
    backgroundColor: Colors.white,
    margin: 12,
    marginTop: 0,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#1E40AF',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#F1F5F9',
  },
  sectionIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: Colors.primary,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E3A8A',
    letterSpacing: 0.3,
  },

  // Data Card Styles
  dataCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.yellow,
  },
  cardIndexBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 12,
  },
  cardIndexText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  dataGrid: {
    gap: 6,
  },

  // Info Row Styles
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: Colors.white,
    padding: 10,
    borderRadius: 8,
    marginVertical: 2,
  },
  infoLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  infoIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    flex: 1,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'right',
    flex: 1,
  },
  totalValue: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.primary,
  },

  // No Data Styles
  noDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  noDataText: {
    color: Colors.red,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 20,
  },

  // Deprecated styles kept for compatibility
  bio: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
  },
});

const styles1 = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    elevation: 8,
    shadowColor: '#1E40AF',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    zIndex: 100,
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    paddingLeft: 16,
    paddingRight: 12,
    height: 56,
    shadowColor: '#64748B',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    height: 56,
    backgroundColor: 'transparent',
    fontSize: 15,
    fontWeight: '600',
  },
  textInputContent: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    height: 56,
    justifyContent: 'center',
  },
  searchButton: {
    backgroundColor: Colors.primary,
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});

export default Customer360Screen;
