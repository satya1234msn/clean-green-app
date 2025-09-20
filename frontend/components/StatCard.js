import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from './Card';

export default function StatCard({ label, value, icon, color = '#4CAF50' }) {
  return (
    <Card style={styles.container}>
      {icon && <Text style={styles.icon}>{icon}</Text>}
      <Text style={[styles.value, { color }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    alignItems: 'center',
    marginHorizontal: 4,
    minHeight: 100,
    justifyContent: 'center',
    backgroundColor: '#A5D6A7', // Accent Green for stat cards
  },
  icon: {
    fontSize: 24,
    marginBottom: 8,
  },
  value: { 
    fontSize: 18, 
    fontWeight: '800', 
    marginBottom: 4
  },
  label: { 
    fontSize: 11, 
    color: '#666', // Gray Text
    textAlign: 'center',
    lineHeight: 14
  }
});
