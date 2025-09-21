import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Button from '../components/Button';
import { deliveryAPI } from '../services/apiService';

export default function EarningsPage({ navigation }) {
  const [earnings, setEarnings] = useState({
    totalEarnings: 0,
    availableEarnings: 0,
    withdrawnEarnings: 0,
    lastOrderEarnings: 0,
  });
  const [earningsHistory, setEarningsHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEarningsData();
  }, []);

  const loadEarningsData = async () => {
    try {
      setLoading(true);
      const response = await deliveryAPI.getEarnings();
      
      if (response.status === 'success') {
        setEarnings(response.data.earnings);
        setEarningsHistory(response.data.history || []);
      }
    } catch (error) {
      console.error('Error loading earnings:', error);
      Alert.alert('Error', 'Failed to load earnings data');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (earnings.availableEarnings <= 0) {
      Alert.alert('No Earnings', 'You have no available earnings to withdraw');
      return;
    }

    Alert.alert(
      'Withdraw Earnings',
      `Are you sure you want to withdraw ₹${earnings.availableEarnings}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Withdraw', 
          style: 'default',
          onPress: async () => {
            try {
              const response = await deliveryAPI.requestWithdrawal(
                earnings.availableEarnings,
                'bank_transfer',
                { accountNumber: '1234567890', ifscCode: 'SBIN0001234' }
              );
              
              if (response.status === 'success') {
                Alert.alert('Success', 'Your withdrawal request has been submitted!');
                loadEarningsData(); // Refresh data
              } else {
                Alert.alert('Error', response.message || 'Failed to submit withdrawal request');
              }
            } catch (error) {
              console.error('Error requesting withdrawal:', error);
              Alert.alert('Error', 'Failed to submit withdrawal request');
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Earnings!</Text>
      </View>

      <View style={styles.content}>
        {/* Earnings Card */}
        <View style={styles.earningsCard}>
          <Text style={styles.earningsTitle}>Your Earnings!</Text>
          <View style={styles.divider} />
          <Text style={styles.totalEarnings}>₹ {earnings.availableEarnings}</Text>
          
          <View style={styles.divider} />
          <View style={styles.lastOrderSection}>
            <Text style={styles.lastOrderLabel}>last order earning:</Text>
            <Text style={styles.lastOrderAmount}>₹ {earnings.lastOrderEarnings}</Text>
          </View>

          <View style={styles.withdrawSection}>
            <Text style={styles.withdrawText}>want with draw your earning</Text>
            <TouchableOpacity style={styles.withdrawButton} onPress={handleWithdraw}>
              <Text style={styles.withdrawButtonText}>withdraw</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footerSection}>
            <Text style={styles.craftedText}>Crasted with♡</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F8E9',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#222',
  },
  content: {
    padding: 20,
  },
  earningsCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  earningsTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#222',
    textAlign: 'center',
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 10,
  },
  totalEarnings: {
    fontSize: 32,
    fontWeight: '800',
    color: '#00C897',
    textAlign: 'center',
    marginBottom: 10,
  },
  lastOrderSection: {
    marginBottom: 20,
  },
  lastOrderLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  lastOrderAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
  },
  withdrawSection: {
    marginBottom: 20,
  },
  withdrawText: {
    fontSize: 16,
    color: '#222',
    marginBottom: 15,
    textAlign: 'center',
  },
  withdrawButton: {
    backgroundColor: '#00C897',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignSelf: 'center',
  },
  withdrawButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  footerSection: {
    alignItems: 'center',
  },
  craftedText: {
    fontSize: 12,
    color: '#999',
  },
});
