import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STAT_ORDER } from '../api';

export const MAX_TEAM = 6;
const STORAGE_KEY = '@pokedex/team';

const TeamContext = createContext(null);

export function TeamProvider({ children }) {
  const [team, setTeam] = useState([]);
  const [loaded, setLoaded] = useState(false);

  // 1) Load the saved team once when the app starts
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const saved = JSON.parse(raw);
          if (Array.isArray(saved)) setTeam(saved.slice(0, MAX_TEAM));
        }
      } catch (e) {
        console.warn('Could not load team', e);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  // 2) Save every time the team changes (but never before the load has finished,
  //    otherwise the empty starting team would overwrite the saved one)
  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(team)).catch((e) =>
      console.warn('Could not save team', e)
    );
  }, [team, loaded]);

  const addToTeam = useCallback((pokemon) => {
    setTeam((prev) => {
      if (prev.length >= MAX_TEAM) return prev; // full
      if (prev.some((m) => m.id === pokemon.id)) return prev; // no duplicates
      return [
        ...prev,
        {
          id: pokemon.id,
          name: pokemon.name,
          types: pokemon.types,
          stats: pokemon.stats,
        },
      ];
    });
  }, []);

  const removeFromTeam = useCallback((id) => {
    setTeam((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const isInTeam = useCallback((id) => team.some((m) => m.id === id), [team]);

  // Combined base stats of the whole team
  const totals = useMemo(
    () =>
      STAT_ORDER.map((key) => ({
        name: key,
        value: team.reduce((sum, member) => {
          const stat = member.stats.find((s) => s.name === key);
          return sum + (stat ? stat.value : 0);
        }, 0),
      })),
    [team]
  );

  const value = useMemo(
    () => ({
      team,
      loaded,
      isFull: team.length >= MAX_TEAM,
      totals,
      addToTeam,
      removeFromTeam,
      isInTeam,
    }),
    [team, loaded, totals, addToTeam, removeFromTeam, isInTeam]
  );

  return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>;
}

export function useTeam() {
  const ctx = useContext(TeamContext);
  if (!ctx) throw new Error('useTeam must be used inside <TeamProvider>');
  return ctx;
}
