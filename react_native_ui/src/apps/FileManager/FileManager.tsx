import * as React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Folder, File, Image as ImageIcon, FileText, ChevronRight, LayoutGrid, List, Search, Clock, Star, HardDrive, Share2 } from 'lucide-react';
import { useTheme } from '../../theme/themeProvider';

const FileManager: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const theme = useTheme();
  const files = [
    { name: 'SystemConfig.log', size: '12 KB', type: 'file' },
    { name: 'DesktopIcons.db', size: '4 KB', type: 'file' },
    { name: 'Wallpaper_City.jpg', size: '2.4 MB', type: 'image' },
    { name: 'LauncherSettings.json', size: '1 KB', type: 'file' },
    { name: 'Financial_Projections.xlsx', size: '48 KB', type: 'file' },
    { name: 'Project_Alpha_Spec.pdf', size: '1.2 MB', type: 'file' },
  ];

  const getFileIcon = (type: string) => {
    if (type === 'image') return <ImageIcon size={20} color={theme.accent} />;
    return <FileText size={20} color={theme.primary} />;
  };

  return (
    <View style={styles.container}>
      {/* Sidebar Navigation */}
      <View style={styles.sidebar}>
         <View style={styles.sidebarGroup}>
            <Text style={styles.sidebarTitle}>Favorites</Text>
            <TouchableOpacity style={[styles.sidebarItem, styles.activeSidebar]}>
               <Star size={16} color={theme.primary} style={{ marginRight: 12 }} />
               <Text style={styles.sidebarText}>Quick access</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sidebarItem}>
               <Clock size={16} color="rgba(255,255,255,0.5)" style={{ marginRight: 12 }} />
               <Text style={styles.sidebarText}>Recent</Text>
            </TouchableOpacity>
         </View>

         <View style={styles.sidebarGroup}>
            <Text style={styles.sidebarTitle}>This PC</Text>
            <TouchableOpacity style={styles.sidebarItem}>
               <HardDrive size={16} color="rgba(255,255,255,0.5)" style={{ marginRight: 12 }} />
               <Text style={styles.sidebarText}>Local Disk (C:)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sidebarItem}>
               <Folder size={16} color="#FACC15" style={{ marginRight: 12 }} />
               <Text style={styles.sidebarText}>Documents</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sidebarItem}>
               <ImageIcon size={16} color="#0EA5E9" style={{ marginRight: 12 }} />
               <Text style={styles.sidebarText}>Pictures</Text>
            </TouchableOpacity>
         </View>
      </View>

      {/* Main Content */}
      <View style={styles.main}>
        <View style={styles.topBar}>
           <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity style={styles.navBtn}><LayoutGrid size={16} color="#fff" /></TouchableOpacity>
              <TouchableOpacity style={styles.navBtn}><List size={16} color="rgba(255,255,255,0.4)" /></TouchableOpacity>
           </View>
           <View style={styles.searchBar}>
              <Search size={14} color="rgba(255,255,255,0.4)" style={{ marginRight: 8 }} />
              <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>Search Local Disk (C:)</Text>
           </View>
        </View>

        <FlatList
          data={files}
          keyExtractor={(item) => item.name}
          contentContainerStyle={{ padding: 10 }}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.item}>
              <View style={styles.iconContainer}>
                 {getFileIcon(item.type)}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.size}>{item.size}</Text>
              </View>
              <ChevronRight size={14} color="rgba(255,255,255,0.2)" />
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#0A0C10',
  },
  sidebar: {
    width: 220,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 20,
  },
  sidebarGroup: {
    marginBottom: 24,
  },
  sidebarTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.4)',
    paddingHorizontal: 24,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 4,
    marginHorizontal: 8,
  },
  activeSidebar: {
    backgroundColor: 'rgba(0, 120, 212, 0.1)',
  },
  sidebarText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },
  main: {
    flex: 1,
  },
  topBar: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  navBtn: {
    padding: 6,
  },
  searchBar: {
    width: 240,
    height: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  name: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },
  size: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 11,
    marginTop: 2,
  },
});

export default FileManager;
