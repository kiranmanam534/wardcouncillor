import React, {useEffect, useState} from 'react';
import {
  TextInput,
  Button,
  FlatList,
  Text,
  View,
  StyleSheet,
} from 'react-native';
import AutocompleteInput from 'react-native-autocomplete-input';
// import fetchSuggestions from './fetchSuggestions'; // Import the fetchSuggestions function

import axios from 'axios';

const EsriAutocomplete1 = () => {
  const GEOCODE_URL =
    'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates';

  const getGeocode = async address => {
    const params = {
      SingleLine: address,
      f: 'json', // Return response as JSON
      // outFields: '*', // Fetch all available fields
      // maxLocations: 500, // Set limit for suggestions
      // Optionally include your API key here
      // token: 'YOUR_ESRI_API_KEY'
    };

    try {
      const response = await axios.get(GEOCODE_URL, {params});
      return response.data.candidates;
    } catch (error) {
      console.error('Error fetching geocode:', error);
      return [];
    }
  };
  const [address, setAddress] = useState('');
  const [candidates, setCandidates] = useState([]);

  const handleSearch = async () => {
    const results = await getGeocode(address);
    setCandidates(results);
  };

  // Trigger API call when query changes
  useEffect(() => {
    handleSearch();
  }, [address]);

  return (
    <View style={styles.autocompleteContainer}>
      <TextInput
        placeholder="Enter address"
        value={address}
        // onChangeText={setAddress}
        onChangeText={text => setAddress(text)} // Update query on text change
        // onTextInput={handleSearch}
        style={{
          height: 40,
          borderColor: 'gray',
          borderWidth: 1,
          marginBottom: 10,
        }}
      />
      <Button title="Search Address" onPress={handleSearch} />
      <FlatList
        data={candidates}
        keyExtractor={item => item.address + item.location.x}
        renderItem={({item}) => (
          <View style={{padding: 5, borderWidth: 0.2}}>
            <Text>{item.address}</Text>
            <Text>
              {item.location.x}, {item.location.y}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

export default EsriAutocomplete1;

const styles = StyleSheet.create({
  autocompleteContainer: {
    flex: 1,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 100,
    zIndex: 1,
  },
});
