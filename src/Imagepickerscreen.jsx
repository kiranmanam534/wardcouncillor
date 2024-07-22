import axios from 'axios';
import React, { useState } from 'react';
import { Button, Image, View, Platform, StyleSheet, Alert, Text } from 'react-native';
import { launchImageLibrary as _launchImageLibrary, launchCamera as _launchCamera } from 'react-native-image-picker';
import { apiUrl } from './constant/CommonData';
let launchImageLibrary = _launchImageLibrary;
let launchCamera = _launchCamera;

const Imagepickerscreen = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageBinary, setImageBinary] = useState(null);


  const [response, setResponse] = useState(null);

  const openImagePicker = () => {
    const options = {
      mediaType: 'photo',
      includeBase64:true,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, handleResponse);
  };

  const handleCameraLaunch = () => {
    
    const options = {
      mediaType: 'photo',
      includeBase64: true,
      maxHeight: 2000,
      maxWidth: 2000,

    };

    launchCamera(options, handleResponse);
  };

  const handleResponse = (response) => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('Image picker error: ', response.error);
    } else {
      console.log('====================================');
      console.log(response);
      console.log('====================================');
      let imageUri = response.uri || response.assets?.[0]?.uri;
      // setSelectedImage(imageUri);

       // Convert to binary
       const asset = response.assets[0];
       const binary = asset.base64;
       const base64String = 'data:image/jpg;base64,' + binary;

       console.log(base64String)

       setImageBinary(base64String);
     

      // handlePostRequest(base64String,response.assets?.[0]?.fileName.split('.')[1])

    }
  };


  const handlePostRequest = async (image,extension) => {
    const url = `${apiUrl}/api/Create/save-healthcare-attachment`;
    const data = {
      "id": 1,
      "image": image,
      "extension": extension,
      "device": "mobile",
      "useR_ID": 1
    };

    try {
      const res = await axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setResponse(res.data);
    } catch (error) {
      console.error(error);
      setResponse({ error: 'Something went wrong' });
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      {selectedImage && (
        <Image
          source={{ uri: selectedImage }}
          style={{ flex: 1 }}
          width='100%'
          height={200}
        />
      )}
      {imageBinary && (
        <Image
          width='100%'
          height={200}
        source={{ uri: imageBinary }}
      />
      )}
      <Button title="Send POST Request" onPress={handlePostRequest} />
      {response && (
        <Text style={styles.responseText}>
          Response: {JSON.stringify(response)}
        </Text>
      )}
      <View style={{ marginTop: 20 }}>
        <Button title="Choose from Device" onPress={openImagePicker} />
      </View>
      <View style={{ marginTop: 20, marginBottom: 50 }}>
        <Button title="Open Camera" onPress={handleCameraLaunch} />
      </View>
    </View>
  );
};

export default Imagepickerscreen

const styles = StyleSheet.create({})