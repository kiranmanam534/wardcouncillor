import React from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, Image } from 'react-native';
import { TextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import { Colors } from '../constant/Colors';

const Customer360Screen = () => {
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
        <View style={styles1.container}>
            {/* Fixed Header */}
            <View style={styles1.header}>
                <TextInput
                    mode="outlined"
                    label={'Account Number'}
                    style={[styles.textInput, { position: 'relative' }]}
                    placeholder="Search with account number..."
                />
                <TouchableOpacity
                    style={{
                        position: 'absolute',
                        // paddingVertical: 17,
                        top: 25,
                        right: 15,
                        bottom: 0
                    }}>
                    <Icon name="search" size={25} color={Colors.blue} />
                </TouchableOpacity>
            </View>

            {/* Scrollable Content */}
            {/* <ScrollView contentContainerStyle={styles.scrollContent}>
                {Array.from({ length: 50 }).map((_, index) => (
                    <Text key={index} style={styles.text}>
                        Item {index + 1}
                    </Text>
                ))}
            </ScrollView> */}
            <ScrollView style={styles.container}>
                <View style={styles.header}>
                    {/* <Image source={{ uri: user.profilePicture }} style={styles.profilePicture} /> */}
                    <Icon name="user" size={100} color={Colors.blue} />
                    <Text style={styles.name}>{user.name}</Text>
                    {/* <Text style={styles.username}>Category</Text>
                    <Text style={styles.username}>Address</Text> */}
                </View>
                <View style={styles.infoSection}>
                    <Text style={styles.sectionTitle}>Customer Info</Text>
                    <InfoRow icon="envelope" text="Category" />
                    <InfoRow icon="info-circle" text="Mobile No" />
                    <InfoRow icon="map-marker" text="Address" />
                </View>
                <View style={styles.socialMediaSection}>
                    <Text style={styles.sectionTitle}>Outstanding Amount</Text>
                    <InfoRow icon="envelope" text="Total : R2323232" />
                    <InfoRow icon="info-circle" text="30 days : R232323" />
                    <InfoRow icon="map-marker" text="60 days : R232323" />
                    <InfoRow icon="map-marker" text="90 days : R232323" />
                    <InfoRow icon="map-marker" text="120+ days : R232323" />
                </View>
                <View style={styles.socialMediaSection}>
                    <Text style={styles.sectionTitle}>Meters</Text>
                    <View style={[styles.socialMediaSection, { padding: 0 }]}>
                        <InfoRow icon="envelope" text="Meter No : 2323232" />
                        <InfoRow icon="info-circle" text="Status : Connected" />
                        <InfoRow icon="map-marker" text="Address : dhgsh,dhsd" />
                        <InfoRow icon="map-marker" text="Previous Reading : 232323" />
                        <InfoRow icon="map-marker" text="Previous Reading Date : 2024-05-10" />
                    </View>
                    <View style={[styles.socialMediaSection, { padding: 0 }]}>
                        <InfoRow icon="envelope" text="Meter No : 2323232" />
                        <InfoRow icon="info-circle" text="Status : Connected" />
                        <InfoRow icon="map-marker" text="Address : dhgsh,dhsd" />
                        <InfoRow icon="map-marker" text="Previous Reading : 232323" />
                        <InfoRow icon="map-marker" text="Previous Reading Date : 2024-05-10" />
                    </View>
                </View>
                <View style={styles.socialMediaSection}>
                    <Text style={styles.sectionTitle}>Properties</Text>
                    <View style={[styles.socialMediaSection, { padding: 0 }]}>
                        <InfoRow icon="envelope" text="Name : psdsd" />
                        <InfoRow icon="info-circle" text="Cell No : 2223" />
                        <InfoRow icon="map-marker" text="Address : dhgsh,dhsd" />
                        <InfoRow icon="map-marker" text="lat : 232323" />
                        <InfoRow icon="map-marker" text="lng : 22322" />
                    </View>
                    <View style={[styles.socialMediaSection, { padding: 0 }]}>
                        <InfoRow icon="envelope" text="Name : psdsd" />
                        <InfoRow icon="info-circle" text="Cell No : 2223" />
                        <InfoRow icon="map-marker" text="Address : dhgsh,dhsd" />
                        <InfoRow icon="map-marker" text="lat : 232323" />
                        <InfoRow icon="map-marker" text="lng : 22322" />
                    </View>
                </View>

                <View style={styles.socialMediaSection}>
                    <Text style={styles.sectionTitle}>Interims</Text>
                    <View style={[styles.socialMediaSection, { padding: 0 }]}>
                        <InfoRow icon="envelope" text="Meter No : 2323232" />
                        <InfoRow icon="envelope" text="Name : wewe" />
                        <InfoRow icon="info-circle" text="Reason : wsds" />
                        <InfoRow icon="map-marker" text="Address : dhgsh,dhsd" />
                        <InfoRow icon="map-marker" text="Service : Water(WA)" />
                        <InfoRow icon="map-marker" text="Township : SKdlsd" />
                        <InfoRow icon="envelope" text="CCA : Springs" />
                        <InfoRow icon="envelope" text="Cycle : 9239" />
                        <InfoRow icon="map-marker" text="Zone : weewe" />
                        <InfoRow icon="map-marker" text="Cell No : 2232323" />
                    </View>
                </View>
            </ScrollView>
        </View>
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
        marginTop: 80
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
        color: Colors.blue
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


const styles1 = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        padding: 10,
        elevation: 1, // for Android shadow
        shadowColor: '#000', // for iOS shadow
        shadowOffset: { width: 0, height: 0.5 }, // for iOS shadow
        shadowOpacity: 0.5, // for iOS shadow
        shadowRadius: 2, // for iOS shadow
        zIndex: 10, // ensure it is above other components
    },
    textInput: {
        height: 40,
        // borderColor: 'gray',
        // borderWidth: 1,
        paddingHorizontal: 10,
        // borderRadius:10
    },
    scrollContent: {
        paddingTop: 60, // make space for the fixed header
        paddingHorizontal: 10,
    },
    text: {
        fontSize: 16,
        paddingVertical: 10,
    },
});

export default Customer360Screen;
