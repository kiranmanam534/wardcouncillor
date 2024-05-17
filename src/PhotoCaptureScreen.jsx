

import React, { useRef } from 'react';
import { View, Button, Alert, StyleSheet } from 'react-native';
import { Camera, CameraPhoto, useCameraDevice, useCameraFormat } from 'react-native-vision-camera';
import RNFetchBlob from 'react-native-fetch-blob';

const PhotoCaptureScreen = () => {
  const cameraRef = useRef(null);
  const device = useCameraDevice('back')
  const format = useCameraFormat(device, [
    { photoResolution: { width: 1280, height: 720 } }
  ])
  

  const takePicture = async () => {
    try {
      const photo = await cameraRef.current?.takePhoto({
        quality: 'Medium',
      });
      console.log(photo.path)
      console.log(RNFetchBlob.wrap(photo.path))
      // Send image to ASP.NET Core API
      // uploadImage(photo.uri);
    } catch (error) {
      console.error('Failed to take picture:', error);
    }
  };

  const uploadImage = async (uri) => {
    try {
      const response = await RNFetchBlob.fetch(
        'POST',
        'YOUR_API_ENDPOINT',
        {
          'Content-Type': 'multipart/form-data',
        },
        [
          {
            name: 'image',
            filename: 'image.jpg',
            type: 'image/jpeg',
            data: RNFetchBlob.wrap(uri),
          },
        ]
      );
      console.log('Image upload response:', response.data);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Camera
        ref={cameraRef}
        style={{flex:1}}
        playSoundOnCapture={true}
        device={device}
        isActive={true}
        photo={true}
        photoQualityBalance='quality'
        photoHdr={true}
        preview={true}
        pixelFormat='rgb'
        
        
      />
      <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center',bottom:50 }}>
        <Button title="Capture" onPress={takePicture} />
      </View>
    </View>
  );
};

export default PhotoCaptureScreen;
