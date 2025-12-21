import React, {useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import {Colors} from '../constant/Colors';

const BottomSearchBox = ({
  searchText,
  onChangeText,
  onPress,
  placeholder,
  isLoading,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.searchWrapper}>
        <View style={styles.iconWrapper}>
          <Icon name="search" size={18} color={Colors.primary} />
        </View>
        <TextInput
          style={styles.input}
          value={searchText}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          autoCorrect={false}
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={onPress}
          activeOpacity={0.8}>
          {isLoading ? (
            <ActivityIndicator size={20} color={Colors.white} />
          ) : (
            <Icon name="arrow-right" size={18} color={Colors.white} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BottomSearchBox;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F0F4F8',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    shadowColor: '#1E40AF',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingLeft: 16,
  },
  iconWrapper: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 52,
    fontSize: 15,
    color: '#1E293B',
    fontWeight: '500',
    paddingRight: 60,
  },
  searchButton: {
    position: 'absolute',
    right: 4,
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
});
