import React, { useLayoutEffect, useState } from 'react';
// import { View, Modal, Image, Button, Dimensions } from 'react-native';
import { ActivityIndicator, Button, Dimensions, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../constant/Colors";
import MaterialCommunityIcon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;


const ShowMapModal = ({ route }) => {
    const navigation = useNavigation();
    // useLayoutEffect(() => {
    //     navigation.setOptions({ headerBackTitleVisible: false });
    //   }, [navigation]);
    

    const { lat, long,propertyName,propertyAccount } = route.params
    console.log(lat, long);
    let lat1 = lat;
    let long1 = long;
    if (!lat) {
        lat1 = -26.1989
    }
    if (!long) {
        long1 = 28.31262
    }
    return (
        <View style={styles.container}>
            <MapView
                //   provider={PROVIDER_GOOGLE}
                mapType={Platform.OS == "android" ? "satellite" : "hybridFlyover"}
                style={styles.map}
                initialRegion={{
                    latitude: parseFloat(lat1),//-26.1989,
                    longitude: parseFloat(long1),//28.31262,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                <Marker
                    coordinate={{ latitude: parseFloat(lat1), longitude: parseFloat(long1) }}
                    title={`Account: ${propertyAccount}`}
                    description={`Name : ${propertyName}`}
                />
            </MapView>
        </View>
    );
};


export default ShowMapModal;

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFill,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFill,
    },
});
