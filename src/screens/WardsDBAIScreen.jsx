import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, Alert, Dimensions, Image } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors } from '../constant/Colors';
import LoadingDots from '../components/LoadingDots';
import { useDispatch } from 'react-redux';
import { hideData, showData } from '../redux/visibilityAIIconSlice';


const WardsDBAIScreen = () => {

    const dispatch = useDispatch();

    const [headers, setHeaders] = useState([]);
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState([{ role: 'user', content: [] }]);

    const [isLoading, setIsLoading] = useState(false);
    const [loadingCount, setLoadingCount] = useState(0);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('Get top 2 records from properties');
    const flatListRef = useRef(null);
    const [responseToBeDisplay, setToBeDisplay] = useState([]);


    //   // Use useEffect to scroll to end when messages are updated
    //   useEffect(() => {
    //     // if (flatListRef.current) {
    //       flatListRef.current.scrollToEnd({ animated: true });
    //     // }
    //   }, [messages.length]);


    // Scroll to end when content size changes
    const onContentSizeChange = () => {
        // if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: true });
        // }
    };

    // useEffect(() => {
    //     if (messages.length > 0) {
    //         console.log(messages.length)
    //         flatListRef.current.scrollToEnd({ animated: true });
    //     }
    // }, [messages]);

    useEffect(() => {
        dispatch(hideData());
        return () => {
            dispatch(showData());
        };
    }, [dispatch]);

    const DynamicKeyValueDisplayBody = ({ data }) => {
        return (
            <View style={{ borderWidth: 0, borderColor: Colors.white, }}>
                {Object.entries(data).map(([key, value], index) => (

                    <View key={index} style={{ width: Dimensions.get('screen').width, borderBottomWidth: 0, padding: 0 }}>
                        <Text style={{ color: Colors.white, fontSize: 11 }}>{key} : {value}</Text>
                    </View>

                ))}
            </View>
        );
    };




    const sendMessage = async () => {
        if (input) {
            setLoadingCount(loadingCount + 1)
            const newMessages = [...messages, { role: 'user', content: [input], sqlQuery: '', count: loadingCount + 1 }];
            setMessages(newMessages);
            setInput('');
            setIsLoading(true)

            try {
                const postData = { "query": input, "tables": [] }
                console.log(postData)
                // const result = await axios.post('http://102.130.114.194:10000/api/getdata', postData);
                const result = await axios.post('http://102.130.119.148:3344/api/getdata', postData);
                // console.log(result.data[0].SQL)
                console.log(result.data)

                // const response = await axios.post('http://your_backend_ip:5000/api/chat', { message: input });
                // setMessages([...newMessages, { role: 'bot', content: result.data[0].results.recordsets[0], count: loadingCount + 2 }]);
                setMessages([...newMessages, { role: 'bot', content: result.data[0].results.recordsets[0], sqlQuery: result.data[0].SQL,barChatImg:result.data[0]?.img, count: loadingCount + 2 }]);

                setIsLoading(false)
                // setToBeDisplay(result.data);
            } catch (error) {
                console.log('Error sending message:', error.response);
                setMessages([...newMessages, { role: 'bot', content: [["Result not found!"]], sqlQuery: '',barChatImg:'', count: loadingCount + 2 }]);
                setIsLoading(false)
            }
        }

        else {
            Alert.alert("Required!", "Please enter a message!")
        }
    };

    // console.log(JSON.stringify(messages))

    return (
        // <View>
        //     <Image
        //                                 source={{ uri: 'http://102.130.119.148:3344/charts/83c15a77-9c25-49b2-849a-3b94828d4e6b.png'}}
        //                                 // style={{ flex: 1 }}
        //                                 width={100}
        //                                 height={Dimensions.get('screen').width}/>
        // </View>
        <View style={{ flex: 1 }}>
            <View style={styles.container}>

                <FlatList
                    style={{ position: 'relative' }}
                    ref={flatListRef}
                    data={messages}
                    renderItem={({ item }) => (

                        <>
                            {item.role === 'user' && isLoading && item.count == loadingCount &&
                                <View style={{ position: 'absolute', right: 10, top: 50 }} >
                                    <LoadingDots />
                                </View>}
                            {item.sqlQuery &&
                                <View style={[styles.botMessage, { width: Dimensions.get('screen').width, backgroundColor: '#145DA0' }]}>
                                    <Text style={{ color: Colors.yellow, textDecorationLine: 'underline', fontSize: 15, paddingHorizontal: 10, paddingVertical: 5 }}>#SQL Query:</Text>
                                    <Text style={{ color: Colors.white, padding: 5, fontSize: 11 }}>{item.sqlQuery}</Text>
                                </View>
                            }
                            <View style={item.role === 'user' ? styles.userMessage : styles.botMessage}>
                                {item.role === 'bot' && <Text style={{ color: Colors.yellow, textDecorationLine: 'underline', fontSize: 15, paddingHorizontal: 10, paddingVertical: 5 }}>#Result:</Text>}

                                {item?.content?.map((item1, index) => (
                                    <View key={index} style={styles.itemContainer}>
                                        <Text style={styles.itemText}>
                                            {item.role === 'user' && JSON.stringify(item1)}
                                            {/* { item.role === 'bot' && JSON.stringify(item1)} */}
                                            {
                                                item.role === 'bot' &&
                                                <View key={index}>
                                                    {/* <Text>{}</Text> */}
                                                    <Text style={{ color: Colors.white, textDecorationLine: 'underline', fontSize: 15, padding: 3 }}>{'#' + (index + 1)}</Text>
                                                    <DynamicKeyValueDisplayBody data={item1} />
                                                </View>
                                            }
                                            {/* { item.role === 'bot' &&
                                                responseToBeDisplay?.map(({ SQL, reqTXT, results }, index) => (


                                                    <View>


                                                        {

                                                            results.recordsets[0].map(({ ...coloumn }, index) => (
                                                                <View key={index}>
                                                                    <DynamicKeyValueDisplayBody data={coloumn} />
                                                                </View>
                                                            ))
                                                        }

                                                    </View>

                                                ))
                                            } */}
                                        </Text>


                                    </View>
                                ))}

                            </View>
                            {item.role === 'bot' && item.barChatImg &&
                                <View style={{ backgroundColor: Colors.lightgray, marginVertical: 10,padding:5 }}>
                                    <Image
                                        source={{ uri: item.barChatImg }}
                                        // style={{ flex: 1 }}
                                        width={250}
                                        height={150}
                                    // tintColor={Colors.lightgray}
                                    />
                                </View>
                            }
                        </>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                />


                {/* 
                {
                    responseToBeDisplay?.map(({ SQL, reqTXT, results }, index) => (
                        <>
                            <View key={index}>
                                <Text>Requested SViewing</Text>
                                <Text>{reqTXT}</Text>
                            </View>
                            <View>
                                <View>


                                    {

                                        results.recordsets[0].map(({ ...coloumn }, index) => (
                                            <View key={index}>
                                                <DynamicKeyValueDisplayBody data={coloumn} />
                                            </View>
                                        ))
                                    }

                                </View>
                            </View>


                        </>

                    ))
                } */}



                <View style={styles.container1}>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Type your message"
                        multiline
                        value={input}
                        onChangeText={setInput}
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={sendMessage}  >
                        <Icon name="send" size={24} color={Colors.blue} />
                    </TouchableOpacity>
                </View>

            </View>

        </View>
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
        alignSelf: 'flex-start',
        backgroundColor: Colors.blue,
        // padding: 10,
        borderRadius: 10,
        marginVertical: 2,
    },
    itemContainer: {
        padding: 10,
        // borderBottomWidth: 1,
        // borderBottomColor: '#ccc',
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
        borderRadius: 20,
        paddingVertical: 15,
        paddingHorizontal: 16,
        marginRight: 10,
        position: 'relative'
    },
    sendButton: {
        backgroundColor: Colors.lightgray1,
        borderRadius: 20,
        padding: 10,
        // paddingVertical: 15,
        // paddingHorizontal: 10,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        right: 12

    },
});

