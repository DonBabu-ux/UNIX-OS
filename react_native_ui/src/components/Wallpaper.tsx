import * as React from 'react';
import { Image, StyleSheet, View, Platform, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const Wallpaper: React.FC = () => {
  // Using a premium CSS gradient as base to never have a 404/empty screen
  const wallpaperUri = '/wallpapers/launcher_wallpaper_dark.png';

  return (
    <View style={styles.container}>
      <View style={styles.gradientBase} />
      <Image
        source={{ uri: wallpaperUri }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.overlay} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
    backgroundColor: '#0B0F17',
  },
  gradientBase: {
    ...StyleSheet.absoluteFillObject,
    // Premium dark gradient fallback
    backgroundColor: '#0B0F17',
    backgroundImage: 'radial-gradient(circle at 50% 50%, #1E293B 0%, #0B0F17 100%)',
  } as any,
  image: {
    width: '100%',
    height: '100%',
    opacity: 0.6, // Blend image with gradient
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Slightly darker for pro depth
  },
});

export default Wallpaper;
