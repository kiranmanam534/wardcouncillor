import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, {Marker, UrlTile} from 'react-native-maps';
import useAllIndegentConsumptiionsByWardNo from '../src/hooks/useAllIndegentConsumptiionsByWardNo';
import CustomButton from '../src/components/CustomButton';
import {Colors} from '../src/constant/Colors';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';

const EsriMapView = () => {
  const mapRef = useRef(null);
  const regionRef = useRef(null); // Use ref instead of state
  // const navigation = useNavigation();
  const dispatch = useDispatch();
  const [searchVisible, setSearchVisible] = useState(false);
  const [startConsumption, setStartConsumption] = useState(0);
  const [endConsumption, setEndConsumption] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [submittedMarkers, setSubmittedMarkers] = useState({});
  let searchPlaceHoder = 'Serach by account or meter number...';
  const {loading, error, allIndegentConsumptions, LoadIndegentConsumptions} =
    useAllIndegentConsumptiionsByWardNo(0, '', 'All', 0, 0);

  console.log(allIndegentConsumptions?.length);

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

  const SearchCollections = () => {
    console.log(parseInt(startConsumption) > parseInt(endConsumption));

    if (searchText && startConsumption == 0 && endConsumption == 0) {
      // setIndegentConsumptions([]);
      let fomData = {
        warD_NO: 0,
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
        warD_NO: 0,
        searchText: searchText,
        type: 'All',
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
        warD_NO: 0,
        searchText: searchText,
        type: 'All',
        startConsumption: startConsumption,
        endConsumption: endConsumption,
      };
      console.log('2=>', fomData);
      LoadIndegentConsumptions(fomData);
    }
  };

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
    latitude: validLocation ? parseFloat(validLocation.latitude) : -26.1989, // Default fallback
    longitude: validLocation ? parseFloat(validLocation.longitude) : 28.31262, // Default fallback
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
      {allIndegentConsumptions && allIndegentConsumptions?.length > 0 && (
        <>
          <MapView
            ref={mapRef}
            style={{flex: 1}}
            initialRegion={regionRef.current}>
            {/* Esri Tile Layer */}
            <UrlTile
              urlTemplate="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
              zIndex={-1}
            />

            {/* Dynamic Markers */}
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
          </MapView>

          {/* Zoom Controls */}
          <View style={styles.zoomControls}>
            <TouchableOpacity onPress={zoomIn} style={styles.button}>
              <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={zoomOut} style={styles.button}>
              <Text style={styles.buttonText}>-</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

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

export default EsriMapView;
