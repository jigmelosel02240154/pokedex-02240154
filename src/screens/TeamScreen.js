import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import PokemonCard from '../components/PokemonCard';
import StatBar from '../components/StatBar';
import { useTeam, MAX_TEAM } from '../context/TeamContext';
import { STAT_LABELS } from '../api';
import { capitalize } from '../utils';
import { THEME } from '../config';

export default function TeamScreen({ navigation }) {
  const { team, totals, removeFromTeam } = useTeam();
  const grandTotal = totals.reduce((sum, t) => sum + t.value, 0);

  const header = (
    <View style={styles.summary}>
      <Text style={styles.count}>
        Team {team.length}/{MAX_TEAM}
      </Text>
      {team.length > 0 && (
        <>
          <Text style={styles.sub}>Combined base stats</Text>
          {totals.map((t) => (
            <StatBar
              key={t.name}
              label={STAT_LABELS[t.name]}
              value={t.value}
              max={team.length * 200}
              color={THEME.primaryDark}
            />
          ))}
          <Text style={styles.total}>Total: {grandTotal}</Text>
        </>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={team}
        keyExtractor={(m) => String(m.id)}
        ListHeaderComponent={header}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>
            Your team is empty.{'\n'}Open a Pokémon and tap “Add to team”.
          </Text>
        }
        renderItem={({ item }) => (
          <PokemonCard
            id={item.id}
            name={item.name}
            subtitle={item.types.map(capitalize).join(' · ')}
            onPress={() => navigation.navigate('Detail', { id: item.id })}
            rightElement={
              <TouchableOpacity style={styles.remove} onPress={() => removeFromTeam(item.id)}>
                <Text style={styles.removeText}>Remove</Text>
              </TouchableOpacity>
            }
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.background },
  list: { paddingBottom: 24 },
  summary: {
    backgroundColor: THEME.card,
    margin: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  count: { fontSize: 24, fontWeight: '800', color: THEME.text },
  sub: { color: THEME.muted, marginTop: 4, marginBottom: 8, fontWeight: '600' },
  total: { marginTop: 8, fontWeight: '700', color: THEME.text, textAlign: 'right' },
  empty: { textAlign: 'center', color: THEME.muted, fontSize: 16, lineHeight: 24, marginTop: 24 },
  remove: { backgroundColor: THEME.danger, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16 },
  removeText: { color: '#fff', fontWeight: '700', fontSize: 13 },
});
