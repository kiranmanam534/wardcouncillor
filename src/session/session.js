import AsyncStorage from '@react-native-async-storage/async-storage';

// Store session data
export const  storeData = async (key, value) => {
  try {
    console.log("storeData",value)
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.error('Error storing data:', error);
  }
};

// Retrieve session data
export const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    console.log("getData",value)
    return value;
  } catch (error) {
    console.error('Error retrieving data:', error);
    return null
  }
};


export const clearData = async () => {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  };
