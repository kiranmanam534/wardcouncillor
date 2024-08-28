import {StyleSheet, Text, View} from 'react-native';
import React, {StrictMode} from 'react';
import Navigation from './src/components/Navigation';
import {Provider} from 'react-redux';
import store from './src/redux/store';
import VoiceRecognition1 from './VoiceRecognize1';
import LanguageConvert from './LanguageConvert';
import Test from './src/Test';

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
      </Provider>
    </StrictMode>
  );
};

export default App;

const styles = StyleSheet.create({});
