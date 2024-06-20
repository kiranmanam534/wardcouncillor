import React, { useState } from 'react';
import { View, Button, Text, TextInput, StyleSheet } from 'react-native';
import { launchImageLibrary as _launchImageLibrary, launchCamera as _launchCamera } from 'react-native-image-picker';
import axios from 'axios';

let launchImageLibrary = _launchImageLibrary;
let launchCamera = _launchCamera;

const CallLocalApi = () => {
    const [yourData, setYourData] = useState('');
    const [selectedImages, setSelectedImages] = useState([]);

    
  const openImagePicker = () => {
    const options = {
      mediaType: 'photo',
      // includeBase64: false,
      // maxHeight: 2000,
      // maxWidth: 2000,
      selectionLimit: 0
    };

    launchImageLibrary(options, handleResponse);
  };

  const handleCameraLaunch = () => {

    const options = {
      mediaType: 'photo',
      // includeBase64: false,
      // maxHeight: 2000,
      // maxWidth: 2000,
      selectionLimit: 0

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
      console.log(response.assets);
      console.log('====================================');
      let imageUri = response.uri || response.assets?.[0]?.uri;



      // Convert to binary
      const asset = response.assets[0];


      const fileExtension = response.assets?.[0]?.fileName.split('.')[1];

      setSelectedImages(response.assets);

    }
  };



    const upload = async () => {
        const formData = new FormData();

        selectedImages.forEach((image, index) => {
            formData.append(`files`, {
                uri: image.uri,
                type: image.type,
                name: image.fileName || `image_${index}.jpg`
            });
        });

        let data = {
            "CRIME_DATE": "2024-06-19",
            "STARTTIME":"2024-06-20T04:28:33.146Z",
            "LOCATION": "Nellore",
            "LATITUDE": "0.00",//Platform.OS == "ios" ? formValues.latitude : "0.00",
            "LONGITUDE": "0.00",//Platform.OS == "ios" ? formValues.longitude : "0.00",
            "CRIME_TYPE":"Murder",
            "CRIME_DETAILS": "sdsdjs",
            "EXPIRY_DATE": "2024-06-19",
            "USERID": 1,
            "WARD_NO": 72,
          }

        formData.append('hotspotInputData', JSON.stringify(data));
        //formData.append('formData', { yourProperty: yourData });

        try {
            const response = await axios.post('http://192.168.1.6:5183/api/Upload/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Enter your data"
                value={yourData}
                onChangeText={setYourData}
            />
            <Button title="Select Images" onPress={handleCameraLaunch} />
            <Button title="Upload" onPress={upload} />
            {selectedImages.length > 0 && (
                <Text style={styles.previewText}>Selected Images: {selectedImages.length}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingLeft: 8,
        width: '100%',
    },
    previewText: {
        marginTop: 12,
    },
});

export default CallLocalApi;



// const CallLocalApi = () => {

//     const getWhether = async () => {
// console.log('====================================');
// console.log('sdsdsd');
// console.log('====================================');
//         try {
//             const url = 'http://192.168.1.8:5183/WeatherForecast';
//             //const url = 'http://196.41.72.247:8083/WardsCoreApi/api/CouncillorWard/72';
//             const response = await axios.get(url);
//             console.log(response.data);
//         } catch (error) {
//             console.log(error);
//         }
//     }

//     useEffect(() => {
//         getWhether();

//     }, [])


//     return (
//         <View>
//             <Text>callLocalApi</Text>
//         </View>
//     )
// }

// export default CallLocalApi

// const styles = StyleSheet.create({})