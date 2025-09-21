import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Card from '../components/Card';
import { userAPI, pickupAPI } from '../services/apiService';
import { authService } from '../services/authService';

export default function DeliveryDashboard({ navigation }) {
  const [isOnline, setIsOnline] = useState(false);
  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [availablePickups, setAvailablePickups] = useState([]);
  const [currentPickup, setCurrentPickup] = useState(null);
  const [pickupTimer, setPickupTimer] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    let interval;
    if (currentPickup && pickupTimer > 0) {
      interval = setInterval(() => {
        setPickupTimer(prev => {
          if (prev <= 1) {
            setCurrentPickup(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentPickup, pickupTimer]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Get current user
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      setIsOnline(currentUser?.isOnline || false);

      // Get dashboard data
      const response = await userAPI.getDashboard();

      if (response.status === 'success') {
        setDashboardData(response.data);
        setAvailablePickups(response.data.availablePickups || []);
      }
    } catch (error) {
      console.error('Error loading delivery dashboard:', error);
      Alert.alert('Error', 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleOnline = async () => {
    try {
      const newOnlineStatus = !isOnline;

      // Update online status in backend using userAPI instead of deliveryAPI
      await userAPI.updateOnlineStatus(newOnlineStatus);

      setIsOnline(newOnlineStatus);

      if (newOnlineStatus) {
        // Fetch available pickups when going online
        const response = await pickupAPI.getAvailablePickups();
        if (response.status === 'success') {
          setAvailablePickups(response.data.pickups || []);

          // If there are available pickups, show the first one
          if (response.data.pickups && response.data.pickups.length > 0) {
            const pickup = response.data.pickups[0];
            setCurrentPickup({
              id: pickup._id,
              type: `${pickup.wasteDetails.foodBoxes || 0} food boxes, ${pickup.wasteDetails.bottles || 0} bottles`,
              distance: `${pickup.distance || 0}km away from you`,
              time: '20s',
              pickup: pickup
            });
            setPickupTimer(20);
          }
        }
      } else {
        setCurrentPickup(null);
        setPickupTimer(0);
        setAvailablePickups([]);
      }
    } catch (error) {
      console.error('Error toggling online status:', error);
      Alert.alert('Error', 'Failed to update online status');
    }
  };

  const handleAcceptPickup = async () => {
    try {
      if (!currentPickup?.pickup) {
        Alert.alert('Error', 'No pickup selected');
        return;
      }

      // Accept pickup in backend
      const response = await pickupAPI.acceptPickup(currentPickup.pickup._id);

      if (response.status === 'success') {
        Alert.alert('Pickup Accepted', 'You have accepted the pickup request!');
        // Navigate to pickup accepted page
        navigation.navigate('DeliveryPickupAccepted', {
          pickupData: response.data.pickup
        });
        setCurrentPickup(null);
        setPickupTimer(0);
      } else {
        Alert.alert('Error', response.message || 'Failed to accept pickup');
      }
    } catch (error) {
      console.error('Error accepting pickup:', error);
      Alert.alert('Error', 'Failed to accept pickup');
    }
  };

  const handleRejectPickup = async () => {
    try {
      if (!currentPickup?.pickup) {
        Alert.alert('Error', 'No pickup selected');
        return;
      }

      // Reject pickup in backend
      const response = await pickupAPI.rejectPickup(currentPickup.pickup._id);

      if (response.status === 'success') {
        Alert.alert('Pickup Rejected', 'You have rejected the pickup request.');
        setCurrentPickup(null);
        setPickupTimer(0);
      } else {
        Alert.alert('Error', response.message || 'Failed to reject pickup');
      }
    } catch (error) {
      console.error('Error rejecting pickup:', error);
      Alert.alert('Error', 'Failed to reject pickup');
    }
  };

  const handleProfile = () => {
    navigation.navigate('DeliveryProfile');
  };

  const handleSupport = () => {
    navigation.navigate('Support');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.profileIcon} onPress={handleProfile}>
          <Text style={styles.profileIconText}>👤</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.onlineButton, isOnline && styles.onlineButtonActive]}
          onPress={handleToggleOnline}
        >
          <Text style={[styles.onlineButtonText, isOnline && styles.onlineButtonTextActive]}>
            {isOnline ? 'Go Offline' : 'Go Online'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Pickup completed</Text>
            <Text style={styles.statValue}>{user?.completedPickups || 0}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>You earned</Text>
            <Text style={styles.currencySymbol}>₹</Text>
            <Text style={styles.statValue}>{user?.earnings?.total || 0}</Text>
          </View>
        </View>

        {/* Fetching Pickups */}
        {currentPickup && (
          <Card style={styles.pickupCard}>
            <Text style={styles.pickupTitle}>fetching Pickups:</Text>
            <View style={styles.pickupDetails}>
              <Text style={styles.pickupType}>{currentPickup.type}</Text>
              <Text style={styles.pickupDistance}>{currentPickup.distance}</Text>
            </View>
            <View style={styles.pickupActions}>
              <TouchableOpacity style={styles.rejectButton} onPress={handleRejectPickup}>
                <Text style={styles.actionButtonText}>✕</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.acceptButton} onPress={handleAcceptPickup}>
                <Text style={styles.actionButtonText}>✓</Text>
              </TouchableOpacity>
              <Text style={styles.timerText}>{pickupTimer}s</Text>
            </View>
          </Card>
        )}

        {/* Ratings */}
        <Card style={styles.ratingsCard}>
          <Text style={styles.ratingsTitle}>your ratings</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingValue}>{user?.rating?.average?.toFixed(1) || '0.0'}</Text>
            <Text style={styles.starIcon}>⭐</Text>
          </View>
        </Card>

        {/* Support */}
        <View style={styles.supportContainer}>
          <TouchableOpacity style={styles.supportButton} onPress={handleSupport}>
            <Text style={styles.supportButtonText}>Support</Text>
          </TouchableOpacity>
          <Text style={styles.safetyMessage}>
            We ensure Safety for our Pickup executives!
          </Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIconText: {
    fontSize: 24,
    color: '#333',
  },
  onlineButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  onlineButtonActive: {
    backgroundColor: '#f44336',
  },
  onlineButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  onlineButtonTextActive: {
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#4CAF50',
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4CAF50',
    marginRight: 4,
  },
  pickupCard: {
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  pickupTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  pickupDetails: {
    marginBottom: 16,
  },
  pickupType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  pickupDistance: {
    fontSize: 14,
    color: '#666',
  },
  pickupActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rejectButton: {
    backgroundColor: '#f44336',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  timerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF5722',
  },
  ratingsCard: {
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  ratingsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#4CAF50',
    marginRight: 8,
  },
  starIcon: {
    fontSize: 20,
  },
  supportContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  supportButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    marginBottom: 12,
  },
  supportButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  safetyMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
