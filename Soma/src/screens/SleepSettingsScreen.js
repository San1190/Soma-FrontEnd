import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform, Switch } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import API_BASE_URL from '../constants/api';

const SleepSettingsScreen = () => {
  const { user } = useAuth();
  const { currentTheme } = useTheme();
  const [start, setStart] = useState('22:00');
  const [end, setEnd] = useState('06:30');
  const [days, setDays] = useState(['1','2','3','4','5','6','7']);
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [configId, setConfigId] = useState(null);

  const load = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/alarm-config/user/${user?.id}`);
      const list = await res.json();
      const cfg = list && list.length ? list[0] : null;
      if (cfg) {
        setStart(cfg.windowStartTime || start);
        setEnd(cfg.windowEndTime || end);
        setDays((cfg.daysOfWeek || '1,2,3,4,5,6,7').split(','));
        setEnabled(Boolean(cfg.enabled));
        setConfigId(cfg.id || cfg.config_id || null);
      }
    } catch {}
  };

  useEffect(() => { load(); }, [user?.id]);

  const save = async () => {
    setLoading(true);
    try {
      const payload = { user: { user_id: user.id }, windowStartTime: start, windowEndTime: end, daysOfWeek: days.join(','), enabled };
      if (configId) {
        await fetch(`${API_BASE_URL}/alarm-config/${configId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      } else {
        await fetch(`${API_BASE_URL}/alarm-config`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      }
    } catch {} finally { setLoading(false); }
  };

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <Text style={[styles.title, { color: currentTheme.textPrimary }]}>Configuración de Sueño</Text>
      <View style={[styles.card, { backgroundColor: currentTheme.cardBackground, borderColor: currentTheme.borderColor }]}>
        <Text style={[styles.label, { color: currentTheme.textSecondary }]}>Inicio</Text>
        {Platform.OS === 'web' ? (
          <TextInput style={[styles.input, { color: currentTheme.textPrimary, borderColor: currentTheme.borderColor }]} value={start} onChangeText={setStart} placeholder="HH:MM" />
        ) : (
          <TouchableOpacity style={[styles.input, { justifyContent:'center' }]} onPress={() => setShowStartPicker(true)}>
            <Text style={{ color: currentTheme.textPrimary }}>{start}</Text>
          </TouchableOpacity>
        )}
        {showStartPicker && (
          <DateTimePicker value={new Date()} mode="time" display="default" onChange={(e, d) => { setShowStartPicker(false); if (d) { const hh = String(d.getHours()).padStart(2,'0'); const mm = String(d.getMinutes()).padStart(2,'0'); setStart(`${hh}:${mm}`); } }} />
        )}

        <Text style={[styles.label, { color: currentTheme.textSecondary }]}>Fin</Text>
        {Platform.OS === 'web' ? (
          <TextInput style={[styles.input, { color: currentTheme.textPrimary, borderColor: currentTheme.borderColor }]} value={end} onChangeText={setEnd} placeholder="HH:MM" />
        ) : (
          <TouchableOpacity style={[styles.input, { justifyContent:'center' }]} onPress={() => setShowEndPicker(true)}>
            <Text style={{ color: currentTheme.textPrimary }}>{end}</Text>
          </TouchableOpacity>
        )}
        {showEndPicker && (
          <DateTimePicker value={new Date()} mode="time" display="default" onChange={(e, d) => { setShowEndPicker(false); if (d) { const hh = String(d.getHours()).padStart(2,'0'); const mm = String(d.getMinutes()).padStart(2,'0'); setEnd(`${hh}:${mm}`); } }} />
        )}

        <Text style={[styles.label, { color: currentTheme.textSecondary }]}>Días</Text>
        <View style={{ flexDirection:'row', flexWrap:'wrap', gap:8 }}>
          {['1','2','3','4','5','6','7'].map(d => (
            <TouchableOpacity key={d} style={[styles.dayPill, { backgroundColor: days.includes(d) ? currentTheme.primary : currentTheme.cardBackground, borderColor: currentTheme.borderColor }]} onPress={() => setDays(prev => prev.includes(d) ? prev.filter(x=>x!==d) : [...prev, d])}>
              <Text style={{ color: '#071220' }}>{d}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ flexDirection:'row', alignItems:'center', marginTop:12 }}>
          <Text style={{ color: currentTheme.textSecondary, marginRight:8 }}>Habilitado</Text>
          <Switch value={enabled} onValueChange={setEnabled} />
        </View>

        <TouchableOpacity style={[styles.btn, { backgroundColor: currentTheme.primary, opacity: loading ? 0.6 : 1 }]} onPress={save} disabled={loading}><Text style={styles.btnText}>Guardar</Text></TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  card: { borderRadius: 14, padding: 14, borderWidth: 1 },
  label: { marginTop: 8 },
  input: { borderWidth: 1, borderRadius: 10, padding: 10, marginTop: 4 },
  btn: { marginTop: 12, paddingVertical: 10, borderRadius: 10, alignItems:'center' },
  btnText: { color: '#071220', fontWeight: '600' },
});

export default SleepSettingsScreen;
