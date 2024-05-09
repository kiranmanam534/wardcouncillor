import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';

import PrivateNavigation from './PrivateNavigation';
import PubllicNavigation from './PubllicNavigation';
import {authSliceActions} from '../redux/loginSlice';
import CMPrivateNavigation from './CMPrivateNavigation';

const Navigation = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => state.loginReducer.isLoggedIn);
  const user = useSelector(state => state.loginReducer.items);

  console.log('Navigation', user);

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
          <PrivateNavigation />
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

const styles = StyleSheet.create({});
