import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface FolderItem {
  id: string;
  name: string;
  apps: string[]; // Package names
  iconColor: string;
}

export interface GridItem {
    id: string;
    type: 'APP' | 'FOLDER' | 'WIDGET';
    target: string; // pkg name or folderId
    position: number;
}

interface HomeState {
  folders: FolderItem[];
  gridItems: GridItem[];
  addFolder: (name: string, apps: string[]) => void;
  removeFolder: (id: string) => void;
  updateFolderApps: (id: string, apps: string[]) => void;
  updateGrid: (items: GridItem[]) => void;
  addAppToGrid: (pkg: string) => void;
}

export const useHomeScreenStore = create<HomeState>()(
  persist(
    (set) => ({
      folders: [
        { id: 'f_work', name: 'Work', apps: ['internal.word', 'internal.excel', 'internal.files'], iconColor: '#3B82F6' },
        { id: 'f_social', name: 'Social', apps: ['internal.browser'], iconColor: '#F97316' }
      ],
      gridItems: [
        { id: '1', type: 'FOLDER', target: 'f_work', position: 0 },
        { id: '2', type: 'FOLDER', target: 'f_social', position: 1 },
        { id: '3', type: 'APP', target: 'internal.tasks', position: 2 },
        { id: '4', type: 'APP', target: 'internal.notes', position: 3 },
      ],
      addFolder: (name, apps) => set((state) => ({
        folders: [...state.folders, { id: 'f_' + Date.now(), name, apps, iconColor: '#6366F1' }]
      })),
      removeFolder: (id) => set((state) => ({
        folders: state.folders.filter(f => f.id !== id),
        gridItems: state.gridItems.filter(i => i.target !== id)
      })),
      updateFolderApps: (id, apps) => set((state) => ({
        folders: state.folders.map(f => f.id === id ? { ...f, apps } : f)
      })),
      updateGrid: (items) => set({ gridItems: items }),
      addAppToGrid: (pkg) => set((state) => ({
        gridItems: [...state.gridItems, { id: 'itm_' + Date.now(), type: 'APP', target: pkg, position: state.gridItems.length }]
      }))
    }),
    {
      name: 'univa-home-grid',
      storage: createJSONStorage(() => {
        // Defensive Adaptive Storage
        const isWeb = typeof window !== 'undefined';
        return {
          getItem: (name) => isWeb ? localStorage.getItem(name) : null,
          setItem: (name, value) => isWeb ? localStorage.setItem(name, value) : null,
          removeItem: (name) => isWeb ? localStorage.removeItem(name) : null,
        };
      }),
    }
  )
);
