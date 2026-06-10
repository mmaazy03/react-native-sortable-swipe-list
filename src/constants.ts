import { Platform } from 'react-native';

export const DEFAULTS = {
  autoscrollEdge: 90,
  autoscrollSpeed: Platform.OS === 'android' ? 180 : 360,
  longPressDuration: 250,
  swipeThreshold: 30,
  actionWidth: 60,
  dragScale: 1.0,
  springConfig: { damping: 20, stiffness: 200, mass: 0.6 },
  hapticEnabled: true,
  hapticStart: 'impactMedium',
  hapticEnd: 'impactLight',
  failOffsetY: 20,
  activeOffsetX: 10,
  separatorColor: 'transparent',
  separatorHeight: 0,
};