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
        <TouchableOpacity onPress={toggleSearchBar}>
          <Text style={styles.searchButtonText}>{Language}</Text>
          {/* <MaterialIcon name="language" size={20} color={Colors.white} /> */}
        </TouchableOpacity>
      ),
    });
  }, [navigation, searchVisible]);

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
              key={index}
              style={{
                width: '50%',
                // borderBottomWidth: 0,
                padding: 10,
                borderWidth: 1,
                // borderRightWidth: 0,
                borderColor: Colors.white,
              }}>
              <Text style={{color: Colors.white, fontSize: 11}}>{key}</Text>
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
              key={index}
              style={{
                width: '50%',
                // borderBottomWidth: 0,
                padding: 10,
                borderWidth: 1,
                // borderRightWidth: 0,
                borderColor: Colors.white,
              }}>
              <Text style={{color: Colors.white, fontSize: 11}}>{value}</Text>
            </View>
          ))}
        </View>
      </>
    );
  };
  const DynamicKeyValueDisplayBody1 = ({data}) => {
    return (
      <View
        key={data['key'] + Math.random(1, 10)}
        style={{
          paddingHorizontal: 10,
          paddingVertical: 5,
          borderWidth: 1,
          width: 300,
          borderColor: Colors.white,
          backgroundColor: Colors.primary,
        }}>
        <Text style={{color: Colors.white, fontSize: 11}}>{data['key']}</Text>
      </View>
    );
  };

  const DynamicKeyValueDisplayBody2 = ({data, keyId}) => {
    return (
      <View
        key={data}
        style={{
          // width: '50%',
          // borderBottomWidth: 0,
          paddingHorizontal: 10,
          paddingVertical: 5,
          borderWidth: 1,
          width: 300,
          // borderRightWidth: 0,
          borderColor: Colors.white,
        }}>
        <Text style={{color: Colors.white, fontSize: 11}}>
          {JSON.stringify(data)?.replace(/"/g, '')}
        </Text>
      </View>
    );
  };

  const DynamicKeyValueDisplayBody3 = ({data, keys}) => {
    return (
      <>
        {data.map((item, index) => (
          <View
            key={item}
            style={{
              borderWidth: 0,
              borderColor: Colors.white,
              flexDirection: 'row',
              borderColor: Colors.white,
              paddingHorizontal: 10,
              marginTop: -10,
            }}>
            {Object.entries(item['items']).map(([key, value], index) =>
              keys.map(k1 => (
                <View
                  key={index}
                  style={{
                    // width: '50%',
                    // borderBottomWidth: 0,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderWidth: 1,
                    width: 300,
                    // borderRightWidth: 0,
                    borderColor: Colors.white,
                  }}>
                  <Text key={k1} style={{color: Colors.white, fontSize: 11}}>
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

      try {
        const postData = {query: lanRes.toString(), tables: []};
        // console.log(postData);
        // const result = await axios.post('http://102.130.114.194:10000/api/getdata', postData);
        const result = await axios.post(
          'http://102.130.119.148:3344/api/getdata',
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
                  keysList.push({key: key});
                }
              }

              if (keysList.length === 2) {
                // console.log(keysList[0]);
                // console.log(keysList[1]);
                // console.log(rData[keysList[0]['key']]);
                // console.log(rData[keysList[1]['key']]);
                NewChartData.push({
                  label: rData[keysList[0]['key']],
                  value: parseFloat(rData[keysList[1]['key']]),
                  actualValue: rData[keysList[1]['key']],
                });
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
      <SafeAreaView style={{flex: 1}}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>Choose your desire language.</Text>
          <View style={{flexDirection: 'row'}}>
            <View>
              <TouchableOpacity
                onPress={() => {
                  toggleSearchBar('en');
                }}
                style={{
                  backgroundColor: Colors.primary,
                  padding: 10,
                  borderRadius: 10,
                  marginTop: 10,
                  flexDirection: 'row',
                }}>
                {/* <MaterialIcon name="language" size={20} color={Colors.white} /> */}
                <Text style={styles.searchButtonText}>English</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  toggleSearchBar('zu');
                }}
                style={{
                  backgroundColor: Colors.blue,
                  padding: 10,
                  borderRadius: 10,
                  marginTop: 10,
                  flexDirection: 'row',
                  marginLeft: 5,
                }}>
                {/* <MaterialIcon name="language" size={20} color={Colors.white} /> */}
                <Text style={styles.searchButtonText}>Zulu</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  toggleSearchBar('af');
                }}
                style={{
                  backgroundColor: Colors.yellow,
                  padding: 10,
                  borderRadius: 10,
                  marginTop: 10,
                  flexDirection: 'row',
                  marginLeft: 5,
                }}>
                {/* <MaterialIcon name="language" size={20} color={Colors.white} /> */}
                <Text style={styles.searchButtonText}>Afrikaans</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  toggleSearchBar('xh');
                }}
                style={{
                  backgroundColor: Colors.red,
                  padding: 10,
                  borderRadius: 10,
                  marginTop: 10,
                  flexDirection: 'row',
                  marginLeft: 5,
                }}>
                {/* <MaterialIcon name="language" size={20} color={Colors.white} /> */}
                <Text style={styles.searchButtonText}>Xhosa</Text>
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity
                onPress={() => {
                  toggleSearchBar('nso');
                }}
                style={{
                  backgroundColor: '#987822',
                  padding: 10,
                  borderRadius: 10,
                  marginTop: 10,
                  flexDirection: 'row',
                  marginLeft: 5,
                }}>
                {/* <MaterialIcon name="language" size={20} color={Colors.white} /> */}
                <Text style={styles.searchButtonText}>
                  Sepedi/Northern Sotho
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  toggleSearchBar('tn');
                }}
                style={{
                  backgroundColor: '#693622',
                  padding: 10,
                  borderRadius: 10,
                  marginTop: 10,
                  flexDirection: 'row',
                  marginLeft: 5,
                }}>
                {/* <MaterialIcon name="language" size={20} color={Colors.white} /> */}
                <Text style={styles.searchButtonText}>Setswana</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  toggleSearchBar('st');
                }}
                style={{
                  backgroundColor: '#273622',
                  padding: 10,
                  borderRadius: 10,
                  marginTop: 10,
                  flexDirection: 'row',
                  marginLeft: 5,
                }}>
                {/* <MaterialIcon name="language" size={20} color={Colors.white} /> */}
                <Text style={styles.searchButtonText}>Sesotho</Text>
              </TouchableOpacity>
            </View>
            {/* <Button title="English" />
            <Button title="Zulu" />
            <Button title="Affricans" /> */}
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
    <SafeAreaView style={{flex: 1}}>
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
              renderItem={({item}) => (
                <>
                  {item.role === 'user' &&
                    isLoading &&
                    item.count == loadingCount && (
                      <View
                        style={{
                          position: 'absolute',
                          right: 0,
                          left: 0,
                          top: 50,
                        }}>
                        <LoadingDots />
                      </View>
                    )}
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
                    {item.role === 'bot' && (
                      <View>
                        <Text
                          style={{
                            color: Colors.yellow,
                            // textDecorationLine: 'underline',
                            fontSize: 15,
                            paddingHorizontal: 20,
                            paddingVertical: 20,
                            // paddingTop: 5,
                          }}>
                          {/* #Result: */}
                          {item.question?.replace(/"/g, '')}
                        </Text>
                        {/* <Text style={[styles.itemText, {padding: 10}]}>
                        {item.question?.replace(/"/g, '')}
                      </Text> */}
                      </View>
                    )}
                    {item?.content?.map((item1, index) => (
                      <>
                        {isLoading &&
                          item.count == loadingCount &&
                          item.role === 'user' && (
                            <View style={styles.itemContainer}>
                              <Text style={styles.itemText}>
                                {JSON.stringify(item1)?.replace(/"/g, '')}
                              </Text>
                            </View>
                          )}
                        <View key={index}>
                          {item.role === 'bot' && (
                            <View style={styles.itemContainer}>
                              {item.error && (
                                <Text style={styles.itemText}>
                                  {JSON.stringify(item1?.toString())?.replace(
                                    /"/g,
                                    '',
                                  )}
                                </Text>
                              )}

                              {!item.error && (
                                <ScrollView
                                  horizontal={true}
                                  style={{marginBottom: 20, marginTop: -25}}>
                                  <View style={{flex: 1}}>
                                    <View
                                      style={{
                                        borderWidth: 0,
                                        borderColor: Colors.white,
                                        flexDirection: 'row',
                                        borderColor: Colors.white,
                                        padding: 10,
                                        marginBottom: 0,
                                      }}>
                                      {item?.keysList?.map((col, index) => (
                                        <View
                                          key={index}
                                          style={[
                                            styles.itemContainer,
                                            {padding: 0},
                                          ]}>
                                          <Text style={styles.itemText}>
                                            {/* {item.role === 'bot' && (
                                            <>{JSON.stringify(col)}</>
                                          )} */}
                                            {item.role === 'bot' && (
                                              <DynamicKeyValueDisplayBody1
                                                data={col}
                                              />
                                            )}
                                          </Text>
                                        </View>
                                      ))}
                                    </View>
                                    <View
                                      style={{
                                        borderWidth: 0,
                                        borderColor: Colors.white,
                                        borderColor: Colors.white,
                                        paddingHorizontal: 10,
                                        marginTop: -10,
                                      }}>
                                      {item?.ValuesList?.map((val, index) => (
                                        <View
                                          key={index}
                                          style={[
                                            styles.itemContainer,
                                            {padding: 0},
                                          ]}>
                                          <Text style={styles.itemText}>
                                            {item.role === 'bot' &&
                                              Object.entries(val['items']).map(
                                                ([key, value], index) => (
                                                  <DynamicKeyValueDisplayBody2
                                                    key={index}
                                                    data={value}
                                                    keyId={item?.keysList}
                                                  />
                                                ),
                                              )}
                                          </Text>
                                        </View>
                                      ))}
                                    </View>
                                  </View>
                                </ScrollView>
                              )}
                            </View>
                          )}
                        </View>
                      </>
                    ))}
                  </View>
                  {item.role === 'bot' && item.chartData.length > 0 && (
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginVertical: 15,
                      }}>
                      <BarChart
                        data={item.chartData}
                        barWidth={40}
                        width={screenWidth}
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
                    </View>
                  )}

                  {/* {item.role === 'bot' && item.barChatImg && (
                  <View
                    style={{
                      backgroundColor: Colors.lightgray,
                      marginVertical: 10,
                      padding: 5,
                    }}>
                    <Image source={{uri: item.barChatImg}} style={styles.img} />
                  </View>
                )} */}
                </>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
            {/* {Platform.OS == 'android' && ( */}
            <View style={styles.container1}>
              {isListening ? (
                <View style={styles.recordingContainer}>
                  <Text style={styles.timerText}>
                    <Text style={styles.statusText}>Recording...</Text>
                  </Text>
                </View>
              ) : (
                <>
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
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
    borderRadius: 50,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.primary,
    // padding: 10,
    borderRadius: 10,
    marginVertical: 2,
  },
  botMessage: {
    justifyContent: 'flex-start',
    backgroundColor: Colors.blue,
    // padding: 10,
    borderRadius: 10,
    marginVertical: 2,
  },
  itemContainer: {
    padding: 10,

    // borderBottomWidth: 1,
    // borderBottomColor: 'red',
  },
  itemText: {
    fontSize: 14,
    color: Colors.white,
  },

  container1: {
    flexDirection: 'row',
    alignItems: 'center',
    // padding: 10,
  },
  textInput: {
    flex: 1,
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 16,
    marginRight: 10,
    position: 'relative',
    height: 50,
    width: 50,
  },
  sendButton: {
    backgroundColor: Colors.lightgray1,
    borderRadius: 20,
    // padding: (Platform.OS = 'android' ? 20 : 10),
    height: 45,
    width: 45,
    marginVertical: 2.5,
    // paddingVertical: 15,
    // paddingHorizontal: 10,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    right: 13,
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
    backgroundColor: 'red',
  },
  statusText: {
    marginTop: 20,
    fontSize: 16,
  },
  recordingContainer: {
    // width: '80%',
    // height: 40,
    borderWidth: 0.5,
    flexDirection: 'row',
    // justifyContent: 'center',
    // alignItems: 'center',

    // marginBottom: 20,
    // gap: 10,
    width: '85%',
    padding: 10,
    marginBottom: 5,
    marginRight: 10,
    borderRadius: 10,
    borderColor: Colors.red,
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
