import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { Colors } from '../constant/Colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import { err } from 'react-native-svg';


const logo = require('../assets/images/COE_logo_portrait.png');

const screenWidth = Dimensions.get('window').width;

const ShowMessageCenter = ({ message }) => {

  console.log('ShowMessageCenter', message)
  // if (error == 'No data foßund') message = 'No data found';
  return (


    <View style={[styles.container
      // ,
      //  { marginBottom: Platform.OS === 'ios' ? 120 : 120 }
    ]}>

      <View style={styles.card}>
        <View style={{ flexDirection: 'row', height: 'auto' }}>
          <View style={styles.iconContainer}>
            {/* <Icon name="star" size={20} color={Colors.yellow} /> */}
            <View style={styles.box}>
              <Image source={logo} style={styles.img} />
            </View>
          </View>
          <View style={styles.content}>
            <Text style={styles.title}>
              {message == 'No data found.' ? 'Success' : 'Error'}
              {/* {message == 'Something went wrong!' ? 'Error' : 'Success'} */}

            </Text>
            <Text style={styles.description}>
              {message}
              {/* {error == 'No data found' ? 'No data found!' : 'Something went wrong!'} */}
            </Text>
          </View>
        </View>
        {/* <View style={[styles.iconContainer, { position: 'absolute',bottom:10,right:0 }]}>
          <TouchableOpacity style={{flexDirection:'row',backgroundColor:Colors.primary,padding:7,
          borderRadius:5}} onPress={onPress}>
          <Text style={{color:Colors.white}}>Refresh</Text>
          </TouchableOpacity>
        </View> */}
      </View>

    </View>

    // <View style={styles.container}>
    //  <View style={styles.container1}>
    //  <Text style={styles.text}>{message}</Text>
    //  </View>
    // </View>
  );
};

export default ShowMessageCenter;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'

  },
  card: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#f1f1f2",
    borderRadius: 10,
    padding: 20,
    margin: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  iconContainer: {
    marginRight: 16,

  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: Colors.red
  },
  description: {
    fontSize: 16,
    color: Colors.blue
  },
  box: {
    width: 70,
    height: 70,
    borderWidth: 1, // Border width in pixels
    borderColor: Colors.white,
    borderRadius: (screenWidth - 50) / 2, // Border radius (optional)
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    alignSelf: 'center',
    elevation: 1,
  },
  img: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
});
