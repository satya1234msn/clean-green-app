import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { getDirections, getFallbackDirections } from '../services/mapsService';

export default function UserTrackingMap({ navigation, route }) {
  const { pickupData } = route.params || {};
  const [deliveryLocation, setDeliveryLocation] = useState({
    latitude: 12.9800, // Starting from warehouse
    longitude: 77.6100,
  });
  const [userLocation] = useState({
    latitude: 12.9756, // User's location
    longitude: 77.5996,
  });
  const [region, setRegion] = useState({
    latitude: 12.9756,
    longitude: 77.5996,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const [routeWaypoints, setRouteWaypoints] = useState([]);
  const [routeInfo, setRouteInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Calculate route when component mounts
  useEffect(() => {
    const calculateRoute = async () => {
      setLoading(true);
      try {
        // Try to get directions from Google Maps API
        const result = await getDirections(deliveryLocation, userLocation);
        
        if (result.success) {
          setRouteWaypoints(result.waypoints);
          setRouteInfo({
            distance: result.distance,
            duration: result.duration,
          });
        } else {
          // Fallback to simulated route if API fails
          console.log('Using fallback route calculation');
          const fallbackResult = getFallbackDirections(deliveryLocation, userLocation);
          setRouteWaypoints(fallbackResult.waypoints);
          setRouteInfo({
            distance: fallbackResult.distance,
            duration: fallbackResult.duration,
          });
        }
      } catch (error) {
        console.error('Route calculation error:', error);
        // Use fallback route
        const fallbackResult = getFallbackDirections(deliveryLocation, userLocation);
        setRouteWaypoints(fallbackResult.waypoints);
        setRouteInfo({
          distance: fallbackResult.distance,
          duration: fallbackResult.duration,
        });
      } finally {
        setLoading(false);
      }
    };

    calculateRoute();
  }, []);

  // Simulate delivery person moving along the route
  useEffect(() => {
    if (routeWaypoints.length === 0) return;
    
    let currentWaypointIndex = 0;
    const interval = setInterval(() => {
      if (currentWaypointIndex < routeWaypoints.length - 1) {
        currentWaypointIndex++;
        const newLocation = routeWaypoints[currentWaypointIndex];
        
        setDeliveryLocation(newLocation);
        
        // Update region to follow delivery person
        setRegion({
          latitude: newLocation.latitude,
          longitude: newLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      } else {
        clearInterval(interval);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [routeWaypoints]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleOpenMaps = () => {
    Alert.alert('Open Maps', 'Opening in device maps app...');
  };

  // Calculate distance
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const distance = calculateDistance(
    deliveryLocation.latitude, 
    deliveryLocation.longitude,
    userLocation.latitude, 
    userLocation.longitude
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Delivery Tracking</Text>
        <TouchableOpacity style={styles.mapsButton} onPress={handleOpenMaps}>
          <Text style={styles.mapsButtonText}>Maps</Text>
        </TouchableOpacity>
      </View>

      {/* Status Card */}
      <View style={styles.statusCard}>
        <Text style={styles.statusTitle}>🚚 Delivery Executive Coming</Text>
        <Text style={styles.statusText}>
          Our delivery executive is on the way to your location
        </Text>
        <Text style={styles.distanceText}>
          Distance: {distance.toFixed(2)} km • ETA: {Math.round(distance * 3)} min
        </Text>
      </View>

      {/* Map */}
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
            description="Pickup location"
            pinColor="green"
          />
          
          {/* Delivery Person Location Marker (Moving) */}
          <Marker
            coordinate={deliveryLocation}
            title="Delivery Executive"
            description="Coming to you"
          >
            <View style={styles.bikeIcon}>
              <Text style={styles.bikeEmoji}>🏍️</Text>
            </View>
          </Marker>
          
          {/* Route Line - Following calculated road-based waypoints */}
          {routeWaypoints.length > 0 && (
            <Polyline
              coordinates={routeWaypoints}
              strokeColor="#4CAF50"
              strokeWidth={4}
              lineDashPattern={[5, 5]}
            />
          )}
        </MapView>
      </View>

      {/* Executive Info */}
      <View style={styles.executiveCard}>
        <Text style={styles.executiveTitle}>Delivery Executive</Text>
        <Text style={styles.executiveName}>Rajesh Kumar</Text>
        <Text style={styles.executivePhone}>+91 98765 43210</Text>
        <Text style={styles.executiveVehicle}>E-rickshaw (Green)</Text>
      </View>
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
  statusCard: {
    backgroundColor: '#4CAF50',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  distanceText: {
    fontSize: 14,
    color: '#E8F5E9',
    fontWeight: '600',
  },
  mapContainer: {
    flex: 1,
    margin: 20,
    marginTop: 0,
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
  executiveCard: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  executiveTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1B5E20',
    marginBottom: 8,
  },
  executiveName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
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
  },
  bikeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  bikeEmoji: {
    fontSize: 20,
  },
});
