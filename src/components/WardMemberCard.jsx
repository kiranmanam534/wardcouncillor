import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import {Card, Title, Paragraph, Divider} from 'react-native-paper';

const logo = require('../assets/images/Ekurhuleni-Logo-889x1024.png');
import {Colors} from '../constant/Colors';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const WardMemberCard = ({wardMember, onPress}) => {
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <View style={styles.box}>
          {/* {wardMember?.Councillor_Picture ? (
            <Image
              source={{uri: wardMember?.Councillor_Picture}}
              style={styles.img}
            />
          ) : (
            <Icon name="user" size={100} color={Colors.blue} />
          )} */}
          <Icon name="user" size={100} color={Colors.blue} />
        </View>
        <Card.Content style={{paddingRight: 80, paddingTop: 20}}>
          <View style={styles.cardContent}>
            <Icon name="user" size={25} color={Colors.blue} />
            <Title style={styles.title}>
              {wardMember?.FirstName} {wardMember?.Surname}
            </Title>
          </View>
          
          
          <View style={{flexDirection: 'row', paddingTop: 20}}>
            <Text style={styles.contentText}>Ward No</Text>
            <Text
              style={{fontWeight: '800', fontSize: 15, color: Colors.black}}>
              : {wardMember?.WardNo}
            </Text>
          </View>
          <View style={{flexDirection: 'row', paddingTop: 10}}>
            <Text style={styles.contentText}>Gender</Text>
            <Text
              style={{fontWeight: '800', fontSize: 15, color: Colors.black}}>
              : {wardMember.Gender == 'M' ? 'Male' : 'Female'}
            </Text>
          </View>
          <View style={{flexDirection: 'row', paddingTop: 10}}>
            <Text style={styles.contentText}>Party</Text>
            <Text
              numberOfLines={5}
              style={{fontWeight: '800', fontSize: 15, color: Colors.black}}>
              : {wardMember?.Party}
            </Text>
          </View>
          <View style={{flexDirection: 'row', paddingTop: 10}}>
            <Text style={styles.contentText}>Email</Text>
            <Text
              style={{fontWeight: '800', fontSize: 15, color: Colors.black}}>
              : {wardMember?.EmailAddress}
            </Text>
          </View>
          <View style={{flexDirection: 'row', paddingTop: 10}}>
            <Text style={styles.contentText}>Mobile</Text>
            <Text
              style={{
                fontWeight: '800',
                fontSize: 15,
                color: Colors.primary,
                textDecorationLine: 'underline',
              }}>
              : {wardMember?.Mobile}
            </Text>
          </View>
          <View style={{flexDirection: 'row', paddingTop: 10}}>
            <Text style={styles.contentText}>Home</Text>
            <Text
              style={{fontWeight: '800', fontSize: 15, color: Colors.black}}>
              : -
            </Text>
          </View>
          <View style={{flexDirection: 'row', paddingTop: 10}}>
            <Text style={styles.contentText}>Work</Text>
            <Text
              style={{fontWeight: '800', fontSize: 15, color: Colors.black}}>
              : -
            </Text>
          </View>
        </Card.Content>
        <Divider style={styles.divider} />
        <Card.Content
          style={[
            styles.footer,
            {
              backgroundColor: Colors.blue,
              borderBottomLeftRadius: 15,
              borderBottomRightRadius: 15,
              height: 50,
              borderWidth: 2,
              borderColor: Colors.yellow,
            },
          ]}>
          {/* <Paragraph style={[styles.text, {fontSize: 15, paddingTop: 10}]}>
            {wardMember.Gender == 'M' ? 'Male' : 'Female'}
          </Paragraph> */}
          <View style={{marginTop: 15}}>
            <TouchableOpacity
              onPress={onPress}
              style={[
                styles.btn,
                {
                  height: 30,
                  width: 200,
                  backgroundColor: Colors.white,
                  borderRadius: 20,
                },
              ]}>
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  flexDirection: 'row',
                  // marginHorizontal: -20,
                }}>
                <Icon name="hand-o-right" size={20} color={Colors.blue} />
                <Text
                  style={[
                    styles.text,
                    {fontSize: 16, color: Colors.blue, paddingLeft: 5},
                  ]}>
                  Go To Dashboard
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </Card.Content>
      </Card>
    </View>
  );
};

export default WardMemberCard;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    padding: 5,
    justifyContent: 'center',
  },
  card: {
    elevation: 1, // Add shadow
    borderRadius: 15, // Add border radius
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    marginTop: 40,
    // marginBottom: 15,
  },
  title: {
    paddingLeft: 10,
    color: Colors.blue,
    fontWeight: '800',
    fontSize: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  btn: {
    backgroundColor: Colors.blue,
    // padding: 10,
  },
  text: {
    color: Colors.white,
    fontWeight: '800',
  },
  phoneNumber: {
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
  contentText: {
    fontWeight: '800',
    fontSize: 15,
    color: Colors.black,
    width: 80,
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
    alignSelf: 'center',
    elevation: 1,
    marginTop: 10,
  },
  img: {
    width: screenWidth / 2 - 10,
    height: screenWidth / 2 - 10,
    resizeMode: 'cover',
    borderRadius: (screenWidth - 50) / 2,
  },
});
