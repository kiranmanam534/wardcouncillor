import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Alert,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, {Callout, Marker, Polygon, UrlTile} from 'react-native-maps';
import ClusteredMapView from 'react-native-map-clustering';

import Icon from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';

import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Octicon from 'react-native-vector-icons/Octicons';
import {formattedAmount} from '../utility/FormattedAmmount';
import {Colors} from '../constant/Colors';
import LoaderModal from '../components/LoaderModal';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {smsApi} from '../services/smsApi';
import {smdSliceActions} from '../redux/smsSlice';
import useAllIndegentConsumptiionsByWardNo from '../hooks/useAllIndegentConsumptiionsByWardNo';
import CustomButton from '../components/CustomButton';
import ShowMessageCenter from '../components/ShowMessageCenter';

import ekuJson from '../assets/eku.json';
import {SendEmailApi} from '../services/SendEmailApi';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const IndegentConsumptionsMapScreen = ({route}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const mapRef = useRef(null);
  const regionRef = useRef(null);
  const [searchVisible, setSearchVisible] = useState(false);
  const [startConsumption, setStartConsumption] = useState(0);
  const [endConsumption, setEndConsumption] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [submittedMarkers, setSubmittedMarkers] = useState({});

  const {warD_NO} = useSelector(state => state.loginReducer.items);
  const {loading, error, allIndegentConsumptions, LoadIndegentConsumptions} =
    useAllIndegentConsumptiionsByWardNo(
      warD_NO,
      searchText,
      route.params.IndegentConsumptions ? 'Not All' : 'All',
      startConsumption,
      endConsumption,
    );

  const {
    isLoading: isSMSLoading,
    isSMSsent,
    message: smsMessage,
    error: smsError,
    statusCode,
  } = useSelector(state => state.smsReducer);

  console.log('SMSLoading====>', isSMSLoading, smsMessage, smsError);

  let searchPlaceHoder = 'Serach by account or meter number...';

  let IndegentConsumptions =
    route.params.IndegentConsumptions || allIndegentConsumptions;

  // if (loading === 'failed') {
  //   IndegentConsumptions = [];
  // }
  // console.log('ekuJson', ekuJson.features);

  // console.log('IndegentConsumptions', IndegentConsumptions?.length);

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

  useEffect(() => {
    if (!isSMSLoading && smsError) {
      // showToast('Error', 'Something went wrong!', 'error', Colors.red);

      dispatch(smdSliceActions.smsClear());
      ShowAlert('Error', 'Something went wrong!');
      // setSubmittedMarkers(prev => ({...prev, [marker.idNumber]: false}));
    }
  }, [smsError, isSMSLoading]);

  useEffect(() => {
    console.log('Sending smsMessage', smsMessage);
    if (!isSMSLoading && smsMessage) {
      dispatch(smdSliceActions.smsClear());
      ShowAlert('Success', smsMessage);
      // setSubmittedMarkers(prev => ({...prev, [marker.idNumber]: false}));
    }
  }, [smsMessage, isSMSLoading]);

  // Function to handle button press
  const handleSendEmail = async request_data => {
    try {
      const response = await dispatch(
        SendEmailApi(request_data), // Pass query params
      ).unwrap(); // Use `.unwrap()` to handle response easily

      // Alert.alert('Success', 'Email sent successfully!');
      console.log('API Response:', response);
    } catch (error) {
      Alert.alert('Error', 'Failed to send email.');
      console.error('API Error:', error);
    }
  };

  const handleSMS = item => {
    console.log(warD_NO + ' ==> ', item);
    // setSubmittedMarkers(item.idNumber);
    // setSearchText(item.idNumber);

    if (item.cell && item.cell != 'Not Available') {
      // Update the state for this specific marker
      setSubmittedMarkers(prev => ({
        ...prev,
        [item.idNumber]: true, // Mark this ID as submitted
      }));

      let message = `Dear ${item.name} ${item.surname},
  
      Your monthly consumption on Meter No: ${item.meter_No} has exceed the limit of 180 Litres.
      Please limit your consumption or your indigent status will be cancelled.
  
      Thanks
      COE Team`;

      const requestBody = {
        // recipientNumber: '0722409624', //item.cell, //'0739007893', //'0722409624', //'0792360234', //'0739007893'
        recipientNumber: item.cell,
        message: message.toString(),
        // campaign: 'Interims',
      };
      console.log(requestBody);

      // if(item.)

      let email_message = `Dear <b style='color:${Colors.primary}'>${item.name} ${item.surname},</b>
      <br/><br/>
      Your monthly consumption on Meter No: <b style='color:${Colors.red}'>${item.meter_No} has exceed the limit of 180 Litres.
      </b>
      Please limit your consumption or your indigent status will be cancelled. 
      
      <br/><br/><br/>
      
      Thanks,<br/>
      COE Team`;

      let email_request_body = {
        email: 'kiran.manam.km@gmail.com',
        subject: 'From Kiran',
        body: email_message,
      };

      handleSendEmail(email_request_body);

      dispatch(smsApi({requestBody: requestBody}));

      // After SMS is sent, update UI
      setTimeout(() => {
        setSubmittedMarkers(prev => ({
          ...prev,
          [item.idNumber]: false, // Mark this ID as submitted
        }));
      }, 5000); // Reset after 5 seconds (or when API confirms)
    } else {
      ShowAlert('Warning!', 'Mobile number should not be empty!');
    }

    // setShowErrorModal(true);
  };

  const handleSendSMSEmail = marker => {
    Alert.alert(
      'Alert',
      'Notification will be sent to ' + marker.cell,
      [
        {text: 'Yes', onPress: () => handleSMS(marker)},
        {
          text: 'No',
          onPress: () => console.log('No Pressed'),
          style: 'cancel',
        },
      ],
      {cancelable: false},
    );
  };

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

  const SearchCollections = () => {
    console.log(parseInt(startConsumption) > parseInt(endConsumption));
    if (searchText && startConsumption == 0 && endConsumption == 0) {
      let fomData = {
        warD_NO: warD_NO,
        searchText: searchText,
        type: route.params.IndegentConsumptions ? 'Not All' : 'All',
        startConsumption: startConsumption,
        endConsumption: endConsumption,
      };
      console.log('2=>', fomData);
      LoadIndegentConsumptions(fomData);
    } else if (searchText && startConsumption !== 0 && endConsumption !== 0) {
      let fomData = {
        warD_NO: warD_NO,
        searchText: searchText,
        type: route.params.IndegentConsumptions ? 'Not All' : 'All',
        startConsumption: startConsumption,
        endConsumption: endConsumption,
      };
      console.log('2=>', fomData);
      LoadIndegentConsumptions(fomData);
    } else if (parseInt(startConsumption) > parseInt(endConsumption)) {
      ShowAlert(
        'Invalid',
        'Start Consumption should be less than End Consumption!',
      );
    } else {
      let fomData = {
        warD_NO: warD_NO,
        searchText: searchText,
        type: route.params.IndegentConsumptions ? 'Not All' : 'All',
        startConsumption: startConsumption,
        endConsumption: endConsumption,
      };
      console.log('2=>', fomData);
      LoadIndegentConsumptions(fomData);
    }
  };

  // Find first valid location
  const validLocation = IndegentConsumptions?.find(
    marker =>
      marker.latitude &&
      marker.longitude &&
      !isNaN(parseFloat(marker.latitude)) &&
      !isNaN(parseFloat(marker.longitude)),
  );

  // Set initial region using ref
  regionRef.current = {
    latitude: -26.1989,
    longitude: 28.31262,
    latitudeDelta: 0.736529590527114,
    longitudeDelta: 0.2001998287253286,
  };

  // Zoom In Function
  const zoomIn = () => {
    if (mapRef.current && regionRef.current) {
      regionRef.current = {
        ...regionRef.current,
        latitudeDelta: regionRef.current.latitudeDelta / 2,
        longitudeDelta: regionRef.current.longitudeDelta / 2,
      };
      mapRef.current.animateToRegion(regionRef.current, 500);
    }
  };

  // Zoom Out Function
  const zoomOut = () => {
    if (mapRef.current && regionRef.current) {
      regionRef.current = {
        ...regionRef.current,
        latitudeDelta: regionRef.current.latitudeDelta * 2,
        longitudeDelta: regionRef.current.longitudeDelta * 2,
      };
      console.log(regionRef.current.value);
      mapRef.current.animateToRegion(regionRef.current, 500);
    }
  };

  const mapComponent = useMemo(() => {
    return (
      <ClusteredMapView
        ref={mapRef}
        style={{flex: 1}}
        initialRegion={regionRef.current}
        clusterColor={Colors.primary} // Customize cluster color
        clusterTextColor={Colors.white} // Cluster text color
        clusterFontSize={15}
        // Enable clustering
        // clusterMinZoom={12} // Min zoom level for clustering
        // clusterMaxZoom={12} // Max zoom level for clustering
        onRegionChangeComplete={region => {
          console.log('region changed', region);
        }}
        onClusterPress={cluster => {
          console.log('cluster pressed', cluster);
        }}
        animationEnabled
        showsBuildings={true}
        // initialCamera={{
        //   center: {latitude: 37.78825, longitude: -122.4324},
        //   pitch: 45, // Tilt for a 3D effect
        //   heading: 0,
        //   altitude: 1000,
        //   zoom: 15,
        // }}
        showsUserLocation>
        {/* Esri Tile Layer */}
        {/* <UrlTile
          urlTemplate="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
          zIndex={-1}
        /> */}
        {/* <UrlTile
          urlTemplate="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"
          zIndex={-1}
        /> */}
        {/* <UrlTile urlTemplate="https://api.mapbox.com/styles/v1/{username}/{style_id}/tiles/256/{z}/{x}/{y}?access_token={your_access_token}" /> */}

        {/* <UrlTile
          urlTemplate="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
          zIndex={1}
        /> */}

        <UrlTile
          urlTemplate={'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'}
          zIndex={-1}
        />

        {/* Dynamic Clustered Markers */}
        {IndegentConsumptions?.filter(
          marker =>
            marker.latitude &&
            marker.longitude &&
            !isNaN(parseFloat(marker.latitude)) &&
            !isNaN(parseFloat(marker.longitude)),
        ).map((marker, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: parseFloat(marker.latitude),
              longitude: parseFloat(marker.longitude),
            }}
            pinColor={marker.color == 'GREEN' ? Colors.primary : Colors.red}
            title={marker.name}
            description={marker.address}
            onCalloutPress={() => {
              if (Platform.OS === 'android') {
                handleSendSMSEmail(marker);
              }
            }} // Trigger SMS when Callout is clicked
          >
            {/* <Entypo
              name="dot-single"
              size={70}
              color={marker.color == 'GREEN' ? Colors.primary : Colors.red}
            /> */}
            <Callout>
              <View style={{width: screenWidth - 100}}>
                <View style={styles.card}>
                  <View style={styles.flex_row_card}>
                    <View style={styles.content}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <Text style={styles.title}>
                          Account No : {marker.municipalAccount}
                        </Text>
                      </View>

                      <Text style={styles.description}>
                        Meter No : {marker.meter_No}
                      </Text>
                      <Text style={styles.description}>
                        Previous Consumption :{' '}
                        {parseInt(marker.previouS_CONSUMPTION || 0)}
                      </Text>
                      <Text style={styles.description}>
                        Total Outstanding Amount :{' '}
                        {formattedAmount(
                          parseFloat(marker.totalOutstandingAmount || 0),
                          'en-ZA',
                          'ZAR',
                          'currency',
                        )}
                      </Text>
                    </View>
                  </View>

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
                      Name : {marker.name} {marker.surname}
                    </Text>
                    <Text style={styles.description}>Cell : {marker.cell}</Text>
                    <Text style={styles.description}>
                      Reading Taken Date : {marker.readinG_TAKEN_DATE}
                    </Text>
                    <Text style={styles.description}>
                      Address : {marker.address}
                    </Text>
                    <Text style={styles.description}>
                      Source Of Income : {marker.sourceOfIncome}{' '}
                      submittedMarkers : {JSON.stringify(submittedMarkers)}
                      {/* {submittedMarkers?.toString()} - {marker.idNumber.toString()}
                      {marker.idNumber.toString() ==
                        submittedMarkers?.toString() && <Text>asaa asas</Text>} */}
                    </Text>
                  </View>
                  {marker.color == 'RED' && (
                    <View style={[styles2.container2]}>
                      <CustomButton
                        key={
                          submittedMarkers[marker.idNumber]
                            ? 'loading'
                            : 'normal'
                        }
                        title={
                          submittedMarkers[marker.idNumber]
                            ? 'Loading...'
                            : 'Send Notification'
                        }
                        onPress={() => handleSendSMSEmail(marker)}
                        iconName="send"
                        isClicked={submittedMarkers[marker.idNumber]}
                      />
                      {/* <CustomButton
                        title={
                          marker.idNumber == submittedMarkers
                            ? 'Loading...'
                            : 'Send Notification'
                        }
                        onPress={() => {
                          handleSMS(marker);
                        }}
                        iconName="send"
                        isClicked={!!(marker.idNumber == submittedMarkers)}
                      /> */}
                    </View>
                  )}
                </View>
              </View>
            </Callout>
          </Marker>
        ))}

        {ekuJson.features.map((feature, index) => {
          if (feature.geometry.type === 'Polygon') {
            return (
              <Polygon
                key={index}
                coordinates={feature.geometry.coordinates[0].map(
                  ([longitude, latitude]) => ({
                    latitude,
                    longitude,
                  }),
                )}
                strokeColor={Colors.blue} // Red border
                fillColor="rgba(30, 43, 222, 0.26)" // Transparent red fill
                // strokeColor={Colors.red} // Red border
                // fillColor={Colors.yellow} // Transparent red fill

                strokeWidth={2}
              />
            );
          }
          return null;
        })}
      </ClusteredMapView>
    );
  }, [IndegentConsumptions, submittedMarkers]);

  return (
    <View style={{flex: 1}}>
      <LoaderModal
        visible={loading === 'pending' && !route?.params?.IndegentConsumptions}
        loadingText="Loading..."
      />
      {mapComponent}

      {/* Search Control */}
      {searchVisible && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            // paddingHorizontal: 30,
            // paddingVertical: 10,
          }}>
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
            <View style={[styles2.container2, {width: '100%'}]}>
              <Text style={[styles2.label, {textAlign: 'center'}]}>
                Consumption Range From & To
              </Text>
            </View>
            <View style={{flexDirection: 'row', width: '100%'}}>
              <View style={[styles2.container2, {width: '50%'}]}>
                <View style={styles.inputView}>
                  <TextInput
                    style={styles1.input}
                    keyboardType="numeric"
                    value={startConsumption}
                    onChangeText={text => {
                      if (!text) {
                        setStartConsumption(0);
                      } else {
                        setStartConsumption(text);
                      }
                    }}
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
                    value={endConsumption}
                    onChangeText={text => {
                      if (!text) {
                        setEndConsumption(0);
                      } else {
                        setEndConsumption(text);
                      }
                    }}
                    placeholder={'Consumption End'}
                    placeholderTextColor={Colors.blue}
                    autoCorrect={false}
                    autoCapitalize="none"
                  />
                </View>
              </View>
            </View>
            <View style={[styles2.container2, {paddingBottom: 10}]}>
              <CustomButton
                title={'Search'}
                onPress={SearchCollections}
                iconName="search-outline"
                // isClicked={submittedMarkers}
              />
            </View>
          </View>
        </View>
      )}
      {/* Zoom Controls */}
      <View style={styles.zoomControls}>
        <TouchableOpacity onPress={zoomIn} style={styles.button}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={zoomOut} style={styles.button}>
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
      </View>

      {loading === 'failed' && (
        <View style={styles.MessageConatiner}>
          <ShowMessageCenter
            message={
              error == 'No data found.'
                ? 'No Consumptions found!'
                : 'Something went wrong!'
            }
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  zoomControls: {
    position: 'absolute',
    bottom: 60,
    left: 20,
    flexDirection: 'column',
    // backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 10,
    overflow: 'hidden',
  },
  MessageConatiner: {
    position: 'absolute',
    height: 150,
    bottom: '50%',
    left: 0,
    right: 0,
    top: '50%',
    flexDirection: 'column',
    // backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 10,
    // overflow: 'hidden',
  },
  button: {
    padding: 5,
    height: 50,
    width: 50,
    borderRadius: 50,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.blue,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 30,
    color: Colors.white,
    fontWeight: 'bold',
  },
});

const styles1 = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    //   paddingBottom: 20,
    backgroundColor: Colors.lightgray,
    // borderWidth:1,
    // borderColor:Colors.blue,
    // borderTopLeftRadius:30,
    // borderTopRightRadius:30
  },
  input: {
    flex: 1,
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
    backgroundColor: Colors.white,
    // borderRadius: 20,
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

export default IndegentConsumptionsMapScreen;
