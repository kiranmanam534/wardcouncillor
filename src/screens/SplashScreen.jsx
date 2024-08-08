import {
  Animated,
  Easing,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {useNavigation} from '@react-navigation/native';

import {Dimensions} from 'react-native';
import {Colors} from '../constant/Colors';
const logo = require('../assets/images/BCX-LOGO.png');

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const SplashScreen = () => {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  // useEffect(() => {
  //   // Simulate loading time (e.g., fetching data, initializing resources)
  //   const timeout = setTimeout(() => {
  //     // Navigate to main screen after 2 seconds (adjust as needed)
  //     // navigation.replace('SearchBar');
  //     navigation.replace('Home');
  //   }, 2000);

  //   return () => clearTimeout(timeout);
  // }, [navigation]);

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.circle,
        useNativeDriver: false,
      }),
    ).start();
  }, [rotateAnim]);

  const interpolatedColor = rotateAnim.interpolate({
    inputRange: [0, 1, 1],
    outputRange: [Colors.yellow, Colors.blue, Colors.red],
  });

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.box, {borderColor: interpolatedColor}]}>
        <Image source={logo} style={styles.img} />

        {/* <Text>screenWidth  : {screenWidth}</Text>
        <Text>screenHeight  : {screenHeight}</Text> */}
      </Animated.View>
    </SafeAreaView>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary,
  },
  box: {
    width: screenWidth - 50,
    height: screenWidth - 50,
    borderWidth: 5, // Border width in pixels
    // borderColor: 'blue', // Border color
    borderRadius: (screenWidth - 50) / 2, // Border radius (optional)
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    elevation: 1,
  },
  img: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
});
