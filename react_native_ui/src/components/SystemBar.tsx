import * as React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

const SystemBar: React.FC = () => {
  const [time, setTime] = React.useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const [date, setDate] = React.useState(new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', weekday: 'short' }));

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setDate(new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', weekday: 'short' }));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.timeText}>{time}</Text>
        <Text style={styles.dateText}>{date}</Text>
      </View>
      
      <View style={styles.center}>
         <View style={styles.aiBadge}>
            <View style={styles.aiDot} />
            <Text style={styles.aiText}>UNIVA AI ACTIVE</Text>
         </View>
      </View>

      <View style={styles.right}>
        <Text style={styles.systemIcon}>📶</Text>
        <Text style={styles.systemIcon}>🔋 85%</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 48,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    backgroundColor: 'rgba(11, 15, 23, 0.4)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    zIndex: 100,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  timeText: {
    color: '#EAF0FF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  dateText: {
    color: '#AAB4C5',
    fontSize: 12,
    fontWeight: '500',
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    boxShadow: '0 0 10px rgba(139, 92, 246, 0.1)' as any,
  },
  aiDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#8B5CF6',
  },
  aiText: {
    color: '#8B5CF6',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  systemIcon: {
    color: '#AAB4C5',
    fontSize: 14,
  },
});

export default SystemBar;
