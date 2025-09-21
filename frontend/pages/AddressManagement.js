import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { addressAPI } from '../services/apiService';

export default function AddressManagement({ navigation }) {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  
  // Form state
  const [newAddress, setNewAddress] = useState({
    label: '',
    houseFlatBlock: '',
    apartmentRoadArea: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
    latitude: 0,
    longitude: 0,
    isDefault: false,
  });

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      setLoading(true);
      const response = await addressAPI.getAddresses();
      if (response.status === 'success') {
        setAddresses(response.data);
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
      Alert.alert('Error', 'Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  const handleGetCurrentLocation = async () => {
    try {
      setLoading(true);
      
      // Request permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required');
        return;
      }

      // Get current location
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Reverse geocode
      const response = await addressAPI.geocodeAddress(latitude, longitude);
      if (response.status === 'success') {
        setNewAddress(prev => ({
          ...prev,
          latitude,
          longitude,
          city: response.data.city || '',
          state: response.data.state || '',
          pincode: response.data.pincode || '',
          apartmentRoadArea: response.data.area || '',
        }));
      }
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Failed to get current location');
    } finally {
      setLoading(false);
    }
  };

  const searchAddresses = async (query) => {
    if (query.length < 3) {
      setSearchResults([]);
      return;
    }

    try {
      setSearching(true);
      const response = await addressAPI.searchAddresses(query);
      if (response.status === 'success') {
        setSearchResults(response.data);
      }
    } catch (error) {
      console.error('Error searching addresses:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleSearchSelect = (selectedAddress) => {
    setNewAddress(prev => ({
      ...prev,
      apartmentRoadArea: selectedAddress.area,
      city: selectedAddress.city,
      state: selectedAddress.state,
      pincode: selectedAddress.pincode,
      latitude: selectedAddress.latitude,
      longitude: selectedAddress.longitude,
    }));
    setSearchQuery(selectedAddress.displayName);
    setSearchResults([]);
  };

  const handleSaveAddress = async () => {
    try {
      // Validation
      if (!newAddress.label || !newAddress.houseFlatBlock || !newAddress.apartmentRoadArea) {
        Alert.alert('Error', 'Please fill all required fields');
        return;
      }

      setLoading(true);
      
      let response;
      if (editingAddress) {
        response = await addressAPI.updateAddress(editingAddress._id, newAddress);
      } else {
        response = await addressAPI.createAddress(newAddress);
      }

      if (response.status === 'success') {
        Alert.alert('Success', editingAddress ? 'Address updated successfully' : 'Address added successfully');
        setShowAddModal(false);
        setEditingAddress(null);
        resetForm();
        loadAddresses();
      }
    } catch (error) {
      console.error('Error saving address:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to save address');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
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
              setLoading(true);
              const response = await addressAPI.deleteAddress(addressId);
              if (response.status === 'success') {
                Alert.alert('Success', 'Address deleted successfully');
                loadAddresses();
              }
            } catch (error) {
              console.error('Error deleting address:', error);
              Alert.alert('Error', 'Failed to delete address');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleSetDefaultAddress = async (addressId) => {
    try {
      setLoading(true);
      const response = await addressAPI.setDefaultAddress(addressId);
      if (response.status === 'success') {
        Alert.alert('Success', 'Default address updated');
        loadAddresses();
      }
    } catch (error) {
      console.error('Error setting default address:', error);
      Alert.alert('Error', 'Failed to update default address');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNewAddress({
      label: '',
      houseFlatBlock: '',
      apartmentRoadArea: '',
      landmark: '',
      city: '',
      state: '',
      pincode: '',
      latitude: 0,
      longitude: 0,
      isDefault: false,
    });
    setSearchQuery('');
    setSearchResults([]);
  };

  const openEditModal = (address) => {
    setEditingAddress(address);
    setNewAddress(address);
    setSearchQuery(address.apartmentRoadArea);
    setShowAddModal(true);
  };

  const renderAddressItem = ({ item }) => (
    <View style={styles.addressItem}>
      <View style={styles.addressHeader}>
        <Text style={styles.addressLabel}>{item.label}</Text>
        {item.isDefault && (
          <View style={styles.defaultBadge}>
            <Text style={styles.defaultText}>DEFAULT</Text>
          </View>
        )}
      </View>
      
      <Text style={styles.addressText}>
        {item.houseFlatBlock}, {item.apartmentRoadArea}
      </Text>
      
      <Text style={styles.addressSubText}>
        {item.city}, {item.state} - {item.pincode}
      </Text>
      
      {item.landmark && (
        <Text style={styles.landmarkText}>Near: {item.landmark}</Text>
      )}
      
      <View style={styles.addressActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => openEditModal(item)}
        >
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
        
        {!item.isDefault && (
          <TouchableOpacity
            style={[styles.actionButton, styles.defaultButton]}
            onPress={() => handleSetDefaultAddress(item._id)}
          >
            <Text style={styles.defaultActionText}>Set Default</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteAddress(item._id)}
        >
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Addresses</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Add Address Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          resetForm();
          setShowAddModal(true);
        }}
      >
        <Text style={styles.addButtonText}>+ Add New Address</Text>
      </TouchableOpacity>

      {/* Addresses List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text>Loading addresses...</Text>
        </View>
      ) : (
        <FlatList
          data={addresses}
          keyExtractor={(item) => item._id}
          renderItem={renderAddressItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Add/Edit Address Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => {
                setShowAddModal(false);
                setEditingAddress(null);
                resetForm();
              }}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </Text>
            <TouchableOpacity
              onPress={handleSaveAddress}
              disabled={loading}
            >
              <Text style={[styles.saveText, loading && styles.disabledText]}>
                Save
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Search Address */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Search Area/Locality</Text>
              <TextInput
                style={styles.input}
                placeholder="Search for area, locality, or landmark"
                value={searchQuery}
                onChangeText={(text) => {
                  setSearchQuery(text);
                  searchAddresses(text);
                }}
              />
              {searching && <ActivityIndicator style={styles.searchLoader} />}
              
              {searchResults.length > 0 && (
                <View style={styles.searchResults}>
                  {searchResults.map((result, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.searchItem}
                      onPress={() => handleSearchSelect(result)}
                    >
                      <Text style={styles.searchText}>{result.displayName}</Text>
                      <Text style={styles.searchSubText}>{result.area}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Use Current Location */}
            <TouchableOpacity
              style={styles.locationButton}
              onPress={handleGetCurrentLocation}
              disabled={loading}
            >
              <Text style={styles.locationText}>📍 Use Current Location</Text>
            </TouchableOpacity>

            {/* Address Label */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Address Label *</Text>
              <View style={styles.labelOptions}>
                {['Home', 'Work', 'Other'].map((label) => (
                  <TouchableOpacity
                    key={label}
                    style={[
                      styles.labelOption,
                      newAddress.label === label && styles.selectedLabel
                    ]}
                    onPress={() => setNewAddress(prev => ({ ...prev, label }))}
                  >
                    <Text style={[
                      styles.labelOptionText,
                      newAddress.label === label && styles.selectedLabelText
                    ]}>
                      {label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {newAddress.label === 'Other' && (
                <TextInput
                  style={styles.input}
                  placeholder="Enter custom label"
                  value={newAddress.label !== 'Home' && newAddress.label !== 'Work' ? newAddress.label : ''}
                  onChangeText={(text) => setNewAddress(prev => ({ ...prev, label: text }))}
                />
              )}
            </View>

            {/* House/Flat/Block */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>House/Flat/Block No. *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter house/flat/block number"
                value={newAddress.houseFlatBlock}
                onChangeText={(text) => setNewAddress(prev => ({ ...prev, houseFlatBlock: text }))}
              />
            </View>

            {/* Apartment/Road/Area */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Apartment/Road/Area *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter apartment/road/area"
                value={newAddress.apartmentRoadArea}
                onChangeText={(text) => setNewAddress(prev => ({ ...prev, apartmentRoadArea: text }))}
              />
            </View>

            {/* Landmark */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Landmark (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="Any nearby landmark"
                value={newAddress.landmark}
                onChangeText={(text) => setNewAddress(prev => ({ ...prev, landmark: text }))}
              />
            </View>

            {/* City */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>City</Text>
              <TextInput
                style={styles.input}
                placeholder="City"
                value={newAddress.city}
                onChangeText={(text) => setNewAddress(prev => ({ ...prev, city: text }))}
              />
            </View>

            {/* State & Pincode */}
            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.flex1]}>
                <Text style={styles.label}>State</Text>
                <TextInput
                  style={styles.input}
                  placeholder="State"
                  value={newAddress.state}
                  onChangeText={(text) => setNewAddress(prev => ({ ...prev, state: text }))}
                />
              </View>
              
              <View style={[styles.inputGroup, styles.flex1, styles.marginLeft]}>
                <Text style={styles.label}>Pincode</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Pincode"
                  value={newAddress.pincode}
                  onChangeText={(text) => setNewAddress(prev => ({ ...prev, pincode: text }))}
                  keyboardType="numeric"
                  maxLength={6}
                />
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
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
  backButton: {
    padding: 5,
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
  addButton: {
    backgroundColor: '#4CAF50',
    marginHorizontal: 20,
    marginVertical: 15,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  addressItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  addressLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  defaultBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  defaultText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  addressSubText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  landmarkText: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    marginBottom: 10,
  },
  addressActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  defaultButton: {
    backgroundColor: '#f0f8f0',
    borderColor: '#4CAF50',
  },
  deleteButton: {
    borderColor: '#f44336',
  },
  actionText: {
    color: '#666',
    fontSize: 12,
  },
  defaultActionText: {
    color: '#4CAF50',
    fontSize: 12,
  },
  deleteText: {
    color: '#f44336',
    fontSize: 12,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  cancelText: {
    color: '#666',
    fontSize: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  saveText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledText: {
    color: '#ccc',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  searchLoader: {
    position: 'absolute',
    right: 15,
    top: 40,
  },
  searchResults: {
    maxHeight: 200,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  searchItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchText: {
    fontSize: 14,
    color: '#333',
  },
  searchSubText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  locationButton: {
    backgroundColor: '#f0f8f0',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  locationText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '600',
  },
  labelOptions: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  labelOption: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginRight: 10,
  },
  selectedLabel: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  labelOptionText: {
    color: '#666',
    fontSize: 14,
  },
  selectedLabelText: {
    color: '#fff',
  },
  row: {
    flexDirection: 'row',
  },
  flex1: {
    flex: 1,
  },
  marginLeft: {
    marginLeft: 10,
  },
});
