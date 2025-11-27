import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

const FooterNav = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const name = route.name;
  const isHome = name === 'HomeMain';
  const tab = route.params?.tab;
  const isStress = name === 'Stress';
  const isFatigue = name === 'Fatigue';
  const activeHome = isHome && (tab === 'boton' || !tab);
  const activeHydra = isHome && tab === 'hidratacion';
  const activeActivity = isHome && tab === 'actividad';
  const activeEspejo = isHome && tab === 'espejo';
  const colors = {
    accentHome: '#DDEAF1',
    accentStress: '#CFC4E9',
    iconDefault: '#fff',
  };

  return (
    <View style={styles.footerPlaceholder}>
      <View style={styles.footerIcons}>
        <TouchableOpacity onPress={() => navigation.navigate('HomeMain', { tab: 'boton' })} style={[styles.iconWrap, activeHome && styles.active]}>
          <Ionicons name="home" size={24} color={activeHome ? colors.accentHome : colors.iconDefault} />
          {activeHome && <View style={styles.indicator} />}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('HomeMain', { tab: 'hidratacion' })} style={[styles.iconWrap, activeHydra && styles.active]}>
          <Ionicons name="time" size={24} color={activeHydra ? colors.accentHome : colors.iconDefault} />
          {activeHydra && <View style={styles.indicator} />}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Stress')} style={[styles.iconWrap, isStress && styles.active]}>
          <Ionicons name="heart" size={24} color={isStress ? colors.accentStress : colors.iconDefault} />
          {isStress && <View style={[styles.indicator, { backgroundColor: colors.accentStress }]} />}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('HomeMain', { tab: 'actividad' })} style={[styles.iconWrap, activeActivity && styles.active]}>
          <Ionicons name="moon" size={24} color={activeActivity ? colors.accentHome : colors.iconDefault} />
          {activeActivity && <View style={styles.indicator} />}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Fatigue')} style={[styles.iconWrap, (activeEspejo || isFatigue) && styles.active]}>
          <Ionicons name="eye" size={24} color={(activeEspejo || isFatigue) ? '#CFF3C9' : colors.iconDefault} />
          {(activeEspejo || isFatigue) && <View style={styles.indicator} />}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footerPlaceholder: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 100, backgroundColor: '#000', borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingTop: 12, zIndex: 100 },
  footerIcons: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '86%', alignSelf: 'center', paddingBottom: Platform.OS === 'ios' ? 12 : 6 },
  iconWrap: { opacity: 0.7, padding: 10, borderRadius: 18, alignItems: 'center' },
  active: { opacity: 1, backgroundColor: 'rgba(255,255,255,0.10)' },
  indicator: { width: 28, height: 4, borderRadius: 2, backgroundColor: '#fff', marginTop: 6 },
});

export default FooterNav;
