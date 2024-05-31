import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import { Card, Title, Paragraph, Divider } from 'react-native-paper';

import { Colors } from '../constant/Colors';
import { formattedAmount } from '../utility/FormattedAmmount';

const AnnouncemenCard = ({ item, type, onPress }) => {
  // console.log(item.id,ImageId)

  const AnnouncemenCardItem = () => {
    if (type=='Healthcare') {
      
      return (
        <Card style={styles.card}>
          <Card.Content style={{ paddingRight: 80 }}>
            {/* <View style={styles.cardContent}>
              <Icon name="user" size={30} color={Colors.blue} />
              <Title style={styles.title}>Healthcare Date : 2024-05-24</Title>
            </View> */}
            <View style={{ flexDirection: 'row', paddingTop: 10 }}>
              <Text style={styles.contentText}>Healthcare Date</Text>
              <Text
                style={{ fontWeight: '800', fontSize: 13, color: Colors.black }}>
               : {item.healthcarE_DATE}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', paddingTop: 10 }}>
              <Text style={styles.contentText}>Location</Text>
              <Text
                style={{ fontWeight: '800', fontSize: 13, color: Colors.black }}>
               : {item.location}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', paddingTop: 10 }}>
              <Text style={styles.contentText}>Latitude</Text>
              <Text
                style={{ fontWeight: '800', fontSize: 13, color: Colors.black }}>
              : {item.latitude}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', paddingTop: 10 }}>
              <Text style={styles.contentText}>Longitude</Text>
              <Text style={{ fontWeight: '800', fontSize: 13, color: Colors.black }}>
              : {item.longitude}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', paddingTop: 10 }}>
              <Text style={styles.contentText}>Details</Text>
              <Text
                style={{ fontWeight: '800', fontSize: 13, color: Colors.black }}>
                : {item.healthcarE_DETAILS}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', paddingTop: 10 }}>
              <Text style={styles.contentText}>
              Ref No
              </Text>
              <Text
                style={{ fontWeight: '800', fontSize: 13, color: Colors.blue }}>
                : {item.refnumber}
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
           <View style={{ marginTop: 15 }}>
              <TouchableOpacity
                // onPress={sendSMS}
                style={[
                  styles.btn,
                  {
                    height: 30,
                    width: 100,
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
                
                    <Icon name="edit" size={20} color={Colors.blue} />

                  <Text
                    style={[
                      styles.text,
                      { fontSize: 16, color: Colors.blue, paddingLeft: 5 },
                    ]}>
                    Edit
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={{ marginTop: 15 }}>
              <TouchableOpacity
                // onPress={sendSMS}
                style={[
                  styles.btn,
                  {
                    height: 30,
                    width: 100,
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
                
                    <Icon name="trash-o" size={20} color={Colors.blue} />

                  <Text
                    style={[
                      styles.text,
                      { fontSize: 16, color: Colors.blue, paddingLeft: 5 },
                    ]}>
                    Delete
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={{ marginTop: 15 }}>
              <TouchableOpacity
                // onPress={sendSMS}
                style={[
                  styles.btn,
                  {
                    height: 30,
                    width: 100,
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
                
                    <Icon name="file-image-o" size={20} color={Colors.blue} />

                  <Text
                    style={[
                      styles.text,
                      { fontSize: 16, color: Colors.blue, paddingLeft: 5 },
                    ]}>
                    Images
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </Card.Content>
        </Card>
      );
    } 
  };

  return (
    <View style={styles.container}>
      <AnnouncemenCardItem />
    </View>
  );
};

export default AnnouncemenCard;

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
    fontSize: 13,
    color: Colors.black,
    width: 90,
  },
});
