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

  // Prepare line plot points
  const innerWidth = chartWidth - 40; // left/right padding
  const innerHeight = chartHeight - 60; // top/bottom padding
  const stepX = innerWidth / Math.max(data.length - 1, 1);
  const points = data.map((item, index) => {
    const x = index * stepX;
    const normalized = (item.value - minValue) / range;
    const y = innerHeight - normalized * innerHeight; // invert Y
    return { x, y, label: item.label, value: item.value };
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.chartContainer}>
        <View style={styles.chartArea}>
          {/* Grid lines */}
          {Array.from({ length: 5 }).map((_, i) => (
            <View
              key={`grid-${i}`}
              style={{
                position: 'absolute',
                left: 20,
                right: 10,
                top: 10 + (i * (innerHeight / 4)),
                height: 1,
                backgroundColor: i === 0 ? 'transparent' : '#eaeaea'
              }}
            />
          ))}

          {/* Area fill under line */}
          {points.map((pt, idx) => {
            if (idx === 0) return null;
            const prev = points[idx - 1];
            const left = 20 + Math.min(prev.x, pt.x);
            const width = Math.abs(pt.x - prev.x);
            const bottom = 10 + innerHeight;
            const top = 10 + Math.max(prev.y, pt.y);
            return (
              <View
                key={`fill-${idx}`}
                style={{
                  position: 'absolute',
                  left,
                  width,
                  top,
                  bottom,
                  backgroundColor: '#E8F5E9'
                }}
              />
            );
          })}
          {/* Line segments */}
          {points.map((pt, idx) => {
            if (idx === 0) return null;
            const prev = points[idx - 1];
            const dx = pt.x - prev.x;
            const dy = pt.y - prev.y;
            const length = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);
            return (
              <View
                key={`seg-${idx}`}
                style={{
                  position: 'absolute',
                  left: 20 + prev.x,
                  top: 10 + Math.min(prev.y, pt.y) + Math.abs(dy) / 2,
                  width: length,
                  height: 2,
                  backgroundColor: '#4CAF50',
                  transform: [
                    { translateY: -1 },
                    { rotate: `${angle}deg` },
                  ],
                }}
              />
            );
          })}

          {/* Points and x-axis labels */}
          {points.map((pt, idx) => (
            <View key={`pt-${idx}`}>
              <View
                style={{
                  position: 'absolute',
                  left: 20 + pt.x - 3,
                  top: 10 + pt.y - 3,
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: '#2E7D32',
                }}
              />
              <Text style={[styles.pointLabel, { left: 20 + pt.x - 12, top: 10 + pt.y - 22 }]}> {pt.value} </Text>
              <Text style={[styles.xLabel, { left: 20 + pt.x - 12 }]} numberOfLines={1}>
                {pt.label}
              </Text>
            </View>
          ))}

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
  xLabel: {
    position: 'absolute',
    bottom: 0,
    width: 24,
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
  pointLabel: {
    position: 'absolute',
    fontSize: 10,
    color: '#1B5E20',
    fontWeight: '600'
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
