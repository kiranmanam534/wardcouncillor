import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
} from 'react-native';

const Test = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [key, setKey] = useState(0);
  const [text, setText] = useState('');

  return (
    <View style={styles.container} key={key}>
      <View>
        <Text>dsds</Text>
      </View>
      <View>
        <Text>dsds</Text>
      </View>
      <View>
        <Text>dsds</Text>
      </View>
      <View>
        <Text>dsds</Text>
      </View>
      <View>
        <Text>dsds</Text>
      </View>
      <View>
        <Text>dsds</Text>
      </View>
      <View>
        <Text>dsds</Text>
      </View>
      <View>
        <Text>dsds</Text>
      </View>
      <View>
        <Text>dsds</Text>
      </View>
      <View>
        <Text>dsds</Text>
      </View>
      <View>
        <Text>dsds</Text>
      </View>
      <View>
        <Text>dsds</Text>
      </View>
      <View>
        <Text>dsds</Text>
      </View>
      <View>
        <Text>dsds</Text>
      </View>
      <View>
        <Text>dsds</Text>
      </View>
      <View>
        <Text>dsds</Text>
      </View>
      <View>
        <Text>dsds</Text>
      </View>
      <View>
        <Text>dsds</Text>
      </View>
      <View>
        <Text>dsds</Text>
      </View>
      <View>
        <Text>dsds</Text>
      </View>
      <View>
        <Text>dsds</Text>
      </View>
      <View>
        <Text>dsds</Text>
      </View>
      <View>
        <Text>dsds</Text>
      </View>
      <View>
        <Text>dsds</Text>
      </View>
      <View>
        <Text>dsds</Text>
      </View>
      <View>
        <Text>dsds</Text>
      </View>
      <View>
        <Text>dsds</Text>
      </View>
      <View>
        <Text>dsds</Text>
      </View>
      <View>
        <Text>dsds</Text>
      </View>
      <View>
        <Text>dsds</Text>
      </View>
      <View>
        <Text>dsds</Text>
      </View>
      <View>
        <Text>dsds</Text>
      </View>
      <View>
        <Text>dsds</Text>
      </View>
      <View>
        <Text>dsds</Text>
      </View>
      <View>
        <Text>dsds</Text>
      </View>
      <View>
        <Text>dsds</Text>
      </View>
      <View>
        <Text>dsds</Text>
      </View>
      <View>
        <Text>dsds</Text>
      </View>
      <View>
        <Text>dsds</Text>
      </View>
      <View>
        <Text>dsds</Text>
      </View>
      <View>
        <Text>dsds</Text>
      </View>
      <View>
        <Text>dsds</Text>
      </View>
      <View>
        <Text>dsds</Text>
      </View>
      <View>
        <Text>dsds</Text>
      </View>
      <View>
        <Text>dsds</Text>
      </View>
      <View>
        <Text>dsds</Text>
      </View>
      <View>
        <Text>dsds</Text>
      </View>
      <View>
        <Text>dsds</Text>
      </View>
      <View>
        <Text>dsds</Text>
      </View>
      <View>
        <Text>dsds</Text>
      </View>
      <View>
        <Text>dsds</Text>
      </View>
      <View>
        <Text>dsds</Text>
      </View>
      <View>
        <Text>dsds</Text>
      </View>
      <View>
        <Text>dsds</Text>
      </View>
      <View>
        <Text>dsds</Text>
      </View>
      <View>
        <Text>dsds</Text>
      </View>
      <View>
        <Text>dsds</Text>
      </View>
      <View>
        <Text>dsds</Text>
      </View>
      <View>
        <Text>dsds</Text>
      </View>
      <View>
        <Text>dsds</Text>
      </View>
      <View>
        <Text>dsds</Text>
      </View>
      <View>
        <Text>dsds</Text>
      </View>
      <View>
        <Text>dsds</Text>
      </View>
      <View>
        <Text>dsds</Text>
      </View>
      <View>
        <Text>dsds</Text>
      </View>
      <View>
        <Text>dsds</Text>
      </View>
      <View>
        <Text>dsds</Text>
      </View>
      <View>
        <Text>dsds</Text>
      </View>
      <View>
        <Text>dsds</Text>
      </View>
      <View>
        <Text>dsds</Text>
      </View>
      <View>
        <Text>dsds</Text>
      </View>
      <View>
        <Text>dsds</Text>
      </View>
      <View>
        <Text>dsds</Text>
      </View>
      <View>
        <Text>dsds</Text>
      </View>
      <View>
        <Text>dsds</Text>
      </View>
      <View>
        <Text>dsds</Text>
      </View>
      <View>
        <Text>dsds</Text>
      </View>
      <View>
        <Text>dsds</Text>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1, marginBottom: 300}}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>Enter Text:</Text>
            <TextInput
              style={{
                height: 40,
                borderColor: 'gray',
                borderWidth: 1,
                width: '80%',
                padding: 10,
                marginTop: 20,
              }}
              onChangeText={text => setText(text)}
              value={text}
              placeholder="Type here"
            />
            <Button title="Submit" onPress={() => alert('Submitted')} />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBox: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '80%',
    paddingHorizontal: 10,
  },
});

export default Test;
