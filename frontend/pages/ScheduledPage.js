import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { pickupAPI } from '../services/apiService';

export default function ScheduledPage({ navigation }) {
  const [activeTab, setActiveTab] = useState('upload');
  const [liveSchedules, setLiveSchedules] = useState([]);
  const [scheduledHistory, setScheduledHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    try {
      setLoading(true);
      
      // Get live schedules (pending and accepted)
      const liveResponse = await pickupAPI.getUserPickups('live');
      if (liveResponse.status === 'success') {
        setLiveSchedules(liveResponse.data.pickups || []);
      }

      // Get history (completed and rejected)
      const historyResponse = await pickupAPI.getUserPickups('history');
      if (historyResponse.status === 'success') {
        setScheduledHistory(historyResponse.data.pickups || []);
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
            style={[styles.tab, activeTab === 'upload' && styles.activeTab]} 
            onPress={() => setActiveTab('upload')}
          >
            <Text style={[styles.tabText, activeTab === 'upload' && styles.activeTabText]}>
              upload page
            </Text>
          </TouchableOpacity>
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
        {activeTab === 'upload' ? (
          /* Upload Page Content */
          <View style={styles.uploadContent}>
            <View style={styles.uploadHeader}>
              <Text style={styles.uploadTitle}>Upload Your Waste</Text>
              <Text style={styles.uploadSubtitle}>Help us keep the environment clean</Text>
            </View>
            
            {/* Stock Market Style Graph */}
            <View style={styles.graphSection}>
              <Text style={styles.graphTitle}>Waste Collection Trends</Text>
              <View style={styles.stockGraph}>
                <View style={styles.graphContainer}>
                  <View style={styles.yAxis}>
                    <Text style={styles.yLabel}>100</Text>
                    <Text style={styles.yLabel}>80</Text>
                    <Text style={styles.yLabel}>60</Text>
                    <Text style={styles.yLabel}>40</Text>
                    <Text style={styles.yLabel}>20</Text>
                    <Text style={styles.yLabel}>0</Text>
                  </View>
                  <View style={styles.chartArea}>
                    <View style={styles.candlestickChart}>
                      {/* Candlestick bars */}
                      <View style={[styles.candlestick, styles.bullish, { height: 60, marginLeft: 10 }]}>
                        <View style={styles.candlestickBody}></View>
                        <View style={styles.candlestickWick}></View>
                      </View>
                      <View style={[styles.candlestick, styles.bearish, { height: 40, marginLeft: 30 }]}>
                        <View style={styles.candlestickBody}></View>
                        <View style={styles.candlestickWick}></View>
                      </View>
                      <View style={[styles.candlestick, styles.bullish, { height: 80, marginLeft: 50 }]}>
                        <View style={styles.candlestickBody}></View>
                        <View style={styles.candlestickWick}></View>
                      </View>
                      <View style={[styles.candlestick, styles.bearish, { height: 30, marginLeft: 70 }]}>
                        <View style={styles.candlestickBody}></View>
                        <View style={styles.candlestickWick}></View>
                      </View>
                      <View style={[styles.candlestick, styles.bullish, { height: 70, marginLeft: 90 }]}>
                        <View style={styles.candlestickBody}></View>
                        <View style={styles.candlestickWick}></View>
                      </View>
                    </View>
                    <View style={styles.xAxis}>
                      <Text style={styles.xLabel}>Jan</Text>
                      <Text style={styles.xLabel}>Feb</Text>
                      <Text style={styles.xLabel}>Mar</Text>
                      <Text style={styles.xLabel}>Apr</Text>
                      <Text style={styles.xLabel}>May</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* Upload Actions */}
            <View style={styles.uploadActions}>
              <TouchableOpacity 
                style={styles.uploadButton}
                onPress={() => navigation.navigate('WasteUploadNew')}
              >
                <Text style={styles.uploadButtonText}>📤 Upload Waste</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.scheduleButton}
                onPress={() => setActiveTab('scheduled')}
              >
                <Text style={styles.scheduleButtonText}>📅 View Schedule</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          /* Live Schedules Section */
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Live schedules</Text>
            {liveSchedules.map((schedule) => (
              <View key={schedule.id} style={styles.scheduleCard}>
                <View style={styles.scheduleInfo}>
                  <Text style={styles.scheduleType}>{schedule.type}</Text>
                  <Text style={styles.scheduleWeight}>Weight: {schedule.weight}</Text>
                  <Text style={styles.scheduleTime}>Time: {schedule.time}</Text>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: schedule.status === 'Confirmed' ? '#4CAF50' : '#FF5722' }
                  ]}>
                    <Text style={styles.statusText}>{schedule.status}</Text>
                  </View>
                </View>
                <TouchableOpacity 
                  style={styles.viewButton} 
                  onPress={() => handleViewSchedule(schedule)}
                >
                  <Text style={styles.viewButtonText}>view</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Scheduled History Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Scheduled history</Text>
          <View style={styles.historyContainer}>
            {scheduledHistory.map((history) => (
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
                <View style={[
                  styles.historyStatus,
                  { backgroundColor: history.status === 'Completed' ? '#4CAF50' : '#FF5722' }
                ]}>
                  <Text style={styles.historyStatusText}>{history.status}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
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
  // Upload Page Styles
  uploadContent: {
    flex: 1,
  },
  uploadHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  uploadTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1B5E20',
    marginBottom: 8,
  },
  uploadSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  graphSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  graphTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1B5E20',
    marginBottom: 16,
    textAlign: 'center',
  },
  stockGraph: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 16,
  },
  graphContainer: {
    flexDirection: 'row',
    height: 200,
  },
  yAxis: {
    width: 30,
    justifyContent: 'space-between',
    paddingRight: 8,
  },
  yLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  chartArea: {
    flex: 1,
    position: 'relative',
  },
  candlestickChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 160,
    paddingBottom: 20,
  },
  candlestick: {
    width: 12,
    position: 'relative',
  },
  candlestickBody: {
    width: 12,
    borderRadius: 2,
    position: 'absolute',
    bottom: 0,
  },
  candlestickWick: {
    width: 2,
    backgroundColor: '#333',
    position: 'absolute',
    left: 5,
  },
  bullish: {
    backgroundColor: '#4CAF50',
  },
  bearish: {
    backgroundColor: '#F44336',
  },
  xAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  xLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  uploadActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  uploadButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  scheduleButton: {
    backgroundColor: '#E8F5E9',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  scheduleButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
  },
});

