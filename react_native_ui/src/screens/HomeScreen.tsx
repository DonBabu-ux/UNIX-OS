// UNIVA OS - HomeScreen - Version 1.1 (Fixed Tags & Verified Imports)
import * as React from 'react';
import { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Dimensions } from 'react-native';
import {
  Cloud, Shield, Zap,
  FileText, BarChart2, Presentation, CheckSquare,
  Sparkles, Folder, Globe, Settings, Package,
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

// ── App metadata map ────────────────────────────────────────────────────────
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

// ── Relative time helper ─────────────────────────────────────────────────────
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
  const [zCounter, setZCounter] = useState(10);

  const openAppWindow = (type: string, title: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newWindow: WindowInstance = {
      id,
      title,
      type,
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
    setWindows(windows.map(w => w.id === id 
      ? { ...w, isFocused: true, zIndex: zCounter } 
      : { ...w, isFocused: false }
    ));
    setZCounter(zCounter + 1);
  };

  const closeWindow = (id: string) => {
    setWindows(windows.filter(w => w.id !== id));
  };

  const moveWindow = (id: string, x: number, y: number) => {
    setWindows(windows.map(w => w.id === id ? { ...w, x, y } : w));
  };

  useEffect(() => {
    loadApps();
  }, []);

  const loadApps = async () => {
    const appList = await getInstalledApps();
    setApps(appList);
  };

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

  const handleStartPress = useCallback(() => {
    setStartVisible(prev => !prev);
  }, []);

  return (
    <View style={styles.container}>
      <View pointerEvents="none" style={{ ...StyleSheet.absoluteFillObject, zIndex: 0 }}>
        <Wallpaper />
      </View>
      <ScrollView 
        style={[styles.scrollView, { zIndex: 1 }]} 
        contentContainerStyle={[styles.workspace, isMobile && styles.mobileWorkspace]} 
        showsVerticalScrollIndicator={true}
        bounces={true}
        scrollEnabled={true}
      >
        
        {/* Header Section */}
        <View style={[styles.header, isMobile && styles.mobileHeader]}>
          <View>
            <Text style={[styles.greeting, isMobile && styles.mobileGreeting]}>Systems Operational</Text>
            <View style={styles.statusRow}>
               <View style={[styles.glassBadge, { borderColor: theme.success + '44' }]}>
                 <Shield size={10} color={theme.success} />
                 <Text style={[styles.statusText, { color: theme.success }]}>Security: Optimal</Text>
               </View>
               {!isMobile && (
                 <>
                   <View style={[styles.glassBadge, { borderColor: theme.accent + '44' }]}>
                     <Zap size={10} color={theme.accent} />
                     <Text style={[styles.statusText, { color: theme.accent }]}>Neural: 98%</Text>
                   </View>
                 </>
               )}
            </View>
          </View>
          {!isMobile && (
            <View style={[styles.cloudBadge, theme.glassEffect]}>
              <Cloud size={14} color={theme.primary} style={{ marginRight: 8 }} />
              <Text style={[styles.cloudText, { color: theme.primary }]}>Cloud: Connected</Text>
            </View>
          )}
        </View>

        {/* Widgets Panel */}
        <View style={[styles.widgetsLayout, isMobile && styles.mobileWidgetsLayout]}>
           <View style={{ flex: isMobile ? 0 : 2, gap: 20 }}>
              <AIWidget />
              <View style={[styles.row, isMobile && styles.mobileColumn]}>
                 <PriorityCard />
                 <TimeWidget />
              </View>
           </View>
           <View style={{ flex: 1 }}>
              {!isMobile && <PulseChart />}
           </View>
        </View>

        {!isMobile && (
          <View style={[styles.row, isMobile && styles.mobileColumn]}>
            <AISyncCard 
              title="Update Core Kernel"
              category="System"
              icon="🛠️"
            />
            <AISyncCard 
              title="Meeting with Design Team"
              category="Social"
              icon="👥"
            />
          </View>
        )}

        {/* ── Recently Opened ─────────────────────────────────────── */}
        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>RECENTLY OPENED</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recentScroll}
          >
            {recentlyOpened.map((entry: RecentEntry) => {
              const info = APP_INFO[entry.pkg];
              if (!info) return null;
              const AppIconComp = info.Icon;
              return (
                <TouchableOpacity
                  key={entry.pkg}
                  style={styles.recentCard}
                  onPress={() => handleAppPress(entry.pkg)}
                  activeOpacity={0.75}
                >
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

        <View style={styles.appSection}>
            <Text style={styles.sectionTitle}>FREQUENTLY USED</Text>
            <DesktopGrid 
            apps={apps} 
            onAppPress={handleAppPress} 
            />
        </View>
        <View style={{ height: 400 }} />
      </ScrollView>

      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10 }} pointerEvents="box-none">
        <WindowManager 
          windows={windows}
          onFocus={focusWindow}
          onClose={closeWindow}
          onMove={moveWindow}
          renderContent={(win) => {
            if (win.type === 'doc') return <DocsEngine />;
            if (win.type === 'tasks') return <TaskManager onClose={() => closeWindow(win.id)} />;
            if (win.type === 'sheet') return <OfficeApp appType="excel" onClose={() => closeWindow(win.id)} />;
            if (win.type === 'slide') return <OfficeApp appType="ppt" onClose={() => closeWindow(win.id)} />;
            return <View style={{ flex: 1, backgroundColor: '#000' }} />;
          }}
        />
      </View>

      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 20 }} pointerEvents="box-none">
        <StartMenu 
          visible={startVisible} 
          recentApps={apps}
          onAppPress={handleAppPress}
        />
      </View>

      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 30 }}>
        <Taskbar onStartPress={handleStartPress} />
      </View>
      
      {isMobile && (
        <BottomNav 
          onHomePress={() => setStartVisible(false)}
          onAppsPress={() => setStartVisible(true)}
          onSearchPress={() => console.log('Search')}
          onSettingsPress={() => console.log('Settings')}
          activeTab={startVisible ? 'apps' : 'home'}
        />
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
  scrollView: {
    ...StyleSheet.absoluteFillObject,
  },
  workspace: {
    paddingTop: 60,
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 48,
  },
  mobileHeader: {
    marginBottom: 32,
  },
  greeting: { 
    fontSize: 28, 
    fontWeight: '800', 
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  mobileGreeting: {
    fontSize: 22,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  glassBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statusDivider: {
    color: 'rgba(255,255,255,0.2)',
    marginHorizontal: 4,
  },
  cloudBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  cloudText: { fontSize: 12, fontWeight: '700' },
  widgetsLayout: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20,
  },
  mobileWidgetsLayout: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
    gap: 20,
    flex: 1,
  },
  mobileColumn: {
    flexDirection: 'column',
    gap: 12,
  },
  appSection: {
    marginTop: 40,
  },
  sectionTitle: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  recentSection: {
    marginTop: 40,
  },
  recentScroll: {
    gap: 16,
    paddingHorizontal: 10,
    paddingBottom: 8,
  },
  recentCard: {
    width: 100,
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    gap: 8,
  },
  recentIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
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
});

export default HomeScreen;
