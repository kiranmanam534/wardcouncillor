import React, {useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Platform,
  TouchableOpacity,
  Animated,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import {MainDashboardList} from '../constant/MainDashboardList';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {Colors} from '../constant/Colors';
import MaterialIcon from 'react-native-vector-icons/dist/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import {AnnounceViewActions} from '../redux/announcementViewSlice';

const MainDashboardScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [showselectedSection, setShowselectedSection] = useState('');
  const scrollY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);

  const loggedUser = useSelector(state => state.loginReducer.items);

  const loggedUserNme = useSelector(state => state.loginReducer.loggedUserName);

  const handleScroll = Animated.event(
    [{nativeEvent: {contentOffset: {y: scrollY}}}],
    {
      useNativeDriver: false,
      listener: event => {
        const currentScrollY = event.nativeEvent.contentOffset.y;
        lastScrollY.current = currentScrollY;
      },
    },
  );

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [140, 70],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50, 100],
    outputRange: [1, 0.7, 0],
    extrapolate: 'clamp',
  });

  const openAnnouncementModal = item => {
    setShowselectedSection(item.id);
  };

  const handleNavigation = (navigationName, title) => {
    console.log('====================================');
    console.log(navigationName, title);
    console.log('====================================');
    dispatch(AnnounceViewActions.clearAnnouncementsData());

    navigation.navigate(navigationName, {title: title});
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={{paddingTop: 16}}
        onScroll={handleScroll}
        scrollEventThrottle={16}>
        <View
          style={{
            marginBottom: Platform.OS === 'ios' ? 150 : 160,
          }}>
          {MainDashboardList.map(item => (
            <TouchableOpacity
              key={item.id}
              onPress={() => openAnnouncementModal(item)}
              activeOpacity={0.7}>
              <View
                style={[
                  styles.modernCard,
                  item.id === showselectedSection && styles.modernCardExpanded,
                ]}>
                <View style={styles.cardLeftBar}>
                  <View style={styles.cardLeftBarDot} />
                </View>
                <View style={styles.cardMainContent}>
                  <View style={styles.cardTopSection}>
                    <View style={styles.iconWrapper}>
                      <View style={styles.iconGlow} />
                      {item.icon}
                    </View>
                    <View style={styles.titleSection}>
                      <Text style={styles.cardTitle}>{item.title}</Text>
                      <Text style={styles.cardSubtitle}>
                        Tap to expand options
                      </Text>
                    </View>
                    <View style={styles.chevronBadge}>
                      <Icon
                        name={
                          item.id === showselectedSection
                            ? 'chevron-up'
                            : 'chevron-down'
                        }
                        size={16}
                        color={Colors.white}
                      />
                    </View>
                  </View>

                  {item.id === showselectedSection && (
                    <View style={styles.actionsRow}>
                      <TouchableOpacity
                        style={styles.horizontalActionButton}
                        onPress={() => handleNavigation(item.name, item.title)}
                        activeOpacity={0.8}>
                        <View style={styles.actionIconBox}>
                          <MaterialIcon
                            name="add-circle"
                            size={24}
                            color={Colors.primary}
                          />
                        </View>
                        <View style={styles.actionTextContainer}>
                          <Text style={styles.actionTitle}>Create New</Text>
                          <Text style={styles.actionSubtitle}>
                            Add new entry
                          </Text>
                        </View>
                        <Icon
                          name="arrow-right"
                          size={18}
                          color={Colors.primary}
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.horizontalActionButton}
                        onPress={() =>
                          handleNavigation(item.viewName, item.title)
                        }
                        activeOpacity={0.8}>
                        <View style={styles.actionIconBox}>
                          <FontAwesome5
                            name="list-ul"
                            size={20}
                            color={Colors.primary}
                          />
                        </View>
                        <View style={styles.actionTextContainer}>
                          <Text style={styles.actionTitle}>View All</Text>
                          <Text style={styles.actionSubtitle}>
                            Browse entries
                          </Text>
                        </View>
                        <Icon
                          name="arrow-right"
                          size={18}
                          color={Colors.primary}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* <Animated.View
        style={[
          styles.headerGradient,
          {
            height: headerHeight,
            opacity: headerOpacity,
          },
        ]}>
        <View style={styles.statusBar}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>System Online</Text>
        </View>
        <View style={styles.headerTop}>
          <View style={styles.userNameSection}>
            <View style={styles.avatarCircle}>
              <Icon name="user" size={16} color={Colors.blue} />
            </View>
            <View>
              <Text style={styles.welcomeText}>Welcome Back</Text>
              <Text style={styles.userNameWhite}>{loggedUserNme}</Text>
            </View>
          </View>
          <View style={styles.wardCircle}>
            <Text style={styles.wardCircleLabel}>Ward</Text>
            <Text style={styles.wardCircleNumber}>{loggedUser?.warD_NO}</Text>
          </View>
        </View>
      </Animated.View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 28,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 6},
        shadowOpacity: 0.2,
        shadowRadius: 15,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(238, 175, 44, 0.15)',
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.yellow,
    marginRight: 6,
  },
  statusText: {
    fontSize: 10,
    color: Colors.yellow,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userNameSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.yellow,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: Colors.white,
    ...Platform.select({
      ios: {
        shadowColor: Colors.yellow,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  welcomeText: {
    fontSize: 12,
    color: Colors.yellow,
    fontWeight: '600',
    marginBottom: 3,
    letterSpacing: 0.5,
  },
  userNameWhite: {
    fontSize: 19,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: 0.3,
  },
  wardCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: Colors.yellow,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.white,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.25,
        shadowRadius: 6,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  wardCircleLabel: {
    fontSize: 10,
    color: Colors.blue,
    fontWeight: '600',
  },
  wardCircleNumber: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.blue,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  modernCard: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    marginBottom: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.12,
        shadowRadius: 12,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  modernCardExpanded: {
    borderWidth: 2.5,
    borderColor: Colors.yellow,
    ...Platform.select({
      ios: {
        shadowColor: Colors.yellow,
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  cardLeftBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardLeftBarDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Colors.yellow,
  },
  cardMainContent: {
    padding: 18,
    paddingLeft: 22,
  },
  cardTopSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: '#F0F4FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    borderWidth: 2.5,
    borderColor: Colors.yellow,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: Colors.primary,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  iconGlow: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.yellow,
    opacity: 0.15,
  },
  titleSection: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.blue,
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  cardSubtitle: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  chevronBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.yellow,
  },
  actionsRow: {
    marginTop: 18,
    paddingTop: 18,
    borderTopWidth: 1.5,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  horizontalActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFF',
    padding: 16,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#E0E7FF',
    ...Platform.select({
      ios: {
        shadowColor: Colors.primary,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  actionIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    borderWidth: 2,
    borderColor: Colors.yellow,
    ...Platform.select({
      ios: {
        shadowColor: Colors.yellow,
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.blue,
    marginBottom: 3,
    letterSpacing: 0.2,
  },
  actionSubtitle: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
});

export default MainDashboardScreen;
