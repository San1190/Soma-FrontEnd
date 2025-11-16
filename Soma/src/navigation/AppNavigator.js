import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import HydrationScreen from '../screens/HydrationScreen';
import GuidedBreathingScreen from '../screens/GuidedBreathingScreen';
import DashboardScreen from '../screens/DashboardScreen';
import AlarmScreen from '../screens/AlarmScreen';
import { createStackNavigator } from '@react-navigation/stack';
import NotificationSettingsScreen from '../screens/NotificationSettingsScreen';
import AntiStressReportScreen from '../screens/AntiStressReportScreen';




const Stack = createStackNavigator();

const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
    <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
  </Stack.Navigator>
);

const Tab = createBottomTabNavigator();

const AppNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Breathing" component={GuidedBreathingScreen} />
    <Tab.Screen name="Profile" component={ProfileStack} />
    <Tab.Screen name="Hydration" component={HydrationScreen} />
    <Tab.Screen name="Dashboard" component={DashboardScreen}/>
    <Tab.Screen name="Alarm" component={AlarmScreen}/>
    <Tab.Screen name="Reports" component={AntiStressReportScreen}/>
  

  </Tab.Navigator>
);

export default AppNavigator;
