import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useSettingsStore, useUserStore } from '../state/store';
import { useTheme } from '../theme/themeProvider';
import { purchaseSubscription, SUBSCRIPTION_SKUS } from '../payments/subscription';

const ThemeSettings: React.FC = () => {
  const theme = useTheme();
  const { setTheme, setAccentColor, accentColor, theme: currentMode } = useSettingsStore();
  const isPro = useUserStore((state) => state.isPro);

  const accentColors = ['#3d5afe', '#ff1744', '#00e676', '#ffea00', '#d500f9', '#ffffff'];

  const handleColorPress = (color: string, index: number) => {
    if (index > 1 && !isPro) {
      Alert.alert(
        'Pro Feature',
        'Custom accent colors are available for Pro users only.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Get Pro', onPress: () => purchaseSubscription(SUBSCRIPTION_SKUS.MONTHLY_PRO) }
        ]
      );
      return;
    }
    setAccentColor(color);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Appearance</Text>

      {!isPro && (
        <TouchableOpacity 
          style={styles.proBanner} 
          onPress={() => purchaseSubscription(SUBSCRIPTION_SKUS.MONTHLY_PRO)}
        >
          <Text style={styles.proBannerTitle}>Unlock Everything</Text>
          <Text style={styles.proBannerText}>Get Pro for custom accents, icon packs, and more!</Text>
        </TouchableOpacity>
      )}

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>THEME MODE</Text>
        <View style={styles.row}>
          <TouchableOpacity 
            style={[styles.modeButton, currentMode === 'dark' && { borderColor: accentColor }]}
            onPress={() => setTheme('dark')}
          >
            <Text style={{ color: theme.text }}>Dark</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.modeButton, currentMode === 'light' && { borderColor: accentColor }]}
            onPress={() => setTheme('light')}
          >
            <Text style={{ color: theme.text }}>Light</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>ACCENT COLOR</Text>
        <View style={styles.colorGrid}>
          {accentColors.map((color, index) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorCircle, 
                { backgroundColor: color },
                accentColor === color && styles.selectedCircle,
                index > 1 && !isPro && styles.lockedCircle
              ]}
              onPress={() => handleColorPress(color, index)}
            >
               {index > 1 && !isPro && <Text style={styles.lockIcon}>🔒</Text>}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>ICON SIZE</Text>
        <View style={styles.row}>
           <Text style={{ color: theme.text }}>Available in Pro updates soon.</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  proBanner: {
    backgroundColor: '#ffd700',
    padding: 20,
    borderRadius: 16,
    marginBottom: 30,
  },
  proBannerTitle: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  proBannerText: {
    color: '#444',
    fontSize: 12,
    marginTop: 4,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    gap: 15,
  },
  modeButton: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
    backgroundColor: '#333',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  colorCircle: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCircle: {
    borderWidth: 3,
    borderColor: '#fff',
  },
  lockedCircle: {
    opacity: 0.6,
  },
  lockIcon: {
    fontSize: 14,
  },
});

export default ThemeSettings;
