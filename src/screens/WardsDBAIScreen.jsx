import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors } from '../constant/Colors';
import LoadingDots from '../components/LoadingDots';


const WardsDBAIScreen = () => {
    const [headers, setHeaders] = useState([]);
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState([{ role: 'user', content: [] }]);

    const [isLoading, setIsLoading] = useState(false);
    const [loadingCount, setLoadingCount] = useState(0);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const flatListRef = useRef(null);


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

    useEffect(() => {
        if (messages.length > 0) {
            console.log(messages.length)
            flatListRef.current.scrollToEnd({ animated: true });
        }
    }, [messages]);




    const sendMessage = async () => {
        if (input) {
            setLoadingCount(loadingCount + 1)
            const newMessages = [...messages, { role: 'user', content: [input], count: loadingCount + 1 }];
            setMessages(newMessages);
            setInput('');
            setIsLoading(true)

            try {
                const postData = { "query": input, "tables": [] }
                console.log(postData)
                const result = await axios.post('http://102.130.114.194:10000/api/getdata', postData);
                console.log(result.data[0].reqTXT)
                console.log(result.data[0].results.recordsets[0])

                // const response = await axios.post('http://your_backend_ip:5000/api/chat', { message: input });
                setMessages([...newMessages, { role: 'bot', content: result.data[0].results.recordsets[0], count: loadingCount + 2 }]);
                setIsLoading(false)
            } catch (error) {
                console.log('Error sending message:', error);
                setMessages([...newMessages, { role: 'bot', content: ["Result not found!"] , count: loadingCount + 2}]);
                setIsLoading(false)
            }
        }

        else {
            Alert.alert("Required!", "Please enter a message!")
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <FlatList
                    style={{ position: 'relative' }}
                    ref={flatListRef}
                    data={messages}
                    renderItem={({ item }) => (

                        <>
                            {item.role === 'user' && isLoading && item.count==loadingCount&&
                                <View style={{ position: 'absolute', right: 10, top: 50 }} >
                                    <LoadingDots />
                                </View>}
                            <View style={item.role === 'user' ? styles.userMessage : styles.botMessage}>
                                {/* {JSON.stringify(item.content)} */}
                                {item?.content?.map((item1, index) => (
                                    <View key={index} style={styles.itemContainer}>
                                        <Text style={styles.itemText}>{
                                            JSON.stringify(item1)}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                // contentContainerStyle={{ paddingBottom: 100 }} // Adjust the padding as needed
                // onContentSizeChange={onContentSizeChange} // Trigger scrolling when content size changes
                />


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

