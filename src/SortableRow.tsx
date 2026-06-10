import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedReaction,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { clamp, haptic } from './utils';
import type { SortableRowProps, ISwipeAction } from './types';

function SortableRowInner<T>({
  item,
  id,
  index,
  itemHeight,
  actionsWidth,
  rightActions,
  leftActions,
  swipeDirection,
  dragEnabled,
  swipeEnabled,
  dragScale,
  springConfig,
  longPressDuration,
  swipeThreshold,
  swipeFailOffsetY,
  swipeActiveOffsetX,
  hapticEnabled,
  hapticStart,
  hapticEnd,
  rowBackgroundColor,
  rowStyle: rowStyleProp,
  rowActiveStyle,
  cardWrapStyle,
  actionsContainerStyle,
  actionButtonStyle,
  actionLabelStyle,
  positions,
  scrollTarget,
  activeId,
  activeContentY,
  activeIdJS,
  fingerScreenY,
  startScreenY,
  openSwipeId,
  setActiveJS,
  commitOrder,
  renderItem,
  onSwipeOpen,
  onSwipeClose,
  separatorColor,
  separatorHeight,
  separatorStyle,
}: SortableRowProps<T>) {
  const translateY = useSharedValue(index * itemHeight);
  const active = useSharedValue(0);
  const swipeX = useSharedValue(0);
  const baseX = useSharedValue(0);

  const hasRight =
    (swipeDirection === 'right' || swipeDirection === 'both') &&
    rightActions.length > 0;
  const hasLeft =
    (swipeDirection === 'left' || swipeDirection === 'both') &&
    leftActions.length > 0;
  const hasSwipe = swipeEnabled && (hasRight || hasLeft);

  const totalRightWidth = actionsWidth * Math.max(1, rightActions.length);
  const totalLeftWidth = actionsWidth * Math.max(1, leftActions.length);

  const minSwipe = hasRight ? -totalRightWidth : 0;
  const maxSwipe = hasLeft ? totalLeftWidth : 0;

  useAnimatedReaction(
    () => positions.value[id],
    (pos) => {
      if (pos == null) return;
      if (activeId.value !== id) {
        translateY.value = withSpring(pos * itemHeight, springConfig);
      }
    }
  );

  useAnimatedReaction(
    () => (activeId.value === id ? activeContentY.value : -999999),
    (cur) => {
      if (cur !== -999999) translateY.value = cur;
    }
  );

  useAnimatedReaction(
    () => openSwipeId.value,
    (openId) => {
      if (openId !== id && swipeX.value !== 0) {
        swipeX.value = withTiming(0);
        baseX.value = 0;
      }
    }
  );

  const dragGesture = Gesture.Pan()
    .enabled(dragEnabled)
    .activateAfterLongPress(longPressDuration)
    .onStart(() => {
      const contentTop = positions.value[id] * itemHeight;
      startScreenY.value = contentTop - scrollTarget.value;
      fingerScreenY.value = startScreenY.value;
      activeContentY.value = contentTop;
      activeId.value = id;
      active.value = 1;
      swipeX.value = withTiming(0);
      baseX.value = 0;
      openSwipeId.value = null;
      scheduleOnRN(setActiveJS, id);
      scheduleOnRN(haptic, hapticStart, hapticEnabled);
    })
    .onUpdate((e) => {
      fingerScreenY.value = startScreenY.value + e.translationY;
      activeContentY.value = fingerScreenY.value + scrollTarget.value;
    })
    .onEnd(() => {
      const finalPos = positions.value[id];
      activeId.value = null;
      active.value = 0;
      translateY.value = withSpring(finalPos * itemHeight, springConfig);
      scheduleOnRN(setActiveJS, null);
      scheduleOnRN(haptic, hapticEnd, hapticEnabled);
      scheduleOnRN(commitOrder, positions.value);
    });

  const swipeGesture = Gesture.Pan()
    .enabled(hasSwipe)
    .activeOffsetX([-swipeActiveOffsetX, swipeActiveOffsetX])
    .failOffsetY([-swipeFailOffsetY, swipeFailOffsetY])
    .onStart(() => {
      if (openSwipeId.value !== null && openSwipeId.value !== id) {
        openSwipeId.value = null;
      }
    })
    .onUpdate((e) => {
      swipeX.value = clamp(e.translationX + baseX.value, minSwipe, maxSwipe);
    })
    .onEnd(() => {
      if (swipeX.value < -swipeThreshold && hasRight) {
        swipeX.value = withTiming(-totalRightWidth);
        baseX.value = -totalRightWidth;
        openSwipeId.value = id;
        if (onSwipeOpen) scheduleOnRN(onSwipeOpen, item, 'right');
      } else if (swipeX.value > swipeThreshold && hasLeft) {
        swipeX.value = withTiming(totalLeftWidth);
        baseX.value = totalLeftWidth;
        openSwipeId.value = id;
        if (onSwipeOpen) scheduleOnRN(onSwipeOpen, item, 'left');
      } else {
        swipeX.value = withTiming(0);
        baseX.value = 0;
        if (openSwipeId.value === id) {
          openSwipeId.value = null;
          if (onSwipeClose) scheduleOnRN(onSwipeClose, item);
        }
      }
    })
    .onFinalize(() => {
      if (swipeX.value < -swipeThreshold && hasRight) {
        swipeX.value = withTiming(-totalRightWidth);
        baseX.value = -totalRightWidth;
      } else if (swipeX.value > swipeThreshold && hasLeft) {
        swipeX.value = withTiming(totalLeftWidth);
        baseX.value = totalLeftWidth;
      } else if (
        swipeX.value !== 0 &&
        Math.abs(swipeX.value) <= swipeThreshold
      ) {
        swipeX.value = withTiming(0);
        baseX.value = 0;
      }
    });

  const gesture = hasSwipe
    ? Gesture.Race(dragGesture, swipeGesture)
    : dragGesture;

  const rowAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: 1 + active.value * (dragScale - 1) },
    ],
    zIndex: active.value > 0 ? 100 : 0,
    shadowOpacity: active.value * 0.15,
    shadowRadius: active.value * 6,
    elevation: active.value * 4,
  }));

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: swipeX.value }],
  }));

  const closeAnd = (fn: () => void) => {
    swipeX.value = withTiming(0);
    baseX.value = 0;
    openSwipeId.value = null;
    fn();
  };

  const isActive = activeIdJS === id;

  const renderActions = (actions: ISwipeAction[], side: 'left' | 'right') => (
    <View
      style={[
        styles.actions,
        side === 'right' ? { right: 0 } : { left: 0 },
        { width: actionsWidth * Math.max(1, actions.length) },
        actionsContainerStyle,
      ]}
    >
      {actions.map((a: ISwipeAction, i: number) => (
        <Pressable
          key={a.key}
          onPress={() => closeAnd(a.onPress)}
          style={[
            styles.action,
            {
              width: actionsWidth,
              backgroundColor: a.backgroundColor,
              borderColor: a.borderColor,
              borderRightWidth:
                side === 'right' && i !== actions.length - 1
                  ? StyleSheet.hairlineWidth
                  : 0,
              borderLeftWidth:
                side === 'left' && i !== actions.length - 1
                  ? StyleSheet.hairlineWidth
                  : 0,
            },
            actionButtonStyle,
            a.style,
          ]}
        >
          {a.icon && a.icon}
          {a.label && (
            <Text
              style={[styles.actionLabel, actionLabelStyle, a.labelStyle]}
              numberOfLines={2}
            >
              {a.label}
            </Text>
          )}
        </Pressable>
      ))}
    </View>
  );

  return (
    <Animated.View
      style={[
        styles.row,
        { height: itemHeight },
        rowStyleProp,
        isActive && rowActiveStyle,
        rowAnimatedStyle,
      ]}
      pointerEvents="box-none"
    >
      {hasLeft && renderActions(leftActions, 'left')}
      {hasRight && renderActions(rightActions, 'right')}

      <GestureDetector gesture={gesture}>
        <Animated.View
          style={[
            styles.cardWrap,
            { backgroundColor: rowBackgroundColor },
            cardWrapStyle,
            cardAnimatedStyle,
          ]}
        >
              {renderItem(item, isActive)}
    {separatorHeight > 0 && (
      <View
        style={[
          styles.separator,
          {
            backgroundColor: separatorColor,
            height: separatorHeight,
          },
          separatorStyle,
        ]}
      />
    )}
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
}

export const SortableRow = React.memo(
  SortableRowInner
) as typeof SortableRowInner;

const styles = StyleSheet.create({
  row: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
  },
  actions: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  action: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  actionLabel: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  cardWrap: {
    flex: 1,
  },
  separator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});