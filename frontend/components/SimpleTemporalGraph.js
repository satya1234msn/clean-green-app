import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const graphWidth = width - 40;
const graphHeight = 120;

export default function TemporalGraph({ data = [] }) {
  // Sample data for demonstration
  const sampleData = data.length > 0 ? data : [
    { value: 20, date: 'Jan 1' },
    { value: 35, date: 'Jan 2' },
    { value: 30, date: 'Jan 3' },
    { value: 45, date: 'Jan 4' },
    { value: 40, date: 'Jan 5' },
    { value: 55, date: 'Jan 6' },
    { value: 50, date: 'Jan 7' },
  ];

  const maxValue = Math.max(...sampleData.map(d => d.value));
  const minValue = Math.min(...sampleData.map(d => d.value));
  const range = maxValue - minValue || 1;

  const getLineColor = () => {
    if (sampleData.length < 2) return '#4CAF50';
    
    const firstValue = sampleData[0].value;
    const lastValue = sampleData[sampleData.length - 1].value;
    
    return lastValue > firstValue ? '#4CAF50' : '#F44336'; // Green if increasing, Red if decreasing
  };

  const getTrendText = () => {
    if (sampleData.length < 2) return 'No trend data';
    
    const firstValue = sampleData[0].value;
    const lastValue = sampleData[sampleData.length - 1].value;
    const change = lastValue - firstValue;
    
    if (change > 0) return `↗️ +${change}% increase`;
    if (change < 0) return `↘️ ${change}% decrease`;
    return '→ No change';
  };

  // Create a simple progress bar representation
  const renderProgressBars = () => {
    return sampleData.map((point, index) => {
      const barHeight = ((point.value - minValue) / range) * (graphHeight - 20);
      const barWidth = (graphWidth - 20) / sampleData.length - 4;
      const x = (index * (graphWidth - 20)) / sampleData.length + 10;
      
      return (
        <View key={index} style={styles.barContainer}>
          <View
            style={[
              styles.bar,
              {
                height: barHeight,
                backgroundColor: getLineColor(),
              }
            ]}
          />
          <Text style={styles.barLabel}>{point.value}</Text>
        </View>
      );
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contribution towards Green India</Text>
      <View style={styles.graphContainer}>
        <View style={styles.graphArea}>
          {/* Grid line */}
          <View style={styles.gridLine} />
          
          {/* Progress bars */}
          <View style={styles.barsContainer}>
            {renderProgressBars()}
          </View>
        </View>
        
        <Text style={[styles.trendText, { color: getLineColor() }]}>
          {getTrendText()}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff', // White background for graph
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1B5E20', // Deep Green
    marginBottom: 12,
    textAlign: 'center',
  },
  graphContainer: {
    alignItems: 'center',
  },
  graphArea: {
    width: graphWidth,
    height: graphHeight,
    position: 'relative',
    marginBottom: 8,
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: graphHeight / 2,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: graphHeight - 20,
    paddingHorizontal: 10,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 2,
  },
  bar: {
    width: '100%',
    borderRadius: 2,
    marginBottom: 4,
  },
  barLabel: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
  trendText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
