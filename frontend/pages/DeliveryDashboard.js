import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Card from '../components/Card';

export default function DeliveryDashboard({ navigation }) {
  const [isOnline, setIsOnline] = useState(false);
  const [completedPickups] = useState(12);
  const [totalEarnings] = useState(2450);
  const [currentPickup, setCurrentPickup] = useState(null);
  const [pickupTimer, setPickupTimer] = useState(0);
  const [ratings] = useState(5);

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

  const handleToggleOnline = () => {
    setIsOnline(!isOnline);
    if (!isOnline) {
      // Simulate new pickup when going online
      setTimeout(() => {
        setCurrentPickup({
          id: 1,
          type: '1kg food boxes',
          distance: '1km away from you',
          time: '20s'
        });
        setPickupTimer(20);
      }, 2000);
    } else {
      setCurrentPickup(null);
      setPickupTimer(0);
    }
  };

  const handleAcceptPickup = () => {
    Alert.alert('Pickup Accepted', 'You have accepted the pickup request!');
    // Navigate to pickup accepted page
    navigation.navigate('DeliveryPickupAccepted', {
      pickupData: {
        id: currentPickup.id,
        type: currentPickup.type,
        weight: '2.5kg',
        items: ['Plastic bottles', 'Food containers', 'Packaging materials'],
        earnings: 150,
        customerName: 'John Doe',
        customerPhone: '+91 98765 43210',
        address: '123 Main Street, City, State 12345'
      }
    });
    setCurrentPickup(null);
    setPickupTimer(0);
  };

  const handleRejectPickup = () => {
    Alert.alert('Pickup Rejected', 'You have rejected the pickup request.');
    setCurrentPickup(null);
    setPickupTimer(0);
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
            <Text style={styles.statValue}>{completedPickups}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>You earned</Text>
            <Text style={styles.currencySymbol}>₹</Text>
            <Text style={styles.statValue}>{totalEarnings}</Text>
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
            <Text style={styles.ratingValue}>{ratings}</Text>
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
    backgroundColor: '#F1F8E9', // Very light green background
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
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIconText: {
    fontSize: 24,
    color: '#2E7D32',
  },
  onlineButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  onlineButtonActive: {
    backgroundColor: '#F44336',
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
    color: '#1B5E20',
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
    color: '#1B5E20',
    marginBottom: 12,
  },
  pickupDetails: {
    marginBottom: 16,
  },
  pickupType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
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
    backgroundColor: '#F44336',
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
    color: '#1B5E20',
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