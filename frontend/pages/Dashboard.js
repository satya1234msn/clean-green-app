import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import StatCard from '../components/StatCard';
import Card from '../components/Card';
import Button from '../components/Button';
import CandlestickChart from '../components/CandlestickChart';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function Dashboard({ navigation }) {
  const [currentAddress] = useState('123 Main St, City, State 12345');
  
  // placeholder data
  const stats = [
    { label: 'Submit', value: '24', icon: '📤', color: '#4CAF50' },
    { label: 'Email', value: '24', icon: '📧', color: '#2196F3' },
  ];

  const recentContributions = [
    { type: 'Accepted', status: 'upward', date: '2 days ago', points: '+150' },
    { type: 'Rejected', status: 'downward', date: '1 week ago', points: '0' },
  ];

  const awardsReceived = [
    { type: 'Awards', status: 'upward', title: 'Eco Warrior Badge', date: '2 days ago' },
    { type: 'Received', status: 'upward', title: 'Green Champion', date: '1 week ago' },
  ];

  const detailedHistory = [
    { date: 'Jan 15, 2024', action: 'Submitted 2.5kg plastic waste', points: '+150', status: 'accepted' },
    { date: 'Jan 12, 2024', action: 'Scheduled pickup', points: '+50', status: 'accepted' },
    { date: 'Jan 10, 2024', action: 'Earned Eco Warrior badge', points: '+200', status: 'accepted' },
    { date: 'Jan 8, 2024', action: 'Submitted 1.8kg plastic waste', points: '+120', status: 'accepted' },
    { date: 'Jan 5, 2024', action: 'Submitted 3.2kg plastic waste', points: '+180', status: 'accepted' },
  ];

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
    alert('View more history feature coming soon!');
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
        <CandlestickChart />

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
