import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
// import MapView from '@arcgis/core/views/MapView';
// import WebMap from '@arcgis/core/WebMap';

const EsriMap = () => {
  const [location, setLocation] = useState({latitude: null, longitude: null});

  useEffect(() => {
    console.log(`Latitude: , Longitude: `);
    // Request the user's location
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setLocation({latitude, longitude});
        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
      },
      error => {
        console.error(error);
      },
      {enableHighAccuracy: true, timeout: 60000, maximumAge: 1000},
    );
  }, []);

  // useEffect(() => {
  //   if (location.latitude && location.longitude) {
  //     // Initialize Esri map here with the user's location
  //     const webMap = new WebMap({
  //       portalItem: {
  //         id: '6e811d23cfd84bc692a2857ded8493d8', // Replace with your WebMap ID
  //       },
  //     });

  //     const view = new MapView({
  //       container: 'viewDiv',
  //       map: webMap,
  //       center: [location.longitude, location.latitude],
  //       zoom: 12,
  //     });

  //     // Append the view to your React Native component
  //     // You will need a proper method to render the MapView container (not supported natively in RN)
  //   }
  // }, [location]);

  return (
    <View>
      {location.latitude && location.longitude ? (
        <Text>
          Current Location: {location.latitude}, {location.longitude}
        </Text>
      ) : (
        <Text>Fetching Location...</Text>
      )}
    </View>
  );
};

export default EsriMap;
