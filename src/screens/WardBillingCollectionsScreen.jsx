import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  FlatList,
  Text,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';

import CardItem from '../components/CardItem';
import {
  GetCouncillorWardDetailsIfoByAllWardsApi,
  GetCouncillorWardDetailsIfoByWardNo,
} from '../services/councillorWardApi';

import {
  GetwardHeaderTitle,
  GetwardHeaderTownshipTitle,
} from '../utility/Commom';
import {WardMemberSliceActions} from '../redux/councillorWardTownshipMemberSlice';
import {councillorWardsActions} from '../redux/councillorWardsSlice';
import ErrorModal from '../components/ErrorModal';
import {Colors} from '../constant/Colors';
import CardItemLoading from '../components/CardItemLoading';
import ShowMessageCenter from '../components/ShowMessageCenter';
import {councillorAllWardsActions} from '../redux/councillorAllWardsSlice';
import {MayorSelectedWardActions} from '../redux/MayorSelectedWardSlice';
import axios from 'axios';
import {apiUrl} from '../constant/CommonData';

const WardBillingCollectionsScreen = ({route}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {wardType} = route.params;

  const [IsSubmitted, setIsSubmitted] = useState(false);
  const [statusCode, setStatusCode] = useState(null);
  const [WardCollectionsData, setWardCollectionsData] = useState([]);
  const loggedUser = useSelector(state => state.loginReducer.items);

  console.log(wardType);

  const navigateToDetail = (wardType, name) => {
    navigation.navigate('Collections_Billing_BarChart', {
      title:
        'Ward : ' +
        name +
        ' - ' +
        GetwardHeaderTitle('Collections', 'Collections vs Billing Barchat'),
      wardType: 'Collections',
      selectedWardNo: name,
    });
  };

  const getWardBillingCollections = async () => {
    try {
      const search = '';
      const currentYear = new Date().getFullYear();
      console.log(currentYear); // This will log the current year, e.g., 2024
      // const response = await axios.post('http://192.168.1.7:5055/api/CouncillorWard/72')
      const response = await axios.get(
        `${apiUrl}/api/Collection/get-ward-wise-Billing-collections?Year=${currentYear}&search=${search}`,
      );
      console.log(response.data);

      setStatusCode(response.status);
      if (response.status == 200) {
        setWardCollectionsData(response.data.data);
      }
      setIsSubmitted(false);
    } catch (error) {
      console.log(error);
      setIsSubmitted(false);
      setStatusCode(500);
      setWardCollectionsData([]);
    }
  };

  useEffect(() => {
    setIsSubmitted(true);
    getWardBillingCollections();
  }, [loggedUser?.warD_NO, wardType]);

  return (
    <>
      {statusCode && statusCode !== 200 && (
        <ShowMessageCenter message={'Something went wrong!'} />
      )}

      {statusCode && statusCode === 200 && WardCollectionsData.length == 0 && (
        <ShowMessageCenter message={'No data found.'} />
      )}

      {IsSubmitted && (
        <FlatList
          data={[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]}
          renderItem={({item}) => <CardItemLoading />}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
      <ScrollView>
        {!IsSubmitted &&
          WardCollectionsData.length > 0 &&
          WardCollectionsData.map(item => (
            <CardItem
              key={item.name}
              title={'Ward No: ' + item.name}
              isTownship={false}
              wardType={wardType}
              value={Math.abs(parseFloat(item.value))}
              billing={Math.abs(parseFloat(item?.billing))}
              collection={Math.abs(parseFloat(item?.collection))}
              isAmount={true}
              onPress={() => {
                navigateToDetail(wardType, item.name);
              }}
            />
          ))}
      </ScrollView>
    </>
  );
};

export default WardBillingCollectionsScreen;

const styles = StyleSheet.create({});
