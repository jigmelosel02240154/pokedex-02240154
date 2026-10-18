// All network calls live in this file.
const BASE_URL = 'https://pokeapi.co/api/v2';

export const PAGE_SIZE = 20;      // Pokémon loaded per page
export const MAX_POKEMON = 1025;  // ids above this are alternate forms
export const FIRST_GEN = 151;     // used by the game

export const STAT_ORDER = [
  'hp',
  'attack',
  'defense',
  'special-attack',
  'special-defense',
  'speed',
];

export const STAT_LABELS = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Sp. Atk',
  'special-defense': 'Sp. Def',
  speed: 'Speed',
};

export const artworkUrl = (id) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

// "https://pokeapi.co/api/v2/pokemon/25/" -> 25
const idFromUrl = (url) => Number(url.split('/').filter(Boolean).pop());
const toListItem = (item) => ({ id: idFromUrl(item.url), name: item.name });

async function request(path) {
  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`);
  } catch (e) {
    throw new Error('Could not connect. Please check your internet connection.');
  }
  if (!response.ok) {
    throw new Error(`Server error (${response.status}). Please try again.`);
  }
  return response.json();
}

// One page of the list -> [{ id, name }]
export async function fetchPokemonPage(offset, limit = PAGE_SIZE) {
  const data = await request(`/pokemon?offset=${offset}&limit=${limit}`);
  return data.results.map(toListItem);
}

// All names, used for searching. Cached after the first call.
let allNamesCache = null;
export async function fetchAllNames() {
  if (!allNamesCache) {
    const data = await request(`/pokemon?limit=${MAX_POKEMON}`);
    allNamesCache = data.results.map(toListItem);
  }
  return allNamesCache;
}

// First 151 Pokémon for the game. Cached.
let firstGenCache = null;
export async function fetchFirstGen() {
  if (!firstGenCache) {
    firstGenCache = await fetchPokemonPage(0, FIRST_GEN);
  }
  return firstGenCache;
}

// Details of one Pokémon, cleaned up for the UI.
export async function fetchPokemonDetail(id) {
  const d = await request(`/pokemon/${id}`);
  return {
    id: d.id,
    name: d.name,
    types: d.types.map((t) => t.type.name),
    height: d.height / 10, // decimetres -> metres
    weight: d.weight / 10, // hectograms -> kg
    stats: STAT_ORDER.map((key) => {
      const found = d.stats.find((s) => s.stat.name === key);
      return { name: key, value: found ? found.base_stat : 0 };
    }),
  };
}
