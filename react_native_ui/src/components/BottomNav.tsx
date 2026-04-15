import * as React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions } from 'react-native';
import { Home, Grid, Search, Settings } from 'lucide-react';
import { useTheme } from '../theme/themeProvider';

interface BottomNavProps {
  onHomePress: () => void;
  onAppsPress: () => void;
  onSearchPress: () => void;
  onSettingsPress: () => void;
  activeTab?: string;
}

const BottomNav: React.FC<BottomNavProps> = ({ 
  onHomePress, 
  onAppsPress, 
  onSearchPress, 
  onSettingsPress,
  activeTab = 'home'
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, theme.glassEffect, { backgroundColor: 'rgba(11, 15, 23, 0.85)' }]}>
      <TouchableOpacity 
        style={styles.navItem} 
        onPress={onHomePress}
        activeOpacity={0.7}
      >
        <View style={[styles.iconTile, activeTab === 'home' && { backgroundColor: 'rgba(0, 120, 212, 0.15)', borderColor: theme.primary + '44' }]}>
          <Home size={20} color={activeTab === 'home' ? theme.primary : 'rgba(255,255,255,0.4)'} />
        </View>
        <Text style={[styles.navText, { color: activeTab === 'home' ? theme.primary : 'rgba(255,255,255,0.4)' }]}>Home</Text>
        {activeTab === 'home' && <View style={[styles.activeDot, { backgroundColor: theme.primary }]} />}
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.navItem} 
        onPress={onAppsPress}
        activeOpacity={0.7}
      >
        <View style={[styles.iconTile, activeTab === 'apps' && { backgroundColor: 'rgba(0, 120, 212, 0.15)', borderColor: theme.primary + '44' }]}>
          <Grid size={20} color={activeTab === 'apps' ? theme.primary : 'rgba(255,255,255,0.4)'} />
        </View>
        <Text style={[styles.navText, { color: activeTab === 'apps' ? theme.primary : 'rgba(255,255,255,0.4)' }]}>Apps</Text>
        {activeTab === 'apps' && <View style={[styles.activeDot, { backgroundColor: theme.primary }]} />}
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.navItem} 
        onPress={onSearchPress}
        activeOpacity={0.7}
      >
        <View style={[styles.iconTile, activeTab === 'search' && { backgroundColor: 'rgba(0, 120, 212, 0.15)', borderColor: theme.primary + '44' }]}>
          <Search size={20} color={activeTab === 'search' ? theme.primary : 'rgba(255,255,255,0.4)'} />
        </View>
        <Text style={[styles.navText, { color: activeTab === 'search' ? theme.primary : 'rgba(255,255,255,0.4)' }]}>Search</Text>
        {activeTab === 'search' && <View style={[styles.activeDot, { backgroundColor: theme.primary }]} />}
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.navItem} 
        onPress={onSettingsPress}
        activeOpacity={0.7}
      >
        <View style={[styles.iconTile, activeTab === 'settings' && { backgroundColor: 'rgba(0, 120, 212, 0.15)', borderColor: theme.primary + '44' }]}>
          <Settings size={20} color={activeTab === 'settings' ? theme.primary : 'rgba(255,255,255,0.4)'} />
        </View>
        <Text style={[styles.navText, { color: activeTab === 'settings' ? theme.primary : 'rgba(255,255,255,0.4)' }]}>Settings</Text>
        {activeTab === 'settings' && <View style={[styles.activeDot, { backgroundColor: theme.primary }]} />}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 72,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 12,
    zIndex: 3000, // Above everything in drawer
  },
  navItem: {
    alignItems: 'center',
    gap: 2,
    minWidth: 60,
  },
  navText: {
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  iconTile: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
    marginBottom: 4,
  },
  activeDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    marginTop: 4,
  },
});

export default BottomNav;
