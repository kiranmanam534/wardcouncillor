import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Navigation from './src/components/Navigation'
import { Provider } from 'react-redux'
import store from './src/redux/store'
import MyComponent from './src/Test'
import TestMapView from './TestMapView'

const App = () => {
  return (
    <Provider store={store}>      
    <Navigation/>
    {/* <MyComponent/> */}
    {/* <TestMapView/> */}
    </Provider>
  )
}

export default App

const styles = StyleSheet.create({})