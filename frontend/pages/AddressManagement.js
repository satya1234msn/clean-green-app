import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import * as Location from 'expo-location';
import { reverseGeocode } from '../services/mapsService';

export default function AddressManagement({ navigation }) {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: 'Home',
      address: '123 Main Street, City, State 12345',
      isDefault: true,
    },
    {
      id: 2,
      name: 'Office',
      address: '456 Business Park, City, State 12345',
      isDefault: false,
    },
  ]);

  const [editingAddress, setEditingAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({ name: '', address: '' });

  const handleAddAddress = () => {
    if (!newAddress.name.trim() || !newAddress.address.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const address = {
      id: Date.now(),
      name: newAddress.name.trim(),
      address: newAddress.address.trim(),
      isDefault: addresses.length === 0,
    };

    setAddresses([...addresses, address]);
    setNewAddress({ name: '', address: '' });
    Alert.alert('Success', 'Address added successfully!');
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setNewAddress({ name: address.name, address: address.address });
  };

  const handleUpdateAddress = () => {
    if (!newAddress.name.trim() || !newAddress.address.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setAddresses(addresses.map(addr => 
      addr.id === editingAddress.id 
        ? { ...addr, name: newAddress.name.trim(), address: newAddress.address.trim() }
        : addr
    ));
    setEditingAddress(null);
    setNewAddress({ name: '', address: '' });
    Alert.alert('Success', 'Address updated successfully!');
  };

  const handleDeleteAddress = (addressId) => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setAddresses(addresses.filter(addr => addr.id !== addressId));
          }
        }
      ]
    );
  };

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required to get your current address.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      
      // Use OpenStreetMap geocoding service
      const geocodeResult = await reverseGeocode(latitude, longitude);
      
      if (geocodeResult.success) {
        setNewAddress(prev => ({
          ...prev,
          address: geocodeResult.address
        }));
        
        Alert.alert('Location Found', `Current address: ${geocodeResult.address}`);
      } else {
        // Fallback to coordinates if geocoding fails
        const address = `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`;
        setNewAddress(prev => ({
          ...prev,
          address: address
        }));
        
        Alert.alert('Location Found', `Current location: ${address}`);
      }
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Failed to get current location. Please try again.');
    }
  };

  const handleSetDefault = (addressId) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId
    })));
    Alert.alert('Success', 'Default address updated!');
  };

  const handleGetCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required to get current address');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (address.length > 0) {
        const addr = address[0];
        const fullAddress = `${addr.street || ''} ${addr.city || ''} ${addr.region || ''} ${addr.postalCode || ''}`.trim();
        setNewAddress({
          name: 'Current Location',
          address: fullAddress || 'Current location address'
        });
        Alert.alert('Location Found', 'Current location address has been filled in the form');
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to get current location. Please try again.');
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Addresses</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        {/* Add/Edit Address Form */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>
            {editingAddress ? 'Edit Address' : 'Add New Address'}
          </Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Address Name</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g., Home, Office, Work"
              value={newAddress.name}
              onChangeText={(text) => setNewAddress({ ...newAddress, name: text })}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Full Address</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Enter complete address"
              value={newAddress.address}
              onChangeText={(text) => setNewAddress({ ...newAddress, address: text })}
              multiline
              numberOfLines={3}
            />
            <TouchableOpacity style={styles.locationButton} onPress={getCurrentLocation}>
              <Text style={styles.locationButtonText}>📍 Use Current Location</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formButtons}>
            {editingAddress ? (
              <>
                <TouchableOpacity style={styles.updateButton} onPress={handleUpdateAddress}>
                  <Text style={styles.buttonText}>Update Address</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.cancelButton} 
                  onPress={() => {
                    setEditingAddress(null);
                    setNewAddress({ name: '', address: '' });
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity style={styles.addButton} onPress={handleAddAddress}>
                <Text style={styles.buttonText}>Add Address</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Address List */}
        <View style={styles.addressesContainer}>
          <Text style={styles.sectionTitle}>Your Addresses</Text>
          {addresses.map((address) => (
            <View key={address.id} style={styles.addressCard}>
              <View style={styles.addressInfo}>
                <View style={styles.addressHeader}>
                  <Text style={styles.addressName}>{address.name}</Text>
                  {address.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultText}>Default</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.addressText}>{address.address}</Text>
              </View>
              
              <View style={styles.addressActions}>
                <TouchableOpacity 
                  style={styles.actionButton} 
                  onPress={() => handleEditAddress(address)}
                >
                  <Text style={styles.actionButtonText}>Edit</Text>
                </TouchableOpacity>
                
                {!address.isDefault && (
                  <TouchableOpacity 
                    style={styles.actionButton} 
                    onPress={() => handleSetDefault(address.id)}
                  >
                    <Text style={styles.actionButtonText}>Set Default</Text>
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity 
                  style={[styles.actionButton, styles.deleteButton]} 
                  onPress={() => handleDeleteAddress(address.id)}
                >
                  <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
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
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#2E7D32',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1B5E20',
  },
  placeholder: {
    width: 60,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1B5E20',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1B5E20',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#C8E6C9',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#F8F9FA',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  locationButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  locationButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
  },
  updateButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
  },
  cancelButton: {
    backgroundColor: '#E8F5E9',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  cancelButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  addressesContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1B5E20',
    marginBottom: 16,
  },
  addressCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  addressInfo: {
    marginBottom: 12,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1B5E20',
  },
  defaultBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  defaultText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  addressActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#E8F5E9',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  actionButtonText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#FFEBEE',
    borderColor: '#F44336',
  },
  deleteButtonText: {
    color: '#F44336',
  },
});
