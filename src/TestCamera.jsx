import React, { useState, useRef } from 'react';
import { View, Text, Button, TouchableOpacity, Image } from 'react-native';
import { RNCamera, CameraRecordingQuality, useCameraDevice, Camera } from 'react-native-vision-camera';
import RNFetchBlob from 'react-native-fetch-blob';


const CameraComponent = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);
    const cameraRef = useRef(null);
    const device = useCameraDevice('back')

    const takePicture = async () => {
        if (cameraRef.current) {
            const options = { quality: 0.5, base64: true };
            const data = await cameraRef.current.takePictureAsync(options);
            setCapturedImage(data.uri);
        }
    };

    const startRecording = async () => {
        if (cameraRef.current) {
            const recordingOptions = {
                quality: CameraRecordingQuality['720p'],
            };
            const { uri } = await cameraRef.current.recordAsync(recordingOptions);
            setIsRecording(true);
        }
    };

    const stopRecording = async () => {
        if (cameraRef.current) {
            setIsRecording(false);
            await cameraRef.current.stopRecording();
        }
    };

    const uploadImage = async (uri) => {
        try {
            const response = await RNFetchBlob.fetch(
                'POST',
                'YOUR_UPLOAD_ENDPOINT',
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
                style={{ flex: 1 }}
                playSoundOnCapture={true}
                device={device}
                isActive={true}
                photo={true}
                photoQualityBalance='quality'
                photoHdr={true}
                preview={true}
                pixelFormat='rgb'


            >
                {capturedImage && (
                    <View style={{ flex: 1 }}>
                        <Image source={{ uri: capturedImage }} style={{ flex: 1 }} />
                        <Button title="Upload Image" onPress={() => uploadImage(capturedImage)} />
                    </View>
                )}

            </Camera>

            <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginBottom: 20 }}>
                <TouchableOpacity onPress={takePicture}>
                    <Text>Take Picture</Text>
                </TouchableOpacity>
                {!isRecording ? (
                    <TouchableOpacity onPress={startRecording}>
                        <Text>Start Recording</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity onPress={stopRecording}>
                        <Text>Stop Recording</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

export default CameraComponent;
