import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import StatBar from '../components/StatBar';
import TypeBadge from '../components/TypeBadge';
import ErrorView from '../components/ErrorView';
import { useTeam, MAX_TEAM } from '../context/TeamContext';
import { fetchPokemonDetail, artworkUrl, STAT_LABELS } from '../api';
import { displayName, formatId } from '../utils';
import { THEME } from '../config';

export default function DetailScreen({ route, navigation }) {
  const { id } = route.params; // received through route params
  const { isInTeam, isFull, addToTeam, removeFromTeam } = useTeam();

  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setPokemon(await fetchPokemonDetail(id));
    } catch (e) {
      setError(e.message || 'Could not load this Pokémon.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (pokemon) navigation.setOptions({ title: displayName(pokemon.name) });
  }, [pokemon, navigation]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={THEME.primary} />
      </View>
    );
  }
  if (error || !pokemon) {
    return <ErrorView message={error} onRetry={load} />;
  }

  const inTeam = isInTeam(pokemon.id);
  const disabled = !inTeam && isFull;

  let buttonLabel = 'Add to team';
  if (inTeam) buttonLabel = 'Remove from team';
  else if (disabled) buttonLabel = `Team is full (${MAX_TEAM}/${MAX_TEAM})`;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Image source={{ uri: artworkUrl(pokemon.id) }} style={styles.image} resizeMode="contain" />
      <Text style={styles.number}>{formatId(pokemon.id)}</Text>
      <Text style={styles.name}>{displayName(pokemon.name)}</Text>

      <View style={styles.types}>
        {pokemon.types.map((t) => (
          <TypeBadge key={t} type={t} />
        ))}
      </View>

      <View style={styles.measures}>
        <View style={styles.measure}>
          <Text style={styles.measureValue}>{pokemon.height} m</Text>
          <Text style={styles.measureLabel}>Height</Text>
        </View>
        <View style={styles.measure}>
          <Text style={styles.measureValue}>{pokemon.weight} kg</Text>
          <Text style={styles.measureLabel}>Weight</Text>
        </View>
      </View>

      <View style={styles.statsBox}>
        <Text style={styles.sectionTitle}>Base stats</Text>
        {pokemon.stats.map((s) => (
          <StatBar key={s.name} label={STAT_LABELS[s.name]} value={s.value} max={200} />
        ))}
      </View>

      <TouchableOpacity
        style={[styles.button, inTeam && styles.buttonRemove, disabled && styles.buttonDisabled]}
        disabled={disabled}
        onPress={() => (inTeam ? removeFromTeam(pokemon.id) : addToTeam(pokemon))}
      >
        <Text style={styles.buttonText}>{buttonLabel}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.background },
  content: { alignItems: 'center', padding: 20, paddingBottom: 40 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: THEME.background },
  image: { width: 240, height: 240 },
  number: { color: THEME.muted, fontWeight: '600', fontSize: 15 },
  name: { color: THEME.text, fontSize: 30, fontWeight: '800', marginBottom: 10 },
  types: { flexDirection: 'row', marginBottom: 16 },
  measures: { flexDirection: 'row', marginBottom: 16 },
  measure: {
    alignItems: 'center',
    backgroundColor: THEME.card,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 28,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  measureValue: { fontSize: 18, fontWeight: '700', color: THEME.text },
  measureLabel: { fontSize: 12, color: THEME.muted, marginTop: 2 },
  statsBox: {
    alignSelf: 'stretch',
    backgroundColor: THEME.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: THEME.text, marginBottom: 6 },
  button: { alignSelf: 'stretch', backgroundColor: THEME.primary, padding: 16, borderRadius: 28, alignItems: 'center' },
  buttonRemove: { backgroundColor: THEME.danger },
  buttonDisabled: { backgroundColor: '#B8B5C6' },
  buttonText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
