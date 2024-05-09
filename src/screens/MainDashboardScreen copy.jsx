import React from 'react';
import {View, StyleSheet, ScrollView, Text} from 'react-native';

import MainDashboardItemIcon from '../components/MainDashboardItemIcon';
import {MainDashboardList} from '../constant/MainDashboardList';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {Colors} from '../constant/Colors';

const renderCards = () => {
  const navigate = useNavigation();

  const handleNaigate = (name, title) => {
    navigate.navigate(name, {title: title});
  };

  const rows = [];
  for (let i = 0; i < MainDashboardList.length; i += 3) {
    const rowData = MainDashboardList.slice(i, i + 3);
    const cardsInRow = rowData.map(item => (
      <MainDashboardItemIcon
        key={item.id}
        item={item}
        userType="C"
        onPress={() => {
          handleNaigate(item.name, item.title);
        }}
      />
    ));
    rows.push(
      <View key={i} style={styles.row}>
        {cardsInRow}
      </View>,
    );
  }
  return rows;
};

const MainDashboardScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const loggedUser = useSelector(state => state.loginReducer.items);

  const loggedUserNme = useSelector(state => state.loginReducer.loggedUserName);

  const {items, isLoading, error} = useSelector(
    state => state.WardDashboardReducer,
  );
  return (
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
            paddingVertical: 20,
          }}>
          {/* Hello, {loggedUser?.name} {loggedUser?.surname} */}
          Hello, {loggedUserNme}
        </Text>
      </View>
      <ScrollView>
        <View style={[styles.container, {marginTop: 15}]}>{renderCards()}</View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    padding: 5,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
});

export default MainDashboardScreen;
