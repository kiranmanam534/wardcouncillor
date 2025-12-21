import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  FlatList,
  Text,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';

import CardItem from '../components/CardItem';
import BottomSearchBox from '../components/BottomSearchBox';
import {
  GetCouncillorWardDetailsIfoByAllWardsApi,
  GetCouncillorWardDetailsIfoByWardNo,
} from '../services/councillorWardApi';

import {GetwardHeaderTownshipTitle} from '../utility/Commom';
import {WardMemberSliceActions} from '../redux/councillorWardTownshipMemberSlice';
import {councillorWardsActions} from '../redux/councillorWardsSlice';
import ErrorModal from '../components/ErrorModal';
import {Colors} from '../constant/Colors';
import CardItemLoading from '../components/CardItemLoading';
import ShowMessageCenter from '../components/ShowMessageCenter';
import {councillorAllWardsActions} from '../redux/councillorAllWardsSlice';
import {MayorSelectedWardActions} from '../redux/MayorSelectedWardSlice';

const AllWardsOutstandingScreen = ({route}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {wardType} = route.params;
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const loggedUser = useSelector(state => state.loginReducer.items);
  const {items, isLoading, error, statusCode} = useSelector(
    state => state.CouncillorAllWardsReducer,
  );

  console.log(items, isLoading, error, statusCode);
  useEffect(() => {
    dispatch(councillorAllWardsActions.clearWards());
    setTimeout(() => {
      dispatch(GetCouncillorWardDetailsIfoByAllWardsApi());
    }, 100);
  }, [loggedUser?.warD_NO, wardType]);

  useEffect(() => {
    if (items && items.length > 0) {
      setFilteredItems(items);
    }
  }, [items]);

  useEffect(() => {
    if (!isLoading && items && items.length > 0) {
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
  }, [isLoading, items]);

  const navigateToDetail = (wardType, name) => {
    // handleDetailsNavigation(
    //     'CouncillorDetails',
    //     'Oustanding Debt',
    //     'Outstanding',
    //   );

    dispatch(MayorSelectedWardActions.selectedWardNo(name));
    navigation.navigate('CouncillorDetails', {
      title: `${name} - Outstanding Debt`,
      wardType: wardType,
      // maylorSelectedWardNo: name,
    });
  };

  useEffect(() => {
    if (!isLoading && error) {
      setShowErrorModal(true);
    }
  }, [error, isLoading]);
  const closeModal = () => {
    setShowErrorModal(false);
  };

  const formatNumber = value => {
    const parsed = parseFloat(value);
    if (isNaN(parsed)) return '0';

    const absValue = Math.abs(parsed);
    const sign = parsed < 0 ? '-' : '';

    if (absValue >= 1000000000) {
      return (
        sign + (absValue / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B'
      );
    }
    if (absValue >= 1000000) {
      return sign + (absValue / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (absValue >= 100000) {
      return sign + (absValue / 100000).toFixed(1).replace(/\.0$/, '') + 'L';
    }
    if (absValue >= 1000) {
      return sign + (absValue / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return sign + absValue.toString();
  };

  const getTotalValue = () => {
    if (!filteredItems || filteredItems.length === 0) return 0;
    return filteredItems.reduce((sum, item) => {
      const value = parseFloat(item.value);
      return sum + (isNaN(value) ? 0 : value);
    }, 0);
  };

  const handleSearch = () => {
    if (!searchText.trim()) {
      setFilteredItems(items);
      return;
    }

    const filtered = items.filter(item => {
      const wardNumber = item.name.toString().toLowerCase();
      const search = searchText.toLowerCase().trim();
      return wardNumber.includes(search);
    });

    setFilteredItems(filtered);
  };

  const handleSearchTextChange = value => {
    setSearchText(value);
    if (!value.trim()) {
      setFilteredItems(items);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}>
      <View style={styles.container}>
        {statusCode && statusCode !== 200 && (
          <ShowMessageCenter
            message={
              error == 'No data found.'
                ? 'No data found.'
                : 'Something went wrong!'
            }
          />
        )}

        {statusCode && statusCode === 200 && items.length == 0 && (
          <ShowMessageCenter message={'No data found!'} />
        )}

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <FlatList
              data={[1, 1, 1, 1, 1, 1, 1, 1, 1, 1]}
              renderItem={({item}) => <CardItemLoading />}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
            />
          </View>
        ) : (
          <>
            {items && items.length > 0 && (
              <Animated.View
                style={[
                  styles.headerInfo,
                  {
                    opacity: fadeAnim,
                    transform: [{translateY: slideAnim}],
                  },
                ]}>
                <View style={styles.headerTopRow}>
                  <View style={styles.headerIconBadge}>
                    <Icon name="map" size={18} color={Colors.white} />
                  </View>
                  <Text style={styles.headerTitle}>All Wards Overview</Text>
                </View>

                <View style={styles.statsContainer}>
                  <View style={styles.statBox}>
                    <View style={styles.statIconCircle}>
                      <Icon name="globe" size={14} color={Colors.primary} />
                    </View>
                    <View style={styles.statContent}>
                      <Text style={styles.statLabel}>Total Wards</Text>
                      <Text style={styles.statValue}>
                        {filteredItems?.length || 0}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.statDivider} />

                  <View style={styles.statBox}>
                    <View style={styles.statIconCircle}>
                      <Icon name="money" size={14} color={Colors.yellow} />
                    </View>
                    <View style={styles.statContent}>
                      <Text style={styles.statLabel}>Total Amount</Text>
                      <Text style={styles.statValue}>
                        {formatNumber(getTotalValue())}
                      </Text>
                    </View>
                  </View>
                </View>
              </Animated.View>
            )}

            <FlatList
              data={filteredItems}
              renderItem={({item}) => (
                <CardItem
                  key={item.name}
                  title={'Ward No: ' + item.name}
                  isTownship={false}
                  wardType={wardType}
                  value={parseFloat(item.value)}
                  isAmount={wardType == 'Outstanding'}
                  onPress={() => {
                    navigateToDetail(wardType, item.name);
                  }}
                />
              )}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
            />
          </>
        )}

        <BottomSearchBox
          onChangeText={handleSearchTextChange}
          onPress={handleSearch}
          value={searchText}
          placeholder="Search by ward number..."
          isLoading={isLoading}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default AllWardsOutstandingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  loadingContainer: {
    flex: 1,
  },
  headerInfo: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
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
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  headerIconBadge: {
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
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1E3A8A',
    letterSpacing: 0.3,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  statIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F9FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  statContent: {
    flex: 1,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
    marginBottom: 3,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 0.2,
  },
  statDivider: {
    width: 2,
    height: 40,
    backgroundColor: '#E2E8F0',
    borderRadius: 1,
  },
  listContent: {
    paddingHorizontal: 8,
    paddingTop: 4,
    paddingBottom: 100,
  },
});
