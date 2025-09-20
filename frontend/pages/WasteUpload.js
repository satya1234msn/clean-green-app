import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform, ScrollView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import InputField from '../components/InputField';
import Button from '../components/Button';
import Card from '../components/Card';
import { LinearGradient } from 'expo-linear-gradient';

const wasteTypes = ['PET Bottle', 'Plastic Bag', 'Food Container', 'Packaging', 'Other'];

export default function WasteUpload({ navigation }) {
  const [image, setImage] = useState(null);
  const [weight, setWeight] = useState('');
  const [type, setType] = useState('PET Bottle');
  const [status, setStatus] = useState('Ready to Submit');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function pickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return alert('Permission required to pick images.');
    const result = await ImagePicker.launchImageLibraryAsync({ 
      allowsEditing: true, 
      quality: 0.7,
      aspect: [4, 3]
    });
    if (!result.cancelled) {
      setImage(result.assets ? result.assets[0].uri : result.uri);
      setStatus('Ready to Submit');
    }
  }

  async function submit() {
    if (!image || !weight) {
      Alert.alert('Missing Information', 'Please add an image and weight before submitting.');
      return;
    }

    setIsSubmitting(true);
    setStatus('Submitting...');
    
    // Simulate API call
    setTimeout(() => {
      setStatus('Submitted Successfully!');
      setIsSubmitting(false);
      Alert.alert(
        'Success!', 
        'Your waste submission has been recorded. You will receive points once approved.',
        [
          { text: 'OK', onPress: () => {
            setImage(null);
            setWeight('');
            setType('PET Bottle');
            setStatus('Ready to Submit');
          }}
        ]
      );
    }, 2000);
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient colors={['#00C897', '#006C67']} style={styles.header}>
        <Text style={styles.headerTitle}>Upload Waste ♻️</Text>
        <Text style={styles.headerSubtitle}>Help us recycle responsibly</Text>
      </LinearGradient>

      <View style={styles.content}>
        {/* Image Upload Section */}
        <Card style={styles.imageCard}>
          <Text style={styles.sectionTitle}>Photo of Waste</Text>
          <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
            {image ? (
              <View>
                <Image source={{ uri: image }} style={styles.selectedImage} />
                <View style={styles.imageOverlay}>
                  <Text style={styles.changeImageText}>Tap to change</Text>
                </View>
              </View>
            ) : (
              <View style={styles.placeholderContainer}>
                <Text style={styles.placeholderIcon}>📸</Text>
                <Text style={styles.placeholderText}>Tap to select image</Text>
                <Text style={styles.placeholderSubtext}>Take a clear photo of your waste</Text>
              </View>
            )}
          </TouchableOpacity>
        </Card>

        {/* Form Section */}
        <Card style={styles.formCard}>
          <Text style={styles.sectionTitle}>Waste Details</Text>
          
          <View style={styles.inputContainer}>
            <InputField 
              label="Weight (kg)" 
              keyboardType="decimal-pad" 
              value={weight} 
              onChangeText={setWeight}
              placeholder="e.g., 2.5"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Waste Type</Text>
            <View style={styles.typeSelector}>
              {wasteTypes.map((wasteType) => (
                <TouchableOpacity
                  key={wasteType}
                  style={[
                    styles.typeButton,
                    type === wasteType && styles.selectedTypeButton
                  ]}
                  onPress={() => setType(wasteType)}
                >
                  <Text style={[
                    styles.typeButtonText,
                    type === wasteType && styles.selectedTypeButtonText
                  ]}>
                    {wasteType}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Card>

        {/* Status Card */}
        <Card style={styles.statusCard}>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Status:</Text>
            <View style={[
              styles.statusBadge,
              { backgroundColor: status.includes('Success') ? '#E8F5E8' : status.includes('Submitting') ? '#FFF3CD' : '#F0F9F7' }
            ]}>
              <Text style={[
                styles.statusText,
                { color: status.includes('Success') ? '#006C67' : status.includes('Submitting') ? '#856404' : '#006C67' }
              ]}>
                {status}
              </Text>
            </View>
          </View>
        </Card>

        {/* Submit Button */}
        <View style={styles.submitContainer}>
          <Button 
            title={isSubmitting ? "Submitting..." : "Submit Waste"} 
            onPress={submit}
            style={styles.submitButton}
          />
        </View>

        {/* Tips Card */}
        <Card style={styles.tipsCard}>
          <Text style={styles.sectionTitle}>💡 Tips for Better Submissions</Text>
          <View style={styles.tipsList}>
            <Text style={styles.tipItem}>• Take clear, well-lit photos</Text>
            <Text style={styles.tipItem}>• Ensure waste is clean and dry</Text>
            <Text style={styles.tipItem}>• Weigh accurately for better rewards</Text>
            <Text style={styles.tipItem}>• Separate different types of plastic</Text>
          </View>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F9F9F9' 
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
  imageCard: {
    marginBottom: 20,
  },
  imagePicker: {
    height: 200,
    borderRadius: 16,
    backgroundColor: '#F8F9FA',
    borderWidth: 2,
    borderColor: '#E9ECEF',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 8,
    alignItems: 'center',
  },
  changeImageText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  placeholderContainer: {
    alignItems: 'center',
  },
  placeholderIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  placeholderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: '#999',
  },
  formCard: {
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
    marginBottom: 12,
  },
  typeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  selectedTypeButton: {
    backgroundColor: '#00C897',
    borderColor: '#00C897',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  selectedTypeButtonText: {
    color: '#fff',
  },
  statusCard: {
    marginBottom: 20,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  submitContainer: {
    marginBottom: 20,
  },
  submitButton: {
    width: '100%',
  },
  tipsCard: {
    marginBottom: 20,
  },
  tipsList: {
    marginTop: 8,
  },
  tipItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
});
