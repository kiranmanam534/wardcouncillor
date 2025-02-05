import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, {Marker, UrlTile} from 'react-native-maps';
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

  console.log(IndegentConsumptions?.length);

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
    if (!isSMSLoading && smsMessage) {
      dispatch(smdSliceActions.smsClear());
      ShowAlert('Success', smsMessage);
      // setSubmittedMarkers(prev => ({...prev, [marker.idNumber]: false}));
    }
  }, [smsMessage, isSMSLoading]);

  const handleSMS = item => {
    console.log(warD_NO + ' ==> ', item);
    // setSubmittedMarkers(item.idNumber);

    if (item.cell && item.cell != 'Not Available') {
      // Update the state for this specific marker
      setSubmittedMarkers(prev => ({
        ...prev,
        [item.idNumber]: true, // Mark this ID as submitted
      }));

      let message = `Dear ${item.name} ${item.surname}
  
      Your monthly consumption on ${item.meter_No} has exceed the limit of 180 Litres.
      Please limit your consumption or your indigent status will be cancelled.
  
      Thanks
      COE Team`;

      const requestBody = {
        recipientNumber: '0722409624', //item.cell, //'0739007893', //'0722409624', //'0792360234', //'0739007893'
        // recipientNumber: '0739007893',
        message: message.toString(),
        // campaign: 'Interims',
      };
      console.log(requestBody);

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
    latitude: validLocation ? parseFloat(validLocation.latitude) : -26.1989,
    longitude: validLocation ? parseFloat(validLocation.longitude) : 28.31262,
    latitudeDelta: 0.9,
    longitudeDelta: 0.9,
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
        // minZoom={3}
        animationEnabled
        showsUserLocation>
        {/* Esri Tile Layer */}
        <UrlTile
          urlTemplate="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
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
            title={marker.name}
            description={marker.address}
          />
        ))}
      </ClusteredMapView>
    );
  }, [IndegentConsumptions, submittedMarkers]);

  return (
    <View style={{flex: 1}}>
      <LoaderModal
        visible={loading === 'pending' && !route?.params?.IndegentConsumptions}
        loadingText="Loading..."
      />
      {/* {IndegentConsumptions && IndegentConsumptions?.length > 0 && ( */}
      {/* <> */}

      {mapComponent}

      {/* Search Control */}
      {searchVisible && (
        <View style={{position: 'absolute', top: 0}}>
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
          <View style={[styles2.container2]}>
            <CustomButton
              title={'Search'}
              onPress={SearchCollections}
              iconName="search-outline"
              // isClicked={submittedMarkers}
            />
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
      {/* </>
      )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  zoomControls: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    flexDirection: 'column',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 10,
    overflow: 'hidden',
  },
  button: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    marginBottom: 2,
  },
  buttonText: {
    fontSize: 22,
    color: 'white',
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
