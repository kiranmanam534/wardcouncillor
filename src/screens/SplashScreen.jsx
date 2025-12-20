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
const logo = require('../assets/images/sixtep-logo.jpeg');

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const SplashScreen = () => {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const navigation = useNavigation();

  useEffect(() => {
    // Simulate loading time (e.g., fetching data, initializing resources)
    const timeout = setTimeout(() => {
      // Navigate to main screen after 2 seconds (adjust as needed)
      // navigation.replace('SearchBar');
      navigation.replace('Home');
    }, 4000);

    return () => clearTimeout(timeout);
  }, [navigation]);

  useEffect(() => {
    // Border color animation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
    ).start();

    // Scale animation for entrance
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 10,
      friction: 2,
      useNativeDriver: true,
    }).start();

    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Pulse animation for the logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [rotateAnim, scaleAnim, fadeAnim, pulseAnim]);

  const interpolatedColor = rotateAnim.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: ['#4A90E2', '#50C878', '#9B59B6', '#E74C3C', '#4A90E2'],
  });

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Animated background circles */}
      <Animated.View
        style={[
          styles.backgroundCircle,
          {
            transform: [{rotate: spin}],
            opacity: 0.1,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.backgroundCircle2,
          {
            transform: [{rotate: spin}],
            opacity: 0.05,
          },
        ]}
      />

      {/* Main content */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{scale: scaleAnim}],
          },
        ]}>
        <Animated.View
          style={[
            styles.box,
            {
              borderColor: interpolatedColor,
              transform: [{rotate: spin}],
            },
          ]}>
          <Animated.View
            style={[
              styles.innerBox,
              {
                transform: [{scale: pulseAnim}],
              },
            ]}>
            <Image source={logo} style={styles.img} />
          </Animated.View>
        </Animated.View>

        <Animated.Text
          style={[
            styles.appName,
            {
              opacity: fadeAnim,
            },
          ]}>
          Ward Councillor
        </Animated.Text>

        <Animated.View
          style={[
            styles.loadingContainer,
            {
              opacity: fadeAnim,
            },
          ]}>
          <Animated.View
            style={[
              styles.loadingDot,
              {
                transform: [{scale: pulseAnim}],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.loadingDot,
              {
                transform: [{scale: pulseAnim}],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.loadingDot,
              {
                transform: [{scale: pulseAnim}],
              },
            ]}
          />
        </Animated.View>
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
    backgroundColor: '#1a237e', // Deep indigo blue
  },
  backgroundCircle: {
    position: 'absolute',
    width: screenWidth * 1.5,
    height: screenWidth * 1.5,
    borderRadius: (screenWidth * 1.5) / 2,
    borderWidth: 2,
    borderColor: '#64B5F6', // Light blue
  },
  backgroundCircle2: {
    position: 'absolute',
    width: screenWidth * 1.8,
    height: screenWidth * 1.8,
    borderRadius: (screenWidth * 1.8) / 2,
    borderWidth: 3,
    borderColor: '#42A5F5', // Medium blue
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: Math.min(screenWidth - 100, 300),
    height: Math.min(screenWidth - 100, 300),
    borderWidth: 4,
    borderRadius: Math.min(screenWidth - 100, 300) / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    elevation: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  innerBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {
    width: Math.min(screenWidth - 180, 180),
    height: Math.min(screenWidth - 180, 180),
    resizeMode: 'contain',
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 30,
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {width: 0, height: 3},
    textShadowRadius: 6,
  },
  loadingContainer: {
    flexDirection: 'row',
    marginTop: 40,
    gap: 10,
  },
  loadingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#64B5F6', // Light blue to match theme
    marginHorizontal: 5,
  },
});
