import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  Animated,
} from 'react-native';
import {TextInput} from 'react-native-paper';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/dist/MaterialIcons';
const logo = require('../assets/images/sixtep-logo.jpeg');
import {Colors} from '../constant/Colors';
import {useDispatch, useSelector} from 'react-redux';
import LoaderModal from '../components/LoaderModal';
import {GetPaymentHistoryApi} from '../services/councillorWardApi';
import {PaymentHistoryActions} from '../redux/PaymentHistorySlice';
import {formattedAmount} from '../utility/FormattedAmmount';
import {FormateDate} from '../utility/FormateDate';
import ShowMessageCenter from '../components/ShowMessageCenter';

const screenWidth = Dimensions.get('window').width;

const PaymentHistoryScreen = ({route}) => {
  const dispatch = useDispatch();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const {accountNo} = route.params;

  const loggedUser = useSelector(state => state.loginReducer.items);

  const {items, isLoading, error, statusCode} = useSelector(
    state => state.PaymentHistoryReducer,
  );

  useEffect(() => {
    dispatch(PaymentHistoryActions.clearWards());
    dispatch(GetPaymentHistoryApi(accountNo));
  }, [loggedUser?.warD_NO]);

  useEffect(() => {
    if (items && items.length > 0) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [items]);

  console.log('====================================');
  console.log('accountNo', accountNo);
  console.log('====================================');

  console.log('Payment history==>', items);

  return (
    <View style={styles1.container}>
      <LoaderModal
        visible={isLoading}
        loadingText="Please wait, Data is Loading..."
      />

      {items ? (
        items?.length > 0 ? (
          <ScrollView
            style={styles.container}
            contentContainerStyle={styles.scrollContent}>
            <Animated.View
              style={[
                styles.headerCard,
                {
                  opacity: fadeAnim,
                  transform: [{translateY: slideAnim}],
                },
              ]}>
              <View style={styles.headerIconBadge}>
                <Icon name="credit-card" size={20} color={Colors.white} />
              </View>
              <View style={styles.headerInfo}>
                <Text style={styles.headerLabel}>Account Number</Text>
                <Text style={styles.headerValue}>
                  {items[0]?.accountNumber}
                </Text>
              </View>
            </Animated.View>

            <Animated.View
              style={[
                styles.statsCard,
                {
                  opacity: fadeAnim,
                  transform: [{translateY: slideAnim}],
                },
              ]}>
              <View style={styles.statItem}>
                <Icon name="history" size={24} color={Colors.primary} />
                <Text style={styles.statValue}>{items?.length}</Text>
                <Text style={styles.statLabel}>Total Payments</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Icon name="money" size={24} color={Colors.primary} />
                <Text style={styles.statValue}>
                  {formattedAmount(
                    items.reduce(
                      (sum, item) => sum + parseFloat(item?.amountPaid || 0),
                      0,
                    ),
                    'en-ZA',
                    'ZAR',
                    'currency',
                  )}
                </Text>
                <Text style={styles.statLabel}>Total Amount</Text>
              </View>
            </Animated.View>

            {items?.map((item, index) => (
              <Animated.View
                key={'Payment_' + index}
                style={[
                  styles.paymentCard,
                  {
                    opacity: fadeAnim,
                    transform: [{translateY: slideAnim}],
                  },
                ]}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardIndexBadge}>
                    <Text style={styles.cardIndexText}>#{index + 1}</Text>
                  </View>
                  <View style={styles.amountBadge}>
                    <Text style={styles.amountText}>
                      {formattedAmount(
                        parseFloat(item?.amountPaid),
                        'en-ZA',
                        'ZAR',
                        'currency',
                      )}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardContent}>
                  <InfoRow
                    icon="calendar"
                    label={'Payment Date'}
                    text={FormateDate(item?.paymentDateTime)}
                  />
                  <InfoRow
                    icon="credit-card"
                    label={'Payment Type'}
                    text={item?.paymentType}
                  />
                </View>
              </Animated.View>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.emptyContainer}>
            <Icon name="file-text-o" size={60} color="#CBD5E1" />
            <Text style={styles.emptyTitle}>No Payment History</Text>
            <Text style={styles.emptyText}>
              Payment history data is not found for account: {accountNo}
            </Text>
          </View>
        )
      ) : null}
    </View>
  );
};

const InfoRow = ({icon, text, label}) => (
  <View style={styles.infoRow}>
    <View style={styles.infoLabelContainer}>
      <View style={styles.infoIconCircle}>
        <Icon name={icon} size={12} color={Colors.primary} />
      </View>
      <Text style={styles.infoLabel}>{label}</Text>
    </View>
    <Text style={styles.infoValue} numberOfLines={2}>
      {text}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 20,
    paddingHorizontal: 12,
  },

  // Header Card Styles
  headerCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#1E40AF',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    borderLeftWidth: 5,
    borderLeftColor: Colors.yellow,
  },
  headerIconBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowColor: Colors.primary,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  headerInfo: {
    flex: 1,
  },
  headerLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  headerValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E3A8A',
    letterSpacing: 0.5,
  },

  // Stats Card Styles
  statsCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: '#1E40AF',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primary,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  statDivider: {
    width: 2,
    height: 50,
    backgroundColor: '#E2E8F0',
    borderRadius: 1,
  },

  // Payment Card Styles
  paymentCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#1E40AF',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: Colors.yellow,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardIndexBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  cardIndexText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  amountBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  amountText: {
    color: '#059669',
    fontSize: 15,
    fontWeight: '800',
  },
  cardContent: {
    gap: 8,
  },

  // Info Row Styles
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 10,
  },
  infoLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  infoIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'right',
    flex: 1,
  },

  // Empty State Styles
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E3A8A',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
  },
});

const styles1 = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
});

export default PaymentHistoryScreen;
