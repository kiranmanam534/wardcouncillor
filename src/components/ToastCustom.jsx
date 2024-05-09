
import React, { useEffect } from 'react'
import { StyleSheet, Button, View} from 'react-native'
import Toast from 'react-native-toast-message';

const ToastCustom = () => {
    console.log('ToastCustom')
    useEffect(() => {
        Toast.show({
          type: 'success',
          position: 'bottom',
          text1: 'Hello',
          text2: 'This is a toast message',
          visibilityTime: 3000,
        });
      }, []);
    
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Toast ref={(ref) => Toast.setRef(ref)} />
        </View>
      );
}

export default ToastCustom

const styles = StyleSheet.create({})