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
import { useIsFocused, useNavigation } from '@react-navigation/native';
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
    const isFocused = useIsFocused();

    const yourRef = useRef(null);

    const [page, setPage] = useState(1);
    const [page1, setPage1] = useState(0);

    const [searchText, setSearchText] = useState('');
    const [IssearchClick, setIssearchClick] = useState(false);
    const [searchVisible, setSearchVisible] = useState(false);
    const [deletedID, setDeletedID] = useState();

    const [searchQuery, setSearchQuery] = useState('');
    const [showSearchBox, setShowSearchBox] = useState(false);

    const { title } = route.params;
    console.log("isFocused-----", title, isFocused);
    let searchPlaceHoder = 'Serach...';
    if (title == 'Hotspots') {
        searchPlaceHoder = 'Search by Location or Crime Type or Details...';
    } else if (title == 'Road Closure') {
        searchPlaceHoder = 'Search by Location or Road name or Details...';
    } else if (title == 'Meetings') {
        searchPlaceHoder = 'Search by Location or Subject or Details...';
    } else if (title == 'Missing Person') {
        searchPlaceHoder = 'Search by Location or Name or Details...';
    } else if (title == 'Workshops') {
        searchPlaceHoder = 'Search by Location or Details...';
    } else if (title == 'Healthcare') {
        searchPlaceHoder = 'Search by Location or Details...';
    } else if (title == 'Warnings') {
        searchPlaceHoder = 'Search by Location or Type or Details...';
    }



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

    console.log('====================================');
    console.log(items);
    console.log('====================================');

    const toggleSearchBar = () => {
        setSearchVisible(!searchVisible);
    };

    const onChangeSearch = (query) => setSearchQuery(query);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={toggleSearchBar} style={styles.searchButton}>
                    {/* <Text style={styles.searchButtonText}>Search</Text> */}
                    <Icon name="search" size={20} color={Colors.white} />
                </TouchableOpacity>
            ),
        });
    }, [navigation, searchVisible]);


    const LoadAnouncements = (pageNo) => {
        console.log("asas", pageNo)
        dispatch(
            GetAnnouncementVewInfoApi({
                userId: loggedUser?.userid,
                type: title,
                search: searchText,
                page: pageNo,
                limit: 4,
            }),
        );
    }

    // useEffect(() => {
    //     LoadAnouncements(1);
    // }, [loggedUser?.userid, title]);



    useEffect(() => {
        if (isFocused) {
            // This effect will run when the screen is focused
            console.log('Screen is focused');
            dispatch(AnnounceViewActions.clearAnnouncementsData())
            // if (announcementCount != 0 && announcementCount == 4) {}
            setPage(1);
            LoadAnouncements(1)
        }
    }, [isFocused]);



    // useEffect(() => {
    //     // dispatch(AnnounceViewActions.clearAnnouncementsData())
    //     console.log("asas", page)
    //     dispatch(
    //         GetAnnouncementVewInfoApi({
    //             userId: loggedUser?.userid,
    //             type: title,
    //             search: searchText,
    //             page: page,
    //             limit: 3,
    //         }),
    //     );
    // }, [loggedUser?.userid, title, page, IssearchClick]);

    const handleLoadMore = () => {
        console.log('====================================');
        console.log(page, announcementCount);
        console.log('====================================');
        if (announcementCount != 0 && announcementCount == 4) {
            setPage(page + 1);
            LoadAnouncements(page + 1);

        }
    };



    const handleBottomSearchBox = value => {
        // dispatch(AnnounceViewActions.clearAnnouncementsData())
        console.log('Searching for:', value);
        setSearchText(value);
    };

    const handleSearch = () => {
        dispatch(AnnounceViewActions.clearAnnouncementsData())
        console.log('Searching for:', searchText);
        setPage(1);
        LoadAnouncements(1);
    };



    const handleDeletePostRequest = async (Id, type) => {
        console.log(Id, type);
        let URL = '';
        if (type == 'Hotspots') {
            URL = `api/Hotspot/delete-hotspot-data?ID=${Id}`;
        } else if (type == 'Healthcare') {
            URL = `api/Healthcare/delete-healthcare-data?ID=${Id}`;
        } else if (type == 'Road Closure') {
            URL = `api/RoadClosure/delete-road-closure-data?ID=${Id}`;
        } else if (type == 'Meetings') {
            URL = `api/Meeting/delete-meeting-data?ID=${Id}`;
        } else if (type == 'Missing Person') {
            URL = `api/MissingPerson/delete-missing-person-data?ID=${Id}`;
        } else if (type == 'Workshops') {
            URL = `api/Workshop/delete-workshop-data?ID=${Id}`;
        } else if (type == 'Warnings') {
            URL = `api/Warning/delete-warning-data?ID=${Id}`;
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
                                                LoadAnouncements(1);
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


    const handleActions = (actionType, title, navigationName, type, item) => {
        // Alert.alert(actionType)
        // console.log("type-->",item)
        if (actionType == 'Images') {
            navigation.navigate(navigationName, { title: title, type: type, id: item.id })
        } else if (actionType == "Delete") {
            handleDeletePostRequest(item.id, type);
        } else if (actionType == 'Edit') {
            navigation.navigate(navigationName, { title: title, type: type, editItem: item })
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
                    placeholder={searchPlaceHoder}
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
