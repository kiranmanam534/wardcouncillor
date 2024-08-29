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

import {GetwardHeaderTownshipTitle} from '../utility/Commom';
import {WardMemberSliceActions} from '../redux/councillorWardTownshipMemberSlice';
import {councillorWardsActions} from '../redux/councillorWardsSlice';
import ErrorModal from '../components/ErrorModal';
import {Colors} from '../constant/Colors';
import CardItemLoading from '../components/CardItemLoading';
import ShowMessageCenter from '../components/ShowMessageCenter';
import {councillorAllWardsActions} from '../redux/councillorAllWardsSlice';
import {MayorSelectedWardActions} from '../redux/MayorSelectedWardSlice';

const AllWardsOutstandingScreen = ({route}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {wardType} = route.params;
  // console.log(wardType)
  const [showErrorModal, setShowErrorModal] = useState(false);
  const loggedUser = useSelector(state => state.loginReducer.items);
  const {items, isLoading, error, statusCode} = useSelector(
    state => state.CouncillorAllWardsReducer,
  );

  console.log(items, isLoading, error, statusCode);
  useEffect(() => {
    dispatch(councillorAllWardsActions.clearWards());
    setTimeout(() => {
      dispatch(GetCouncillorWardDetailsIfoByAllWardsApi());
    }, 100);
  }, [loggedUser?.warD_NO, wardType]);

  const navigateToDetail = (wardType, name) => {
    // handleDetailsNavigation(
    //     'CouncillorDetails',
    //     'Oustanding Debt',
    //     'Outstanding',
    //   );

    dispatch(MayorSelectedWardActions.selectedWardNo(name));
    navigation.navigate('CouncillorDetails', {
      title: `${name} - Outstanding Debt`,
      wardType: wardType,
      // maylorSelectedWardNo: name,
    });
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
      {statusCode && statusCode !== 200 && (
        <ShowMessageCenter
          message={
            error == 'No data found.'
              ? 'No data found.'
              : 'Something went wrong!'
          }
        />
      )}

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
          renderItem={({item}) => <CardItemLoading />}
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
              title={'Ward No: ' + item.name}
              isTownship={false}
              wardType={wardType}
              value={parseFloat(item.value)}
              isAmount={wardType == 'Outstanding' ? true : false}
              onPress={() => {
                navigateToDetail(wardType, item.name);
              }}
            />
          ))}
      </ScrollView>
    </>
  );
};

export default AllWardsOutstandingScreen;

const styles = StyleSheet.create({});
