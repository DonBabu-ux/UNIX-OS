import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { FolderPlus, RefreshCw, Monitor, Palette, Grid } from 'lucide-react';
import { useTheme } from '../theme/themeProvider';

interface DesktopContextMenuProps {
  visible: boolean;
  x: number;
  y: number;
  onClose: () => void;
  onAction: (action: string) => void;
}

const DesktopContextMenu: React.FC<DesktopContextMenuProps> = ({ visible, x, y, onClose, onAction }) => {
  const theme = useTheme();
  const opacity = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.timing(opacity, { toValue: 1, duration: 150, useNativeDriver: true }).start();
    } else {
      opacity.setValue(0);
    }
  }, [visible]);

  if (!visible) return null;

  const items = [
    { label: 'New Folder', icon: FolderPlus, action: 'NEW_FOLDER' },
    { label: 'Refresh', icon: RefreshCw, action: 'REFRESH' },
    { label: 'Sort Icons', icon: Grid, action: 'SORT' },
    { label: 'Display Settings', icon: Monitor, action: 'SETTINGS' },
    { label: 'Personalize', icon: Palette, action: 'THEME' },
  ];

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
       <TouchableOpacity activeOpacity={1} style={StyleSheet.absoluteFill} onPress={onClose} />
       <Animated.View 
         style={[
           styles.menu, 
           { 
             top: y, 
             left: x, 
             opacity, 
             backgroundColor: 'rgba(30, 41, 59, 0.95)',
             borderColor: 'rgba(255, 255, 255, 0.1)'
           }
         ]}
       >
         {items.map((item, idx) => (
           <React.Fragment key={item.action}>
             <TouchableOpacity 
               style={styles.menuItem} 
               onPress={() => { onAction(item.action); onClose(); }}
             >
               <item.icon size={16} color="rgba(255,255,255,0.7)" />
               <Text style={styles.menuText}>{item.label}</Text>
             </TouchableOpacity>
             {idx === 0 || idx === 2 ? <View style={styles.divider} /> : null}
           </React.Fragment>
         ))}
       </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  menu: {
    position: 'absolute',
    width: 200,
    borderRadius: 8,
    borderWidth: 1,
    padding: 4,
    boxShadow: '0px 10px 30px rgba(0,0,0,0.3)',
    elevation: 10,
    zIndex: 9999,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 4,
    gap: 12,
  },
  menuText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginVertical: 4,
    marginHorizontal: 8,
  }
});

export default DesktopContextMenu;
