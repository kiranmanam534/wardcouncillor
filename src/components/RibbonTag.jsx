// src/components/RibbonTag.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const RibbonTag = ({
  label,
  backgroundColor = '#FF6347',
  textColor = '#FFF',
  style,
  position = 'top-left',
  width = 150,
  height = 30,
  fontSize = 16,
}) => {
  const positions = {
    'top-left': { top: 10, left: -30 },
    'top-right': { top: 10, right: -30 },
    'bottom-left': { bottom: 10, left: -30 },
    'bottom-right': { bottom: 10, right: -30 },
  };

  return (
    <View style={[styles.container, { backgroundColor, width, height }, positions[position], style]}>
      <Text style={[styles.text, { color: textColor, fontSize }]}>{label}</Text>
      <View style={[styles.triangle, { borderTopColor: backgroundColor }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    transform: [{ rotate: '-45deg' }],
    alignItems: 'center',
  },
  text: {
    fontWeight: 'bold',
    paddingVertical: 5,
    paddingHorizontal: 20,
  },
  triangle: {
    position: 'absolute',
    bottom: -10,
    left: '50%',
    marginLeft: -10,
    width: 0,
    height: 0,
    borderTopWidth: 10,
    borderRightWidth: 10,
    borderRightColor: 'transparent',
    borderStyle: 'solid',
  },
});

export default RibbonTag;
