import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Card from '../components/Card';
import { userAPI, pickupAPI } from '../services/apiService';
import { authService } from '../services/authService';
import notificationService from '../services/notificationService';


export default function DeliveryDashboard({ navigation }) {
  const [isOnline, setIsOnline] = useState(false);
  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    loadDashboardData();
    // Do not auto init sockets until user goes online
    return () => {
      notificationService.disconnect();
    };
  }, []);

  const setupNotifications = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        // Ensure single socket instance
        notificationService.init(currentUser._id);
        notificationService.joinUserRoom(currentUser._id);

        // Listen for pickup requests with simple alert
        notificationService.onPickupRequest((data) => {
          Alert.alert(
            'New Pickup Request',
            `New pickup available ${data.distance} km away. Accept?`,
            [
              { text: 'Reject', style: 'cancel' },
              { text: 'Accept', onPress: () => handleNotificationAccept(data) }
            ]
          );
        });

        // Listen for new pickups available
        notificationService.onNewPickupAvailable((data) => {
          const pk = (data && (data.pickup || data.data?.pickup || data.pickupData)) || data;
          const title = pk?.wasteType ? `Pickup: ${pk.wasteType}` : 'New Pickup Available';
          const addr = pk?.address?.formattedAddress || pk?.address?.apartmentRoadArea || '';
          Alert.alert(
            title,
            addr ? `${addr}\nAccept this job?` : 'A new pickup is available in your area. Accept?',
            [
              { text: 'Reject', style: 'cancel', onPress: () => handleNotificationReject(pk) },
              { text: 'Accept', onPress: () => handleNotificationAccept(pk) }
            ]
          );
        });

        // Also listen to generic new-pickup events
        notificationService.onNewPickup((data) => {
          const pk = (data && (data.pickup || data.data?.pickup || data.pickupData)) || data;
          const title = pk?.wasteType ? `Pickup: ${pk.wasteType}` : 'Pickup Broadcast';
          const addr = pk?.address?.formattedAddress || pk?.address?.apartmentRoadArea || '';
          Alert.alert(
            title,
            addr ? `${addr}\nAccept this job?` : 'A pickup request has been broadcast. Accept?',
            [
              { text: 'Reject', style: 'cancel', onPress: () => handleNotificationReject(pk) },
              { text: 'Accept', onPress: () => handleNotificationAccept(pk) }
            ]
          );
        });

        // Listen for earnings updates
        notificationService.onEarningsUpdate((data) => {
          Alert.alert('Earnings Updated', `Your earnings: ₹${data.amount}`);
        });
      }
    } catch (error) {
      console.error('Error setting up notifications:', error);
    }
  };

  const handleNotificationAccept = async (notification) => {
    const getPickupFromPayload = (payload) => {
      if (!payload) return null;
      if (payload.pickup) return payload.pickup;
      if (payload.data?.pickup) return payload.data.pickup;
      if (payload.pickupData) return payload.pickupData;
      return payload;
    };
    try {
      const pickup = getPickupFromPayload(notification);
      const pickupId = pickup?._id || notification?.pickupId || notification?._id;
      if (!pickupId) {
        Alert.alert('Error', 'Pickup data not available');
        return;
      }

      try {
        const { deliveryAPI } = await import('../services/apiService');
        const res = await deliveryAPI.acceptPickup(pickupId);
        const accepted = res?.data || res?.pickup || res;
        navigation.navigate('DeliveryRoutePage', { pickupData: accepted || pickup });
      } catch (e) {
        console.error('Accept API error:', e);
        Alert.alert('Accept Failed', 'Could not accept the pickup. It may have been taken.');
      }
    } catch (error) {
      console.error('Error accepting notification:', error);
      Alert.alert('Error', 'Failed to accept pickup request');
    }
  };

  const handleNotificationReject = async (notification) => {
    try {
      console.log('Rejecting notification:', notification);
      // You can add logic here to send rejection to backend if needed
    } catch (error) {
      console.error('Error rejecting notification:', error);
    }
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Get current user
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      setIsOnline(Boolean(currentUser?.isOnline));

      // Get dashboard data
      const response = await userAPI.getDashboard();

      if (response.status === 'success') {
        setDashboardData(response.data);
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

      // Update online status in backend
      await userAPI.updateOnlineStatus(newOnlineStatus);
      setIsOnline(newOnlineStatus);

      if (newOnlineStatus) {
        if (user) {
          // Initialize socket and join room when going online
          notificationService.init(user._id);
          const connected = await notificationService.waitUntilConnected();
          if (connected) {
            notificationService.joinDeliveryRoom(user._id);
            // Set up (deduplicated) listeners
            await setupNotifications();
          } else {
            Alert.alert('Network', 'Could not connect to notifications. Will retry on next toggle.');
          }
        }
        Alert.alert('Online', 'You are now online and will receive pickup notifications');
      } else {
        Alert.alert('Offline', 'You are now offline');
        notificationService.disconnect();
      }
    } catch (error) {
      console.error('Error toggling online status:', error);
      Alert.alert('Error', 'Failed to update online status');
    }
  };

  const handleProfile = () => {
    navigation.navigate('DeliveryProfile');
  };

  const handleEarnings = () => {
    navigation.navigate('DeliveryEarnings');
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
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome back!</Text>
          <Text style={styles.welcomeSubtitle}>
            {user?.name ? `${user.name}, ready for your next pickup?` : 'Ready for your next pickup?'}
          </Text>
          <View style={styles.statusIndicator}>
            <View style={[styles.statusDot, { backgroundColor: isOnline ? '#4CAF50' : '#f44336' }]} />
            <Text style={styles.statusText}>
              {isOnline ? 'Online - Receiving notifications' : 'Offline'}
            </Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Pickups Completed</Text>
            <Text style={styles.statValue}>{user?.completedPickups || 0}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Total Earnings</Text>
            <Text style={styles.currencySymbol}>₹</Text>
            <Text style={styles.statValue}>{user?.earnings?.total || 0}</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={handleEarnings}>
              <Text style={styles.actionButtonIcon}>💰</Text>
              <Text style={styles.actionButtonText}>View Earnings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleProfile}>
              <Text style={styles.actionButtonIcon}>👤</Text>
              <Text style={styles.actionButtonText}>My Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Today's Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Summary</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Today's Pickups:</Text>
              <Text style={styles.summaryValue}>{dashboardData?.todayPickups || 0}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Today's Earnings:</Text>
              <Text style={styles.summaryValue}>₹{dashboardData?.todayEarnings || 0}</Text>
            </View>
          </View>
        </View>

        {/* Performance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance</Text>
          <View style={styles.performanceCard}>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingValue}>{user?.rating?.average?.toFixed(1) || '0.0'}</Text>
              <Text style={styles.starIcon}>⭐</Text>
            </View>
            <Text style={styles.ratingLabel}>Average Rating</Text>
            <Text style={styles.ratingSubtext}>
              Based on {user?.rating?.total || 0} customer reviews
            </Text>
          </View>
        </View>

        {/* Notification Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.notificationCard}>
            <Text style={styles.notificationIcon}>🔔</Text>
            <Text style={styles.notificationText}>
              {isOnline
                ? 'You will receive real-time notifications for new pickup requests'
                : 'Go online to receive pickup notifications'
              }
            </Text>
          </View>
        </View>

        {/* Support */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.supportButton} onPress={handleSupport}>
            <Text style={styles.supportButtonIcon}>💬</Text>
            <Text style={styles.supportButtonText}>Need Help? Contact Support</Text>
          </TouchableOpacity>
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
  welcomeSection: {
    marginBottom: 25,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#666',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
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
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#fff',
    width: '48%',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  actionButtonIcon: {
    fontSize: 30,
    marginBottom: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  summaryCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  performanceCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  ratingValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#4CAF50',
    marginRight: 8,
  },
  starIcon: {
    fontSize: 24,
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  ratingSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  notificationCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  notificationIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  notificationText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    lineHeight: 20,
  },
  supportButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  supportButtonIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  supportButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});


