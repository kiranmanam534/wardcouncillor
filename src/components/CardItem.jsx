import {Button, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {Card, Title, Paragraph, Divider} from 'react-native-paper';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import {Colors} from '../constant/Colors';
import {formattedAmount} from '../utility/FormattedAmmount';
import {wardTitle, wardValue} from '../utility/Commom';

const CardItem = ({
  title,
  value,
  isAmount,
  onPress,
  wardType,
  isTownship = false,
  name,
  billing,
  collection,
}) => {
  // Function to get appropriate icon based on ward type
  const getIconName = () => {
    switch (wardType) {
      case 'Outstanding':
      case 'OutstandingCategory':
        return 'money';
      case 'Collections':
        return 'credit-card';
      case 'Property':
        return 'building';
      case 'Customer':
        return 'users';
      case 'Meter':
        return 'tachometer';
      case 'IMS':
        return 'warning';
      case 'Interims':
        return 'file-text';
      case 'MetersNotRead':
        return 'exclamation-triangle';
      case 'Indigent':
        return 'hand-paper-o';
      default:
        return 'map-marker';
    }
  };

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
              <Title style={[styles.title, {fontSize: 15}]}>
                {isAmount && ['WardBillingCollections'].includes(wardType)
                  ? ': ' + formattedAmount(billing, 'en-ZA', 'ZAR', 'currency')
                  : ': ' + wardValue(wardType, billing)}
              </Title>
            </View>
          </Card.Content>
          <Card.Content>
            <View style={styles.cardContent}>
              <Text>Collection Amount</Text>
              <Title style={[styles.title, {fontSize: 15}]}>
                {isAmount && ['WardBillingCollections'].includes(wardType)
                  ? ': ' +
                    formattedAmount(collection, 'en-ZA', 'ZAR', 'currency')
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
            <Paragraph style={[styles.text, {fontSize: 15, paddingTop: 8}]}>
              {/* {wardType=='Outstanding' && } */}
              {/* {isAmount && ['WardBillingCollections'].includes(wardType)
                ? formattedAmount(collection, 'en-ZA', 'ZAR', 'currency')
                : wardValue(wardType, collection)} */}
            </Paragraph>
            {name != 'N/A' && (
              <View style={{marginTop: 15}}>
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
                    <Icon
                      name={
                        wardType == 'WardBillingCollections'
                          ? 'bar-chart-o'
                          : 'info-circle'
                      }
                      size={20}
                      color={Colors.blue}
                    />
                    <Text
                      style={[
                        styles.text,
                        {
                          fontSize: 16,
                          color: Colors.blue,
                          paddingLeft:
                            wardType == 'WardBillingCollections' ? 5 : 10,
                        },
                      ]}>
                      {wardType == 'WardBillingCollections'
                        ? 'View Chart'
                        : 'View'}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </Card.Content>
        </Card>
      </View>
    );
  } else {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        style={styles.container}>
        <View style={styles.card}>
          <View style={styles.topSection}>
            <View style={styles.iconCircle}>
              <Icon name={getIconName()} size={22} color={Colors.white} />
            </View>
            <View style={styles.titleSection}>
              <Text style={styles.title} numberOfLines={2}>
                {wardTitle(wardType, title, isTownship)}
              </Text>
            </View>
          </View>

          <View style={styles.dividerLine} />

          <View style={styles.bottomSection}>
            <View style={styles.valueSection}>
              <Text style={styles.valueLabel}>Amount</Text>
              <Text style={styles.value}>
                {isAmount &&
                ['Outstanding', 'OutstandingCategory', 'Collections'].includes(
                  wardType,
                )
                  ? formattedAmount(value, 'en-ZA', 'ZAR', 'currency')
                  : wardValue(wardType, value)}
              </Text>
            </View>

            {name != 'N/A' && (
              <View style={styles.actionButton}>
                <Icon
                  name={
                    wardType == 'Collections' ? 'bar-chart-o' : 'chevron-right'
                  }
                  size={18}
                  color={Colors.white}
                />
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }
};

export default CardItem;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 0,
    marginVertical: 4,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#1E40AF',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: Colors.yellow,
  },
  topSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  titleSection: {
    flex: 1,
    marginLeft: 14,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E3A8A',
    letterSpacing: 0.2,
    lineHeight: 20,
  },
  dividerLine: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginBottom: 16,
  },
  bottomSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  valueSection: {
    flex: 1,
  },
  valueLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 6,
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 0.2,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
  },
  divider: {
    marginTop: 40,
  },
  footer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  btn: {
    backgroundColor: Colors.blue,
  },
  text: {
    color: Colors.white,
    fontWeight: '800',
  },
});
