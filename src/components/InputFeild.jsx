import { Keyboard, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { Fragment } from 'react';
import { Picker } from '@react-native-picker/picker';
import { Colors } from '../constant/Colors';
import { TextInput } from 'react-native-paper';

const InputFeild = ({ onChangeText, value, item, toggleDatepicker, Categories,onPressIn ,onPress}) => {
  // console.log('Categories', Categories);

  if (item.text == 'dropdown') {

    return (
      <View style={styles.dropdown}>
        {Categories ? <Picker
          selectedValue={value}
          onValueChange={onChangeText}
          mode="dialog"
          itemStyle={styles.itemStyle}
          // Customize the selected item color
          selectionColor={Colors.primary}>
          <Picker.Item label={item.label} value="" />
          {Categories.map((category) => (
            <Picker.Item key={category.id} label={category.name} value={category.name} />
          ))}

        </Picker> : <Picker
          selectedValue={value}
          onValueChange={onChangeText}
          mode="dialog"
          itemStyle={styles.itemStyle}
          // Customize the selected item color
          selectionColor={Colors.primary}>
          <Picker.Item label={item.label} value="" />
          <Picker.Item label="Mr" value="Mr" />
          <Picker.Item label="Mrs" value="Mrs" />
          <Picker.Item label="Dr" value="Dr" />
        </Picker>}
      </View>
    );
  } else if (item.text == 'textarea') {
    return (
      <TextInput
        mode="outlined"
        label={item.label}
        multiline={true}
        numberOfLines={4} // You can adjust the number of lines displayed
        // style={styles.input}
        onChangeText={onChangeText}
        value={value}
        // placeholder={item.placeholder}
        // placeholderTextColor={Colors.black}
        autoCorrect={false}
        keyboardType={item.type}
        autoCapitalize="none"
      />
    );
  } else if (item.text == 'date' || item.text == 'time') {
    return (
      <Pressable onPress={onPress}>
        <TextInput
          mode="outlined"
          label={item.label}
          onChangeText={onChangeText}
          value={value}
          editable={false}
          onPressIn={onPressIn}
        />
      </Pressable>
    );
  } else {
    return (
      <TextInput
        mode="outlined"
        label={item.label}
        // style={styles.input}
        onChangeText={onChangeText}
        value={value}
        secureTextEntry={item.label === 'Password'}
        // placeholder={item.placeholder}
        // placeholderTextColor={Colors.black}
        autoCorrect={false}
        keyboardType={item.type}
        autoCapitalize="none"
      />
    );
  }
};

export default InputFeild;

const styles = StyleSheet.create({
  dropdown: {
    width: '100%',
    height: 50,
    paddingLeft: 7,
    borderColor: Colors.black,
    borderWidth: 1,
    borderRadius: 7,
    color: Colors.black,
    backgroundColor: Colors.white
  },
  itemStyle: {
    fontSize: 16,
    color: 'black', // Default text color
  },
  input: {
    width: '100%',
    height: 50,
    paddingHorizontal: 20,
    borderColor: Colors.black,
    borderWidth: 1,
    borderRadius: 7,
    color: Colors.black,
  },
});
