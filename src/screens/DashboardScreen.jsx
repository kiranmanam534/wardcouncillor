import {
  ActivityIndicator,
  Alert,
  Button,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import { Colors } from '../constant/Colors';
import { GetDataLoadDetailsApi, getCouncillorWardDashboardApi } from '../services/councillorWardApi';
import { clearData, getData } from '../session/session';
import { getValueByKey } from '../utility/getValueByKey';
import { formattedAmount } from '../utility/FormattedAmmount';
import LoaderModal from '../components/LoaderModal';
import { GetwardHeaderTitle } from '../utility/Commom';
import { MayorSelectedWardActions } from '../redux/MayorSelectedWardSlice';
const logo = require('../assets/images/Ekurhuleni-Logo-889x1024.png');

const screenWidth = Dimensions.get('window').width;

const DashboardScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [isRefresh, setIsRefresh] = useState(false)

  const loggedUser = useSelector(state => state.loginReducer.items);

  const loggedUserNme = useSelector(state => state.loginReducer.loggedUserName);

  const { items, isLoading, error } = useSelector(
    state => state.WardDashboardReducer,
  );

  const { items: DataLoadedItems, isLoading: isDataLoading, error: errorDataLoaded, isDataLoaded } = useSelector(
    state => state.DataLoadDetailsReducer,
  );

  console.log("DataLoadedItems", DataLoadedItems)
  console.log("isDataLoaded", isDataLoaded)
  console.log("items", items)



  // useEffect(() => {
  //   const getLoggedUserName = async () => {
  //     try {
  //       const user = await AsyncStorage.getItem('loggedUserName');
  //       console.log("bootstrapAsync")
  //       console.log(user)
  //       if (user) {
  //         dispatch(authSliceActions.login(JSON.parse(user)));
  //       }
  //     } catch (e) {
  //       console.error('Error retrieving user token', e);
  //     }
  //   };
  //   getLoggedUserName();
  // }, [dispatch]);
  // useEffect(()=>{
  //   getData("loggedUserName")
  // },[])

  useEffect(() => {
    // if (isDataLoaded && DataLoadedItems && DataLoadedItems[0]?.name == 'LOADED') {
      dispatch(getCouncillorWardDashboardApi(loggedUser?.warD_NO));
    //}
  }, [loggedUser?.warD_NO]);


  useEffect(() => {
    dispatch(GetDataLoadDetailsApi());
  }, []);

  const RefreshData = () => {
    setIsRefresh(true)
    dispatch(GetDataLoadDetailsApi());
  }

  const handleDetailsNavigation = (navigationText, title, wardType) => {
    dispatch(MayorSelectedWardActions.clearSelectedWardNo());
    // Alert.alert(wardType)
    navigation.navigate(navigationText, {
      title: loggedUser?.warD_NO != 0 ? loggedUser?.warD_NO + ' - ' + GetwardHeaderTitle(wardType, title) : GetwardHeaderTitle(wardType, title),
      wardType: wardType,
    });
  };

  if (isLoading) {
    return <LoaderModal visible={isLoading} loadingText="Loading..." />;
  }


  const ShowMessageData = () => {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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
              paddingVertical: 10,
            }}>
            {/* Hello, {loggedUser?.name} {loggedUser?.surname} */}
            Hello, {loggedUserNme}
          </Text>
        </View>

        <View style={[styles1.container
        ]}>
          <View style={styles1.card}>
            <View style={styles1.iconContainer}>
              <View style={styles1.box}>
                <Image source={logo} style={styles1.img} />
              </View>
            </View>
            <View style={{ flexDirection: 'row', height: 'auto' }}>
              <View style={styles1.content}>
                <Text style={[styles1.title, { paddingTop: 5 }]}>
                  Under Maintenance
                </Text>
                <Text style={styles1.description}>
                  Due to planned system maintenance, application will not be accessable during the maintenance period.
                </Text>
                <Text style={[styles1.description, { color: Colors.primary, paddingTop: 10 }]}>
                  We appreciate your patience during this time!
                </Text>
              </View>
            </View>

            <View style={{ marginTop: 20 }}>
              <TouchableOpacity
                onPress={RefreshData}
                style={{
                  height: 50, width: 100, backgroundColor: Colors.primary,
                  justifyContent: 'center', alignItems: 'center',
                  borderRadius: 25,
                  flexDirection: 'row'
                }}>
                {isDataLoading 
                && isRefresh ?
                  <ActivityIndicator animating={true} color="#000" size="small" />
                  : <Text style={{ color: Colors.white, fontSize: 15 }}>
                    Refresh
                  </Text>}

              </TouchableOpacity>
            </View>
          </View>
        </View>

      </View>


    );
  };

  return (
    <>
      {(!items && DataLoadedItems && DataLoadedItems?.[0]?.name != 'LOADED') ?

        <ShowMessageData />

        :

        (items && DataLoadedItems && DataLoadedItems?.[0]?.name == 'LOADED') ?

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
                  paddingVertical: 10,
                }}>
                {/* Hello, {loggedUser?.name} {loggedUser?.surname} */}
                Hello, {loggedUserNme}
              </Text>
              {DataLoadedItems && DataLoadedItems[0]?.name == 'LOADED' &&
                <Text
                  style={{
                    fontSize: 12,
                    // fontWeight: '800',
                    color: Colors.red,
                    textAlign: 'right'
                  }}>
                  Last data refreshed: {DataLoadedItems[0]?.value}
                </Text>}
            </View>
            <ScrollView>
              <View style={styles.row}>
                <Card
                  onPress={() => {

                    if (loggedUser?.warD_NO == 0) {
                      // handleDetailsNavigation(
                      //   'AllWards',
                      //   'All Wards Oustanding',
                      //   'Outstanding',
                      // );
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
                  style={[styles.card, { backgroundColor: Colors.primary }]}
                  mode="outlined">
                  <Card.Title
                    title="Outstanding Debt"
                    titleNumberOfLines={2}
                    titleStyle={{ color: Colors.white, fontSize: 14 }}
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
                  style={[styles.card, { backgroundColor: Colors.yellow }]}
                  mode="outlined">
                  <Card.Title title="Interims" titleStyle={{ color: Colors.white, fontSize: 14 }} />
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
                    handleDetailsNavigation('CouncillorDetails', 'Incidents/Complaints', 'IMS');
                  }}
                  style={[styles.card, { backgroundColor: Colors.blue }]}
                  mode="outlined">
                  <Card.Title title="Incidents/Complaints" titleStyle={{ color: Colors.white, fontSize: 14 }} titleNumberOfLines={2} />
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
                    handleDetailsNavigation('CouncillorDetails', 'Total Water and Electricity Meters', 'Meter');
                  }}
                  style={[styles.card, { backgroundColor: Colors.red }]}
                  mode="outlined">
                  <Card.Title
                    title="Total Water and Electricity Meters"
                    titleStyle={{ color: Colors.white, fontSize: 14 }}
                    titleNumberOfLines={2}
                  />
                  <Card.Content>
                    <Text></Text>
                    <Text variant="titleLarge" style={styles.text}>
                      {parseFloat(getValueByKey(items, 'Water and Electricity Meters'))}
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
                    handleDetailsNavigation('CouncillorDetails', 'City’s Total Properties', 'Property');
                  }}
                  style={[styles.card, { backgroundColor: Colors.primary }]}
                  mode="outlined">
                  <Card.Title
                    title="City’s Total Properties" titleNumberOfLines={2}
                    titleStyle={{ color: Colors.white, fontSize: 14 }}
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
                    handleDetailsNavigation('CouncillorDetails', 'City’s Total Customers', 'Customer');
                  }}
                  style={[styles.card, { backgroundColor: Colors.yellow }]}
                  mode="outlined">
                  <Card.Title
                    title="City’s Total Customers" titleNumberOfLines={2}
                    titleStyle={{ color: Colors.white, fontSize: 14 }}
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
                    handleDetailsNavigation('CouncillorDetails', 'Meters Not Read', 'MetersNotRead');
                  }}
                  style={[styles.card, { backgroundColor: Colors.blue }]}
                  mode="outlined">
                  <Card.Title
                    title="Meters Not Read"
                    titleStyle={{ color: Colors.white, fontSize: 14 }}
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
              </View>
            </ScrollView>
          </View> : <ShowMessageData />

      }
    </>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 5,
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
    // marginBottom: 16,
  },
  card: {
    width: '48%', // Adjust the width based on your requirement
    marginVertical: 3,
    // height:150
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
    // fontWeight: 'bold',
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
    alignSelf: 'center'

  },
  card: {
    flexDirection: 'column',
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
    color: Colors.red
  },
  description: {
    fontSize: 16,
    color: Colors.blue
  },
  box: {
    width: 70,
    height: 70,
    borderWidth: 2, // Border width in pixels
    borderColor: Colors.red,
    borderRadius: (screenWidth - 50) / 2, // Border radius (optional)
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    alignSelf: 'center',
    elevation: 1,
  },
  img: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
});
