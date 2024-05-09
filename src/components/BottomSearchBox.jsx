import React, {useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import {Colors} from '../constant/Colors';

const BottomSearchBox = ({
  searchText,
  onChangeText,
  onPress,
  placeholder,
  isLoading,
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={searchText}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.blue}
        autoCorrect={false}
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.searchButton} onPress={onPress}>
        {isLoading ? (
          // <Text style={{color:Colors.white,fontSize:35}}>...</Text>
         <ActivityIndicator size={24} color={Colors.yellow}/>
        ) : (
          <Ionicons name="search" size={24} color={Colors.yellow} />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default BottomSearchBox;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    //   paddingBottom: 20,
    backgroundColor: Colors.lightgray,
    // borderWidth:1,
    // borderColor:Colors.blue,
    // borderTopLeftRadius:30,
    // borderTopRightRadius:30
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: Colors.white,
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 5,
    position: 'relative',
    borderWidth: 0.7,
    borderColor: Colors.blue,
  },
  searchButton: {
    width: 50,
    height: 50,
    // borderRadius: 25,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 15,
    bottom: 0,
    top: 10,
  }
});
