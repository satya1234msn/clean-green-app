import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Card from '../components/Card';
import StatCard from '../components/StatCard';

export default function DeliveryEarnings({ navigation }) {
  const [earnings] = useState([
    { id: '1', date: '2024-01-15', pickups: 8, amount: 120, status: 'Paid' },
    { id: '2', date: '2024-01-14', pickups: 6, amount: 90, status: 'Paid' },
    { id: '3', date: '2024-01-13', pickups: 10, amount: 150, status: 'Paid' },
    { id: '4', date: '2024-01-12', pickups: 7, amount: 105, status: 'Pending' },
    { id: '5', date: '2024-01-11', pickups: 9, amount: 135, status: 'Paid' },
  ]);

  const totalEarnings = earnings.reduce((sum, earning) => sum + earning.amount, 0);
  const totalPickups = earnings.reduce((sum, earning) => sum + earning.pickups, 0);
  const pendingAmount = earnings.filter(e => e.status === 'Pending').reduce((sum, earning) => sum + earning.amount, 0);

  const handleWithdraw = () => {
    // In a real app, this would open a withdrawal form
    alert('Withdrawal feature coming soon!');
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
            <Text style={styles.headerTitle}>Earnings 💰</Text>
            <Text style={styles.headerSubtitle}>Track your income</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Summary Cards */}
        <View style={styles.summaryCards}>
          <StatCard 
            title="Total Earnings" 
            value={`$${totalEarnings}`} 
            icon="💰"
            color="#28A745"
          />
          <StatCard 
            title="This Week" 
            value="$465" 
            icon="📅"
            color="#00C897"
          />
          <StatCard 
            title="Total Pickups" 
            value={totalPickups.toString()} 
            icon="📦"
            color="#FFB703"
          />
          <StatCard 
            title="Pending" 
            value={`$${pendingAmount}`} 
            icon="⏳"
            color="#FF6B6B"
          />
        </View>

        {/* Withdraw Section */}
        <Card style={styles.withdrawCard}>
          <Text style={styles.sectionTitle}>Available Balance</Text>
          <Text style={styles.balanceAmount}>${totalEarnings - pendingAmount}</Text>
          <Text style={styles.balanceSubtext}>Ready for withdrawal</Text>
          <TouchableOpacity style={styles.withdrawButton} onPress={handleWithdraw}>
            <Text style={styles.withdrawButtonText}>Withdraw Funds</Text>
          </TouchableOpacity>
        </Card>

        {/* Earnings History */}
        <Card style={styles.historyCard}>
          <Text style={styles.sectionTitle}>Earnings History</Text>
          {earnings.map((earning) => (
            <View key={earning.id} style={styles.earningItem}>
              <View style={styles.earningInfo}>
                <Text style={styles.earningDate}>{earning.date}</Text>
                <Text style={styles.earningPickups}>{earning.pickups} pickups</Text>
              </View>
              <View style={styles.earningAmount}>
                <Text style={styles.amountValue}>${earning.amount}</Text>
                <View style={[
                  styles.statusBadge, 
                  { backgroundColor: earning.status === 'Paid' ? '#28A745' : '#FFB703' }
                ]}>
                  <Text style={styles.statusText}>{earning.status}</Text>
                </View>
              </View>
            </View>
          ))}
        </Card>

        {/* Payment Info */}
        <Card style={styles.paymentCard}>
          <Text style={styles.sectionTitle}>Payment Information</Text>
          <View style={styles.paymentItem}>
            <Text style={styles.paymentLabel}>Payment Method:</Text>
            <Text style={styles.paymentValue}>Bank Transfer</Text>
          </View>
          <View style={styles.paymentItem}>
            <Text style={styles.paymentLabel}>Account:</Text>
            <Text style={styles.paymentValue}>****1234</Text>
          </View>
          <View style={styles.paymentItem}>
            <Text style={styles.paymentLabel}>Next Payment:</Text>
            <Text style={styles.paymentValue}>Every Friday</Text>
          </View>
          <TouchableOpacity style={styles.editPaymentButton}>
            <Text style={styles.editPaymentText}>Edit Payment Info</Text>
          </TouchableOpacity>
        </Card>
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
  summaryCards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
    marginBottom: 16,
  },
  withdrawCard: {
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 24,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: '800',
    color: '#28A745',
    marginBottom: 8,
  },
  balanceSubtext: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  withdrawButton: {
    backgroundColor: '#28A745',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 25,
  },
  withdrawButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  historyCard: {
    marginBottom: 20,
  },
  earningItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  earningInfo: {
    flex: 1,
  },
  earningDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
    marginBottom: 4,
  },
  earningPickups: {
    fontSize: 14,
    color: '#666',
  },
  earningAmount: {
    alignItems: 'flex-end',
  },
  amountValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#28A745',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  paymentCard: {
    marginBottom: 20,
  },
  paymentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  paymentLabel: {
    fontSize: 16,
    color: '#666',
  },
  paymentValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  editPaymentButton: {
    marginTop: 16,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  editPaymentText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#006C67',
  },
});

