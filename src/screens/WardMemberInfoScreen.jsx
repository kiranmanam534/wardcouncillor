import {
  Alert,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import WardMemberCard from '../components/WardMemberCard';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {wardMemberInfo} from '../services/loginApi';
import LoaderModal from '../components/LoaderModal';
import {Colors} from '../constant/Colors';
import {authSliceActions} from '../redux/loginSlice';

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
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorTitle}>Profile Loading Error</Text>
            <Text style={styles.errorText}>
              Something went wrong while loading your profile.
            </Text>

            <View style={styles.actionContainer}>
              <Text style={styles.actionText}>Please navigate to</Text>
              <TouchableOpacity
                onPress={goToDashboard}
                style={styles.dashboardButton}
                activeOpacity={0.7}>
                <Text style={styles.dashboardButtonText}>Dashboard</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
      {filteredData && (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
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
    backgroundColor: Colors.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 0,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.white,
  },
  errorCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    maxWidth: 400,
    borderWidth: 2,
    borderColor: Colors.red,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.red,
    marginBottom: 12,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 15,
    color: Colors.black,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  actionText: {
    fontSize: 15,
    color: Colors.black,
    marginRight: 8,
  },
  dashboardButton: {
    backgroundColor: Colors.yellow,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.blue,
    ...Platform.select({
      ios: {
        shadowColor: Colors.yellow,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  dashboardButtonText: {
    color: Colors.indigo,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
