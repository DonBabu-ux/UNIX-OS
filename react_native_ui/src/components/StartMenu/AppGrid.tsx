import * as React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { AppInfo } from '../../../bridge_layer/AppListBridge';
import AppIcon from '../AppIcon';

interface AppGridProps {
  apps: AppInfo[];
  onAppPress: (pkg: string) => void;
}

const AppGrid: React.FC<AppGridProps> = ({ apps, onAppPress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pinned</Text>
        <TouchableOpacity style={styles.allAppsButton}>
          <Text style={styles.allAppsText}>All apps ›</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.grid}>
        {apps.slice(0, 18).map((app) => (
          <View key={app.packageName} style={styles.appItem}>
            <AppIcon 
              name={app.name}
              icon={app.icon}
              onPress={() => onAppPress(app.packageName)}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    marginTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
    opacity: 0.6,
  },
  allAppsButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  allAppsText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 10,
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  appItem: {
    width: '33.3%', // 3 items per row on mobile-friendly grid
    alignItems: 'center',
    marginBottom: 10,
  },
});

export default AppGrid;
