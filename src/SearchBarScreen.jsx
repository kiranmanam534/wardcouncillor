
// HomeScreen.js
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Searchbar } from 'react-native-paper';

const SearchBarScreen = () => {

    const navigation = useNavigation();
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleSearchBar = () => {
    setSearchVisible(!searchVisible);
  };

  const onChangeSearch = (query) => setSearchQuery(query);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={toggleSearchBar} style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, searchVisible]);

  return (
    <View style={styles.container}>
      {searchVisible && (
        <Searchbar
          placeholder="Search"
          onChangeText={onChangeSearch}
          value={searchQuery}
          style={styles.searchBar}
        />
      )}
      <Text style={styles.content}>Home Screen Content</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchBar: {
    marginBottom: 16,
  },
  content: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 16,
  },
  searchButton: {
    marginRight: 10,
  },
  searchButtonText: {
    fontSize: 16,
    color: 'blue',
  },
});

export default SearchBarScreen;
