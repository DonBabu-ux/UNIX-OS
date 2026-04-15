import { useAppsStore } from '../state/store';

export const hideApp = (packageName: string) => {
  useAppsStore.getState().toggleHideApp(packageName);
};

export const isAppHidden = (packageName: string) => {
  return useAppsStore.getState().hiddenApps.includes(packageName);
};
