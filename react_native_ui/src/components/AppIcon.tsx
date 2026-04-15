import * as React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Platform, Dimensions } from 'react-native';
import { useResponsive } from '../state/ResponsiveManager';
import { 
  FileText, 
  BarChart, 
  Presentation, 
  Database, 
  Sparkles, 
  Globe, 
  Settings, 
  Package,
  Folder,
  CheckSquare
} from 'lucide-react';
import { useTheme } from '../theme/themeProvider';

interface AppIconProps {
  name: string;
  icon: string;
  onPress: () => void;
}

const getAppVisuals = (name: string) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('word') || lowerName.includes('doc')) return { Icon: FileText, color: '#0078D4' };
  if (lowerName.includes('excel') || lowerName.includes('sheet')) return { Icon: BarChart, color: '#107C10' };
  if (lowerName.includes('powerpoint') || lowerName.includes('slide')) return { Icon: Presentation, color: '#C43E1C' };
  if (lowerName.includes('access') || lowerName.includes('db')) return { Icon: Database, color: '#A4373A' };
  if (lowerName.includes('tasks')) return { Icon: CheckSquare, color: '#8B5CF6' };
  if (lowerName.includes('notes')) return { Icon: Sparkles, color: '#FACC15' };
  if (lowerName.includes('files')) return { Icon: Folder, color: '#FACC15' };
  if (lowerName.includes('browser')) return { Icon: Globe, color: '#0EA5E9' };
  if (lowerName.includes('settings')) return { Icon: Settings, color: '#64748B' };
  return { Icon: Package, color: '#0078D4' };
};

const AppIcon: React.FC<AppIconProps> = React.memo(({ name, icon, onPress }) => {
  const theme = useTheme();
  const { isMobile } = useResponsive();
  const visuals = getAppVisuals(name);

  return (
    <TouchableOpacity 
      style={[styles.container, isMobile && styles.mobileContainer]} 
      onPress={onPress} 
      activeOpacity={0.7}
    >
      <View style={[styles.tile, isMobile && styles.mobileTile, { backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }]}>
        <visuals.Icon size={isMobile ? 24 : 32} color={visuals.color} />
      </View>
      <Text style={[styles.label, { color: theme.text }]} numberOfLines={2}>
        {name}
      </Text>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    width: 90,
    alignItems: 'center',
    marginVertical: 12,
    marginHorizontal: 4,
  },
  mobileContainer: {
    width: 75,
    marginHorizontal: 2,
  },
  tile: {
    width: 60,
    height: 60,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    ...Platform.select({
      web: {
        transition: 'all 0.2s ease',
      }
    })
  },
  mobileTile: {
    width: 50,
    height: 50,
    borderRadius: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    width: '100%',
    ...Platform.select({
      web: { textShadow: '0px 1px 2px rgba(0,0,0,0.5)' },
    }),
  } as any,
});

export default AppIcon;
