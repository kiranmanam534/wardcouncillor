import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import {useEffect, useRef} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Colors} from '../constant/Colors';

const {width} = Dimensions.get('window');

const ErrorModal = ({visible, ErrorModalText, closeModal, onPress}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Smooth scale and fade in animation
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 40,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0);
      fadeAnim.setValue(0);
    }
  }, [visible]);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={closeModal}
      statusBarTranslucent>
      <View style={styles.modalBackground}>
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{scale: scaleAnim}],
              opacity: fadeAnim,
            },
          ]}>
          {/* Friendly Icon */}
          <View style={styles.iconContainer}>
            <View style={styles.iconOuterCircle}>
              <View style={styles.iconCircle}>
                <Icon name="info-outline" size={56} color="#FF6B6B" />
              </View>
            </View>
          </View>

          {/* Friendly Title */}
          <Text style={styles.errorTitle}>Authentication Failed</Text>

          {/* Friendly Message */}
          <Text style={styles.errorMessage}>
            {ErrorModalText === 'Network error!'
              ? "We couldn't connect to the server. Please check your internet connection and try again."
              : "The credentials you entered don't match our records. Please double-check your username and password."}
          </Text>

          {/* Helpful Tip */}
          <View style={styles.tipContainer}>
            <Icon name="lightbulb-outline" size={18} color="#FFA726" />
            <Text style={styles.tipText}>Make sure Caps Lock is off</Text>
          </View>

          {/* Action Button */}
          <Pressable
            style={({pressed}) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
            onPress={onPress || closeModal}>
            <Text style={styles.buttonText}>Got it, let me try again</Text>
            <Icon name="arrow-forward" size={20} color={Colors.white} />
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default ErrorModal;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 24,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 32,
    alignItems: 'center',
    width: width - 48,
    maxWidth: 420,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 12},
        shadowOpacity: 0.25,
        shadowRadius: 24,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  iconContainer: {
    marginBottom: 24,
  },
  iconOuterCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFF5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFE5E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  errorMessage: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
    paddingHorizontal: 8,
    fontWeight: '400',
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 28,
    gap: 8,
    borderWidth: 1,
    borderColor: '#FFE8B3',
  },
  tipText: {
    fontSize: 13,
    color: '#92400E',
    fontWeight: '500',
  },
  button: {
    backgroundColor: Colors.primary,
    height: 56,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    width: '100%',
    ...Platform.select({
      ios: {
        shadowColor: Colors.primary,
        shadowOffset: {width: 0, height: 6},
        shadowOpacity: 0.25,
        shadowRadius: 10,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{scale: 0.97}],
  },
  buttonText: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
