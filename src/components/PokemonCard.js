import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { THEME } from '../config';
import { artworkUrl } from '../api';
import { displayName, formatId } from '../utils';

// Reusable card: image + number + name. `rightElement` lets a screen add
// its own button (e.g. "Remove" on the team screen).
function PokemonCard({ id, name, subtitle, onPress, rightElement }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Image
        source={{ uri: artworkUrl(id) }}
        style={styles.image}
        resizeMode="contain"
      />
      <View style={styles.info}>
        <Text style={styles.number}>{formatId(id)}</Text>
        <Text style={styles.name}>{displayName(name)}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {rightElement}
    </TouchableOpacity>
  );
}

export default React.memo(PokemonCard);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.card,
    borderRadius: 16,
    padding: 10,
    marginHorizontal: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  image: { width: 72, height: 72, borderRadius: 12, backgroundColor: THEME.background },
  info: { flex: 1, marginLeft: 14 },
  number: { color: THEME.muted, fontSize: 13, fontWeight: '600' },
  name: { color: THEME.text, fontSize: 18, fontWeight: '700' },
  subtitle: { color: THEME.muted, fontSize: 13, marginTop: 2 },
});
