import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const ProfileScreen = () => {
  const user = {
    profilePicture: 'https://example.com/profile.jpg',
    name: 'John Doe',
    username: '@johndoe',
    email: 'john@example.com',
    bio: 'Developer, Tech Enthusiast',
    location: 'San Francisco, CA',
    website: 'https://johndoe.com',
    socialMedia: {
      twitter: 'johndoe',
      linkedin: 'john-doe',
    },
    recentActivity: ['Posted a new blog', 'Joined a new group', 'Started a new project'],
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: user.profilePicture }} style={styles.profilePicture} />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.username}>{user.username}</Text>
      </View>
      <View style={styles.infoSection}>
        <InfoRow icon="envelope" text={user.email} />
        <InfoRow icon="info-circle" text={user.bio} />
        <InfoRow icon="map-marker" text={user.location} />
        <InfoRow icon="link" text={user.website} />
      </View>
      <View style={styles.socialMediaSection}>
        <Text style={styles.sectionTitle}>Social Media</Text>
        <SocialMediaIcon name="twitter" handle={user.socialMedia.twitter} />
        <SocialMediaIcon name="linkedin" handle={user.socialMedia.linkedin} />
      </View>
      <View style={styles.activitySection}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {user.recentActivity.map((activity, index) => (
          <Text key={index} style={styles.activityItem}>{activity}</Text>
        ))}
      </View>
    </ScrollView>
  );
};

const InfoRow = ({ icon, text }) => (
  <View style={styles.infoRow}>
    <Icon name={icon} size={20} style={styles.infoIcon} />
    <Text style={styles.infoText}>{text}</Text>
  </View>
);

const SocialMediaIcon = ({ name, handle }) => (
  <TouchableOpacity style={styles.socialMediaIcon}>
    <Icon name={name} size={20} style={styles.socialIcon} />
    <Text style={styles.socialText}>@{handle}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  username: {
    fontSize: 18,
    color: 'gray',
  },
  infoSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoIcon: {
    marginRight: 10,
  },
  infoText: {
    fontSize: 16,
  },
  socialMediaSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  socialMediaIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  socialIcon: {
    marginRight: 10,
  },
  socialText: {
    fontSize: 16,
  },
  activitySection: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  activityItem: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default ProfileScreen;
