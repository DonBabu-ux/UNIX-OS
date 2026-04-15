// UNIVA OS - App Entry - Refreshed
import * as React from 'react';
import { useState, useEffect } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Platform, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import RootNavigator from './src/navigation/RootNavigator';
import { ThemeProvider } from './src/theme/themeProvider';
import { ResponsiveProvider } from './src/state/ResponsiveManager';
import { FloatingAIAssistant } from './src/components/FloatingAIAssistant';

const App = () => {
  useEffect(() => {
    console.log('[DEBUG] App mounted on platform:', Platform.OS);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <ResponsiveProvider>
          <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0B0F17" translucent />
            <RootNavigator />
            <FloatingAIAssistant />
            {Platform.OS === 'web' && (
              <View style={styles.webDebug}>
                <Text style={{ color: 'rgba(255,255,255,0.15)', fontSize: 10, fontWeight: '700' }}>UNIVA OS · AI POWERED · V1.0</Text>
              </View>
            )}
          </SafeAreaView>
        </ResponsiveProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    backgroundColor: '#0B0F17',
  },
  webDebug: {
    position: 'absolute',
    top: 5,
    right: 15,
    opacity: 0.8,
  }
});

export default App;
