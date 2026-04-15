import { MMKV } from 'react-native-mmkv';

const mmkv = new MMKV();

export const storage = {
  get: (key: string): string | undefined => {
    return mmkv.getString(key);
  },
  set: (key: string, value: string): void => {
    mmkv.set(key, value);
  },
  delete: (key: string): void => {
    mmkv.delete(key);
  },
};
