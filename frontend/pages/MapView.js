import React from 'react';
import { View } from 'react-native';
import RealMap from '../components/RealMap';

export default function MapView({ navigation, route }) {
  return (
    <View style={{ flex: 1 }}>
      <RealMap navigation={navigation} route={route} />
    </View>
  );
}

