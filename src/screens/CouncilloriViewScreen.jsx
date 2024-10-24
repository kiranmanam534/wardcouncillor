import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  Linking,
  Alert,
  Button,
  FlatList,
  ActivityIndicator,
  Pressable,
  Image,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import LoaderModal from '../components/LoaderModal';
import { GetCouncillorWardTownshipMemberInfo, getMeterImageApi } from '../services/councillorWardApi';
import TownshipCard from '../components/TownshipCard';
import { smsApi } from '../services/smsApi';
import { formattedAmount, formattedCurrency } from '../utility/FormattedAmmount';
import ErrorModal from '../components/ErrorModal';
import Toast from 'react-native-toast-message';
import { Colors } from '../constant/Colors';
import { smdSliceActions } from '../redux/smsSlice';
import BottomSearchBox from '../components/BottomSearchBox';
import CardItemTest from '../Test1';
import ShowMessageCenter from '../components/ShowMessageCenter';
import CardItemLoading from '../components/CardItemLoading';
import { WardMemberSliceActions } from '../redux/councillorWardTownshipMemberSlice';
import BinaryImageModal from '../components/BinaryImageModal';
import { MeterImageActions } from '../redux/MeterImageSlice';
const CouncilloriViewScreen = ({ route }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [page, setPage] = useState(1);

  const [searchText, setSearchText] = useState('');
  const [showSearchBox, setShowSearchBox] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState(null);

  const { title, wardType, name, township } = route.params;
  console.log(wardType, name, township);

  const {
    isLoading: isSMSLoading,
    isSMSsent,
    message: smsMessage,
    error: smsError,
    statusCode
  } = useSelector(state => state.smsReducer);



  const { wardNo: mayorSelectedWardNo } = useSelector(
    state => state.MayorSelectedWardReducer,
  );

  const [showErrorModal, setShowErrorModal] = useState(false);

  const {
    items,
    isLoading,
    error,
    wardmembersCount,
    message: memberMessage,
    statusCode: memberStatusCode
  } = useSelector(state => state.councillorWardTownshipMemberReducer);

  const loggedUser = useSelector(state => state.loginReducer.items);

  const { isLoading: imageLoading, error: imageError, image: binaryImage, isSuccess: isImageLoaded } = useSelector(state => state.MeterImageReducer);

  console.log('isImageLoaded', isImageLoaded)
  console.log("binaryImage", imageError)

  useEffect(() => {
    dispatch(
      GetCouncillorWardTownshipMemberInfo({
        wardNo: mayorSelectedWardNo ? mayorSelectedWardNo : loggedUser?.warD_NO,
        wardType: wardType,
        name: name,
        search: '',
        township: township,
        page: page,
        limit: 10,
      }),
    );
  }, [loggedUser?.warD_NO, wardType, name, township, page, mayorSelectedWardNo]);

  const handleLoadMore = () => {
    if (wardmembersCount != 0 && wardmembersCount == 10) setPage(page + 1);
  };

  // console.log('isSMSLoading', isSMSLoading);
  // console.log('smsMessage', smsMessage);
  // console.log('wardmembersCount', wardmembersCount);

  const handlePress = phoneNumber => {
    if (phoneNumber != 'Not Available') Linking.openURL(`tel:${phoneNumber}`);
  };

  // const closeModal = () => {
  //   setShowErrorModal(false);
  // };

  const handleSMS = item => {
    console.log(item.accounT_NO)
    let days_label = '';
    if (name === 'D30_DAYS') days_label = '30 days amount';
    if (name === 'D60_DAYS') days_label = '60 days amount';
    if (name === 'D90_DAYS') days_label = '90 days amount';
    if (name === 'D120_PLUS') days_label = '120+ days amount';
    let message = `Hi ${item.customeR_NAME.trim()}, Your outstanding ${days_label} is R${formattedCurrency(
      parseFloat(item.daysAmount),
      'en-ZA',
      'ZAR',
      'currency',
    )} and Your outstanding total amount is R${formattedCurrency(
      parseFloat(item.totalAmount),
      'en-ZA',
      'ZAR',
      'currency',
    )}`;
    // console.log(message)
    dispatch(smsApi({ item, msg: message }));
    setSelectedImageId(item.accounT_NO);
    // setShowErrorModal(true);
  };



  const openMeterImage = (meterId) => {

    console.log(meterId);

    dispatch(getMeterImageApi(meterId));

    setShowImage(true)
    setSelectedImageId(meterId);
  }

  const showToast = (text1, text2, type, color) => {
    Toast.show({
      type: type,
      position: 'bottom',
      text1: text1,
      text2: text2,
      visibilityTime: 3000,
      text1Style: { color: color, fontSize: 15 },
      text2Style: { color: Colors.blue, fontSize: 13 },
    });
    dispatch(smdSliceActions.smsClear());
    setSelectedImageId(null);
  };

  const handleBottomSearchBox = value => {
    setSearchText(value);
  };

  const handleSearch = () => {
    // Implement search functionality here
    dispatch(WardMemberSliceActions.clearWardMemberData())
    console.log('Searching for:', searchText);
    dispatch(
      GetCouncillorWardTownshipMemberInfo({
        wardNo: mayorSelectedWardNo ? mayorSelectedWardNo : loggedUser?.warD_NO,
        wardType: wardType,
        name: name,
        search: searchText,
        township: township,
        page: page,
        limit: 10,
      }),
    );
  };

  const toggleSearchBox = () => {
    // console.log(showSearchBox)
    setShowSearchBox(!showSearchBox);
    // if (!showSearchBox) {
    //   handleSearch();
    // }
  };


  const closeModal = () => {
    dispatch(MeterImageActions.ClearImage())
  };
  useEffect(() => {
    if (!isSMSLoading && smsError) {
      showToast('Error', 'Something went wrong!', 'error', Colors.red);
    }
  }, [smsError, isSMSLoading]);

  useEffect(() => {
    if (!isSMSLoading && smsMessage) {
      showToast('Success', smsMessage, 'success', Colors.primary);
    }
  }, [smsMessage, isSMSLoading]);

  const renderFooter = () => {
    if (!isLoading) return null;
    // return <LoaderModal visible={isLoading} loadingText="Loading..." />;
    return (
      <FlatList
        data={[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]}
        renderItem={({ item }) => <CardItemTest />}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  };

  return (
    <View style={{ flex: 1 }}>

      {/* {isImageLoaded &&
        <Image source={{ uri: 'data:image/jpeg;base64,' + binaryImage }} width={200} height={200} />} */}

      {memberStatusCode && memberStatusCode !== 200 &&
        <ShowMessageCenter message={error == 'No data found.' ? 'No data found.' : 'Something went wrong!'} />}


      {/* <LoaderModal visible={isSMSLoading} loadingText="SMS is sending..." /> */}
      {memberStatusCode && memberStatusCode === 200 && memberMessage === 'Data Not found' && items?.length == 0 && (
        <ShowMessageCenter message={'No data found!'} />
      )}

      <ErrorModal
        visible={imageError && imageError != 200}
        ErrorModalText={'No image found!'}
        closeModal={closeModal}
        onPress={() => {
          closeModal();
        }}
      />

      {isImageLoaded && binaryImage &&
        <BinaryImageModal
          binaryImageData={binaryImage} // Binary image data to be decoded
          visible={showImage} // Boolean to control the visibility of the modal
          onClose={() => setShowImage(false)} // Function to handle modal close
        />}

      {isLoading && (
        <FlatList
          data={[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]}
          renderItem={({ item }) => <CardItemLoading />}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
      {!isLoading && items?.length > 0 && (
        <FlatList
          data={items}
          renderItem={({ item }) => (
            <TownshipCard
              // key={index}
              wardType={wardType}
              item={item}
              name={name}
              onPress={() => {
                handlePress(item.cellphonenumber);
              }}
              showImage={() => {
                openMeterImage(item?.id)
              }}
              imageLoading={imageLoading}
              ImageId={selectedImageId}
              sendSMS={() => {
                handleSMS(item);
              }}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
          onEndReached={handleLoadMore}
          // onEndReachedThreshold={10} // Adjust the threshold as needed
          ListFooterComponent={renderFooter}
        />
      )}

      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Toast position="bottom" bottomOffset={20} />
      </View>

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
        placeholder={'search by account or name...'}
        isLoading={isLoading}
      />
      {/* )} */}
    </View>
  );
};

export default CouncilloriViewScreen;

const styles = StyleSheet.create({
  toggleButton: {
    position: 'absolute',
    bottom: 100,
    right: 30,
    backgroundColor: Colors.red,
    borderRadius: 25,
    padding: 10,
    elevation: 10,
  },
});
