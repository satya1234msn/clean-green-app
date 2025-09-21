import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Card from '../components/Card';
import Button from '../components/Button';

export default function DeliveryProfile({ navigation }) {
  const [profile] = useState({
    name: 'John Delivery',
    email: 'john.delivery@cleangreen.com',
    phone: '+91 98765 43210',
    vehicleType: 'Bike',
    licenseNumber: '****1490',
    totalPickups: 5,
    rating: 5,
    status: 'Active'
  });

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Profile editing feature coming soon!');
  };

  const handleChangePassword = () => {
    Alert.alert('Change Password', 'Password change feature coming soon!');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => navigation.replace('UserProfileSelector')
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>YOUR PROFILE</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>DP</Text>
            </View>
            <Text style={styles.userName}>{profile.name}</Text>
          </View>
          
          <View style={styles.profileInfo}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoValue}>{profile.email}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>ph no:</Text>
              <Text style={styles.infoValue}>{profile.phone}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>vehicle type</Text>
              <Text style={styles.infoValue}>{profile.vehicleType}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Licence:</Text>
              <Text style={styles.infoValue}>{profile.licenseNumber} no</Text>
            </View>
          </View>

          <View style={styles.performanceSection}>
            <Text style={styles.performanceText}>pickups done till now: {profile.totalPickups}</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>Your Rating: {profile.rating}</Text>
              <Text style={styles.starIcon}>⭐</Text>
            </View>
          </View>

        </View>

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsIcon}>ⓘ</Text>
          <Text style={styles.instructionsText}>instructions</Text>
        </View>

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <Button 
            title="Logout" 
            onPress={handleLogout} 
            variant="secondary"
            style={styles.logoutButton}
          />
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
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#00C897',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#222',
  },
  placeholder: {
    width: 60,
  },
  content: {
    padding: 20,
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#00C897',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#222',
  },
  profileInfo: {
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: '#222',
    fontWeight: '600',
  },
  performanceSection: {
    marginBottom: 20,
  },
  performanceText: {
    fontSize: 16,
    color: '#222',
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 16,
    color: '#222',
    marginRight: 8,
  },
  starIcon: {
    fontSize: 16,
  },
  backButtonBottom: {
    backgroundColor: '#00C897',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'flex-end',
  },
  instructionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  instructionsIcon: {
    fontSize: 20,
    color: '#00C897',
    marginRight: 8,
  },
  instructionsText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  logoutContainer: {
    marginBottom: 20,
  },
  logoutButton: {
    width: '100%',
  },
});

