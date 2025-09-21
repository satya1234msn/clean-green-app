import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');
const chartWidth = screenWidth - 40;
const chartHeight = 200;

export default function LineChart({ data, title = "Waste Contribution Trend" }) {
  if (!data || data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.chartContainer}>
          <Text style={styles.noDataText}>No data available</Text>
        </View>
      </View>
    );
  }

  // Find min and max values for scaling
  const values = data.map(item => item.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const range = maxValue - minValue || 1;

  // Calculate bar heights for simple visualization
  const barWidth = (chartWidth - 40) / data.length;
  const maxBarHeight = chartHeight - 60;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.chartContainer}>
        <View style={styles.chartArea}>
          {/* Simple bar chart representation */}
          <View style={styles.barsContainer}>
            {data.map((item, index) => {
              const barHeight = ((item.value - minValue) / range) * maxBarHeight;
              const isPositive = item.value >= (minValue + maxValue) / 2;
              
              return (
                <View key={index} style={styles.barContainer}>
                  <View 
                    style={[
                      styles.bar, 
                      { 
                        height: Math.max(barHeight, 2),
                        backgroundColor: isPositive ? '#4CAF50' : '#F44336'
                      }
                    ]} 
                  />
                  <Text style={styles.barLabel}>{item.label}</Text>
                </View>
              );
            })}
          </View>
          
          {/* Y-axis labels */}
          <View style={styles.yAxisLabels}>
            {[0, 1, 2, 3, 4].map((i) => {
              const value = minValue + (i * range) / 4;
              return (
                <Text key={i} style={styles.yAxisLabel}>
                  {Math.round(value)}
                </Text>
              );
            })}
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
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
    marginBottom: 16,
    textAlign: 'center',
  },
  chartContainer: {
    height: chartHeight,
    position: 'relative',
  },
  chartArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  barsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: chartHeight - 40,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  bar: {
    width: '80%',
    borderRadius: 2,
    marginBottom: 5,
  },
  barLabel: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
  noDataText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingVertical: 40,
  },
  yAxisLabels: {
    position: 'absolute',
    left: 0,
    top: 10,
    height: chartHeight - 40,
    justifyContent: 'space-between',
    width: 30,
  },
  yAxisLabel: {
    fontSize: 10,
    color: '#666',
    textAlign: 'right',
  },
});
