import React from 'react';
import { View, StyleSheet, ScrollView, Text, Platform, TouchableOpacity } from 'react-native';

import MainDashboardItemIcon from '../components/MainDashboardItemIcon';
import Icon from 'react-native-vector-icons/FontAwesome';
import { MainDashboardList } from '../constant/MainDashboardList';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Colors } from '../constant/Colors';


const MainDashboardScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const loggedUser = useSelector(state => state.loginReducer.items);

  const loggedUserNme = useSelector(state => state.loginReducer.loggedUserName);

  const { items, isLoading, error } = useSelector(
    state => state.WardDashboardReducer,
  );
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
            <TouchableOpacity key={item.id} onPress={() => navigation.navigate(item.name, { title: item.title })}>
              <View style={styles.card}>
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
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    padding: 5,
    justifyContent: 'center'

  },
  card: {
    flexDirection: 'row',
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
    color: Colors.blue
  },
  description: {
    fontSize: 16,
  },
});

export default MainDashboardScreen;
