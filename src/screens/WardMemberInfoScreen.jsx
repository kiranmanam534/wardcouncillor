import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import WardMemberCard from '../components/WardMemberCard';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { wardMemberInfo } from '../services/loginApi';
import LoaderModal from '../components/LoaderModal';
import { Colors } from '../constant/Colors';
import { authSliceActions } from '../redux/loginSlice';

const WardMemberInfoScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { items: wardMember, isLoading } = useSelector(
    state => state.wardMemberReducer,
  );
  const loggedUser = useSelector(state => state.loginReducer.items);
  //   console.log(loggedUser?.warD_NO);
  //   console.log(filteredData);

  useEffect(() => {
    dispatch(wardMemberInfo());
  }, [dispatch]);

  const [seconds, setSeconds] = useState(5); // Initial timeout value in seconds

  useEffect(() => {
    // Function to decrease the timer every second
    const interval = setInterval(() => {
      setSeconds(prevSeconds => prevSeconds - 1); // Decrease seconds by 1
    }, 5000); // Run every second

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, []); // Empty dependency array to run effect only once

  // Format seconds into minutes and seconds
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  // Function to filter data based on filterString
  const filteredData = wardMember?.filter(
    item => item.WardNo == loggedUser?.warD_NO,
  );

  const goToDashboard = () => {
    navigation.navigate('Dashboard');
  };
  useEffect(() => {
    if (!isLoading && seconds == 0) {
      goToDashboard();
    }
  }, [navigation, isLoading, seconds, setSeconds]);

  useEffect(() => {
    let name =
      (filteredData && filteredData[0].FirstName) +
      ' ' +
      (filteredData && filteredData[0].Surname);

    // console.log(filteredData)
    dispatch(authSliceActions.getUserName(name));
  }, [dispatch, filteredData]);

  if (isLoading) {
    return <LoaderModal visible={isLoading} loadingText="Please wait profile is Loading..." />;
  }
  return (
    <>
      {!filteredData &&


        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
          <Text style={{ color: Colors.red }}>Something went wrong on profile loadig...</Text>

          <View style={{ padding: 20 }}>

            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <Text>Please click on</Text>
              <TouchableOpacity onPress={goToDashboard} style={{ backgroundColor: Colors.primary, padding: 5, borderRadius: 5, marginHorizontal: 10 }}>
                <Text style={{ color: Colors.white, marginHorizontal: 5 }}>Dashboard</Text>
              </TouchableOpacity>
              <Text>to navigate dashboard.</Text>
            </View>
          </View>
        </View>
      }
      {filteredData &&
        <ScrollView>
          {filteredData &&
            filteredData.map(item => (
              <WardMemberCard
                key={item.ID}
                wardMember={item}
                onPress={goToDashboard}
              />
            ))}



          <View style={{ padding: 20 }}>

            <View>
              <Text>
                Please wait until complete
                <Text style={{ color: Colors.red }}>
                  {' '}
                  Time Left:
                  {minutes >= 0 ? (minutes + ":" + (remainingSeconds < 10 ? '0' : '') + remainingSeconds) : "00:00"}
                  {/* {minutes}:{remainingSeconds < 10 ? '0' : ''}
            {remainingSeconds} */}
                </Text>
              </Text>
            </View>
            <View style={{justifyContent:'center',alignItems:'center',marginVertical:10}}><Text>OR</Text></View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <Text>Please click on</Text>
              <TouchableOpacity onPress={goToDashboard} style={{ backgroundColor: Colors.primary, padding: 5, borderRadius: 5, marginHorizontal: 10 }}>
                <Text style={{ color: Colors.white, marginHorizontal: 5 }}>Dashboard</Text>
              </TouchableOpacity>
              <Text>to navigate dashboard.</Text>
            </View>

          </View>
        </ScrollView>
      }
    </>
  );
};

export default WardMemberInfoScreen;

const styles = StyleSheet.create({});
