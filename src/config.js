// =====================================================
//  PERSONALISE THESE (required by the lab sheet)
// =====================================================
export const STUDENT_NAME = 'Jigme Losel';      // -> "Pema's Pokédex" in the header
export const STUDENT_NO = '02240154';    // your full student number

// Last three digits of the student number = where the list starts.
// e.g. 02230123 -> 123 -> list starts at offset 123 (Pokémon #124)
export const START_OFFSET = parseInt(STUDENT_NO.slice(-3), 10);

// Your own theme colours - change them so your app looks different from the prototype
export const THEME = {
  primary: '#7C3AED',
  primaryDark: '#5B21B6',
  background: '#F5F3FF',
  card: '#FFFFFF',
  text: '#1F1B2E',
  muted: '#6B6880',
  border: '#E4DFF5',
  success: '#2E9E5B',
  danger: '#D64545',
};
