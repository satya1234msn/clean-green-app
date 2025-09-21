import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export default function Rewards({ navigation }) {
  const rewards = [
    { id: 1, title: 'obtained for', description: 'Recycling 5 plastic bottles', coupon: 'ZOMATO50' },
    { id: 2, title: 'obtained for', description: 'Completing 10 pickups', coupon: 'SWIGGY20' },
    { id: 3, title: 'obtained for', description: 'Eco Warrior Badge', coupon: 'ECO10' },
    { id: 4, title: 'obtained for', description: 'Green Champion', coupon: 'AMAZON15' },
  ];

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
        <Text style={styles.headerTitle}>YOUR REWARDS!</Text>
      </View>

      <View style={styles.content}>
        {/* Rewards List */}
        <View style={styles.rewardsContainer}>
          {rewards.map((reward) => (
            <View key={reward.id} style={styles.rewardItem}>
              <View style={styles.couponPlaceholder}>
                <Text style={styles.couponText}>{reward.coupon}</Text>
              </View>
              <Text style={styles.rewardDescription}>
                {reward.title}
              </Text>
            </View>
          ))}
        </View>

        {/* Navigation Buttons */}
        <View style={styles.navigationButtons}>
          <TouchableOpacity style={styles.navButton} onPress={handleBack}>
            <Text style={styles.navButtonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={handleHome}>
            <Text style={styles.navButtonText}>Home</Text>
          </TouchableOpacity>
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
  rewardsContainer: {
    marginBottom: 30,
  },
  rewardItem: {
    marginBottom: 20,
    alignItems: 'center',
  },
  couponPlaceholder: {
    width: 200,
    height: 100,
    backgroundColor: '#fff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  couponText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  rewardDescription: {
    fontSize: 16,
    color: '#222',
    fontWeight: '500',
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
    borderColor: '#E0E0E0',
    flex: 0.45,
    alignItems: 'center',
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
});