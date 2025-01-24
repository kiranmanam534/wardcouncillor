import React, {useEffect, useRef, useState} from 'react';
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

import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Colors} from '../constant/Colors';
import {formattedAmount} from '../utility/FormattedAmmount';
import {useSelector} from 'react-redux';
import LoaderModal from '../components/LoaderModal';
import useAllIndegentConsumptiionsByWardNo from '../hooks/useAllIndegentConsumptiionsByWardNo';
import CustomButton from '../components/CustomButton';

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
  const [searchText, setSearchText] = useState('');
  const [searchText1, setSearchText1] = useState('');
  const [IsSubmitted, setIsSubmitted] = useState(false);
  const [IndegentConsumptions, setIndegentConsumptions] = useState(
    route.params.IndegentConsumptions || allIndegentConsumptions,
  );
  const mapRef = useRef(null);

  console.log(
    'route.params.IndegentConsumptions',
    route.params.IndegentConsumptions,
  );

  const {warD_NO} = useSelector(state => state.loginReducer.items);

  const {loading, error, allIndegentConsumptions} =
    useAllIndegentConsumptiionsByWardNo(
      warD_NO,
      route.params.IndegentConsumptions ? 'Not All' : 'All',
    );

  // let IndegentConsumptions =
  //   route.params.IndegentConsumptions || allIndegentConsumptions;

  useEffect(() => {
    if (route.params.IndegentConsumptions) {
      setIndegentConsumptions(route.params.IndegentConsumptions);
    } else {
      setIndegentConsumptions(allIndegentConsumptions);
    }
  }, [allIndegentConsumptions, route.params.IndegentConsumptions]);

  // console.log('IndegentConsumptions', IndegentConsumptions);

  const SearchCollections = () => {
    if (!searchText || !searchText1) {
      ShowAlert('Required', 'All feilds are required!');
    } else {
      console.log(searchText, searchText1);

      // Add a new key-value pair to each object
      // IndegentConsumptions.forEach(item => {
      //   const consumption = parseFloat(item.previouS_CONSUMPTION);
      //   if (
      //     consumption >= parseFloat(searchText) &&
      //     consumption <= parseFloat(searchText1)
      //   ) {
      //     item.color = Colors.red; // Replace 'newKey' and 'newValue' with your desired key and value
      //   } else {
      //     item.color = Colors.blue;
      //   }
      // });

      // Add a new key `status` to each object
      const updatedConsumptions = IndegentConsumptions.map(item => ({
        ...item,
        color:
          parseFloat(item.previouS_CONSUMPTION) >= parseFloat(searchText) &&
          parseFloat(item.previouS_CONSUMPTION) <= parseFloat(searchText1)
            ? Colors.red
            : Colors.primary,
      }));

      // setIndigentConsumptions(updatedConsumptions); // Update state

      // filteredConsumptions = IndegentConsumptions.filter(item => {
      //   const consumption = parseFloat(item.previouS_CONSUMPTION); // Convert to a number
      //   item['color'] = 'red';
      //   return (
      //     consumption >= parseFloat(searchText) &&
      //     consumption <= parseFloat(searchText1)
      //   );
      // });
      setIndegentConsumptions(updatedConsumptions);
    }
  };

  console.log('filteredConsumptions', IndegentConsumptions);

  const ShowAlert = (type, mess) => {
    Alert.alert(type, mess, [
      {
        text: 'OK',
        onPress: () => {
          console.log('OK Pressed');
        },
      },
    ]);
  };

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
  //Location EKURHULENI METROPOLITAN MUNICIPALITY    Latitude  -26.19890000    Longitude  28.31262000
  const [region, setRegion] = useState({
    latitude: -26.1989,
    longitude: 28.31262,
    latitudeDelta: 0.2,
    longitudeDelta: 0.2,
  });

  const zoomIn = () => {
    setRegion({
      ...region,
      latitudeDelta: region.latitudeDelta / 2,
      longitudeDelta: region.longitudeDelta / 2,
    });
  };

  const zoomOut = () => {
    setRegion({
      ...region,
      latitudeDelta: region.latitudeDelta * 2,
      longitudeDelta: region.longitudeDelta * 2,
    });
  };
  // Define multiple marker locations
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

  return (
    <View style={styles.container}>
      <LoaderModal
        visible={loading === 'pending' && !route.params?.IndegentConsumptions}
        loadingText="Loading..."
      />

      <MapView
        ref={mapRef}
        style={styles.map}
        region={region}
        onRegionChangeComplete={region => setRegion(region)}
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
            <Icon
              name="map-pin"
              size={40}
              color={marker.color || Colors.primary}
            />

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
                    </Text>
                  </View>
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

      <View style={{position: 'absolute', top: 0}}>
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
                value={searchText}
                onChangeText={text => setSearchText(text)}
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
                value={searchText1}
                onChangeText={text => setSearchText1(text)}
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
            title={IsSubmitted ? 'Loading...' : 'Search'}
            onPress={SearchCollections}
            iconName="search-outline"
            isClicked={IsSubmitted}
          />
        </View>
      </View>
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
