import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DeliveryDashboard from '../pages/DeliveryDashboard';
import DeliveryEarnings from '../pages/DeliveryEarnings';
import DeliveryProfile from '../pages/DeliveryProfile';
import { Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Tab = createBottomTabNavigator();

export default function DeliveryTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { height: 64, paddingBottom: 8, paddingTop: 8 },
        tabBarIcon: ({ color, size }) => {
          const icons = {
            DeliveryDashboard: 'dashboard',
            DeliveryEarnings: 'attach-money',
            DeliveryProfile: 'person'
          };
          return <Icon name={icons[route.name] || 'circle'} size={22} color={color} />;
        }
      })}
      initialRouteName="DeliveryDashboard"
    >
      <Tab.Screen name="DeliveryDashboard" component={DeliveryDashboard} options={{ title: 'Dashboard' }} />
      <Tab.Screen name="DeliveryEarnings" component={DeliveryEarnings} options={{ title: 'Earnings' }} />
      <Tab.Screen name="DeliveryProfile" component={DeliveryProfile} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}
