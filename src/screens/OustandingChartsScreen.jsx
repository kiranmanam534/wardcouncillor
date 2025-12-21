import {Alert, StyleSheet, Text, View, ScrollView} from 'react-native';
import {PieChart} from 'react-native-gifted-charts';
import {Colors} from '../constant/Colors';
import {useEffect, useState} from 'react';
import {formattedAmount, formattedCurrency} from '../utility/FormattedAmmount';
import {useSelector} from 'react-redux';

const OustandingChartsScreen = ({route}) => {
  const {items: OutstandingItems} = useSelector(
    state => state.WardOustandingReducer,
  );

  const {title} = route.params;
  console.log('OutstandingItems----->', title, OutstandingItems);

  const [items, setItems] = useState([]);

  const PieColors = [Colors.red, Colors.black, Colors.yellow, Colors.blue];

  const ddd = [
    {color: '#C92B22', value: '1706319.36'},
    {color: '#1F3C80', value: '1357384.69'},
    {color: '#EEAF2C', value: '1327239.69'},
    {color: '#047245', value: '58343165.33'},
  ];

  // Reducer function to calculate sum
  const sumReducer = (accumulator, currentValue) =>
    accumulator + parseFloat(currentValue.value);

  // Calculate the sum using reduce()
  const totalSum = OutstandingItems?.reduce(sumReducer, 0); // Initial value is 0

  console.log('Total Sum:', totalSum); // Output: Total Sum: 60
  useEffect(() => {
    OutstandingItems?.map((item, index) => {
      console.log(index, item);
      const newObject = {
        value: parseInt((parseFloat(item.value) * 100) / totalSum),
        color: PieColors[index],
      };
      setItems(prevData => [...prevData, newObject]);
      // setItems([...items,{ value: item.value, color: PieColors[index] }])
    });
  }, []);

  const getFocusedIndex = () => {
    let maxIndex = 0;
    let maxValue = OutstandingItems[0].value;
    OutstandingItems.forEach((item, index) => {
      if (item.value > maxValue) {
        maxValue = item.value;
        maxIndex = index;
      }
    });
    return maxIndex;
  };

  console.log('items-----', items);

  const renderLegend = (text, color, value) => {
    const percentage = parseFloat((parseFloat(value) * 100) / totalSum).toFixed(
      1,
    );
    const amount = formattedAmount(
      parseFloat(value),
      'en-ZA',
      'ZAR',
      'currency',
    );

    let label = '';
    if (text == 'D30_DAYS') label = '0-30 Days';
    if (text == 'D60_DAYS') label = '31-60 Days';
    if (text == 'D90_DAYS') label = '61-90 Days';
    if (text == 'D120_PLUS') label = '120+ Days';

    return (
      <View style={styles.legendItem} key={text}>
        <View style={styles.legendLeft}>
          <View style={[styles.legendColorBox, {backgroundColor: color}]} />
          <Text style={styles.legendLabel}>{label}</Text>
        </View>
        <View style={styles.legendRight}>
          <Text style={styles.legendPercentage}>{percentage}%</Text>
          <Text style={styles.legendAmount}>{amount}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {items.length > 0 && (
          <View style={styles.contentWrapper}>
            {/*********************    Custom Header component      ********************/}
            <View style={styles.headerCard}>
              <Text style={styles.headerTitle}>Outstanding Amount</Text>
              <View style={styles.totalBadge}>
                <Text style={styles.totalLabel}>Total Outstanding</Text>
                <Text style={styles.totalAmount}>
                  {formattedAmount(
                    parseFloat(totalSum),
                    'en-ZA',
                    'ZAR',
                    'currency',
                  )}
                </Text>
              </View>
            </View>
            {/****************************************************************************/}

            <View style={styles.chartCard}>
              <PieChart
                strokeColor="white"
                strokeWidth={3}
                donut
                sectionAutoFocus
                data={items}
                innerCircleColor="#F8FAFC"
                innerCircleBorderWidth={3}
                innerCircleBorderColor="white"
                showValuesAsLabels={true}
                textSize={16}
                textColor="#1E3A8A"
                focusOnPress
                focusIndex={getFocusedIndex()}
                extraRadiusForFocused={15}
                showTextBackground={true}
                textBackgroundColor="white"
                textBackgroundRadius={20}
                radius={140}
                centerLabelComponent={() => {
                  return (
                    <View style={styles.centerLabel}>
                      <Text style={styles.centerPercentage}>100%</Text>
                      <Text style={styles.centerText}>Total</Text>
                    </View>
                  );
                }}
              />
            </View>

            {/*********************    Custom Legend component      ********************/}
            <View style={styles.legendContainer}>
              <Text style={styles.legendTitle}>Breakdown by Days</Text>
              {OutstandingItems.map((item, index) =>
                renderLegend(item.name, PieColors[index], item.value),
              )}
            </View>
            {/****************************************************************************/}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default OustandingChartsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  contentWrapper: {
    padding: 20,
  },
  headerCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#1E40AF',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    borderLeftWidth: 4,
    borderLeftColor: Colors.yellow,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E3A8A',
    marginBottom: 12,
    textAlign: 'center',
  },
  totalBadge: {
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 6,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E3A8A',
  },
  chartCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 30,
    marginBottom: 20,
    shadowColor: '#1E40AF',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    alignItems: 'center',
  },
  centerLabel: {
    alignItems: 'center',
  },
  centerPercentage: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1E3A8A',
  },
  centerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 4,
  },
  legendContainer: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#1E40AF',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E3A8A',
    marginBottom: 16,
    textAlign: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: 'transparent',
  },
  legendLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  legendColorBox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  legendLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E3A8A',
  },
  legendRight: {
    alignItems: 'flex-end',
  },
  legendPercentage: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E3A8A',
    marginBottom: 2,
  },
  legendAmount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
});
