import * as React from 'react';
import { View, StyleSheet, PanResponder, Dimensions, Animated, Text, TouchableOpacity, Platform } from 'react-native';
import { X, Minus, Square, Maximize2 } from 'lucide-react';
import { useTheme } from '../theme/themeProvider';

export type WindowInstance = {
  id: string;
  title: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  isFocused: boolean;
  isMaximized?: boolean;
};

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * UNIVA WINDOW MANAGER (CORE ENGINE)
 * Manages draggable, focusable application windows natively.
 */
export const WindowManager: React.FC<{ 
  windows: WindowInstance[], 
  onFocus: (id: string) => void,
  onClose: (id: string) => void,
  onMinimize: (id: string) => void,
  onMaximize: (id: string) => void,
  onMove: (id: string, x: number, y: number) => void,
  renderContent: (win: WindowInstance) => React.ReactNode
}> = ({ windows, onFocus, onClose, onMinimize, onMaximize, onMove, renderContent }) => {
  const theme = useTheme();

  const renderWindow = (win: WindowInstance) => {
    // Basic Draggable Logic
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => onFocus(win.id),
      onPanResponderMove: (_, gestureState) => {
        // More responsive movement
        onMove(win.id, win.x + gestureState.dx, win.y + gestureState.dy);
      },
    });

    return (
      <View 
        key={win.id}
        style={[
          styles.window, 
          { 
            left: win.isMaximized ? 0 : win.x, 
            top: win.isMaximized ? 0 : win.y, 
            width: win.isMaximized ? SCREEN_WIDTH : win.width, 
            height: win.isMaximized ? SCREEN_HEIGHT - 60 : win.height, 
            zIndex: win.zIndex,
            backgroundColor: win.isFocused ? 'rgba(28, 36, 52, 0.95)' : 'rgba(20, 25, 35, 0.85)',
            borderColor: win.isFocused ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
            borderRadius: win.isMaximized ? 0 : 8,
          }
        ]}
      >
        {/* Title Bar - Drag Handle */}
        <View {...panResponder.panHandlers} style={[styles.titleBar]}>
           <View style={styles.titleInfo}>
              <View style={[styles.appIconSmall, { backgroundColor: theme.primary }]} />
              <Text style={[styles.titleText, { color: win.isFocused ? '#fff' : 'rgba(255,255,255,0.5)' }]}>
                {win.title}
              </Text>
           </View>
           
           <View style={styles.windowControls}>
              <TouchableOpacity onPress={() => onMinimize(win.id)} style={styles.controlBtn}>
                 <Minus size={14} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onMaximize(win.id)} style={styles.controlBtn}>
                 <Square size={12} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onClose(win.id)} style={[styles.controlBtn, styles.closeBtn]}>
                 <X size={14} color="#fff" />
              </TouchableOpacity>
           </View>
        </View>

        {/* Client Area */}
        <View style={styles.clientArea}>
           {renderContent(win)}
        </View>
      </View>
    );
  };

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {[...windows].sort((a, b) => a.zIndex - b.zIndex).map(renderWindow)}
    </View>
  );
};

const styles = StyleSheet.create({
  window: {
    position: 'absolute',
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
    // boxShadow handled via native/web differences if needed
    backgroundColor: '#050505',
    ...Platform.select({
      web: {
        filter: 'drop-shadow(0 20px 50px rgba(0,0,0,0.5))',
      }
    })
  },
  titleBar: {
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  titleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  appIconSmall: {
    width: 14,
    height: 14,
    borderRadius: 3,
  },
  titleText: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  windowControls: {
    flexDirection: 'row',
    height: '100%',
  },
  controlBtn: {
     width: 42,
     height: 32,
     justifyContent: 'center',
     alignItems: 'center',
  },
  closeBtn: {
     // Optional: red on hover logic would be web-only
  },
  clientArea: {
    flex: 1,
    backgroundColor: '#000',
  },
});
