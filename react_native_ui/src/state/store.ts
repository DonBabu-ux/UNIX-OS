import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { storage } from '../../local_storage/storage';

// Combine stores or create specialized hook integrations
// For production, we use the persist middleware to sync with local_storage

export { useAppsStore } from './slices/appsSlice';
export { useLayoutStore } from './slices/layoutSlice';
export { useSettingsStore } from './slices/settingsSlice';
export { useUserStore } from './slices/userSlice';
