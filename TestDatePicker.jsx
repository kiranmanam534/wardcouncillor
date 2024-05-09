import { Platform, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker'
import { FormateDate } from './src/utility/FormateDate'

const TestDatePicker = () => {

    const [date, setDate] = useState(new Date())
    const [showPicker, setShowPicker] = useState(false)
    const [dateOfBirth, setDateOfBirth] = useState("")


    const toggleDatePicker = () => {
        setShowPicker(!showPicker)
    }

    const onChageDatePicker = ({ type }, selectedDate) => {
        if (type == 'set') {
            const currentDate = selectedDate;
            setDate(currentDate);

            if (Platform.OS == 'android') {
                toggleDatePicker();
                setDateOfBirth(FormateDate(currentDate));
            }
        } else {
            toggleDatePicker();
        }
    }

    const confoirmIOSDate = () => {
        setDateOfBirth(FormateDate(date));
        toggleDatePicker()
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>TestDatePicker</Text>

            {showPicker && (
                <DateTimePicker
                    mode='date'
                    display='spinner'
                    value={date}
                    onChange={onChageDatePicker}
                    style={Platform.OS == 'ios' && styles.datePicker}
                />
            )}
            {showPicker && Platform.OS == 'ios' && (
                <View style={{
                    flexDirection: 'row', justifyContent: 'space-evenly', position: 'absolute', bottom: 0,
                    width: '100%'
                }}>
                    <TouchableOpacity style={[styles.button, styles.pickerButton,
                    { backgroundColor: '#11182711' }]}
                        onPress={toggleDatePicker}
                    >
                        <Text style={[styles.buttonText, { color: '#075985' }]}>Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.button, styles.pickerButton,
                    ]}
                        onPress={confoirmIOSDate}
                    >
                        <Text style={styles.buttonText}>Confirm</Text>
                    </TouchableOpacity>
                </View>
            )}

            {!showPicker && (

                <Pressable onPress={toggleDatePicker}>
                    <TextInput style={{ borderWidth: 1 }}
                        placeholder='Sat Aug 21 2004'
                        value={dateOfBirth}
                        onChangeText={setDateOfBirth}
                        placeholderTextColor={'#11182744'}
                        editable={false}
                        onPressIn={toggleDatePicker}
                    />
                </Pressable>
            )}
        </View>
    )
}

export default TestDatePicker

const styles = StyleSheet.create({
    button: {
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        marginTop: 10,
        marginBottom: 15,
        backgroundColor: '#075985'
    },
    buttonText: {
        fontSize: 14,
        fontWeight: "500",
        color: "#fff"
    },
    pickerButton: {
        paddingHorizontal: 20
    },
    datePicker: {
        height: 300,
        position: 'absolute',
        bottom: 50
    }
})