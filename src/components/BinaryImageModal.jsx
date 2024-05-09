import React, { useState } from 'react';
// import { View, Modal, Image, Button, Dimensions } from 'react-native';
import { ActivityIndicator, Button, Dimensions, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../constant/Colors";
import MaterialCommunityIcon from 'react-native-vector-icons/dist/MaterialCommunityIcons';

const screenWidth = Dimensions.get('window').width;

// Assume you have a function to decode the binary image
// For simplicity, let's assume it's named `decodeBinaryImage`
const decodeBinaryImage = (binaryImageData) => {
    // Implement your decoding logic here
    // This function should return the decoded image data
    return `data:image/jpeg;base64,${binaryImageData}`; // Example: data URI
};

const BinaryImageModal = ({ binaryImageData, visible, onClose }) => {
    const [decodedImage, setDecodedImage] = useState(null);

    //   console.log(binaryImageData)
    // Decode the binary image data when the modal becomes visible
    React.useEffect(() => {
        if (visible) {
            const imageUri = decodeBinaryImage(binaryImageData);
            setDecodedImage(imageUri);
        }
    }, [binaryImageData, visible]);

    //   return (
    //     <Modal visible={visible} onRequestClose={onClose}>
    //       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',padding:5 }}>
    //        <View style={{margin:100}}>
    //        <Image source={{ uri: decodedImage }} style={{ width: screenWidth-10, height: screenWidth }} />
    //        <View style={{marginTop:20,width:100,flex:1,justifyContent:'center',alignItems:'center'}} >
    //        <Button title="Close" onPress={onClose}   />
    //        </View>
    //        </View>
    //       </View>
    //     </Modal>
    //   );

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
                    {decodedImage &&
                        <Image source={{ uri: decodedImage }} style={{ width: screenWidth - 50, height: screenWidth }} />}
                </View>
            </View>
        </Modal>
    );
};


export default BinaryImageModal;


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
        margin: 20,
        padding: 40,
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: Colors.yellow,
        fontWeight: 'bold',
    },
});