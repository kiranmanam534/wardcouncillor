import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { Colors } from '../constant/Colors';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/dist/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';

const AnnounceModal = ({ isVisible, onClose, onPress }) => {
    return (
        <Modal animationIn={'zoomInUp'} isVisible={isVisible} onBackdropPress={onClose}>
            <View style={styles.container}>
                {/* <Text style={[styles.message,,{marginBottom:0}]}>Pleasew use below options to capture/upload images.</Text> */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginVertical: 40, width: '100%' }}>
                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }}
                        onPress={()=>{onPress('CREATE')}}>
                        <MaterialIcon name="assignment-add" size={35} color={Colors.blue} />
                        <Text style={[styles.message, { paddingVertical: 5 }]}>CREATE</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }}
                        onPress={()=>{onPress('VIEW')}}>
                        <FontAwesome5 name="clipboard-list" size={35} color={Colors.blue} />
                        <Text style={[styles.message, { paddingVertical: 5 }]}>VIEW</Text>
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
        borderWidth: 2, // Border width in pixels
        borderColor: Colors.red,
        borderRadius: 40, // Border radius (optional)
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.white,
        alignSelf: 'center',
        marginBottom: 10
    },
});

export default AnnounceModal;
