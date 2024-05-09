import React, { useEffect, useState } from 'react';
import { View, Button, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
// import Toast from 'react-native-simple-toast';
import Toast from 'react-native-toast-message';
import { Colors } from './constant/Colors';


const MyComponent = () => {
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowPicker(Platform.OS === 'ios'); // Hide picker on iOS after selection
    setDate(currentDate);
  };

  const showDateTimePicker = () => {
    setShowPicker(true);
  };
  Toast.show({
    type: 'error',
    position: 'bottom',
    text1: 'text1',
    text2: "text2",
    visibilityTime: 3000,
    text1Style: { color: Colors.blue, fontSize: 15 },
    text2Style: { color: Colors.blue, fontSize: 13 },
  });
  useEffect(()=>{
    
  },[])
//   Toast.show('This is a toast.');
// Toast.show('This is a long toast.', Toast.LONG);

  return (

    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button onPress={showDateTimePicker} title="Show DateTimePicker" />
      {showPicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date" // Change the mode to 'date' or 'time' if needed
          is24Hour={true}
          display="spinner"
          onChange={onChange}
        />
      )}

        {/* <Toast position="bottom" bottomOffset={20} /> */}
    </View>
  );
};

export default MyComponent;
