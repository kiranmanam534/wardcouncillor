import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Colors} from '../constant/Colors';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {IndegentDashboardList} from '../constant/MainDashboardList';
import BottomSearchBox from '../components/BottomSearchBox';
import {formattedAmount} from '../utility/FormattedAmmount';
import ShowMessageCenter from '../components/ShowMessageCenter';
import useIndegentConsumptiionsByWardNo from '../hooks/useIndegentConsumptiionsByWardNo copy';
import {clearAllErrorIndegentConsumptions} from '../redux/indegent/AllIndegentConsumptionSlice';
import CustomButton from '../components/CustomButton';
import {smsApi} from '../services/smsApi';
import {smdSliceActions} from '../redux/smsSlice';
import Toast from 'react-native-toast-message';

const IndegentConsumptionsScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [searchVisible, setSearchVisible] = useState(false);
  const [selectedCoontentID, setSelectedCoontentID] = useState(0);
  const [StartConsumption, setStartConsumption] = useState(0);
  const [EndConsumption, setEndConsumption] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [IsSubmitted, setIsSubmitted] = useState(null);
  const {warD_NO} = useSelector(state => state.loginReducer.items);
  const {loading, error, indegentConsumptions, LoadIndegentConsumptions} =
    useIndegentConsumptiionsByWardNo(
      warD_NO,
      searchText,
      'No All',
      StartConsumption,
      EndConsumption,
    );

  const {
    isLoading: isSMSLoading,
    isSMSsent,
    message: smsMessage,
    error: smsError,
    statusCode,
  } = useSelector(state => state.smsReducer);

  console.log('SMSLoading====>', isSMSLoading, smsMessage, smsError);
  const toggleSearchBar = () => {
    setSearchVisible(!searchVisible);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={toggleSearchBar}>
          {!searchVisible && (
            <Icon name="search" size={20} color={Colors.white} />
          )}
          {searchVisible && (
            <AntDesign name="closecircle" size={20} color={Colors.white} />
          )}
        </TouchableOpacity>
      ),
    });
  }, [navigation, searchVisible]);

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
    setIsSubmitted(null);
  };

  useEffect(() => {
    if (!isSMSLoading && smsError) {
      // showToast('Error', 'Something went wrong!', 'error', Colors.red);
      setIsSubmitted(null);
      dispatch(smdSliceActions.smsClear());
      ShowAlert('Error', 'Something went wrong!');
    }
  }, [smsError, isSMSLoading]);

  useEffect(() => {
    if (!isSMSLoading && smsMessage) {
      // ShowAlert('Warning!', 'Mobile number should not be empty!');
      // showToast('Success', smsMessage, 'success', Colors.primary);
      setIsSubmitted(null);
      dispatch(smdSliceActions.smsClear());
      ShowAlert('Success', smsMessage);
    }
  }, [smsMessage, isSMSLoading]);

  const handleSMS = item => {
    console.log(warD_NO + ' ==> ', item);

    if (item.cell && item.cell != 'Not Available') {
      setIsSubmitted(item.idNumber);
      let message = `Dear ${item.name} ${item.surname}

Your monthly consumption on ${item.meter_No} has exceed the limit of 180 Litres.
Please limit your consumption or your indigent status will be cancelled. 

Thanks
COE Team`;

      const requestBody = {
        //recipientNumber: item.cell, //'0739007893', //'0722409624', //'0792360234', //'0739007893'
        recipientNumber: '0739007893',
        message: message.toString(),
        // campaign: 'Interims',
      };
      console.log(requestBody);

      dispatch(smsApi({requestBody: requestBody}));
    } else {
      ShowAlert('Warning!', 'Mobile number should not be empty!');
    }

    // setShowErrorModal(true);
  };
  useEffect(() => {
    return navigation.addListener('focus', () => {
      // Refresh or reload screen
      SearchCollections();
    });
  }, [navigation]);

  console.log(loading, error, 'indegentConsumptions');
  let searchPlaceHoder = 'Serach by account or meter number...';

  const SearchCollections = () => {
    let fomData = {
      warD_NO: warD_NO,
      searchText: searchText,
      type: 'No All',
      startConsumption: 0,
      endConsumption: 0,
    };
    if (StartConsumption == 0 && EndConsumption == 0) {
      console.log('1=>', fomData);
      LoadIndegentConsumptions(fomData);
    } else if (StartConsumption == 0 || EndConsumption == 0) {
      ShowAlert('Required', 'Start and End Consumptions feilds are required!');
    } else if (parseInt(StartConsumption) > parseInt(EndConsumption)) {
      ShowAlert(
        'Invalid',
        'Start Consumption should be less than End Consumption!',
      );
    } else {
      let fomData = {
        warD_NO: warD_NO,
        searchText: searchText,
        type: 'No All',
        startConsumption: StartConsumption,
        endConsumption: EndConsumption,
      };
      console.log('2=>', fomData);
      LoadIndegentConsumptions(fomData);
    }
  };

  const handleBottomSearchBox = value => {
    // dispatch(AnnounceViewActions.clearAnnouncementsData())
    console.log('Searching for:', value);
    setSearchText(value);
  };

  const handleSearch = () => {
    // dispatch(AnnounceViewActions.clearAnnouncementsData());
    console.log('Searching for:', searchText);
    // setPage(1);
    let fomData = {
      warD_NO: warD_NO,
      searchText: searchText,
      type: 'No All',
      startConsumption: StartConsumption,
      endConsumption: EndConsumption,
    };
    console.log(fomData);
    LoadIndegentConsumptions(fomData);
  };

  const handleDetailsNavigation = id => {
    setSelectedCoontentID(id);
  };

  const renderMenuList = (item, index) => {
    // console.log(item);
    let id = item.meter_No + '_' + item.municipalAccount + '_' + index;
    return (
      <TouchableOpacity key={id} onPress={() => handleDetailsNavigation(id)}>
        <View style={styles.card}>
          <View style={styles.flex_row_card}>
            {/* <View style={styles.iconContainer}>
              <MaterialCommunityIcon
                name="hand-pointing-right"
                size={30}
                color={Colors.yellow}
              />
            </View> */}
            <View style={styles.content}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={styles.title}>
                  Account No : {item.municipalAccount}
                </Text>
                <TouchableOpacity
                  style={{textAlign: 'right', marginRight: 5}}
                  onPress={() => {
                    navigation.navigate('IndegentConsumptionsMap', {
                      title: warD_NO + ' - Indigent Consumption Map',
                      IndegentConsumptions: [item],
                    });
                  }}>
                  <FontAwesome5
                    name="map-marked-alt"
                    size={25}
                    color={item.color == 'GREEN' ? Colors.primary : Colors.red}
                  />
                </TouchableOpacity>
              </View>

              <Text style={styles.description}>Meter No : {item.meter_No}</Text>
              <Text style={styles.description}>
                Previous Consumption :{' '}
                {parseInt(item.previouS_CONSUMPTION || 0)}
              </Text>
              <Text style={styles.description}>
                Total Outstanding Amount :{' '}
                {formattedAmount(
                  parseFloat(item.totalOutstandingAmount || 0),
                  'en-ZA',
                  'ZAR',
                  'currency',
                )}
              </Text>
            </View>
          </View>
          {item.color == 'RED' && (
            <View style={[styles2.container2, {alignSelf: 'flex-end'}]}>
              <CustomButton
                title={
                  IsSubmitted == item.idNumber
                    ? 'Loading...'
                    : 'Send Notification'
                }
                onPress={() => {
                  handleSMS(item);
                }}
                iconName="send"
                isClicked={!!(IsSubmitted == item.idNumber)}
              />
            </View>
          )}

          {id === selectedCoontentID && (
            <View
              style={[
                styles.content,
                {
                  marginTop: 10,
                  marginHorizontal: 0,
                  marginBottom: 0,
                  borderTopWidth: 1,
                  padding: 10,
                },
              ]}>
              <Text style={styles.description}>
                Name : {item.name} {item.surname}
              </Text>
              <Text style={styles.description}>Cell : {item.cell}</Text>
              <Text style={styles.description}>
                Reading Taken Date : {item.readinG_TAKEN_DATE}
              </Text>
              <Text style={styles.description}>Address : {item.address}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      {/* {searchVisible && (
        <BottomSearchBox
          onChangeText={handleBottomSearchBox}
          onPress={handleSearch}
          value={searchText}
          // setSearchText={setSearchText}
          placeholder={searchPlaceHoder}
          // isLoading={loading}
        />
      )} */}

      {loading === 'pending' && (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size={30} color={Colors.primary} />
        </View>
      )}
      {loading === 'succeeded' && (
        <View>
          {searchVisible && (
            <View>
              <View style={[styles2.container2]}>
                <View style={styles.inputView}>
                  <TextInput
                    style={styles1.input}
                    keyboardType="numeric"
                    value={searchText}
                    onChangeText={text => setSearchText(text)}
                    placeholder={searchPlaceHoder}
                    placeholderTextColor={Colors.blue}
                    autoCorrect={false}
                    autoCapitalize="none"
                  />
                </View>
              </View>
              {/* <View style={[styles2.container2, {width: '100%'}]}>
              <Text style={[styles2.label, {textAlign: 'center'}]}>
                Consumption Range From & To
              </Text>
            </View> */}
              <View style={{flexDirection: 'row', width: '100%'}}>
                <View style={[styles2.container2, {width: '50%'}]}>
                  <View style={styles.inputView}>
                    <TextInput
                      style={styles1.input}
                      keyboardType="numeric"
                      value={StartConsumption}
                      onChangeText={text => setStartConsumption(text)}
                      placeholder={'Consumption Start'}
                      placeholderTextColor={Colors.blue}
                      autoCorrect={false}
                      autoCapitalize="none"
                    />
                  </View>
                </View>
                <View style={[styles2.container2, {width: '50%'}]}>
                  {/* <Text style={styles2.label}>Consumption To</Text> */}
                  <View style={styles.inputView}>
                    <TextInput
                      keyboardType="numeric"
                      style={styles1.input}
                      value={EndConsumption}
                      onChangeText={text => setEndConsumption(text)}
                      placeholder={'Consumption End'}
                      placeholderTextColor={Colors.blue}
                      autoCorrect={false}
                      autoCapitalize="none"
                    />
                  </View>
                </View>
              </View>
              <View style={[styles2.container2]}>
                <CustomButton
                  title={'Search'}
                  onPress={SearchCollections}
                  iconName="search-outline"
                  // isClicked={IsSubmitted}
                />
              </View>
            </View>
          )}
          <FlatList
            data={indegentConsumptions}
            renderItem={({item, index}) => renderMenuList(item, index)}
            keyExtractor={(item, index) => item.actionType + '_' + index}
            contentContainerStyle={{paddingBottom: 500}} // Adds padding at the bottom
          />
        </View>
      )}

      <Pressable
        style={[styles1.toggleButton1, {backgroundColor: Colors.blue}]}>
        <TouchableOpacity
          onPress={() => {
            dispatch(clearAllErrorIndegentConsumptions());
            navigation.navigate('IndegentConsumptionsMap', {
              title: warD_NO + ' - Indigent Consumption Map',
              IndegentConsumptions: null,
            });
          }}
          style={{}}>
          <FontAwesome5 name="map-marked-alt" size={20} color={Colors.white} />
          <Text
            style={{
              color: Colors.white,
              // paddingTop: 0,
              fontWeight: '700',
            }}>
            ALL
          </Text>
        </TouchableOpacity>
      </Pressable>
      {loading === 'failed' && (
        <ShowMessageCenter
          message={
            error == 'No data found.'
              ? 'No data found.'
              : 'Something went wrong!'
          }
        />
      )}
      {/* 
      <Pressable style={styles1.toggleButton1}>
        <TouchableOpacity onPress={toggleSearchBar} style={{}}>
          <Icon name="search" size={25} color={Colors.white} />
        </TouchableOpacity>
      </Pressable> */}
    </>
  );

  // return (
  //   <ScrollView>
  //     <View
  //       style={[
  //         styles.container,
  //         {marginBottom: Platform.OS === 'ios' ? 120 : 120},
  //       ]}>
  //       {IndegentDashboardList.map(item => renderMenuList(item))}
  //     </View>
  //   </ScrollView>
  // );
};

export default IndegentConsumptionsScreen;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    padding: 5,
    justifyContent: 'center',
  },
  flex_row_card: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    // flexDirection: 'row',
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#f1f1f2',
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 10,
    margin: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  iconContainer: {
    marginRight: 10,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: Colors.blue,
  },
  description: {
    fontSize: 16,
    padding: 3,
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
  searchButton: {
    marginRight: 10,
  },
  searchButtonText: {
    fontSize: 16,
    color: 'blue',
  },
  searchBar: {
    marginBottom: 16,
    // backgroundColor:Colors.
  },
});

const styles1 = StyleSheet.create({
  toggleButton1: {
    position: 'absolute',
    bottom: 200,
    right: 30,
    // top: Dimensions.get('screen').height/2,
    backgroundColor: Colors.primary,
    borderRadius: 30,
    height: 60,
    width: 60,
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
  img1: {
    width: 60,
    height: 60,
    borderRadius: 30,
    // resizeMode: 'stretch',
  },
  input: {
    // flex: 1,
    height: 50,
    backgroundColor: Colors.white,
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 5,
    position: 'relative',
    borderWidth: 0.7,
    borderColor: Colors.blue,
  },
  searchButton: {
    width: 50,
    height: 50,
    // borderRadius: 25,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 15,
    bottom: 0,
    top: 10,
  },
});

const styles2 = StyleSheet.create({
  container2: {
    //   flex: 1,
    justifyContent: 'center',
    //   alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 16,
    // backgroundColor: Colors.white,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  selectedText: {
    // marginTop: 16,
    fontSize: 16,
  },
});
