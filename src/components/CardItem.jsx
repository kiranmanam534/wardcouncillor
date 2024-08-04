import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { Card, Title, Paragraph, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import { Colors } from '../constant/Colors';
import { formattedAmount } from '../utility/FormattedAmmount';
import { wardTitle, wardValue } from '../utility/Commom';

const CardItem = ({
  title,
  value,
  isAmount,
  onPress,
  wardType,
  isTownship = false,
  name,
  billing,
  collection
}) => {
  if (wardType == 'WardBillingCollections') {
    return (
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardContent}>
              <Icon name="users" size={25} color={Colors.blue} />
              <Title style={styles.title}>
                {wardTitle(wardType, title, isTownship)}
              </Title>
            </View>
          </Card.Content>
          <Card.Content>
            <View style={styles.cardContent}>
              <Text>Billing Amount</Text>
              <Title style={[styles.title,{fontSize:15}]}>
                {isAmount && ['WardBillingCollections'].includes(wardType)
                  ? ': ' + formattedAmount(billing, 'en-ZA', 'ZAR', 'currency')
                  : ': ' + wardValue(wardType, billing)}
              </Title>
            </View>
          </Card.Content>
          <Card.Content>
            <View style={styles.cardContent}>
              <Text>Collection Amount</Text>
              <Title  style={[styles.title,{fontSize:15}]}>
                {isAmount && ['WardBillingCollections'].includes(wardType)
                  ? ': ' + formattedAmount(collection, 'en-ZA', 'ZAR', 'currency')
                  : ': ' + wardValue(wardType, collection)}
                {/* {wardTitle(wardType, collection, isTownship)} */}
              </Title>
            </View>
          </Card.Content>
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
            {/* <View style={[styles.footer, {borderWidth:2,borderColor:'red'}]}> */}
            <Paragraph style={[styles.text, { fontSize: 15, paddingTop: 8 }]}>
              {/* {wardType=='Outstanding' && } */}
              {/* {isAmount && ['WardBillingCollections'].includes(wardType)
                ? formattedAmount(collection, 'en-ZA', 'ZAR', 'currency')
                : wardValue(wardType, collection)} */}
            </Paragraph>
            {name != 'N/A' &&
              <View style={{ marginTop: 15 }}>
                <TouchableOpacity
                  style={[
                    styles.btn,
                    {
                      height: 30,
                      width: wardType == 'WardBillingCollections' ? 130 : 100,
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
                    }}>
                    <Icon name={wardType == 'WardBillingCollections' ? "bar-chart-o" : "info-circle"} size={20} color={Colors.blue} />
                    <Text
                      style={[
                        styles.text,
                        { fontSize: 16, color: Colors.blue, paddingLeft: wardType == 'WardBillingCollections' ? 5 : 10 },
                      ]}>
                      {wardType == 'WardBillingCollections' ? 'View Chart' : 'View'}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            }
          </Card.Content>
        </Card>
      </View>
    );
  }
  else {
    return (
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardContent}>
              <Icon name="users" size={25} color={Colors.blue} />
              <Title style={styles.title}>
                {wardTitle(wardType, title, isTownship)}
              </Title>
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
            {/* <View style={[styles.footer, {borderWidth:2,borderColor:'red'}]}> */}
            <Paragraph style={[styles.text, { fontSize: 15, paddingTop: 8 }]}>
              {/* {wardType=='Outstanding' && } */}
              {isAmount && ['Outstanding', 'OutstandingCategory', 'Collections'].includes(wardType)
                ? formattedAmount(value, 'en-ZA', 'ZAR', 'currency')
                : wardValue(wardType, value)}
            </Paragraph>
            {name != 'N/A' &&
              <View style={{ marginTop: 15 }}>
                <TouchableOpacity
                  style={[
                    styles.btn,
                    {
                      height: 30,
                      width: wardType == 'Collections' ? 130 : 100,
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
                    <Icon name={wardType == 'Collections' ? "bar-chart-o" : "info-circle"} size={20} color={Colors.blue} />
                    <Text
                      style={[
                        styles.text,
                        { fontSize: 16, color: Colors.blue, paddingLeft: wardType == 'Collections' ? 5 : 10 },
                      ]}>
                      {wardType == 'Collections' ? 'View Chart' : 'View'}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            }
          </Card.Content>
        </Card>
      </View>
    );
  }
};

export default CardItem;

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
    color: Colors.blue,
    fontWeight: '600'
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
