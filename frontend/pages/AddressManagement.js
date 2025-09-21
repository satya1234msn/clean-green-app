import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { addressAPI, apiUtils } from '../services/apiService';
import { reverseGeocode } from '../services/mapsService';

export default function AddressManagement({ navigation }) {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({
    name: '',
    houseFlatBlock: '',
    apartmentRoadArea: '',
    city: '',
    state: '',
    pincode: '',
    coordinates: { latitude: 0, longitude: 0 }
  });
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Load addresses from backend on component mount
  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      setLoading(true);
      const response = await addressAPI.getAddresses();
      if (response.status === 'success') {
        setAddresses(response.data.addresses);
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
      Alert.alert('Error', 'Failed to load addresses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async () => {
    if (!newAddress.name.trim() || !newAddress.houseFlatBlock.trim() ||
        !newAddress.apartmentRoadArea.trim() || !newAddress.city.trim() ||
        !newAddress.state.trim() || !newAddress.pincode.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);

      // Create full address string
      const fullAddress = `${newAddress.houseFlatBlock}, ${newAddress.apartmentRoadArea}, ${newAddress.city}, ${newAddress.state} ${newAddress.pincode}`;

      const addressData = {
        name: newAddress.name.trim(),
        houseFlatBlock: newAddress.houseFlatBlock.trim(),
        apartmentRoadArea: newAddress.apartmentRoadArea.trim(),
        city: newAddress.city.trim(),
        state: newAddress.state.trim(),
        pincode: newAddress.pincode.trim(),
        fullAddress: fullAddress,
        coordinates: newAddress.coordinates
      };

      const response = await addressAPI.createAddress(addressData);

      if (response.status === 'success') {
        setAddresses([...addresses, response.data.address]);
        resetForm();
        Alert.alert('Success', 'Address added successfully!');
      }
    } catch (error) {
      console.error('Error adding address:', error);
      const errorMessage = apiUtils.handleError(error);
      Alert.alert('Error', errorMessage.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setNewAddress({
      name: address.name,
      houseFlatBlock: address.houseFlatBlock,
      apartmentRoadArea: address.apartmentRoadArea,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      coordinates: address.coordinates
    });
  };

  const handleUpdateAddress = async () => {
    if (!newAddress.name.trim() || !newAddress.houseFlatBlock.trim() ||
        !newAddress.apartmentRoadArea.trim() || !newAddress.city.trim() ||
        !newAddress.state.trim() || !newAddress.pincode.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setSubmitting(true);

      const fullAddress = `${newAddress.houseFlatBlock}, ${newAddress.apartmentRoadArea}, ${newAddress.city}, ${newAddress.state} ${newAddress.pincode}`;

      const addressData = {
        name: newAddress.name.trim(),
        houseFlatBlock: newAddress.houseFlatBlock.trim(),
        apartmentRoadArea: newAddress.apartmentRoadArea.trim(),
        city: newAddress.city.trim(),
        state: newAddress.state.trim(),
        pincode: newAddress.pincode.trim(),
        fullAddress: fullAddress,
        coordinates: newAddress.coordinates
      };

      const response = await addressAPI.updateAddress(editingAddress._id, addressData);

      if (response.status === 'success') {
        setAddresses(addresses.map(addr =>
          addr._id === editingAddress._id ? response.data.address : addr
        ));
        resetForm();
        Alert.alert('Success', 'Address updated successfully!');
      }
    } catch (error) {
      console.error('Error updating address:', error);
      const errorMessage = apiUtils.handleError(error);
      Alert.alert('Error', errorMessage.message);
    } finally {
      setSubmitting(false);
    }
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
          onPress: async () => {
            try {
              const response = await addressAPI.deleteAddress(addressId);
              if (response.status === 'success') {
                setAddresses(addresses.filter(addr => addr._id !== addressId));
                Alert.alert('Success', 'Address deleted successfully!');
              }
            } catch (error) {
              console.error('Error deleting address:', error);
              const errorMessage = apiUtils.handleError(error);
              Alert.alert('Error', errorMessage.message);
            }
          }
        }
      ]
    );
  };

  const handleSetDefault = async (addressId) => {
    try {
      const response = await addressAPI.setDefaultAddress(addressId);
      if (response.status === 'success') {
        // Update local state to reflect the change
        setAddresses(addresses.map(addr => ({
          ...addr,
          isDefault: addr._id === addressId
        })));
        Alert.alert('Success', 'Default address updated!');
      }
    } catch (error) {
      console.error('Error setting default address:', error);
      const errorMessage = apiUtils.handleError(error);
      Alert.alert('Error', errorMessage.message);
    }
  };

  const resetForm = () => {
    setNewAddress({
      name: '',
      houseFlatBlock: '',
      apartmentRoadArea: '',
      city: '',
      state: '',
      pincode: '',
      coordinates: { latitude: 0, longitude: 0 }
    });
    setEditingAddress(null);
    setIsAddingNew(false);
  };

  const getCurrentLocation = async () => {
    try {
      // Request location permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Location permission is required to get your current address. Please enable location access in your device settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Settings', onPress: () => {
              Alert.alert('Settings', 'Please enable location permission in your device settings and try again.');
            }}
          ]
        );
        return;
      }

      Alert.alert('Getting Location', 'Please wait while we get your current location...');

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeout: 10000,
        maximumAge: 60000,
      });

      const { latitude, longitude } = location.coords;

      // Update coordinates in form
      setNewAddress(prev => ({
        ...prev,
        coordinates: { latitude, longitude }
      }));

      // Use OpenStreetMap geocoding service
      const geocodeResult = await reverseGeocode(latitude, longitude);

      if (geocodeResult.success) {
        const addressString = geocodeResult.address;
        const addressParts = addressString.split(', ');

        // Parse address components
        let city = '';
        let state = '';
        let pincode = '';
        let area = '';

        if (addressParts.length >= 3) {
          city = addressParts[addressParts.length - 3] || '';
          state = addressParts[addressParts.length - 2] || '';
          pincode = addressParts[addressParts.length - 1] || '';
          area = addressParts.slice(0, -3).join(', ') || '';
        }

        setNewAddress(prev => ({
          ...prev,
          name: 'Current Location',
          houseFlatBlock: '',
          apartmentRoadArea: area,
          city: city,
          state: state,
          pincode: pincode,
          fullAddress: addressString
        }));

        setIsAddingNew(true);
        Alert.alert('Location Found', `Current address detected and filled!\n\n${addressString}`);
      } else {
        // Fallback to coordinates if geocoding fails
        const address = `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`;
        setNewAddress(prev => ({
          ...prev,
          name: 'Current Location',
          fullAddress: address
        }));

        setIsAddingNew(true);
        Alert.alert('Location Found', `Current location coordinates: ${address}`);
      }
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert(
        'Location Error',
        'Failed to get current location. Please check your location settings and try again.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Retry', onPress: getCurrentLocation }
        ]
      );
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading addresses...</Text>
      </View>
    );
  }

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
            <Text style={styles.inputLabel}>House/Flat/Block No.</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter house/flat/block number"
              value={newAddress.houseFlatBlock}
              onChangeText={(text) => setNewAddress({ ...newAddress, houseFlatBlock: text })}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Apartment/Road/Area</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter apartment/road/area"
              value={newAddress.apartmentRoadArea}
              onChangeText={(text) => setNewAddress({ ...newAddress, apartmentRoadArea: text })}
            />
          </View>

          <View style={styles.inputRow}>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.inputLabel}>City</Text>
              <TextInput
                style={styles.textInput}
                placeholder="City"
                value={newAddress.city}
                onChangeText={(text) => setNewAddress({ ...newAddress, city: text })}
              />
            </View>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.inputLabel}>State</Text>
              <TextInput
                style={styles.textInput}
                placeholder="State"
                value={newAddress.state}
                onChangeText={(text) => setNewAddress({ ...newAddress, state: text })}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Pincode</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter pincode"
              value={newAddress.pincode}
              onChangeText={(text) => setNewAddress({ ...newAddress, pincode: text })}
              keyboardType="numeric"
            />
          </View>

          <TouchableOpacity style={styles.locationButton} onPress={getCurrentLocation}>
            <Text style={styles.locationButtonText}>📍 Use Current Location</Text>
          </TouchableOpacity>

          <View style={styles.formButtons}>
            {editingAddress ? (
              <>
                <TouchableOpacity
                  style={[styles.updateButton, submitting && styles.disabledButton]}
                  onPress={handleUpdateAddress}
                  disabled={submitting}
                >
                  {submitting ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Update Address</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={resetForm}
                  disabled={submitting}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={[styles.addButton, submitting && styles.disabledButton]}
                onPress={handleAddAddress}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Add Address</Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Address List */}
        <View style={styles.addressesContainer}>
          <Text style={styles.sectionTitle}>Your Addresses</Text>
          {addresses.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No addresses found</Text>
              <Text style={styles.emptySubtext}>Add your first address to get started</Text>
            </View>
          ) : (
            addresses.map((address) => (
              <View key={address._id} style={styles.addressCard}>
                <View style={styles.addressInfo}>
                  <View style={styles.addressHeader}>
                    <Text style={styles.addressName}>{address.name}</Text>
                    {address.isDefault && (
                      <View style={styles.defaultBadge}>
                        <Text style={styles.defaultText}>Default</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.addressText}>{address.fullAddress}</Text>
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
                      onPress={() => handleSetDefault(address._id)}
                    >
                      <Text style={styles.actionButtonText}>Set Default</Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDeleteAddress(address._id)}
                  >
                    <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F8E9',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
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
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
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
  disabledButton: {
    backgroundColor: '#A5D6A7',
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
  emptyContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
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
