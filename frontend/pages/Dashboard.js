import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Alert } from 'react-native';
import StatCard from '../components/StatCard';
import Card from '../components/Card';
import Button from '../components/Button';
import LineChart from '../components/LineChart';
import { LinearGradient } from 'expo-linear-gradient';
import { userAPI } from '../services/apiService';
import { authService } from '../services/authService';

const { width } = Dimensions.get('window');

export default function Dashboard({ navigation }) {
  const [currentAddress, setCurrentAddress] = useState('Loading...');
  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      
      // Get dashboard data
      const response = await userAPI.getDashboard();
      
      if (response.status === 'success') {
        setDashboardData(response.data);
        
        // Set current address
        if (currentUser?.defaultAddress) {
          setCurrentAddress(currentUser.defaultAddress.fullAddress || 'No address set');
        }
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
      Alert.alert('Error', 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Stats based on dashboard data
  const stats = [
    { 
      label: 'Total Pickups', 
      value: dashboardData?.stats?.totalPickups?.toString() || '0', 
      icon: '📤', 
      color: '#4CAF50' 
    },
    { 
      label: 'Total Points', 
      value: dashboardData?.stats?.totalPoints?.toString() || '0', 
      icon: '⭐', 
      color: '#FF9800' 
    },
  ];

  // Recent contributions from dashboard data
  const recentContributions = [
    dashboardData?.recentUploads?.accepted ? {
      type: 'Accepted',
      status: 'upward',
      date: new Date(dashboardData.recentUploads.accepted.createdAt).toLocaleDateString(),
      points: `+${dashboardData.recentUploads.accepted.points || 0}`
    } : null,
    dashboardData?.recentUploads?.rejected ? {
      type: 'Rejected',
      status: 'downward',
      date: new Date(dashboardData.recentUploads.rejected.createdAt).toLocaleDateString(),
      points: '0'
    } : null
  ].filter(Boolean);

  // Awards from dashboard data
  const awardsReceived = dashboardData?.rewards?.map(reward => ({
    type: 'Awards',
    status: 'upward',
    title: reward.title,
    date: new Date(reward.issuedDate).toLocaleDateString()
  })) || [];

  // Detailed history from dashboard data
  const detailedHistory = dashboardData?.recentUploads ? [
    dashboardData.recentUploads.accepted ? {
      date: new Date(dashboardData.recentUploads.accepted.createdAt).toLocaleDateString(),
      action: `Submitted ${dashboardData.recentUploads.accepted.wasteType} waste`,
      points: `+${dashboardData.recentUploads.accepted.points || 0}`,
      status: 'accepted'
    } : null,
    dashboardData.recentUploads.rejected ? {
      date: new Date(dashboardData.recentUploads.rejected.createdAt).toLocaleDateString(),
      action: `Submitted ${dashboardData.recentUploads.rejected.wasteType} waste`,
      points: '0',
      status: 'rejected'
    } : null
  ].filter(Boolean) : [];

  const handleUpload = () => {
    navigation.navigate('WasteUploadNew');
  };

  const handleSchedule = () => {
    navigation.navigate('ScheduledPage');
  };

  const handleProfile = () => {
    navigation.navigate('Profile');
  };

  const handleEditAddress = () => {
    navigation.navigate('AddressManagement');
  };

  const handleSupport = () => {
    navigation.navigate('Support');
  };

  const handleMoreHistory = () => {
    // Navigate to a detailed history page or show more history
    Alert.alert('History', 'Detailed history feature coming soon!');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity style={styles.profileIcon} onPress={handleProfile}>
              <Text style={styles.profileIconText}>👤</Text>
            </TouchableOpacity>
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.headerButton} onPress={handleUpload}>
                <Text style={styles.headerButtonText}>Upload</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton} onPress={handleSchedule}>
                <Text style={styles.headerButtonText}>Schedule</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity style={styles.addressContainer} onPress={handleEditAddress}>
            <Text style={styles.addressText}>{currentAddress}</Text>
            <Text style={styles.editAddressText}>→</Text>
          </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Stats Row */}
        <View style={styles.statRow}>
          {stats.map((s, i) => (
            <StatCard key={i} label={s.label} value={s.value} icon={s.icon} color={s.color} />
          ))}
        </View>

        {/* Recent Contribution */}
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Recent Contribution</Text>
          {recentContributions.map((contribution, index) => (
            <View key={index} style={styles.contributionItem}>
              <Text style={styles.contributionType}>{contribution.type}</Text>
              <Text style={styles.contributionDate}>{contribution.date}</Text>
              <Text style={[
                styles.contributionArrow,
                { color: contribution.status === 'upward' ? '#4CAF50' : '#F44336' }
              ]}>
                {contribution.status === 'upward' ? '↗️' : '↘️'}
              </Text>
            </View>
          ))}
        </Card>

        {/* Awards Received */}
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Awards Received</Text>
          {awardsReceived.map((award, index) => (
            <View key={index} style={styles.awardItem}>
              <Text style={styles.awardType}>{award.type}</Text>
              <Text style={styles.awardTitle}>{award.title}</Text>
              <Text style={styles.awardDate}>{award.date}</Text>
              <Text style={[styles.awardArrow, { color: '#4CAF50' }]}>↗️</Text>
            </View>
          ))}
        </Card>

        {/* Candlestick Chart */}
        <LineChart 
          data={[
            { label: 'Mon', value: 12 },
            { label: 'Tue', value: 16 },
            { label: 'Wed', value: 18 },
            { label: 'Thu', value: 20 },
            { label: 'Fri', value: 23 },
            { label: 'Sat', value: 26 },
            { label: 'Sun', value: 28 },
          ]}
          title="Waste Contribution Trend"
        />

        {/* Detailed History */}
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Detailed History</Text>
          {detailedHistory.map((item, index) => (
            <View key={index} style={styles.historyItem}>
              <Text style={styles.historyDate}>{item.date}</Text>
              <Text style={styles.historyAction}>{item.action}</Text>
              <Text style={[
                styles.historyPoints,
                { color: item.status === 'accepted' ? '#4CAF50' : '#F44336' }
              ]}>
                {item.points}
              </Text>
            </View>
          ))}
          <TouchableOpacity onPress={handleMoreHistory} style={styles.moreButton}>
            <Text style={styles.moreButtonText}>More</Text>
          </TouchableOpacity>
        </Card>

        {/* Support Button */}
        <View style={styles.supportContainer}>
          <Button 
            title="Support" 
            onPress={handleSupport}
            style={styles.supportButton}
          />
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
    backgroundColor: '#fff', // White header
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E8F5E9', // Light Green
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIconText: {
    fontSize: 24,
    color: '#2E7D32', // Dark Green
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 12,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#C8E6C9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  addressText: {
    fontSize: 14,
    color: '#666', // Gray Text
    flex: 1,
  },
  editAddressText: {
    fontSize: 16,
    color: '#2E7D32', // Dark Green
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    backgroundColor: '#4CAF50', // Primary Green
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginLeft: 8,
  },
  headerButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    padding: 20,
    paddingTop: 20,
  },
  statRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 20 
  },
  sectionCard: {
    marginBottom: 20,
    backgroundColor: '#fff', // White card background
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#1B5E20', // Deep Green
    marginBottom: 16
  },
  contributionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  contributionType: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  contributionDate: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  contributionArrow: {
    fontSize: 18,
  },
  awardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  awardType: {
    fontSize: 14,
    color: '#666',
    width: 60,
  },
  awardTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
    marginLeft: 8,
  },
  awardDate: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  awardArrow: {
    fontSize: 18,
  },
  historyItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  historyDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32', // Dark Green
    marginBottom: 4,
  },
  historyAction: {
    fontSize: 16,
    color: '#1B5E20', // Deep Green
    marginBottom: 2,
  },
  historyPoints: {
    fontSize: 14,
    fontWeight: '600',
  },
  moreButton: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 8,
  },
  moreButtonText: {
    color: '#2E7D32', // Dark Green
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  supportContainer: {
    marginBottom: 20,
  },
  supportButton: {
    backgroundColor: '#4CAF50', // Primary Green
  },
});
