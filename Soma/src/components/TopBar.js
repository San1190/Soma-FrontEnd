import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const TopBar = ({ onAvatarPress, variant = 'lock', active = false, onToggle }) => {
  const { isSomaticMode, toggleSomaticMode, currentTheme } = useTheme();

  return (
    <View style={styles.topBar}>
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
      <View style={styles.rightSection}>
        <MaterialIcons
          name="spa"
          size={18}
          color={isSomaticMode ? currentTheme.primary : currentTheme.textSecondary}
        />
        <TouchableOpacity
          style={[
            styles.toggleTrack,
            isSomaticMode ? { backgroundColor: currentTheme.primary } : styles.toggleOff
          ]}
          onPress={toggleSomaticMode}
          activeOpacity={0.8}
        >
          <View style={[styles.toggleKnob, isSomaticMode ? styles.knobRight : styles.knobLeft]}>
            <MaterialIcons name="spa" size={14} color={isSomaticMode ? currentTheme.primary : '#999'} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={onAvatarPress} style={styles.avatar}>
          <Ionicons name="person" size={20} color="#000" />
        </TouchableOpacity>
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
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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