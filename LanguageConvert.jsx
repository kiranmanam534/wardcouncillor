import {Button, StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useState} from 'react';

import axios from 'axios';

const LanguageConvert = () => {
  const [inputText, setInputText] = useState(
    'vind die top vyf rekords van eiendomme.',
  );
  const [translatedText, setTranslatedText] = useState('');

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
    <View style={{padding: 20, flex: 1, justifyContent: 'center'}}>
      <TextInput
        placeholder="Enter text"
        value={inputText}
        onChangeText={setInputText}
        style={{borderWidth: 1, marginBottom: 20, padding: 10}}
      />
      <Button
        title="Translate Afrikaans to English"
        onPress={() => handleTranslate('af')}
      />
      <Button
        title="Translate Zulu to English"
        onPress={() => handleTranslate('zu')}
      />
      {translatedText && (
        <Text style={{marginTop: 20}}>Translated Text: {translatedText}</Text>
      )}
    </View>
  );
};

export default LanguageConvert;

const styles = StyleSheet.create({});
