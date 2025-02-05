import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import MapView, {Marker, UrlTile} from 'react-native-maps';
import ClusteredMapView from 'react-native-map-clustering';
import useAllIndegentConsumptiionsByWardNo from '../src/hooks/useAllIndegentConsumptiionsByWardNo';
import {Colors} from '../src/constant/Colors';
import LoaderModal from '../src/components/LoaderModal';

const ClusteringMap = ({route}) => {
  const mapRef = useRef(null);
  const regionRef = useRef(null);

  const {loading, error, allIndegentConsumptions} =
    useAllIndegentConsumptiionsByWardNo(0, '', 'All', 0, 0);

  console.log(allIndegentConsumptions?.length);

  // Find first valid location
  const validLocation = allIndegentConsumptions?.find(
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
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
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

  return (
    <View style={{flex: 1}}>
      <LoaderModal
        visible={loading === 'pending' && !route?.params?.IndegentConsumptions}
        loadingText="Loading..."
      />
      {/* {allIndegentConsumptions && allIndegentConsumptions?.length > 0 && ( */}
      {/* <> */}
      <ClusteredMapView
        ref={mapRef}
        style={{flex: 1}}
        initialRegion={regionRef.current}
        clusterColor={Colors.primary} // Customize cluster color
        clusterTextColor={Colors.white} // Cluster text color
        clusterFontSize={15}
        animationEnabled
        showsUserLocation>
        {/* Esri Tile Layer */}
        <UrlTile
          urlTemplate="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
          zIndex={-1}
        />

        {/* Dynamic Clustered Markers */}
        {allIndegentConsumptions
          ?.filter(
            marker =>
              marker.latitude &&
              marker.longitude &&
              !isNaN(parseFloat(marker.latitude)) &&
              !isNaN(parseFloat(marker.longitude)),
          )
          .map((marker, index) => (
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
    right: 20,
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

export default ClusteringMap;
