import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import {Card, Title, Paragraph, Divider} from 'react-native-paper';

import {Colors} from '../constant/Colors';
import {formattedAmount} from '../utility/FormattedAmmount';

const TownshipCard = ({
  item,
  wardType,
  onPress,
  sendSMS,
  name,
  showImage,
  imageLoading,
  ImageId,
  showMap,
}) => {
  // console.log(item.id,ImageId)

  const TownshipCardItem = () => {
    if (['Outstanding', 'OutstandingCategory'].includes(wardType)) {
      let phoneNumber = true;
      if (
        item.cellphonenumber === 'Not Available' ||
        item.cellphonenumber == null
      ) {
        phoneNumber = false;
      }

      if (name === 'D30_DAYS') name = '30 days amount';
      if (name === 'D60_DAYS') name = '60 days amount';
      if (name === 'D90_DAYS') name = '90 days amount';
      if (name === 'D120_PLUS') name = '120+ days amount';
      return (
        <Card style={styles.card}>
          <Card.Content style={{padding: 16}}>
            <View style={styles.cardContent}>
              <View style={styles.iconCircle}>
                <Icon name="user" size={20} color={Colors.primary} />
              </View>
              <Title style={styles.title}>Account: {item.accounT_NO}</Title>
            </View>

            <View style={styles.rowContainer}>
              <Text style={styles.contentText}>Customer</Text>
              <Text style={styles.valueText}>: {item.customeR_NAME}</Text>
            </View>

            <View style={styles.rowContainer}>
              <Text style={styles.contentText}>Address</Text>
              <Text style={styles.valueText}>: {item.streeT_NAME_NO}</Text>
            </View>

            <View style={styles.rowContainer}>
              <Text style={styles.contentText}>Mobile No</Text>
              <Text
                style={[
                  phoneNumber ? styles.phoneNumber : styles.valueText,
                  {flex: 1},
                ]}
                onPress={onPress}>
                : {item.cellphonenumber}
              </Text>
            </View>

            <View style={styles.rowContainer}>
              <Text style={styles.contentText}>Ward No</Text>
              <Text style={styles.valueText}>: {item.ward}</Text>
            </View>

            <View style={styles.rowContainer}>
              <Text style={styles.contentText}>{name}</Text>
              <Text style={styles.amountText}>
                :{' '}
                {formattedAmount(
                  parseFloat(item.daysAmount),
                  'en-ZA',
                  'ZAR',
                  'currency',
                )}
              </Text>
            </View>
          </Card.Content>

          <View style={styles.footer}>
            <Text style={[styles.text, {flex: 1, fontSize: 12}]}>
              Total:{' '}
              {formattedAmount(
                parseFloat(item.totalAmount),
                'en-ZA',
                'ZAR',
                'currency',
              )}
            </Text>

            <TouchableOpacity
              onPress={sendSMS}
              style={styles.btn}
              activeOpacity={0.8}>
              {item.accounT_NO == ImageId ? (
                <ActivityIndicator color={Colors.primary} size="small" />
              ) : (
                <>
                  <Icon name="send" size={18} color={Colors.primary} />
                  <Text
                    style={[
                      styles.text,
                      {color: Colors.primary, marginLeft: 8},
                    ]}>
                    Send SMS
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </Card>
      );
    } else if (wardType == 'Interims') {
      return (
        <Card style={styles.card}>
          <Card.Content style={{padding: 16}}>
            <View style={styles.cardContent}>
              <View style={styles.iconCircle}>
                <Icon name="tachometer" size={20} color={Colors.primary} />
              </View>
              <Title style={styles.title}>Account: {item.accountNumber}</Title>
            </View>

            <View style={styles.rowContainer}>
              <Text style={styles.contentText}>Customer</Text>
              <Text style={styles.valueText}>: {item.debtorName}</Text>
            </View>

            <View style={styles.rowContainer}>
              <Text style={styles.contentText}>Meter</Text>
              <Text style={styles.valueText}>: {item.meterNumber}</Text>
            </View>

            <View style={styles.rowContainer}>
              <Text style={styles.contentText}>Zone</Text>
              <Text style={styles.valueText}>: {item.zoning}</Text>
            </View>

            <View style={styles.rowContainer}>
              <Text style={styles.contentText}>Address</Text>
              <Text style={styles.valueText}>: {item.physicalAddress}</Text>
            </View>

            <View style={styles.rowContainer}>
              <Text style={styles.contentText}>Reason</Text>
              <Text style={styles.valueText}>: {item.interimsReason}</Text>
            </View>

            <View style={styles.rowContainer}>
              <Text style={styles.contentText}>Mobile No</Text>
              <Text
                style={[
                  item.cellNo ? styles.phoneNumber : styles.valueText,
                  {flex: 1},
                ]}
                onPress={item.cellNo && onPress}>
                : {item.cellNo}
              </Text>
            </View>
          </Card.Content>

          <View style={styles.footer}>
            <Text style={[styles.text, {flex: 1, fontSize: 12}]}>
              Interims Account
            </Text>

            <TouchableOpacity
              onPress={sendSMS}
              style={styles.btn}
              activeOpacity={0.8}>
              {item.accountNumber == ImageId ? (
                <ActivityIndicator color={Colors.primary} size="small" />
              ) : (
                <>
                  <Icon name="send" size={18} color={Colors.primary} />
                  <Text
                    style={[
                      styles.text,
                      {color: Colors.primary, marginLeft: 8},
                    ]}>
                    Send SMS
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </Card>
      );
    } else if (wardType == 'IMS') {
      return (
        <Card style={styles.card}>
          <Card.Content style={{padding: 16}}>
            <View style={styles.cardContent}>
              <View style={styles.iconCircle}>
                <Icon name="warning" size={24} color={Colors.primary} />
              </View>
              <Title style={styles.title}>
                Incident: {item.caseReferenceNumber}
              </Title>
            </View>

            <View style={styles.rowContainer}>
              <Text style={styles.contentText}>Date</Text>
              <Text style={styles.valueText}>: {item.datecreated}</Text>
            </View>

            <View style={styles.rowContainer}>
              <Text style={styles.contentText}>Description</Text>
              <Text numberOfLines={5} style={styles.valueText}>
                : {item.casedescription}
              </Text>
            </View>

            <View style={styles.rowContainer}>
              <Text style={styles.contentText}>Street</Text>
              <Text style={styles.valueText}>: {item.caseStreetName}</Text>
            </View>

            <View style={styles.rowContainer}>
              <Text style={styles.contentText}>Town</Text>
              <Text style={styles.valueText}>: {item.caseTownship}</Text>
            </View>

            <View style={styles.rowContainer}>
              <Text style={styles.contentText}>Service Type</Text>
              <Text style={styles.valueText}>: {item.serviceType}</Text>
            </View>
          </Card.Content>

          <View style={styles.footer}>
            <Text style={[styles.text, {flex: 1, fontSize: 12}]}>
              Department: {item.department}
            </Text>
          </View>
        </Card>
      );
    } else if (wardType == 'Meter' || wardType == 'MetersNotRead') {
      return (
        <Card style={styles.card}>
          <Card.Content style={{padding: 16}}>
            <View style={styles.cardContent}>
              <View style={styles.iconCircle}>
                <Icon name="tachometer" size={20} color={Colors.primary} />
              </View>
              <Title style={styles.title}>Account: {item.accoutno}</Title>
            </View>

            <View style={styles.rowContainer}>
              <Text style={styles.contentText}>Meter</Text>
              <Text style={styles.valueText}>: {item.meteR_NO}</Text>
            </View>

            <View style={styles.rowContainer}>
              <Text style={styles.contentText}>Owner</Text>
              <Text numberOfLines={5} style={styles.valueText}>
                : {item.owneR_NAME}
              </Text>
            </View>

            <View style={styles.rowContainer}>
              <Text style={styles.contentText}>Address</Text>
              <Text style={styles.valueText}>: {item.address}</Text>
            </View>

            <View style={styles.rowContainer}>
              <Text style={styles.contentText}>Previous Reading</Text>
              <Text style={styles.valueText}>: {item.previouS_READING}</Text>
            </View>

            <View style={styles.rowContainer}>
              <Text style={styles.contentText}>Reading Date</Text>
              <Text style={styles.valueText}>: {item.readinG_TAKEN_DATE}</Text>
            </View>
          </Card.Content>

          <View style={styles.footer}>
            <Text style={[styles.text, {flex: 1, fontSize: 12}]}>
              Status: {item.poD_STATUS}
            </Text>

            {wardType == 'Meter' && (
              <TouchableOpacity
                onPress={showImage}
                style={styles.btn}
                activeOpacity={0.8}>
                {imageLoading && item.id == ImageId ? (
                  <ActivityIndicator color={Colors.primary} size="small" />
                ) : (
                  <>
                    <Icon name="image" size={16} color={Colors.primary} />
                    <Text
                      style={[
                        styles.text,
                        {color: Colors.primary, marginLeft: 8},
                      ]}>
                      View Image
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>
        </Card>
      );
    } else if (wardType == 'IMS') {
      let phoneNumber = true;
      if (
        item.cellphonenumber === 'Not Available' ||
        item.cellphonenumber == null
      ) {
        phoneNumber = false;
      }
      return (
        <Card style={styles.card}>
          <Card.Content style={{padding: 16}}>
            <View style={styles.cardContent}>
              <View style={styles.iconCircle}>
                <Icon name="user" size={20} color={Colors.primary} />
              </View>
              <Title style={styles.title}>Account: {item.accountno}</Title>
            </View>

            <View style={styles.rowContainer}>
              <Text style={styles.contentText}>Name</Text>
              <Text style={styles.valueText}>
                : {item.firstname} {item.lastname}
              </Text>
            </View>

            <View style={styles.rowContainer}>
              <Text style={styles.contentText}>Category</Text>
              <Text style={styles.valueText}>: {item.category}</Text>
            </View>

            <View style={styles.rowContainer}>
              <Text style={styles.contentText}>Owner Tenant</Text>
              <Text numberOfLines={5} style={styles.valueText}>
                : {item.ownertenant}
              </Text>
            </View>

            <View style={styles.rowContainer}>
              <Text style={styles.contentText}>Address</Text>
              <Text style={styles.valueText}>: {item.address}</Text>
            </View>

            <View style={styles.rowContainer}>
              <Text style={styles.contentText}>Mobile No</Text>
              <Text
                style={[
                  phoneNumber ? styles.phoneNumber : styles.valueText,
                  {flex: 1},
                ]}
                onPress={onPress}>
                : {item.cellphonenumber}
              </Text>
            </View>
          </Card.Content>

          <View style={styles.footer}>
            <Text style={[styles.text, {flex: 1, fontSize: 12}]}>
              Category: {item.category}
            </Text>
          </View>
        </Card>
      );
    } else if (wardType == 'Property') {
      let phoneNumber = true;
      if (
        item.cellphonenumber === 'Not Available' ||
        item.cellphonenumber == null
      ) {
        phoneNumber = false;
      }
      return (
        <Card style={styles.card}>
          <Card.Content style={{padding: 16}}>
            <View style={styles.cardContent}>
              <View style={styles.iconCircle}>
                <Icon name="building" size={20} color={Colors.primary} />
              </View>
              <Title style={styles.title}>Account: {item.accountnumber}</Title>
            </View>

            <View style={styles.rowContainer}>
              <Text style={styles.contentText}>Name</Text>
              <Text style={styles.valueText}>: {item.accountname}</Text>
            </View>

            <View style={styles.rowContainer}>
              <Text style={styles.contentText}>Address</Text>
              <Text style={styles.valueText}>: {item.addressdetails}</Text>
            </View>

            <View style={styles.rowContainer}>
              <Text style={styles.contentText}>Latitude</Text>
              <Text style={styles.valueText}>: {item.locationlatitude}</Text>
            </View>

            <View style={styles.rowContainer}>
              <Text style={styles.contentText}>Longitude</Text>
              <Text style={styles.valueText}>: {item.locationlongitude}</Text>
            </View>

            <View style={styles.rowContainer}>
              <Text style={styles.contentText}>Mobile No</Text>
              <Text
                style={[
                  phoneNumber ? styles.phoneNumber : styles.valueText,
                  {flex: 1},
                ]}
                onPress={onPress}>
                : {item.cellphonenumber}
              </Text>
            </View>
          </Card.Content>

          <View style={styles.footer}>
            <Text style={[styles.text, {flex: 1, fontSize: 12}]}>
              Property Location
            </Text>

            {item.locationlatitude && item.locationlongitude && (
              <TouchableOpacity
                onPress={showMap}
                style={styles.btn}
                activeOpacity={0.8}>
                <Icon name="map-marker" size={16} color={Colors.primary} />
                <Text
                  style={[styles.text, {color: Colors.primary, marginLeft: 8}]}>
                  View Map
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </Card>
      );
    } else if (wardType == 'Indigent') {
      return (
        <Card style={styles.card}>
          <Card.Content style={{padding: 16}}>
            <View style={styles.cardContent}>
              <View style={styles.iconCircle}>
                <Icon name="hand-paper-o" size={20} color={Colors.primary} />
              </View>
              <Title style={styles.title}>Account: {item.account}</Title>
            </View>

            <View style={styles.rowContainer}>
              <Text style={styles.contentText}>Name</Text>
              <Text style={styles.valueText}>: {item.name}</Text>
            </View>

            <View style={styles.rowContainer}>
              <Text style={styles.contentText}>Marital</Text>
              <Text style={styles.valueText}>: {item.maritalStatus}</Text>
            </View>

            <View style={styles.rowContainer}>
              <Text style={styles.contentText}>Address</Text>
              <Text style={styles.valueText}>: {item.address}</Text>
            </View>

            <View style={styles.rowContainer}>
              <Text style={styles.contentText}>Source Of Income</Text>
              <Text style={styles.valueText}>: {item.sourceOfIncome}</Text>
            </View>

            <View style={styles.rowContainer}>
              <Text style={styles.contentText}>No Of Properties</Text>
              <Text style={styles.valueText}>: {item.numberOfProperties}</Text>
            </View>

            <View style={styles.rowContainer}>
              <Text style={styles.contentText}>Property Value</Text>
              <Text style={styles.valueText}>
                :{' '}
                {formattedAmount(
                  parseFloat(item.propertyValue ? item.propertyValue : 0),
                  'en-ZA',
                  'ZAR',
                  'currency',
                )}
              </Text>
            </View>

            <View style={styles.rowContainer}>
              <Text style={styles.contentText}>Mobile No</Text>
              <Text
                style={[
                  item.cell ? styles.phoneNumber : styles.valueText,
                  {flex: 1},
                ]}
                onPress={item.cell && onPress}>
                : {item.cell}
              </Text>
            </View>
          </Card.Content>

          <View style={styles.footer}>
            <Text style={[styles.text, {flex: 1, fontSize: 12}]}>
              Household Income:{' '}
              {formattedAmount(
                parseFloat(item.householdIncome ? item.householdIncome : 0),
                'en-ZA',
                'ZAR',
                'currency',
              )}
            </Text>
          </View>
        </Card>
      );
    }
  };

  return (
    <View style={styles.container}>
      <TownshipCardItem />
    </View>
  );
};

export default TownshipCard;

const styles = StyleSheet.create({
  container: {
    padding: 5,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginHorizontal: 0,
    marginVertical: 4,
    shadowColor: '#1E40AF',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: Colors.yellow,
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F4F8',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 16,
  },
  title: {
    paddingLeft: 12,
    color: '#1E3A8A',
    fontWeight: '800',
    fontSize: 15,
    letterSpacing: 0.3,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 8,
  },
  btn: {
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 0.3,
  },
  phoneNumber: {
    color: Colors.primary,
    textDecorationLine: 'underline',
    fontWeight: '700',
  },
  contentText: {
    fontWeight: '600',
    fontSize: 12,
    color: '#475569',
    width: 100,
    letterSpacing: 0.2,
  },
  valueText: {
    fontWeight: '700',
    fontSize: 13,
    color: '#0F172A',
    flex: 1,
    letterSpacing: 0.2,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
    alignItems: 'flex-start',
  },
  amountText: {
    fontWeight: '800',
    fontSize: 13,
    color: Colors.red,
    flex: 1,
  },
});
