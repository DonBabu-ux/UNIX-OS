import * as React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Platform } from 'react-native';
import { User, Settings, Power } from 'lucide-react';
import { useTheme } from '../../theme/themeProvider';

interface SystemControlPanelProps {
  userName: string;
  onLogoutPress?: () => void;
  onSettingsPress?: () => void;
}

const SystemControlPanel: React.FC<SystemControlPanelProps> = ({ 
  userName = "Administrator",
  onLogoutPress,
  onSettingsPress 
}) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.userInfo} 
        activeOpacity={0.6}
      >
        <View style={styles.userAvatar}>
          <User size={18} color="rgba(255, 255, 255, 0.9)" />
        </View>
        <Text style={styles.userName}>{userName}</Text>
      </TouchableOpacity>
      
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.actionIcon} 
          onPress={onSettingsPress}
          activeOpacity={0.6}
        >
          <Settings size={20} color="rgba(255, 255, 255, 0.9)" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionIcon, styles.powerIcon]} 
          onPress={onLogoutPress}
          activeOpacity={0.6}
        >
          <Power size={20} color="#FF4D4D" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 72,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 48,
    backgroundColor: '#1E293B',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    zIndex: 100,
    ...Platform.select({
      web: {
        //@ts-ignore
        boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.2)',
      },
      default: {
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      }
    }),
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    // Note: React Native doesn't support hover directly, but we can simulate luxury feel via activeOpacity and good padding
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userName: {
    color: 'rgba(255, 255, 255, 0.95)',
    fontSize: 14,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'rgba(255, 255, 255, 0.04)', // Removed static bg for cleaner look
  },
  powerIcon: {
    marginLeft: 4,
  },
});

export default SystemControlPanel;
