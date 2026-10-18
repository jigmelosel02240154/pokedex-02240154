export const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// "mr-mime" -> "Mr Mime"
export const displayName = (name) => name.split('-').map(capitalize).join(' ');

// 7 -> "#007"
export const formatId = (id) => `#${String(id).padStart(3, '0')}`;

export const TYPE_COLORS = {
  normal: '#A8A77A',
  fire: '#EE8130',
  water: '#6390F0',
  electric: '#F7D02C',
  grass: '#7AC74C',
  ice: '#96D9D6',
  fighting: '#C22E28',
  poison: '#A33EA1',
  ground: '#E2BF65',
  flying: '#A98FF3',
  psychic: '#F95587',
  bug: '#A6B91A',
  rock: '#B6A136',
  ghost: '#735797',
  dragon: '#6F35FC',
  dark: '#705746',
  steel: '#B7B7CE',
  fairy: '#D685AD',
};
