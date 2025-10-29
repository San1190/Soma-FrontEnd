import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import HydrationScreen from '../screens/HydrationScreen';
import GuidedBreathingScreen from '../screens/GuidedBreathingScreen';

const Tab = createBottomTabNavigator();

const AppNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
    <Tab.Screen name="Hydration" component={HydrationScreen} />
    <Tab.Screen name="Breathing" component={GuidedBreathingScreen} />
  </Tab.Navigator>
);

export default AppNavigator;