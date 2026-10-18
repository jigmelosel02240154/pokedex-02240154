import { useEffect, useState } from 'react';

// Returns `value`, but only after it has stopped changing for `delay` ms.
export default function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer); // cancel if value changes again
  }, [value, delay]);

  return debounced;
}
