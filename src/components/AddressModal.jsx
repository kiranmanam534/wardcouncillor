import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import {Colors} from '../constant/Colors';
import {TextInput} from 'react-native-paper';

const AddressModal = ({
  modalVisible,
  closeModal,
  autoLocation,
  setAutoLocation,
  candidates,
  handleInputChange,
  Isaddress,
  formValues,
}) => {
  console.log(modalVisible);
  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={modalVisible}
      onRequestClose={closeModal} // Handle Android back button
    >
      <Pressable style={stylesModal.overlay} onPress={closeModal} />
      <View
        style={[
          stylesModal.modalView,
          // {transform: [{translateY: slideAnim}]},
        ]}>
        <View style={[stylesModal.modalContent, {position: 'relative'}]}>
          {/* <Text style={stylesModal.modalText}>This is a bottom modal!</Text> */}
          <View style={[stylesModal.inputView]}>
            {/* {Platform.OS == 'android' && */}
            <TextInput
              mode="outlined"
              label={'Search Location'}
              style={{backgroundColor: Colors.white}}
              placeholder="Location"
              value={autoLocation}
              autoCorrect={false}
              keyboardType="default"
              autoCapitalize="none"
              // editable={false}
              onChangeText={value => setAutoLocation(value)}
              placeholderTextColor={'#11182744'}
              // onFocus={openModal} // Trigger modal when focused
              // onPress={openModal}
            />
            <View
              style={{
                position: 'absolute',
                right: 30,
                top: 5,
                bottom: 0,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <MaterialIcon name="my-location" size={25} color={Colors.blue} />
            </View>
          </View>
          <TouchableOpacity
            onPress={closeModal}
            style={[
              stylesModal.button,
              {position: 'absolute', right: 10, bottom: 10},
            ]}>
            <Text style={stylesModal.buttonText}>Close</Text>
          </TouchableOpacity>
          {candidates && candidates.length > 0 && (
            <View
              style={[
                {
                  width: '100%',
                  position: 'absolute',
                  top: 50,
                  backgroundColor: Colors.primary,
                  // margin: 15,
                  padding: 10,
                  marginTop: 15,
                  marginBottom: 200,
                },
              ]}>
              <FlatList
                data={candidates}
                keyExtractor={item => item.address + item.location.x}
                renderItem={({item}) => (
                  <TouchableOpacity
                    onPress={() => {
                      // console.log(item?.location?.x || '0.00');
                      // console.log(item?.location?.y || '0.00');

                      formValues.latitude = item?.location?.x || '0.00';
                      formValues.longitude = item?.location?.y || '0.00';
                      item.address += `, ${item?.attributes?.City}, ${item?.attributes?.CntryName}`;
                      handleInputChange('location', item.address);
                      closeModal();
                      // setAutoLocation('');
                    }}
                    style={{
                      padding: 5,
                      borderBottomWidth: 1,
                      borderBottomColor: Colors.white,
                    }}>
                    <Text style={{color: Colors.white}}>{item.address}</Text>
                    <Text style={{color: Colors.white}}>
                      {item.location.x}, {item.location.y}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}

          {Isaddress && candidates.length == 0 && (
            <View
              style={[
                {
                  width: '100%',
                  position: 'absolute',
                  top: 50,
                  // backgroundColor: Colors.primary,
                  // margin: 15,
                  padding: 10,
                  marginTop: 15,
                  marginBottom: 200,
                },
              ]}>
              <ActivityIndicator size={30} color={Colors.primary} />
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default AddressModal;

// Styles
const stylesModal = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  modalView: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 500,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  inputView: {
    gap: 10,
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 5,
  },
});
