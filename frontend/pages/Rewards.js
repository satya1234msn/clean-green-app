import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { rewardAPI } from '../services/apiService';

export default function Rewards({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [rewards, setRewards] = useState([]);

  useEffect(() => {
    loadRewards();
  }, []);

  const loadRewards = async () => {
    try {
      setLoading(true);
      const res = await rewardAPI.getRewards(1, 20, 'active');
      if (res.status === 'success') {
        setRewards(res.data.rewards || res.data || []);
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to load rewards');
    } finally {
      setLoading(false);
    }
  };

  const handleHome = () => {
    navigation.navigate('Dashboard');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Rewards</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        {/* Rewards List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Rewards</Text>
          {loading ? (
            <ActivityIndicator />
          ) : (
            <View style={styles.rewardsContainer}>
              {rewards.length === 0 ? (
                <Text style={{ color: '#666' }}>No rewards yet.</Text>
              ) : (
                rewards.map((reward) => (
                  <View key={reward._id} style={styles.rewardItem}>
                    <View style={styles.couponCard}>
                      <Text style={styles.couponText}>{reward.couponCode}</Text>
                    </View>
                    <View style={styles.rewardInfo}>
                      <Text style={styles.rewardDescription}>{reward.title}</Text>
                      <Text style={styles.rewardDetail}>{reward.description}</Text>
                    </View>
                    <TouchableOpacity style={styles.redeemButton} onPress={() => Alert.alert('Redeem', 'Use this coupon at checkout')}>
                      <Text style={styles.redeemButtonText}>Redeem</Text>
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </View>
          )}
        </View>

        {/* Navigation Buttons */}
        <View style={styles.section}>
          <View style={styles.navigationButtons}>
            <TouchableOpacity style={styles.navButton} onPress={handleBack}>
              <Text style={styles.navButtonText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton} onPress={handleHome}>
              <Text style={styles.navButtonText}>Home</Text>
            </TouchableOpacity>
          </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backText: {
    fontSize: 16,
    color: '#4CAF50',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 50,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  rewardsContainer: {
    marginBottom: 20,
  },
  rewardItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  couponCard: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 6,
    marginRight: 15,
  },
  couponText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  rewardInfo: {
    flex: 1,
  },
  rewardDescription: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    marginBottom: 4,
  },
  rewardDetail: {
    fontSize: 14,
    color: '#666',
  },
  redeemButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  redeemButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    flex: 0.45,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});
