import { Text, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { Colors } from "./constant/Colors";
const TestCharts = () => {
    const renderLegend = (text, color) => {
        return (
            <View style={{ flexDirection: 'row', marginBottom: 12 }}>
                <View
                    style={{
                        height: 18,
                        width: 18,
                        marginRight: 10,
                        borderRadius: 4,
                        backgroundColor: color || 'white',
                    }}
                />
                <Text style={{ color: 'white', fontSize: 13 }}>{text || ''}</Text>
            </View>
        );
    };

    return (
        <View>
            <View
                style={{
                    marginVertical: 100,
                    marginHorizontal: 5,
                    borderRadius: 10,
                    paddingVertical: 50,
                    backgroundColor: Colors.primary,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>


                {/*********************    Custom Header component      ********************/}
                <Text
                    style={{
                        color: 'white',
                        fontSize: 25,
                        fontWeight: 'bold',
                        marginBottom: 12,
                    }}>
                    Outstanding Amount
                </Text>
                {/****************************************************************************/}


                <PieChart
                    strokeColor={Colors.white}
                    strokeWidth={2}
                    donut
                    data={[
                        { value: 30, color: Colors.yellow },
                        { value: 40, color: Colors.primary },
                        { value: 20, color: Colors.red },
                        { value: 10, color: Colors.blue },
                    ]}
                    innerCircleColor={Colors.lightgray}
                    innerCircleBorderWidth={2}
                    innerCircleBorderColor={Colors.white}
                    showValuesAsLabels={true}
                    showText
                    textSize={18}
                    // textBackgroundRadius={Colors.blue}
                    showTextBackground={true}
                    centerLabelComponent={() => {
                        return (
                            <View>
                                <Text style={{ color: Colors.primary, fontSize: 30 }}>100</Text>
                                <Text style={{ color: Colors.primary, fontSize: 18,textAlign:'center' }}>Total</Text>
                            </View>
                        );
                    }}
                />


                {/*********************    Custom Legend component      ********************/}
                <View
                    style={{
                        width: '100%',
                        flexDirection: 'row',
                        justifyContent: 'space-evenly',
                        marginTop: 20,
                    }}>
                    {renderLegend('30 Days', 'rgb(84,219,234)')}
                    {renderLegend('60 Days', 'lightgreen')}
                    {renderLegend('90 Days', 'orange')}
                    {renderLegend('120+ Days', Colors.blue)}
                </View>
                {/****************************************************************************/}

            </View>
        </View>
    );
}
export default TestCharts;
