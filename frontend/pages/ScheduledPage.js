import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { pickupAPI } from '../services/apiService';

export default function ScheduledPage({ navigation }) {
  const [activeTab, setActiveTab] = useState('scheduled');
  const [liveSchedules, setLiveSchedules] = useState([]);
  const [scheduledHistory, setScheduledHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    try {
      setLoading(true);

      // Get live schedules (awaiting_agent, accepted, in_progress)
      const liveResponse = await pickupAPI.getUserPickups('all');
      if (liveResponse.status === 'success') {
        const all = liveResponse.data.pickups || [];
        setLiveSchedules(all.filter(p => ['awaiting_agent', 'accepted', 'in_progress'].includes(p.status)));
      }

      // Get history (completed and admin_rejected)
      const historyResponse = await pickupAPI.getUserPickups('all');
      if (historyResponse.status === 'success') {
        const all = historyResponse.data.pickups || [];
        setScheduledHistory(all.filter(p => ['completed', 'admin_rejected', 'cancelled'].includes(p.status)));
      }
    } catch (error) {
      console.error('Error loading schedules:', error);
      Alert.alert('Error', 'Failed to load schedules');
    } finally {
      setLoading(false);
    }
  };

  const handleProfile = () => {
    navigation.navigate('Profile');
  };

  const handleViewSchedule = (schedule) => {
    Alert.alert('Schedule Details', `Type: ${schedule.type}\nWeight: ${schedule.weight}\nTime: ${schedule.time}`);
  };

  const handleViewHistory = (history) => {
    Alert.alert('History Details', `Type: ${history.type}\nWeight: ${history.weight}\nDate: ${history.date}\nStatus: ${history.status}`);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.profileIcon} onPress={handleProfile}>
          <Text style={styles.profileIconText}>👤</Text>
        </TouchableOpacity>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'scheduled' && styles.activeTab]}
            onPress={() => setActiveTab('scheduled')}
          >
            <Text style={[styles.tabText, activeTab === 'scheduled' && styles.activeTabText]}>
              Scheduled
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        {/* Live Schedules Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Live schedules</Text>
          {loading ? (
            <Text style={styles.loadingText}>Loading schedules...</Text>
          ) : liveSchedules.length > 0 ? (
            liveSchedules.map((schedule) => (
              <View key={schedule._id || schedule.id} style={styles.scheduleCard}>
                <View style={styles.scheduleInfo}>
                  <Text style={styles.scheduleType}>{schedule.wasteType || schedule.type}</Text>
                  <Text style={styles.scheduleWeight}>Weight: {schedule.weight} kg</Text>
                  <Text style={styles.scheduleTime}>
                    {schedule.scheduledDate ? new Date(schedule.scheduledDate).toLocaleDateString() : schedule.time}
                  </Text>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: schedule.status === 'Confirmed' || schedule.status === 'accepted' ? '#4CAF50' : '#FF5722' }
                  ]}>
                    <Text style={styles.statusText}>{schedule.status || 'Pending'}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.viewButton}
                  onPress={() => handleViewSchedule(schedule)}
                >
                  <Text style={styles.viewButtonText}>view</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No live schedules found</Text>
          )}
        </View>

        {/* Scheduled History Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Scheduled history</Text>
          {loading ? (
            <Text style={styles.loadingText}>Loading history...</Text>
          ) : scheduledHistory.length > 0 ? (
            <View style={styles.historyContainer}>
              {scheduledHistory.map((history) => (
                <TouchableOpacity
                  key={history._id || history.id}
                  style={styles.historyItem}
                  onPress={() => handleViewHistory(history)}
                >
                  <View style={styles.historyInfo}>
                    <Text style={styles.historyType}>{history.wasteType || history.type}</Text>
                    <Text style={styles.historyWeight}>{history.weight} kg</Text>
                    <Text style={styles.historyDate}>
                      {history.scheduledDate ? new Date(history.scheduledDate).toLocaleDateString() : history.date}
                    </Text>
                  </View>
                  <View style={[
                    styles.historyStatus,
                    { backgroundColor: history.status === 'Completed' || history.status === 'completed' ? '#4CAF50' : '#FF5722' }
                  ]}>
                    <Text style={styles.historyStatusText}>{history.status || 'Unknown'}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Text style={styles.emptyText}>No history found</Text>
          )}
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>crafted with love toward india</Text>
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
  profileIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIconText: {
    fontSize: 24,
    color: '#2E7D32',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#E8F5E9',
    borderRadius: 20,
    padding: 4,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  activeTab: {
    backgroundColor: '#4CAF50',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1B5E20',
    marginBottom: 12,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    padding: 20,
    fontStyle: 'italic',
  },
  scheduleCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  scheduleInfo: {
    flex: 1,
  },
  scheduleType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1B5E20',
    marginBottom: 4,
  },
  scheduleWeight: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  scheduleTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  viewButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
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
  historyStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  historyStatusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
});
