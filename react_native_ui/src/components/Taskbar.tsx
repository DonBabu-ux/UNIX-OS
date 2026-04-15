import * as React from 'react';
import { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions, Platform, ScrollView } from 'react-native';
import { useSettingsStore } from '../state/store';
import { useTheme } from '../theme/themeProvider';
import { useResponsive } from '../state/ResponsiveManager';
import { Layout, Search, Grid, Mail, MessageSquare, Compass, Folder } from 'lucide-react';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface TaskbarProps {
  onStartPress: () => void;
}

const Taskbar: React.FC<TaskbarProps> = React.memo(({ onStartPress }) => {
  const theme = useTheme();
  const { isMobile } = useResponsive();
  const accentColor = useSettingsStore((state) => state.accentColor);
  
  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  if (isMobile) return null;

  return (
    <View style={styles.container}>
      <View style={[styles.content, theme.glassEffect]}>
        {/* Centered Scrollable App Area */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.centerSection}
        >
          <TouchableOpacity 
            style={styles.taskIcon} 
            onPress={onStartPress}
            activeOpacity={0.7}
          >
            <View style={[styles.tile, { backgroundColor: 'rgba(255, 255, 255, 0.05)', borderColor: accentColor + '44' }]}>
              <Layout size={20} color={accentColor} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.taskIcon} activeOpacity={0.7}>
            <View style={styles.tile}>
              <Search size={18} color="#fff" />
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.taskIcon} activeOpacity={0.7}>
            <View style={[styles.tile, { backgroundColor: 'rgba(250, 204, 21, 0.1)' }]}>
               <Folder size={18} color="#FACC15" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.taskIcon} activeOpacity={0.7}>
            <View style={[styles.tile, { backgroundColor: 'rgba(14, 165, 233, 0.1)' }]}>
               <Compass size={18} color="#0EA5E9" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.taskIcon} activeOpacity={0.7}>
            <View style={[styles.tile, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
               <Mail size={18} color="#EF4444" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.taskIcon} activeOpacity={0.7}>
            <View style={[styles.tile, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
               <MessageSquare size={18} color="#10B981" />
            </View>
          </TouchableOpacity>
        </ScrollView>

        {/* System Tray (Right Side) */}
        <View style={styles.systemTray}>
          <View style={styles.trayItem}>
             <Text style={styles.trayText}>ENG</Text>
          </View>
          <View style={styles.timeSection}>
            <Text style={styles.timeText}>{time}</Text>
            <Text style={styles.dateText}>{new Date().toLocaleDateString(undefined, { day: '2-digit', month: '2-digit', year: 'numeric' })}</Text>
          </View>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
    zIndex: 1000,
  },
  content: {
    width: Platform.OS === 'web' ? 'auto' : '96%',
    minWidth: '60%',
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: 'rgba(28, 36, 52, 0.7)',
  },
  centerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 0,
  },
  taskIcon: {
    width: 44,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tile: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 4,
  },
  systemTray: {
    position: 'absolute',
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  trayItem: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  trayText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  timeSection: {
    alignItems: 'flex-end',
  },
  timeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  dateText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 10,
  },
});

export default Taskbar;

