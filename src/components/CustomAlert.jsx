// CustomAlert.js
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { Colors } from '../constant/Colors';

const CustomAlert = ({ isVisible, onClose, message, message1, imageSource }) => {
    return (
        <Modal animationIn={'zoomInUp'} isVisible={isVisible} onBackdropPress={onClose}>
            <View style={styles.container}>
                <View style={styles.box}>
                    <Image source={imageSource} style={styles.image} />
                </View>
                <Text style={[styles.message,,{marginBottom:0}]}>{message}</Text>
                {message1 && <Text style={styles.message}>{message1}</Text>}

                <TouchableOpacity onPress={onClose} style={styles.button}>
                    <Text style={styles.buttonText}>OK</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        padding: 10,
        borderRadius: 10,
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
        backgroundColor: Colors.primary,
        padding: 5,
        borderRadius: 5,
        alignSelf: 'flex-end'
    },
    buttonText: {
        color: Colors.white,
        fontSize: 15,
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

export default CustomAlert;
