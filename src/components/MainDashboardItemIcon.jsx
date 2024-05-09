import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Colors} from '../constant/Colors';

const MainDashboardItemIcon = ({item,userType,onPress}) => {
  return (
    <TouchableOpacity style={item.name ?styles.card:styles.card1} onPress={onPress}>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        }}>
        <View style={{height: 60}}>{item.icon}</View>
        <Text style={styles.text}>{item.title}</Text>
      </View>
      {userType === 'U' && (
        <View style={styles.badge}>
          <Text style={[styles.text, {color: Colors.white}]}>100</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.lightgray,
    height: 100,
    width:100,
    borderRadius: 50,
    padding: 10,
    marginHorizontal: 5,
    alignItems: 'center',
    elevation: 10,
  },
  card1: {
    flex: 1,
    // backgroundColor: Colors.white,
    height: 100,
    width:100,
    borderRadius: 50,
    padding: 10,
    marginHorizontal: 5,
    alignItems: 'center',
    // elevation: 10,
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.blue,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    borderWidth: 1,
    borderRadius: 15,
    height: 30,
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.blue,
  },
});

export default MainDashboardItemIcon;
