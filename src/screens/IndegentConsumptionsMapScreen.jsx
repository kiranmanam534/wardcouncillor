import React, {useRef, useState} from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import MapView, {Marker, Callout, PROVIDER_GOOGLE} from 'react-native-maps';

const IndegentConsumptionsMapScreen = () => {
  const [region, setRegion] = useState({
    latitude: -26.1778844,
    longitude: 27.9667214,
    latitudeDelta: 1,
    longitudeDelta: 1,
  });

  const mapRef = useRef(null);

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
  const IndegentConsumptions = [
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
  const markers = [
    {
      id: 1,
      title: 'Marker 1',
      description: 'This is marker 1',
      coordinate: {latitude: 37.78825, longitude: -122.4324},
    },
    {
      id: 2,
      title: 'Marker 2',
      description: 'This is marker 2',
      coordinate: {latitude: 37.78865, longitude: -122.4321},
    },
    {
      id: 3,
      title: 'Marker 3',
      description: 'This is marker 3',
      coordinate: {latitude: 37.78905, longitude: -122.4318},
    },
  ];
  return (
    <View style={styles.container}>
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
        {IndegentConsumptions.map(marker => (
          <Marker
            key={marker.municipalAccount}
            coordinate={{
              latitude: parseFloat(marker.Latitude),
              longitude: parseFloat(marker.Longitude),
            }}
            // provider={PROVIDER_GOOGLE} // Use Google Maps for both platforms
            title={marker.municipalAccount}
            description={marker.meter_No}>
            {/* Custom callout content */}
            <Callout>
              <View>
                <Text style={styles.calloutTitle}>
                  {marker.municipalAccount}
                </Text>
                <Text>{marker.meter_No}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
      <View style={styles.zoomContainer}>
        <Button title="Zoom In" onPress={zoomIn} />
        <Button title="Zoom Out" onPress={zoomOut} />
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
    bottom: 20,
    right: 20,
    flexDirection: 'row',
  },
});
