import { View, StyleSheet, ScrollView, Alert, FlatList, Text, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import Icon from 'react-native-vector-icons/dist/FontAwesome';

import CardItem from '../components/CardItem';
import { GetCouncillorWardDetailsIfoByWardNo } from '../services/councillorWardApi';

import {
  GetwardHeaderTownshipTitle,
} from '../utility/Commom';
import { WardMemberSliceActions } from '../redux/councillorWardTownshipMemberSlice';
import { councillorWardsActions } from '../redux/councillorWardsSlice';
import ErrorModal from '../components/ErrorModal';
import { Colors } from '../constant/Colors';
import CardItemLoading from '../components/CardItemLoading';
import ShowMessageCenter from '../components/ShowMessageCenter';
import { getSelectedWardNoByType } from '../utility/getWardNoByType';

const CouncillorDetailsScreen = ({ route }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { wardType } = route.params;
  console.log(wardType)
  const [showErrorModal, setShowErrorModal] = useState(false);
  // const [OustandingItem, setOustandingItem] = useState([])
  const loggedUser = useSelector(state => state.loginReducer.items);
  const { items, isLoading, error, statusCode } = useSelector(
    state => state.WardOustandingReducer,
  );

  const { wardNo: mayorSelectedWardNo } = useSelector(
    state => state.MayorSelectedWardReducer,
  );

  console.log("mayorSelectedWardNo", mayorSelectedWardNo)



  // useEffect(()=>{
  //   setOustandingItem(items)
  // },[isLoading,items])

  const showOutstandingCharts = () => {
    // Alert.alert('showOutstandingCharts')
    // console.log('====================================');
    // console.log(OustandingItem);
    // console.log('====================================');
    navigation.navigate('OustandingCharts',{title:'Oustanding Charts'})
  };
  React.useLayoutEffect(() => {
    if (wardType == 'Outstanding') {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity onPress={showOutstandingCharts} style={styles.searchButton}>
            {/* <Text style={styles.searchButtonText}>Search</Text> */}
            <Icon name="pie-chart" size={25} color={Colors.white} />
          </TouchableOpacity>
        ),
      });
    }
  }, [navigation]);

  useEffect(() => {
    // getSelectedWardNoByType(wardType,loggedUser?.warD_NO,maylorSelectedWardNo)
    dispatch(councillorWardsActions.clearWards())
    setTimeout(() => {
      dispatch(
        GetCouncillorWardDetailsIfoByWardNo({
          wardNo: mayorSelectedWardNo ? mayorSelectedWardNo : loggedUser?.warD_NO,
          wardType: wardType,
        }),
      );
    }, 100);

  }, [loggedUser?.warD_NO, wardType, mayorSelectedWardNo]);

  const navigateToDetail = (wardType, name) => {
    if (wardType === 'Property' || wardType === 'Customer') {
      dispatch(WardMemberSliceActions.clearWardMemberData());
      navigation.navigate('CouncillorView', {
        title:
          `${mayorSelectedWardNo ? mayorSelectedWardNo : loggedUser?.warD_NO} - ` +
          GetwardHeaderTownshipTitle(wardType, name),
        wardType: wardType,
        name: name,
        township: '',
      });
    } else {
      navigation.navigate('CouncillorDetail', {
        title:
          `${mayorSelectedWardNo ? mayorSelectedWardNo : loggedUser?.warD_NO} - ` +
          GetwardHeaderTownshipTitle(wardType, name),
        wardType: wardType,
        name: name,
      });
    }
  };


  useEffect(() => {
    if (!isLoading && error) {
      setShowErrorModal(true);
    }
  }, [error, isLoading]);
  const closeModal = () => {
    setShowErrorModal(false);
  };

  // if (isLoading) {
  //   return <LoaderModal visible={isLoading} loadingText="Loading..." />;
  // }

  return (
    <>

      {statusCode && statusCode !== 200 &&
        <ShowMessageCenter message={error == 'No data found.' ? 'No data found.' : 'Something went wrong!'} />}

      {statusCode && statusCode === 200 && items.length == 0 && (
        <ShowMessageCenter message={'No data found!'} />
      )}
      {/* <ErrorModal
        visible={showErrorModal}
        ErrorModalText={'Something went wrong!'}
        closeModal={closeModal}
        onPress={() => {
          closeModal();
        }}
      /> */}
      {isLoading && (
        <FlatList
          data={[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]}
          renderItem={({ item }) => <CardItemLoading />}
          keyExtractor={(item, index) => index.toString()}
        // onEndReached={handleLoadMore}
        // onEndReachedThreshold={10} // Adjust the threshold as needed
        // ListFooterComponent={renderFooter}
        />
      )}
      <ScrollView>
        {!isLoading &&
          items &&
          items.map(item => (
            <CardItem
              key={item.name}
              title={item.name}
              isTownship={false}
              wardType={wardType}
              value={parseFloat(item.value)}
              isAmount={['Outstanding', 'OutstandingCategory'].includes(wardType) ? true : false}
              onPress={() => {
                navigateToDetail(wardType, item.name);
              }}
            />
          ))}
      </ScrollView>
    </>
  );
};

export default CouncillorDetailsScreen;

const styles = StyleSheet.create({});
