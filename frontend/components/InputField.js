import React from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';

export default function InputField({ label, ...props }) {
  return (
    <View style={{ marginVertical: 6 }}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.container}>
        <TextInput 
          placeholderTextColor="#888" 
          style={styles.input} 
          {...props} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { 
    fontSize: 14, 
    color: '#1B5E20', // Deep Green
    marginBottom: 6,
    fontWeight: '600'
  },
  container: {
    borderRadius: 12,
    backgroundColor: '#fff', // White background for input fields
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#A5D6A7', // Accent Green border
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  input: { 
    height: 40, 
    fontSize: 16,
    color: '#1B5E20', // Deep Green text
  }
});
