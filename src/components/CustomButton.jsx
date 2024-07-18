import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Optional, if using icons
import { Colors } from '../constant/Colors';

const CustomButton = ({ title, onPress, iconName, isClicked }) => {
    console.log(isClicked)
    return (
        <TouchableOpacity style={styles.button} onPress={!isClicked && onPress}>
            {iconName && !isClicked && <Icon name={iconName} size={20} color="white" style={styles.icon} />}
            {isClicked && <ActivityIndicator size={20} color={Colors.white} style={{marginRight:5}}/>}

            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        margin: 0,
        borderRadius: 8,
        backgroundColor: Platform.OS === 'ios' ? Colors.primary : Colors.primary, // iOS blue, Android blue
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 5, // Android shadow
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    icon: {
        marginRight: 5,
    },
});

export default CustomButton;
