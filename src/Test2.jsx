import React, { useState } from 'react';
import {
  Button,
  Text,
  TextInput,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
// import RNPickerSelect, { defaultStyles } from './debug';
import MaterialIcon  from 'react-native-vector-icons/MaterialIcons';


const sports = [
  {
    label: 'Football',
    value: 'football',
  },
  {
    label: 'Baseball',
    value: 'baseball',
  },
  {
    label: 'Hockey',
    value: 'hockey',
  },
];


const Test2 = () => {

  const [favSport4, setFavSport4] = useState('')

  return (
    <View>
      <View paddingVertical={5} />

      <Text>custom icon using react-native-vector-icons</Text>
      {/* and value defined */}
      <RNPickerSelect
        placeholder={'placeholder'}
        items={sports}
        onValueChange={value => {
          setFavSport4(value);
        }}
        style={{
          ...pickerSelectStyles,
          iconContainer: {
            top: 10,
            right: 12,
          },
        }}
        value={favSport4}
        useNativeAndroidPickerStyle={false}
        textInputProps={{ underlineColor: 'yellow' }}
        Icon={() => {
          return <MaterialIcon name="keyboard-arrow-down" size={24} color="gray" />;
        }}
      />
    </View>
  )
}

export default Test2

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  scrollContentContainer: {
    paddingTop: 40,
    paddingBottom: 10,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});
