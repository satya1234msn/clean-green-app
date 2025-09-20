import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';

export default function DeliveryPickupAccepted({ navigation, route }) {
  const { pickupData } = route.params || {};
  
  const [pickupStatus, setPickupStatus] = useState('accepted'); // accepted, reached, picked
  const [showPickedButton, setShowPickedButton] = useState(false);
  
  const pickupDetails = pickupData || {
    id: 1,
    type: 'Plastic Waste',
    weight: '2.5kg',
    items: ['Plastic bottles', 'Food containers', 'Packaging materials'],
    earnings: 150,
    customerName: 'John Doe',
    customerPhone: '+91 98765 43210',
    address: '123 Main Street, City, State 12345'
  };

  const handleOpenMaps = () => {
    Alert.alert('Open Maps', 'Opening route in maps application...');
  };

  const handleReached = () => {
    setPickupStatus('reached');
    setShowPickedButton(true);
    Alert.alert('Status Updated', 'You have marked as reached the pickup location!');
  };

  const handlePicked = () => {
    setPickupStatus('picked');
    Alert.alert('Pickup Completed', `You have successfully picked up the waste and earned ₹${pickupDetails.earnings}!`);
  };

  const handleSupport = () => {
    Alert.alert('Support', 'Contact support for assistance.');
  };

  const handleCallCustomer = () => {
    Alert.alert('Call Customer', `Calling ${pickupDetails.customerName} at ${pickupDetails.customerPhone}`);
  };

  const handleMessageCustomer = () => {
    Alert.alert('Message Customer', `Messaging ${pickupDetails.customerName}`);
  };

  const handleViewCustomerProfile = () => {
    Alert.alert('Customer Profile', `Viewing profile of ${pickupDetails.customerName}`);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Route map</Text>
      </View>

      {/* Map Section */}
      <View style={styles.mapSection}>
        <View style={styles.mapContainer}>
          <Text style={styles.mapIcon}>🗺️</Text>
          <Text style={styles.mapText}>Live Route Map</Text>
          <Text style={styles.mapSubtext}>Real-time navigation</Text>
        </View>
        <TouchableOpacity style={styles.openMapsButton} onPress={handleOpenMaps}>
          <Text style={styles.openMapsText}>open with maps</Text>
        </TouchableOpacity>
      </View>

      {/* Pickup Details Section */}
      <View style={styles.pickupDetailsSection}>
        <Text style={styles.sectionTitle}>Pickup details:</Text>
        <View style={styles.detailsContainer}>
          <View style={styles.detailsRow}>
            <View style={styles.detailColumn}>
              <Text style={styles.detailLabel}>items list</Text>
              <View style={styles.itemsList}>
                {pickupDetails.items.map((item, index) => (
                  <Text key={index} style={styles.itemText}>• {item}</Text>
                ))}
              </View>
            </View>
            <View style={styles.detailColumn}>
              <Text style={styles.detailLabel}>weight</Text>
              <View style={styles.weightBox}>
                <Text style={styles.weightText}>{pickupDetails.weight}</Text>
              </View>
            </View>
          </View>
          <View style={styles.earningsRow}>
            <Text style={styles.earningsLabel}>earning for this pickup: ₹{pickupDetails.earnings}</Text>
          </View>
        </View>
      </View>

      {/* Action Buttons and Customer Info */}
      <View style={styles.bottomSection}>
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, pickupStatus === 'reached' && styles.actionButtonActive]} 
            onPress={handleReached}
          >
            <Text style={styles.actionButtonText}>reached</Text>
          </TouchableOpacity>
          {showPickedButton && (
            <TouchableOpacity 
              style={[styles.actionButton, pickupStatus === 'picked' && styles.actionButtonActive]} 
              onPress={handlePicked}
            >
              <Text style={styles.actionButtonText}>Picked</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.actionButton} onPress={handleSupport}>
            <Text style={styles.actionButtonText}>Support</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.customerInfo}>
          <Text style={styles.customerName}>{pickupDetails.customerName}</Text>
          <View style={styles.customerActions}>
            <TouchableOpacity style={styles.customerActionButton} onPress={handleViewCustomerProfile}>
              <Text style={styles.customerActionIcon}>👤</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.customerActionButton} onPress={handleCallCustomer}>
              <Text style={styles.customerActionIcon}>📞</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.customerActionButton} onPress={handleMessageCustomer}>
              <Text style={styles.customerActionIcon}>💬</Text>
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
    backgroundColor: '#F1F8E9', // Very light green background
  },
  header: {
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
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1B5E20',
    textAlign: 'center',
  },
  mapSection: {
    padding: 20,
  },
  mapContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  mapIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  mapText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1B5E20',
    marginBottom: 4,
  },
  mapSubtext: {
    fontSize: 14,
    color: '#666',
  },
  openMapsButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    alignItems: 'center',
  },
  openMapsText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  pickupDetailsSection: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1B5E20',
    marginBottom: 16,
  },
  detailsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  detailColumn: {
    flex: 1,
    marginHorizontal: 8,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1B5E20',
    marginBottom: 8,
  },
  itemsList: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
  },
  itemText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  weightBox: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    minHeight: 80,
    justifyContent: 'center',
  },
  weightText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1B5E20',
  },
  earningsRow: {
    alignItems: 'center',
  },
  earningsLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
  },
  bottomSection: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 0,
  },
  actionButtons: {
    flex: 1,
    marginRight: 16,
  },
  actionButton: {
    backgroundColor: '#E8F5E9',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  actionButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#2E7D32',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1B5E20',
  },
  customerInfo: {
    flex: 1,
    alignItems: 'center',
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1B5E20',
    marginBottom: 12,
    textAlign: 'center',
  },
  customerActions: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  customerActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  customerActionIcon: {
    fontSize: 18,
    color: '#fff',
  },
});

