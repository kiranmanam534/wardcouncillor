import React, {useEffect, useRef} from 'react';
import {View, Animated, StyleSheet, Platform} from 'react-native';
import {Colors} from '../constant/Colors';

const TypingIndicator = () => {
  const dot1Anim = useRef(new Animated.Value(0.4)).current;
  const dot2Anim = useRef(new Animated.Value(0.4)).current;
  const dot3Anim = useRef(new Animated.Value(0.4)).current;

  const dot1Scale = useRef(new Animated.Value(1)).current;
  const dot2Scale = useRef(new Animated.Value(1)).current;
  const dot3Scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animateDot = (opacityValue, scaleValue, delay) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.sequence([
              Animated.timing(opacityValue, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
              }),
              Animated.timing(opacityValue, {
                toValue: 0.4,
                duration: 400,
                useNativeDriver: true,
              }),
            ]),
            Animated.sequence([
              Animated.timing(scaleValue, {
                toValue: 1.2,
                duration: 400,
                useNativeDriver: true,
              }),
              Animated.timing(scaleValue, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
              }),
            ]),
          ]),
        ]),
      );
    };

    const anim1 = animateDot(dot1Anim, dot1Scale, 0);
    const anim2 = animateDot(dot2Anim, dot2Scale, 200);
    const anim3 = animateDot(dot3Anim, dot3Scale, 400);

    anim1.start();
    anim2.start();
    anim3.start();

    return () => {
      anim1.stop();
      anim2.stop();
      anim3.stop();
    };
  }, []);

  return (
    <View style={styles.typingIndicatorContainer}>
      <View style={styles.typingBubble}>
        <View style={styles.typingDotsContainer}>
          <Animated.View
            style={[
              styles.typingDot,
              {
                opacity: dot1Anim,
                transform: [{scale: dot1Scale}],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.typingDot,
              {
                opacity: dot2Anim,
                transform: [{scale: dot2Scale}],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.typingDot,
              {
                opacity: dot3Anim,
                transform: [{scale: dot3Scale}],
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  typingIndicatorContainer: {
    alignItems: 'flex-start',
    marginVertical: 8,
    paddingLeft: 4,
  },
  typingBubble: {
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    ...Platform.select({
      ios: {
        shadowColor: Colors.black,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
    borderWidth: 1,
    borderColor: Colors.lightgray1,
  },
  typingDotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
});

export default TypingIndicator;
