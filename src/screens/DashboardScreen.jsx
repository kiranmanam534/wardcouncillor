import {
  ActivityIndicator,
  Alert,
  Button,
  Dimensions,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Card} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';

import {Colors} from '../constant/Colors';
import {getCouncillorWardDashboardApi} from '../services/councillorWardApi';
import {getValueByKey} from '../utility/getValueByKey';
import {formattedAmount} from '../utility/FormattedAmmount';
import LoaderModal from '../components/LoaderModal';
import {GetwardHeaderTitle} from '../utility/Commom';
import {MayorSelectedWardActions} from '../redux/MayorSelectedWardSlice';
import {apiUrl} from '../constant/CommonData';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const logo = require('../assets/images/BCX-LOGO.png');

const screenWidth = Dimensions.get('window').width;

const DashboardScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [isRefresh, setIsRefresh] = useState(false);
  const [IsDataMaintaince, setIsDataMaintaince] = useState(false);
  const [DataMaintaince, setDataMaintaince] = useState(null);
  const [IsDataMaintainceLoding, setIsDataMaintainceLoding] = useState(false);

  const loggedUser = useSelector(state => state.loginReducer.items);

  const loggedUserNme = useSelector(state => state.loginReducer.loggedUserName);

  const {items, isLoading, error} = useSelector(
    state => state.WardDashboardReducer,
  );

  // const { items: DataLoadedItems, isLoading: isDataLoading, error: errorDataLoaded, isDataLoaded } = useSelector(
  //   state => state.DataLoadDetailsReducer,
  // );

  // console.log("DataLoadedItems", DataLoadedItems)
  // console.log("isDataLoaded", isDataLoaded)
  console.log('items', items);

  const getDataMaintainceInfo = async () => {
    try {
      setIsDataMaintainceLoding(true);
      console.log(
        'getDataMaintainceInfo',
        `${apiUrl}/api/CouncillorWard/GetDataLoadDetails`,
      );
      const response = await axios.post(
        `${apiUrl}/api/CouncillorWard/GetDataLoadDetails`,
      );
      console.log(response.data.data);
      const res = response.data.data;
      if (res[0].name == 'LOADED') {
        console.log(res[0]);
        setIsDataMaintaince(false);
        setDataMaintaince(res[0]);
        dispatch(getCouncillorWardDashboardApi(loggedUser?.warD_NO));
      } else {
        setIsDataMaintaince(true);
      }
      setIsDataMaintainceLoding(false);
      setIsRefresh(false);
    } catch (error) {
      console.log(error);
      setIsDataMaintaince(true);
      setIsDataMaintainceLoding(false);
      setIsRefresh(false);
    }
  };

  useEffect(() => {
    getDataMaintainceInfo();
  }, [loggedUser?.warD_NO]);

  // useEffect(() => {
  //   dispatch(GetDataLoadDetailsApi());
  // }, []);

  const RefreshData = () => {
    setIsRefresh(true);
    // dispatch(GetDataLoadDetailsApi());
    getDataMaintainceInfo();
  };

  const handleDetailsNavigation = (navigationText, title, wardType) => {
    dispatch(MayorSelectedWardActions.clearSelectedWardNo());
    navigation.navigate(navigationText, {
      title:
        loggedUser?.warD_NO != 0
          ? loggedUser?.warD_NO + ' - ' + GetwardHeaderTitle(wardType, title)
          : GetwardHeaderTitle(wardType, title),
      wardType: wardType,
    });
  };

  if (IsDataMaintainceLoding && !isRefresh) {
    return (
      <LoaderModal visible={IsDataMaintainceLoding} loadingText="Loading..." />
    );
  }

  const ShowMessageData = () => {
    return (
      <View style={styles.container}>
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
            padding: 5,
          }}>
          <Text
            style={{
              fontSize: 17,
              fontWeight: '600',
              color: Colors.white,
              paddingLeft: 5,
            }}>
            <Icon name="user" size={17} color={Colors.yellow} />
            {'  '}
            Hello, <Text style={{color: Colors.white}}>{loggedUserNme} </Text>
          </Text>
          <Text
            style={{
              fontSize: 17,
              fontWeight: '600',
              color: Colors.white,
              textAlign: 'right',
              paddingRight: 10,
            }}>
            Ward : {loggedUser?.warD_NO}
          </Text>
        </View>

        <View style={[styles1.container]}>
          <View style={styles1.card}>
            <View style={styles1.iconContainer}>
              <View style={styles1.box}>
                <Image source={logo} style={styles1.img} />
              </View>
            </View>
            <View style={{flexDirection: 'row', height: 'auto'}}>
              <View style={styles1.content}>
                <Text style={[styles1.title, {paddingTop: 5}]}>
                  Under Maintenance
                </Text>
                <Text style={styles1.description}>
                  Due to planned system maintenance, application will not be
                  accessable during the maintenance period.
                </Text>
                <Text
                  style={[
                    styles1.description,
                    {color: Colors.primary, paddingTop: 10},
                  ]}>
                  We appreciate your patience during this time!
                </Text>
              </View>
            </View>

            <View style={{marginTop: 20}}>
              <TouchableOpacity
                onPress={RefreshData}
                style={{
                  height: 50,
                  width: 100,
                  backgroundColor: Colors.primary,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 25,
                  flexDirection: 'row',
                }}>
                {isRefresh ? (
                  <ActivityIndicator
                    animating={true}
                    color="#000"
                    size="small"
                  />
                ) : (
                  <Text style={{color: Colors.white, fontSize: 15}}>
                    Refresh
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <>
      {IsDataMaintaince ? (
        <ShowMessageData />
      ) : (
        <View style={styles.container}>
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
              padding: 5,
            }}>
            <Text
              style={{
                fontSize: 17,
                fontWeight: '600',
                color: Colors.white,
                paddingLeft: 5,
              }}>
              <Icon name="user" size={17} color={Colors.yellow} />
              {'  '}
              Hello, <Text style={{color: Colors.white}}>{loggedUserNme} </Text>
            </Text>
            <Text
              style={{
                fontSize: 17,
                fontWeight: '600',
                color: Colors.white,
                textAlign: 'right',
                paddingRight: 10,
              }}>
              Ward : {loggedUser?.warD_NO}
            </Text>
            <Text
              style={{
                fontSize: 12,
                // fontWeight: '800',
                color: Colors.white,
                textAlign: 'right',
              }}>
              Last data refreshed: {DataMaintaince?.value}
            </Text>
          </View>
          <ScrollView>
            <View style={{marginBottom: 150}}>
              <View style={styles.row}>
                <Card
                  onPress={() => {
                    if (loggedUser?.warD_NO == 0) {
                      handleDetailsNavigation(
                        'MayorOutstandingDashboard',
                        'Oustanding Dashboard',
                        'Outstanding',
                      );
                    } else {
                      handleDetailsNavigation(
                        'CouncillorDetails',
                        'Oustanding Debt',
                        'Outstanding',
                      );
                    }
                  }}
                  style={[styles.card, {backgroundColor: Colors.primary}]}
                  mode="outlined">
                  <Card.Title
                    title="Outstanding Debt"
                    titleNumberOfLines={2}
                    titleStyle={{color: Colors.white, fontSize: 14}}
                  />
                  <Card.Content>
                    <Text></Text>
                    <Text variant="titleLarge" style={styles.text}>
                      {formattedAmount(
                        parseFloat(getValueByKey(items, 'Outstanding Amount')),
                        'en-ZA',
                        'ZAR',
                        'currency',
                      )}
                    </Text>
                  </Card.Content>
                  <Card.Actions>
                    <View style={styles.button}>
                      <Text style={[styles.buttonText]}>View</Text>
                    </View>
                  </Card.Actions>
                </Card>
                <Card
                  onPress={() => {
                    handleDetailsNavigation(
                      'CouncillorDetails',
                      'Interims',
                      'Interims',
                    );
                  }}
                  style={[styles.card, {backgroundColor: Colors.yellow}]}
                  mode="outlined">
                  <Card.Title
                    title="Interims"
                    titleStyle={{color: Colors.white, fontSize: 14}}
                  />
                  <Card.Content>
                    <Text></Text>
                    <Text variant="titleLarge" style={styles.text}>
                      {parseInt(getValueByKey(items, 'Interims'))}
                    </Text>
                  </Card.Content>
                  <Card.Actions>
                    <View style={styles.button}>
                      <Text style={styles.buttonText}>View</Text>
                    </View>
                  </Card.Actions>
                </Card>
              </View>
              <View style={styles.row}>
                <Card
                  onPress={() => {
                    handleDetailsNavigation(
                      'CouncillorDetails',
                      'Incidents/Complaints',
                      'IMS',
                    );
                  }}
                  style={[styles.card, {backgroundColor: Colors.blue}]}
                  mode="outlined">
                  <Card.Title
                    title="Incidents/Complaints"
                    titleStyle={{color: Colors.white, fontSize: 14}}
                    titleNumberOfLines={2}
                  />
                  <Card.Content>
                    <Text></Text>
                    <Text variant="titleLarge" style={styles.text}>
                      {parseInt(getValueByKey(items, 'IMS'))}
                    </Text>
                  </Card.Content>
                  <Card.Actions>
                    <View style={styles.button}>
                      <Text style={styles.buttonText}>View</Text>
                    </View>
                  </Card.Actions>
                </Card>
                <Card
                  onPress={() => {
                    handleDetailsNavigation(
                      'CouncillorDetails',
                      'Total Water and Electricity Meters',
                      'Meter',
                    );
                  }}
                  style={[styles.card, {backgroundColor: Colors.red}]}
                  mode="outlined">
                  <Card.Title
                    title="Total Water and Electricity Meters"
                    titleStyle={{color: Colors.white, fontSize: 14}}
                    titleNumberOfLines={2}
                  />
                  <Card.Content>
                    <Text></Text>
                    <Text variant="titleLarge" style={styles.text}>
                      {parseFloat(
                        getValueByKey(items, 'Water and Electricity Meters'),
                      )}
                    </Text>
                  </Card.Content>
                  <Card.Actions>
                    <View style={styles.button}>
                      <Text style={styles.buttonText}>View</Text>
                    </View>
                  </Card.Actions>
                </Card>
              </View>
              <View style={styles.row}>
                <Card
                  onPress={() => {
                    handleDetailsNavigation(
                      'CouncillorDetails',
                      'City’s Total Properties',
                      'Property',
                    );
                  }}
                  style={[styles.card, {backgroundColor: Colors.primary}]}
                  mode="outlined">
                  <Card.Title
                    title="City’s Total Properties"
                    titleNumberOfLines={2}
                    titleStyle={{color: Colors.white, fontSize: 14}}
                  />
                  <Card.Content>
                    <Text></Text>
                    <Text variant="titleLarge" style={styles.text}>
                      {parseInt(getValueByKey(items, 'Total Properties'))}
                    </Text>
                  </Card.Content>
                  <Card.Actions>
                    <View style={styles.button}>
                      <Text style={[styles.buttonText]}>View</Text>
                    </View>
                  </Card.Actions>
                </Card>
                <Card
                  onPress={() => {
                    handleDetailsNavigation(
                      'CouncillorDetails',
                      'City’s Total Customers',
                      'Customer',
                    );
                  }}
                  style={[styles.card, {backgroundColor: Colors.yellow}]}
                  mode="outlined">
                  <Card.Title
                    title="City’s Total Customers"
                    titleNumberOfLines={2}
                    titleStyle={{color: Colors.white, fontSize: 14}}
                  />
                  <Card.Content>
                    <Text></Text>
                    <Text variant="titleLarge" style={styles.text}>
                      {parseInt(getValueByKey(items, 'Total Customers'))}
                    </Text>
                  </Card.Content>
                  <Card.Actions>
                    <View style={styles.button}>
                      <Text style={styles.buttonText}>View</Text>
                    </View>
                  </Card.Actions>
                </Card>
              </View>

              <View style={styles.row}>
                <Card
                  onPress={() => {
                    handleDetailsNavigation(
                      'CouncillorDetails',
                      'Meters Not Read',
                      'MetersNotRead',
                    );
                  }}
                  style={[styles.card, {backgroundColor: Colors.blue}]}
                  mode="outlined">
                  <Card.Title
                    title="Meters Not Read"
                    titleStyle={{color: Colors.white, fontSize: 14}}
                  />
                  <Card.Content>
                    <Text></Text>
                    <Text variant="titleLarge" style={styles.text}>
                      {parseInt(getValueByKey(items, 'Not Read Meters'))}
                    </Text>
                  </Card.Content>
                  <Card.Actions>
                    <View style={styles.button}>
                      <Text style={styles.buttonText}>View</Text>
                    </View>
                  </Card.Actions>
                </Card>
                <Card
                  onPress={() => {
                    handleDetailsNavigation(
                      'Customer360',
                      'Customer 360',
                      'Customer360',
                    );
                  }}
                  style={[styles.card, {backgroundColor: Colors.red}]}
                  mode="outlined">
                  <Card.Title
                    title="Customer 360"
                    titleStyle={{color: Colors.white, fontSize: 14}}
                  />
                  <Card.Content>
                    <Text></Text>
                    <Text variant="titleLarge" style={styles.text}></Text>
                  </Card.Content>
                  <Card.Actions>
                    <View style={styles.button}>
                      <Text style={styles.buttonText}>View</Text>
                    </View>
                  </Card.Actions>
                </Card>
              </View>
              <View style={styles.row}>
                <Card
                  onPress={() => {
                    // handleDetailsNavigation('Collections', 'Collections', 'Collections');
                    if (loggedUser?.warD_NO == 0) {
                      handleDetailsNavigation(
                        'Collections',
                        'Collections',
                        'Collections',
                      );
                    } else {
                      handleDetailsNavigation(
                        'Collections',
                        'Collections',
                        'Collections',
                      );
                      // handleDetailsNavigation(
                      //   'CollectionsBarChart',
                      //   'Collections Bar chart',
                      //   'Collections',
                      // );
                    }
                  }}
                  style={[styles.card, {backgroundColor: Colors.primary}]}
                  mode="outlined">
                  <Card.Title
                    title="Collections"
                    titleStyle={{color: Colors.white, fontSize: 14}}
                  />
                  <Card.Content>
                    <Text></Text>
                    <Text variant="titleLarge" style={styles.text}></Text>
                  </Card.Content>
                  <Card.Actions>
                    <View style={styles.button}>
                      <Text style={styles.buttonText}>View</Text>
                    </View>
                  </Card.Actions>
                </Card>

                <Card
                  onPress={() => {
                    handleDetailsNavigation(
                      'CouncillorDetails',
                      'Indigent',
                      'Indigent',
                    );
                  }}
                  style={[styles.card, {backgroundColor: Colors.yellow}]}
                  mode="outlined">
                  <Card.Title
                    title="Indigent Applications"
                    titleStyle={{color: Colors.white, fontSize: 14}}
                  />
                  <Card.Content>
                    <Text></Text>
                    <Text variant="titleLarge" style={styles.text}>
                      {parseInt(getValueByKey(items, 'Indigent'))}
                    </Text>
                  </Card.Content>
                  <Card.Actions>
                    <View style={styles.button}>
                      <Text style={styles.buttonText}>View</Text>
                    </View>
                  </Card.Actions>
                </Card>
              </View>
            </View>
          </ScrollView>
        </View>
      )}
    </>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%', // Adjust the width based on your requirement
    marginVertical: 3,
  },
  button: {
    width: '100%',
    borderTopColor: Colors.white,
    borderTopWidth: 1,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: Colors.white,
    fontSize: 14,
    textTransform: 'uppercase',
  },
  text: {
    fontSize: 12,
    fontWeight: '900',
    color: Colors.white,
  },
});

const styles1 = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  card: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f1f2',
    borderRadius: 10,
    padding: 20,
    margin: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
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
    color: Colors.red,
  },
  description: {
    fontSize: 16,
    color: Colors.blue,
  },
  box: {
    width: 70,
    height: 70,
    borderWidth: 1, // Border width in pixels
    borderColor: Colors.blue,
    borderRadius: (screenWidth - 50) / 2, // Border radius (optional)
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    alignSelf: 'center',
    elevation: 1,
  },
  img: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
});
