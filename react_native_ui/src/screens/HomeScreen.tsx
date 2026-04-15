// UNIVA OS - HomeScreen - Version 1.7 (Restored Bottom Taskbar)
import * as React from 'react';
import { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Dimensions } from 'react-native';
import {
  Shield, Zap,
  FileText, BarChart2, Presentation, CheckSquare,
  Sparkles, Folder, Globe, Settings,
} from 'lucide-react';
import { getInstalledApps, AppInfo } from '../../bridge_layer/AppListBridge';
import { launchApp } from '../../bridge_layer/AppLauncherBridge';
import Taskbar from '../components/Taskbar';
import BottomNav from '../components/BottomNav';
import StartMenu from '../components/StartMenu';
import DesktopGrid from '../components/DesktopGrid';
import Wallpaper from '../components/Wallpaper';
import { AIWidget, PriorityCard, AISyncCard, PulseChart, TimeWidget } from '../components/Widgets';
import { WindowManager, WindowInstance } from '../engine/UnivaRuntime';
import DocsEngine from '../apps/OfficeApp/engines/DocsEngine';
import OfficeApp from '../apps/OfficeApp/OfficeApp';
import TaskManager from '../apps/TaskManager/TaskManager';
import { useTheme } from '../theme/themeProvider';
import { useAppsStore, RecentEntry } from '../state/slices/appsSlice';
import { useResponsive } from '../state/ResponsiveManager';

const APP_INFO: Record<string, { name: string; color: string; Icon: React.ElementType }> = {
  'internal.word':        { name: 'Univa Docs',     color: '#0078D4', Icon: FileText },
  'internal.excel':       { name: 'Univa Sheets',   color: '#107C10', Icon: BarChart2 },
  'internal.powerpoint':  { name: 'Univa Slides',   color: '#C43E1C', Icon: Presentation },
  'internal.tasks':       { name: 'Task Manager',   color: '#8B5CF6', Icon: CheckSquare },
  'internal.notes':       { name: 'Notes',          color: '#FACC15', Icon: Sparkles },
  'internal.files':       { name: 'File Manager',   color: '#38BDF8', Icon: Folder },
  'internal.browser':     { name: 'Browser',        color: '#0EA5E9', Icon: Globe },
  'internal.settings':    { name: 'Settings',       color: '#64748B', Icon: Settings },
};

function relTime(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 60_000)        return 'Just now';
  if (diff < 3_600_000)     return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 7_200_000)     return '1h ago';
  if (diff < 86_400_000)    return `${Math.floor(diff / 3_600_000)}h ago`;
  if (diff < 172_800_000)   return 'Yesterday';
  return `${Math.floor(diff / 86_400_000)}d ago`;
}

const HomeScreen: React.FC = () => {
  const theme = useTheme();
  const { isMobile } = useResponsive();
  const { recentlyOpened, trackRecentApp } = useAppsStore();
  const [apps, setApps] = useState<AppInfo[]>([]);
  const [startVisible, setStartVisible] = useState(false);
  const [windows, setWindows] = useState<WindowInstance[]>([]);
  const [zCounter, setZCounter] = useState(100);

  const openAppWindow = (type: string, title: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newWindow: WindowInstance = {
      id, title, type,
      x: isMobile ? 10 : 150 + (windows.length * 30),
      y: isMobile ? 50 : 100 + (windows.length * 30),
      width: isMobile ? Dimensions.get('window').width - 20 : 900,
      height: isMobile ? Dimensions.get('window').height * 0.7 : 650,
      zIndex: zCounter,
      isFocused: true,
    };
    setWindows([...windows.map(w => ({ ...w, isFocused: false })), newWindow]);
    setZCounter(zCounter + 1);
  };

  const focusWindow = (id: string) => {
    setWindows(windows.map(w => w.id === id ? { ...w, isFocused: true, zIndex: zCounter } : { ...w, isFocused: false }));
    setZCounter(zCounter + 1);
  };
  const closeWindow = (id: string) => setWindows(windows.filter(w => w.id !== id));
  const moveWindow = (id: string, x: number, y: number) => setWindows(windows.map(w => w.id === id ? { ...w, x, y } : w));
  
  const minimizeWindow = (id: string) => {
    // For now, toggle visibility or just close if taskbar restore isn't ready
    // Let's implement active state toggle
    setWindows(windows.map(w => w.id === id ? { ...w, isMinimized: true } : w));
  };

  const maximizeWindow = (id: string) => {
    setWindows(windows.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w));
  };

  useEffect(() => { loadApps(); }, []);
  const loadApps = async () => { setApps(await getInstalledApps()); };

  const handleAppPress = useCallback((pkg: string) => {
    setStartVisible(false);
    trackRecentApp(pkg);
    if (pkg === 'internal.notes') openAppWindow('notes', 'Notes');
    else if (pkg === 'internal.files') openAppWindow('files', 'File Manager');
    else if (pkg === 'internal.word') openAppWindow('doc', 'Univa Docs');
    else if (pkg === 'internal.excel') openAppWindow('sheet', 'Univa Sheets');
    else if (pkg === 'internal.powerpoint') openAppWindow('slide', 'Univa Slides');
    else if (pkg === 'internal.tasks') openAppWindow('tasks', 'Task Manager');
    else launchApp(pkg);
  }, [windows, zCounter, trackRecentApp, isMobile]);

  const handleStartPress = useCallback(() => { setStartVisible(prev => !prev); }, []);

  return (
    <View style={styles.container}>
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <Wallpaper />
      </View>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={[styles.workspace, isMobile && styles.mobileWorkspace]}
        showsVerticalScrollIndicator={true}
        scrollEventThrottle={16}
        decelerationRate="normal"
      >
        {/* Modular Header Widgets */}
        <View style={styles.widgetsGrid}>
           <View style={[styles.row, isMobile && styles.mobileColumn]}>
              <View style={[styles.statusCard, theme.glassEffect]}>
                 <View style={[styles.glassBadge, { borderColor: theme.success + '44' }]}>
                   <Shield size={10} color={theme.success} />
                   <Text style={[styles.statusText, { color: theme.success }]}>Security: Optimal</Text>
                 </View>
                 <Text style={styles.cardTitle}>Systems Operational</Text>
              </View>
              <View style={[styles.statusCard, theme.glassEffect]}>
                 <View style={[styles.glassBadge, { borderColor: theme.accent + '44' }]}>
                   <Zap size={10} color={theme.accent} />
                   <Text style={[styles.statusText, { color: theme.accent }]}>Neural Engine: 98%</Text>
                 </View>
                 <Text style={styles.cardTitle}>Cloud Engine Active</Text>
              </View>
           </View>

           <AIWidget />

           <View style={[styles.row, isMobile && styles.mobileColumn]}>
              <PriorityCard />
              <TimeWidget />
           </View>

           {!isMobile && <PulseChart />}

           <View style={[styles.row, isMobile && styles.mobileColumn]}>
              <AISyncCard title="Update Core Kernel" category="System" icon="🛠️" />
              <AISyncCard title="Network Sync" category="Cloud" icon="📡" />
           </View>
        </View>

        {/* ── Recently Opened Apps ──────────────────────────────────── */}
        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>RECENTLY OPENED</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recentScroll}>
            {recentlyOpened.map((entry: RecentEntry) => {
              const info = APP_INFO[entry.pkg];
              if (!info) return null;
              const AppIconComp = info.Icon;
              return (
                <TouchableOpacity key={entry.pkg} style={styles.recentCard} onPress={() => handleAppPress(entry.pkg)} activeOpacity={0.75}>
                  <View style={[styles.recentIconWrap, { backgroundColor: info.color + '22', borderColor: info.color + '55' }]}>
                    <AppIconComp size={30} color={info.color} />
                  </View>
                  <Text style={styles.recentName} numberOfLines={1}>{info.name}</Text>
                  <Text style={styles.recentTime}>{relTime(entry.ts)}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* ── All Apps Grid ─────────────────────────────────────────── */}
        <View style={styles.appSection}>
            <Text style={styles.sectionTitle}>FREQUENTLY USED</Text>
            <DesktopGrid apps={apps} onAppPress={handleAppPress} />
        </View>

        <View style={{ height: 300 }} />
      </ScrollView>

      {/* Taskbar Fixed at BOTTOM (No Negotiation) */}
      <View style={styles.taskbarFixed} pointerEvents="box-none">
        <Taskbar onStartPress={handleStartPress} />
      </View>

      <View style={styles.windowLayer} pointerEvents="box-none">
        <WindowManager 
          windows={windows.filter(w => !w.isMinimized)} 
          onFocus={focusWindow} 
          onClose={closeWindow} 
          onMinimize={minimizeWindow}
          onMaximize={maximizeWindow}
          onMove={moveWindow} 
          renderContent={(win) => {
            if (win.type === 'doc') return <DocsEngine />;
            if (win.type === 'tasks') return <TaskManager onClose={() => closeWindow(win.id)} />;
            if (win.type === 'sheet') return <OfficeApp appType="excel" onClose={() => closeWindow(win.id)} />;
            if (win.type === 'slide') return <OfficeApp appType="ppt" onClose={() => closeWindow(win.id)} />;
            return <View style={{ flex: 1, backgroundColor: '#000' }} />;
        }}/>
      </View>

      <View style={styles.startLayer} pointerEvents="box-none">
        <StartMenu visible={startVisible} recentApps={apps} onAppPress={handleAppPress} />
      </View>

      {isMobile && (
        <BottomNav onHomePress={() => setStartVisible(false)} onAppsPress={() => setStartVisible(true)} onSearchPress={() => {}} onSettingsPress={() => {}} activeTab={startVisible ? 'apps' : 'home'} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#05070A',
    overflow: 'hidden',
  },
  taskbarFixed: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 3000,
  },
  scrollView: {
    flex: 1,
  },
  workspace: {
    paddingTop: 80, 
    paddingHorizontal: 60,
    paddingBottom: 250,
    minHeight: '100%',
  },
  mobileWorkspace: {
    paddingTop: 30,
    paddingHorizontal: 16,
    paddingBottom: 250,
    minHeight: '100%',
  },
  widgetsGrid: {
    gap: 32,
  },
  row: {
    flexDirection: 'row',
    gap: 32,
  },
  mobileColumn: {
    flexDirection: 'column',
    gap: 20,
  },
  statusCard: {
    flex: 1,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  glassBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
  },
  statusText: { fontSize: 9, fontWeight: '800', textTransform: 'uppercase' },
  cardTitle: { color: '#fff', fontSize: 16, fontWeight: '700', marginTop: 12 },
  recentSection: {
    marginTop: 60,
  },
  sectionTitle: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 20,
  },
  recentScroll: {
    gap: 16,
    paddingBottom: 12,
  },
  recentCard: {
    width: 110,
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    gap: 8,
  },
  recentIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  recentName: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  recentTime: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '500',
  },
  appSection: {
    marginTop: 60,
  },
  windowLayer: { ...StyleSheet.absoluteFillObject, zIndex: 5000 },
  startLayer: { ...StyleSheet.absoluteFillObject, zIndex: 6000 },
});

export default HomeScreen;
