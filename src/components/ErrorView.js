import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { THEME } from '../config';

export default function ErrorView({ message, onRetry }) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>⚠️</Text>
      <Text style={styles.message}>{message}</Text>
      <TouchableOpacity style={styles.button} onPress={onRetry}>
        <Text style={styles.buttonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  icon: { fontSize: 40, marginBottom: 8 },
  message: { color: THEME.text, fontSize: 16, textAlign: 'center', marginBottom: 16 },
  button: { backgroundColor: THEME.primary, paddingHorizontal: 28, paddingVertical: 12, borderRadius: 24 },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
