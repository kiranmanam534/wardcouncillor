import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';

import PrivateNavigation from './PrivateNavigation';
import PubllicNavigation from './PubllicNavigation';
import { authSliceActions } from '../redux/loginSlice';
import CMPrivateNavigation from './CMPrivateNavigation';
import { Colors } from '../constant/Colors';

const Navigation = () => {
  const dispatch = useDispatch();
  // const navigation = useNavigation();
  const isLoggedIn = useSelector(state => state.loginReducer.isLoggedIn);
  const user = useSelector(state => state.loginReducer.items);

  console.log('Navigation', user);

  const goToAIChatBot = () => {
    navigation.navigate("", { title: "AI Chat Bot" })
  }

  // useEffect(() => {
  //   const bootstrapAsync = async () => {
  //     try {
  //       const user = await AsyncStorage.getItem('loggedUser');
  //       console.log("bootstrapAsync")
  //       console.log(user)
  //       if (user) {
  //         dispatch(authSliceActions.login(JSON.parse(user)));
  //       }
  //     } catch (e) {
  //       console.error('Error retrieving user token', e);
  //     }
  //   };
  //   bootstrapAsync();
  // }, [dispatch]);

  // console.log('isLoggedIn',isLoggedIn)
  return (
    <NavigationContainer>
      {isLoggedIn ? (
        user?.usertype === 'C' ? (
          <>
            <PrivateNavigation />
            {/* <Pressable style={styles.toggleButton} onPress={goToAIChatBot}>
              <Text style={{ color: Colors.white, fontSize: 30, textAlign: 'center' }}>AI</Text>
            </Pressable> */}
          </>


        ) : (
          <CMPrivateNavigation />
        )
      ) : (
        <PubllicNavigation />
      )}

    </NavigationContainer>
  );
};

export default Navigation;

const styles = StyleSheet.create({
  toggleButton: {
    position: 'absolute',
    bottom: 100,
    right: 30,
    // top: Dimensions.get('screen').height/2,
    backgroundColor: Colors.primary,
    borderRadius: 25,
    height: 50,
    width: 50,
    // padding: 10,
    elevation: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.black, // For iOS
    shadowOffset: { width: 0, height: 2 }, // For iOS
    shadowOpacity: 0.8, // For iOS
    shadowRadius: 20, // For iOS
  },
});
