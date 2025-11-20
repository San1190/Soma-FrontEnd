import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TopBar = ({ onAvatarPress, variant = 'lock', active = false, onToggle }) => {
  return (
    <View style={styles.topBar}>
      <TouchableOpacity onPress={onAvatarPress} style={styles.avatar}><Ionicons name="person" size={20} color="#000" /></TouchableOpacity>
      {variant === 'lock' && (
        <TouchableOpacity onPress={onToggle} style={[styles.lock, active ? styles.lockOn : styles.lockOff]}>
          <Ionicons name="lock-closed" size={16} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  avatar: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.06)' },
  lock: { width: 48, height: 24, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  lockOn: { backgroundColor: '#4b3340' },
  lockOff: { backgroundColor: 'rgba(0,0,0,0.08)' },
});

export default TopBar;