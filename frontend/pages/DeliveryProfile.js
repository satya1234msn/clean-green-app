import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Card from '../components/Card';
import Button from '../components/Button';

export default function DeliveryProfile({ navigation }) {
  const [profile] = useState({
    name: 'John Delivery',
    email: 'john.delivery@cleangreen.com',
    phone: '+1 234-567-8900',
    vehicleType: 'Van',
    licensePlate: 'ABC-123',
    joinDate: 'January 2024',
    totalPickups: 156,
    totalEarnings: 2340,
    rating: 4.8,
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
      <LinearGradient colors={['#00C897', '#006C67']} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Profile 👤</Text>
            <Text style={styles.headerSubtitle}>Delivery person account</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Profile Card */}
        <Card style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>JD</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{profile.status}</Text>
            </View>
          </View>
          
          <Text style={styles.userName}>{profile.name}</Text>
          <Text style={styles.userEmail}>{profile.email}</Text>
          <Text style={styles.userPhone}>{profile.phone}</Text>
          <Text style={styles.joinDate}>Delivery person since {profile.joinDate}</Text>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{profile.totalPickups}</Text>
              <Text style={styles.statLabel}>Total Pickups</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>${profile.totalEarnings}</Text>
              <Text style={styles.statLabel}>Total Earnings</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{profile.rating}</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
          </View>

          <Button 
            title="Edit Profile" 
            onPress={handleEditProfile}
            style={styles.editButton}
          />
        </Card>

        {/* Vehicle Information */}
        <Card style={styles.vehicleCard}>
          <Text style={styles.sectionTitle}>Vehicle Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Vehicle Type:</Text>
            <Text style={styles.infoValue}>{profile.vehicleType}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>License Plate:</Text>
            <Text style={styles.infoValue}>{profile.licensePlate}</Text>
          </View>
          <TouchableOpacity style={styles.editInfoButton}>
            <Text style={styles.editInfoText}>Update Vehicle Info</Text>
          </TouchableOpacity>
        </Card>

        {/* Account Settings */}
        <Card style={styles.settingsCard}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleChangePassword}>
            <Text style={styles.settingIcon}>🔒</Text>
            <Text style={styles.settingText}>Change Password</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingIcon}>🔔</Text>
            <Text style={styles.settingText}>Notification Settings</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingIcon}>📍</Text>
            <Text style={styles.settingText}>Location Settings</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingIcon}>💳</Text>
            <Text style={styles.settingText}>Payment Settings</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
        </Card>

        {/* Support & Help */}
        <Card style={styles.supportCard}>
          <Text style={styles.sectionTitle}>Support & Help</Text>
          
          <TouchableOpacity style={styles.supportItem}>
            <Text style={styles.supportIcon}>❓</Text>
            <Text style={styles.supportText}>Help Center</Text>
            <Text style={styles.supportArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.supportItem}>
            <Text style={styles.supportIcon}>📞</Text>
            <Text style={styles.supportText}>Contact Support</Text>
            <Text style={styles.supportArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.supportItem}>
            <Text style={styles.supportIcon}>📋</Text>
            <Text style={styles.supportText}>Terms & Conditions</Text>
            <Text style={styles.supportArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.supportItem}>
            <Text style={styles.supportIcon}>ℹ️</Text>
            <Text style={styles.supportText}>About CleanGreen</Text>
            <Text style={styles.supportArrow}>›</Text>
          </TouchableOpacity>
        </Card>

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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
    marginBottom: 16,
  },
  profileCard: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#00C897',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
  },
  statusBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: '#28A745',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#fff',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#222',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 2,
  },
  userPhone: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  joinDate: {
    fontSize: 14,
    color: '#999',
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#00C897',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  editButton: {
    width: '100%',
  },
  vehicleCard: {
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  editInfoButton: {
    marginTop: 16,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  editInfoText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#006C67',
  },
  settingsCard: {
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingIcon: {
    fontSize: 20,
    marginRight: 16,
    width: 24,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: '#222',
    fontWeight: '500',
  },
  settingArrow: {
    fontSize: 20,
    color: '#999',
  },
  supportCard: {
    marginBottom: 20,
  },
  supportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  supportIcon: {
    fontSize: 20,
    marginRight: 16,
    width: 24,
  },
  supportText: {
    flex: 1,
    fontSize: 16,
    color: '#222',
    fontWeight: '500',
  },
  supportArrow: {
    fontSize: 20,
    color: '#999',
  },
  logoutContainer: {
    marginBottom: 20,
  },
  logoutButton: {
    width: '100%',
  },
});

