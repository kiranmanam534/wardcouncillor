import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import Tts from 'react-native-tts';

export default function VoiceSpeakScreen() {
  const speak = () => {
    Tts.setDefaultLanguage('en-US');
    Tts.setDefaultRate(0.5);
    Tts.setDefaultPitch(1.2);
    Tts.speak('Hello, this is a text to speech test.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.instructions}>Press the button to hear the text.</Text>
      <Button title="Speak" onPress={speak} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
