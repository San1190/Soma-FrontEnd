import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import StressScreen from '../screens/StressScreen';
import FatigueScreen from '../screens/FatigueScreen';
import InsomniaScreen from '../screens/InsomniaScreen';
import GuidedBreathingScreen from '../screens/GuidedBreathingScreen';
import ProfileScreen from '../screens/ProfileScreen';
import StatsScreen from '../screens/StatsScreen';
import EvolutionScreen from '../screens/EvolutionScreen';
import HabitsHistoryScreen from '../screens/HabitsHistoryScreen';
import PersonalTraitsScreen from '../screens/PersonalTraitsScreen';
import MedicalDocumentsScreen from '../screens/MedicalDocumentsScreen';
import LocaleRegionScreen from '../screens/LocaleRegionScreen';
import PremiumSubscriptionScreen from '../screens/PremiumSubscriptionScreen';
import PaymentMethodsScreen from '../screens/PaymentMethodsScreen';
import HelpContactScreen from '../screens/HelpContactScreen';
import { createStackNavigator } from '@react-navigation/stack';




const Stack = createStackNavigator();

const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
    <Stack.Screen name="Stats" component={StatsScreen} options={{ headerShown: true, headerTitle: 'Estadísticas generales' }} />
    <Stack.Screen name="Evolution" component={EvolutionScreen} options={{ headerShown: true, headerTitle: 'Evolución total' }} />
    <Stack.Screen name="HabitsHistory" component={HabitsHistoryScreen} options={{ headerShown: true, headerTitle: 'Historial de hábitos' }} />
    <Stack.Screen name="PersonalTraits" component={PersonalTraitsScreen} options={{ headerShown: true, headerTitle: 'Características personales' }} />
    <Stack.Screen name="MedicalDocuments" component={MedicalDocumentsScreen} options={{ headerShown: true, headerTitle: 'Documentos médicos' }} />
    <Stack.Screen name="LocaleRegion" component={LocaleRegionScreen} options={{ headerShown: true, headerTitle: 'Idioma y región' }} />
    <Stack.Screen name="PremiumSubscription" component={PremiumSubscriptionScreen} options={{ headerShown: true, headerTitle: 'Suscripción Premium' }} />
    <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} options={{ headerShown: true, headerTitle: 'Métodos de pago' }} />
    <Stack.Screen name="HelpContact" component={HelpContactScreen} options={{ headerShown: true, headerTitle: 'Ayuda y contacto' }} />
  </Stack.Navigator>
);

const Tab = createBottomTabNavigator();

const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeMain" component={HomeScreen} />
    <Stack.Screen name="Stress" component={StressScreen} />
    <Stack.Screen name="Fatigue" component={FatigueScreen} />
    <Stack.Screen name="Insomnia" component={InsomniaScreen} />
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
