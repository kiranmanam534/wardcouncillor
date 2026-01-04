import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Dimensions,
  Image,
  PermissionsAndroid,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors} from '../constant/Colors';
import LoadingDots from '../components/LoadingDots';
import TypingIndicator from '../components/TypingIndicator';
import {useDispatch} from 'react-redux';
import Voice from '@react-native-community/voice';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import {hideData, showData} from '../redux/visibilityAIIconSlice';
import {set} from 'react-hook-form';
import {useNavigation} from '@react-navigation/native';
import {BarChart} from 'react-native-gifted-charts';
import {BarChart as BarChartWrapper} from 'react-native-charts-wrapper';
import {formattedAmount} from '../utility/FormattedAmmount';
import {formatNumber} from '../utility/formatNumber';
const screenWidth = Dimensions.get('window').width;

const chartData1 = [
  {value: 822139232, label: 'TotalCount'},
  {value: 6691000000, label: 'MaxMarketValue'},
];

const WardsDBAIScreen = () => {
  const {height} = useWindowDimensions();
  console.log('height==>', height);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [headers, setHeaders] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState([{role: 'user', content: []}]);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingCount, setLoadingCount] = useState(0);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const flatListRef = useRef(null);

  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [recognizedText, setRecognizedText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [chartData, setChartData] = useState([]);

  const [searchVisible, setSearchVisible] = useState(false);
  const [Language, setLanguage] = useState('English');
  const [isTyping, setIsTyping] = useState(false);

  // const dd = {
  //   MaxMarketValue: 6691000000,
  //   MinMarketValue: 0,
  // };

  // for (let key in dd) {
  //   console.log(key, dd[key]);
  // }

  const toggleSearchBar = val => {
    // setLanguage('language');
    if (val) {
      val =
        val === 'en'
          ? 'English'
          : val === 'af'
          ? 'Afrikaans'
          : val === 'zu'
          ? 'Zulu'
          : val === 'xh'
          ? 'Xhosa'
          : val === 'nso'
          ? 'Sepedi/Northern Sotho'
          : val === 'tn'
          ? 'Setswana'
          : val === 'st'
          ? 'Sesotho'
          : 'English';
      setLanguage(val);
    }
    setSearchVisible(!searchVisible);
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={toggleSearchBar}
          activeOpacity={0.7}
          style={styles.languageHeaderButton}>
          <Icon name="globe-outline" size={18} color={Colors.yellow} />
          <Text style={styles.languageHeaderText}>{Language}</Text>
          <Icon name="chevron-down" size={16} color={Colors.yellow} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, searchVisible, Language]);

  const translateText = async (text, targetLanguage) => {
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
      setInput(result);
    } catch (error) {
      console.log(error);
      console.error('Translation error:', error);
    }
  };

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({animated: true});
    }
  }, [messages]);

  useEffect(() => {
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechResults = e => {
    // setRecognizedText(e.value[0]);
    setInput(e.value[0]);

    // setTimeout(() => {
    //   sendMessage();
    // }, 1000);
  };

  const onSpeechStart = () => {
    setIsListening(true);
  };

  const onSpeechEnd = () => {
    setIsListening(false);
  };

  const onSpeechError = e => {
    setIsListening(false);
    console.error(e);
  };

  const startListening = async () => {
    try {
      await Voice.start('en-US');
      setRecognizedText('');
    } catch (e) {
      console.error(e);
    }
  };

  const stopListening = async () => {
    try {
      sendMessage();
      await Voice.stop();
      setRecognizedText('');
    } catch (e) {
      console.error(e);
    }
  };

  // useEffect(() => {
  //   if (recognizedText) {
  //     sendMessage();
  //   }
  // }, [recognizedText]);

  const startTimer = () => {
    setTimer(0);
    const id = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
    setIntervalId(id);
  };

  const stopTimer = () => {
    console.log(intervalId);
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  const formatTime = seconds => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Utility function to format numbers
  const formatNumberWithoutText = number => {
    // console.log(number);
    if (number >= 1000000000) {
      return (number / 1000000000).toFixed(1);
    } else if (number >= 1000000) {
      return (number / 1000000).toFixed(1);
    } else if (number >= 100000) {
      return (number / 1000).toFixed(1); // + 'k';
    }
    return number.toFixed(1).toString();
  };

  // Utility function to format values
  const formatValue = value => {
    if (value >= 1_000_000_000) {
      return (value / 1_000_000_000).toFixed(2) + 'B';
    } else if (value >= 1_000_000) {
      return (value / 1_000_000).toFixed(2) + 'M';
    } else if (value >= 1_000) {
      return (value / 1_000).toFixed(2) + 'K';
    }
    return value.toString();
  };
  const formatValueWithoutText = value => {
    if (value >= 1_000_000_000) {
      return (value / 1_000_000_000).toFixed(2);
    } else if (value >= 1_000_000) {
      return (value / 1_000_000).toFixed(2);
    }
    // else if (value >= 1_000) {
    //   return (value / 1_000).toFixed(2);
    // }
    return value;
  };

  // console.log('input====>', input);

  // useEffect(() => {
  // if (results.length > 0) {
  // setInput(results.join(' '));
  // }
  // }, [results]);

  useEffect(() => {
    dispatch(hideData());
    return () => {
      dispatch(showData());
    };
  }, [dispatch]);

  const DynamicKeyValueDisplayBody = ({data}) => {
    return (
      <>
        <View
          style={{
            // borderWidth: 1,
            // borderColor: Colors.white,

            flexDirection: 'row',
          }}>
          {Object.entries(data).map(([key, value], index) => (
            <View
              key={`header-${key}-${index}`}
              style={{
                width: '50%',
                // borderBottomWidth: 0,
                padding: 10,
                borderWidth: 1,
                // borderRightWidth: 0,
                borderColor: Colors.white,
              }}>
              <Text
                style={{
                  color: Colors.primary,
                  fontSize: 11,
                  fontWeight: '600',
                }}>
                {key}
              </Text>
            </View>
          ))}
        </View>
        <View
          style={{
            // borderWidth: 1,
            // borderColor: Colors.white,

            flexDirection: 'row',
          }}>
          {Object.entries(data).map(([key, value], index) => (
            <View
              key={`value-${key}-${index}`}
              style={{
                width: '50%',
                // borderBottomWidth: 0,
                padding: 10,
                borderWidth: 1,
                // borderRightWidth: 0,
                borderColor: Colors.lightgray1,
              }}>
              <Text style={{color: Colors.black, fontSize: 11}}>{value}</Text>
            </View>
          ))}
        </View>
      </>
    );
  };
  const DynamicKeyValueDisplayBody1 = ({data, totalColumns}) => {
    const columnWidth = (screenWidth - 40) / totalColumns; // Full screen minus padding
    return (
      <View
        key={`body1-${data['key']}`}
        style={{
          paddingHorizontal: 12,
          paddingVertical: 10,
          borderWidth: 1,
          width: columnWidth,
          borderColor: Colors.lightgray1,
          backgroundColor: Colors.primary,
        }}>
        <Text
          style={{
            color: Colors.white,
            fontSize: 12,
            fontWeight: '700',
            textAlign: 'center',
          }}>
          {data['displayName'] || data['key']?.replace('_0', '')}
        </Text>
      </View>
    );
  };

  const DynamicKeyValueDisplayBody2 = ({data, keyId, index, totalColumns}) => {
    const isEven = index % 2 === 0;
    const columnWidth = (screenWidth - 40) / totalColumns; // Full screen minus padding
    return (
      <View
        key={`body2-${JSON.stringify(data)}`}
        style={{
          paddingHorizontal: 12,
          paddingVertical: 10,
          borderWidth: 1,
          width: columnWidth,
          borderColor: Colors.lightgray1,
          backgroundColor: isEven ? '#F8FAFC' : Colors.white,
        }}>
        <Text
          style={{
            color: Colors.black,
            fontSize: 12,
            fontWeight: '500',
            textAlign: 'center',
          }}>
          {JSON.stringify(data)?.replace(/"/g, '')}
        </Text>
      </View>
    );
  };

  const DynamicKeyValueDisplayBody3 = ({data, keys}) => {
    return (
      <>
        {data.map((item, itemIndex) => (
          <View
            key={`item-${itemIndex}`}
            style={{
              borderWidth: 0,
              borderColor: Colors.white,
              flexDirection: 'row',
              borderColor: Colors.white,
              paddingHorizontal: 10,
              marginTop: -10,
            }}>
            {Object.entries(item['items']).map(([key, value], entryIndex) =>
              keys.map((k1, keyIndex) => (
                <View
                  key={`entry-${itemIndex}-${entryIndex}-${keyIndex}`}
                  style={{
                    // width: '50%',
                    // borderBottomWidth: 0,
                    paddingHorizontal: 10,
                    paddingVertical: 8,
                    borderWidth: 1,
                    width: 300,
                    // borderRightWidth: 0,
                    borderColor: Colors.lightgray1,
                    backgroundColor: Colors.white,
                  }}>
                  <Text style={{color: Colors.black, fontSize: 11}}>
                    {item['items'][k1['key']]}
                  </Text>
                </View>
              )),
            )}
          </View>
        ))}

        {/* <Text style={{color: Colors.white, fontSize: 11}}>
          {JSON.stringify(data)}
        </Text> */}
      </>
    );
  };
  // console.log(input);

  // Function to get values based on index
  const getValueByIndex = (data, index) => {
    return data.map(item => Object.values(item)[index].trim());
  };

  const sendMessage = async () => {
    console.log(input);
    if (input) {
      // setChartData([]);
      let NewChartData = [];
      let keysList = [];
      let ValuesList = [];
      console.log('input', input, !['en', 'Language'].includes(Language));
      let lanRes = input;
      if (!['en', 'Language'].includes(Language)) {
        try {
          lanRes = await translateText(input, 'en');
          console.log('lanRes===>', lanRes);
        } catch (error) {
          console.log(error);
        }
      }

      setLoadingCount(loadingCount + 1);
      const newMessages = [
        ...messages,
        {
          role: 'user',
          content: [lanRes.toString()],
          sqlQuery: '',
          count: loadingCount + 1,
          chartData: [],
          error: false,
          question: lanRes.toString(),
        },
      ];
      setMessages(newMessages);
      setInput('');
      setIsLoading(true);

      // Simulate typing with slight delay
      setTimeout(() => {
        setIsTyping(true);
      }, 300);

      try {
        const postData = {query: lanRes.toString(), tables: []};
        // console.log(postData);
        // const result = await axios.post('http://102.130.114.194:10000/api/getdata', postData);
        const result = await axios.post(
          'http://102.130.114.194:3344/api/getdata',
          postData,
        );
        // console.log(result.data[0].SQL)
        const resutSetData = result.data[0].results.recordsets[0];
        console.log('resutSetData==>', resutSetData);
        // const accountNos = getValueByIndex(resutSetData, 0);
        // console.log(accountNos);
        // const payables = getValueByIndex(resutSetData, 1);
        // console.log(payables);

        if (typeof resutSetData === 'object' && Array.isArray(resutSetData)) {
          console.log('checking..');
          for (let index in resutSetData) {
            const rData = resutSetData[index];

            console.log('rData==>', rData);
            if (typeof rData === 'object' && !Array.isArray(rData)) {
              for (let key in rData) {
                // console.log(rData[key]);
                // NewChartData.push({
                //   label: dicRes[key],
                //   value: parseFloat(dicRes[key]),
                //   actualValue: dicRes[key],
                // });
                // console.log(index);
                if (index == 0) {
                  // console.log(key);
                  keysList.push({key: `${key}_${index}`, displayName: key});
                }
              }

              if (keysList.length === 2) {
                // console.log(keysList[0]);
                // console.log(keysList[1]);
                // console.log(rData[keysList[0]['key']]);
                // console.log(rData[keysList[1]['key']]);
                const numericValue = parseFloat(rData[keysList[1]['key']]);
                // Only push valid numeric values
                if (!isNaN(numericValue) && isFinite(numericValue)) {
                  NewChartData.push({
                    label: rData[keysList[0]['key']],
                    value: Math.abs(numericValue), // Use absolute value for negative numbers
                    actualValue: rData[keysList[1]['key']],
                  });
                }
              }

              for (let key_index in keysList) {
                // console.log(rData[keysList[key_index]['key']]);
                //  NewChartData.push({
                //   label: rData[keysList[key_index]['key']],
                //   value: parseFloat(rData[keysList[key_index]['key']]),
                //   actualValue: dicRes[key],
                // });
              }

              ValuesList.push({items: rData});
            }
          }
        }

        // Count the keys if the response is an object
        if (typeof resutSetData === 'object' && !Array.isArray(resutSetData)) {
          const dicRes = resutSetData;
          // for (let key in dicRes) {
          //  console.log()
          // }
          if (Object.keys(resutSetData).length === 2) {
            for (let key in dicRes) {
              // console.log(
              //   key,
              //   dicRes[key],
              //   formatValueWithoutText(dicRes[key]),
              // );
              // NewChartData.push({
              //   label: dicRes[key],
              //   value: parseFloat(dicRes[key]),
              //   actualValue: dicRes[key],
              // });
            }
          }
        }

        // const response = await axios.post('http://your_backend_ip:5000/api/chat', { message: input });
        // setMessages([...newMessages, { role: 'bot', content: result.data[0].results.recordsets[0], count: loadingCount + 2 }]);
        setMessages([
          ...newMessages,
          {
            role: 'bot',
            content: result.data[0].results.recordsets,
            sqlQuery: result.data[0].SQL,
            barChatImg: result.data[0]?.img,
            keysList: keysList,
            ValuesList: ValuesList,
            count: loadingCount + 2,
            chartData: NewChartData,
            error: false,
            question: lanRes.toString(),
          },
        ]);

        setIsTyping(false);
        setIsLoading(false);
        // setToBeDisplay(result.data);
        setInput('');
        // setResults([]);
      } catch (error) {
        console.log('Error sending message:', error);
        setMessages([
          ...newMessages,
          {
            role: 'bot',
            content: [['Result not found!']],
            sqlQuery: '',
            barChatImg: '',
            error: true,
            count: loadingCount + 2,
            chartData: [],
            question: lanRes.toString(),
          },
        ]);
        setIsTyping(false);
        setIsLoading(false);
        setInput('');
        // setResults([]);
      }
    } else {
      Alert.alert('Required!', 'Please enter a message!');
    }
  };

  console.log('kmkmkmkmkmk=>', JSON.stringify(messages));

  if (searchVisible)
    return (
      <SafeAreaView style={styles.languageContainer}>
        <View style={styles.languageContent}>
          <View style={styles.languageHeader}>
            <Icon name="language" size={40} color={Colors.primary} />
            <Text style={styles.languageTitle}>Choose Your Language</Text>
            <Text style={styles.languageSubtitle}>
              Select your preferred language for AI assistance
            </Text>
          </View>
          <View style={styles.languageGrid}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => toggleSearchBar('en')}
              style={styles.languageOption}>
              <Icon name="checkmark-circle" size={24} color={Colors.yellow} />
              <Text style={styles.languageOptionText}>English</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => toggleSearchBar('zu')}
              style={styles.languageOption}>
              <Icon name="checkmark-circle" size={24} color={Colors.yellow} />
              <Text style={styles.languageOptionText}>Zulu</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => toggleSearchBar('af')}
              style={styles.languageOption}>
              <Icon name="checkmark-circle" size={24} color={Colors.yellow} />
              <Text style={styles.languageOptionText}>Afrikaans</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => toggleSearchBar('xh')}
              style={styles.languageOption}>
              <Icon name="checkmark-circle" size={24} color={Colors.yellow} />
              <Text style={styles.languageOptionText}>Xhosa</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => toggleSearchBar('nso')}
              style={styles.languageOption}>
              <Icon name="checkmark-circle" size={24} color={Colors.yellow} />
              <Text style={styles.languageOptionText}>Sepedi</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => toggleSearchBar('tn')}
              style={styles.languageOption}>
              <Icon name="checkmark-circle" size={24} color={Colors.yellow} />
              <Text style={styles.languageOptionText}>Setswana</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => toggleSearchBar('st')}
              style={styles.languageOption}>
              <Icon name="checkmark-circle" size={24} color={Colors.yellow} />
              <Text style={styles.languageOptionText}>Sesotho</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );

  // if (true)
  //   return (
  //     <SafeAreaView style={{flex: 1}}>
  //       <ScrollView horizontal>
  //         <View style={{flexDirection: 'row'}}>
  //           <Text>KM2</Text>
  //           <Text>KM2</Text>
  //           <Text>KM2</Text>
  //           <Text>KM2</Text>
  //           <Text>KM2</Text>
  //           <Text>KM2</Text>
  //           <Text>KM2</Text>
  //           <Text>KM2</Text>
  //           <Text>KM2</Text>
  //           <Text>KM2</Text>
  //           <Text>KM2</Text>
  //           <Text>KM2</Text>
  //           <Text>KM2</Text>
  //           <Text>KM2</Text>
  //           <Text>KM2</Text>
  //           <Text>KM2</Text>
  //         </View>
  //       </ScrollView>
  //     </SafeAreaView>
  //   );

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.lightgray2}}>
      <View style={{flex: 1}}>
        {/* {Platform.OS == 'ios' && (
          <View
            style={[
              styles.container1,
              {position: 'relative', marginVertical: 40},
            ]}>
            <View
              style={{
                width: '98%',
                flexDirection: 'row',
                position: 'absolute',
                marginLeft: 5,
              }}>
              {isListening ? (
                <View style={styles.recordingContainer}>
                  <Text style={styles.timerText}>
                    <Text style={styles.statusText}>Recording...</Text>
                  </Text>
                </View>
              ) : (
                <View style={{flexDirection: 'row', width: '87%'}}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Type or Speak..."
                    multiline
                    value={input}
                    onChangeText={setInput}
                  />
                  <TouchableOpacity
                    style={styles.sendButton}
                    onPress={sendMessage}>
                    <Icon name="send" size={24} color={Colors.blue} />
                  </TouchableOpacity>
                </View>
              )}
              <View style={{width: '13%'}}>
                <TouchableOpacity
                  onPress={isListening ? stopListening : startListening}
                  style={[styles.voiceButton, isListening && styles.recording]}>
                  <MaterialIcon
                    name={isListening ? 'stop' : 'mic'}
                    size={30}
                    color="#fff"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )} */}
        <View style={styles.container}>
          <KeyboardAvoidingView
            style={{flex: 1}}
            behavior={Platform.OS == 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={100}>
            <FlatList
              style={{position: 'relative'}}
              ref={flatListRef}
              data={messages}
              ListEmptyComponent={() => (
                <View style={styles.emptyStateContainer}>
                  <View style={styles.emptyStateIconContainer}>
                    <Icon
                      name="chatbubbles-outline"
                      size={80}
                      color={Colors.primary}
                    />
                  </View>
                  <Text style={styles.emptyStateTitle}>
                    Start a Conversation
                  </Text>
                  <Text style={styles.emptyStateSubtitle}>
                    Ask me anything about ward data, billing, collections, or
                    outstanding amounts
                  </Text>
                  <View style={styles.exampleQuestions}>
                    <Text style={styles.exampleTitle}>Example questions:</Text>
                    <View style={styles.exampleItem}>
                      <Icon
                        name="arrow-forward-circle-outline"
                        size={16}
                        color={Colors.yellow}
                      />
                      <Text style={styles.exampleText}>
                        Show me outstanding amount by ward
                      </Text>
                    </View>
                    <View style={styles.exampleItem}>
                      <Icon
                        name="arrow-forward-circle-outline"
                        size={16}
                        color={Colors.yellow}
                      />
                      <Text style={styles.exampleText}>
                        What is the total billing amount?
                      </Text>
                    </View>
                    <View style={styles.exampleItem}>
                      <Icon
                        name="arrow-forward-circle-outline"
                        size={16}
                        color={Colors.yellow}
                      />
                      <Text style={styles.exampleText}>
                        Show collections by month
                      </Text>
                    </View>
                  </View>
                </View>
              )}
              renderItem={({item}) => (
                <>
                  {item.role === 'user' &&
                    isLoading &&
                    item.count == loadingCount &&
                    isTyping && <TypingIndicator />}
                  {/* {item.sqlQuery && (
                  <View
                    style={[
                      styles.botMessage,
                      {
                        width: Dimensions.get('screen').width,
                        backgroundColor: '#145DA0',
                      },
                    ]}>
                    <Text
                      style={{
                        color: Colors.yellow,
                        textDecorationLine: 'underline',
                        fontSize: 15,
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                      }}>
                      #SQL Query:
                    </Text>
                    <Text
                      style={{color: Colors.white, padding: 5, fontSize: 11}}>
                      {item.sqlQuery}
                    </Text>
                  </View>
                )} */}

                  <View
                    style={
                      item.role === 'user'
                        ? styles.userMessage
                        : styles.botMessage
                    }>
                    {item.role === 'user' && (
                      <View style={styles.userMessageContent}>
                        {item?.content?.map((item1, index) => (
                          <View
                            key={`user-content-${index}`}
                            style={styles.itemContainer}>
                            <Text style={styles.itemText}>
                              {JSON.stringify(item1)?.replace(/"/g, '')}
                            </Text>
                          </View>
                        ))}
                      </View>
                    )}
                    {item?.content?.map((item1, index) => (
                      <>
                        <View key={index}>
                          {item.role === 'bot' && (
                            <View style={styles.itemContainer}>
                              {item.error ? (
                                <View style={styles.errorContainer}>
                                  <MaterialIcon
                                    name="error-outline"
                                    size={20}
                                    color={Colors.red}
                                  />
                                  <Text style={styles.errorText}>
                                    {JSON.stringify(item1?.toString())?.replace(
                                      /"/g,
                                      '',
                                    )}
                                  </Text>
                                </View>
                              ) : (
                                <>
                                  <View style={styles.answerHeader}>
                                    <Icon
                                      name="checkmark-circle"
                                      size={18}
                                      color={Colors.green}
                                    />
                                    <Text style={styles.answerLabel}>
                                      Answer
                                    </Text>
                                  </View>
                                  <View
                                    style={{
                                      backgroundColor: '#F0F4F8',
                                      paddingHorizontal: 15,
                                      paddingVertical: 10,
                                      borderRadius: 8,
                                      marginBottom: 10,
                                      marginTop: -15,
                                    }}>
                                    <View
                                      style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        gap: 8,
                                      }}>
                                      <Icon
                                        name="list"
                                        size={16}
                                        color={Colors.primary}
                                      />
                                      <Text
                                        style={{
                                          fontSize: 13,
                                          fontWeight: '600',
                                          color: Colors.primary,
                                        }}>
                                        {item?.ValuesList?.length || 0} Records
                                        Found
                                      </Text>
                                    </View>
                                  </View>
                                  <ScrollView
                                    horizontal={true}
                                    style={{marginBottom: 20}}>
                                    <View style={{flex: 1}}>
                                      <View
                                        style={{
                                          flexDirection: 'row',
                                          paddingHorizontal: 10,
                                          marginBottom: 0,
                                          borderBottomWidth: 2,
                                          borderBottomColor: Colors.primary,
                                        }}>
                                        {item?.keysList?.map(
                                          (col, colIndex) => (
                                            <View
                                              key={`keyslist-${item.count}-${colIndex}`}
                                              style={{padding: 0}}>
                                              {item.role === 'bot' && (
                                                <DynamicKeyValueDisplayBody1
                                                  data={col}
                                                  totalColumns={
                                                    item?.keysList?.length || 2
                                                  }
                                                />
                                              )}
                                            </View>
                                          ),
                                        )}
                                      </View>
                                      <View
                                        style={{
                                          borderWidth: 0,
                                          paddingHorizontal: 10,
                                          marginTop: -10,
                                        }}>
                                        {item?.ValuesList?.map(
                                          (val, valIndex) => (
                                            <View
                                              key={`valueslist-${item.count}-${valIndex}`}
                                              style={{
                                                flexDirection: 'row',
                                                borderBottomWidth: 1,
                                                borderBottomColor:
                                                  Colors.lightgray1,
                                              }}>
                                              {item.role === 'bot' &&
                                                Object.entries(
                                                  val['items'],
                                                ).map(
                                                  ([key, value], entryIdx) => (
                                                    <DynamicKeyValueDisplayBody2
                                                      key={`entry-${item.count}-${valIndex}-${entryIdx}-${key}`}
                                                      data={value}
                                                      keyId={item?.keysList}
                                                      index={valIndex}
                                                      totalColumns={
                                                        item?.keysList
                                                          ?.length || 2
                                                      }
                                                    />
                                                  ),
                                                )}
                                            </View>
                                          ),
                                        )}
                                      </View>
                                    </View>
                                  </ScrollView>
                                </>
                              )}
                            </View>
                          )}
                        </View>
                      </>
                    ))}
                  </View>
                  {item.role === 'bot' &&
                    item.chartData &&
                    item.chartData.length > 0 &&
                    item.chartData.some(
                      d => d.value && !isNaN(d.value) && isFinite(d.value),
                    ) && (
                      <View
                        style={{
                          marginVertical: 15,
                          backgroundColor: Colors.white,
                          borderRadius: 16,
                          padding: 15,
                          marginHorizontal: 10,
                          shadowColor: '#1E40AF',
                          shadowOffset: {width: 0, height: 3},
                          shadowOpacity: 0.08,
                          shadowRadius: 8,
                          elevation: 5,
                        }}>
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: '700',
                            color: Colors.primary,
                            marginBottom: 10,
                            textAlign: 'center',
                          }}>
                          Outstanding by Ward (
                          {
                            item.chartData.filter(
                              d =>
                                d.value && !isNaN(d.value) && isFinite(d.value),
                            ).length
                          }{' '}
                          Wards)
                        </Text>
                        <ScrollView
                          horizontal={true}
                          showsHorizontalScrollIndicator={true}>
                          <BarChart
                            data={item.chartData.filter(
                              d =>
                                d.value && !isNaN(d.value) && isFinite(d.value),
                            )}
                            barWidth={35}
                            width={
                              item.chartData.filter(
                                d =>
                                  d.value &&
                                  !isNaN(d.value) &&
                                  isFinite(d.value),
                              ).length * 60
                            }
                            spacing={20}
                            yAxisThickness={1}
                            xAxisThickness={1}
                            isAnimated
                            barBorderRadius={4}
                            sideWidth={15}
                            cappedBars
                            capColor={'rgba(78, 0, 142)'}
                            capThickness={4}
                            showGradient
                            gradientColor={'rgba(200, 100, 244,0.8)'}
                            frontColor={'rgba(219, 182, 249,0.2)'}
                            xAxisLabelsVerticalShift={20}
                            lineConfig={{
                              color: '#4CAF50',
                              thickness: 2,
                              curved: true,
                            }}
                            xAxisLabelTextStyle={styles.labelTextStyle}
                            yAxisLabelContainerStyle={styles.labelTextStyle1}
                            renderTooltip={(item, index) => {
                              return (
                                <View
                                  style={{
                                    marginLeft: -6,
                                    backgroundColor: Colors.primary,
                                    padding: 5,
                                    borderRadius: 4,
                                  }}>
                                  <Text
                                    style={{
                                      color: Colors.white,
                                      textAlign: 'center',
                                    }}>
                                    {formattedAmount(
                                      parseFloat(item.value),
                                      'en-ZA',
                                      'ZAR',
                                      'currency',
                                    )}
                                  </Text>
                                </View>
                              );
                            }}
                          />
                        </ScrollView>
                      </View>
                    )}

                  {item.role === 'bot' && item.barChatImg && (
                    <View
                      style={{
                        marginVertical: 15,
                        backgroundColor: Colors.white,
                        borderRadius: 16,
                        padding: 15,
                        marginHorizontal: 10,
                        shadowColor: '#1E40AF',
                        shadowOffset: {width: 0, height: 3},
                        shadowOpacity: 0.08,
                        shadowRadius: 8,
                        elevation: 5,
                      }}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: '700',
                          color: Colors.primary,
                          marginBottom: 10,
                          textAlign: 'center',
                        }}>
                        Chart Visualization
                      </Text>
                      <Image
                        source={{uri: item.barChatImg}}
                        style={styles.img}
                        resizeMode="contain"
                      />
                    </View>
                  )}
                </>
              )}
              keyExtractor={(item, index) =>
                index.toString() + Math.random(1, 10).toString()
              }
            />
            {/* {Platform.OS == 'android' && ( */}
            <View style={styles.inputWrapper}>
              {isListening ? (
                <View style={styles.recordingIndicator}>
                  <View style={styles.recordingPulse} />
                  <MaterialIcon name="mic" size={20} color={Colors.red} />
                  <Text style={styles.recordingText}>Recording...</Text>
                </View>
              ) : (
                <>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.messageInput}
                      placeholder="Ask me anything..."
                      placeholderTextColor={Colors.gray}
                      multiline
                      value={input}
                      onChangeText={setInput}
                    />
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={styles.sendButton}
                      onPress={sendMessage}>
                      <Icon name="send" size={22} color={Colors.white} />
                    </TouchableOpacity>
                  </View>
                </>
              )}
              <View style={{width: '13%'}}>
                <TouchableOpacity
                  onPress={isListening ? stopListening : startListening}
                  style={[styles.voiceButton, isListening && styles.recording]}>
                  <MaterialIcon
                    name={isListening ? 'stop' : 'mic'}
                    size={30}
                    color="#fff"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default WardsDBAIScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: Colors.lightgray2,
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
    borderRadius: 50,
  },
  languageContainer: {
    flex: 1,
    backgroundColor: Colors.lightgray2,
  },
  languageContent: {
    flex: 1,
    padding: 20,
  },
  languageHeader: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  languageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  languageSubtitle: {
    fontSize: 15,
    color: Colors.gray,
    textAlign: 'center',
  },
  languageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  languageOption: {
    width: '48%',
    backgroundColor: Colors.white,
    padding: 20,
    marginBottom: 12,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    ...Platform.select({
      ios: {
        shadowColor: Colors.black,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
    borderWidth: 1,
    borderColor: Colors.lightgray1,
  },
  languageOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 60,
  },
  emptyStateIconContainer: {
    marginBottom: 24,
    opacity: 0.6,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 15,
    color: Colors.gray,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  exampleQuestions: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: Colors.black,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  exampleTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  exampleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
    paddingVertical: 8,
  },
  exampleText: {
    fontSize: 14,
    color: Colors.black,
    flex: 1,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.primary,
    borderRadius: 16,
    borderBottomRightRadius: 4,
    marginVertical: 4,
    maxWidth: '80%',
    ...Platform.select({
      ios: {
        shadowColor: Colors.primary,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  botMessage: {
    justifyContent: 'flex-start',
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    marginVertical: 4,
    maxWidth: '100%',
    ...Platform.select({
      ios: {
        shadowColor: Colors.black,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
    borderWidth: 1,
    borderColor: Colors.lightgray1,
  },
  itemContainer: {
    padding: 10,
  },
  itemText: {
    fontSize: 14,
    color: Colors.white,
  },
  userMessageContent: {
    width: '100%',
  },
  questionContainer: {
    backgroundColor: 'rgba(65, 105, 225, 0.05)',
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  questionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  questionText: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.black,
    lineHeight: 22,
  },
  answerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightgray1,
  },
  answerLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.green,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255, 0, 0, 0.05)',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: Colors.red,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    color: Colors.red,
    fontWeight: '500',
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.lightgray1,
    gap: 10,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightgray2,
    borderRadius: 25,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: Colors.lightgray1,
  },
  messageInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    color: Colors.black,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: Colors.primary,
    borderRadius: 22,
    height: 44,
    width: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 2,
    ...Platform.select({
      ios: {
        shadowColor: Colors.primary,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  voiceButtonModern: {
    backgroundColor: Colors.yellow,
    borderRadius: 25,
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.blue,
    ...Platform.select({
      ios: {
        shadowColor: Colors.yellow,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  recordingActive: {
    backgroundColor: Colors.red,
    borderColor: Colors.red,
  },
  recordingIndicator: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightgray2,
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.red,
  },
  recordingPulse: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.red,
  },
  recordingText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.red,
  },
  img: {
    width: screenWidth - 50,
    height: screenWidth - 50,
    resizeMode: 'contain',
  },
  textBox: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  voiceButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recording: {
    backgroundColor: Colors.red,
  },
  statusText: {
    marginTop: 20,
    fontSize: 16,
  },

  timerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.red,
    // marginBottom: 10,
  },
  searchButtonText: {
    fontSize: 16,
    color: Colors.white,
  },
  languageHeaderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(238, 175, 44, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    marginRight: 10,
    borderWidth: 1,
    borderColor: Colors.yellow,
    ...Platform.select({
      ios: {
        shadowColor: Colors.yellow,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  languageHeaderText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.yellow,
    maxWidth: 80,
  },
  labelTextStyle: {
    color: Colors.primary,
    fontSize: 11,
    transform: [{rotate: '25deg'}],
    textAlign: 'center',
    width: 120, // Adjust based on the label length
  },
  labelTextStyle1: {
    color: Colors.primary,
    fontSize: 11,
    // transform: [{rotate: '40deg'}],
    textAlign: 'center',
    // width: 200, // Adjust based on the label length
  },
});

const styles1 = StyleSheet.create({
  container1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultsText: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 40,
  },
  voiceButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  recording: {
    backgroundColor: 'red',
  },
  statusText: {
    fontSize: 16,
  },
  recordingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  timerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

const styles_km = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
  },
});
