import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';

const ProfileScreen = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.avatar} />
        <Text style={styles.name}>John Doe</Text>
        <Text style={styles.username}>@johndoe</Text>
        <Text style={styles.bio}>This is a sample bio</Text>
      </View>
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>120</Text>
          <Text style={styles.statLabel}>Posts</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>15K</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>500</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('EditProfile')}>
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.settingsButton]} onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.buttonText}>Settings</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.contentContainer}>
        {/* Add user content such as posts or galleries here */}
        <Text style={styles.contentHeader}>User Posts</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    padding: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  username: {
    fontSize: 16,
    color: 'gray',
  },
  bio: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
    marginTop: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    color: 'gray',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  settingsButton: {
    backgroundColor: '#6c757d',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  contentContainer: {
    paddingHorizontal: 20,
  },
  contentHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default ProfileScreen;
