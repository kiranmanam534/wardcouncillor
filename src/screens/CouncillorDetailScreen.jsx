import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Text,
  FlatList,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import Ionicons from 'react-native-vector-icons/dist/Ionicons';

import CardItem from '../components/CardItem';
import { GetCouncillorWardTownshipIfoByWardNo } from '../services/councillorWardApi';
import LoaderModal from '../components/LoaderModal';
import { GetwardHeaderTownshipTitle } from '../utility/Commom';
import { WardMemberSliceActions } from '../redux/councillorWardTownshipMemberSlice';
import BottomSearchBox from '../components/BottomSearchBox';
import { Colors } from '../constant/Colors';
import ShowMessageCenter from '../components/ShowMessageCenter';
import CardItemLoading from '../components/CardItemLoading';

const CouncillorDetailScreen = ({ route }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { title: parentTitle, wardType, name } = route.params;

  const [searchText, setSearchText] = useState('');
  const [showSearchBox, setShowSearchBox] = useState(false);

  const loggedUser = useSelector(state => state.loginReducer.items);
  const { items, isLoading, error, statusCode } = useSelector(
    state => state.councillorWardTownshipReducer,
  );


  const { wardNo: mayorSelectedWardNo } = useSelector(
    state => state.MayorSelectedWardReducer,
  );

  console.log("CouncillorDetailScreen=>",items)

  useEffect(() => {
    dispatch(
      GetCouncillorWardTownshipIfoByWardNo({
        wardNo: mayorSelectedWardNo ? mayorSelectedWardNo : loggedUser?.warD_NO,
        wardType: wardType,
        name: name,
        search: '',
      }),
    );
  }, [loggedUser?.warD_NO, wardType, name,mayorSelectedWardNo]);

  console.log('items', items);

  const navigateToDetail = (title, township) => {
    dispatch(WardMemberSliceActions.clearWardMemberData());
    navigation.navigate('CouncillorView', {
      title: `${mayorSelectedWardNo ? mayorSelectedWardNo : loggedUser?.warD_NO} - ` + title,
      wardType: wardType,
      name: name,
      township: township,
    });
  };

  const handleBottomSearchBox = value => {
    setSearchText(value);
  };

  const handleSearch = () => {
    // Implement search functionality here
    console.log('Searching for:', searchText);
    dispatch(
      GetCouncillorWardTownshipIfoByWardNo({
        wardNo: mayorSelectedWardNo ? mayorSelectedWardNo : loggedUser?.warD_NO,
        wardType: wardType,
        name: name,
        search: searchText,
      }),
    );
    // setSearchText(searchText)
  };

  const toggleSearchBox = () => {
    // console.log(showSearchBox)
    setShowSearchBox(!showSearchBox);
    // if (!showSearchBox) {
    //   handleSearch();
    // }
  };

  // useEffect(() => {
  //   if (items.length > 0) {
  //     setShowSearchBox(false);
  //   }
  // }, [items.length]);

  // if (isLoading) {
  //   return <LoaderModal visible={isLoading} loadingText="Loading..." />;
  // }

  return (
    <View style={{ flex: 1 }}>
      {/* {isLoading && (
        <LoaderModal visible={isLoading} loadingText="Loading..." />
      )} */}

      {statusCode && statusCode !== 200 &&
        <ShowMessageCenter message={error == 'No data found.' ? 'No data found.' : 'Something went wrong!'}/>}


      {statusCode &&statusCode === 200 && items?.length == 0 && (
        <ShowMessageCenter message={'No data found!'} />
      )}
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
      {!isLoading && items?.length > 0 && (
        <FlatList
          data={items}
          renderItem={({ item }) => (
            <CardItem
              key={item.name}
              title={item.name}
              value={parseFloat(item.value)}
              wardType={wardType}
              isTownship={true}
              isAmount={wardType == 'Outstanding' ? true : false}
              onPress={() => {
                navigateToDetail(item.name, item.name);
              }}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      )}

      {/* <View> */}
      {/* {items.length > 0 &&
          items.map(item => (
            <CardItem
              key={item.name}
              title={item.name}
              value={parseFloat(item.value)}
              wardType={wardType}
              isTownship={true}
              isAmount={wardType == 'Outstanding' ? true : false}
              onPress={() => {
                navigateToDetail(item.name, item.name);
              }}
            />
          ))}
      </View> */}

      {/* <Pressable style={styles.toggleButton} onPress={toggleSearchBox}>
        <Ionicons
          name={showSearchBox ? 'close' : 'search'}
          size={30}
          color={Colors.white}
        />
      </Pressable> */}

      {/* {showSearchBox && ( */}
      <BottomSearchBox
        onChangeText={handleBottomSearchBox}
        onPress={handleSearch}
        value={searchText}
        // setSearchText={setSearchText}
        placeholder={'search by name...'}
        isLoading={isLoading}
      />
      {/* )} */}
    </View>
  );
};

export default CouncillorDetailScreen;

const styles = StyleSheet.create({
  toggleButton: {
    position: 'absolute',
    bottom: 100,
    right: 30,
    backgroundColor: Colors.red,
    borderRadius: 25,
    padding: 10,
    elevation: 10,
    // borderWidth: 2,
    // borderColor: Colors.primary
  },
});
