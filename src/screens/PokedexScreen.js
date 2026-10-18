import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import PokemonCard from '../components/PokemonCard';
import ErrorView from '../components/ErrorView';
import useDebounce from '../hooks/useDebounce';
import { fetchPokemonPage, fetchAllNames, PAGE_SIZE, MAX_POKEMON } from '../api';
import { START_OFFSET, THEME } from '../config';

export default function PokedexScreen({ navigation }) {
  // ---------------- Infinite scroll ----------------
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(START_OFFSET < MAX_POKEMON);
  const nextOffset = useRef(START_OFFSET); // where the next page starts
  const busy = useRef(false); // blocks double requests

  const loadMore = useCallback(async () => {
    if (busy.current || nextOffset.current >= MAX_POKEMON) return;
    busy.current = true;
    setLoading(true);
    setError(null);
    try {
      const limit = Math.min(PAGE_SIZE, MAX_POKEMON - nextOffset.current);
      const page = await fetchPokemonPage(nextOffset.current, limit);
      nextOffset.current += limit;
      // keep only Pokémon we do not already have -> no duplicates
      setItems((prev) => {
        const seen = new Set(prev.map((p) => p.id));
        return [...prev, ...page.filter((p) => !seen.has(p.id))];
      });
      if (nextOffset.current >= MAX_POKEMON) setHasMore(false);
    } catch (e) {
      setError(e.message || 'Something went wrong.');
    } finally {
      busy.current = false;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMore(); // first page
  }, [loadMore]);

  // ---------------- Search (all Pokémon, debounced) ----------------
  const [query, setQuery] = useState('');
  const term = query.trim().toLowerCase();
  const debouncedTerm = useDebounce(term, 400);
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const allNames = useRef(null);
  const latestTerm = useRef('');

  const runSearch = useCallback(async (t) => {
    latestTerm.current = t;
    if (!t) {
      setResults([]);
      setSearching(false);
      setSearchError(null);
      return;
    }
    setSearching(true);
    setSearchError(null);
    try {
      if (!allNames.current) allNames.current = await fetchAllNames();
      if (latestTerm.current !== t) return; // user typed something newer
      const needle = t.replace(/\s+/g, '-'); // "mr mime" -> "mr-mime"
      setResults(
        allNames.current.filter((p) => p.name.includes(needle) || String(p.id) === t)
      );
    } catch (e) {
      if (latestTerm.current === t) setSearchError(e.message || 'Search failed.');
    } finally {
      if (latestTerm.current === t) setSearching(false);
    }
  }, []);

  useEffect(() => {
    runSearch(debouncedTerm);
  }, [debouncedTerm, runSearch]);

  const isSearchMode = term.length > 0;
  const searchPending = isSearchMode && (term !== debouncedTerm || searching);

  // ---------------- Rendering ----------------
  const openDetail = useCallback(
    (id) => navigation.navigate('Detail', { id }),
    [navigation]
  );

  const renderItem = useCallback(
    ({ item }) => (
      <PokemonCard id={item.id} name={item.name} onPress={() => openDetail(item.id)} />
    ),
    [openDetail]
  );

  const renderFooter = () => {
    if (loading) return <ActivityIndicator style={styles.footer} color={THEME.primary} />;
    if (error) {
      return (
        <View style={styles.footer}>
          <Text style={styles.footerText}>⚠️ {error}</Text>
          <TouchableOpacity style={styles.retry} onPress={loadMore}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (!hasMore) return <Text style={styles.footerText}>You reached the end of the Pokédex.</Text>;
    return null;
  };

  let content;
  if (isSearchMode) {
    if (searchPending) {
      content = <ActivityIndicator style={styles.center} size="large" color={THEME.primary} />;
    } else if (searchError) {
      content = <ErrorView message={searchError} onRetry={() => runSearch(debouncedTerm)} />;
    } else {
      content = (
        <FlatList
          data={results}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.empty}>No Pokémon found for “{query.trim()}”.</Text>
          }
        />
      );
    }
  } else if (items.length === 0 && loading) {
    content = <ActivityIndicator style={styles.center} size="large" color={THEME.primary} />;
  } else if (items.length === 0 && error) {
    content = <ErrorView message={error} onRetry={loadMore} />;
  } else {
    content = (
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.list}
        onEndReached={() => {
          if (hasMore && !error) loadMore();
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <TextInput
          style={styles.input}
          placeholder="Search all Pokémon by name…"
          placeholderTextColor={THEME.muted}
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
          autoCapitalize="none"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')} hitSlop={10}>
            <Text style={styles.clear}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.background },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.card,
    margin: 16,
    marginBottom: 8,
    paddingHorizontal: 14,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  input: { flex: 1, height: 46, fontSize: 16, color: THEME.text },
  clear: { fontSize: 18, color: THEME.muted, paddingLeft: 8 },
  list: { paddingBottom: 24 },
  center: { flex: 1 },
  empty: { textAlign: 'center', color: THEME.muted, fontSize: 16, marginTop: 40, paddingHorizontal: 24 },
  footer: { paddingVertical: 20, alignItems: 'center' },
  footerText: { textAlign: 'center', color: THEME.muted, paddingVertical: 16 },
  retry: { backgroundColor: THEME.primary, paddingHorizontal: 22, paddingVertical: 8, borderRadius: 20 },
  retryText: { color: '#fff', fontWeight: '700' },
});
