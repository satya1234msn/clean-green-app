import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';

export default function Support({ navigation }) {
  const [selectedContact, setSelectedContact] = useState(null);

  const handleMessage = () => {
    setSelectedContact('message');
    Alert.alert('Message Support', 'Opening messaging app to contact our support team...');
  };

  const handleCall = () => {
    setSelectedContact('call');
    Alert.alert('Call Support', 'Calling our support team at +91 98765 43210...');
  };

  const handleHome = () => {
    navigation.navigate('Dashboard');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Support 🎧</Text>
      </View>

      <View style={styles.content}>
        {/* Main Support Card */}
        <View style={styles.supportCard}>
          <Text style={styles.supportMessage}>
            reviewing your issue our executive will contact you which one will you prefer
          </Text>
          
          {/* Contact Options */}
          <View style={styles.contactOptions}>
            <TouchableOpacity 
              style={[
                styles.contactButton, 
                selectedContact === 'message' && styles.selectedContact
              ]} 
              onPress={handleMessage}
            >
              <Text style={[
                styles.contactButtonText,
                selectedContact === 'message' && styles.selectedContactText
              ]}>
                Message
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.contactButton, 
                selectedContact === 'call' && styles.selectedContact
              ]} 
              onPress={handleCall}
            >
              <Text style={[
                styles.contactButtonText,
                selectedContact === 'call' && styles.selectedContactText
              ]}>
                Call
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Additional Support Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>How can we help you?</Text>
          <Text style={styles.infoText}>
            • Waste pickup scheduling issues{'\n'}
            • Payment and rewards queries{'\n'}
            • Technical problems{'\n'}
            • General inquiries{'\n'}
            • Feedback and suggestions
          </Text>
        </View>

        {/* Response Time Info */}
        <View style={styles.responseCard}>
          <Text style={styles.responseTitle}>Response Time</Text>
          <Text style={styles.responseText}>
            📱 Message: Within 2 hours{'\n'}
            📞 Call: Immediate assistance{'\n'}
            💬 Live Chat: Available 24/7
          </Text>
        </View>
      </View>

      {/* Navigation Buttons */}
      <View style={styles.navigationButtons}>
        <TouchableOpacity style={styles.navButton} onPress={handleHome}>
          <Text style={styles.navButtonText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={handleBack}>
          <Text style={styles.navButtonText}>Back</Text>
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
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1B5E20',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  supportCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  supportMessage: {
    fontSize: 16,
    color: '#1B5E20',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  contactOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  contactButton: {
    backgroundColor: '#E8F5E9',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#C8E6C9',
  },
  selectedContact: {
    backgroundColor: '#4CAF50',
    borderColor: '#2E7D32',
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1B5E20',
  },
  selectedContactText: {
    color: '#fff',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1B5E20',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  responseCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  responseTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1B5E20',
    marginBottom: 8,
  },
  responseText: {
    fontSize: 14,
    color: '#2E7D32',
    lineHeight: 20,
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
});
