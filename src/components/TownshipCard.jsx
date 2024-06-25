import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import { Card, Title, Paragraph, Divider } from 'react-native-paper';

import { Colors } from '../constant/Colors';
import { formattedAmount } from '../utility/FormattedAmmount';

const TownshipCard = ({ item, wardType, onPress, sendSMS, name, showImage, imageLoading, ImageId, showMap }) => {
  // console.log(item.id,ImageId)

  const TownshipCardItem = () => {
    if (['Outstanding', 'OutstandingCategory'].includes(wardType)) {
      let phoneNumber = true;
      if (item.cellphonenumber === 'Not Available' || item.cellphonenumber == null) {
        phoneNumber = false;
      }

      if (name === 'D30_DAYS') name = "30 days amount"
      if (name === 'D60_DAYS') name = "60 days amount"
      if (name === 'D90_DAYS') name = "90 days amount"
      if (name === 'D120_PLUS') name = "120+ days amount"
      return (
        <Card style={styles.card}>
          <Card.Content style={{ paddingRight: 80 }}>
            <View style={styles.cardContent}>
              <Icon name="user" size={30} color={Colors.blue} />
              <Title style={styles.title}>Account :{item.accounT_NO}</Title>
            </View>
            <View style={{ flexDirection: 'row', paddingTop: 10 }}>
              <Text style={styles.contentText}>Customer</Text>
              <Text
                style={{ fontWeight: '800', fontSize: 13, color: Colors.black }}>
                : {item.customeR_NAME}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', paddingTop: 10 }}>
              <Text style={styles.contentText}>Address</Text>
              <Text
                style={{ fontWeight: '800', fontSize: 13, color: Colors.black }}>
                : {item.streeT_NAME_NO}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', paddingTop: 10 }}>
              <Text style={styles.contentText}>Mobile No</Text>
              <Text
                style={[
                  styles.phoneNumber,
                  {
                    fontWeight: '800',
                    fontSize: 13,
                    textDecorationLine: phoneNumber ? 'underline' : 'none',
                  },
                ]}
                onPress={onPress}>
                : {item.cellphonenumber}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', paddingTop: 10 }}>
              <Text style={styles.contentText}>Ward No</Text>
              <Text
                style={{ fontWeight: '800', fontSize: 13, color: Colors.black }}>
                : {item.ward}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', paddingTop: 10 }}>
              <Text style={styles.contentText}>{name}</Text>
              <Text
                style={{ fontWeight: '800', fontSize: 13, color: Colors.red }}>
                :  {formattedAmount(
                  parseFloat(item.daysAmount),
                  'en-ZA',
                  'ZAR',
                  'currency',
                )}
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
            <Paragraph style={[styles.text, { fontSize: 13, paddingTop: 10 }]}>
              Total Amount: {['Outstanding', 'OutstandingCategory'].includes(wardType)
                ? formattedAmount(
                  parseFloat(item.totalAmount),
                  'en-ZA',
                  'ZAR',
                  'currency',
                )
                : item.totalAmount}
            </Paragraph>
            <View style={{ marginTop: 15 }}>
              <TouchableOpacity
                onPress={sendSMS}
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
                  {item.accounT_NO == ImageId ?
                    <ActivityIndicator animatin color="#000" size="small" /> :
                    <Icon name="send" size={20} color={Colors.blue} />}

                  <Text
                    style={[
                      styles.text,
                      { fontSize: 16, color: Colors.blue, paddingLeft: 5 },
                    ]}>
                    Send
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </Card.Content>
        </Card>
      );
    } else if (wardType == 'Interims') {
      return (
        <Card style={styles.card}>
          <Card.Content style={{ paddingRight: 80 }}>
            <View style={styles.cardContent}>
              <Icon name="user" size={30} color={Colors.blue} />
              <Title style={styles.title}>
                Account :{item.accountNumber}
              </Title>
            </View>
            <View style={{ flexDirection: 'row', paddingTop: 20 }}>
              <Text style={styles.contentText}>Customer</Text>
              <Text
                style={{ fontWeight: '800', fontSize: 13, color: Colors.black }}>
                : {item.debtorName}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', paddingTop: 10 }}>
              <Text style={styles.contentText}>Meter</Text>
              <Text
                style={{ fontWeight: '800', fontSize: 13, color: Colors.black }}>
                : {item.meterNumber}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', paddingTop: 10 }}>
              <Text style={styles.contentText}>Zone</Text>
              <Text
                style={{ fontWeight: '800', fontSize: 13, color: Colors.black }}>
                : {item.zoning}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', paddingTop: 10 }}>
              <Text style={styles.contentText}>Address</Text>
              <Text
                style={{ fontWeight: '800', fontSize: 13, color: Colors.black }}>
                : {item.physicalAddress}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', paddingTop: 10 }}>
              <Text style={styles.contentText}>Reason</Text>
              <Text
                style={{ fontWeight: '800', fontSize: 13, color: Colors.black }}>
                : {item.interimsReason}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', paddingTop: 10 }}>
              <Text style={styles.contentText}>Mobile No</Text>
              <Text
                style={[
                  styles.phoneNumber,
                  {
                    fontWeight: '800',
                    fontSize: 13,
                    textDecorationLine: item.cellNo && 'underline',
                  },
                ]}
                onPress={item.cellNo && onPress}>
                : {item.cellNo}
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
            <Paragraph style={[styles.text, { fontSize: 13, paddingTop: 10 }]}>
              {wardType == 'Outstanding'
                ? formattedAmount(
                  parseFloat(item.daysAmount),
                  'en-ZA',
                  'ZAR',
                  'currency',
                )
                : item.daysAmount}
            </Paragraph>
            <View style={{ marginTop: 15 }}>
              <TouchableOpacity
               onPress={sendSMS}
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
                 {item.accountNumber == ImageId ?
                    <ActivityIndicator animatin color="#000" size="small" /> :
                    <Icon name="send" size={20} color={Colors.blue} />}

                  <Text
                    style={[
                      styles.text,
                      { fontSize: 16, color: Colors.blue, paddingLeft: 5 },
                    ]}>
                    Send
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </Card.Content>
        </Card>
      );
    } else if (wardType == 'IMS') {
      return (
        <Card style={styles.card}>
          <Card.Content style={{ paddingRight: 90 }}>
            <View style={styles.cardContent}>
              <Icon name="user" size={25} color={Colors.blue} />
              <Title style={styles.title}>{item.caseReferenceNumber}</Title>
            </View>
            <View style={{ flexDirection: 'row', paddingTop: 20 }}>
              <Text style={styles.contentText}>Date</Text>
              <Text
                style={{ fontWeight: '800', fontSize: 13, color: Colors.black }}>
                : {item.datecreated}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', paddingTop: 10 }}>
              <Text style={styles.contentText}>Description</Text>
              <Text
                numberOfLines={5}
                style={{ fontWeight: '800', fontSize: 13, color: Colors.black }}>
                : {item.casedescription}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', paddingTop: 10 }}>
              <Text style={styles.contentText}>Street</Text>
              <Text
                style={{ fontWeight: '800', fontSize: 13, color: Colors.black }}>
                : {item.caseStreetName}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', paddingTop: 10 }}>
              <Text style={styles.contentText}>Town</Text>
              <Text
                style={{ fontWeight: '800', fontSize: 13, color: Colors.black }}>
                : {item.caseTownship}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', paddingTop: 10 }}>
              <Text style={styles.contentText}>Service Type</Text>
              <Text
                style={{ fontWeight: '800', fontSize: 13, color: Colors.black }}>
                : {item.serviceType}
              </Text>
            </View>
            {/* <View style={{ flexDirection: 'row', paddingTop: 10 }}>
              <Text style={styles.contentText}>Department</Text>
              <Text
                style={{ fontWeight: '800', fontSize: 13, color: Colors.black }}>
                : {item.department}
              </Text>
            </View> */}
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
            <Paragraph style={[styles.text, { fontSize: 13, paddingTop: 10 }]}>
            <View style={{ flexDirection: 'row', paddingTop: 10 }}>
              <Text style={[styles.contentText,{color:Colors.white}]}>Department : </Text>
              <Text
                style={{ fontWeight: '800', fontSize: 13,color:Colors.white}}>
                {item.department}
              </Text>
            </View>
              {/* {wardType == 'Outstanding'
                ? formattedAmount(
                  parseFloat(item.daysAmount),
                  'en-ZA',
                  'ZAR',
                  'currency',
                )
                : item.daysAmount} */}
            </Paragraph>
            {/* <View style={{ marginTop: 15 }}>
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
                  <Icon name="send" size={20} color={Colors.blue} />
                  <Text
                    style={[
                      styles.text,
                      { fontSize: 16, color: Colors.blue, paddingLeft: 5 },
                    ]}>
                    Send
                  </Text>
                </View>
              </TouchableOpacity>
            </View> */}
          </Card.Content>
        </Card>
      );
    }
    else if (wardType == 'Meter' || wardType == 'MetersNotRead') {
      return (
        <Card style={styles.card}>
          <Card.Content style={{ paddingRight: 90 }}>
            <View style={styles.cardContent}>
              <Icon name="user" size={25} color={Colors.blue} />
              <Title style={styles.title}>Account :{item.accoutno}</Title>
            </View>
            <View style={{ flexDirection: 'row', paddingTop: 20 }}>
              <Text style={styles.contentText}>Meter</Text>
              <Text
                style={{ fontWeight: '900', fontSize: 14, color: Colors.black }}>
                : {item.meteR_NO}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', paddingTop: 10 }}>
              <Text style={styles.contentText}>Owner</Text>
              <Text
                numberOfLines={5}
                style={{ fontWeight: '800', fontSize: 13, color: Colors.black }}>
                : {item.owneR_NAME}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', paddingTop: 10 }}>
              <Text style={styles.contentText}>Address</Text>
              <Text
                style={{ fontWeight: '800', fontSize: 13, color: Colors.black }}>
                : {item.address}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', paddingTop: 10 }}>
              <Text style={styles.contentText}>Previous Reading</Text>
              <Text
                style={{ fontWeight: '800', fontSize: 13, color: Colors.black }}>
                : {item.previouS_READING}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', paddingTop: 10 }}>
              <Text style={styles.contentText}>Reading Date</Text>
              <Text
                style={{ fontWeight: '800', fontSize: 13, color: Colors.black }}>
                : {item.readinG_TAKEN_DATE}
              </Text>
            </View>
            {/* <View style={{flexDirection: 'row', paddingTop: 10}}>
              <Text style={styles.contentText}>Status</Text>
              <Text
                style={{fontWeight: '800', fontSize: 13, color: Colors.black}}>
                : {item.poD_STATUS}
              </Text>
            </View> */}
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
            <Paragraph style={[styles.text, { fontSize: 13, paddingTop: 10 }]}>
              Status : {item.poD_STATUS}
            </Paragraph>
            {wardType == 'Meter' &&
              <View style={{ marginTop: 15 }}>
                <TouchableOpacity
                  onPress={showImage}
                  style={[
                    styles.btn,
                    {
                      height: 30,
                      width: 150,
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
                    {imageLoading && item.id == ImageId ?
                      <ActivityIndicator animatin color="#000" size="small" /> :
                      <Icon name="image" size={20} color={Colors.blue} />}

                    <Text
                      style={[
                        styles.text,
                        { fontSize: 16, color: Colors.blue, paddingLeft: 5 },
                      ]}>
                      View Image
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>}
          </Card.Content>
        </Card>
      );
    }
    else if (wardType == 'Customer') {
      let phoneNumber = true;
      if (item.cellphonenumber === 'Not Available' || item.cellphonenumber == null) {
        phoneNumber = false;
      }
      return (
        <Card style={styles.card}>
          <Card.Content style={{ paddingRight: 90 }}>
            <View style={styles.cardContent}>
              <Icon name="user" size={25} color={Colors.blue} />
              <Title style={styles.title}>Account :{item.accountno}</Title>
            </View>
            <View style={{ flexDirection: 'row', paddingTop: 20 }}>
              <Text style={styles.contentText}>Name</Text>
              <Text
                style={{ fontWeight: '900', fontSize: 14, color: Colors.black }}>
                : {item.firstname} {item.lastname}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', paddingTop: 20 }}>
              <Text style={styles.contentText}>Category</Text>
              <Text
                style={{ fontWeight: '900', fontSize: 14, color: Colors.black }}>
                : {item.category}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', paddingTop: 10 }}>
              <Text style={styles.contentText}>Owner Tenant</Text>
              <Text
                numberOfLines={5}
                style={{ fontWeight: '800', fontSize: 13, color: Colors.black }}>
                : {item.ownertenant}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', paddingTop: 10 }}>
              <Text style={styles.contentText}>Address</Text>
              <Text
                style={{ fontWeight: '800', fontSize: 13, color: Colors.black }}>
                : {item.address}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', paddingTop: 10 }}>
              <Text style={styles.contentText}>Mobile No</Text>
              <Text
                style={[
                  styles.phoneNumber,
                  {
                    fontWeight: '800',
                    fontSize: 13,
                    textDecorationLine: phoneNumber ? 'underline' : 'none',
                  },
                ]}
                onPress={onPress}>
                : {item.cellphonenumber}
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
            <Paragraph style={[styles.text, { fontSize: 13, paddingTop: 10 }]}>
              Category : {item.category}
            </Paragraph>
            {/* <View style={{marginTop: 15}}>
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
                  <Icon name="send" size={20} color={Colors.blue} />
                  <Text
                    style={[
                      styles.text,
                      {fontSize: 16, color: Colors.blue, paddingLeft: 5},
                    ]}>
                    Send
                  </Text>
                </View>
              </TouchableOpacity>
            </View> */}
          </Card.Content>
        </Card>
      );
    } else if (wardType == 'Property') {
      let phoneNumber = true;
      if (item.cellphonenumber === 'Not Available' || item.cellphonenumber == null) {
        phoneNumber = false;
      }
      return (
        <Card style={styles.card}>
          <Card.Content style={{ paddingRight: 90 }}>
            <View style={styles.cardContent}>
              <Icon name="user" size={25} color={Colors.blue} />
              <Title style={styles.title}>Account :{item.accountnumber}</Title>
            </View>
            <View style={{ flexDirection: 'row', paddingTop: 10 }}>
              <Text style={styles.contentText}>Name</Text>
              <Text
                style={{ fontWeight: '800', fontSize: 13, color: Colors.black }}>
                : {item.accountname}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', paddingTop: 10 }}>
              <Text style={styles.contentText}>Address</Text>
              <Text
                style={{ fontWeight: '800', fontSize: 13, color: Colors.black }}>
                : {item.addressdetails}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', paddingTop: 10 }}>
              <Text style={styles.contentText}>Latitude</Text>
              <Text
                style={{ fontWeight: '800', fontSize: 13, color: Colors.black }}>
                : {item.locationlatitude}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', paddingTop: 10 }}>
              <Text style={styles.contentText}>Longitude</Text>
              <Text
                style={{ fontWeight: '800', fontSize: 13, color: Colors.black }}>
                : {item.locationlongitude}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', paddingTop: 10 }}>
              <Text style={styles.contentText}>Mobile No</Text>
              <Text
                style={[
                  styles.phoneNumber,
                  {
                    fontWeight: '800',
                    fontSize: 13,
                    textDecorationLine: phoneNumber ? 'underline' : 'none',
                  },
                ]}
                onPress={onPress}>
                : {item.cellphonenumber}
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
            <Paragraph style={[styles.text, { fontSize: 13, paddingTop: 10 }]}>
              {/* Account Name : {item.accountname} */}
            </Paragraph>
            {item.locationlatitude && item.locationlongitude &&
              <View style={{ marginTop: 15 }}>
                <TouchableOpacity
                  onPress={showMap}
                  style={[
                    styles.btn,
                    {
                      height: 30,
                      width: 120,
                      backgroundColor: Colors.white,
                      borderRadius: 60,
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
                    {/* {item.accountnumber==ImageId ?
                      <ActivityIndicator animatin color="#000" size="small" /> :
                      <Icon name="map-marker" size={25} color={Colors.blue} />} */}
                    <Icon name="map-marker" size={25} color={Colors.blue} />
                    <Text
                      style={[
                        styles.text,
                        { fontSize: 16, color: Colors.blue, paddingLeft: 5 },
                      ]}>
                      View Map
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>}
          </Card.Content>
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
