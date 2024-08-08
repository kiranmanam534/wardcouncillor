import {
  Button,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {Colors} from '../constant/Colors';

import {useNavigation} from '@react-navigation/native';

import Icon from 'react-native-vector-icons/dist/FontAwesome';

const logo = require('../assets/images/BCX-LOGO.png');

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const HomeScreen = () => {
  const navigation = useNavigation();

  const handleNavigation = title => {
    // console.log(title)
    navigation.navigate('SignIn', {title: title});
  };

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Image source={logo} style={styles.img} />
      </View>
      <View style={styles.btn_conatiner}>
        {/* <TouchableOpacity onPress={()=>{handleNavigation("community member")}} style={styles.btn}>
          <Icon name="users" size={25} color={Colors.yellow} />
          <Text style={styles.text}> I'm a community member</Text>
        </TouchableOpacity> */}

        <TouchableOpacity
          onPress={() => {
            handleNavigation('ward councillor');
          }}
          style={styles.btn}>
          <Icon name="user-circle" size={25} color={Colors.yellow} />
          <Text style={styles.text}> I'm a ward councillor</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    width: screenWidth / 2,
    height: screenWidth / 2,
    borderWidth: 1, // Border width in pixels
    borderColor: Colors.blue,
    borderRadius: (screenWidth - 50) / 2, // Border radius (optional)
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    elevation: 1,
  },
  btn_conatiner: {
    margin: 10,
    flexDirection: 'column',
  },
  btn: {
    margin: 5,
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.black,
  },
  text: {
    marginLeft: 10,
    color: Colors.primary,
    fontFamily: 'open sans',
    fontSize: 16,
    fontWeight: '800',
  },
  img: {
    width: screenWidth / 2 - 60,
    height: screenWidth / 2 - 60,
    resizeMode: 'contain',
  },
});
