import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {Colors} from './src/constant/Colors';

const GoogleAutocompleteScreen = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // marginTop: 200,
        // borderWidth: 1,
      }}>
      {/* <GooglePlacesAutocomplete
        placeholder="Search..."
        styles={styles}
        debounce={400}
        query={{
          key: 'AIzaSyAI6lFoXVFONS76oYT7XmjzOypAvJq6Kb4',
          language: 'en',
        }}
        onPress={item => {
          console.log(item);
        }}
      /> */}

      <GooglePlacesAutocomplete
        placeholder="Search"
        styles={styles}
        onPress={(data, details = null) => {
          // 'details' is provided when fetchDetails = true
          console.log(data, details);
        }}
        query={{
          key: 'AIzaSyAI6lFoXVFONS76oYT7XmjzOypAvJq6Kb4',
          language: 'en',
        }}
      />
    </View>
  );
};

export default GoogleAutocompleteScreen;

const styles = StyleSheet.create({
  container: {
    // backgroundColor: Colors.primary,
    paddingTop: '16%',
    width: 400,
    alignItems: 'center',
  },
  textInput: {
    backgroundColor: Colors.white,
  },
});
