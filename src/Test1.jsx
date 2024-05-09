import {Button, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {Card, Title, Paragraph, Divider} from 'react-native-paper';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import {formattedAmount} from '../utility/FormattedAmmount';
import {wardTitle, wardValue} from '../utility/Commom';
import { Colors } from './constant/Colors';

const CardItemLoading1 = ({
  title,
  value,
  isAmount,
  onPress,
  wardType,
  isTownship = false,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View>
          <View style={styles.cardContent}>
            <Icon name="users" size={25} color={Colors.blue} />
            <Text style={styles.title}>
              
            </Text>
          </View>
        </View>
        <Divider style={styles.divider} />
        <View
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
          {/* <View style={[styles.footer, {borderWidth:2,borderColor:'red'}]}> */}
          <Text style={[styles.text, {fontSize: 15, paddingTop: 8}]}>
           
           
          </Text>
          <View style={{marginTop: 15}}>
            <TouchableOpacity
              style={[
                styles.btn,
                {
                  height: 30,
                  width: 100,
                  backgroundColor: Colors.white,
                  borderRadius: 20,
                },
              ]}
              onPress={onPress}>
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  flexDirection: 'row',
                  // marginHorizontal: -20,
                }}>
                <Icon name="info-circle" size={20} color={Colors.blue} />
                <Text
                  style={[
                    styles.text,
                    {fontSize: 16, color: Colors.blue, paddingLeft: 10},
                  ]}>
                
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default CardItemLoading1;

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
    paddingRight: 10,
  },
  divider: {
    marginTop: 40,
    // marginBottom: 15,
  },
  title: {
    paddingLeft: 10,
    paddingRight: 2,
    fontSize: 18,
    color:Colors.blue,
    fontWeight:'600'
  },
  footer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  btn: {
    backgroundColor: Colors.blue,
    // padding: 5,
  },
  text: {
    color: Colors.white,
    fontWeight: '800',
  },
});
