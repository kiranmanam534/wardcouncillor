import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../constant/Colors';
import ShowMessageCenter from '../components/ShowMessageCenter';
import CardItemLoading from '../components/CardItemLoading';
import { GetAnnouncementImagesApi, GetAnnouncementVewInfoApi } from '../services/announcementApis';
import { AnnounceViewActions } from '../redux/announcementViewSlice';
import { Searchbar } from 'react-native-paper';
import { AnnouncementImagesActions } from '../redux/AnnouncementImagesSlice';
import { isBase64 } from '../utility/IsBase64';
import { Card, Title, Paragraph, Divider } from 'react-native-paper';

const ViewImagesScreen = ({ route }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();


  const { title, type, id } = route.params;
  console.log(type, title, id);


  const {
    items,
    isLoading,
    error,
    message: memberMessage,
    statusCode: memberStatusCode
  } = useSelector(state => state.AnnouncementImagesReducer);

  const loggedUser = useSelector(state => state.loginReducer.items);

  console.log('====================================');
  console.log("items", items);
  console.log('====================================');




  useEffect(() => {
    dispatch(AnnouncementImagesActions.clearAnnouncementsImagesData())
    dispatch(
      GetAnnouncementImagesApi({
        userId: 11,//id,//loggedUser?.userid,
        type: type
      }),
    );
  }, [loggedUser?.userid, type]);


  const ShowImage = ({ image }) => {

    return (
      <>
        {/* {isBase64(image) ? */}
          <View style={{ margin: 5 }}>

            <Card style={styles.card}>
              <View style={{ padding: 5 }}>

                <Image
                  width='100%'
                  height={200}
                  source={{ uri: 'data:image/jpg;base64,' + image }
                  } />
              </View>
              {/* <Divider style={styles.divider} />
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
              </Card.Content> */}
            </Card>

          </View>
         
      </>
    )
  }

  return (
    <View style={{ flex: 1 }}>

      {memberStatusCode && memberStatusCode !== 200 &&
        <ShowMessageCenter message={error == 'No data found.' ? 'No data found.' : 'Something went wrong!'} />}

      {memberStatusCode && memberStatusCode === 200 && memberMessage === 'Data Not found' && items?.length == 0 && (
        <ShowMessageCenter message={'No data found!'} />
      )}

      {isLoading && (
        <FlatList
          data={[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]}
          renderItem={({ item }) => <CardItemLoading />}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
      {!isLoading && items?.length > 0 && (
        <FlatList
          data={items}
          renderItem={({ item }) => (
            <ShowImage image={item.image} />
          )}
          keyExtractor={(item, index) => index.toString()}
        // onEndReached={handleLoadMore}
        // // onEndReachedThreshold={10} // Adjust the threshold as needed
        // ListFooterComponent={renderFooter}
        />
      )}


    </View>
  );
};

export default ViewImagesScreen;

const styles = StyleSheet.create({
  toggleButton: {
    position: 'absolute',
    bottom: 100,
    right: 30,
    backgroundColor: Colors.red,
    borderRadius: 25,
    padding: 10,
    elevation: 10,
  },
  searchButton: {
    marginRight: 10,
  },
  searchButtonText: {
    fontSize: 16,
    color: 'blue',
  },
  searchBar: {
    marginBottom: 16,
    // backgroundColor:Colors.
  },

  container: {
    // flex: 1,
    // padding: 5,
    justifyContent: 'center',
  },
  card: {
    elevation: 1, // Add shadow
    borderRadius: 15, // Add border radius
    borderWidth: 2,
    borderColor: Colors.primary,
    padding: 0
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
