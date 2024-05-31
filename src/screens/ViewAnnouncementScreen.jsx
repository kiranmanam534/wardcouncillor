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
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { Colors } from '../constant/Colors';
import BottomSearchBox from '../components/BottomSearchBox';
import CardItemTest from '../Test1';
import ShowMessageCenter from '../components/ShowMessageCenter';
import CardItemLoading from '../components/CardItemLoading';
import AnnouncemenCard from '../components/AnnouncemenCard';
import { GetAnnouncementVewInfoApi } from '../services/announcementApis';
import { AnnounceViewActions } from '../redux/announcementViewSlice';
import { Searchbar } from 'react-native-paper';


const ViewAnnouncementScreen = ({ route }) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const [page, setPage] = useState(1);

    const [searchText, setSearchText] = useState('');
    const [searchVisible, setSearchVisible] = useState(false);
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

    const loggedUser = useSelector(state => state.loginReducer.items);



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


    useEffect(() => {
        dispatch(AnnounceViewActions.clearAnnouncementsData())
        dispatch(
            GetAnnouncementVewInfoApi({
                userId: loggedUser?.userid,
                type: title,
                search: '',
                page: page,
                limit: 10,
            }),
        );
    }, [loggedUser?.userid, title, page]);

    const handleLoadMore = () => {
        if (announcementCount != 0 && announcementCount == 10) setPage(page + 1);
    };



    const handleBottomSearchBox = value => {
        setSearchText(value);
    };

    const handleSearch = () => {
        // Implement search functionality here
        dispatch(AnnounceViewActions.clearAnnouncementsData())
        console.log('Searching for:', searchText);
        dispatch(
            GetAnnouncementVewInfoApi({
                userId: loggedUser?.userid,
                type: title,
                search: searchText,
                page: page,
                limit: 10,
            }),
        );
    };


    const handleActions = (actionType, title, navigationName) => {
        // Alert.alert(actionType)
        if (actionType == 'Images') {
            navigation.navigate(navigationName, { title: title })
        }
    }






    const renderFooter = () => {
        if (!isLoading) return null;
        // return <LoaderModal visible={isLoading} loadingText="Loading..." />;
        return (
            <FlatList
                data={[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]}
                renderItem={({ item }) => <CardItemTest />}
                keyExtractor={(item, index) => index.toString()}
            />
        );
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






            {isLoading && (
                <FlatList
                    data={[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]}
                    renderItem={({ item }) => <CardItemLoading />}
                    keyExtractor={(item, index) => index.toString()}
                />
            )}
            {!isLoading && items?.length > 0 && (
                <FlatList
                    data={items}
                    renderItem={({ item }) => (
                        <AnnouncemenCard
                            type={title}
                            item={item}
                            onPress={handleActions}
                        />
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    onEndReached={handleLoadMore}
                    // onEndReachedThreshold={10} // Adjust the threshold as needed
                    ListFooterComponent={renderFooter}
                />
            )}

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
