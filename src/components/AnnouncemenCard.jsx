import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import { Card, Title, Paragraph, Divider } from 'react-native-paper';

import { Colors } from '../constant/Colors';
const AnnouncemenCard = ({ item, type, onPress, deletedID }) => {
  // console.log(item.id,ImageId)

  const AnnouncemenCardItem = () => {
    if (type == 'Hotspots') {

      return (
        <Card style={styles.card}>
          <Card.Content style={{ paddingRight: 80 }}>
            <View style={{ flexDirection: 'row', paddingTop: 10 }}>
              <Text style={styles.contentText}>Date</Text>
              <Text
                style={{ fontWeight: '500', fontSize: 15, color: Colors.black }}>
                : {item.crimE_DATE}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', paddingTop: 10 }}>
              <Text style={styles.contentText}>Location</Text>
              <Text
                style={{ fontWeight: '500', fontSize: 15, color: Colors.black }}>
                : {item.location}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', paddingTop: 10 }}>
              <Text style={styles.contentText}>GIS Location</Text>
              <Text
                style={{ fontWeight: '500', fontSize: 13, color: Colors.black }}>
                : {item.latitude}, {item.latitude}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', paddingTop: 10 }}>
              <Text style={styles.contentText}>Crime Type</Text>
              <Text
                style={{ fontWeight: '500', fontSize: 15, color: Colors.black }}>
                : {item.crimE_TYPE}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', paddingTop: 10 }}>
              <Text style={styles.contentText}>Details</Text>
              <Text
                style={{ fontWeight: '500', fontSize: 15, color: Colors.black }}>
                : {item.crimE_DETAILS}
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
                onPress={() => { onPress('Edit', 'Edit Hotspots', 'Hotspots', "Hotspots", item) }}
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
                onPress={() => {
                  deletedID != item.id &&
                    onPress('Delete', 'Hotspots', '', "Hotspots", item)
                }}
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
                  {item.id == deletedID ? <ActivityIndicator size={10} color={Colors.blue} />
                    : <Icon name="trash-o" size={20} color={Colors.blue} />
                  }

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
                onPress={() => { onPress('Images', 'Hotspots Images', 'ViewImages', "Hotspots", item) }}
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
    else if (type == 'Healthcare') {

      return (
        <Card style={styles.card}>
          <Card.Content style={{ paddingRight: 80 }}>
            <View style={{ flexDirection: 'row', paddingTop: 10 }}>
              <Text style={styles.contentText}>Date</Text>
              <Text
                style={{ fontWeight: '500', fontSize: 15, color: Colors.black }}>
                : {item.healthcarE_DATE}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', paddingTop: 10 }}>
              <Text style={styles.contentText}>Location</Text>
              <Text
                style={{ fontWeight: '500', fontSize: 15, color: Colors.black }}>
                : {item.location}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', paddingTop: 10 }}>
              <Text style={styles.contentText}>GIS Location</Text>
              <Text
                style={{ fontWeight: '500', fontSize: 13, color: Colors.black }}>
                : {item.latitude}, {item.latitude}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', paddingTop: 10 }}>
              <Text style={styles.contentText}>Details</Text>
              <Text
                style={{ fontWeight: '500', fontSize: 15, color: Colors.black }}>
                : {item.healthcarE_DETAILS}
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
                onPress={() => { onPress('Edit', 'Edit Healthcare', 'Healthcare', "Healthcare", item) }}
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
                onPress={() => {
                  deletedID != item.id &&
                    onPress('Delete', 'Healthcare', '', "Healthcare", item)
                }}
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
                  {item.id == deletedID ? <ActivityIndicator size={10} color={Colors.blue} />
                    : <Icon name="trash-o" size={20} color={Colors.blue} />
                  }

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
                onPress={() => { onPress('Images', 'Healthcare Images', 'ViewImages', "Healthcare", item) }}
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
    borderWidth: 1,
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
    fontWeight: '500',
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
    fontWeight: '500',
  },
  phoneNumber: {
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
  contentText: {
    fontWeight: '500',
    fontSize: 15,
    color: Colors.black,
    width: 90,
  },
});
