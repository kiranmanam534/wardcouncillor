import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Navigation from './src/components/Navigation'
import { Provider } from 'react-redux'
import store from './src/redux/store'
import VoiceRecognition1 from './VoiceRecognize1'


const App = () => {
  return (
    <Provider store={store}>      
    {/* <Navigation/> */}
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
    <VoiceRecognition1/>
    </Provider>
  )
}

export default App

const styles = StyleSheet.create({})