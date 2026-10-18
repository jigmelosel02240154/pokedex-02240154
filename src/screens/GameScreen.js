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
import AsyncStorage from '@react-native-async-storage/async-storage';
import ErrorView from '../components/ErrorView';
import { fetchFirstGen, artworkUrl } from '../api';
import { displayName } from '../utils';
import { THEME } from '../config';

const BEST_KEY = '@pokedex/best-streak';

function shuffle(list) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// One round = 1 correct Pokémon + 3 wrong ones, all shuffled
function makeRound(pool) {
  const answer = pool[Math.floor(Math.random() * pool.length)];
  const wrong = shuffle(pool.filter((p) => p.id !== answer.id)).slice(0, 3);
  return { answer, options: shuffle([answer, ...wrong]) };
}

export default function GameScreen() {
  const [pool, setPool] = useState([]);
  const [round, setRound] = useState(null);
  const [selected, setSelected] = useState(null); // id the user tapped
  const [removed, setRemoved] = useState([]); // ids hidden by the hint
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageLoading, setImageLoading] = useState(true);

  const startRound = useCallback((list) => {
    setRound(makeRound(list));
    setSelected(null);
    setRemoved([]);
    setImageLoading(true);
  }, []);

  const init = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await fetchFirstGen();
      setPool(list);
      startRound(list);
    } catch (e) {
      setError(e.message || 'Could not load the game.');
    } finally {
      setLoading(false);
    }
  }, [startRound]);

  useEffect(() => {
    init();
    AsyncStorage.getItem(BEST_KEY)
      .then((v) => v && setBest(Number(v) || 0))
      .catch(() => {});
  }, [init]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={THEME.primary} />
      </View>
    );
  }
  if (error || !round) return <ErrorView message={error} onRetry={init} />;

  const answered = selected !== null;

  const choose = (option) => {
    if (answered) return;
    setSelected(option.id);
    if (option.id === round.answer.id) {
      const newStreak = streak + 1;
      setScore((s) => s + 1);
      setStreak(newStreak);
      if (newStreak > best) {
        setBest(newStreak);
        AsyncStorage.setItem(BEST_KEY, String(newStreak)).catch(() => {});
      }
    } else {
      setStreak(0);
    }
  };

  // OWN FEATURE: hint button -> removes two wrong answers
  const giveHint = () => {
    if (answered || removed.length > 0) return;
    const wrong = round.options.filter((o) => o.id !== round.answer.id);
    setRemoved(shuffle(wrong).slice(0, 2).map((o) => o.id));
  };

  const buttonStyle = (option) => {
    if (answered) {
      if (option.id === round.answer.id) return styles.correct; // always show right one green
      if (option.id === selected) return styles.wrong; // wrong pick red
      return styles.optionDim;
    }
    return removed.includes(option.id) ? styles.optionDim : null;
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.scoreRow}>
        <View style={styles.scoreBox}>
          <Text style={styles.scoreValue}>{score}</Text>
          <Text style={styles.scoreLabel}>Score</Text>
        </View>
        <View style={styles.scoreBox}>
          <Text style={styles.scoreValue}>{streak}</Text>
          <Text style={styles.scoreLabel}>Streak</Text>
        </View>
        <View style={styles.scoreBox}>
          <Text style={styles.scoreValue}>{best}</Text>
          <Text style={styles.scoreLabel}>Best</Text>
        </View>
      </View>

      <Text style={styles.title}>Who’s That Pokémon?</Text>

      <View style={styles.imageBox}>
        <Image
          source={{ uri: artworkUrl(round.answer.id) }}
          // black silhouette until answered
          style={[styles.image, !answered && { tintColor: '#000' }]}
          resizeMode="contain"
          onLoadStart={() => setImageLoading(true)}
          onLoadEnd={() => setImageLoading(false)}
        />
        {imageLoading && <ActivityIndicator style={styles.spinner} color={THEME.primary} />}
      </View>

      {round.options.map((option) => (
        <TouchableOpacity
          key={option.id}
          style={[styles.option, buttonStyle(option)]}
          disabled={answered || removed.includes(option.id)}
          onPress={() => choose(option)}
        >
          <Text style={styles.optionText}>{displayName(option.name)}</Text>
        </TouchableOpacity>
      ))}

      {answered ? (
        <>
          <Text style={styles.result}>
            {selected === round.answer.id
              ? '✅ Correct!'
              : `❌ It was ${displayName(round.answer.name)}`}
          </Text>
          <TouchableOpacity style={styles.next} onPress={() => startRound(pool)}>
            <Text style={styles.nextText}>Next</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity
          style={[styles.hint, removed.length > 0 && styles.hintUsed]}
          disabled={removed.length > 0}
          onPress={giveHint}
        >
          <Text style={styles.hintText}>💡 Hint (remove 2 wrong answers)</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.background },
  content: { padding: 20, paddingBottom: 40 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: THEME.background },
  scoreRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  scoreBox: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: THEME.card,
    borderRadius: 14,
    paddingVertical: 10,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  scoreValue: { fontSize: 22, fontWeight: '800', color: THEME.accent },
  scoreLabel: { fontSize: 12, color: THEME.muted },
  title: { fontSize: 22, fontWeight: '800', color: THEME.text, textAlign: 'center', marginBottom: 8 },
  imageBox: {
    height: 260,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderRadius: 24,
    backgroundColor: THEME.spotlight, // light panel so the black silhouette is visible
  },
  image: { width: 240, height: 240 },
  spinner: { position: 'absolute' },
  option: {
    backgroundColor: THEME.card,
    borderWidth: 2,
    borderColor: THEME.border,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginVertical: 5,
  },
  optionText: { fontSize: 18, fontWeight: '700', color: THEME.text },
  optionDim: { opacity: 0.35 },
  correct: { backgroundColor: '#12382A', borderColor: THEME.success },
  wrong: { backgroundColor: '#42181C', borderColor: THEME.danger },
  result: { textAlign: 'center', fontSize: 18, fontWeight: '700', color: THEME.text, marginTop: 14 },
  next: { backgroundColor: THEME.primary, borderRadius: 28, padding: 15, alignItems: 'center', marginTop: 12 },
  nextText: { color: '#fff', fontWeight: '700', fontSize: 17 },
  hint: { alignSelf: 'center', marginTop: 14, paddingVertical: 10, paddingHorizontal: 18, borderRadius: 20, borderWidth: 1, borderColor: THEME.accent },
  hintUsed: { opacity: 0.4 },
  hintText: { color: THEME.accent, fontWeight: '700' },
});
