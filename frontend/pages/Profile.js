import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator, TextInput } from 'react-native';
import { userAPI, apiUtils } from '../services/apiService';

export default function Profile({ navigation }) {
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    loadUserProfile();
    loadUserHistory();
  }, []);

  const loadUserProfile = async () => {
    try {
      const response = await userAPI.getProfile();
      if (response.status === 'success') {
        const user = response.data.user;
        setUserInfo({
          name: user.name || 'User',
          email: user.email || 'user@example.com',
          phone: user.phone || '+91 98765 43210',
          address: user.addresses?.[0]?.fullAddress || 'No address set'
        });
        setEditForm({
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || ''
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      Alert.alert('Error', 'Failed to load profile data');
    }
  };

  const loadUserHistory = async () => {
    try {
      const response = await userAPI.getHistory(1, 10);
      if (response.status === 'success') {
        setHistoryData(response.data.history || []);
      }
    } catch (error) {
      console.error('Error loading history:', error);
      // Use dummy data as fallback
      setHistoryData([
        { id: 1, type: 'Plastic Waste', weight: '2.5kg', date: 'Jan 15, 2024', points: '+150' },
        { id: 2, type: 'Food Waste', weight: '1.8kg', date: 'Jan 14, 2024', points: '+120' },
        { id: 3, type: 'Paper Waste', weight: '2.0kg', date: 'Jan 13, 2024', points: '+100' },
        { id: 4, type: 'Glass Items', weight: '0.8kg', date: 'Jan 12, 2024', points: '+80' },
        { id: 5, type: 'Mixed Waste', weight: '3.2kg', date: 'Jan 11, 2024', points: '+200' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = async () => {
    if (!editForm.name.trim() || !editForm.email.trim() || !editForm.phone.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const response = await userAPI.updateProfile(editForm);
      if (response.status === 'success') {
        setUserInfo({
          ...userInfo,
          name: editForm.name,
          email: editForm.email,
          phone: editForm.phone
        });
        setEditing(false);
        Alert.alert('Success', 'Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      const errorMessage = apiUtils.handleError(error);
      Alert.alert('Error', errorMessage.message);
    }
  };

  const handleCancel = () => {
    setEditForm({
      name: userInfo.name,
      email: userInfo.email,
      phone: userInfo.phone
    });
    setEditing(false);
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

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
            <Text style={styles.detailLabel}>Name</Text>
            {editing ? (
              <TextInput
                style={styles.editInput}
                value={editForm.name}
                onChangeText={(text) => setEditForm({ ...editForm, name: text })}
                placeholder="Enter your name"
              />
            ) : (
              <Text style={styles.detailValue}>{userInfo.name}</Text>
            )}
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Email</Text>
            {editing ? (
              <TextInput
                style={styles.editInput}
                value={editForm.email}
                onChangeText={(text) => setEditForm({ ...editForm, email: text })}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            ) : (
              <Text style={styles.detailValue}>{userInfo.email}</Text>
            )}
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Phone</Text>
            {editing ? (
              <TextInput
                style={styles.editInput}
                value={editForm.phone}
                onChangeText={(text) => setEditForm({ ...editForm, phone: text })}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
              />
            ) : (
              <Text style={styles.detailValue}>{userInfo.phone}</Text>
            )}
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Address</Text>
            <Text style={styles.detailValue}>{userInfo.address}</Text>
          </View>
        </View>

        {/* Edit/Save Buttons */}
        <View style={styles.editButtonsContainer}>
          {editing ? (
            <View style={styles.editButtons}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* History Section */}
        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>Recent Activity</Text>
          <View style={styles.historyContainer}>
            {historyData.length === 0 ? (
              <View style={styles.emptyHistory}>
                <Text style={styles.emptyHistoryText}>No activity yet</Text>
                <Text style={styles.emptyHistorySubtext}>Start recycling to see your history here</Text>
              </View>
            ) : (
              historyData.map((history) => (
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
              ))
            )}
          </View>
        </View>
      </View>

      {/* Navigation Buttons */}
      <View style={styles.navigationButtons}>
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
  editInput: {
    borderWidth: 1,
    borderColor: '#C8E6C9',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: '#F8F9FA',
  },
  editButtonsContainer: {
    marginBottom: 20,
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: '#E8F5E9',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4CAF50',
    flex: 1,
    marginLeft: 8,
  },
  cancelButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
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
  emptyHistory: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyHistoryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptyHistorySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
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
