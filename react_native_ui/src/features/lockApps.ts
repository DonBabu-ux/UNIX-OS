import { storage } from '../../local_storage/storage';

const LOCK_PREFIX = 'lock_';

export const lockApp = (packageName: string, pin: string) => {
  storage.set(`${LOCK_PREFIX}${packageName}`, pin);
};

export const unlockApp = (packageName: string, pinInput: string): boolean => {
  const savedPin = storage.get(`${LOCK_PREFIX}${packageName}`);
  return savedPin === pinInput;
};

export const isAppLocked = (packageName: string): boolean => {
  return !!storage.get(`${LOCK_PREFIX}${packageName}`);
};
