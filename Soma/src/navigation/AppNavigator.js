import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import StressScreen from '../screens/StressScreen';
import GuidedBreathingScreen from '../screens/GuidedBreathingScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { createStackNavigator } from '@react-navigation/stack';




const Stack = createStackNavigator();

const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
  </Stack.Navigator>
);

const Tab = createBottomTabNavigator();

const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeMain" component={HomeScreen} />
    <Stack.Screen name="Stress" component={StressScreen} />
    <Stack.Screen name="GuidedBreathing" component={GuidedBreathingScreen} />
  </Stack.Navigator>
);

const AppNavigator = () => (
  <Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' }, unmountOnBlur: true }} tabBar={() => null}>
    <Tab.Screen name="Home" component={HomeStack} />
    <Tab.Screen name="Profile" component={ProfileStack} />
  </Tab.Navigator>
);

export default AppNavigator;
