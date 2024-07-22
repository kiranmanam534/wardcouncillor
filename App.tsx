import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Navigation from './src/components/Navigation'
import { Provider } from 'react-redux'
import store from './src/redux/store'
import MyComponent from './src/Test'
import TestMapView from './TestMapView'
import PhotoCaptureScreen from './src/PhotoCaptureScreen'
import CameraComponent from './src/TestCamera'
import ProfileScreen from './src/TestProfileScreen'
import Customer360Screen from './src/screens/Customer360Screen'
import Imagepickerscreen from './src/Imagepickerscreen'
import TestHomeScreen from './TestHomeScreen'
import GoogleAutocompleteScreen from './GoogleAutocompleteScreen'
import SearchBarScreen from './src/SearchBarScreen'
import TestCharts from './src/TestCharts'
import Test from './src/Test'
import CallLocalApi from './src/CallLocalApi'
import TestBarchart from './src/screens/TestBarchart'
import WardsDBAIScreen from './src/screens/WardsDBAIScreen'

const App = () => {
  return (
    <Provider store={store}>      
    <Navigation/>
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
    </Provider>
  )
}

export default App

const styles = StyleSheet.create({})