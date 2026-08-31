const isLocalStorageAvailable = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};

const memoryStore: Record<string, unknown> = {};

export function generateId(): string {
  return 'id_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

export function readData<T = unknown>(key: string, fallback: T): T {
  const hasLS = isLocalStorageAvailable();

  if (hasLS) {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null && raw !== undefined) {
        return JSON.parse(raw) as T;
      }
    } catch {
      // ignore
    }
  } else {
    if (memoryStore[key] !== undefined) {
      return JSON.parse(JSON.stringify(memoryStore[key])) as T;
    }
  }

  return JSON.parse(JSON.stringify(fallback)) as T;
}

export function writeData<T = unknown>(key: string, data: T): void {
  const hasLS = isLocalStorageAvailable();
  const serialized = JSON.stringify(data);

  if (hasLS) {
    try {
      window.localStorage.setItem(key, serialized);
    } catch {
      // ignore
    }
  } else {
    memoryStore[key] = JSON.parse(serialized);
  }
}
