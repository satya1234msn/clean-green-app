import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';

export default function SchedulePickupPage({ navigation, route }) {
  const { wasteType, foodBoxes, bottles, otherItems, images } = route.params || {};
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');

  const timeSlots = [
    '10:00 to 11:00',
    '9:00pm to 11:00pm',
    '2:00pm to 4:00pm',
    '6:00pm to 8:00pm',
  ];

  const handleSchedule = () => {
    if (!selectedTimeSlot) {
      Alert.alert('Error', 'Please select a time slot');
      return;
    }
    
    Alert.alert(
      'Schedule Confirmed',
      `Your pickup is scheduled for ${selectedTimeSlot}`,
      [
        {
          text: 'OK',
          onPress: () => navigation.navigate('AfterScheduling', {
            wasteType,
            foodBoxes,
            bottles,
            otherItems,
            images,
            scheduledTime: selectedTimeSlot
          })
        }
      ]
    );
  };

  const handleHome = () => {
    navigation.navigate('Dashboard');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Schedule Pickup</Text>
      </View>

      <View style={styles.content}>
        {/* Choose Day Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>choose day</Text>
          <TouchableOpacity style={styles.inputContainer}>
            <Text style={styles.calendarIcon}>📅</Text>
            <Text style={styles.datePlaceholder}>DD/MM/YY</Text>
          </TouchableOpacity>
        </View>

        {/* Choose Time Slot Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>choose time Slot</Text>
          <View style={styles.timeSlotsContainer}>
            {timeSlots.map((slot, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.timeSlot,
                  selectedTimeSlot === slot && styles.selectedTimeSlot
                ]}
                onPress={() => setSelectedTimeSlot(slot)}
              >
                <Text style={[
                  styles.timeSlotText,
                  selectedTimeSlot === slot && styles.selectedTimeSlotText
                ]}>
                  {slot}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Schedule Button */}
        <TouchableOpacity style={styles.scheduleButton} onPress={handleSchedule}>
          <Text style={styles.scheduleButtonText}>Schedule it!</Text>
        </TouchableOpacity>

        {/* Navigation Buttons */}
        <View style={styles.navigationButtons}>
          <TouchableOpacity style={styles.navButton} onPress={handleHome}>
            <Text style={styles.navButtonText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={handleBack}>
            <Text style={styles.navButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F8E9',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#222',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  calendarIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  datePlaceholder: {
    fontSize: 16,
    color: '#999',
  },
  timeSlotsContainer: {
    gap: 10,
  },
  timeSlot: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  selectedTimeSlot: {
    backgroundColor: '#00C897',
    borderColor: '#00C897',
  },
  timeSlotText: {
    fontSize: 16,
    color: '#222',
    fontWeight: '500',
  },
  selectedTimeSlotText: {
    color: '#fff',
    fontWeight: '600',
  },
  scheduleButton: {
    backgroundColor: '#00C897',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 30,
  },
  scheduleButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  navButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    flex: 0.45,
    alignItems: 'center',
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
});
