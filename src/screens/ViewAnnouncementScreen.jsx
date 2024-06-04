import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Text,
    Linking,
    Alert,
    Button,
    FlatList,
    ActivityIndicator,
    Pressable,
    Image,
    Platform,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { Colors } from '../constant/Colors';
import BottomSearchBox from '../components/BottomSearchBox';
import CardItemTest from '../Test1';
import ShowMessageCenter from '../components/ShowMessageCenter';
import CardItemLoading from '../components/CardItemLoading';
import AnnouncemenCard from '../components/AnnouncemenCard';
import { DeleteAnnouncementApi, GetAnnouncementVewInfoApi } from '../services/announcementApis';
import { AnnounceViewActions } from '../redux/announcementViewSlice';
import { Searchbar } from 'react-native-paper';
import { AxiosInstance } from '../services/api';
import LoaderModal from '../components/LoaderModal';


const ViewAnnouncementScreen = ({ route }) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const yourRef = useRef(null);

    const [page, setPage] = useState(1);

    const [searchText, setSearchText] = useState('');
    const [IssearchClick, setIssearchClick] = useState(false);
    const [searchVisible, setSearchVisible] = useState(false);
    const [deletedID, setDeletedID] = useState();

    const [searchQuery, setSearchQuery] = useState('');
    const [showSearchBox, setShowSearchBox] = useState(false);

    const { title } = route.params;
    console.log(title);


    const {
        items,
        isLoading,
        error,
        announcementCount,
        message: memberMessage,
        statusCode: memberStatusCode
    } = useSelector(state => state.announcementViewReducer);

    // const {
    //     isDeleteLoading,
    //     error: deleteError,
    //     message: deleteMessage,
    //     statusCode: deleteStatusCode
    // } = useSelector(state => state.AnnouncementDeleteReducer);

    const loggedUser = useSelector(state => state.loginReducer.items);


    // console.log("Delete ===>", isDeleteLoading, deleteMessage, deleteStatusCode);

    // console.log('====================================');
    // console.log(items);
    // console.log('====================================');

    const toggleSearchBar = () => {
        setSearchVisible(!searchVisible);
    };

    const onChangeSearch = (query) => setSearchQuery(query);

    // React.useLayoutEffect(() => {
    //     navigation.setOptions({
    //         headerRight: () => (
    //             <TouchableOpacity onPress={toggleSearchBar} style={styles.searchButton}>
    //                 {/* <Text style={styles.searchButtonText}>Search</Text> */}
    //                 <Icon name="search" size={20} color={Colors.white} />
    //             </TouchableOpacity>
    //         ),
    //     });
    // }, [navigation, searchVisible]);


    useEffect(() => {
        // dispatch(AnnounceViewActions.clearAnnouncementsData())
        console.log("asas", page)
        dispatch(
            GetAnnouncementVewInfoApi({
                userId: loggedUser?.userid,
                type: title,
                search: searchText,
                page: page,
                limit: 10,
            }),
        );
    }, [loggedUser?.userid, title, page, IssearchClick]);

    const handleLoadMore = () => {
        if (announcementCount != 0 && announcementCount == 10) {
            setPage(page + 1);
        }
    };



    const handleBottomSearchBox = value => {
        // dispatch(AnnounceViewActions.clearAnnouncementsData())
        console.log('Searching for:', value);
        //    setTimeout(() => {
        setSearchText(value);
        // setPage(1)
        //    }, 200);
    };

    const handleSearch = () => {
        dispatch(AnnounceViewActions.clearAnnouncementsData())
        console.log('Searching for:', searchText);

        setTimeout(() => {
            setPage(1);
            setIssearchClick(!IssearchClick)
            // dispatch(
            //     GetAnnouncementVewInfoApi({
            //         userId: loggedUser?.userid,
            //         type: title,
            //         search: searchText,
            //         page: 1,
            //         limit: 10,
            //     }),
            // );
        }, 100);

    };



    const handleDeletePostRequest = async (Id, type) => {
        console.log(Id, type);
        let URL = '';
        if (type == 'Hotspots') {
            URL = `api/Healthcare/get-healthcare-image-data?ID=${Id}`;
        } else if (type == 'Healthcare') {
            URL = `api/Healthcare/delete-healthcare-data?ID=${Id}`;
        } else if (type == 'IMS') {
            URL = `api/Healthcare/get-healthcare-image-data?ID=${Id}`;
        } else if (type == 'Meter') {
            URL = `api/Healthcare/get-healthcare-image-data?ID=${Id}`;
        } else if (type == 'Customer') {
            URL = `api/Healthcare/get-healthcare-image-data?ID=${Id}`;
        } else if (type == 'Property') {
            URL = `api/Healthcare/get-healthcare-image-data?ID=${Id}`;
        } else if (type == 'MetersNotRead') {
            URL = `api/Healthcare/get-healthcare-image-data?ID=${Id}`;
        }
        console.log(URL);

        Alert.alert(
            'Confirmation',
            'Are you sure you want to proceed?',
            [
                {
                    text: 'Cancel',
                    onPress: () => {
                        console.log('Cancel Pressed')

                    },
                    style: 'cancel',
                },
                {
                    text: 'OK',
                    onPress: async () => {
                        console.log('OK Pressed')
                        setDeletedID(Id);
                        try {

                            const res = await AxiosInstance.post(URL, {
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            });

                            console.log("res", res.data)
                            setDeletedID(0);
                            if (res.data.statusCode == 200) {

                                Alert.alert("Success", "Delete successfully!", [
                                    {
                                        text: 'OK',
                                        onPress: async () => {
                                           
                                            dispatch(AnnounceViewActions.clearAnnouncementsData())
                                            setTimeout(() => {
                                                setIssearchClick(!IssearchClick)
                                                setPage(1)
                                            }, 100);
                                            console.log('OK Pressed')

                                        }
                                    }
                                ])

                            }


                        } catch (error) {
                            console.log(error);
                            setDeletedID(0);
                            Alert.alert("Error", "Something went wrong!")
                        }
                    }
                },
            ],
            { cancelable: false }
        );


    };


    const handleActions = (actionType, title, navigationName, type, id) => {
        // Alert.alert(actionType)
        if (actionType == 'Images') {
            navigation.navigate(navigationName, { title: title, type: type, id: id })
        } else if (actionType == "Delete") {
            handleDeletePostRequest(id, type);
            // dispatch(
            //     DeleteAnnouncementApi({
            //         Id: id,
            //         type: title
            //     }))


        }
    }






    const renderFooter = () => {
        // if (!isLoading) return null;

        return (
            isLoading ?
                <View style={{ flex: 1, marginBottom: 40 }}>
                    <ActivityIndicator size={25} color={Colors.primary} />
                </View>
                : null

        )
        // return <LoaderModal visible={true} loadingText="Loading..." />;

        // return (
        //     <FlatList
        //         data={[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]}
        //         renderItem={({ item }) => <CardItemTest />}
        //         keyExtractor={(item, index) => index.toString()}
        //     />
        // );
    };

    return (
        <View style={{ flex: 1 }}>


            {searchVisible && (
                <BottomSearchBox
                    onChangeText={handleBottomSearchBox}
                    onPress={handleSearch}
                    value={searchText}
                    // setSearchText={setSearchText}
                    placeholder={'search...'}
                    isLoading={isLoading}
                />
            )}


            {memberStatusCode && memberStatusCode !== 200 &&
                <ShowMessageCenter message={error == 'No data found.' ? 'No data found.' : 'Something went wrong!'} />}

            {memberStatusCode && memberStatusCode === 200 && memberMessage === 'Data Not found' && items?.length == 0 && (
                <ShowMessageCenter message={'No data found!'} />
            )}
            {/* {searchVisible && (
                <Searchbar
                    placeholder="Search"
                    onChangeText={onChangeSearch}
                    value={searchQuery}
                    style={styles.searchBar}
                />
            )} */}






            {isLoading && items?.length == 0 && (
                <FlatList
                    data={[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]}
                    renderItem={({ item }) => <CardItemLoading />}
                    keyExtractor={(item, index) => index.toString()}
                />
            )}
            {/* {!isLoading && items?.length > 0 && ( */}
            <FlatList
                // ref={yourRef}
                // onContentSizeChange={() => yourRef.current.scrollToEnd({animated : true})}
                // onLayout={() => yourRef.current.scrollToEnd({animated : true})}

                data={items}
                renderItem={({ item }) => (
                    <AnnouncemenCard
                        type={title}
                        item={item}
                        deletedID={deletedID}
                        onPress={handleActions}
                    />
                )}
                keyExtractor={(item, index) => index.toString()}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.1} // Adjust the threshold as needed
                ListFooterComponent={renderFooter}
            />
            {/* )} */}

            {/* <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <Toast position="bottom" bottomOffset={20} />
            </View> */}

            <Pressable style={styles.toggleButton}
                onPress={toggleSearchBar}
            >
                <Ionicons
                    name={searchVisible ? 'close' : 'search'}
                    size={30}
                    color={Colors.white}
                />
            </Pressable>
            {/* {showSearchBox && ( */}
            {/* <BottomSearchBox
                onChangeText={handleBottomSearchBox}
                onPress={handleSearch}
                value={searchText}
                // setSearchText={setSearchText}
                placeholder={'search by account or name...'}
                isLoading={isLoading}
            /> */}
            {/* )} */}
        </View>
    );
};

export default ViewAnnouncementScreen;

const styles = StyleSheet.create({
    toggleButton: {
        position: 'absolute',
        bottom: 100,
        right: 30,
        backgroundColor: Colors.red,
        borderRadius: 25,
        padding: 10,
        elevation: 10,
    },
    searchButton: {
        marginRight: 10,
    },
    searchButtonText: {
        fontSize: 16,
        color: 'blue',
    },
    searchBar: {
        marginBottom: 16,
        // backgroundColor:Colors.
    },
});
