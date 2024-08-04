import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import Voice from '@react-native-community/voice';

const VoiceRecognition1 = () => {
  const [recognized, setRecognized] = useState('');
  const [started, setStarted] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      requestMicrophonePermission();
    }

    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechRecognized = onSpeechRecognized;
    Voice.onSpeechResults = onSpeechResults;

    // Cleanup listeners on unmount
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const requestMicrophonePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Microphone Permission',
          message:
            'This app needs access to your microphone to recognize speech.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Microphone permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const onSpeechStart = e => {
    setStarted('√');
  };

  const onSpeechRecognized = e => {
    setRecognized('√');
  };

  const onSpeechResults = e => {
    setResults(e.value);
  };

  const startRecognizing = async () => {
    try {
      await Voice.start('en-US');
      setRecognized('');
      setStarted('');
      setResults([]);
    } catch (e) {
      console.error(e);
    }
  };

  const stopRecognizing = async () => {
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.stat}>Started: {started}</Text>
      <Text style={styles.stat}>Recognized: {recognized}</Text>
      <Text style={styles.stat}>Results: {results.join(', ')}</Text>
      <Button title="Start Recognizing" onPress={startRecognizing} />
      <Button title="Stop Recognizing" onPress={stopRecognizing} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stat: {
    marginBottom: 10,
    fontSize: 18,
  },
});

export default VoiceRecognition1;
