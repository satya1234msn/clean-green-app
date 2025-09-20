import React from 'react';
import { View, Text, FlatList } from 'react-native';
import Card from '../components/Card';

const users = [
  { id: 'u1', name: 'Satya', history: [{ date: '2025-09-10', weight: '2.5' }] },
];

export default function AdminUserHistory() {
  return (
    <View style={{ padding: 20, flex: 1, backgroundColor: '#F9F9F9' }}>
      <Text style={{ fontSize: 20, fontWeight: '800', color: '#006C67' }}>User History & Rewards</Text>
      <FlatList
        data={users}
        keyExtractor={(i) => i.id}
        style={{ marginTop: 12 }}
        renderItem={({ item }) => (
          <Card style={{ marginBottom: 12 }}>
            <Text style={{ fontWeight: '800' }}>{item.name}</Text>
            {item.history.map((h, idx) => <Text key={idx} style={{ color: '#666' }}>{h.date} — {h.weight} kg</Text>)}
          </Card>
        )}
      />
    </View>
  );
}
