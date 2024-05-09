import { ActivityIndicator, Modal, StyleSheet, Text, View } from "react-native";
import { Colors } from "../constant/Colors";

const LoaderModal = ({visible, loadingText}) => {
    return (
      <Modal transparent animationType="fade" visible={visible}>
        <View style={styles.modalBackground}>
          <View style={styles.activityIndicatorWrapper}>
            <ActivityIndicator animating={visible} color="#000" size="large" />
            {loadingText && (
              <Text style={styles.loadingText}>{loadingText}</Text>
            )}
          </View>
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
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    activityIndicatorWrapper: {
      backgroundColor: Colors.white,
      borderRadius: 10,
      padding: 20,
      alignItems: 'center',
    },
    loadingText: {
      marginTop: 10,
      fontSize: 16,
      color:Colors.yellow,
      fontWeight: 'bold',
    },
  });