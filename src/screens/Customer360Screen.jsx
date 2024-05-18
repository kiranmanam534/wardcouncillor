import React from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import { TextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/dist/MaterialIcons';
const logo = require('../assets/images/Ekurhuleni-Logo-889x1024.png');
import { Colors } from '../constant/Colors';

const screenWidth = Dimensions.get('window').width;

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
                        top: 27,
                        right: 25,
                        bottom: 0
                    }}>
                    <Icon name="search" size={25} color={Colors.blue} />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.container}>


                <View style={styles.header}>
                    <View style={styles.box}>
                        <Image source={logo} style={styles.img} />
                    </View>
                    {/* <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.avatar} /> */}
                    <Text style={styles.name}>John Doe</Text>
                    <Text style={styles.username}>Category</Text>
                    <Text style={styles.bio}>8387387374</Text>
                    <Text style={styles.bio}>Nellore,Ap,524137</Text>
                </View>
                <View style={[styles.socialMediaSection, { borderBottomWidth: 0 }]}>
                    <View style={{ flexDirection: 'row',marginLeft:-15 }}>
                        <Icon name={'hand-o-right'} size={20} style={styles.infoIcon} />
                        <Text style={styles.sectionTitle}>Outstanding Amount</Text>
                    </View>
                    <View style={[styles.socialMediaSection, { padding: 0 }]}>
                    <Text style={{padding:5,fontWeight:'600',fontSize:15,color:Colors.white,backgroundColor:Colors.blue}}>#1</Text>
                        <InfoRow icon="info-circle" label={'30 days'} text="R232323" />
                        <InfoRow icon="map-marker" label={'60 days'} text="R232323" />
                        <InfoRow icon="map-marker" label={'90 days'} text="R232323" />
                        <InfoRow icon="map-marker" label={'120+ days'} text="R232323" />
                        <InfoRow icon="envelope" label={'Total'} text="R2323232" />
                    </View>
                </View>
                <View style={[styles.socialMediaSection, { borderBottomWidth: 0 }]}>
                    <View style={{ flexDirection: 'row',marginLeft:-15 }}>
                        <Icon name={'hand-o-right'} size={20} style={styles.infoIcon} />
                        <Text style={styles.sectionTitle}>Meters</Text>
                    </View>
                    <View style={[styles.socialMediaSection, { padding: 0 }]}>
                    <Text style={{padding:5,fontWeight:'600',fontSize:15,color:Colors.white,backgroundColor:Colors.blue}}>#1</Text>
                        <InfoRow icon="envelope" label={'Meter No'} text="2323232" />
                        <InfoRow icon="info-circle" label={'Status'} text="Connected" />
                        <InfoRow icon="map-marker" label={'Address'} text="dhgsh,dhsd" />
                        <InfoRow icon="map-marker" label={'Previous Reading'} text="232323" />
                        <InfoRow icon="map-marker" label={'Previous Reading Date'} text="2024-05-10" />
                    </View>
                    <View style={[styles.socialMediaSection, { padding: 0 }]}>
                    <Text style={{padding:5,fontWeight:'600',fontSize:15,color:Colors.white,backgroundColor:Colors.blue}}>#2</Text>
                        <InfoRow icon="envelope" label={'Meter No'} text="2323232" />
                        <InfoRow icon="info-circle" label={'Status'} text="Connected" />
                        <InfoRow icon="map-marker" label={'Address'} text="dhgsh,dhsd" />
                        <InfoRow icon="map-marker" label={'Previous Reading'} text="232323" />
                        <InfoRow icon="map-marker" label={'Previous Reading Date'} text="2024-05-10" />
                    </View>
                </View>
                <View style={[styles.socialMediaSection, { borderBottomWidth: 0}]}>
                    <View style={{ flexDirection: 'row',marginLeft:-15  }}>
                        <Icon name={'hand-o-right'} size={20} style={styles.infoIcon} />
                        <Text style={styles.sectionTitle}>Properties</Text>
                    </View>
                    <View style={[styles.socialMediaSection, { padding: 0 }]}>
                        <Text style={{padding:5,fontWeight:'600',fontSize:15,color:Colors.white,backgroundColor:Colors.blue}}>#1</Text>
                        <InfoRow icon="envelope" label={'Name'} text="psdsd" />
                        <InfoRow icon="info-circle" label={'Cell No'} text="2223" />
                        <InfoRow icon="map-marker" label={'Address'} text="dhgsh,dhsd" />
                        <InfoRow icon="map-marker" label={'lat'} text="232323" />
                        <InfoRow icon="map-marker" label={'lng'} text="22322" />
                    </View>
                    <View style={[styles.socialMediaSection, { padding: 0 }]}>
                    <Text style={{padding:5,fontWeight:'600',fontSize:15,color:Colors.white,backgroundColor:Colors.blue}}>#2</Text>
                        <InfoRow icon="envelope" label={'Name'} text="psdsd" />
                        <InfoRow icon="info-circle" label={'Cell No'} text="2223" />
                        <InfoRow icon="map-marker" label={'Address'} text="dhgsh,dhsd" />
                        <InfoRow icon="map-marker" label={'lat'} text="232323" />
                        <InfoRow icon="map-marker" label={'lng'} text="22322" />
                    </View>
                </View>

                <View style={[styles.socialMediaSection, { borderBottomWidth: 0 }]}>
                    <View style={{ flexDirection: 'row',marginLeft:-15 }}>
                        <Icon name={'hand-o-right'} size={20} style={styles.infoIcon} />
                        <Text style={styles.sectionTitle}>Interims</Text>
                    </View>
                    <View style={[styles.socialMediaSection, { padding: 0 }]}>
                    <Text style={{padding:5,fontWeight:'600',fontSize:15,color:Colors.white,backgroundColor:Colors.blue}}>#1</Text>
                        <InfoRow icon="envelope" label={'Meter No'} text="2323232" />
                        <InfoRow icon="envelope" label={'Name'} text="wewe" />
                        <InfoRow icon="info-circle" label={'Reason'} text="wsds" />
                        <InfoRow icon="map-marker" label={'Address'} text="dhgsh,dhsd" />
                        <InfoRow icon="map-marker" label={'Service'} text="Water(WA)" />
                        <InfoRow icon="map-marker" label={'Township'} text="SKdlsd" />
                        <InfoRow icon="envelope" label={'CCA'} text="Springs" />
                        <InfoRow icon="envelope" label={'Cycle'} text="9239" />
                        <InfoRow icon="map-marker" label={'Zone'} text="weewe" />
                        <InfoRow icon="map-marker" label={'Cell No'} text="2232323" />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};


const InfoRow = ({ icon, text, label }) => (
    <View style={styles.infoRow}>
        {/* <Icon name={icon} size={20} style={styles.infoIcon} /> */}
        <Text style={styles.infoText}>{label}</Text>
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
        paddingBottom: 10,
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
        // alignItems: 'center',
        justifyContent: 'space-between',
        // marginBottom: 10,
        padding: 5,
        borderWidth: 0,
        margin: 2,
        backgroundColor: Colors.lightgray2,
        borderRadius: 5

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
        // borderBottomWidth: 1,
        // borderBottomColor: Colors.yellow,
    },
    sectionTitle: {
        fontSize: 20,
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
    box: {
        width: screenWidth / 4,
        height: screenWidth / 4,
        borderWidth: 2, // Border width in pixels
        borderColor: Colors.red,
        borderRadius: (screenWidth - 50) / 4, // Border radius (optional)
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.white,
        alignSelf: 'center',
        elevation: 1,
        marginTop: 10
    },
    img: {
        width: screenWidth / 3 - 60,
        height: screenWidth / 3 - 60,
        resizeMode: 'contain',
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
    avatar: {
        width: 100,
        height: 100,
        borderWidth: 1,
        borderRadius: 50,
        // marginBottom: 10,
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
