const LS = {
  get<T = unknown>(key: string): T | null {
    if (typeof window === 'undefined') return null;
    try {
      return JSON.parse(window.localStorage.getItem(key) || 'null') as T;
    } catch {
      return null;
    }
  },
  set<T = unknown>({ key, payload }: { key: string; payload: T }): void {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(key, JSON.stringify(payload));
  },
  remove(key: string): void {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(key);
  },
  clear(): void {
    if (typeof window === 'undefined') return;
    window.localStorage.clear();
  },
};

export default LS;
