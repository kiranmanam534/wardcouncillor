import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import MapView, {
  Marker,
  Callout,
  PROVIDER_GOOGLE,
  Geojson,
} from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';

import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Octicon from 'react-native-vector-icons/Octicons';
import {Colors} from '../constant/Colors';
import {formattedAmount} from '../utility/FormattedAmmount';
import {useDispatch, useSelector} from 'react-redux';
import LoaderModal from '../components/LoaderModal';
import CustomButton from '../components/CustomButton';
import useAllIndegentConsumptiionsByWardNo from '../hooks/useAllIndegentConsumptiionsByWardNo';
import useIndegentConsumptiionsByWardNo from '../hooks/useIndegentConsumptiionsByWardNo';
import {clearAllErrorIndegentConsumptions} from '../redux/indegent/AllIndegentConsumptionSlice';
import {useNavigation} from '@react-navigation/native';
import {smsApi} from '../services/smsApi';
import {smdSliceActions} from '../redux/smsSlice';

// const ekurhuleniGeoJSON = require('../assets/ekurhuleni-boundaries.json');

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const ekurhuleniGeoJSON = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [28.1904, -26.2527], // Example coordinates, replace with real data
            [28.3204, -26.1307],
            [28.3304, -26.2207],
            [28.1904, -26.2527],
          ],
        ],
      },
    },
  ],
};

const IndegentConsumptionsMapScreen = ({route}) => {
  // const {indegentConsumptions, loading, error} = useSelector(
  //   state => state.indegentConsumptions,
  // );
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [searchVisible, setSearchVisible] = useState(false);
  const [startConsumption, setStartConsumption] = useState(0);
  const [endConsumption, setEndConsumption] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [submittedMarkers, setSubmittedMarkers] = useState({});
  const [IsZoom, setZoom] = useState(false);

  const mapRef = useRef(null);

  const {warD_NO} = useSelector(state => state.loginReducer.items);

  const {loading, error, allIndegentConsumptions, LoadIndegentConsumptions} =
    useAllIndegentConsumptiionsByWardNo(
      warD_NO,
      searchText,
      route.params.IndegentConsumptions ? 'Not All' : 'All',
      startConsumption,
      endConsumption,
    );

  // const [IndegentConsumptions, setIndegentConsumptions] = useState(
  //   route.params.IndegentConsumptions || allIndegentConsumptions,
  // );

  let searchPlaceHoder = 'Serach by account or meter number...';
  // console.log(
  //   'route.params.IndegentConsumptions',
  //   route.params.IndegentConsumptions,
  // );

  let IndegentConsumptions =
    route.params.IndegentConsumptions || allIndegentConsumptions;

  // useEffect(() => {
  //   if (!IsZoom) {
  //     if (route.params.IndegentConsumptions) {
  //       setIndegentConsumptions(route.params.IndegentConsumptions);
  //     } else {
  //       setIndegentConsumptions(allIndegentConsumptions);
  //     }
  //   }
  // }, [allIndegentConsumptions, route.params.IndegentConsumptions]);

  const {
    isLoading: isSMSLoading,
    isSMSsent,
    message: smsMessage,
    error: smsError,
    statusCode,
  } = useSelector(state => state.smsReducer);

  console.log('SMSLoading====>', isSMSLoading, smsMessage, smsError);

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
    // setSubmittedMarkers(null);
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

  // useEffect(() => {
  //   return () => {
  //     console.log('route.param');
  //     dispatch(clearAllErrorIndegentConsumptions());
  //   };
  // }, [dispatch]);

  // console.log('IndegentConsumptions', IndegentConsumptions);

  const SearchCollections1 = () => {
    setZoom(false);
    console.log('SearchCollections===>', startConsumption, endConsumption);
    if (
      (startConsumption && endConsumption) ||
      (startConsumption == 0 && endConsumption == 0)
    ) {
      console.log(startConsumption, endConsumption);
      // setIndegentConsumptions([]);
      let fomData = {
        warD_NO: warD_NO,
        searchText: searchText,
        type: route.params.IndegentConsumptions ? 'Not All' : 'All',
        startConsumption: startConsumption,
        endConsumption: endConsumption,
      };
      console.log('2=>', fomData);
      LoadIndegentConsumptions(fomData);
    } else if (startConsumption > endConsumption) {
      ShowAlert(
        'Invalid',
        'Start Consumption should be less than End Consumption!',
      );
      return;
    } else {
      ShowAlert('Required', 'Start and End Consumptions feilds are required!');
      return;
    }
  };

  const SearchCollections = () => {
    setZoom(false);

    console.log(parseInt(startConsumption) > parseInt(endConsumption));
    // if (startConsumption == 0 && endConsumption == 0) {
    //   // setIndegentConsumptions([]);
    //   let fomData = {
    //     warD_NO: warD_NO,
    //     searchText: searchText,
    //     type: route.params.IndegentConsumptions ? 'Not All' : 'All',
    //     startConsumption: 0,
    //     endConsumption: 0,
    //   };
    //   console.log('1=>', fomData);
    //   LoadIndegentConsumptions(fomData);
    // } else
    if (searchText && startConsumption == 0 && endConsumption == 0) {
      // setIndegentConsumptions([]);
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
      // setIndegentConsumptions([]);
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
    // else if (startConsumption == 0 || endConsumption == 0) {
    //   ShowAlert(
    //     'Required',
    //     'Search keyword or (Start and End Consumptions) feilds are required!',
    //   );
    // }
    else if (parseInt(startConsumption) > parseInt(endConsumption)) {
      ShowAlert(
        'Invalid',
        'Start Consumption should be less than End Consumption!',
      );
    } else {
      // setIndegentConsumptions([]);
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

  console.log('filteredConsumptions', IndegentConsumptions);

  // useEffect(() => {
  //   if (!IndegentConsumptions){
  //     let fomData = {
  //       warD_NO: warD_NO,
  //       searchText: '',
  //       type: 'No All',
  //     };
  //     LoadIndegentConsumptions()
  //   }

  //   return () => {
  //     second
  //   }
  // }, [third])

  // console.log(IndegentConsumptions);
  const regionRef = useRef({
    latitude: -26.1989,
    longitude: 28.31262,
    latitudeDelta: 0.2,
    longitudeDelta: 0.2,
  });
  //Location EKURHULENI METROPOLITAN MUNICIPALITY    Latitude  -26.19890000    Longitude  28.31262000
  const [region, setRegion] = useState({
    latitude: -26.1989,
    longitude: 28.31262,
    latitudeDelta: 0.2,
    longitudeDelta: 0.2,
  });

  // const zoomIn = () => {
  //   setZoom(true);
  //   // setRegion({
  //   //   ...region,
  //   //   latitudeDelta: region.latitudeDelta / 2,
  //   //   longitudeDelta: region.longitudeDelta / 2,
  //   // });
  // };

  // const zoomOut = () => {
  //   setZoom(true);
  //   // setRegion({
  //   //   ...region,
  //   //   latitudeDelta: region.latitudeDelta * 2,
  //   //   longitudeDelta: region.longitudeDelta * 2,
  //   // });
  // };
  // Define multiple marker locations

  // 🔍 Function to zoom in
  const zoomIn = () => {
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        ...regionRef.current,
        latitudeDelta: regionRef.current.latitudeDelta / 2, // Zoom in
        longitudeDelta: regionRef.current.longitudeDelta / 2,
      });
    }
  };

  // 🔍 Function to zoom out
  const zoomOut = () => {
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        ...regionRef.current,
        latitudeDelta: regionRef.current.latitudeDelta * 2, // Zoom out
        longitudeDelta: regionRef.current.longitudeDelta * 2,
      });
    }
  };

  const IndegentConsumptions1 = [
    {
      address: '2, KWIKSTERT, BIRCH ACRES 1619',
      cell: '0729072975',
      gender: null,
      householdIncome: null,
      idNumber: '5112050077088',
      maritalStatus: 'Widow(er)',
      meter_No: '150475',
      municipalAccount: '1705405072',
      name: 'PETRU',
      numberOfProperties: null,
      previouS_CONSUMPTION: '1578.00',
      propertyValue: null,
      readinG_TAKEN_DATE: '06/11/2024 00:00:00',
      sourceOfIncome: null,
      surname: 'VOLSCHENK',
      wardno: '104',
      Latitude: '-26.1270685',
      Longitude: '28.484952',
    },
    {
      address: '15,SILVER OAK STREET,ESTERPARK, 1619',
      cell: '0824406450',
      gender: 'Male',
      householdIncome: '4180',
      idNumber: '5004275025085',
      maritalStatus: 'MARRIED',
      meter_No: '483504',
      municipalAccount: '1700389564',
      name: 'ARNALDO RAUL MONTEIRO',
      numberOfProperties: '1',
      previouS_CONSUMPTION: '1021.00',
      propertyValue: '1200000',
      readinG_TAKEN_DATE: '01/18/2024 00:00:00',
      sourceOfIncome: null,
      surname: 'PRONTO',
      wardno: '104',
      Latitude: '-26.127141',
      Longitude: '28.4848585',
    },
    {
      address:
        '. 164 Kildare Estates,bergriver Drive, TERENURE X32, TERENURE X32 1619',
      cell: '0823461842',
      gender: null,
      householdIncome: null,
      idNumber: '5208280751086',
      maritalStatus: 'Widow(er)',
      meter_No: '23094141',
      municipalAccount: '1706153505',
      name: 'Thembile Henrietta',
      numberOfProperties: null,
      previouS_CONSUMPTION: '627.00',
      propertyValue: null,
      readinG_TAKEN_DATE: '09/17/2024 00:00:00',
      sourceOfIncome: null,
      surname: 'Matshego',
      wardno: '104',
      Latitude: '-26.25304029',
      Longitude: '28.10918636',
    },
    {
      address: '44 Green Avenue, KEMPTON PARK X5, KEMPTON PARK X5 1619',
      cell: '0619347530',
      gender: null,
      householdIncome: null,
      idNumber: '6203205008000',
      maritalStatus: 'Married',
      meter_No: '883801',
      municipalAccount: '1701430211',
      name: 'Pieter Willem Adriaan & Juanette',
      numberOfProperties: null,
      previouS_CONSUMPTION: '509.00',
      propertyValue: null,
      readinG_TAKEN_DATE: '07/16/2023 00:00:00',
      sourceOfIncome: null,
      surname: 'Van Baalen',
      wardno: '104',
      Latitude: '-26.12721371',
      Longitude: '28.48475841',
    },
    {
      address: '34,BULTOPRIT STREET,KEMPTON PARK-WES,KEMPTON 1619',
      cell: '0624720932',
      gender: 'FEMALE',
      householdIncome: '0',
      idNumber: '6803040115082',
      maritalStatus: 'MARRIED',
      meter_No: '260716',
      municipalAccount: '1700172705',
      name: 'ELIZABETH',
      numberOfProperties: null,
      previouS_CONSUMPTION: '407.00',
      propertyValue: '890000',
      readinG_TAKEN_DATE: '08/19/2024 00:00:00',
      sourceOfIncome: 'No Income',
      surname: 'JOOSTE',
      wardno: '104',
      Latitude: '-26.12701855',
      Longitude: '28.48474641',
    },
    {
      address: '89, KILDARE EST,LIMPOPO STR, TERENURE X32 1619',
      cell: '0829204442',
      gender: null,
      householdIncome: null,
      idNumber: '7610095308085',
      maritalStatus: 'Married',
      meter_No: '228319',
      municipalAccount: '1704289075',
      name: 'H',
      numberOfProperties: null,
      previouS_CONSUMPTION: '236.00',
      propertyValue: null,
      readinG_TAKEN_DATE: '09/17/2024 00:00:00',
      sourceOfIncome: null,
      surname: 'LETSIE H H M AND C N',
      wardno: '104',
      Latitude: '-26.12694598',
      Longitude: '28.48483516',
    },
    {
      address: '10 Korner Avenue, KEMPTON PARK WEST, KEMPTON PARK WEST 1619',
      cell: '0843431686',
      gender: null,
      householdIncome: null,
      idNumber: '8903130117085',
      maritalStatus: 'Married',
      meter_No: 'COPZ1151',
      municipalAccount: '1707013499',
      name: 'Daryl & Omavathie',
      numberOfProperties: null,
      previouS_CONSUMPTION: '213.00',
      propertyValue: null,
      readinG_TAKEN_DATE: '09/16/2024 00:00:00',
      sourceOfIncome: null,
      surname: 'Manilal O And Pillay D',
      wardno: '104',
      Latitude: '-26.25304029',
      Longitude: '28.10918636',
    },
    {
      address: '24, CAROL VAN DER WALT, EDLEEN EXT 3 1619',
      cell: '0735459681',
      gender: null,
      householdIncome: null,
      idNumber: '8205051072087',
      maritalStatus: 'Divorced',
      meter_No: '201056952',
      municipalAccount: '1709838374',
      name: 'MARY MODIEGI',
      numberOfProperties: null,
      previouS_CONSUMPTION: '186.00',
      propertyValue: null,
      readinG_TAKEN_DATE: '09/19/2024 00:00:00',
      sourceOfIncome: null,
      surname: 'NTINI',
      wardno: '104',
      Latitude: '-26.10784349',
      Longitude: '28.471064',
    },
    {
      address: '52,PARKLAND DRIVE,ESTERPARK,KEMPTON 1619',
      cell: '0729511509',
      gender: 'MALE',
      householdIncome: '2200',
      idNumber: '4708085573081',
      maritalStatus: 'SINGLE',
      meter_No: '120042194',
      municipalAccount: '1700388047',
      name: 'MOROA JOHANNES',
      numberOfProperties: '1',
      previouS_CONSUMPTION: '101.00',
      propertyValue: '1350000',
      readinG_TAKEN_DATE: '09/19/2024 00:00:00',
      sourceOfIncome: null,
      surname: 'MOLEFE',
      wardno: '104',
      Latitude: '-26.107745',
      Longitude: '28.471053',
    },
    {
      address: '8, WEIVELD, KEMPTON PARK WEST 1619',
      cell: '0638846711',
      gender: null,
      householdIncome: null,
      idNumber: '6303155185186',
      maritalStatus: 'Single',
      meter_No: '211110762',
      municipalAccount: '1700174626',
      name: 'SIBONGILE & LUCKY VELAPHI',
      numberOfProperties: null,
      previouS_CONSUMPTION: '93.00',
      propertyValue: null,
      readinG_TAKEN_DATE: '09/16/2024 00:00:00',
      sourceOfIncome: null,
      surname: 'SIBINDI',
      wardno: '104',
      Latitude: '-26.1076465',
      Longitude: '28.471042',
    },
  ];

  const mapComponent = useMemo(() => {
    return (
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={regionRef.current}
        // initialRegion={regionRef.current} // Use initialRegion instead of region
        // onRegionChangeComplete={newRegion => {
        //   regionRef.current = newRegion; // Store in ref (prevents re-render)
        // }}
        // region={region}
        // onRegionChangeComplete={region => setRegion(region)}
        // initialRegion={{
        //   latitude: -26.1076465,
        //   longitude: 28.471042,
        //   latitudeDelta: 0.02,
        //   longitudeDelta: 0.02,
        // }}
      >
        {IndegentConsumptions?.map((marker, index) => (
          <Marker
            key={marker.municipalAccount + '_' + index}
            coordinate={
              marker.latitude &&
              marker.longitude && {
                latitude: parseFloat(marker.latitude),
                longitude: parseFloat(marker.longitude),
              }
            }
            // provider={PROVIDER_GOOGLE} // Use Google Maps for both platforms
            title={marker.municipalAccount}
            description={marker.meter_No}>
            {/* <Icon
            name="dot-circle"
            size={20}
            color={marker.color == 'GREEN' ? Colors.primary : Colors.red}
          /> */}
            {/* <FontAwesome
            name="dot-circle-o"
            size={30}
            color={marker.color == 'GREEN' ? Colors.primary : Colors.red}
          /> */}
            <Entypo
              name="dot-single"
              size={70}
              color={marker.color == 'GREEN' ? Colors.primary : Colors.red}
            />
            {/* <Octicon
            name="dot-fill"
            size={40}
            color={marker.color == 'GREEN' ? Colors.primary : Colors.red}
          /> */}

            {/* Custom callout content */}
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
                      Source Of Income : {marker.sourceOfIncome}
                      {/* {submittedMarkers?.toString()} - {marker.idNumber.toString()}
                      {marker.idNumber.toString() ==
                        submittedMarkers?.toString() && <Text>asaa asas</Text>} */}
                    </Text>
                  </View>
                  {marker.color == 'RED' && (
                    <View style={[styles2.container2]}>
                      <CustomButton
                        title={
                          submittedMarkers[marker.idNumber]
                            ? 'Loading...'
                            : 'Send Notification'
                        }
                        onPress={() => handleSMS(marker)}
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
            {/* 
          <Geojson
            geojson={ekurhuleniGeoJSON}
            strokeColor="blue"
            fillColor="rgba(0, 0, 255, 0.3)"
            strokeWidth={2}
          /> */}
          </Marker>
        ))}
      </MapView>
    );
  }, [IndegentConsumptions, submittedMarkers]);

  return (
    <View style={styles.container}>
      <LoaderModal
        visible={loading === 'pending' && !route.params?.IndegentConsumptions}
        loadingText="Loading..."
      />

      {mapComponent}
      <View style={styles.zoomContainer}>
        <TouchableOpacity
          onPress={zoomIn}
          style={{backgroundColor: Colors.white, borderRadius: 50}}>
          <AntDesign name="pluscircle" size={40} color={Colors.blue} />
          {/* <Button title="Zoom In" onPress={zoomIn} /> */}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={zoomOut}
          style={{
            marginTop: 20,
            backgroundColor: Colors.white,
            borderRadius: 50,
          }}>
          <AntDesign name="minuscircle" size={40} color={Colors.blue} />
          {/* <Button title="Zoom Out" onPress={zoomOut} /> */}
        </TouchableOpacity>
      </View>
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
    </View>
  );
};

export default IndegentConsumptionsMapScreen;
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  calloutTitle: {
    fontWeight: 'bold',
  },
  zoomContainer: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex_row_card: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 10,
    // margin: 8,
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
