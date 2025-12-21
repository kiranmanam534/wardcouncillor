import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Text,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';

import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome';

import CardItem from '../components/CardItem';
import {GetCouncillorWardTownshipIfoByWardNo} from '../services/councillorWardApi';
import LoaderModal from '../components/LoaderModal';
import {GetwardHeaderTownshipTitle} from '../utility/Commom';
import {WardMemberSliceActions} from '../redux/councillorWardTownshipMemberSlice';
import BottomSearchBox from '../components/BottomSearchBox';
import {Colors} from '../constant/Colors';
import ShowMessageCenter from '../components/ShowMessageCenter';
import CardItemLoading from '../components/CardItemLoading';

const CouncillorDetailScreen = ({route}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {title: parentTitle, wardType, name} = route.params;

  const [searchText, setSearchText] = useState('');
  const [showSearchBox, setShowSearchBox] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const loggedUser = useSelector(state => state.loginReducer.items);
  const {items, isLoading, error, statusCode} = useSelector(
    state => state.councillorWardTownshipReducer,
  );

  const {wardNo: mayorSelectedWardNo} = useSelector(
    state => state.MayorSelectedWardReducer,
  );

  console.log('CouncillorDetailScreen=>', items);

  useEffect(() => {
    dispatch(
      GetCouncillorWardTownshipIfoByWardNo({
        wardNo: mayorSelectedWardNo || loggedUser?.warD_NO,
        wardType: wardType,
        name: name,
        search: '',
      }),
    );
  }, [loggedUser?.warD_NO, wardType, name, mayorSelectedWardNo]);

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

  console.log('items', items);

  // Calculate total value from all townships
  const getTotalValue = () => {
    if (!items || items.length === 0) return 0;
    return items.reduce((sum, item) => {
      const value = parseFloat(item.value);
      return sum + (isNaN(value) ? 0 : value);
    }, 0);
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
    } else if (absValue >= 1000000) {
      return sign + (absValue / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    } else if (absValue >= 100000) {
      return sign + (absValue / 100000).toFixed(1).replace(/\.0$/, '') + 'L';
    } else if (absValue >= 1000) {
      return sign + (absValue / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return parsed.toFixed(0);
  };

  const navigateToDetail = (title, township) => {
    dispatch(WardMemberSliceActions.clearWardMemberData());
    navigation.navigate('CouncillorView', {
      title: `${mayorSelectedWardNo || loggedUser?.warD_NO} - ` + title,
      wardType: wardType,
      name: name,
      township: township,
    });
  };

  const handleBottomSearchBox = value => {
    setSearchText(value);
  };

  const handleSearch = () => {
    // Implement search functionality here
    console.log('Searching for:', searchText);
    dispatch(
      GetCouncillorWardTownshipIfoByWardNo({
        wardNo: mayorSelectedWardNo || loggedUser?.warD_NO,
        wardType: wardType,
        name: name,
        search: searchText,
      }),
    );
    // setSearchText(searchText)
  };

  const toggleSearchBox = () => {
    // console.log(showSearchBox)
    setShowSearchBox(!showSearchBox);
    // if (!showSearchBox) {
    //   handleSearch();
    // }
  };

  // useEffect(() => {
  //   if (items.length > 0) {
  //     setShowSearchBox(false);
  //   }
  // }, [items.length]);

  // if (isLoading) {
  //   return <LoaderModal visible={isLoading} loadingText="Loading..." />;
  // }

  return (
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

      {statusCode && statusCode === 200 && (!items || items.length === 0) && (
        <ShowMessageCenter message={'No data found!'} />
      )}

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={100}>
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
              <>
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
                      <Icon name="map-marker" size={18} color={Colors.white} />
                    </View>
                    <Text style={styles.headerTitle}>Township Overview</Text>
                  </View>

                  <View style={styles.statsContainer}>
                    <View style={styles.statBox}>
                      <View style={styles.statIconCircle}>
                        <Icon name="map" size={14} color={Colors.primary} />
                      </View>
                      <View style={styles.statContent}>
                        <Text style={styles.statLabel}>Total Townships</Text>
                        <Text style={styles.statValue}>{items.length}</Text>
                      </View>
                    </View>

                    <View style={styles.statDivider} />

                    <View style={styles.statBox}>
                      <View style={styles.statIconCircle}>
                        <Icon name="map-pin" size={14} color={Colors.primary} />
                      </View>
                      <View style={styles.statContent}>
                        <Text style={styles.statLabel}>Ward Number</Text>
                        <Text style={styles.statValue}>
                          {mayorSelectedWardNo || loggedUser?.warD_NO || 'N/A'}
                        </Text>
                      </View>
                    </View>
                  </View>
                </Animated.View>

                <FlatList
                  data={items}
                  renderItem={({item}) => (
                    <CardItem
                      key={item.name}
                      title={item.name}
                      value={parseFloat(item.value)}
                      wardType={wardType}
                      isTownship={true}
                      isAmount={['Outstanding', 'OutstandingCategory'].includes(
                        wardType,
                      )}
                      onPress={() => {
                        navigateToDetail(item.name, item.name);
                      }}
                    />
                  )}
                  keyExtractor={(item, index) => index.toString()}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.listContent}
                />
              </>
            )}
          </>
        )}

        <BottomSearchBox
          onChangeText={handleBottomSearchBox}
          onPress={handleSearch}
          value={searchText}
          // setSearchText={setSearchText}
          placeholder={'search by name...'}
          isLoading={isLoading}
        />
      </KeyboardAvoidingView>
      {/* )} */}
    </View>
  );
};

export default CouncillorDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  keyboardView: {
    flex: 1,
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
    fontSize: 15,
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
    fontSize: 10,
    fontWeight: '600',
    color: '#94A3B8',
    marginBottom: 3,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 15,
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
    paddingTop: 16,
    paddingBottom: 100,
  },
  toggleButton: {
    position: 'absolute',
    bottom: 100,
    right: 30,
    backgroundColor: Colors.red,
    borderRadius: 25,
    padding: 10,
    elevation: 10,
  },
});
