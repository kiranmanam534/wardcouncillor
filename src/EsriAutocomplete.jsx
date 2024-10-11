import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import AutocompleteInput from 'react-native-autocomplete-input';
// import fetchSuggestions from './fetchSuggestions'; // Import the fetchSuggestions function

import axios from 'axios';

const EsriAutocomplete = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const ESRI_API_KEY =
    'AAPT3NKHt6i2urmWtqOuugvr9aU9yOSmIv5yL1BrkFiL7hu8hUXAS0ReRRJdp0Vy4iPz5BbXiUjolo1kY74GnL6rxDX41C4RrsFL9zqlgXI6kqDIAOz-uByYlou76APlHSYw18rUULkc3NfY2mZbZYQ6vLkpwNH5mm003TcWqhXRjaToG88Jn91ZCUjsP7k_G_BqYXkWQ8HQCNTZW6YqYoE-4OlM2ccr7uBPItvK--W__A0.'; // Replace with your actual API key
  const GEOCODE_URL = `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest`;

  const fetchSuggestions = async input => {
    try {
      console.log('fetchSuggestions');
      const response = await axios.get(GEOCODE_URL, {
        params: {
          text: input,
          f: 'json', // Format: JSON
          maxSuggestions: 100, // You can limit the number of suggestions
          token: ESRI_API_KEY,
        },
      });
      console.log(response);
      return response.data.suggestions;
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      return [];
    }
  };

  const handleInputChange = async input => {
    setQuery(input);
    console.log(input.length);
    if (input.length > 2) {
      // Avoid searching for short inputs
      const results = await fetchSuggestions(input);
      setSuggestions(results);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionPress = suggestion => {
    setQuery(suggestion.text);
    setSuggestions([]); // Clear suggestions once selected
  };

  return (
    <View style={{flex: 1}}>
      <View style={styles.autocompleteContainer}>
        <AutocompleteInput
          data={suggestions}
          defaultValue={query}
          onChangeText={handleInputChange}
          flatListProps={{
            keyExtractor: item => item.magicKey, // Use a unique key for each suggestion
            renderItem: ({item}) => (
              <View style={{padding: 5, borderWidth: 0.2}}>
                <TouchableOpacity onPress={() => handleSuggestionPress(item)}>
                  <Text>{item.text}</Text>
                </TouchableOpacity>
              </View>
            ),
          }}
        />
      </View>
    </View>
  );
};

export default EsriAutocomplete;

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
