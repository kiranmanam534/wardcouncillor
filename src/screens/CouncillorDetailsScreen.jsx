import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  FlatList,
  Text,
  TouchableOpacity,
  Animated,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';

import Icon from 'react-native-vector-icons/dist/FontAwesome';

import CardItem from '../components/CardItem';
import {GetCouncillorWardDetailsIfoByWardNo} from '../services/councillorWardApi';

import {GetwardHeaderTownshipTitle} from '../utility/Commom';
import {WardMemberSliceActions} from '../redux/councillorWardTownshipMemberSlice';
import {councillorWardsActions} from '../redux/councillorWardsSlice';
import ErrorModal from '../components/ErrorModal';
import {Colors} from '../constant/Colors';
import CardItemLoading from '../components/CardItemLoading';
import ShowMessageCenter from '../components/ShowMessageCenter';
import {getSelectedWardNoByType} from '../utility/getWardNoByType';

const CouncillorDetailsScreen = ({route}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {wardType} = route.params;
  console.log(wardType);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // const [OustandingItem, setOustandingItem] = useState([])
  const loggedUser = useSelector(state => state.loginReducer.items);
  const {items, isLoading, error, statusCode} = useSelector(
    state => state.WardOustandingReducer,
  );

  const {wardNo: mayorSelectedWardNo} = useSelector(
    state => state.MayorSelectedWardReducer,
  );

  console.log('mayorSelectedWardNo', mayorSelectedWardNo);

  // useEffect(()=>{
  //   setOustandingItem(items)
  // },[isLoading,items])

  const showOutstandingCharts = () => {
    // Alert.alert('showOutstandingCharts')
    // console.log('====================================');
    // console.log(OustandingItem);
    // console.log('====================================');
    navigation.navigate('OustandingCharts', {title: 'Outstanding Charts'});
  };
  React.useLayoutEffect(() => {
    if (['Outstanding', 'OutstandingCategory'].includes(wardType)) {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity
            onPress={showOutstandingCharts}
            style={styles.searchButton}>
            {/* <Text style={styles.searchButtonText}>Search</Text> */}
            <Icon name="pie-chart" size={25} color={Colors.white} />
          </TouchableOpacity>
        ),
      });
    }
  }, [navigation]);

  useEffect(() => {
    // getSelectedWardNoByType(wardType,loggedUser?.warD_NO,maylorSelectedWardNo)
    dispatch(councillorWardsActions.clearWards());
    setTimeout(() => {
      dispatch(
        GetCouncillorWardDetailsIfoByWardNo({
          wardNo: mayorSelectedWardNo
            ? mayorSelectedWardNo
            : loggedUser?.warD_NO,
          wardType: wardType,
        }),
      );
    }, 100);
  }, [loggedUser?.warD_NO, wardType, mayorSelectedWardNo]);

  const navigateToDetail = (wardType, name) => {
    if (wardType === 'Property' || wardType === 'Customer') {
      dispatch(WardMemberSliceActions.clearWardMemberData());
      navigation.navigate('CouncillorView', {
        title:
          `${mayorSelectedWardNo || loggedUser?.warD_NO} - ` +
          GetwardHeaderTownshipTitle(wardType, name),
        wardType: wardType,
        name: name,
        township: '',
      });
    } else {
      navigation.navigate('CouncillorDetail', {
        title:
          `${mayorSelectedWardNo || loggedUser?.warD_NO} - ` +
          GetwardHeaderTownshipTitle(wardType, name),
        wardType: wardType,
        name: name,
      });
    }
  };

  useEffect(() => {
    if (!isLoading && error) {
      setShowErrorModal(true);
    }

    // Animate header when data loads
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
  }, [error, isLoading, items]);
  const closeModal = () => {
    setShowErrorModal(false);
  };

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

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <FlatList
            data={[1, 1, 1, 1, 1, 1, 1, 1]}
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
                  <Icon name="database" size={18} color={Colors.white} />
                </View>
                <Text style={styles.headerTitle}>Data Overview</Text>
              </View>

              <View style={styles.statsContainer}>
                <View style={styles.statBox}>
                  <View style={styles.statIconCircle}>
                    <Icon name="list-ul" size={14} color={Colors.primary} />
                  </View>
                  <View style={styles.statContent}>
                    <Text style={styles.statLabel}>Total Items</Text>
                    <Text style={styles.statValue}>{items?.length || 0}</Text>
                  </View>
                </View>

                <View style={styles.statDivider} />

                <View style={styles.statBox}>
                  <View style={styles.statIconCircle}>
                    <Icon name="map-marker" size={14} color={Colors.yellow} />
                  </View>
                  <View style={styles.statContent}>
                    <Text style={styles.statLabel}>Ward Number</Text>
                    <Text style={styles.statValue}>
                      {mayorSelectedWardNo || loggedUser?.warD_NO}
                    </Text>
                  </View>
                </View>
              </View>
            </Animated.View>
          )}

          <FlatList
            data={items || []}
            renderItem={({item, index}) => (
              <View
                style={{
                  opacity: 0,
                  transform: [{translateY: 20}],
                }}
                onLayout={e => {
                  e.target.setNativeProps({
                    style: {
                      opacity: 1,
                      transform: [{translateY: 0}],
                    },
                  });
                }}>
                <CardItem
                  key={item.name}
                  title={item.name}
                  isTownship={false}
                  wardType={wardType}
                  value={parseFloat(item.value)}
                  isAmount={['Outstanding', 'OutstandingCategory'].includes(
                    wardType,
                  )}
                  onPress={() => {
                    navigateToDetail(wardType, item.name);
                  }}
                />
              </View>
            )}
            keyExtractor={item => item.name}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        </>
      )}
    </View>
  );
};

export default CouncillorDetailsScreen;

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
    paddingTop: 4,
    paddingBottom: 100,
  },
});
