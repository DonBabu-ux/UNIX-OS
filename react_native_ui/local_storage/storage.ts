import { MMKV } from 'react-native-mmkv';
import { Platform } from 'react-native';

// Defensive check for MMKV initialization
const getNativeStorage = () => {
  try {
    if (Platform.OS !== 'web') return new MMKV();
  } catch (e) {
    console.warn('MMKV initialization failed, falling back to mock storage', e);
  }
  return null;
};

const mmkv = getNativeStorage();

const webStorage = typeof window !== 'undefined' ? window.localStorage : null;

export const storage = {
  getItem: (key: string): string | null => {
    if (mmkv) return mmkv.getString(key) || null;
    if (webStorage) return webStorage.getItem(key);
    return null;
  },
  setItem: (key: string, value: string): void => {
    if (mmkv) mmkv.set(key, value);
    else if (webStorage) webStorage.setItem(key, value);
  },
  removeItem: (key: string): void => {
    if (mmkv) mmkv.delete(key);
    else if (webStorage) webStorage.removeItem(key);
  },
  // Legacy aliases
  get: (key: string) => mmkv ? mmkv.getString(key) : webStorage?.getItem(key),
  set: (key: string, value: string) => mmkv ? mmkv.set(key, value) : webStorage?.setItem(key, value),
  delete: (key: string) => mmkv ? mmkv.delete(key) : webStorage?.removeItem(key),
};
