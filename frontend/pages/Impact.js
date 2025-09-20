import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share, ScrollView, Alert } from 'react-native';
import Card from '../components/Card';
import Button from '../components/Button';
import { LinearGradient } from 'expo-linear-gradient';

export default function Impact({ navigation }) {
  const [selectedPeriod, setSelectedPeriod] = useState('all');

  const stats = {
    plasticKg: 28.4,
    co2Saved: 42.0,
    trees: 12,
    bottles: 156,
    bags: 89,
    containers: 45
  };

  const periodStats = {
    all: { plasticKg: 28.4, co2Saved: 42.0, trees: 12 },
    month: { plasticKg: 8.2, co2Saved: 12.1, trees: 3 },
    week: { plasticKg: 2.1, co2Saved: 3.1, trees: 1 }
  };

  const achievements = [
    { title: 'First Steps', description: 'Submitted your first waste', icon: '🌱', unlocked: true },
    { title: 'Eco Warrior', description: 'Reached 10kg milestone', icon: '⚔️', unlocked: true },
    { title: 'Green Champion', description: 'Saved 5 trees equivalent', icon: '🏆', unlocked: true },
    { title: 'Plastic Hero', description: 'Submit 50kg total', icon: '🦸', unlocked: false },
    { title: 'Climate Saver', description: 'Save 100kg CO₂', icon: '🌍', unlocked: false }
  ];

  const impactFacts = [
    { fact: '1 plastic bottle takes 450 years to decompose', icon: '⏰' },
    { fact: 'Recycling 1 ton of plastic saves 7.4 cubic yards of landfill space', icon: '🗑️' },
    { fact: 'Your 28.4kg saved 42kg of CO₂ emissions', icon: '🌱' },
    { fact: 'You helped save 12 trees from being cut down', icon: '🌳' }
  ];

  async function onShare() {
    try {
      const currentStats = periodStats[selectedPeriod];
      await Share.share({ 
        message: `I've helped collect ${currentStats.plasticKg}kg plastic and saved ${currentStats.co2Saved}kg CO₂! Join CleanGreen to make a difference. 🌱♻️` 
      });
    } catch (error) { /* ignore */ }
  }

  const getCurrentStats = () => periodStats[selectedPeriod];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient colors={['#00C897', '#006C67']} style={styles.header}>
        <Text style={styles.headerTitle}>Your Impact 🌱</Text>
        <Text style={styles.headerSubtitle}>Making a difference, one step at a time</Text>
      </LinearGradient>

      <View style={styles.content}>
        {/* Period Selector */}
        <Card style={styles.periodCard}>
          <Text style={styles.sectionTitle}>Time Period</Text>
          <View style={styles.periodSelector}>
            {[
              { key: 'week', label: 'This Week' },
              { key: 'month', label: 'This Month' },
              { key: 'all', label: 'All Time' }
            ].map((period) => (
              <TouchableOpacity
                key={period.key}
                style={[
                  styles.periodButton,
                  selectedPeriod === period.key && styles.selectedPeriodButton
                ]}
                onPress={() => setSelectedPeriod(period.key)}
              >
                <Text style={[
                  styles.periodButtonText,
                  selectedPeriod === period.key && styles.selectedPeriodButtonText
                ]}>
                  {period.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Main Impact Stats */}
        <Card style={styles.statsCard}>
          <Text style={styles.sectionTitle}>Environmental Impact</Text>
          <View style={styles.mainStats}>
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>♻️</Text>
              <Text style={styles.statValue}>{getCurrentStats().plasticKg} kg</Text>
              <Text style={styles.statLabel}>Plastic Recycled</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>🌱</Text>
              <Text style={styles.statValue}>{getCurrentStats().co2Saved} kg</Text>
              <Text style={styles.statLabel}>CO₂ Saved</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>🌳</Text>
              <Text style={styles.statValue}>{getCurrentStats().trees}</Text>
              <Text style={styles.statLabel}>Trees Saved</Text>
            </View>
          </View>
        </Card>

        {/* Detailed Breakdown */}
        <Card style={styles.breakdownCard}>
          <Text style={styles.sectionTitle}>Waste Breakdown</Text>
          <View style={styles.breakdownStats}>
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownIcon}>🍼</Text>
              <Text style={styles.breakdownValue}>{stats.bottles}</Text>
              <Text style={styles.breakdownLabel}>Bottles</Text>
            </View>
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownIcon}>🛍️</Text>
              <Text style={styles.breakdownValue}>{stats.bags}</Text>
              <Text style={styles.breakdownLabel}>Bags</Text>
            </View>
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownIcon}>📦</Text>
              <Text style={styles.breakdownValue}>{stats.containers}</Text>
              <Text style={styles.breakdownLabel}>Containers</Text>
            </View>
          </View>
        </Card>

        {/* Achievements */}
        <Card style={styles.achievementsCard}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.achievementsList}>
            {achievements.map((achievement, index) => (
              <View key={index} style={[
                styles.achievementItem,
                !achievement.unlocked && styles.lockedAchievement
              ]}>
                <Text style={[
                  styles.achievementIcon,
                  !achievement.unlocked && styles.lockedIcon
                ]}>
                  {achievement.icon}
                </Text>
                <View style={styles.achievementInfo}>
                  <Text style={[
                    styles.achievementTitle,
                    !achievement.unlocked && styles.lockedText
                  ]}>
                    {achievement.title}
                  </Text>
                  <Text style={[
                    styles.achievementDescription,
                    !achievement.unlocked && styles.lockedText
                  ]}>
                    {achievement.description}
                  </Text>
                </View>
                {achievement.unlocked && (
                  <Text style={styles.unlockedBadge}>✓</Text>
                )}
              </View>
            ))}
          </View>
        </Card>

        {/* Impact Facts */}
        <Card style={styles.factsCard}>
          <Text style={styles.sectionTitle}>Did You Know?</Text>
          <View style={styles.factsList}>
            {impactFacts.map((fact, index) => (
              <View key={index} style={styles.factItem}>
                <Text style={styles.factIcon}>{fact.icon}</Text>
                <Text style={styles.factText}>{fact.fact}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Share Button */}
        <View style={styles.shareContainer}>
          <Button 
            title="Share Your Impact" 
            onPress={onShare}
            style={styles.shareButton}
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
  periodCard: {
    marginBottom: 20,
  },
  periodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    marginHorizontal: 4,
    alignItems: 'center',
  },
  selectedPeriodButton: {
    backgroundColor: '#00C897',
    borderColor: '#00C897',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  selectedPeriodButtonText: {
    color: '#fff',
  },
  statsCard: {
    marginBottom: 20,
  },
  mainStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#00C897',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 14,
  },
  breakdownCard: {
    marginBottom: 20,
  },
  breakdownStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  breakdownItem: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  breakdownIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  breakdownValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
    marginBottom: 4,
  },
  breakdownLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  achievementsCard: {
    marginBottom: 20,
  },
  achievementsList: {
    marginTop: 8,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  lockedAchievement: {
    opacity: 0.5,
  },
  achievementIcon: {
    fontSize: 24,
    marginRight: 16,
    width: 32,
  },
  lockedIcon: {
    opacity: 0.3,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
    marginBottom: 2,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#666',
  },
  lockedText: {
    color: '#999',
  },
  unlockedBadge: {
    fontSize: 20,
    color: '#00C897',
    fontWeight: '800',
  },
  factsCard: {
    marginBottom: 20,
  },
  factsList: {
    marginTop: 8,
  },
  factItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  factIcon: {
    fontSize: 20,
    marginRight: 16,
    width: 24,
  },
  factText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  shareContainer: {
    marginBottom: 20,
  },
  shareButton: {
    width: '100%',
  },
});
