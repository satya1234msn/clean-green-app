import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import Card from '../components/Card';
import Button from '../components/Button';

const rows = [
  { id: '1', user: 'Satya', weight: '2.5 kg', status: 'Pending' },
  { id: '2', user: 'Anu', weight: '5.2 kg', status: 'In warehouse' }
];

export default function AdminWarehouse() {
  return (
    <View style={{ padding: 20, flex: 1, backgroundColor: '#F9F9F9' }}>
      <Text style={{ fontSize: 20, fontWeight: '800', color: '#006C67' }}>Warehouse Tracking</Text>
      <FlatList
        data={rows}
        keyExtractor={(i) => i.id}
        style={{ marginTop: 12 }}
        renderItem={({ item }) => (
          <Card style={{ marginBottom: 12 }}>
            <Text style={{ fontWeight: '700' }}>{item.user}</Text>
            <Text style={{ color: '#666', marginTop: 6 }}>{item.weight}</Text>
            <Text style={{ color: '#006C67', marginTop: 6 }}>{item.status}</Text>
            <View style={{ flexDirection: 'row', marginTop: 8 }}>
              <TouchableOpacity style={{ marginRight: 8 }}><Button title="Approve" onPress={() => alert('Approve')} /></TouchableOpacity>
              <TouchableOpacity><Button title="Mark Sent" onPress={() => alert('Mark Sent')} /></TouchableOpacity>
            </View>
          </Card>
        )}
      />
    </View>
  );
}
