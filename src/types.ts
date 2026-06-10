import type { SharedValue } from 'react-native-reanimated';
import type { ViewStyle, TextStyle, StyleProp } from 'react-native';

export type SwipeDirection = 'left' | 'right' | 'both';

export interface ISwipeAction {
  key: string;
  onPress: () => void;
  icon?: React.ReactNode;
  label?: string;
  labelStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
  backgroundColor?: string;
  borderColor?: string;
}

export interface SortableDragListProps<T> {
  data: T[];
  keyExtractor: (item: T) => string;
  itemHeight: number;
  renderItem: (item: T, isActive: boolean) => React.ReactNode;
  onReorder: (orderedData: T[], from: number, to: number) => void;

  // Swipe
  swipeable?: boolean;
  swipeDirection?: SwipeDirection;
  renderRightActions?: (item: T) => ISwipeAction[];
  renderLeftActions?: (item: T) => ISwipeAction[];
  actionWidth?: number;
  swipeThreshold?: number;
  swipeFailOffsetY?: number;
  swipeActiveOffsetX?: number;

  // Drag
  longPressDuration?: number;
  disabled?: boolean;
  dragScale?: number;

  // Autoscroll
  autoscrollSpeed?: number;
  autoscrollEdge?: number;

  // Spring
  springConfig?: { damping: number; stiffness: number; mass: number };

  // Haptics
  hapticEnabled?: boolean;
  hapticStart?: string;
  hapticEnd?: string;

  // Styling
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  rowStyle?: StyleProp<ViewStyle>;
  rowActiveStyle?: StyleProp<ViewStyle>;
  cardWrapStyle?: StyleProp<ViewStyle>;
  actionsContainerStyle?: StyleProp<ViewStyle>;
  actionButtonStyle?: StyleProp<ViewStyle>;
  actionLabelStyle?: StyleProp<TextStyle>;
  rowBackgroundColor?: string;

  // Pass-through
  refreshControl?: React.ReactElement;
  ListEmptyComponent?: React.ReactNode;
  ListHeaderComponent?: React.ReactNode;
  contentPaddingBottom?: number;

  // Callbacks
  onDragStart?: (item: T) => void;
  onDragEnd?: (item: T, from: number, to: number) => void;
  onDragStateChange?: (dragging: boolean) => void;
  onSwipeOpen?: (item: T, direction: 'left' | 'right') => void;
  onSwipeClose?: (item: T) => void;
  // Separator
  separatorColor?: string;
  separatorHeight?: number;
  separatorStyle?: StyleProp<ViewStyle>;
}

export interface SortableRowProps<T> {
  item: T;
  id: string;
  index: number;
  itemHeight: number;
  actionsWidth: number;
  rightActions: ISwipeAction[];
  leftActions: ISwipeAction[];
  swipeDirection: SwipeDirection;
  dragEnabled: boolean;
  swipeEnabled: boolean;
  dragScale: number;
  springConfig: { damping: number; stiffness: number; mass: number };
  longPressDuration: number;
  swipeThreshold: number;
  swipeFailOffsetY: number;
  swipeActiveOffsetX: number;
  hapticEnabled: boolean;
  hapticStart: string;
  hapticEnd: string;
  rowBackgroundColor: string;
  rowStyle?: StyleProp<ViewStyle>;
  rowActiveStyle?: StyleProp<ViewStyle>;
  cardWrapStyle?: StyleProp<ViewStyle>;
  actionsContainerStyle?: StyleProp<ViewStyle>;
  actionButtonStyle?: StyleProp<ViewStyle>;
  actionLabelStyle?: StyleProp<TextStyle>;
  positions: SharedValue<Record<string, number>>;
  scrollTarget: SharedValue<number>;
  activeId: SharedValue<string | null>;
  activeContentY: SharedValue<number>;
  activeIdJS: string | null;
  fingerScreenY: SharedValue<number>;
  startScreenY: SharedValue<number>;
  openSwipeId: SharedValue<string | null>;
  setActiveJS: (id: string | null) => void;
  commitOrder: (order: Record<string, number>) => void;
  renderItem: (item: T, isActive: boolean) => React.ReactNode;
  onSwipeOpen?: (item: T, direction: 'left' | 'right') => void;
  onSwipeClose?: (item: T) => void;
  separatorColor?: string;
  separatorHeight?: number;
  separatorStyle?: StyleProp<ViewStyle>;
  
}