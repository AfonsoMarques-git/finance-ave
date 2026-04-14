import { useState, useEffect } from 'react';

const PREFIX = 'financas_ave_';

export function useLocalStorage(key, initialValue) {
  const fullKey = PREFIX + key;

  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(fullKey);
      return stored !== null ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(fullKey, JSON.stringify(value));
    } catch (e) {
      console.error('localStorage write failed for key:', key, e);
    }
  }, [fullKey, value]);

  return [value, setValue];
}
