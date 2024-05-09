import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome';
import { MayorOustandingDashboardList } from '../constant/MainDashboardList'
import { Colors } from '../constant/Colors';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { GetwardHeaderTitle } from '../utility/Commom';
import { MayorSelectedWardActions } from '../redux/MayorSelectedWardSlice';
const MayorOutstandingDashboardScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const loggedUser = useSelector(state => state.loginReducer.items);

    // const handleDetailsNavigation = (navigationText, title, wardType) => {
    //     navigation.navigate(navigationText, {
    //         title: loggedUser?.warD_NO != 0 ? loggedUser?.warD_NO + ' - ' + GetwardHeaderTitle(wardType, title) : GetwardHeaderTitle(wardType, title),
    //         wardType: wardType,
    //     });
    // };

    const handleDetailsNavigation = (item) => {
        dispatch(MayorSelectedWardActions.clearSelectedWardNo());
        if (item.name == 'WardList') {
            navigation.navigate("AllWards", {
                title: loggedUser?.warD_NO != 0 ? loggedUser?.warD_NO + ' - ' + GetwardHeaderTitle("Outstanding", "All Wards Oustanding") : GetwardHeaderTitle("Outstanding", "All Wards Oustanding"),
                wardType: "Outstanding",
            });
        } else if (item.name == 'Summary') {
            navigation.navigate("CouncillorDetails", {
                title: loggedUser?.warD_NO != 0 ? loggedUser?.warD_NO + ' - ' + GetwardHeaderTitle("Outstanding", "Oustanding Ward Summary") : GetwardHeaderTitle("Outstanding", "Oustanding Ward Summary"),
                wardType: "Outstanding",
            });
        }

    };

    return (
        <ScrollView>
            <View style={[styles.container, { marginBottom: Platform.OS === 'ios' ? 120 : 120 }]}>
                {MayorOustandingDashboardList.map((item) => (
                    <TouchableOpacity key={item.id}
                        onPress={() =>
                            // handleDetailsNavigation(
                            //     'AllWards',
                            //     'All Wards Oustanding',
                            //     'AllWards',
                            // )}

                            handleDetailsNavigation(item)}
                    >
                        <View style={styles.card}>
                            <View style={styles.iconContainer}>
                                {/* <Icon name="star" size={20} color={Colors.yellow} /> */}
                                {item.icon}
                            </View>
                            <View style={styles.content}>
                                <Text style={styles.title}>{item.title}</Text>
                                {/* <Text style={styles.description}>
                    This is the description of the card.</Text> */}
                            </View>
                            <View style={[styles.iconContainer, { marginRight: 0 }]}>
                                <Icon name="angle-right" size={50} color={Colors.yellow} />
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    )
}

export default MayorOutstandingDashboardScreen

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        padding: 5,
        justifyContent: 'center'

    },
    card: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#f1f1f2",
        borderRadius: 10,
        padding: 20,
        margin: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    iconContainer: {
        marginRight: 16,
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        color: Colors.blue
    },
    description: {
        fontSize: 16,
    },
});