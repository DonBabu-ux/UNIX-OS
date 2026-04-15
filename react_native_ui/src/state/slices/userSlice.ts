import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { storage } from '../../../local_storage/storage';

interface UserState {
  isAuthenticated: boolean;
  username: string | null;
  isPro: boolean;
  subscriptionId: string | null;
  expiryDate: string | null;
  setLogin: (username: string) => void;
  setProStatus: (status: boolean, id?: string, expiry?: string) => void;
  logout: () => void;
}

const zustandStorage = {
  getItem: (name: string) => storage.get(name) ?? null,
  setItem: (name: string, value: string) => storage.set(name, value),
  removeItem: (name: string) => storage.delete(name),
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      username: null,
      isPro: false,
      subscriptionId: null,
      expiryDate: null,
      setLogin: (username) => set({ isAuthenticated: true, username }),
      setProStatus: (isPro, subscriptionId = null, expiryDate = null) => 
        set({ isPro, subscriptionId, expiryDate }),
      logout: () => set({ 
        isAuthenticated: false, 
        username: null, 
        isPro: false, 
        subscriptionId: null, 
        expiryDate: null 
      }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
