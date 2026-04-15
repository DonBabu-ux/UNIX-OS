import * as React from 'react';
import { View, StyleSheet, Text, Dimensions, Platform, ScrollView, TextInput } from 'react-native';
import Animated, { FadeInUp, FadeOutDown } from 'react-native-reanimated';
import { AppInfo } from '../../bridge_layer/AppListBridge';
import { useTheme } from '../theme/themeProvider';
import { 
  Search, FileText, FileSpreadsheet, Presentation,
  Database, Image as ImageIcon, CheckSquare
} from 'lucide-react';

import SystemControlPanel from './StartMenu/SystemControlPanel';
import RecentsPanel from './StartMenu/RecentsPanel';
import AppGrid from './StartMenu/AppGrid';
import { useSystemStore } from '../state/slices/systemSlice';
import { useAppsStore } from '../state/slices/appsSlice';
import { useResponsive } from '../state/ResponsiveManager';

const RECENT_OPENED = [
  { id: '1', name: 'AI Architecture Overview.unv_docx', time: 'Opened 1h ago', icon: FileText, color: '#3B82F6' },
  { id: '2', name: 'Q4 Financials.unv_xlsx', time: 'Edited yesterday', icon: FileSpreadsheet, color: '#10B981' },
  { id: '3', name: 'Investor Pitch.unv_pptx', time: 'Opened 2 days ago', icon: Presentation, color: '#F97316' },
  { id: '4', name: 'User Analytics DB.unv_db', time: 'Edited 3 days ago', icon: Database, color: '#8B5CF6' },
  { id: '5', name: 'Project Logo.png', time: 'Opened last week', icon: ImageIcon, color: '#FCD34D' },
  { id: '6', name: 'Sprint Tasks.unv_tasks', time: 'Edited 2 weeks ago', icon: CheckSquare, color: '#6366F1' },
];

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface StartMenuProps {
  visible: boolean;
  recentApps: AppInfo[];
  onAppPress: (pkg: string) => void;
}

const StartMenu: React.FC<StartMenuProps> = React.memo(({ visible, recentApps, onAppPress }) => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = React.useState('');
  const { isMobile } = useResponsive();
  const { recentlyOpened } = useAppsStore();
  const { isAdminAuthenticated, openModal } = useSystemStore();

  const handleAdminPress = () => {
    if (isAdminAuthenticated) {
      openModal({ type: 'ADMIN_CONTROL', title: 'ADMINISTRATOR CENTER' });
    } else {
      openModal({ type: 'ADMIN_AUTH', title: 'SYSTEM SECURITY GATE' });
    }
  };

  if (!visible) return null;

  const filteredApps = recentApps.filter(app => 
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get top 4 frequently used apps for the mobile shelf
  const frequentPackages = recentlyOpened.slice(0, 4).map(e => e.pkg);
  const frequentAppsList = recentApps.filter(app => frequentPackages.includes(app.packageName));


  return (
    <View style={styles.overlay} pointerEvents="box-none">
      <Animated.View 
        entering={FadeInUp.springify().damping(20).stiffness(90)} 
        exiting={FadeOutDown.springify().damping(20).stiffness(90)}
        style={[styles.container]}
      >


        {/* Layer 2: Search Bar */}
        <View style={styles.header}>
          <View style={styles.searchBar}>
            <Search size={16} color="rgba(255,255,255,0.5)" style={{ marginRight: 10 }} />
            <TextInput 
              style={styles.searchField}
              placeholder="Search apps, settings, and documents"
              placeholderTextColor="rgba(255,255,255,0.4)"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus={true}
            />
          </View>
        </View>
        
        {/* Layer 3: Independent Scrollable Content */}
        <ScrollView style={styles.contentBody} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
           {isMobile && frequentAppsList.length > 0 && (
             <View style={styles.frequentSection}>
               <Text style={[styles.sectionTitle, {color: theme.accent}]}>PRIORITY ACCESS</Text>
               <AppGrid 
                 apps={frequentAppsList}
                 onAppPress={onAppPress}
               />
               <View style={[styles.divider, {backgroundColor: theme.border}]} />
             </View>
           )}

           <AppGrid 
             apps={filteredApps}
             onAppPress={onAppPress}
           />
           
           {!isMobile && (
             <RecentsPanel 
               items={RECENT_OPENED} 
               onItemPress={(id) => console.log('Rec item press:', id)}
             />
           )}
        </ScrollView>

        {/* Layer 4: System Control Panel (Fixed at Bottom) */}
        <SystemControlPanel 
          userName="Administrator"
          onLogoutPress={() => console.log('Logout')}
          onSettingsPress={() => console.log('Settings')}
          onAdminPress={handleAdminPress}
        />

      </Animated.View>
    </View>
  );
});

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 72,
    zIndex: 900,
  },
  container: {
    width: 620,
    maxWidth: '98%',
    height: 680,
    maxHeight: Platform.OS === 'web' ? (SCREEN_HEIGHT < 800 ? SCREEN_HEIGHT - 100 : 680) : (SCREEN_HEIGHT - 120),
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    overflow: 'hidden',
    backgroundColor: '#0F172A', // Solid Dark background to fix transparency issues
    ...Platform.select({
      web: {
        //@ts-ignore
        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.5)',
      },
      default: {
        elevation: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
      }
    }),
  },
  header: {
    padding: 24,
    paddingBottom: 0,
  },
  searchBar: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  searchField: {
    flex: 1,
    color: '#fff',
    fontSize: 13,
    paddingVertical: 4,
  },
  contentBody: {
    flex: 1,
  },
  frequentSection: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginLeft: 24,
    marginBottom: 10,
    opacity: 0.8,
  },
  divider: {
    height: 1,
    marginHorizontal: 24,
    marginVertical: 10,
    opacity: 0.2,
  },
  scrollContent: {
    paddingBottom: 20,
  },
});

export default StartMenu;
