import { NativeModules, Platform } from 'react-native';

const { AppListModule } = NativeModules;

export interface AppInfo {
  name: string;
  packageName: string;
  icon: string; // Base64 string
}

export const getInstalledApps = async (): Promise<AppInfo[]> => {
  if (Platform.OS === 'web') {
    return [
      { name: 'Word', packageName: 'internal.word', icon: 'iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA' },
      { name: 'Excel', packageName: 'internal.excel', icon: 'iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA' },
      { name: 'PowerPoint', packageName: 'internal.powerpoint', icon: 'iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA' },
      { name: 'Access', packageName: 'internal.access', icon: 'iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA' },
      { name: 'Tasks', packageName: 'internal.tasks', icon: 'iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA' },
      { name: 'Browser', packageName: 'com.android.browser', icon: 'iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA' },
      { name: 'Settings', packageName: 'com.android.settings', icon: 'iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA' },
      { name: 'Notes', packageName: 'internal.notes', icon: 'iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA' },
    ];
  }

  try {
    return await AppListModule.getInstalledApps();
  } catch (error) {
    console.error('Error fetching apps:', error);
    return [];
  }
};
