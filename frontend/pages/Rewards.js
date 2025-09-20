import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import Card from '../components/Card';
import Button from '../components/Button';
import { LinearGradient } from 'expo-linear-gradient';

const coupons = [
  { 
    id: 1,
    code: 'ZOMATO50', 
    partner: 'Zomato', 
    discount: '50% off',
    expiry: '2025-12-31',
    minOrder: '₹200',
    redeemed: false,
    icon: '🍕'
  },
  { 
    id: 2,
    code: 'SWIGGY20', 
    partner: 'Swiggy', 
    discount: '20% off',
    expiry: '2025-11-30',
    minOrder: '₹150',
    redeemed: false,
    icon: '🍔'
  },
  { 
    id: 3,
    code: 'ECO10', 
    partner: 'EcoStore', 
    discount: '10% off',
    expiry: '2025-09-30',
    minOrder: '₹100',
    redeemed: true,
    icon: '🌱'
  }
];

const availableRewards = [
  { points: 100, reward: '₹10 Zomato Cash', icon: '🍕' },
  { points: 200, reward: '₹20 Swiggy Cash', icon: '🍔' },
  { points: 500, reward: '₹50 Amazon Pay', icon: '📦' },
  { points: 1000, reward: '₹100 Paytm Cash', icon: '💰' },
];

export default function Rewards({ navigation }) {
  const [userPoints] = useState(1420);
  const [couponsList, setCouponsList] = useState(coupons);

  const redeemCoupon = (coupon) => {
    Alert.alert(
      'Redeem Coupon',
      `Use ${coupon.code} on ${coupon.partner} for ${coupon.discount} (min order: ${coupon.minOrder})`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Copy Code', 
          onPress: () => {
            // In a real app, you'd copy to clipboard
            Alert.alert('Copied!', `Coupon code ${coupon.code} copied to clipboard`);
          }
        }
      ]
    );
  };

  const redeemPoints = (reward) => {
    if (userPoints >= reward.points) {
      Alert.alert(
        'Redeem Points',
        `Redeem ${reward.points} points for ${reward.reward}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Redeem', 
            onPress: () => {
              Alert.alert('Success!', `You've redeemed ${reward.reward}`);
            }
          }
        ]
      );
    } else {
      Alert.alert('Insufficient Points', `You need ${reward.points} points to redeem this reward.`);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient colors={['#00C897', '#006C67']} style={styles.header}>
        <Text style={styles.headerTitle}>Rewards & Coupons 🎁</Text>
        <Text style={styles.headerSubtitle}>Your eco-friendly rewards</Text>
      </LinearGradient>

      <View style={styles.content}>
        {/* Points Wallet */}
        <Card style={styles.walletCard}>
          <View style={styles.walletHeader}>
            <Text style={styles.walletTitle}>Your Points Wallet</Text>
            <Text style={styles.walletIcon}>⭐</Text>
          </View>
          <Text style={styles.pointsValue}>{userPoints.toLocaleString()}</Text>
          <Text style={styles.pointsLabel}>Available Points</Text>
          <View style={styles.pointsProgress}>
            <View style={[styles.progressBar, { width: '71%' }]} />
          </View>
          <Text style={styles.progressText}>71% to next reward tier</Text>
        </Card>

        {/* Available Rewards */}
        <Card style={styles.rewardsCard}>
          <Text style={styles.sectionTitle}>Redeem Points</Text>
          <View style={styles.rewardsGrid}>
            {availableRewards.map((reward, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.rewardItem,
                  userPoints >= reward.points ? styles.availableReward : styles.lockedReward
                ]}
                onPress={() => redeemPoints(reward)}
              >
                <Text style={styles.rewardIcon}>{reward.icon}</Text>
                <Text style={styles.rewardPoints}>{reward.points} pts</Text>
                <Text style={[
                  styles.rewardText,
                  userPoints >= reward.points ? styles.availableText : styles.lockedText
                ]}>
                  {reward.reward}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Coupons Section */}
        <View style={styles.couponsSection}>
          <Text style={styles.sectionTitle}>Your Coupons</Text>
          <Text style={styles.couponsCount}>
            {couponsList.filter(c => !c.redeemed).length} active coupons
          </Text>
        </View>

        <FlatList
          data={couponsList}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <Card style={[
              styles.couponCard,
              item.redeemed && styles.redeemedCoupon
            ]}>
              <View style={styles.couponHeader}>
                <View style={styles.couponInfo}>
                  <Text style={styles.couponIcon}>{item.icon}</Text>
                  <View>
                    <Text style={styles.couponPartner}>{item.partner}</Text>
                    <Text style={styles.couponDiscount}>{item.discount}</Text>
                  </View>
                </View>
                <View style={[
                  styles.couponStatus,
                  { backgroundColor: item.redeemed ? '#FFE6E6' : '#E8F5E8' }
                ]}>
                  <Text style={[
                    styles.couponStatusText,
                    { color: item.redeemed ? '#D63384' : '#006C67' }
                  ]}>
                    {item.redeemed ? 'Used' : 'Active'}
                  </Text>
                </View>
              </View>
              
              <View style={styles.couponDetails}>
                <Text style={styles.couponCode}>{item.code}</Text>
                <Text style={styles.couponExpiry}>Expires: {item.expiry}</Text>
                <Text style={styles.couponMinOrder}>Min order: {item.minOrder}</Text>
              </View>

              {!item.redeemed && (
                <TouchableOpacity style={styles.redeemButton} onPress={() => redeemCoupon(item)}>
                  <Button title="Redeem Now" style={styles.redeemButtonInner} />
                </TouchableOpacity>
              )}
            </Card>
          )}
        />
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
    marginBottom: 8,
  },
  walletCard: {
    marginBottom: 20,
    alignItems: 'center',
  },
  walletHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  walletTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
    marginRight: 8,
  },
  walletIcon: {
    fontSize: 20,
  },
  pointsValue: {
    fontSize: 36,
    fontWeight: '800',
    color: '#00C897',
    marginBottom: 4,
  },
  pointsLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  pointsProgress: {
    width: '100%',
    height: 8,
    backgroundColor: '#E9ECEF',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#00C897',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
  },
  rewardsCard: {
    marginBottom: 20,
  },
  rewardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  rewardItem: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
  },
  availableReward: {
    backgroundColor: '#F0F9F7',
    borderColor: '#00C897',
  },
  lockedReward: {
    backgroundColor: '#F8F9FA',
    borderColor: '#E9ECEF',
  },
  rewardIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  rewardPoints: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  rewardText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  availableText: {
    color: '#006C67',
  },
  lockedText: {
    color: '#999',
  },
  couponsSection: {
    marginBottom: 16,
  },
  couponsCount: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  couponCard: {
    marginBottom: 16,
  },
  redeemedCoupon: {
    opacity: 0.6,
  },
  couponHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  couponInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  couponIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  couponPartner: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },
  couponDiscount: {
    fontSize: 14,
    color: '#00C897',
    fontWeight: '600',
  },
  couponStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  couponStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  couponDetails: {
    marginBottom: 12,
  },
  couponCode: {
    fontSize: 18,
    fontWeight: '800',
    color: '#222',
    marginBottom: 4,
    fontFamily: 'monospace',
  },
  couponExpiry: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  couponMinOrder: {
    fontSize: 14,
    color: '#666',
  },
  redeemButton: {
    marginTop: 8,
  },
  redeemButtonInner: {
    width: '100%',
  },
});
