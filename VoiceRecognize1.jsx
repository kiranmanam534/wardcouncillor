import React, {useState, useEffect} from 'react';
import {View, Text, Button, Picker} from 'react-native';
import Voice from '@react-native-community/voice';

const VoiceRecognition1 = () => {
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [language, setLanguage] = useState('zu-ZA'); // Default to Zulu

  useEffect(() => {
    Voice.onSpeechResults = e => setResult(e.value[0]);
    Voice.onSpeechError = e => setError(e.error.message);

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const startRecognizing = async () => {
    try {
      await Voice.start('af-ZA');
      setResult('');
      setError('');
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

  const translateText = async (text, targetLanguage) => {
    console.log(text, targetLanguage);
    const apiKey = 'AIzaSyCcbjNrLyNtA-sjHpQl0OUfwKBXLspdWqs';
    const url = `https://translation.googleapis.com/language/translate/v2`;

    try {
      const response = await axios.post(url, null, {
        params: {
          q: text,
          target: targetLanguage,
          key: apiKey,
        },
      });

      const translatedText = response.data.data.translations[0].translatedText;
      return translatedText;
    } catch (error) {
      console.error('Error translating text:', error);
      throw error;
    }
  };

  const handleTranslate = async language => {
    try {
      const result = await translateText(inputText, 'en'); // 'en' for English
      setTranslatedText(result);
    } catch (error) {
      console.log(error);
      console.error('Translation error:', error);
    }
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Result: {result}</Text>
      <Text>Error: {error}</Text>
      <Button title="Start Recognizing" onPress={startRecognizing} />
      <Button title="Stop Recognizing" onPress={stopRecognizing} />
    </View>
  );
};

export default VoiceRecognition1;
