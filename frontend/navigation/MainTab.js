import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Dashboard from '../pages/Dashboard';
import Upload from '../pages/WasteUpload';
import Rewards from '../pages/Rewards';
import Impact from '../pages/Impact';
import Profile from '../pages/Profile';


const Tab = createBottomTabNavigator();


export default function MainTab() {
return (
<Tab.Navigator screenOptions={{ headerShown: false }}>
<Tab.Screen name="Dashboard" component={Dashboard} />
<Tab.Screen name="Upload" component={Upload} />
<Tab.Screen name="Rewards" component={Rewards} />
<Tab.Screen name="Impact" component={Impact} />
<Tab.Screen name="Profile" component={Profile} />
</Tab.Navigator>
);
}