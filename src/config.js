// =====================================================
//  PERSONALISE THESE (required by the lab sheet)
// =====================================================
export const STUDENT_NAME = 'Pema';      // -> "Pema's Pokédex" in the header
export const STUDENT_NO = '02230123';    // your full student number

// Last three digits of the student number = where the list starts.
// e.g. 02230123 -> 123 -> list starts at offset 123 (Pokémon #124)
export const START_OFFSET = parseInt(STUDENT_NO.slice(-3), 10);

// Your own theme colours (dark theme)
export const THEME = {
  primary: '#7C4DFF',     // buttons
  accent: '#B39DFF',      // highlights: active tab, bars, scores
  background: '#0F0E17',  // screen background
  card: '#1B1A2B',        // cards, headers, tab bar
  text: '#F2F0FF',
  muted: '#9A97B5',
  border: '#2E2B47',
  success: '#34C27A',
  danger: '#EF5B5B',
  spotlight: '#EDE9FE',   // light panel behind the game silhouette
};
