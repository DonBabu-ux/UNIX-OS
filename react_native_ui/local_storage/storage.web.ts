// Web-compatible storage using localStorage
export const storage = {
  get: (key: string): string | undefined => {
    try {
      return localStorage.getItem(key) ?? undefined;
    } catch {
      return undefined;
    }
  },
  set: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch {}
  },
  delete: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch {}
  },
};
