import {StyleSheet, Text, View} from 'react-native';
import React, {StrictMode} from 'react';
import Navigation from './src/components/Navigation';
import {Provider} from 'react-redux';
import store from './src/redux/store';
import VoiceRecognition1 from './VoiceRecognize1';
import LanguageConvert from './LanguageConvert';
import Test from './src/Test';
import EsriMap from './src/TestGIS';
import EsriAutocomplete from './src/EsriAutocomplete';
import GoogleAutocompleteScreen from './GoogleAutocompleteScreen';
import EsriAutocomplete1 from './src/EsriAutocomplete1';

const App = () => {
  return (
    <StrictMode>
      <Provider store={store}>
        <Navigation />
        {/* <MyComponent/> */}
        {/* <TestMapView/> */}
        {/* <PhotoCaptureScreen/> */}
        {/* <CameraComponent/> */}
        {/* <ProfileScreen/> */}
        {/* <Customer360Screen/> */}
        {/* <Imagepickerscreen/> */}
        {/* <TestHomeScreen/> */}
        {/* <GoogleAutocompleteScreen/> */}
        {/* <SearchBarScreen/> */}
        {/* <TestCharts/> */}
        {/* <Test/> */}
        {/* <CallLocalApi/> */}
        {/* <TestBarchart/> */}
        {/* <WardsDBAIScreen/> */}
        {/* <MultipleBarChart/> */}
        {/* <VoiceRecognizer/> */}
        {/* <VoiceRecognition1 /> */}
        {/* <LanguageConvert /> */}
        {/* <Test /> */}
        {/* <EsriMap /> */}
        {/* <EsriAutocomplete1 /> */}
        {/* <GoogleAutocompleteScreen/> */}
      </Provider>
    </StrictMode>
  );
};

export default App;

const styles = StyleSheet.create({});
