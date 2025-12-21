import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  Linking,
  Alert,
  Button,
  FlatList,
  ActivityIndicator,
  Pressable,
  Image,
  Platform,
  KeyboardAvoidingView,
  Animated,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import LoaderModal from '../components/LoaderModal';
import {
  GetCouncillorWardTownshipMemberInfo,
  getMeterImageApi,
} from '../services/councillorWardApi';
import TownshipCard from '../components/TownshipCard';
import {smsApi} from '../services/smsApi';
import {formattedAmount, formattedCurrency} from '../utility/FormattedAmmount';
import ErrorModal from '../components/ErrorModal';
import Toast from 'react-native-toast-message';
import {Colors} from '../constant/Colors';
import {smdSliceActions} from '../redux/smsSlice';
import BottomSearchBox from '../components/BottomSearchBox';
import CardItemTest from '../Test1';
import ShowMessageCenter from '../components/ShowMessageCenter';
import CardItemLoading from '../components/CardItemLoading';
import {WardMemberSliceActions} from '../redux/councillorWardTownshipMemberSlice';
import BinaryImageModal from '../components/BinaryImageModal';
import {MeterImageActions} from '../redux/MeterImageSlice';
import ShowMapModal from '../components/ShowMapModal';
import TestMapView from '../../TestMapView';

const CouncilloriViewScreen = ({route}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [page, setPage] = useState(1);

  const [searchText, setSearchText] = useState('');
  const [showSearchBox, setShowSearchBox] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState(null);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(30)).current;

  const {title, wardType, name, township} = route.params;
  console.log(wardType, name, township);

  const {
    isLoading: isSMSLoading,
    isSMSsent,
    message: smsMessage,
    error: smsError,
    statusCode,
  } = useSelector(state => state.smsReducer);

  const {wardNo: mayorSelectedWardNo} = useSelector(
    state => state.MayorSelectedWardReducer,
  );

  const [showErrorModal, setShowErrorModal] = useState(false);

  const {
    items,
    isLoading,
    error,
    wardmembersCount,
    message: memberMessage,
    statusCode: memberStatusCode,
  } = useSelector(state => state.councillorWardTownshipMemberReducer);

  const loggedUser = useSelector(state => state.loginReducer.items);

  const {
    isLoading: imageLoading,
    error: imageError,
    image: binaryImage,
    isSuccess: isImageLoaded,
  } = useSelector(state => state.MeterImageReducer);

  // console.log('isImageLoaded', isImageLoaded)
  // console.log("binaryImage", imageError)

  let searchPlaceholderText = 'search by account or name...';
  if (wardType == 'IMS') {
    searchPlaceholderText = 'search by incident number...';
  } else if (wardType == 'Meter') {
    searchPlaceholderText = 'search by account or name or meter...';
  }

  // useLayoutEffect(() => {
  //   if (Platform.OS == 'android') {
  //   navigation.setOptions({
  //     headerLargeTitle: true,
  //     headerSearchBarOptions: {
  //       placeholder: "Search"
  //     }
  //   });
  // }

  // }, [navigation])

  useEffect(() => {
    dispatch(
      GetCouncillorWardTownshipMemberInfo({
        wardNo: mayorSelectedWardNo ? mayorSelectedWardNo : loggedUser?.warD_NO,
        wardType: wardType,
        name: name,
        search: '',
        township: township,
        page: page,
        limit: 10,
      }),
    );
  }, [
    loggedUser?.warD_NO,
    wardType,
    name,
    township,
    page,
    mayorSelectedWardNo,
  ]);

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

  const handleLoadMore = () => {
    if (wardmembersCount != 0 && wardmembersCount == 10) setPage(page + 1);
  };

  // console.log('isSMSLoading', isSMSLoading);
  // console.log('smsMessage', smsMessage);
  // console.log('wardmembersCount', wardmembersCount);

  const handlePress = phoneNumber => {
    if (phoneNumber != 'Not Available') Linking.openURL(`tel:${phoneNumber}`);
  };

  // const closeModal = () => {
  //   setShowErrorModal(false);
  // };

  const ShowAlert = (type, mess) => {
    Alert.alert(
      type,
      mess,
      [
        {
          text: 'OK',
          onPress: () => {
            console.log('OK Pressed');
          },
        },
      ],
      {cancelable: false},
    );
  };

  const handleSMS = item => {
    console.log(wardType + ' ==> ', item);
    if (['Outstanding', 'OutstandingCategory'].includes(wardType)) {
      if (item.cellphonenumber && item.cellphonenumber != 'Not Available') {
        let days_label = '';
        if (name === 'D30_DAYS') days_label = '30 days amount';
        if (name === 'D60_DAYS') days_label = '60 days amount';
        if (name === 'D90_DAYS') days_label = '90 days amount';
        if (name === 'D120_PLUS') days_label = '120+ days amount';
        let message = `Good day *${item.customeR_NAME.trim()}*, Reminder of your outstanding debt on your CoE utility bill. 
Outstanding *${days_label}: R${formattedCurrency(
          parseFloat(item.daysAmount),
          'en-ZA',
          'ZAR',
          'currency',
        )}* and Total Outstanding amount: *R${formattedCurrency(
          parseFloat(item.totalAmount),
          'en-ZA',
          'ZAR',
          'currency',
        )}*. 
Make payment immediately or visit your nearest CoE Customer Care Centre. 
Regards *City of Ekurhuleni.*`;

        // let message = `Hi ${item.customeR_NAME.trim()}, Your outstanding ${days_label} is R${formattedCurrency(
        //   parseFloat(item.daysAmount),
        //   'en-ZA',
        //   'ZAR',
        //   'currency',
        // )} and Your outstanding total amount is R${formattedCurrency(
        //   parseFloat(item.totalAmount),
        //   'en-ZA',
        //   'ZAR',
        //   'currency',
        // )}`;
        console.log(message);
        const requestBody = {
          recipientNumber: item.cellphonenumber, //'0739007893', //'0722409624', //'0792360234', //'0739007893',//item.cellphonenumber,
          message: message.toString(),
          // campaign: 'Outstanding Amount',
        };
        dispatch(smsApi({requestBody: requestBody}));
        setSelectedImageId(item.accounT_NO);
      } else {
        ShowAlert('Warning!', 'Mobile number should not be empty!');
      }
    } else {
      if (item.cellNo && item.cellNo != 'Not Available') {
        let message = `Good day *${item.debtorName.trim()}*, Your meter number ${
          item.meterNumber
        } is on interims. To get billed correctly, please submit your latest reading via Whatsapp on *0606677177* or to make arrangements for a meter reader to take the reading, email *mrsappsupport@ekurhuleni.gov.za* regards City of Ekurhuleni`;
        // let message = `Hi ${item.debtorName.trim()}, your meter number ${
        //   item.meterNumber
        // } is on interim, please submit your latest readings via whatsapp.`;
        // let message = `Hi ${item.debtorName.trim()}, Your Interims Meter No : ${item.meterNumber} is  for ${item.accountNumber}`;
        const requestBody = {
          recipientNumber: item.cellNo, //'0739007893', //'0722409624', //'0792360234', //'0739007893',//item.cellphonenumber,//'0739007893',//item.cellphonenumber
          message: message.toString(),
          // campaign: 'Interims',
        };
        console.log(requestBody);
        dispatch(smsApi({requestBody: requestBody}));
        setSelectedImageId(item.accountNumber);
      } else {
        ShowAlert('Warning!', 'Mobile number should not be empty!');
      }
    }

    // setShowErrorModal(true);
  };

  const openMeterImage = meterId => {
    console.log(meterId);

    dispatch(getMeterImageApi(meterId));

    setShowImage(true);
    setSelectedImageId(meterId);
  };

  const openPropertyMap = item => {
    console.log(item);
    // setShowMap(true)
    navigation.navigate('ShowPropertyMap', {
      title: `Property Location`,
      lat: item.locationlatitude,
      long: item.locationlongitude,
      propertyName: item.accountname,
      propertyAccount: item.accountnumber,
      // township: township,
    });
  };

  const showToast = (text1, text2, type, color) => {
    Toast.show({
      type: type,
      position: 'bottom',
      text1: text1,
      text2: text2,
      visibilityTime: 3000,
      text1Style: {color: color, fontSize: 15},
      text2Style: {color: Colors.blue, fontSize: 13},
    });
    dispatch(smdSliceActions.smsClear());
    setSelectedImageId(null);
  };

  const handleBottomSearchBox = value => {
    setSearchText(value);
  };

  const handleSearch = () => {
    // Implement search functionality here
    dispatch(WardMemberSliceActions.clearWardMemberData());
    console.log('Searching for:', searchText);
    dispatch(
      GetCouncillorWardTownshipMemberInfo({
        wardNo: mayorSelectedWardNo || loggedUser?.warD_NO,
        wardType: wardType,
        name: name,
        search: searchText,
        township: township,
        page: page,
        limit: 10,
      }),
    );
  };

  const toggleSearchBox = () => {
    // console.log(showSearchBox)
    setShowSearchBox(!showSearchBox);
    // if (!showSearchBox) {
    //   handleSearch();
    // }
  };

  const closeModal = () => {
    dispatch(MeterImageActions.ClearImage());
  };
  useEffect(() => {
    if (!isSMSLoading && smsError) {
      showToast('Error', 'Something went wrong!', 'error', Colors.red);
    }
  }, [smsError, isSMSLoading]);

  useEffect(() => {
    if (!isSMSLoading && smsMessage) {
      showToast('Success', smsMessage, 'success', Colors.primary);
    }
  }, [smsMessage, isSMSLoading]);

  const renderFooter = () => {
    if (!isLoading) {
      return null;
    }
    // return <LoaderModal visible={isLoading} loadingText="Loading..." />;
    return (
      <FlatList
        data={[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]}
        renderItem={({item}) => <CardItemTest />}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  };

  return (
    <View style={styles.container}>
      {memberStatusCode && memberStatusCode !== 200 && (
        <ShowMessageCenter
          message={
            error == 'No data found.'
              ? 'No data found.'
              : 'Something went wrong!'
          }
        />
      )}

      {memberStatusCode &&
        memberStatusCode === 200 &&
        memberMessage === 'Data Not found' &&
        (!items || items.length === 0) && (
          <ShowMessageCenter message={'No data found!'} />
        )}

      <ErrorModal
        visible={imageError && imageError != 200}
        ErrorModalText={'No image found!'}
        closeModal={closeModal}
        onPress={() => {
          closeModal();
        }}
      />

      {isImageLoaded && binaryImage && (
        <BinaryImageModal
          binaryImageData={binaryImage} // Binary image data to be decoded
          isBinary={true}
          visible={showImage} // Boolean to control the visibility of the modal
          onClose={() => setShowImage(false)} // Function to handle modal close
        />
      )}

      {/* {showMap &&
        <ShowMapModal
          lat={37.78825} // Binary image data to be decoded
          long={-122.4324}
          visible={showMap} // Boolean to control the visibility of the modal
          onClose={() => setShowMap(false)} // Function to handle modal close
        />} */}

      {/* <TestMapView/> */}
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
                    <Icon name="users" size={18} color={Colors.white} />
                  </View>
                  <Text style={styles.headerTitle}>Records Overview</Text>
                </View>

                <View style={styles.statsContainer}>
                  <View style={styles.statBox}>
                    <View style={styles.statIconCircle}>
                      <Icon name="database" size={14} color={Colors.primary} />
                    </View>
                    <View style={styles.statContent}>
                      <Text style={styles.statLabel}>Total Records</Text>
                      <Text style={styles.statValue}>{items?.length || 0}</Text>
                    </View>
                  </View>

                  <View style={styles.statDivider} />

                  <View style={styles.statBox}>
                    <View style={styles.statIconCircle}>
                      <Icon
                        name="file-text-o"
                        size={14}
                        color={Colors.yellow}
                      />
                    </View>
                    <View style={styles.statContent}>
                      <Text style={styles.statLabel}>Page Number</Text>
                      <Text style={styles.statValue}>{page}</Text>
                    </View>
                  </View>
                </View>
              </Animated.View>
            )}

            {items && items.length > 0 && (
              <FlatList
                data={items}
                renderItem={({item}) => (
                  <TownshipCard
                    // key={index}
                    wardType={wardType}
                    item={item}
                    name={name}
                    onPress={() => {
                      handlePress(item.cellphonenumber);
                    }}
                    showImage={() => {
                      openMeterImage(item?.id);
                    }}
                    showMap={() => {
                      openPropertyMap(item);
                    }}
                    imageLoading={imageLoading}
                    ImageId={selectedImageId}
                    sendSMS={() => {
                      handleSMS(item);
                    }}
                  />
                )}
                keyExtractor={(item, index) => index.toString()}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={renderFooter}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
              />
            )}
          </>
        )}

        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Toast position="bottom" bottomOffset={20} />
        </View>

        {/* <Pressable style={styles.toggleButton} onPress={toggleSearchBox}>
        <Ionicons
          name={showSearchBox ? 'close' : 'search'}
          size={30}
          color={Colors.white}
        />
      </Pressable> */}
        {/* {showSearchBox && ( */}
        <BottomSearchBox
          onChangeText={handleBottomSearchBox}
          onPress={handleSearch}
          value={searchText}
          // setSearchText={setSearchText}
          placeholder={searchPlaceholderText}
          isLoading={isLoading}
        />
      </KeyboardAvoidingView>
      {/* )} */}
    </View>
  );
};

export default CouncilloriViewScreen;

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
