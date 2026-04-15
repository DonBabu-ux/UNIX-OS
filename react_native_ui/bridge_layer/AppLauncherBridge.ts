import { NativeModules, Platform } from 'react-native';

const { AppLauncherModule } = NativeModules;

export const launchApp = (packageName: string): void => {
  if (Platform.OS === 'web') {
    console.log(`[Web Placeholder] Launching app: ${packageName}`);
    return;
  }
  
  if (AppLauncherModule) {
    AppLauncherModule.launchApp(packageName);
  } else {
    console.warn('AppLauncherModule is not available');
  }
};
