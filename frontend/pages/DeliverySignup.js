import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { uploadAPI } from '../services/apiService';
import { authService } from '../services/authService';

export default function DeliverySignup({ navigation }) {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
    phone: '',
    password: '',
    vehicleType: '',
    bikeType: '',
    licenseNo: '',
    aadharNo: '',
    termsAccepted: false
  });
  const [aadharUrl, setAadharUrl] = useState('');
  const [licenseUrl, setLicenseUrl] = useState('');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignup = async () => {
    if (!formData.name || !formData.age || !formData.email || !formData.phone || !formData.password ||
        !formData.vehicleType || !formData.licenseNo || !formData.aadharNo) {
      alert('Please fill in all required fields');
      return;
    }
    if (!aadharUrl || !licenseUrl) {
      alert('Please upload both Aadhar and License documents');
      return;
    }
    if (!formData.termsAccepted) {
      alert('Please accept the terms and conditions');
      return;
    }
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: 'delivery',
        vehicleType: formData.vehicleType,
        licenseNumber: formData.licenseNo
      };
      const res = await authService.register(payload);
      if (res.success) {
        Alert.alert('Success', 'Delivery account created successfully! Please login.');
        navigation.goBack();
      } else {
        Alert.alert('Registration Failed', res.message || 'Failed to create account');
      }
    } catch (e) {
      Alert.alert('Error', e.response?.data?.message || 'Registration failed');
    }
  };

  const selectVehicleType = () => {
    Alert.alert('Vehicle Type', 'Choose one', [
      { text: 'Bike', onPress: () => setFormData(prev => ({ ...prev, vehicleType: 'bike' })) },
      { text: 'Scooter', onPress: () => setFormData(prev => ({ ...prev, vehicleType: 'scooter' })) },
      { text: 'Car', onPress: () => setFormData(prev => ({ ...prev, vehicleType: 'car' })) },
      { text: 'Van', onPress: () => setFormData(prev => ({ ...prev, vehicleType: 'van' })) },
      { text: 'Cancel', style: 'cancel' }
    ]);
  };
  const selectBikeType = () => {
    Alert.alert('Bike Type', 'Choose one', [
      { text: '100cc', onPress: () => setFormData(prev => ({ ...prev, bikeType: '100cc' })) },
      { text: '125cc', onPress: () => setFormData(prev => ({ ...prev, bikeType: '125cc' })) },
      { text: '150cc', onPress: () => setFormData(prev => ({ ...prev, bikeType: '150cc' })) },
      { text: 'Electric', onPress: () => setFormData(prev => ({ ...prev, bikeType: 'electric' })) },
      { text: 'Cancel', style: 'cancel' }
    ]);
  };

  const uploadDoc = async (kind) => {
    try {
      const picker = await import('expo-image-picker');
      const result = await picker.launchImageLibraryAsync({ mediaTypes: picker.MediaTypeOptions.Images, quality: 0.8 });
      if (result.canceled || !result.assets?.length) return;
      const uri = result.assets[0].uri;
      const res = await uploadAPI.uploadDocument(uri, kind);
      if (res.status === 'success') {
        if (kind === 'aadhar') setAadharUrl(res.data.imageUrl);
        if (kind === 'license') setLicenseUrl(res.data.imageUrl);
        Alert.alert('Uploaded', `${kind} uploaded successfully`);
      } else {
        Alert.alert('Upload Failed', res.message || 'Try again');
      }
    } catch (e) {
      Alert.alert('Upload Error', e.response?.data?.message || 'Failed to upload');
    }
  };

  const handleHelp = () => {
    alert('Help feature coming soon!');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>🚚</Text>
            </View>
            <Text style={styles.logoTitle}>CleanGreen Delivery</Text>
          </View>
          <Text style={styles.instructionText}>To become our hand verify yourself first ↓</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Delivery Registration</Text>
            
            <InputField 
              label="Name" 
              placeholder="Enter your full name"
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
              style={styles.inputField}
            />
            
            <InputField 
              label="Age" 
              keyboardType="numeric"
              placeholder="Enter your age"
              value={formData.age}
              onChangeText={(value) => handleInputChange('age', value)}
              style={styles.inputField}
            />
            
            <InputField 
              label="Email" 
              keyboardType="email-address"
              placeholder="Enter your email address"
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              style={styles.inputField}
            />

            <InputField 
              label="Password" 
              secureTextEntry
              placeholder="Create a password"
              value={formData.password}
              onChangeText={(value) => handleInputChange('password', value)}
              style={styles.inputField}
            />
            
            <InputField 
              label="Phone Number" 
              keyboardType="phone-pad"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChangeText={(value) => handleInputChange('phone', value)}
              style={styles.inputField}
            />
            
            <TouchableOpacity onPress={selectVehicleType}>
              <InputField 
                label="Type of Vehicle" 
                placeholder="Select vehicle type"
                value={formData.vehicleType}
                editable={false}
                style={styles.inputField}
              />
            </TouchableOpacity>
            
            {formData.vehicleType === 'bike' || formData.vehicleType === 'scooter' ? (
              <TouchableOpacity onPress={selectBikeType}>
                <InputField 
                  label="Type of Bike" 
                  placeholder="Select bike type"
                  value={formData.bikeType}
                  editable={false}
                  style={styles.inputField}
                />
              </TouchableOpacity>
            ) : null}
            
            <InputField 
              label="License Number" 
              placeholder="Enter license number"
              value={formData.licenseNo}
              onChangeText={(value) => handleInputChange('licenseNo', value)}
              style={styles.inputField}
            />
            
            <InputField 
              label="Aadhar Number" 
              keyboardType="numeric"
              placeholder="Enter Aadhar number"
              value={formData.aadharNo}
              onChangeText={(value) => handleInputChange('aadharNo', value)}
              style={styles.inputField}
            />

            <View style={styles.uploadSection}>
              <Text style={styles.uploadLabel}>Aadhar Upload:</Text>
              <Button title={aadharUrl ? 'Re-upload' : 'Upload'} style={styles.uploadButton} onPress={() => uploadDoc('aadhar')} />
              <Text style={styles.uploadNote}>Only jpeg, jpg or PDF</Text>
            </View>

            <View style={styles.uploadSection}>
              <Text style={styles.uploadLabel}>License Upload:</Text>
              <Button title={licenseUrl ? 'Re-upload' : 'Upload'} style={styles.uploadButton} onPress={() => uploadDoc('license')} />
              <Text style={styles.uploadNote}>Only jpeg, jpg or PDF</Text>
            </View>

            <TouchableOpacity 
              style={styles.checkboxContainer}
              onPress={() => handleInputChange('termsAccepted', !formData.termsAccepted)}
            >
              <View style={[styles.checkbox, formData.termsAccepted && styles.checkboxChecked]}>
                {formData.termsAccepted && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.checkboxText}>I accept & understand the terms & conditions</Text>
            </TouchableOpacity>

            <Button 
              title="Create Account" 
              onPress={handleSignup} 
              style={styles.signupButton}
            />

            <TouchableOpacity onPress={handleHelp} style={styles.helpButton}>
              <Text style={styles.helpText}>Help</Text>
            </TouchableOpacity>

            <View style={styles.loginPrompt}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.loginLink}>Login</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.footerText}>Crafted with love towards India</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F8E9', // Very very light green background
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E8F5E9', // Light Green
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  logoText: {
    fontSize: 36,
  },
  logoTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2E7D32', // Dark Green
  },
  instructionText: {
    fontSize: 16,
    color: '#2E7D32', // Dark Green
    fontWeight: '600',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  formContainer: {
    backgroundColor: '#E0F2E0', // Bit darker than background
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1B5E20', // Deep Green
    textAlign: 'center',
    marginBottom: 24,
  },
  inputField: {
    marginBottom: 16,
  },
  uploadSection: {
    marginBottom: 16,
  },
  uploadLabel: {
    fontSize: 14,
    color: '#1B5E20', // Deep Green
    marginBottom: 8,
    fontWeight: '600',
  },
  uploadButton: {
    backgroundColor: '#4CAF50', // Primary Green
    marginBottom: 4,
  },
  uploadNote: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#2E7D32', // Dark Green
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#2E7D32', // Dark Green
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  checkboxText: {
    flex: 1,
    fontSize: 14,
    color: '#1B5E20', // Deep Green
  },
  signupButton: {
    backgroundColor: '#1B5E20', // Dark green for create account
    marginTop: 20,
    marginBottom: 16,
  },
  helpButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  helpText: {
    color: '#2E7D32', // Dark Green
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  loginPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  loginText: {
    color: '#666', // Gray Text
    fontSize: 14,
  },
  loginLink: {
    color: '#2E7D32', // Dark Green
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  footerText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
});
