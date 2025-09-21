import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function DeliveryPickups({ navigation }) {
  // This page is removed as per user request due to errors and redundancy
  // The bottom navigation for delivery person should only show Home, Earnings, and Profile buttons

  return (
    <View style={styles.container}>
      <Text style={styles.message}>The pickups page has been removed. Please use the Home, Earnings, and Profile tabs.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F8E9',
    padding: 20,
  },
  message: {
    fontSize: 18,
    color: '#222',
    textAlign: 'center',
  },
});

