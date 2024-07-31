import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Platform, PermissionsAndroid } from 'react-native';
import Voice from '@react-native-voice/voice';

const VoiceRecognizer = () => {
  const [started, setStarted] = useState(false);
  const [recognized, setRecognized] = useState('');
  const [error, setError] = useState('');
  const [results, setResults] = useState([]);
  const [partialResults, setPartialResults] = useState([]);

  useEffect(() => {
    const onSpeechStart = (e) => setStarted(true);
    const onSpeechRecognized = (e) => setRecognized(e.recognized);
    const onSpeechEnd = (e) => setStarted(false);
    const onSpeechError = (e) => setError(JSON.stringify(e.error));
    const onSpeechResults = (e) => setResults(e.value);
    const onSpeechPartialResults = (e) => setPartialResults(e.value);

    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechRecognized = onSpeechRecognized;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechPartialResults = onSpeechPartialResults;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const startRecognizing = async () => {
    setRecognized('');
    setError('');
    setResults([]);
    setPartialResults([]);

    // if (Platform.OS === 'android') {
    //   const granted = await PermissionsAndroid.request(
    //     PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    //     {
    //       title: 'Microphone Permission',
    //       message: 'App needs access to your microphone to recognize speech.',
    //     }
    //   );
    //   if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
    //     console.log('Microphone permission denied');
    //     return;
    //   }
    // }

    try {
      await Voice.start('en-US');
    } catch (e) {
      console.error(e);
      console.log(e);
    }
  };

  const stopRecognizing = async () => {
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
      console.log(e);
    }
  };

  const cancelRecognizing = async () => {
    try {
      await Voice.cancel();
    } catch (e) {
      console.error(e);
      console.log(e);
    }
  };

  const destroyRecognizer = async () => {
    try {
      await Voice.destroy();
    } catch (e) {
      console.error(e);
      console.log(e);
    }
    setRecognized('');
    setError('');
    setResults([]);
    setPartialResults([]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.stat}>Started: {started ? 'Yes' : 'No'}</Text>
      <Text style={styles.stat}>Recognized: {recognized}</Text>
      <Text style={styles.stat}>Error: {error}</Text>
      <Button title="Start Recognizing" onPress={startRecognizing} />
      <Button title="Stop Recognizing" onPress={stopRecognizing} />
      <Button title="Cancel" onPress={cancelRecognizing} />
      <Button title="Destroy" onPress={destroyRecognizer} />
      <Text style={styles.stat}>Results</Text>
      {results.map((result, index) => (
        <Text key={index} style={styles.stat}>{result}</Text>
      ))}
      <Text style={styles.stat}>Partial Results</Text>
      {partialResults.map((result, index) => (
        <Text key={index} style={styles.stat}>{result}</Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  stat: {
    margin: 5,
    fontSize: 14,
  },
});

export default VoiceRecognizer;
