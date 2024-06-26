import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Platform, TouchableOpacity } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import { MainDashboardList } from '../constant/MainDashboardList';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Colors } from '../constant/Colors';
import MaterialIcon from 'react-native-vector-icons/dist/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import { AnnounceViewActions } from '../redux/announcementViewSlice';


const MainDashboardScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [showselectedSection, setShowselectedSection] = useState('');

  const loggedUser = useSelector(state => state.loginReducer.items);

  const loggedUserNme = useSelector(state => state.loginReducer.loggedUserName);

  const openAnnouncementModal = (item) => {
    setShowselectedSection(item.id)
  };


  const handleNavigation = (navigationName, title) => {
    console.log('====================================');
    console.log(navigationName, title);
    console.log('====================================');
    dispatch(AnnounceViewActions.clearAnnouncementsData())

    navigation.navigate(navigationName, { title: title })

  }


  return (
    <View style={[styles.container,{marginHorizontal:5}]}>
      {/* <View
        style={{
          borderBottomWidth: 2,
          width: '100%',
          borderColor: Colors.yellow,
          backgroundColor: Colors.primary,
          marginLeft: 30,
          borderTopLeftRadius: 20,
          justifyContent:'center',
          padding:10
         

        }}>
        <Text
          style={{
            fontSize: 17,
            fontWeight: '800',
            color: Colors.white,
            // padding: 20,
          }}>
           <Icon name="user" size={20} color={Colors.yellow} />{'  '}
        Hello, <Text style={{ color: Colors.white }}>{loggedUserNme}</Text>
        
         
        </Text>
      </View> */}
      <View
            style={{
              marginVertical: 5,
              borderBottomWidth: 2,
              width: '100%',
              // height:40,
              borderBottomColor: Colors.yellow,
              backgroundColor: Colors.primary,
              justifyContent: 'center',
              borderRadius: 10,
              padding: 5
            }}>
            <Text
              style={{
                fontSize: 17,
                fontWeight: '600',
                color: Colors.white,
                paddingLeft: 5
              }}>
              <Icon name="user" size={17} color={Colors.yellow} />{'  '}
              Hello, <Text style={{ color: Colors.white }}>{loggedUserNme} </Text>


            </Text>
            <Text style={{
              fontSize: 17,
              fontWeight: '600',
              color: Colors.white,
             textAlign:'right',
             paddingRight:10
            }}>Ward : {loggedUser?.warD_NO}</Text>

          </View>

      <ScrollView>
        <View style={[styles.container, { marginBottom: Platform.OS === 'ios' ? 150 : 160 }]}>
          {MainDashboardList.map((item) => (
            <TouchableOpacity key={item.id} onPress={
              () => openAnnouncementModal(item)
            }>
              <View style={styles.card}>
                <View style={{
                  flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
                }}>
                  <View style={styles.iconContainer}>
                    {item.icon}
                  </View>
                  <View style={styles.content}>
                    <Text style={styles.title}>{item.title}</Text>
                    {/* <Text style={styles.description}>
                    This is the description of the card.</Text> */}
                  </View>

                  <View style={[styles.iconContainer, { marginRight: 0 }]}>
                    <Icon name="angle-right" size={50} color={Colors.yellow} />
                  </View>
                </View>

                {item.id == showselectedSection &&
                  <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginTop: 15, width: '100%', borderTopWidth: 0.5, height: 60, borderTopColor: Colors.primary, paddingTop: 30 }}>
                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }}
                      onPress={() => { handleNavigation(item.name, item.title) }}
                    >
                      <MaterialIcon name="assignment-add" size={25} color={Colors.blue} />
                      <Text style={[styles.message, { paddingVertical: 5 }]}>CREATE</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }}
                      onPress={() => { handleNavigation(item.viewName, item.title) }}
                    >
                      <FontAwesome5 name="clipboard-list" size={25} color={Colors.blue} />
                      <Text style={[styles.message, { paddingVertical: 5 }]}>VIEW</Text>
                    </TouchableOpacity>

                  </View>}
              </View>

            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 5,
    justifyContent: 'center'

  },
  card: {
    backgroundColor: "#f1f1f2",
    borderRadius: 10,
    padding: 10,
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
    color: Colors.blue
  },
  description: {
    fontSize: 16,
  },
});

export default MainDashboardScreen;
