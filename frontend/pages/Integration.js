import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import InputField from '../components/InputField';
import Button from '../components/Button';
import Card from '../components/Card';

export default function Integration() {
  const [orderId, setOrderId] = useState('');

  function submit() {
    // placeholder
    alert('Assigned Pickup ID: PK' + Math.floor(Math.random() * 10000));
  }

  return (
    <View style={{ padding: 20, backgroundColor: '#F9F9F9', flex: 1 }}>
      <Card>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#006C67' }}>Swiggy/Zomato Integration</Text>
        <Text style={{ color: '#666', marginTop: 8 }}>
          Enter your food order ID and our delivery partner will collect the waste with your order.
        </Text>

        <InputField label="Order ID" value={orderId} onChangeText={setOrderId} />
        <View style={{ marginTop: 12 }}>
          <Button title="Submit" onPress={submit} />
        </View>
      </Card>
    </View>
  );
}
