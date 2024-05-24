import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { Colors } from './src/constant/Colors'

const GoogleAutocompleteScreen = () => {
    return (
        <View style={{ flex: 1, backgroundColor: Colors.primary }}>
            <GooglePlacesAutocomplete
                placeholder='Search...'
                styles={styles}
                debounce={400}
                query={{
                    key: 'AIzaSyAI6lFoXVFONS76oYT7XmjzOypAvJq6Kb4',
                    language: 'en'
                }}
                onPress={item => {
                    console.log(item);
                }}
            />
        </View>
    )
}

export default GoogleAutocompleteScreen

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.primary,
        paddingTop: '16%',
        width: 400,
        alignItems: 'center',
    },
    textInput:{
        backgroundColor:Colors.white
    }
})