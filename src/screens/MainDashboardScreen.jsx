import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Platform, TouchableOpacity, Alert } from 'react-native';

import MainDashboardItemIcon from '../components/MainDashboardItemIcon';
import Icon from 'react-native-vector-icons/FontAwesome';
import { MainDashboardList } from '../constant/MainDashboardList';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Colors } from '../constant/Colors';
import AnnounceModal from '../components/AnnounceModal';
import MaterialIcon from 'react-native-vector-icons/dist/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';


const MainDashboardScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [seletedSreen, setSeletedSreen] = useState('');
  const [showselectedSection, setShowselectedSection] = useState('');


  const loggedUser = useSelector(state => state.loginReducer.items);

  const loggedUserNme = useSelector(state => state.loginReducer.loggedUserName);

  const { items, isLoading, error } = useSelector(
    state => state.WardDashboardReducer,
  );


  // const closeAnnouncementModal = () => {
  //   setSeletedSreen('')
  //   setShowAnnouncementModal(false);
  // };


  const openAnnouncementModal = (item) => {
    // setSeletedSreen({ create: item.name, view: item.viewName, title: item.title })
    // setShowAnnouncementModal(true);
    setShowselectedSection(item.id)
  };


  const handleNavigation = (navigationName, title) => {
    console.log('====================================');
    console.log(navigationName);
    console.log('====================================');
    // setSeletedSreen('')
    // setShowAnnouncementModal(false);

    // if (name == 'CREATE') {
    //     navigation.navigate(seletedSreen.create, { title: seletedSreen.title })
    // } else {
    //   setTimeout(() => {
    //     navigation.navigate(seletedSreen.view, { title: seletedSreen.title })
    //   }, 100)
    // }

    navigation.navigate(navigationName, { title: title })

  }


  return (
    <View style={styles.container}>
      <View
        style={{
          borderBottomWidth: 1,
          width: '100%',
          borderBottomColor: Colors.primary,
        }}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: '800',
            color: Colors.black,
            paddingVertical: 20,
          }}>
          {/* Hello, {loggedUser?.name} {loggedUser?.surname} */}
          Hello, {loggedUserNme}
        </Text>
      </View>
      <ScrollView>
        <View style={[styles.container, { marginBottom: Platform.OS === 'ios' ? 150 : 160 }]}>
          {MainDashboardList.map((item) => (
            <TouchableOpacity key={item.id} onPress={
              () => openAnnouncementModal(item)
              // NavigateViewScreen(item.name, item.title)
            }>
              <View style={styles.card}>
                <View style={{
                  flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
                }}>
                  <View style={styles.iconContainer}>
                    {/* <Icon name="star" size={20} color={Colors.yellow} /> */}
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

      {/* 
      <AnnounceModal
        isVisible={showAnnouncementModal}
        onPress={handleNavigation}
        onClose={closeAnnouncementModal}
      /> */}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    paddingVertical: 5,
    justifyContent: 'center'

  },
  card: {
    // flexDirection: 'row',
    // justifyContent: 'center',
    // alignItems: 'center',
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
