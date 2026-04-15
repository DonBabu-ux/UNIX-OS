import * as React from 'react';
import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TextInput,
  Text,
  Dimensions,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Search, Grid, MoreHorizontal, FileText, FileSpreadsheet, Presentation, Database, Image as ImageIcon, CheckSquare } from 'lucide-react';
import { getInstalledApps, AppInfo } from '../../bridge_layer/AppListBridge';
import { launchApp } from '../../bridge_layer/AppLauncherBridge';
import AppIcon from '../components/AppIcon';
import { useTheme } from '../theme/themeProvider';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const ITEM_HEIGHT = 110; 

const RECENT_DOCS = [
  { id: '1', name: 'AI Architecture.unv_docx', time: '1h ago', icon: FileText, color: '#3B82F6' },
  { id: '2', name: 'Q4 Financials.unv_xlsx', time: 'Yesterday', icon: FileSpreadsheet, color: '#10B981' },
  { id: '3', name: 'Investor Pitch.unv_pptx', time: '2 days ago', icon: Presentation, color: '#F97316' },
  { id: '4', name: 'User Analytics.unv_db', time: '3 days ago', icon: Database, color: '#8B5CF6' },
];

const AppDrawer: React.FC = () => {
  const theme = useTheme();
  const [apps, setApps] = useState<AppInfo[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadApps();
  }, []);

  const loadApps = async () => {
    const appList = await getInstalledApps();
    setApps(appList);
  };

  const filteredApps = useMemo(() => {
    if (search.trim() === '') return apps;
    const term = search.toLowerCase();
    return apps.filter((app) => app.name.toLowerCase().includes(term));
  }, [apps, search]);

  const renderAppItem = useCallback(({ item }: { item: AppInfo }) => (
    <View style={styles.gridItem}>
      <AppIcon
        name={item.name}
        icon={item.icon}
        onPress={() => launchApp(item.packageName)}
      />
    </View>
  ), []);

  const keyExtractor = useCallback((item: AppInfo) => item.packageName, []);

  const ListHeader = () => (
    <View>
      <View style={styles.sectionHeader}>
         <Text style={styles.sectionTitle}>Recently opened</Text>
      </View>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.recentScroll}
      >
        {RECENT_DOCS.map(item => (
          <TouchableOpacity key={item.id} style={styles.recentItem}>
            <View style={[styles.recentIcon, { backgroundColor: item.color }]}>
              <item.icon size={16} color="#fff" />
            </View>
            <View>
              <Text style={styles.recentLabel} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.recentSub}>{item.time}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={[styles.sectionHeader, { marginTop: 24 }]}>
         <Text style={styles.sectionTitle}>All apps</Text>
         <View style={styles.viewActions}>
            <Grid size={16} color="#fff" style={{ marginRight: 15 }} />
            <MoreHorizontal size={16} color="rgba(255,255,255,0.4)" />
         </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.container]}>
      <View style={styles.handle} />
      
      <View style={styles.header}>
         <View style={styles.searchContainer}>
            <Search size={18} color="rgba(255,255,255,0.4)" style={{ marginLeft: 15 }} />
            <TextInput
              style={styles.searchBar}
              placeholder="Type to search"
              placeholderTextColor="rgba(255,255,255,0.4)"
              value={search}
              onChangeText={setSearch}
            />
         </View>
      </View>

      <FlatList
        data={filteredApps}
        renderItem={renderAppItem}
        ListHeaderComponent={ListHeader}
        keyExtractor={keyExtractor}
        numColumns={4}
        style={{ flex: 1 }}
        contentContainerStyle={styles.list}
        initialNumToRender={20}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={Platform.OS === 'android'}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No matches found</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A', // Solid background for better hierarchy
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: SCREEN_HEIGHT,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  header: {
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  searchBar: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 12,
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  recentScroll: {
    paddingHorizontal: 12,
    gap: 12,
    paddingBottom: 4,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    padding: 10,
    borderRadius: 12,
    gap: 12,
    width: 160,
  },
  recentIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recentLabel: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    width: 90,
  },
  recentSub: {
    color: 'rgba(255, 255, 255, 0.3)',
    fontSize: 9,
  },
  viewActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  list: {
    paddingHorizontal: 12,
    paddingBottom: 100,
  },
  gridItem: {
    flex: 1,
    alignItems: 'center',
    marginVertical: 10,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyText: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 14,
  },
});

export default AppDrawer;


