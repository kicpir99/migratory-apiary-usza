import { describe, it, expect } from 'vitest';
import {
  readStorageJson,
  writeStorageJson,
  readStorageString,
  writeStorageString,
  removeStorageItem,
} from '../utils/storage';

function createMemoryStorage(shouldThrow = false): Storage {
  const store = new Map<string, string>();
  return {
    get length() {
      return store.size;
    },
    clear() {
      store.clear();
    },
    getItem(key: string) {
      if (shouldThrow) throw new Error('Access denied');
      return store.has(key) ? store.get(key)! : null;
    },
    key(index: number) {
      return Array.from(store.keys())[index] ?? null;
    },
    removeItem(key: string) {
      if (shouldThrow) throw new Error('Access denied');
      store.delete(key);
    },
    setItem(key: string, value: string) {
      if (shouldThrow) throw new Error('QuotaExceededError');
      store.set(key, value);
    },
  };
}

describe('utils/storage', () => {
  it('reads and writes JSON safely', () => {
    const storage = createMemoryStorage();
    writeStorageJson(storage, 'cart', [{ id: 'lipowy', qty: 2 }]);

    expect(readStorageJson(storage, 'cart', [])).toEqual([{ id: 'lipowy', qty: 2 }]);
    expect(readStorageJson(storage, 'missing', { empty: true })).toEqual({ empty: true });
  });

  it('returns fallback on corrupted JSON or throwing storage', () => {
    const storage = createMemoryStorage();
    storage.setItem('bad', '{not-valid-json');
    expect(readStorageJson(storage, 'bad', { safe: true })).toEqual({ safe: true });

    const broken = createMemoryStorage(true);
    expect(() => writeStorageJson(broken, 'k', { a: 1 })).not.toThrow();
    expect(readStorageJson(broken, 'k', 'fallback')).toBe('fallback');
    expect(readStorageString(broken, 'k', 'default')).toBe('default');
    expect(() => writeStorageString(broken, 'k', 'v')).not.toThrow();
    expect(() => removeStorageItem(broken, 'k')).not.toThrow();
  });

  it('handles string operations and undefined storage', () => {
    const storage = createMemoryStorage();
    writeStorageString(storage, 'flag', 'true');
    expect(readStorageString(storage, 'flag')).toBe('true');
    removeStorageItem(storage, 'flag');
    expect(readStorageString(storage, 'flag', 'false')).toBe('false');
    expect(readStorageJson(undefined, 'x', 42)).toBe(42);
  });
});
