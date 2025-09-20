import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';

export default function Profile({ navigation }) {
  const userInfo = {
    name: 'NAME of the user',
    email: 'user@example.com',
    phone: '+91 98765 43210',
    address: '123 Main Street, City, State 12345'
  };

  const historyData = [
    { id: 1, type: 'Plastic Waste', weight: '2.5kg', date: 'Jan 15, 2024', points: '+150' },
    { id: 2, type: 'Food Waste', weight: '1.8kg', date: 'Jan 14, 2024', points: '+120' },
    { id: 3, type: 'Paper Waste', weight: '2.0kg', date: 'Jan 13, 2024', points: '+100' },
    { id: 4, type: 'Glass Items', weight: '0.8kg', date: 'Jan 12, 2024', points: '+80' },
    { id: 5, type: 'Mixed Waste', weight: '3.2kg', date: 'Jan 11, 2024', points: '+200' },
  ];

  const handleEdit = () => {
    Alert.alert('Edit Profile', 'Profile editing feature coming soon!');
  };

  const handleHome = () => {
    navigation.navigate('Dashboard');
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
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'UserProfileSelector' }],
            });
          }
        }
      ]
    );
  };

  const handleViewHistory = (history) => {
    Alert.alert('History Details', `Type: ${history.type}\nWeight: ${history.weight}\nDate: ${history.date}\nPoints: ${history.points}`);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header with Profile Info */}
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
          <Text style={styles.userName}>{userInfo.name}</Text>
        </View>
      </View>

      <View style={styles.content}>
        {/* User Details Section */}
        <View style={styles.detailsSection}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Email-</Text>
            <Text style={styles.detailValue}>{userInfo.email}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Phn no-</Text>
            <Text style={styles.detailValue}>{userInfo.phone}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Adaness-</Text>
            <Text style={styles.detailValue}>{userInfo.address}</Text>
          </View>
        </View>

        {/* History Section */}
        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>History</Text>
          <View style={styles.historyContainer}>
            {historyData.map((history) => (
              <TouchableOpacity 
                key={history.id} 
                style={styles.historyItem}
                onPress={() => handleViewHistory(history)}
              >
                <View style={styles.historyInfo}>
                  <Text style={styles.historyType}>{history.type}</Text>
                  <Text style={styles.historyWeight}>{history.weight}</Text>
                  <Text style={styles.historyDate}>{history.date}</Text>
                </View>
                <Text style={styles.historyPoints}>{history.points}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Navigation Buttons */}
      <View style={styles.navigationButtons}>
        <TouchableOpacity style={styles.navButton} onPress={handleEdit}>
          <Text style={styles.navButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={handleHome}>
          <Text style={styles.navButtonText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navButton, styles.logoutButton]} onPress={handleLogout}>
          <Text style={[styles.navButtonText, styles.logoutButtonText]}>Logout</Text>
        </TouchableOpacity>
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
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarText: {
    fontSize: 36,
    color: '#2E7D32',
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1B5E20',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  detailsSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  detailItem: {
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1B5E20',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: '#666',
  },
  historySection: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1B5E20',
    marginBottom: 12,
  },
  historyContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  historyInfo: {
    flex: 1,
  },
  historyType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1B5E20',
    marginBottom: 2,
  },
  historyWeight: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  historyDate: {
    fontSize: 14,
    color: '#666',
  },
  historyPoints: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  navButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    flex: 1,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  navButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#F44336',
  },
  logoutButtonText: {
    color: '#fff',
  },
});
