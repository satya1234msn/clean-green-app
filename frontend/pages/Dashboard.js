import React, { useState, useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Alert } from 'react-native';
import StatCard from '../components/StatCard';
import Card from '../components/Card';
import Button from '../components/Button';
import LineChart from '../components/LineChart';
import { userAPI, addressAPI, pickupAPI } from '../services/apiService';
import { authService } from '../services/authService';

const { width } = Dimensions.get('window');

export default function Dashboard({ navigation }) {
  const [currentAddress, setCurrentAddress] = useState('Loading...');
  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userPickups, setUserPickups] = useState([]);
  const [envTrendData, setEnvTrendData] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      loadDashboardData();
    }
  }, [isFocused]);

  // Recompute contribution trend whenever pickups change
  useEffect(() => {
    if (userPickups && userPickups.length) {
      setEnvTrendData(computeDailyPlasticTrend(userPickups, 14));
    } else {
      setEnvTrendData([]);
    }
  }, [userPickups]);

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
      }

      // Get user addresses
      const addressesResponse = await addressAPI.getAddresses();
      if (addressesResponse.status === 'success') {
        setAddresses(addressesResponse.data);

        // Find default address
        const defaultAddr = addressesResponse.data.find(addr => addr.isDefault);
        if (defaultAddr) {
          setCurrentAddress(defaultAddr.fullAddress || 'No address set');
        } else if (addressesResponse.data.length > 0) {
          // If no default, use first address
          setCurrentAddress(addressesResponse.data[0].fullAddress || 'No address set');
        } else {
          setCurrentAddress('No address set');
        }
      }

      // Load user's pickups for detailed history
      try {
        const pickupsRes = await pickupAPI.getUserPickups('all');
        if (pickupsRes.status === 'success') {
          setUserPickups(pickupsRes.data.pickups || []);
        }
      } catch (e) {
        // ignore history errors but keep dashboard
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
      Alert.alert('Error', 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Compute plastic bottles submitted per day over last N days
  const computeDailyPlasticTrend = (pickups = [], days = 14) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - (days - 1));
    const dayKey = (d) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;

    const series = {};
    for (let i = 0; i < days; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      series[dayKey(d)] = 0;
    }

    pickups.forEach(p => {
      const created = new Date(p.createdAt);
      if (created >= start && created <= end) {
        const key = dayKey(created);
        const bottles = Number(p?.wasteDetails?.bottles) || (p.wasteType === 'bottles' ? 1 : 0);
        series[key] = (series[key] || 0) + bottles;
      }
    });

    return Object.entries(series).map(([k, v]) => ({ label: k.slice(5), value: v }));
  };

  // Compute total points fallback if backend doesn't provide
  const computedTotalPoints = (userPickups || []).reduce((sum, p) => sum + (Number(p.points) || 0), 0);

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
      value: (
        dashboardData?.stats?.totalPoints != null
          ? String(dashboardData.stats.totalPoints)
          : String(computedTotalPoints)
      ),
      icon: '⭐',
      color: '#FF9800'
    },
  ];

  // Recent contributions: latest accepted
  const latestAccepted = (userPickups || []).filter(p => p.status === 'accepted' || p.status === 'completed').sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt))[0];
  const recentContributions = latestAccepted ? [{
    type: 'Accepted',
    status: 'upward',
    date: new Date(latestAccepted.createdAt).toLocaleDateString(),
    points: `+${latestAccepted.points || 0}`
  }] : [];

  // Awards section removed per request

  // Detailed history from pickups
  const detailedHistory = (userPickups || []).slice(0, 5).map(p => ({
    date: new Date(p.createdAt).toLocaleString(),
    action: `Submitted ${p.wasteType} waste${p.priority === 'scheduled' ? ` (Scheduled ${p.scheduledTime || ''})` : ''}`,
    points: p.points ? `+${p.points}` : '0',
    status: p.status
  }));

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
    navigation.navigate('ScheduledPage');
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
                { color: contribution.status === 'upward' ? '#4CAF50' : '#f44336' }
              ]}>
                {contribution.status === 'upward' ? '↗️' : '↘️'}
              </Text>
            </View>
          ))}
        </Card>

        {/* Awards section removed */}

        {/* Environmental Contribution (plastic bottles per day) */}
        <LineChart
          data={envTrendData?.length ? envTrendData : [
            { label: 'D-6', value: 0 },
            { label: 'D-5', value: 0 },
            { label: 'D-4', value: 0 },
            { label: 'D-3', value: 0 },
            { label: 'D-2', value: 0 },
            { label: 'D-1', value: 0 },
            { label: 'Today', value: 0 },
          ]}
          title="Plastic submitted per day"
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
                { color: item.status === 'accepted' ? '#4CAF50' : '#f44336' }
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
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
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
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIconText: {
    fontSize: 24,
    color: '#333',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 12,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  editAddressText: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    backgroundColor: '#4CAF50',
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
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16
  },
  contributionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  contributionType: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
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
    borderBottomColor: '#f0f0f0',
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
    color: '#333',
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
    borderBottomColor: '#f0f0f0',
  },
  historyDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  historyAction: {
    fontSize: 16,
    color: '#333',
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
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  supportContainer: {
    marginBottom: 20,
  },
  supportButton: {
    backgroundColor: '#4CAF50',
  },
});
