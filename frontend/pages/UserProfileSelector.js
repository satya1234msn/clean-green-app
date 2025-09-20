import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, TextInput, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Button from '../components/Button';

export default function UserProfileSelector({ navigation }) {
  const [role, setRole] = useState('user');
  const [splashAnimation] = useState(new Animated.Value(0));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRoleChange = (selectedRole) => {
    if (selectedRole !== role) {
      // Splash animation for role change
      Animated.sequence([
        Animated.timing(splashAnimation, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(splashAnimation, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
      
      // Delay role change to show animation
      setTimeout(() => {
        setRole(selectedRole);
      }, 200);
    }
  };

  const handleLogin = () => {
    console.log('Login button pressed!', { username, password, role });
    
    // Basic validation
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    // Simple authentication logic
    if (role === 'user') {
      if (username === 'user' && password === 'user123') {
        console.log('User login successful');
        navigation.replace('Main');
      } else {
        Alert.alert('Invalid Credentials', 'Try: user/user123');
      }
    } else {
      if (username === 'delivery' && password === 'delivery123') {
        console.log('Delivery login successful');
        navigation.replace('DeliveryMain');
      } else {
        Alert.alert('Invalid Credentials', 'Try: delivery/delivery123');
      }
    }
  };

  const handleSignup = () => {
    if (role === 'user') {
      navigation.navigate('UserSignup');
    } else {
      navigation.navigate('DeliverySignup');
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header with Logo */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>🌱</Text>
          </View>
          <Text style={styles.logoTitle}>CleanGreen</Text>
        </View>
      </View>

      <View style={styles.content}>
        {/* Role Selection Tabs */}
        <View style={styles.roleSelector}>
          <TouchableOpacity 
            style={[styles.roleTab, role === 'user' && styles.activeRoleTab]} 
            onPress={() => handleRoleChange('user')}
          >
            <Text style={[styles.roleTabText, role === 'user' && styles.activeRoleTabText]}>User</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.roleTab, role === 'delivery' && styles.activeRoleTab]} 
            onPress={() => handleRoleChange('delivery')}
          >
            <Text style={[styles.roleTabText, role === 'delivery' && styles.activeRoleTabText]}>Delivery</Text>
          </TouchableOpacity>
        </View>

        {/* Splash Animation */}
        <Animated.View 
          style={[
            styles.splashOverlay,
            {
              opacity: splashAnimation,
              transform: [
                {
                  scale: splashAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 1.5],
                  }),
                },
                {
                  rotate: splashAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  }),
                },
              ],
            }
          ]}
        >
          <Text style={styles.splashText}>
            {role === 'user' ? '👤' : '🚚'}
          </Text>
        </Animated.View>

        {/* Login Form */}
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Username</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter your username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          
          <TouchableOpacity 
            style={styles.loginButton} 
            onPress={handleLogin}
            activeOpacity={0.8}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
          
          <View style={styles.signupPrompt}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity onPress={handleSignup}>
              <Text style={styles.signupLink}>Signup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // White background
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
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
    fontSize: 28,
    fontWeight: '800',
    color: '#2E7D32', // Dark Green
  },
  content: {
    flex: 1,
    padding: 20,
  },
  roleSelector: {
    flexDirection: 'row',
    backgroundColor: '#C8E6C9', // Faded green
    borderRadius: 25,
    padding: 4,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  roleTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 20,
  },
  activeRoleTab: {
    backgroundColor: '#4CAF50', // Primary Green
  },
  roleTabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  activeRoleTabText: {
    color: '#fff',
  },
  splashOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  splashText: {
    fontSize: 100,
  },
  formContainer: {
    backgroundColor: '#C8E6C9', // Faded green form container
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1B5E20',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#A5D6A7',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1B5E20',
  },
  loginButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 8,
    marginTop: 12,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  signupPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    color: '#666', // Gray Text
    fontSize: 14,
  },
  signupLink: {
    color: '#2E7D32', // Dark Green
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

