import * as React from 'react';
import { View, StyleSheet, Dimensions, Text, Platform } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  useAnimatedGestureHandler,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import HomeScreen from '../screens/HomeScreen';
import AppDrawer from '../screens/AppDrawer';
import { useTheme } from '../theme/themeProvider';
import { useResponsive } from '../state/ResponsiveManager';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const DRAWER_HEIGHT = SCREEN_HEIGHT * 0.9;
const TRIGGER_THRESHOLD = -100;

const RootNavigator: React.FC = () => {
  const theme = useTheme();
  const { isMobile } = useResponsive();
  const translateY = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx) => {
      const nextValue = ctx.startY + event.translationY;
      translateY.value = Math.min(0, Math.max(-DRAWER_HEIGHT, nextValue));
    },
    onEnd: (event) => {
      const velocity = event.velocityY;
      const dragDistance = event.translationY;

      if (dragDistance < TRIGGER_THRESHOLD || velocity < -500) {
        translateY.value = withSpring(-DRAWER_HEIGHT, { damping: 20, stiffness: 90 });
      } else {
        translateY.value = withSpring(0, { damping: 20, stiffness: 90 });
      }
    },
  });

  const drawerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value + SCREEN_HEIGHT }],
      zIndex: translateY.value > -10 ? 0 : 2000,
    };
  });

  const homeStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      translateY.value,
      [-DRAWER_HEIGHT, 0],
      [0.95, 1],
      Extrapolate.CLAMP
    );
    const opacity = interpolate(
      translateY.value,
      [-DRAWER_HEIGHT, 0],
      [0.6, 1],
      Extrapolate.CLAMP
    );
    const borderRadius = interpolate(
      translateY.value,
      [-DRAWER_HEIGHT, 0],
      [32, 0],
      Extrapolate.CLAMP
    );
    return {
      transform: [{ scale }],
      opacity,
      borderRadius,
    };
  });

  return (
    <View style={[styles.container, { backgroundColor: '#000' }]}>
      <Animated.View style={[styles.layer, homeStyle, { backgroundColor: theme.background }]}>
        <HomeScreen />
        
        {isMobile && (
          <View style={styles.indicatorContainer}>
            <View style={[styles.indicatorPill, { backgroundColor: 'rgba(255,255,255,0.2)' }]} />
            <Text style={styles.indicatorText}>Swipe up</Text>
          </View>
        )}
      </Animated.View>

      <PanGestureHandler 
        onGestureEvent={gestureHandler}
        activeOffsetY={[-40, 40]}
        enabled={isMobile}
      >
        <Animated.View 
          pointerEvents="box-none"
          style={[styles.drawerContainer, drawerStyle]}
        >
          <AppDrawer />
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    flex: 1,
  },
  layer: {
    ...StyleSheet.absoluteFillObject,
  },
  drawerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT,
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: 24,
    width: '100%',
    alignItems: 'center',
    gap: 6,
  },
  indicatorPill: {
    width: 36,
    height: 4,
    borderRadius: 2,
  },
  indicatorText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 9,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
});

export default RootNavigator;

