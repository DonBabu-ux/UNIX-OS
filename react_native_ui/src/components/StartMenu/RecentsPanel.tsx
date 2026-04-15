import * as React from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme/themeProvider';

interface RecentItem {
  id: string;
  name: string;
  time: string;
  icon: React.ElementType;
  color: string;
}

interface RecentsPanelProps {
  items: RecentItem[];
  onItemPress?: (id: string) => void;
}

const RecentsPanel: React.FC<RecentsPanelProps> = ({ items, onItemPress }) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recommended</Text>
        <TouchableOpacity style={styles.moreButton}>
          <Text style={styles.moreText}>More ›</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        {items.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.recItem}
            onPress={() => onItemPress?.(item.id)}
            activeOpacity={0.7}
          >
            <View style={[styles.recIcon, { backgroundColor: item.color }]}>
              <item.icon size={16} color="#fff" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.recLabel} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.recSub}>{item.time}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 220, // Constrained height for independent scrolling
    paddingHorizontal: 24,
    marginTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
    opacity: 0.6,
  },
  moreButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  moreText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 10,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 10,
    gap: 8,
  },
  recItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  recIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  recLabel: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  recSub: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 10,
    marginTop: 1,
  },
});

export default RecentsPanel;
