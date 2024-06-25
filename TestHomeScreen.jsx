import { Dimensions, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Colors } from './src/constant/Colors';
const banner = require('./src/assets/images/germiston-lake-banner.jpg');
const logo = require('./src/assets/images/Ekurhuleni-Logo-889x1024.png');


import Icon from 'react-native-vector-icons/dist/FontAwesome';
import { useNavigation } from '@react-navigation/native';


const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const TestHomeScreen = () => {
    const navigation = useNavigation();

  const handleNavigation = (title) => {
    // console.log(title)
    navigation.navigate('SignIn', {title: title});
  };
    return (
        <View style={{ flex: 1 }}>
            <ImageBackground
                source={banner}
                style={styles.imageBackground}
            >
                <View style={styles.box}>
                    <Image source={logo} style={styles.img} />
                </View>

                <Text style={{ fontSize: 20, color: Colors.white, paddingTop: 10, fontWeight: 'bold' }}>WELCOME</Text>
                <Text style={{ fontSize: 15, color: Colors.white, paddingTop: 10 }}>Ekurhuleni, a Tsonga word that means “place of peace”</Text>
                {/* <Text style={{ fontSize: 15, color: Colors.white, paddingTop: 10 }}>You can now submit your meter readings online</Text> */}

                <TouchableOpacity style={[styles.btn,{width:150,justifyContent:'center'}]}
              onPress={()=>{handleNavigation("Mayor / Councillor")}}
                >
                    <Icon name="user-circle" size={20} color={Colors.white} />
                    <Text style={styles.text}>LOGIN</Text>
                </TouchableOpacity>
            </ImageBackground>

        </View>
    )
}

export default TestHomeScreen

const styles = StyleSheet.create({
    imageBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    box: {
        width: screenWidth / 2,
        height: screenWidth / 2,
        borderWidth: 2, // Border width in pixels
        borderColor: Colors.red,
        borderRadius: (screenWidth - 50) / 2, // Border radius (optional)
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.white,
        elevation: 1,
        alignSelf: 'center',
    },
    img: {
        width: screenWidth / 2 - 60,
        height: screenWidth / 2 - 60,
        resizeMode: 'contain',
    },
    btn: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.primary,
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.white,
        
    },
    text: {
        marginLeft: 10,
        color: Colors.yellow,
        fontFamily: 'open sans',
        fontSize: 16,
        fontWeight: '800',
    },
})