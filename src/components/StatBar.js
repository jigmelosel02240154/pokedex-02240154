import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { THEME } from '../config';

// One horizontal bar: label | value | filled track
export default function StatBar({ label, value, max = 200, color = THEME.accent }) {
  const percent = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${percent}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', marginVertical: 5 },
  label: { width: 70, color: THEME.muted, fontSize: 13, fontWeight: '600' },
  value: { width: 44, color: THEME.text, fontSize: 14, fontWeight: '700', textAlign: 'right', marginRight: 10 },
  track: { flex: 1, height: 10, borderRadius: 5, backgroundColor: THEME.border, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 5 },
});
