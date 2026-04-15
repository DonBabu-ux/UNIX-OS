import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { storage } from '../../../local_storage/storage';

export type SystemMode = 'user' | 'admin' | 'system';
export type ModalType = 'INFO' | 'CONFIRM' | 'ADMIN_AUTH' | 'ADMIN_CONTROL' | 'ERROR';

export interface SystemModal {
  type: ModalType;
  id: string;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  module?: 'SECURITY' | 'CLOUD' | 'LAUNCH' | 'PULSE'; // For ADMIN_CONTROL
  data?: any;
}

interface SystemState {
  systemMode: SystemMode;
  isAdminAuthenticated: boolean;
  modalStack: SystemModal[];
  
  // Actions
  setSystemMode: (mode: SystemMode) => void;
  setAdminAuth: (status: boolean) => void;
  openModal: (modal: Omit<SystemModal, 'id'>) => void;
  closeModal: (id?: string) => void;
  clearModals: () => void;
}

const zustandStorage = {
  getItem: (name: string) => storage.get(name) ?? null,
  setItem: (name: string, value: string) => storage.set(name, value),
  removeItem: (name: string) => storage.delete(name),
};

export const useSystemStore = create<SystemState>()(
  persist(
    (set) => ({
      systemMode: 'user',
      isAdminAuthenticated: false,
      modalStack: [],

      setSystemMode: (systemMode) => set({ systemMode }),
      
      setAdminAuth: (isAdminAuthenticated) => set({ 
        isAdminAuthenticated,
        systemMode: isAdminAuthenticated ? 'admin' : 'user'
      }),

      openModal: (modal) => set((state) => ({
        modalStack: [...state.modalStack, { ...modal, id: Math.random().toString(36).substr(2, 9) }]
      })),

      closeModal: (id) => set((state) => ({
        modalStack: id ? state.modalStack.filter(m => m.id !== id) : state.modalStack.slice(0, -1)
      })),

      clearModals: () => set({ modalStack: [] }),
    }),
    {
      name: 'system-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
