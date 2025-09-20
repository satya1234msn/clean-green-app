import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Button({ title, onPress, style, variant = 'primary' }) {
  const gradientColors =
    variant === 'primary' ? ['#4CAF50', '#2E7D32'] : ['#FF5722', '#FF5722']; // Primary Green or Warning Orange

  return (
    <TouchableOpacity onPress={onPress} style={[styles.wrapper, style]}>
      <LinearGradient colors={gradientColors} style={styles.gradient}>
        <Text style={styles.text}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: { 
    borderRadius: 14, 
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  gradient: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  }
});
