import {
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {Colors} from '../constant/Colors';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {IndegentDashboardList} from '../constant/MainDashboardList';
import BottomSearchBox from '../components/BottomSearchBox';
const IndegentConsumptionsScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [searchVisible, setSearchVisible] = useState(false);
  const [selectedCoontentID, setSelectedCoontentID] = useState(0);
  const [searchText, setSearchText] = useState('');
  const {warD_NO} = useSelector(state => state.loginReducer.items);
  let searchPlaceHoder = 'Serach...';
  const IndegentConsumptions = [
    {
      address: '2, KWIKSTERT, BIRCH ACRES 1619',
      cell: '0729072975',
      gender: null,
      householdIncome: null,
      idNumber: '5112050077088',
      maritalStatus: 'Widow(er)',
      meter_No: '150475',
      municipalAccount: '1705405072',
      name: 'PETRU',
      numberOfProperties: null,
      previouS_CONSUMPTION: '1578.00',
      propertyValue: null,
      readinG_TAKEN_DATE: '06/11/2024 00:00:00',
      sourceOfIncome: null,
      surname: 'VOLSCHENK',
      wardno: '104',
      Latitude: '-26.1270685',
      Longitude: '28.484952',
    },
    {
      address: '15,SILVER OAK STREET,ESTERPARK, 1619',
      cell: '0824406450',
      gender: 'Male',
      householdIncome: '4180',
      idNumber: '5004275025085',
      maritalStatus: 'MARRIED',
      meter_No: '483504',
      municipalAccount: '1700389564',
      name: 'ARNALDO RAUL MONTEIRO',
      numberOfProperties: '1',
      previouS_CONSUMPTION: '1021.00',
      propertyValue: '1200000',
      readinG_TAKEN_DATE: '01/18/2024 00:00:00',
      sourceOfIncome: null,
      surname: 'PRONTO',
      wardno: '104',
      Latitude: '-26.127141',
      Longitude: '28.4848585',
    },
    {
      address:
        '. 164 Kildare Estates,bergriver Drive, TERENURE X32, TERENURE X32 1619',
      cell: '0823461842',
      gender: null,
      householdIncome: null,
      idNumber: '5208280751086',
      maritalStatus: 'Widow(er)',
      meter_No: '23094141',
      municipalAccount: '1706153505',
      name: 'Thembile Henrietta',
      numberOfProperties: null,
      previouS_CONSUMPTION: '627.00',
      propertyValue: null,
      readinG_TAKEN_DATE: '09/17/2024 00:00:00',
      sourceOfIncome: null,
      surname: 'Matshego',
      wardno: '104',
      Latitude: '-26.25304029',
      Longitude: '28.10918636',
    },
    {
      address: '44 Green Avenue, KEMPTON PARK X5, KEMPTON PARK X5 1619',
      cell: '0619347530',
      gender: null,
      householdIncome: null,
      idNumber: '6203205008000',
      maritalStatus: 'Married',
      meter_No: '883801',
      municipalAccount: '1701430211',
      name: 'Pieter Willem Adriaan & Juanette',
      numberOfProperties: null,
      previouS_CONSUMPTION: '509.00',
      propertyValue: null,
      readinG_TAKEN_DATE: '07/16/2023 00:00:00',
      sourceOfIncome: null,
      surname: 'Van Baalen',
      wardno: '104',
      Latitude: '-26.12721371',
      Longitude: '28.48475841',
    },
    {
      address: '34,BULTOPRIT STREET,KEMPTON PARK-WES,KEMPTON 1619',
      cell: '0624720932',
      gender: 'FEMALE',
      householdIncome: '0',
      idNumber: '6803040115082',
      maritalStatus: 'MARRIED',
      meter_No: '260716',
      municipalAccount: '1700172705',
      name: 'ELIZABETH',
      numberOfProperties: null,
      previouS_CONSUMPTION: '407.00',
      propertyValue: '890000',
      readinG_TAKEN_DATE: '08/19/2024 00:00:00',
      sourceOfIncome: 'No Income',
      surname: 'JOOSTE',
      wardno: '104',
      Latitude: '-26.12701855',
      Longitude: '28.48474641',
    },
    {
      address: '89, KILDARE EST,LIMPOPO STR, TERENURE X32 1619',
      cell: '0829204442',
      gender: null,
      householdIncome: null,
      idNumber: '7610095308085',
      maritalStatus: 'Married',
      meter_No: '228319',
      municipalAccount: '1704289075',
      name: 'H',
      numberOfProperties: null,
      previouS_CONSUMPTION: '236.00',
      propertyValue: null,
      readinG_TAKEN_DATE: '09/17/2024 00:00:00',
      sourceOfIncome: null,
      surname: 'LETSIE H H M AND C N',
      wardno: '104',
      Latitude: '-26.12694598',
      Longitude: '28.48483516',
    },
    {
      address: '10 Korner Avenue, KEMPTON PARK WEST, KEMPTON PARK WEST 1619',
      cell: '0843431686',
      gender: null,
      householdIncome: null,
      idNumber: '8903130117085',
      maritalStatus: 'Married',
      meter_No: 'COPZ1151',
      municipalAccount: '1707013499',
      name: 'Daryl & Omavathie',
      numberOfProperties: null,
      previouS_CONSUMPTION: '213.00',
      propertyValue: null,
      readinG_TAKEN_DATE: '09/16/2024 00:00:00',
      sourceOfIncome: null,
      surname: 'Manilal O And Pillay D',
      wardno: '104',
      Latitude: '-26.25304029',
      Longitude: '28.10918636',
    },
    {
      address: '24, CAROL VAN DER WALT, EDLEEN EXT 3 1619',
      cell: '0735459681',
      gender: null,
      householdIncome: null,
      idNumber: '8205051072087',
      maritalStatus: 'Divorced',
      meter_No: '201056952',
      municipalAccount: '1709838374',
      name: 'MARY MODIEGI',
      numberOfProperties: null,
      previouS_CONSUMPTION: '186.00',
      propertyValue: null,
      readinG_TAKEN_DATE: '09/19/2024 00:00:00',
      sourceOfIncome: null,
      surname: 'NTINI',
      wardno: '104',
      Latitude: '-26.10784349',
      Longitude: '28.471064',
    },
    {
      address: '52,PARKLAND DRIVE,ESTERPARK,KEMPTON 1619',
      cell: '0729511509',
      gender: 'MALE',
      householdIncome: '2200',
      idNumber: '4708085573081',
      maritalStatus: 'SINGLE',
      meter_No: '120042194',
      municipalAccount: '1700388047',
      name: 'MOROA JOHANNES',
      numberOfProperties: '1',
      previouS_CONSUMPTION: '101.00',
      propertyValue: '1350000',
      readinG_TAKEN_DATE: '09/19/2024 00:00:00',
      sourceOfIncome: null,
      surname: 'MOLEFE',
      wardno: '104',
      Latitude: '-26.107745',
      Longitude: '28.471053',
    },
    {
      address: '8, WEIVELD, KEMPTON PARK WEST 1619',
      cell: '0638846711',
      gender: null,
      householdIncome: null,
      idNumber: '6303155185186',
      maritalStatus: 'Single',
      meter_No: '211110762',
      municipalAccount: '1700174626',
      name: 'SIBONGILE & LUCKY VELAPHI',
      numberOfProperties: null,
      previouS_CONSUMPTION: '93.00',
      propertyValue: null,
      readinG_TAKEN_DATE: '09/16/2024 00:00:00',
      sourceOfIncome: null,
      surname: 'SIBINDI',
      wardno: '104',
      Latitude: '-26.1076465',
      Longitude: '28.471042',
    },
  ];

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{flexDirection: 'row'}}>
          {/* <TouchableOpacity
            onPress={toggleSearchBar}
            style={styles.searchButton}>
            <Icon name="search" size={20} color={Colors.white} />
          </TouchableOpacity> */}
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('IndegentConsumptionsMap', {
                title: warD_NO + ' - Indegent Consumption Map',
              });
            }}
            style={styles.searchButton}>
            {/* <Text style={styles.searchButtonText}>Search</Text> */}
            <FontAwesome5
              name="map-marked-alt"
              size={20}
              color={Colors.white}
            />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, searchVisible]);

  const toggleSearchBar = () => {
    setSearchVisible(!searchVisible);
  };

  const handleBottomSearchBox = value => {
    // dispatch(AnnounceViewActions.clearAnnouncementsData())
    console.log('Searching for:', value);
    setSearchText(value);
  };

  const handleSearch = () => {
    // dispatch(AnnounceViewActions.clearAnnouncementsData());
    console.log('Searching for:', searchText);
    setPage(1);
    LoadAnouncements(1);
  };
  // const {loading, error, indegentConsumptions} =
  //   useIndegentConsumptiionsByWardNo(warD_NO);

  // console.log(loading, error, indegentConsumptions);

  const handleDetailsNavigation = id => {
    setSelectedCoontentID(id);
  };

  const renderMenuList = (item, index) => {
    // console.log(item);
    let id = item.meter_No + '_' + item.municipalAccount + '_' + index;
    return (
      <TouchableOpacity key={id} onPress={() => handleDetailsNavigation(id)}>
        <View style={styles.card}>
          <View style={styles.flex_row_card}>
            {/* <View style={styles.iconContainer}>
              <MaterialCommunityIcon
                name="hand-pointing-right"
                size={30}
                color={Colors.yellow}
              />
            </View> */}
            <View style={styles.content}>
              <Text style={styles.title}>
                Account No : {item.municipalAccount}
              </Text>
              <Text style={styles.description}>Meter No : {item.meter_No}</Text>
              <Text style={styles.description}>
                Previous Consumption :{' '}
                {parseInt(item.previouS_CONSUMPTION || 0)}
              </Text>
            </View>
            {/* <View style={[styles.iconContainer, {marginRight: 0}]}>
              <Icon
                name={id === selectedCoontentID ? 'angle-up' : 'angle-down'}
                size={50}
                color={Colors.yellow}
              />
            </View> */}
          </View>

          {id === selectedCoontentID && (
            <View
              style={[
                styles.content,
                {
                  marginTop: 10,
                  marginHorizontal: 0,
                  marginBottom: 0,
                  borderTopWidth: 1,
                  padding: 10,
                },
              ]}>
              <Text style={styles.description}>
                Name : {item.name} {item.surname}
              </Text>
              <Text style={styles.description}>Cell : {item.cell}</Text>
              <Text style={styles.description}>
                Reading Taken Date : {item.readinG_TAKEN_DATE}
              </Text>
              <Text style={styles.description}>Address : {item.address}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      {searchVisible && (
        <BottomSearchBox
          onChangeText={handleBottomSearchBox}
          onPress={handleSearch}
          value={searchText}
          // setSearchText={setSearchText}
          placeholder={searchPlaceHoder}
          // isLoading={isLoading}
        />
      )}
      <FlatList
        data={IndegentConsumptions}
        renderItem={({item, index}) => renderMenuList(item, index)}
        keyExtractor={item => item.actionType}
      />
    </>
  );

  // return (
  //   <ScrollView>
  //     <View
  //       style={[
  //         styles.container,
  //         {marginBottom: Platform.OS === 'ios' ? 120 : 120},
  //       ]}>
  //       {IndegentDashboardList.map(item => renderMenuList(item))}
  //     </View>
  //   </ScrollView>
  // );
};

export default IndegentConsumptionsScreen;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    padding: 5,
    justifyContent: 'center',
  },
  flex_row_card: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    // flexDirection: 'row',
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#f1f1f2',
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 10,
    margin: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  iconContainer: {
    marginRight: 10,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: Colors.blue,
  },
  description: {
    fontSize: 16,
    padding: 3,
  },

  toggleButton: {
    position: 'absolute',
    bottom: 100,
    right: 30,
    backgroundColor: Colors.red,
    borderRadius: 25,
    padding: 10,
    elevation: 10,
  },
  searchButton: {
    marginRight: 10,
  },
  searchButtonText: {
    fontSize: 16,
    color: 'blue',
  },
  searchBar: {
    marginBottom: 16,
    // backgroundColor:Colors.
  },
});
