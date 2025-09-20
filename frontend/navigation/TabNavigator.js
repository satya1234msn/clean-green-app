import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Dashboard from '../pages/Dashboard';
import WasteUploadNew from '../pages/WasteUploadNew';
import Profile from '../pages/Profile';
import Rewards from '../pages/Rewards';
import { Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { height: 64, paddingBottom: 8, paddingTop: 8 },
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Dashboard: 'dashboard',
            Upload: 'cloud-upload',
            Rewards: 'card-giftcard',
            Profile: 'person'
          };
          return <Icon name={icons[route.name] || 'circle'} size={22} color={color} />;
        }
      })}
      initialRouteName="Dashboard"
    >
      <Tab.Screen name="Dashboard" component={Dashboard} options={{ title: 'Home' }} />
      <Tab.Screen name="Upload" component={WasteUploadNew} />
      <Tab.Screen name="Rewards" component={Rewards} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}
