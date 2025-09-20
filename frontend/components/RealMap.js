import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';

export default function RealMap({ navigation, route }) {
  const { pickupData } = route.params || {};
  const [region, setRegion] = useState({
    latitude: 12.9716, // Chennai coordinates
    longitude: 77.5946,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [userLocation, setUserLocation] = useState({
    latitude: 12.9716,
    longitude: 77.5946,
  });

  const [pickupLocation, setPickupLocation] = useState({
    latitude: 12.9756,
    longitude: 77.5996,
  });

  const handleBack = () => {
    navigation.goBack();
  };

  const handleOpenMaps = () => {
    Alert.alert('Open Maps', 'Opening in device maps app...');
  };

  // Simulate location updates
  useEffect(() => {
    const interval = setInterval(() => {
      setUserLocation(prev => ({
        latitude: prev.latitude + (Math.random() - 0.5) * 0.001,
        longitude: prev.longitude + (Math.random() - 0.5) * 0.001,
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Live Tracking</Text>
        <TouchableOpacity style={styles.mapsButton} onPress={handleOpenMaps}>
          <Text style={styles.mapsButtonText}>Maps</Text>
        </TouchableOpacity>
      </View>

      {/* Real Map */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          region={region}
          onRegionChangeComplete={setRegion}
          showsUserLocation={true}
          showsMyLocationButton={true}
          showsCompass={true}
          showsScale={true}
        >
          {/* User Location Marker */}
          <Marker
            coordinate={userLocation}
            title="Your Location"
            description="Current position"
            pinColor="blue"
          />
          
          {/* Pickup Location Marker */}
          <Marker
            coordinate={pickupLocation}
            title="Pickup Location"
            description={pickupData?.customerName || "Customer Location"}
            pinColor="green"
          />
          
          {/* Route Line */}
          <Polyline
            coordinates={[userLocation, pickupLocation]}
            strokeColor="#4CAF50"
            strokeWidth={3}
            lineDashPattern={[5, 5]}
          />
        </MapView>
      </View>

      {/* Pickup Info Overlay */}
      {pickupData && (
        <View style={styles.pickupInfo}>
          <Text style={styles.pickupTitle}>Pickup Details</Text>
          <Text style={styles.pickupText}>Type: {pickupData.type}</Text>
          <Text style={styles.pickupText}>Weight: {pickupData.weight}</Text>
          <Text style={styles.pickupText}>Customer: {pickupData.customerName}</Text>
          <Text style={styles.pickupText}>Address: {pickupData.address}</Text>
        </View>
      )}
    </View>
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
  mapsButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
  },
  mapsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  mapContainer: {
    flex: 1,
    margin: 20,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  map: {
    flex: 1,
  },
  pickupInfo: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  pickupTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1B5E20',
    marginBottom: 8,
  },
  pickupText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
});