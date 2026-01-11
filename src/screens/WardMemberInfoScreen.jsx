import {
  Alert,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import WardMemberCard from '../components/WardMemberCard';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {wardMemberInfo} from '../services/loginApi';
import LoaderModal from '../components/LoaderModal';
import {Colors} from '../constant/Colors';
import {authSliceActions} from '../redux/loginSlice';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const WardMemberInfoScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  // const {items: wardMember, isLoading} = useSelector(
  //   state => state.wardMemberReducer,
  // );
  const filteredData = useSelector(state => state.loginReducer.items);
  console.log('WardMemberInfoScreen', filteredData);
  //   console.log(filteredData);

  // useEffect(() => {
  //   dispatch(wardMemberInfo());
  // }, [dispatch]);

  const [seconds, setSeconds] = useState(5); // Initial timeout value in seconds

  // useEffect(() => {
  //   // Function to decrease the timer every second
  //   const interval = setInterval(() => {
  //     setSeconds(prevSeconds => prevSeconds - 1); // Decrease seconds by 1
  //   }, 5000); // Run every second

  //   // Cleanup function to clear the interval when the component unmounts
  //   return () => clearInterval(interval);
  // }, []); // Empty dependency array to run effect only once

  // Format seconds into minutes and seconds
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  // Function to filter data based on filterString
  // const filteredData = loggedUser?.filter(
  //   item => item.WardNo == loggedUser?.warD_NO,
  // );

  const goToDashboard = () => {
    navigation.navigate('Dashboard');
  };
  // useEffect(() => {
  //   if (!isLoading && seconds == 0) {
  //     goToDashboard();
  //   }
  // }, [navigation, isLoading, seconds, setSeconds]);

  useEffect(() => {
    if (seconds == 0) {
      goToDashboard();
    }
  }, [navigation, seconds, setSeconds]);

  // useEffect(() => {
  //   let name =
  //     (filteredData && filteredData[0].FirstName) +
  //     ' ' +
  //     (filteredData && filteredData[0].Surname);

  //   // console.log(filteredData)
  //   dispatch(authSliceActions.getUserName(name));
  // }, [dispatch, filteredData]);

  useEffect(() => {
    let name =
      (filteredData && filteredData.name) +
      ' ' +
      (filteredData && filteredData.surname);

    // console.log(filteredData)
    dispatch(authSliceActions.getUserName(name));
  }, [dispatch, filteredData]);

  if (!filteredData) {
    return (
      <LoaderModal
        visible={filteredData ? false : true}
        loadingText="Please wait profile is Loading..."
      />
    );
  }
  return (
    <View style={styles.container}>
      {!filteredData && (
        <View style={styles.errorContainer}>
          <View style={styles.errorCard}>
            <View style={styles.errorIconCircle}>
              <MaterialIcon name="warning" size={48} color={Colors.yellow} />
            </View>
            <Text style={styles.errorTitle}>Unable to Load Profile</Text>
            <Text style={styles.errorText}>
              Your profile information couldn't be loaded at this time.
            </Text>

            <TouchableOpacity
              onPress={goToDashboard}
              style={styles.retryButton}
              activeOpacity={0.8}>
              <Text style={styles.retryButtonText}>Go to Dashboard</Text>
              <Icon name="arrow-right" size={16} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {filteredData && (
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}>
          <WardMemberCard wardMember={filteredData} onPress={goToDashboard} />
        </ScrollView>
      )}
    </View>
  );
};

export default WardMemberInfoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4FF',
  },
  scrollView: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    maxWidth: 340,
    width: '100%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 6},
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  errorIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: Colors.yellow,
  },
  errorTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.blue,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  retryButton: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    gap: 6,
    borderWidth: 2,
    borderColor: Colors.yellow,
    ...Platform.select({
      ios: {
        shadowColor: Colors.primary,
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.25,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  retryButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
});
