import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import { Colors } from '../constant/Colors';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const CardItemLoading = ({
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <View>
                    <View style={styles.cardContent}>
                        <ShimmerPlaceholder style={styles.icon} />
                        <ShimmerPlaceholder style={styles.title}>

                        </ShimmerPlaceholder>
                    </View>
                </View>
                <Divider style={styles.divider} />
                <ShimmerPlaceholder
                    style={[
                        styles.footer,
                        {
                            backgroundColor: Colors.blue,
                            borderBottomLeftRadius: 15,
                            borderBottomRightRadius: 15,
                            height: 50,
                            borderWidth: 2,
                            borderColor: Colors.white,
                        },
                    ]}>
                    {/* <View style={[styles.footer, {borderWidth:2,borderColor:'red'}]}> */}
                    <Text style={[styles.text, { fontSize: 15, paddingTop: 8 }]}>

                    </Text>
                    <View style={{ margin: 5 }}>
                        <TouchableOpacity
                            style={[
                                styles.btn,
                                {
                                    height: 30,
                                    width: 100,
                                    backgroundColor: Colors.white,
                                    borderRadius: 20,
                                },
                            ]}>
                            <View
                                style={{
                                    flex: 1,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    alignSelf: 'center',
                                    flexDirection: 'row',
                                    // marginHorizontal: -20,
                                }}>
                                <Icon name="info-circle" size={20} color={Colors.blue} />
                                <Text
                                    style={[
                                        styles.text,
                                        { fontSize: 16, color: Colors.blue, paddingLeft: 10 },
                                    ]}>

                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ShimmerPlaceholder>
            </View>
        </View>
    );
};

export default CardItemLoading;

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        padding: 5,
        justifyContent: 'center',
    },
    card: {
        elevation: 1, // Add shadow
        borderRadius: 15, // Add border radius
        borderWidth: 1,
        borderColor: Colors.primary,
        backgroundColor: Colors.white
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 10,
        padding: 10
    },
    divider: {
        marginTop: 40,
        // marginBottom: 15,
    },
    title: {
        paddingLeft: 10,
        paddingRight: 2,
        fontSize: 18,
        color: Colors.blue,
        fontWeight: '600'
    },
    footer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
    },
    btn: {
        backgroundColor: Colors.blue,
        // padding: 5,
    },
    text: {
        color: Colors.white,
        fontWeight: '800',
    }, icon: {
        width: 30,
        height: 30,
        borderRadius: 15
    }
});
