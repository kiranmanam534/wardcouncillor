import React, { useState } from 'react';
// import { View, Modal, Image, Button, Dimensions } from 'react-native';
import { ActivityIndicator, Button, Dimensions, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../constant/Colors";
import MaterialCommunityIcon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import MapView, { Marker } from 'react-native-maps';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;


const ShowMapModal = ({ lat, long, visible, onClose }) => {
    return (
        <Modal transparent animationType="slide" visible={visible} onRequestClose={onClose}>
            <View style={styles.modalBackground}>
                <View style={styles.activityIndicatorWrapper}>
                    <View style={{ position: 'absolute', top: -30, right: -15, backgroundColor: Colors.white, borderRadius: 50 }}>
                        {/* <Button title="Close" onPress={onClose}   /> */}
                        <TouchableOpacity onPress={onClose} >
                            <MaterialCommunityIcon name="close-circle" size={50} color={Colors.red} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.container}>
                    <MapView
                        //   provider={PROVIDER_GOOGLE}
                        mapType={Platform.OS == "android" ? "satellite" : "hybridFlyover"}
                        style={styles.map}
                        initialRegion={{
                            latitude: -26.1989 ,
                            longitude: 28.31262,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}
                    >
                        <Marker
                            coordinate={{ latitude: parseFloat(lat), longitude: parseFloat(long) }}
                            title="Marker Title"
                            description="Marker Description"
                        />
                    </MapView>
                    </View>
                </View>
            </View>
        </Modal>
    );
};


export default ShowMapModal;


const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        //   alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        position: 'relative',
    },
    activityIndicatorWrapper: {
        backgroundColor: Colors.white,
        borderRadius: 10,
        // margin: 20,
        // padding: 40,
        alignItems: 'center',
        height:screenHeight-screenWidth,
        width:screenWidth
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: Colors.yellow,
        fontWeight: 'bold',
    },

    container: {
        ...StyleSheet.absoluteFillObject,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // height:300,
        // width:300
      },
      map: {
        ...StyleSheet.absoluteFillObject,
      },
});