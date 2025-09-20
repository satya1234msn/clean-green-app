import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Card from '../components/Card';
import Button from '../components/Button';

export default function DeliveryPickups({ navigation }) {
  const [pickups] = useState([
    { 
      id: '1', 
      address: '123 Main St, Apt 4B', 
      time: '10:00 AM', 
      weight: '2.5 kg', 
      status: 'Pending',
      customer: 'John Doe',
      phone: '+1 234-567-8900',
      notes: 'Leave at door if no answer'
    },
    { 
      id: '2', 
      address: '456 Oak Ave, Unit 12', 
      time: '11:30 AM', 
      weight: '1.8 kg', 
      status: 'In Progress',
      customer: 'Jane Smith',
      phone: '+1 234-567-8901',
      notes: 'Ring doorbell twice'
    },
    { 
      id: '3', 
      address: '789 Pine Rd, House 7', 
      time: '2:00 PM', 
      weight: '3.2 kg', 
      status: 'Completed',
      customer: 'Bob Johnson',
      phone: '+1 234-567-8902',
      notes: 'Completed successfully'
    },
    { 
      id: '4', 
      address: '321 Elm St, Apt 5A', 
      time: '3:30 PM', 
      weight: '2.1 kg', 
      status: 'Pending',
      customer: 'Alice Brown',
      phone: '+1 234-567-8903',
      notes: 'Call before arrival'
    },
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return '#FFB703';
      case 'In Progress': return '#006C67';
      case 'Completed': return '#28A745';
      default: return '#666';
    }
  };

  const handleStartPickup = (pickup) => {
    Alert.alert('Start Pickup', `Starting pickup at ${pickup.address}`);
  };

  const handleCompletePickup = (pickup) => {
    Alert.alert('Complete Pickup', `Marking pickup at ${pickup.address} as completed`);
  };

  const handleCallCustomer = (phone) => {
    Alert.alert('Call Customer', `Calling ${phone}`);
  };

  const handleNavigateToAddress = (address) => {
    Alert.alert('Navigation', `Opening maps to ${address}`);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient colors={['#00C897', '#006C67']} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>All Pickups 📋</Text>
            <Text style={styles.headerSubtitle}>Manage your pickup schedule</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Filter Tabs */}
        <View style={styles.filterTabs}>
          <TouchableOpacity style={[styles.filterTab, styles.activeTab]}>
            <Text style={[styles.filterTabText, styles.activeTabText]}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterTab}>
            <Text style={styles.filterTabText}>Pending</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterTab}>
            <Text style={styles.filterTabText}>In Progress</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterTab}>
            <Text style={styles.filterTabText}>Completed</Text>
          </TouchableOpacity>
        </View>

        {/* Pickups List */}
        {pickups.map((pickup) => (
          <Card key={pickup.id} style={styles.pickupCard}>
            <View style={styles.pickupHeader}>
              <View style={styles.pickupTimeContainer}>
                <Text style={styles.pickupTime}>{pickup.time}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(pickup.status) }]}>
                  <Text style={styles.statusText}>{pickup.status}</Text>
                </View>
              </View>
              <Text style={styles.pickupWeight}>{pickup.weight}</Text>
            </View>

            <View style={styles.pickupDetails}>
              <Text style={styles.customerName}>{pickup.customer}</Text>
              <Text style={styles.pickupAddress}>{pickup.address}</Text>
              <Text style={styles.pickupPhone}>{pickup.phone}</Text>
              {pickup.notes && (
                <Text style={styles.pickupNotes}>Note: {pickup.notes}</Text>
              )}
            </View>

            <View style={styles.pickupActions}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handleCallCustomer(pickup.phone)}
              >
                <Text style={styles.actionButtonText}>📞 Call</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handleNavigateToAddress(pickup.address)}
              >
                <Text style={styles.actionButtonText}>🗺️ Navigate</Text>
              </TouchableOpacity>
              {pickup.status === 'Pending' ? (
                <Button 
                  title="Start Pickup" 
                  onPress={() => handleStartPickup(pickup)}
                  style={styles.primaryAction}
                />
              ) : pickup.status === 'In Progress' ? (
                <Button 
                  title="Complete" 
                  onPress={() => handleCompletePickup(pickup)}
                  style={[styles.primaryAction, { backgroundColor: '#28A745' }]}
                />
              ) : (
                <View style={styles.completedContainer}>
                  <Text style={styles.completedText}>✅ Completed</Text>
                </View>
              )}
            </View>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#E8FFFC',
    fontWeight: '500',
  },
  content: {
    padding: 20,
    paddingTop: 20,
  },
  filterTabs: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 4,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#00C897',
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },
  pickupCard: {
    marginBottom: 16,
  },
  pickupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  pickupTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pickupTime: {
    fontSize: 18,
    fontWeight: '700',
    color: '#006C67',
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  pickupWeight: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  pickupDetails: {
    marginBottom: 16,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
    marginBottom: 4,
  },
  pickupAddress: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  pickupPhone: {
    fontSize: 14,
    color: '#006C67',
    marginBottom: 4,
  },
  pickupNotes: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  pickupActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionButton: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#555',
  },
  primaryAction: {
    flex: 1,
    marginLeft: 8,
    paddingVertical: 8,
  },
  completedContainer: {
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: '#E8F5E8',
    borderRadius: 8,
  },
  completedText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#28A745',
  },
});

