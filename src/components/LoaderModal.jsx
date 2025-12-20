import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  View,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import {Colors} from '../constant/Colors';
import {useEffect, useRef} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';

const LoaderModal = ({visible, loadingText}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ).start();

      // Rotate animation
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ).start();

      // Progress bar animation (using scaleX instead of width)
      Animated.loop(
        Animated.timing(progressAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ).start();
    }
  }, [visible]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.modalBackground}>
        <Animated.View
          style={[styles.loaderCard, {transform: [{scale: pulseAnim}]}]}>
          <View style={styles.iconContainer}>
            <Animated.View style={{transform: [{rotate}]}}>
              <View style={styles.circleOuter}>
                <View style={styles.circleInner}>
                  <Icon
                    name="hourglass-empty"
                    size={32}
                    color={Colors.primary}
                  />
                </View>
              </View>
            </Animated.View>
          </View>

          <ActivityIndicator
            animating={visible}
            color={Colors.primary}
            size="large"
            style={styles.spinner}
          />

          {loadingText && (
            <View style={styles.textContainer}>
              <Text style={styles.loadingText}>{loadingText}</Text>
              <View style={styles.dotsContainer}>
                <Text style={styles.dots}>...</Text>
              </View>
            </View>
          )}

          <View style={styles.progressBar}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  transform: [{scaleX: progressAnim}],
                },
              ]}
            />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default LoaderModal;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  loaderCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    minWidth: 280,
    ...Platform.select({
      ios: {
        shadowColor: Colors.black,
        shadowOffset: {width: 0, height: 8},
        shadowOpacity: 0.25,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
      },
    }),
    borderWidth: 1,
    borderColor: Colors.lightgray1,
  },
  iconContainer: {
    marginBottom: 20,
  },
  circleOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.yellow,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: Colors.yellow,
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  circleInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.blue,
  },
  spinner: {
    marginVertical: 16,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 17,
    color: Colors.primary,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  dotsContainer: {
    width: 20,
    alignItems: 'flex-start',
  },
  dots: {
    fontSize: 17,
    color: Colors.primary,
    fontWeight: '600',
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: Colors.lightgray1,
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 8,
  },
  progressFill: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.yellow,
    borderRadius: 2,
    transformOrigin: 'left',
  },
});
