import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path, Line, Text as SvgText, Defs, LinearGradient, Stop } from 'react-native-svg';
import { line, curveBasis, area } from 'd3-shape';

const screenWidth = Dimensions.get('window').width;

const CurvedLineChart = ({ data, maxValue, labels }) => {
  const padding = 20;
  const width = screenWidth - 40; // Account for container's horizontal padding
  const height = 200;
  const yAxisWidth = 40;
  const chartWidth = width - yAxisWidth - padding;
  const chartHeight = height - padding * 2;

  const xScale = (index) => ((index / (data.length - 1)) * chartWidth) + yAxisWidth;
  const yScale = (value) => chartHeight - (value / maxValue) * chartHeight + padding;

  const points = data.map((value, index) => [xScale(index), yScale(value)]);

  const d = line().x(([x]) => x).y(([, y]) => y).curve(curveBasis)(points);

  const areaPath = area()
    .x(([x]) => x)
    .y0(chartHeight + padding)
    .y1(([, y]) => y)
    .curve(curveBasis)(points);

  const yAxisLabels = [0, maxValue / 2, maxValue];

  return (
    <Svg height={height} width={width}>
      <Defs>
        <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="rgb(134, 65, 244)" stopOpacity="0.5" />
          <Stop offset="1" stopColor="rgb(134, 65, 244)" stopOpacity="0.1" />
        </LinearGradient>
      </Defs>
      {/* Y-axis */}
      <Line x1={yAxisWidth} y1={padding} x2={yAxisWidth} y2={chartHeight + padding} stroke="gray" strokeWidth="1" />
      {yAxisLabels.map((label, index) => (
        <SvgText
          key={index}
          x={yAxisWidth - 10}
          y={yScale(label)}
          fontSize="10"
          fill="gray"
          textAnchor="end"
          alignmentBaseline="middle"
        >
          {label.toFixed(1)}
        </SvgText>
      ))}
      <Path d={areaPath} fill="url(#grad)" />
      <Path
        d={d}
        fill="none"
        stroke="rgb(134, 65, 244)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* X-axis labels */}
      {labels.map((label, index) => (
        <SvgText
          key={index}
          x={xScale(index)}
          y={chartHeight + padding + 15}
          fontSize="10"
          fill="gray"
          textAnchor="middle"
        >
          {label}
        </SvgText>
      ))}
    </Svg>
  );
};

const SimpleBarChart = ({ data, maxValue, labels }) => {
  const chartHeight = 130; // Reduced to account for x-axis labels
  const yAxisLabels = [0, maxValue / 2, maxValue];

  return (
    <View style={styles.barChartContainer}>
      <View style={styles.yAxis}>
        {yAxisLabels.map((label, index) => (
          <Text key={index} style={styles.yAxisLabel}>
            {label.toFixed(1)}
          </Text>
        ))}
      </View>
      <View style={styles.barChartContent}>
        {data.map((value, index) => (
          <View key={index} style={styles.barWrapper}>
            <View style={styles.barContainer}>
              <View
                style={[
                  styles.bar,
                  {
                    height: `${(value / maxValue) * 100}%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.xAxisLabel}>{labels[index]}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default function Statistics() {
  const consumptionData = [5, 2, 1.8, 5, 4, 6, 2];
  const consumptionLabels = ['9/20', '9/21', '9/22', '9/23', '9/24', '9/25', '9/26'];
  const brushingData = [4, 2.5, 2.5];
  const groomingData = [1, 2.5, 2.5];
  const cleaningData = [3, 2, 4];
  const washingHandsData = [2, 3, 2.5];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>This week</Text>
        <Image
          source={{ uri: 'https://example.com/path-to-your-avatar-image.jpg' }}
          style={styles.avatar}
        />
      </View>

      <View style={styles.card}>
        <Ionicons name="bulb-outline" size={24} color="black" />
        <Text style={styles.cardText}>You're using 1.2 gallons/day more than last week.</Text>
      </View>

      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Consumption (gal)</Text>
        <CurvedLineChart 
          data={consumptionData} 
          maxValue={Math.max(...consumptionData)}
          labels={consumptionLabels}
        />
      </View>

      <View style={styles.smallChartsContainer}>
        <View style={styles.smallChartCard}>
          <Text style={styles.chartTitle}>Brushing teeth</Text>
          <SimpleBarChart 
            data={brushingData} 
            maxValue={Math.max(...brushingData)} 
            labels={['9/24', '9/25', '9/26']}
          />
        </View>

        <View style={styles.smallChartCard}>
          <Text style={styles.chartTitle}>Grooming</Text>
          <SimpleBarChart 
            data={groomingData} 
            maxValue={Math.max(...groomingData)} 
            labels={['9/24', '9/25', '9/26']}
          />
        </View>
      </View>

      <View style={styles.smallChartsContainer}>
        <View style={styles.smallChartCard}>
          <Text style={styles.chartTitle}>Cleaning</Text>
          <SimpleBarChart 
            data={cleaningData} 
            maxValue={Math.max(...cleaningData)} 
            labels={['9/24', '9/25', '9/26']}
          />
        </View>

        <View style={styles.smallChartCard}>
          <Text style={styles.chartTitle}>Washing hands</Text>
          <SimpleBarChart 
            data={washingHandsData} 
            maxValue={Math.max(...washingHandsData)} 
            labels={['9/24', '9/25', '9/26']}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerText: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardText: {
    marginLeft: 10,
    fontFamily: 'Inter-Regular',
  },
  chartCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginBottom: 10,
    textAlign: 'left',
    alignSelf: 'stretch',
  },
  barChartContainer: {
    flexDirection: 'row',
    height: 170, // Increased height to accommodate x-axis labels
    alignItems: 'stretch',
  },
  yAxis: {
    width: 30,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: 5,
    paddingBottom: 20, // Add padding to align with x-axis
  },
  yAxisLabel: {
    fontSize: 10,
    color: 'gray',
  },
  barChartContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  barWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  barContainer: {
    height: 130, // Same as chartHeight
    justifyContent: 'flex-end',
  },
  bar: {
    width: 20,
    backgroundColor: 'rgb(134, 65, 244)',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  xAxisLabel: {
    fontSize: 10,
    color: 'gray',
    marginTop: 5,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  label: {
    fontSize: 10,
    color: 'gray',
  },
  smallChartsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  smallChartCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    width: screenWidth / 2 - 30,
  },
  smallChartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'Inter-Bold',
  },
});
