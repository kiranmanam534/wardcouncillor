import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import axios from 'axios';


const WardsDBAIScreen = () => {
    const [headers, setHeaders] = useState([]);
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState([{ role: 'user', content: []}]);


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
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };



    const sendMessage = async () => {
        const newMessages = [...messages, { role: 'user', content: [input] }];
        setMessages(newMessages);
        setInput('');

        try {
            const postData = { "query": input, "tables": [] }
            console.log(postData)
            const result = await axios.post('http://102.130.114.194:10000/api/getdata', postData);
            console.log(result.data[0].reqTXT)
            console.log(result.data[0].results.recordsets[0])

            // const response = await axios.post('http://your_backend_ip:5000/api/chat', { message: input });
            setMessages([...newMessages, { role: 'bot', content: result.data[0].results.recordsets[0] }]);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <SafeAreaView style={{flex:1}}>
        <View style={styles.container}>
            <FlatList
             ref={flatListRef}
                data={messages}
                renderItem={({ item }) => (
                    <Text style={item.role === 'user' ? styles.userMessage : styles.botMessage}>
                        {/* {JSON.stringify(item.content)} */}
                        {item?.content?.map((item1,index) => (
                            <View key={index} style={styles.itemContainer}>
                                <Text style={styles.itemText}>{
                                    JSON.stringify(item1)}
                                    item1.
                                    </Text>
                            </View>
                        ))}
                    </Text>
                )}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{ paddingBottom: 100 }} // Adjust the padding as needed
                onContentSizeChange={onContentSizeChange} // Trigger scrolling when content size changes
            />
            <TextInput
                style={styles.input}
                value={input}
                onChangeText={setInput}
                placeholder="Type your message"
            />
            <Button title="Send" onPress={sendMessage} />
        </View>
        </SafeAreaView>
    );
};

export default WardsDBAIScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 8,
    },
    userMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#d1e7dd',
        padding: 10,
        borderRadius: 5,
        marginVertical: 2,
    },
    botMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#f8d7da',
        padding: 10,
        borderRadius: 5,
        marginVertical: 2,
    },
    itemContainer: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
      },
      itemText: {
        fontSize: 18,
      },
});

