import * as React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useLayoutStore } from '../state/store';
import AppIcon from './AppIcon';
import { AppInfo } from '../../bridge_layer/AppListBridge';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface DesktopGridProps {
  apps: AppInfo[];
  onAppPress: (pkg: string) => void;
}

const DesktopGrid: React.FC<DesktopGridProps> = React.memo(({ apps, onAppPress }) => {
  // Logic for Draggable Icons will be expanded in customization batch, 
  // but here we set up the grid structure that supports the layoutStore.
  
  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {apps.slice(0, 16).map((app) => (
          <AppIcon
            key={app.packageName}
            name={app.name}
            icon={app.icon}
            onPress={() => onAppPress(app.packageName)}
          />
        ))}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export default DesktopGrid;
