import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions, Platform, ScrollView } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSettingsStore } from '../state/store';
import { useTheme } from '../theme/themeProvider';
import { useResponsive } from '../state/ResponsiveManager';
import { Layout, Search, Grid, Mail, MessageSquare, Compass, Folder, X } from 'lucide-react';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

import { WindowInstance } from '../engine/UnivaRuntime';

interface TaskbarProps {
  onStartPress: () => void;
  activeWindows: WindowInstance[];
  onWindowPress: (id: string) => void;
  onWindowClose: (id: string) => void;
}

const Taskbar: React.FC<TaskbarProps> = React.memo(({ onStartPress, activeWindows, onWindowPress, onWindowClose }) => {
  const theme = useTheme();
  const { isMobile } = useResponsive();
  const accentColor = useSettingsStore((state) => state.accentColor);
  
  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const [hoveredAppId, setHoveredAppId] = useState<string | null>(null);
  const hideTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (id: string) => {
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    setHoveredAppId(id);
  };

  const handleMouseLeave = () => {
    hideTimeout.current = setTimeout(() => {
      setHoveredAppId(null);
    }, 250); // Delay allows moving mouse onto preview
  };

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
        <View style={styles.leftSection}>
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

          {/* Running & Pinned Apps */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.appRail} style={{ overflow: 'visible' }}>
             {/* Pinned Defaults */}
             <TouchableOpacity style={styles.taskIcon} activeOpacity={0.7}>
                <View style={[styles.tile, { backgroundColor: 'rgba(56, 189, 248, 0.1)' }]}>
                   <Folder size={18} color="#38BDF8" />
                </View>
             </TouchableOpacity>

             {/* Dynamic Active Windows */}
             {activeWindows.map(win => (
               <View 
                  key={win.id} 
                  style={{ position: 'relative' }}
                  // @ts-ignore
                  onMouseEnter={() => handleMouseEnter(win.id)}
                  // @ts-ignore
                  onMouseLeave={handleMouseLeave}
               >
                 <TouchableOpacity 
                   style={styles.taskIcon} 
                   onPress={() => onWindowPress(win.id)}
                   onLongPress={() => onWindowClose(win.id)}
                   // @ts-ignore
                   onContextMenu={(e) => { e.preventDefault(); onWindowClose(win.id); }}
                   activeOpacity={0.7}
                 >
                   <View style={[styles.tile, win.isFocused && { borderColor: 'rgba(255,255,255,0.4)', backgroundColor: 'rgba(255,255,255,0.1)' }]}>
                      <Grid size={18} color={accentColor} />
                   </View>
                   <View style={[styles.activeIndicator, { backgroundColor: accentColor }]} />
                 </TouchableOpacity>

                 {/* Hover Preview Panel */}
                 {hoveredAppId === win.id && (
                   <Animated.View 
                     entering={FadeIn.duration(150)} 
                     exiting={FadeOut.duration(100)} 
                     style={[styles.hoverPreviewContainer, theme.glassEffect]}
                     // @ts-ignore
                     onMouseEnter={() => handleMouseEnter(win.id)}
                     // @ts-ignore
                     onMouseLeave={handleMouseLeave}
                   >
                     <View style={styles.previewHeader}>
                        <Text style={styles.previewTitle} numberOfLines={1}>{win.title}</Text>
                        <TouchableOpacity style={styles.previewClose} onPress={(e) => { e.stopPropagation(); onWindowClose(win.id); }}>
                           <X size={14} color="#fff" />
                        </TouchableOpacity>
                     </View>
                     <TouchableOpacity style={styles.previewContent} onPress={() => { setHoveredAppId(null); onWindowPress(win.id); }}>
                        <Grid size={24} color={accentColor} opacity={0.5} />
                     </TouchableOpacity>
                   </Animated.View>
                 )}
               </View>
             ))}
          </ScrollView>
        </View>


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
    zIndex: 2000,
  },
  content: {
    width: '100%',
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  appRail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingLeft: 8,
  },
  taskIcon: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tile: {
    width: 38,
    height: 38,
    borderRadius: 4,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 2,
    width: 20,
    height: 3,
    borderRadius: 2,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 8,
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
  hoverPreviewContainer: {
    position: 'absolute',
    bottom: 60,
    left: -60, // Center relative to 48px tile icon roughly
    width: 170,
    height: 120,
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    padding: 8,
    zIndex: 9000,
    boxShadow: '0px 10px 30px rgba(0,0,0,0.5)',
    elevation: 15,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  previewTitle: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  previewClose: {
    padding: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
  },
  previewContent: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Taskbar;

