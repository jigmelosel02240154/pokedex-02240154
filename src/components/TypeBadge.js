import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { TYPE_COLORS, capitalize } from '../utils';

export default function TypeBadge({ type }) {
  return (
    <Text style={[styles.badge, { backgroundColor: TYPE_COLORS[type] || '#888' }]}>
      {capitalize(type)}
    </Text>
  );
}

const styles = StyleSheet.create({
  badge: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 6,
  },
});
