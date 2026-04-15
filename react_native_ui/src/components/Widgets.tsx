import * as React from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, TouchableOpacity } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useTheme } from '../theme/themeProvider';
import { 
  Sparkles, 
  Target, 
  Cpu, 
  AlertTriangle, 
  Zap,
  Clock,
  Activity,
  Smile,
  LucideIcon
} from 'lucide-react';

const GlassIcon: React.FC<{ Icon: LucideIcon; color: string; size?: number }> = ({ Icon, color, size = 14 }) => (
  <View style={[styles.iconGlass, { backgroundColor: color + '15', borderColor: color + '33' }]}>
    <Icon size={size} color={color} />
  </View>
);

export const AIWidget: React.FC = () => {
  const theme = useTheme();
  return (
    <Animated.View entering={FadeInUp.delay(600)} style={[styles.card, theme.glassEffect]}>
      <View style={styles.cardHeader}>
        <GlassIcon Icon={Sparkles} color={theme.accent} />
        <Text style={[styles.label, { color: theme.accent }]}>UNIVA CO-PILOT</Text>
      </View>
      
      <Text style={[styles.message, { color: theme.text }]}>
        Optimized Grok-4 Pipeline: Ready for multi-task synthesis and humanized output.
      </Text>

      <View style={styles.aiActions}>
         <TouchableOpacity style={[styles.aiActionBtn, { backgroundColor: 'rgba(0, 120, 212, 0.1)' }]}>
            <Zap size={12} color={theme.primary} />
            <Text style={[styles.aiActionText, { color: theme.primary }]}>Insight Engine</Text>
         </TouchableOpacity>
         <TouchableOpacity style={[styles.aiActionBtn, { backgroundColor: 'rgba(139, 92, 246, 0.1)' }]}>
            <Smile size={12} color="#8B5CF6" />
            <Text style={[styles.aiActionText, { color: '#8B5CF6' }]}>Humanizer</Text>
         </TouchableOpacity>
      </View>

      <View style={[styles.aiProgress, { backgroundColor: theme.surfaceDark }]}>
        <View style={[styles.aiProgressBar, { width: '82%', backgroundColor: theme.accent }]} />
      </View>
    </Animated.View>
  );
};

export const PriorityCard: React.FC = () => {
  const theme = useTheme();
  return (
    <Animated.View entering={FadeInUp.delay(700)} style={[styles.card, theme.glassEffect]}>
      <View style={styles.cardHeader}>
        <GlassIcon Icon={Target} color={theme.textSecondary} />
        <Text style={styles.title}>Priority Target</Text>
      </View>
      <Text style={[styles.task, { color: theme.text }]}>System Launch</Text>
      <View style={[styles.progressBar, { backgroundColor: theme.surfaceDark }]}>
         <View style={[styles.progressFill, { backgroundColor: theme.primary, width: '65%' }]} />
      </View>
      <Text style={styles.progressText}>65% Complete</Text>
    </Animated.View>
  );
};

export const AISyncCard: React.FC<{ title: string; category: string; icon: string; urgent?: boolean }> = ({ title, category, urgent }) => {
  const theme = useTheme();
  return (
    <Animated.View entering={FadeInUp.delay(800)} style={[styles.card, styles.smallCard, theme.glassEffect, urgent && styles.urgent]}>
      <View style={styles.syncHeader}>
        <GlassIcon 
          Icon={urgent ? AlertTriangle : Cpu} 
          color={urgent ? theme.error : theme.primary} 
        />
        <Text style={[styles.aiSync, { color: urgent ? theme.error : theme.primary }]}>✦ SYNC</Text>
      </View>
      <Text style={[styles.syncTitle, { color: theme.text }]}>{title}</Text>
      <View style={[styles.tag, { backgroundColor: urgent ? 'rgba(255, 67, 67, 0.1)' : 'rgba(0, 120, 212, 0.1)' }]}>
        <Text style={[styles.tagText, { color: urgent ? theme.error : theme.primary }]}>{category}</Text>
      </View>
    </Animated.View>
  );
};

export const TimeWidget: React.FC<{ isHacker?: boolean }> = ({ isHacker }) => {
  const theme = useTheme();
  const [time, setTime] = React.useState(new Date());
  const hackerGreen = '#00FF41';

  React.useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <Animated.View 
      entering={FadeInUp.delay(500)} 
      style={[
        styles.card, 
        theme.glassEffect, 
        styles.timeWidget,
        isHacker && { borderColor: hackerGreen + '44', backgroundColor: 'rgba(0,0,0,0.6)' }
      ]}
    >
      <GlassIcon Icon={Clock} color={isHacker ? hackerGreen : theme.textSecondary} size={20} />
      <Text style={[styles.bigTime, { color: isHacker ? hackerGreen : theme.text }]}>
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
      <Text style={[styles.dateText, isHacker && { color: hackerGreen + 'AA' }]}>
        {time.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
      </Text>
      {isHacker && <View style={[styles.hackerGlow, { backgroundColor: hackerGreen }]} />}
    </Animated.View>
  );
};

export const PulseChart: React.FC = () => {
  const theme = useTheme();
  const data = [40, 60, 45, 90, 65, 50, 40];
  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <Animated.View entering={FadeInUp.delay(900)} style={[styles.card, styles.pulseCard, theme.glassEffect]}>
      <View style={styles.cardHeader}>
        <GlassIcon Icon={Activity} color={theme.accent} />
        <Text style={styles.title}>System Pulse</Text>
      </View>
      <View style={styles.chartWrapper}>
        {data.map((value, index) => (
          <View key={index} style={styles.barContainer}>
            <View style={[styles.bar, { 
                height: (value / 100) * 80, 
                backgroundColor: value > 70 ? theme.accent : theme.primary,
                opacity: 0.8 
            }]} />
            <Text style={styles.chartLabel}>{weekDays[index]}</Text>
          </View>
        ))}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 24,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
    backgroundColor: 'rgba(28, 36, 52, 0.4)',
    //@ts-ignore
    backdropFilter: 'blur(20px)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  label: { fontSize: 10, fontWeight: '800', letterSpacing: 1.5 },
  message: { fontSize: 13, lineHeight: 20, fontWeight: '400', marginBottom: 16 },
  aiActions: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  aiActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  aiActionText: {
    fontSize: 10,
    fontWeight: '700',
  },
  aiProgress: {
    height: 4,
    borderRadius: 2,
    width: '100%',
    overflow: 'hidden',
  },
  aiProgressBar: {
    height: '100%',
    borderRadius: 2,
  },
  title: { color: '#8E9AAB', fontSize: 13, fontWeight: '600' },
  task: { fontSize: 24, fontWeight: '800', marginBottom: 16 },
  progressBar: {
    height: 6,
    borderRadius: 3,
    width: '100%',
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 10,
    fontWeight: '600',
  },
  tag: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  tagText: { fontSize: 10, fontWeight: '700' },
  smallCard: { flex: 1 },
  syncHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  aiSync: { fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  syncTitle: { fontSize: 15, fontWeight: '700', marginBottom: 16 },
  urgent: { borderColor: 'rgba(255, 67, 67, 0.3)' },
  pulseCard: { flex: 2 },
  timeWidget: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    minHeight: 140,
  },
  bigTime: { fontSize: 32, fontWeight: '800', letterSpacing: -1 },
  dateText: { fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4 },
  chartWrapper: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 10, height: 100 },
  barContainer: { alignItems: 'center', width: '12%' },
  bar: { width: '100%', borderRadius: 4, minHeight: 4 },
  chartLabel: { color: '#8E9AAB', marginTop: 8, fontSize: 10, fontWeight: '600' },
  iconGlass: {
    width: 30,
    height: 30,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
  },
  hackerGlow: {
    position: 'absolute',
    bottom: -2,
    left: '10%',
    width: '80%',
    height: 1,
    opacity: 0.6,
    //@ts-ignore
    boxShadow: '0 0 20px #00FF41, 0 0 40px #00FF41',
  },
});
