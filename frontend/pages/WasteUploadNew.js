import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { pickupAPI, uploadAPI } from '../services/apiService';
import { authService } from '../services/authService';

export default function WasteUploadNew({ navigation }) {
  const [selectedWasteType, setSelectedWasteType] = useState('');
  const [foodBoxes, setFoodBoxes] = useState('');
  const [bottles, setBottles] = useState('');
  const [otherItems, setOtherItems] = useState('');
  const [uploadedImages, setUploadedImages] = useState([]);

  const wasteTypes = [
    { id: 'food', label: 'Food', icon: '📦' },
    { id: 'bottles', label: 'Bottles', icon: '🍼' },
    { id: 'other', label: 'Other', icon: '🗑️' },
  ];

  const handleWasteTypeSelect = (type) => {
    setSelectedWasteType(type);
  };

  const handleImageUpload = () => {
    Alert.alert(
      'Select Photo',
      'Choose how you want to add a photo',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Gallery', onPress: handleGalleryUpload },
        { text: 'Camera', onPress: handleCameraCapture },
      ]
    );
  };

  const handleGalleryUpload = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission required', 'Permission to access camera roll is required!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0 && uploadedImages.length < 3) {
        setUploadedImages([...uploadedImages, result.assets[0].uri]);
        Alert.alert('Success', 'Photo uploaded successfully!');
      } else if (uploadedImages.length >= 3) {
        Alert.alert('Limit Reached', 'You can only upload up to 3 photos');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'Failed to upload image. Please try again.');
    }
  };

  const handleCameraCapture = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission required', 'Permission to access camera is required!');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0 && uploadedImages.length < 3) {
        setUploadedImages([...uploadedImages, result.assets[0].uri]);
        Alert.alert('Success', 'Photo captured successfully!');
      } else if (uploadedImages.length >= 3) {
        Alert.alert('Limit Reached', 'You can only upload up to 3 photos');
      }
    } catch (error) {
      console.error('Error capturing image:', error);
      Alert.alert('Error', 'Failed to capture image. Please try again.');
    }
  };

  const handleRemoveImage = (index) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(newImages);
  };

  const handleSchedulePickup = async () => {
    if (!selectedWasteType) {
      Alert.alert('Selection Required', 'Please select a waste type');
      return;
    }

    try {
      // Upload images first
      const uploadedImageUrls = [];
      for (const image of uploadedImages) {
        const uploadResult = await uploadAPI.uploadImage(image.uri);
        if (uploadResult.status === 'success') {
          uploadedImageUrls.push(uploadResult.data.url);
        }
      }

      // Get current user and address
      const currentUser = await authService.getCurrentUser();
      if (!currentUser?.defaultAddress) {
        Alert.alert('Address Required', 'Please set a default address in your profile');
        return;
      }

      // Create pickup request
      const pickupData = {
        wasteType: selectedWasteType,
        wasteDetails: {
          foodBoxes: selectedWasteType === 'food' ? parseInt(foodBoxes) || 0 : 0,
          bottles: selectedWasteType === 'bottles' ? parseInt(bottles) || 0 : 0,
          otherItems: selectedWasteType === 'other' ? otherItems : '',
        },
        images: uploadedImageUrls,
        address: currentUser.defaultAddress._id,
        priority: 'scheduled',
        scheduledDate: new Date(), // Will be updated in SchedulePickupPage
      };

      navigation.navigate('SchedulePickupPage', {
        pickupData,
      });
    } catch (error) {
      console.error('Error preparing pickup request:', error);
      Alert.alert('Error', 'Failed to prepare pickup request');
    }
  };

  const handlePickupNow = async () => {
    if (!selectedWasteType) {
      Alert.alert('Selection Required', 'Please select a waste type');
      return;
    }

    try {
      // Upload images first
      const uploadedImageUrls = [];
      for (const image of uploadedImages) {
        const uploadResult = await uploadAPI.uploadImage(image.uri);
        if (uploadResult.status === 'success') {
          uploadedImageUrls.push(uploadResult.data.url);
        }
      }

      // Get current user and address
      const currentUser = await authService.getCurrentUser();
      if (!currentUser?.defaultAddress) {
        Alert.alert('Address Required', 'Please set a default address in your profile');
        return;
      }

      // Create immediate pickup request
      const pickupData = {
        wasteType: selectedWasteType,
        wasteDetails: {
          foodBoxes: selectedWasteType === 'food' ? parseInt(foodBoxes) || 0 : 0,
          bottles: selectedWasteType === 'bottles' ? parseInt(bottles) || 0 : 0,
          otherItems: selectedWasteType === 'other' ? otherItems : '',
        },
        images: uploadedImageUrls,
        address: currentUser.defaultAddress._id,
        priority: 'now',
      };

      // Submit pickup request to backend
      const response = await pickupAPI.createPickup(pickupData);
      
      if (response.status === 'success') {
        navigation.navigate('AfterScheduling', {
          pickupData: response.data.pickup,
          immediatePickup: true,
        });
      } else {
        Alert.alert('Error', response.message || 'Failed to create pickup request');
      }
    } catch (error) {
      console.error('Error creating pickup request:', error);
      Alert.alert('Error', 'Failed to create pickup request');
    }
  };

  const handleProfile = () => {
    navigation.navigate('Profile');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          {/* Header */}
              <View style={styles.header}>
                <TouchableOpacity style={styles.profileIcon} onPress={handleProfile}>
                  <Text style={styles.profileIconText}>👤</Text>
                </TouchableOpacity>
                <View style={styles.headerTitle}>
                  <Text style={styles.headerTitleText}>user waste upload</Text>
                </View>
              </View>

      <View style={styles.content}>
        {/* Main Heading */}
        <View style={styles.headingContainer}>
          <Text style={styles.mainHeading}>DUMP with us!</Text>
          <Text style={styles.subHeading}>want to dump with us then:</Text>
        </View>

        {/* Waste Type Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select type of waste</Text>
          <View style={styles.wasteTypeContainer}>
            {wasteTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.wasteTypeButton,
                  selectedWasteType === type.id && styles.selectedWasteType
                ]}
                onPress={() => handleWasteTypeSelect(type.id)}
              >
                <Text style={styles.wasteTypeIcon}>{type.icon}</Text>
                <Text style={[
                  styles.wasteTypeText,
                  selectedWasteType === type.id && styles.selectedWasteTypeText
                ]}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Input Fields */}
        <View style={styles.section}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Number of food boxes</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter"
              value={foodBoxes}
              onChangeText={setFoodBoxes}
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Number of bottles</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter"
              value={bottles}
              onChangeText={setBottles}
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Describe other items</Text>
            <TextInput
              style={[styles.textInput, styles.multilineInput]}
              placeholder="Enter description"
              value={otherItems}
              onChangeText={setOtherItems}
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        {/* Photo Upload */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upload Photo</Text>
          <View style={styles.photoContainer}>
            {uploadedImages.map((uri, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image source={{ uri }} style={styles.uploadedImage} />
                <TouchableOpacity 
                  style={styles.removeButton} 
                  onPress={() => handleRemoveImage(index)}
                >
                  <Text style={styles.removeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
            {uploadedImages.length < 3 && (
              <TouchableOpacity style={styles.uploadButton} onPress={handleImageUpload}>
                <Text style={styles.uploadButtonText}>+</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.scheduleButton]}
            onPress={handleSchedulePickup}
            activeOpacity={0.8}
          >
            <Text style={styles.actionButtonText}>Schedule Pickup</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.pickupNowButton]}
            onPress={handlePickupNow}
            activeOpacity={0.8}
          >
            <Text style={styles.actionButtonText}>Pickup Now</Text>
          </TouchableOpacity>
        </View>

        {/* Rewards Info */}
        <Text style={styles.rewardsText}>Your rewards will appear after scheduling.</Text>
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
  headerTitle: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitleText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1B5E20',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  headingContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  mainHeading: {
    fontSize: 36,
    fontWeight: '900',
    color: '#1B5E20',
    marginBottom: 8,
    textAlign: 'center',
  },
  subHeading: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1B5E20',
    marginBottom: 12,
  },
  wasteTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  wasteTypeButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedWasteType: {
    backgroundColor: '#4CAF50',
    borderColor: '#2E7D32',
  },
  wasteTypeIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  wasteTypeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  selectedWasteTypeText: {
    color: '#fff',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1B5E20',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#A5D6A7',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1B5E20',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  photoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  uploadedImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#E0E0E0',
  },
  imageContainer: {
    position: 'relative',
    marginRight: 8,
  },
  removeButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F44336',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  uploadButton: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#C8E6C9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderStyle: 'dashed',
  },
  uploadButtonText: {
    fontSize: 32,
    color: '#4CAF50',
    fontWeight: '600',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 16,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  scheduleButton: {
    backgroundColor: '#4CAF50',
  },
  pickupNowButton: {
    backgroundColor: '#2E7D32',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  rewardsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 10,
  },
});
