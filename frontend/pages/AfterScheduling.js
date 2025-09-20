import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Button from '../components/Button';

export default function AfterScheduling({ navigation, route }) {
  const { wasteType, foodBoxes, bottles, otherItems, images, immediatePickup } = route.params || {};
  const [couponCode, setCouponCode] = useState('');
  const [earnedRewards] = useState(150); // Mock reward amount

  const handleSchedule = () => {
    navigation.navigate('WasteUploadNew');
  };

  const handleViewMap = () => {
    navigation.navigate('MapView', {
      wasteType,
      immediatePickup,
    });
  };

  const handleHome = () => {
    navigation.navigate('Dashboard');
  };

  const handleCallExecutive = () => {
    Alert.alert('Call Executive', 'Calling pickup executive...');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>After scheduling</Text>
      </View>

      <View style={styles.content}>
        {/* Congratulations Section */}
        <View style={styles.congratsContainer}>
          <Text style={styles.congratsText}>Congrats!</Text>
          <Text style={styles.rewardsText}>
            you have earned <Text style={styles.rewardAmount}>{earnedRewards} points</Text>
          </Text>
        </View>

        {/* Coupon Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Coupon</Text>
          <View style={styles.couponContainer}>
            <Text style={styles.couponCode}>CLEAN{earnedRewards}</Text>
            <Text style={styles.couponDescription}>Use this code for your next pickup</Text>
          </View>
        </View>

        {/* Map Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Map</Text>
          <View style={styles.mapContainer}>
            <Text style={styles.mapPlaceholder}>🗺️ Map View</Text>
            <Text style={styles.mapDescription}>
              {immediatePickup ? 'Immediate pickup route' : 'Scheduled pickup route'}
            </Text>
            <TouchableOpacity style={styles.viewMapButton} onPress={handleViewMap}>
              <Text style={styles.viewMapButtonText}>View Full Map</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Pickup Executive Details */}
        <View style={styles.section}>
          <View style={styles.executiveContainer}>
            <Text style={styles.sectionTitle}>Pickup executive details</Text>
            <TouchableOpacity style={styles.callButton} onPress={handleCallExecutive}>
              <Text style={styles.callButtonText}>📞</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.executiveInfo}>
            <Text style={styles.executiveName}>Rajesh Kumar</Text>
            <Text style={styles.executivePhone}>+91 98765 43210</Text>
            <Text style={styles.executiveVehicle}>Vehicle: E-rickshaw (Green)</Text>
            <Text style={styles.estimatedTime}>
              {immediatePickup ? 'ETA: 15-20 minutes' : 'Scheduled: Tomorrow 10:00 AM'}
            </Text>
          </View>
        </View>

        {/* Thank You Message */}
        <View style={styles.thankYouContainer}>
          <Text style={styles.thankYouText}>
            Thank you for being a part of Green India! 🌱
          </Text>
          <Text style={styles.thankYouSubText}>
            Your contribution helps make our planet cleaner and greener.
          </Text>
        </View>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNavigation}>
        <TouchableOpacity style={styles.navButton} onPress={handleHome}>
          <Text style={styles.navButtonText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={handleSchedule}>
          <Text style={styles.navButtonText}>Schedule</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={handleViewMap}>
          <Text style={styles.navButtonText}>View Map</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F8E9', // Very light green background
  },
  header: {
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1B5E20',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  congratsContainer: {
    alignItems: 'center',
    marginBottom: 30,
    paddingVertical: 20,
  },
  congratsText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#4CAF50',
    marginBottom: 8,
  },
  rewardsText: {
    fontSize: 18,
    color: '#1B5E20',
    textAlign: 'center',
  },
  rewardAmount: {
    fontWeight: '700',
    color: '#4CAF50',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1B5E20',
    marginBottom: 12,
  },
  couponContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  couponCode: {
    fontSize: 24,
    fontWeight: '800',
    color: '#4CAF50',
    marginBottom: 8,
    letterSpacing: 2,
  },
  couponDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  mapContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  mapPlaceholder: {
    fontSize: 48,
    marginBottom: 12,
  },
  mapDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  viewMapButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  viewMapButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  executiveContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  callButton: {
    backgroundColor: '#4CAF50',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  callButtonText: {
    fontSize: 20,
  },
  executiveInfo: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  executiveName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1B5E20',
    marginBottom: 4,
  },
  executivePhone: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  executiveVehicle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  estimatedTime: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  thankYouContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  thankYouText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1B5E20',
    textAlign: 'center',
    marginBottom: 8,
  },
  thankYouSubText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  bottomNavigation: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1B5E20',
  },
});
