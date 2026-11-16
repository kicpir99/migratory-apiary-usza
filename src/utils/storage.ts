/**
 * Safe wrappers around Web Storage (`localStorage` / `sessionStorage`).
 * Gracefully handle private-browsing restrictions, quota errors, and corrupted JSON.
 */

export function readStorageJson<T>(storage: Storage | undefined, key: string, fallback: T): T {
  if (!storage) return fallback;
  try {
    const raw = storage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeStorageJson(storage: Storage | undefined, key: string, value: unknown): void {
  if (!storage) return;
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore quota / private-browsing storage errors
  }
}

export function readStorageString(
  storage: Storage | undefined,
  key: string,
  fallback: string | null = null
): string | null {
  if (!storage) return fallback;
  try {
    const val = storage.getItem(key);
    return val === null ? fallback : val;
  } catch {
    return fallback;
  }
}

export function writeStorageString(storage: Storage | undefined, key: string, value: string): void {
  if (!storage) return;
  try {
    storage.setItem(key, value);
  } catch {
    // Ignore storage errors
  }
}

export function removeStorageItem(storage: Storage | undefined, key: string): void {
  if (!storage) return;
  try {
    storage.removeItem(key);
  } catch {
    // Ignore storage errors
  }
}
