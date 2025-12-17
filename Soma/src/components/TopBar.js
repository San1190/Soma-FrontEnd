import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TopBar = ({ onAvatarPress, onBackPress, variant = 'lock', active = false, onToggle, showBack = false }) => {
  return (
    <View style={styles.topBar}>
      {/* Left Section: Back button or Avatar */}
      <View style={styles.leftSection}>
        {showBack ? (
          <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={onAvatarPress} style={styles.avatar}>
            <Ionicons name="person" size={20} color="#000" />
          </TouchableOpacity>
        )}
      </View>

      {/* Right Section: Only Lock toggle (removed Soma toggle) */}
      <View style={styles.rightSection}>
        {variant === 'lock' && (
          <TouchableOpacity
            style={[
              styles.toggleTrack,
              active ? { backgroundColor: '#4b3340' } : styles.toggleOff
            ]}
            onPress={onToggle}
            activeOpacity={0.8}
          >
            <View style={[styles.toggleKnob, active ? styles.knobRight : styles.knobLeft]}>
              <Ionicons name="lock-closed" size={14} color={active ? '#4b3340' : '#999'} />
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleTrack: {
    width: 54,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    paddingHorizontal: 3,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2
  },
  toggleOff: {
    backgroundColor: '#E0E0E0'
  },
  toggleKnob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 3
  },
  knobLeft: {
    alignSelf: 'flex-start'
  },
  knobRight: {
    alignSelf: 'flex-end'
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.06)'
  },
});

export default TopBar;