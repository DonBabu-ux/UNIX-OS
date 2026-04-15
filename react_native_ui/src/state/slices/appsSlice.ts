import { create } from 'zustand';

export interface RecentEntry {
  pkg: string;
  ts: number; // epoch ms
}

interface AppCategory {
  id: string;
  name: string;
  apps: string[]; // Package names
}

// Pre-seed with default OS apps so UI looks populated from first launch
const _now = Date.now();
const DEFAULT_RECENT: RecentEntry[] = [
  { pkg: 'internal.tasks',      ts: _now - 35 * 60000 },      // 35m ago
  { pkg: 'internal.word',       ts: _now - 2 * 3600000 },     // 2h ago
  { pkg: 'internal.notes',      ts: _now - 3.5 * 3600000 },   // 3.5h ago
  { pkg: 'internal.excel',      ts: _now - 5 * 3600000 },     // 5h ago
  { pkg: 'internal.files',      ts: _now - 7 * 3600000 },     // 7h ago
  { pkg: 'internal.powerpoint', ts: _now - 27 * 3600000 },    // Yesterday
];

interface AppsState {
  hiddenApps: string[];
  categories: AppCategory[];
  recentlyOpened: RecentEntry[];
  toggleHideApp: (packageName: string) => void;
  setHiddenApps: (apps: string[]) => void;
  addAppToCategory: (categoryId: string, packageName: string) => void;
  /** Move pkg to front with a fresh timestamp; dedup; cap at 8 */
  trackRecentApp: (packageName: string) => void;
}

export const useAppsStore = create<AppsState>((set) => ({
  hiddenApps: [],
  recentlyOpened: DEFAULT_RECENT,
  categories: [
    { id: 'work',   name: 'Work',   apps: [] },
    { id: 'social', name: 'Social', apps: [] },
    { id: 'games',  name: 'Games',  apps: [] },
  ],
  toggleHideApp: (packageName) =>
    set((state) => ({
      hiddenApps: state.hiddenApps.includes(packageName)
        ? state.hiddenApps.filter((p) => p !== packageName)
        : [...state.hiddenApps, packageName],
    })),
  setHiddenApps: (apps) => set({ hiddenApps: apps }),
  addAppToCategory: (categoryId, packageName) =>
    set((state) => ({
      categories: state.categories.map((cat) =>
        cat.id === categoryId
          ? { ...cat, apps: [...new Set([...cat.apps, packageName])] }
          : cat
      ),
    })),
  trackRecentApp: (packageName) =>
    set((state) => ({
      recentlyOpened: [
        { pkg: packageName, ts: Date.now() },
        ...state.recentlyOpened.filter((e) => e.pkg !== packageName),
      ].slice(0, 8),
    })),
}));
