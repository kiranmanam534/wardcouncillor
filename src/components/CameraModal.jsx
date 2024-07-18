
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { Colors } from '../constant/Colors';
import Icon from 'react-native-vector-icons/dist/FontAwesome';

const CameraModal = ({ isVisible, onClose, openCamera, openGallery }) => {
    return (
        <Modal animationIn={'zoomInUp'} isVisible={isVisible} onBackdropPress={onClose}>
            <View style={styles.container}>
                {/* <Text style={[styles.message,,{marginBottom:0}]}>Pleasew use below options to capture/upload images.</Text> */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginVertical: 40, width: '100%' }}>
                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }}
                        onPress={openCamera}>
                        <Icon name="camera" size={25} color={Colors.blue} />
                        <Text style={[styles.message, { paddingVertical: 5 }]}>Take a photo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }}
                        onPress={openGallery}>
                        <Icon name="folder-open" size={25} color={Colors.blue} />
                        <Text style={[styles.message, { paddingVertical: 5 }]}>Gallery</Text>
                    </TouchableOpacity>

                </View>
                <TouchableOpacity onPress={onClose} style={styles.button}>
                    <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    image: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
    },
    message: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    button: {
        backgroundColor: Colors.white,
        padding: 5,
        borderRadius: 5,
        alignSelf: 'flex-end'
    },
    buttonText: {
        color: Colors.red,
        fontSize: 16,
    },
    box: {
        width: 80,
        height: 80,
        borderWidth: 1, // Border width in pixels
        borderColor: Colors.white,
        borderRadius: 40, // Border radius (optional)
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primary,
        alignSelf: 'center',
        marginBottom: 10
    },
});

export default CameraModal;
