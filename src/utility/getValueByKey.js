// Function to get the value based on the key
export const getValueByKey = (data,key) => {
    // Find the object in the array that matches the key
    const item = data.find(obj => obj.name === key);
    // console.log(item)
    // If the item is found, return its value
    if (item) {
      return item.value;
    } else {
      // If the item is not found, return null or handle the case accordingly
      return '';
    }
  };