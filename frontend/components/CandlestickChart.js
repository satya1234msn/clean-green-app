import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const chartWidth = width - 40;
const chartHeight = 200;

export default function CandlestickChart({ data = [] }) {
  // Sample candlestick data for demonstration
  const sampleData = data.length > 0 ? data : [
    { date: 'Jan 1', open: 20, high: 35, low: 15, close: 30, volume: 100 },
    { date: 'Jan 2', open: 30, high: 45, low: 25, close: 40, volume: 150 },
    { date: 'Jan 3', open: 40, high: 50, low: 30, close: 35, volume: 120 },
    { date: 'Jan 4', open: 35, high: 55, low: 30, close: 50, volume: 200 },
    { date: 'Jan 5', open: 50, high: 60, low: 40, close: 45, volume: 180 },
    { date: 'Jan 6', open: 45, high: 65, low: 40, close: 60, volume: 220 },
    { date: 'Jan 7', open: 60, high: 70, low: 50, close: 55, volume: 160 },
  ];

  const maxValue = Math.max(...sampleData.map(d => d.high));
  const minValue = Math.min(...sampleData.map(d => d.low));
  const range = maxValue - minValue || 1;

  const getCandlestickColor = (item) => {
    return item.close >= item.open ? '#4CAF50' : '#F44336'; // Green for bullish, Red for bearish
  };

  const getCandlestickHeight = (item) => {
    return ((item.high - item.low) / range) * (chartHeight - 40);
  };

  const getCandlestickBodyHeight = (item) => {
    return ((Math.abs(item.close - item.open)) / range) * (chartHeight - 40);
  };

  const getCandlestickTop = (item) => {
    return ((maxValue - item.high) / range) * (chartHeight - 40) + 20;
  };

  const getCandlestickBodyTop = (item) => {
    const topValue = Math.max(item.open, item.close);
    return ((maxValue - topValue) / range) * (chartHeight - 40) + 20;
  };

  const renderCandlesticks = () => {
    return sampleData.map((item, index) => {
      const x = (index * chartWidth) / sampleData.length + 10;
      const color = getCandlestickColor(item);
      const height = getCandlestickHeight(item);
      const bodyHeight = getCandlestickBodyHeight(item);
      const top = getCandlestickTop(item);
      const bodyTop = getCandlestickBodyTop(item);

      return (
        <View key={index} style={styles.candlestickContainer}>
          {/* High-Low Line */}
          <View
            style={[
              styles.highLowLine,
              {
                left: x + 15,
                top: top,
                height: height,
                backgroundColor: color,
              }
            ]}
          />
          
          {/* Open-Close Body */}
          <View
            style={[
              styles.candlestickBody,
              {
                left: x + 10,
                top: bodyTop,
                height: Math.max(bodyHeight, 2),
                backgroundColor: color,
                borderColor: color,
              }
            ]}
          />
          
          {/* Date Label */}
          <Text style={[styles.dateLabel, { left: x + 5 }]}>
            {item.date.split(' ')[1]}
          </Text>
        </View>
      );
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Waste Contribution Trend</Text>
      <View style={styles.chartContainer}>
        <View style={styles.chartArea}>
          {/* Y-axis labels */}
          <View style={styles.yAxis}>
            <Text style={styles.yAxisLabel}>{maxValue}</Text>
            <Text style={styles.yAxisLabel}>{Math.round((maxValue + minValue) / 2)}</Text>
            <Text style={styles.yAxisLabel}>{minValue}</Text>
          </View>
          
          {/* Chart area */}
          <View style={styles.chartAreaInner}>
            {renderCandlesticks()}
          </View>
        </View>
        
        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#4CAF50' }]} />
            <Text style={styles.legendText}>Increasing Trend</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#F44336' }]} />
            <Text style={styles.legendText}>Decreasing Trend</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1B5E20',
    marginBottom: 16,
    textAlign: 'center',
  },
  chartContainer: {
    alignItems: 'center',
  },
  chartArea: {
    width: chartWidth,
    height: chartHeight,
    position: 'relative',
    marginBottom: 16,
  },
  yAxis: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: chartHeight,
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  yAxisLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  chartAreaInner: {
    position: 'absolute',
    left: 40,
    right: 0,
    top: 0,
    height: chartHeight,
  },
  candlestickContainer: {
    position: 'absolute',
    top: 0,
    height: chartHeight,
  },
  highLowLine: {
    position: 'absolute',
    width: 2,
  },
  candlestickBody: {
    position: 'absolute',
    width: 10,
    borderWidth: 1,
  },
  dateLabel: {
    position: 'absolute',
    bottom: -20,
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    width: 20,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
});
