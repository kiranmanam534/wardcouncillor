import React, { useState } from 'react';
import { View, TextInput, Animated, StyleSheet } from 'react-native';

const FloatingLabelInput = ({ label, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);
  const animatedValue = new Animated.Value(isFocused || props.value ? 1 : 0);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [24, 0],
  });

  const fontSize = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 14],
  });

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.label, { transform: [{ translateY }], fontSize }]}>
        {label}
      </Animated.Text>
      <TextInput
        {...props}
        style={styles.input}
        onFocus={handleFocus}
        onBlur={handleBlur}
        blurOnSubmit
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 20,
    paddingVertical: 10,
    width:200
  },
  label: {
    position: 'absolute',
    left: 0,
    top: 0,
    fontSize: 20,
    color: '#aaa',
  },
});

export default FloatingLabelInput;
