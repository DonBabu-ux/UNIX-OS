import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions, Platform } from 'react-native';
import Animated, { FadeIn, FadeOut, ZoomIn, ZoomOut } from 'react-native-reanimated';
import { useAppsStore } from '../../state/slices/appsSlice';
import { FolderItem } from '../../state/slices/homeScreenSlice';
import { useTheme } from '../theme/themeProvider';
import { X } from 'lucide-react';

const { width: W, height: H } = Dimensions.get('window');

interface HomeFolderProps {
  folder: FolderItem;
  onAppPress: (pkg: string) => void;
}

const HomeFolder: React.FC<HomeFolderProps> = ({ folder, onAppPress }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const theme = useTheme();
  
  // To keep it simple, we'll map package names to generic "Icon placeholders" for now
  // In a real scenario, we'd use the bridge to get real icons.
  const appIcons = folder.apps.slice(0, 4);

  return (
    <>
      <TouchableOpacity 
        style={styles.folderContainer} 
        onPress={() => setIsOpen(true)}
        activeOpacity={0.7}
      >
        <View style={[styles.folderPreview, { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }]}>
           <View style={styles.miniGrid}>
             {appIcons.map((pkg, idx) => (
               <View key={idx} style={[styles.miniApp, { backgroundColor: folder.iconColor + '44' }]} />
             ))}
           </View>
        </View>
        <Text style={styles.folderName} numberOfLines={1}>{folder.name}</Text>
      </TouchableOpacity>

      <Modal transparent visible={isOpen} animationType="none">
        <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.overlay}>
          <TouchableOpacity activeOpacity={1} style={StyleSheet.absoluteFill} onPress={() => setIsOpen(false)} />
          
          <Animated.View 
            entering={ZoomIn.springify().damping(15)} 
            exiting={ZoomOut}
            style={[styles.expandedFolder, { backgroundColor: theme.surfaceDark, borderColor: theme.border }]}
          >
            <View style={styles.folderHeader}>
               <Text style={[styles.expandedTitle, {color: '#fff'}]}>{folder.name}</Text>
               <TouchableOpacity onPress={() => setIsOpen(false)}>
                 <X size={20} color="rgba(255,255,255,0.5)" />
               </TouchableOpacity>
            </View>

            <View style={styles.expandedGrid}>
              {folder.apps.map((pkg) => (
                <TouchableOpacity 
                    key={pkg} 
                    style={styles.expandedApp} 
                    onPress={() => { onAppPress(pkg); setIsOpen(false); }}
                >
                  <View style={[styles.appIconLarge, { backgroundColor: folder.iconColor }]} />
                  <Text style={styles.appNameLarge} numberOfLines={1}>{pkg.split('.').pop()}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        </Animated.View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  folderContainer: { width: 80, alignItems: 'center', marginBottom: 20 },
  folderPreview: { width: 64, height: 64, borderRadius: 16, borderWidth: 1, padding: 8, justifyContent: 'center', alignItems: 'center' },
  miniGrid: { flexDirection: 'row', flexWrap: 'wrap', width: 40, height: 40, gap: 4, justifyContent: 'center', alignItems: 'center' },
  miniApp: { width: 16, height: 16, borderRadius: 4 },
  folderName: { 
    color: '#fff', 
    fontSize: 11, 
    fontWeight: '600', 
    marginTop: 8, 
    textShadow: '0px 1px 2px rgba(0,0,0,0.5)' 
  },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  expandedFolder: { width: W * 0.8, maxWidth: 400, borderRadius: 24, borderWidth: 1, padding: 24, paddingBottom: 40 },
  folderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  expandedTitle: { fontSize: 24, fontWeight: '900', letterSpacing: -0.5 },
  expandedGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 20, justifyContent: 'center' },
  expandedApp: { width: 80, alignItems: 'center', gap: 10 },
  appIconLarge: { width: 56, height: 56, borderRadius: 14 },
  appNameLarge: { color: '#fff', fontSize: 12, fontWeight: '700', textAlign: 'center' }
});

export default HomeFolder;
