import React, { useCallback } from 'react';
import { View, StyleSheet, LayoutChangeEvent } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedReaction,
  useDerivedValue,
  useFrameCallback,
  scrollTo,
} from 'react-native-reanimated';
import { objectMove, clamp } from './utils';
import { DEFAULTS } from './constants';
import { SortableRow } from './SortableRow';
import type { SortableDragListProps } from './types';

const EMPTY_ACTIONS: any[] = [];

function SortableDragList<T>({
  data,
  keyExtractor,
  itemHeight,
  renderItem,
  onReorder,
  swipeable = false,
  swipeDirection = 'right',
  renderRightActions,
  renderLeftActions,
  actionWidth = DEFAULTS.actionWidth,
  swipeThreshold = DEFAULTS.swipeThreshold,
  swipeFailOffsetY = DEFAULTS.failOffsetY,
  swipeActiveOffsetX = DEFAULTS.activeOffsetX,
  longPressDuration = DEFAULTS.longPressDuration,
  disabled = false,
  dragScale = DEFAULTS.dragScale,
  autoscrollSpeed = DEFAULTS.autoscrollSpeed,
  autoscrollEdge = DEFAULTS.autoscrollEdge,
  springConfig = DEFAULTS.springConfig,
  hapticEnabled = DEFAULTS.hapticEnabled,
  hapticStart = DEFAULTS.hapticStart,
  hapticEnd = DEFAULTS.hapticEnd,
  style,
  contentContainerStyle,
  rowStyle,
  rowActiveStyle,
  cardWrapStyle,
  actionsContainerStyle,
  actionButtonStyle,
  rowBackgroundColor = '#fff',
  refreshControl,
  ListEmptyComponent,
  ListHeaderComponent,
  contentPaddingBottom = 0,
  onDragStart,
  onDragEnd,
  onDragStateChange,
  onSwipeOpen,
  onSwipeClose,
  actionLabelStyle,
  separatorColor = 'transparent',
  separatorHeight = 0,
  separatorStyle,
}: SortableDragListProps<T>) {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollY = useSharedValue(0);
  const scrollTarget = useSharedValue(0);
  const containerHeight = useSharedValue(0);

  const positions = useSharedValue<Record<string, number>>(
    Object.fromEntries(data.map((d, i) => [keyExtractor(d), i]))
  );
  const activeId = useSharedValue<string | null>(null);
  const activeContentY = useSharedValue(0);
  const fingerScreenY = useSharedValue(0);
  const startScreenY = useSharedValue(0);
  const openSwipeId = useSharedValue<string | null>(null);

  const [activeIdJS, setActiveIdJSState] = React.useState<string | null>(null);

  const setActiveIdJS = useCallback(
    (id: string | null) => {
      setActiveIdJSState((prev) => {
        if (prev !== null && id === null) {
          const fromIdx = data.findIndex((d) => keyExtractor(d) === prev);
          const toPos = positions.value[prev];
          const item = data[fromIdx];
          if (item && onDragEnd) onDragEnd(item, fromIdx, toPos ?? fromIdx);
        }
        if (prev === null && id !== null) {
          const item = data.find((d) => keyExtractor(d) === id);
          if (item && onDragStart) onDragStart(item);
        }
        return id;
      });
      onDragStateChange?.(id !== null);
    },
    [data, keyExtractor, onDragStart, onDragEnd, onDragStateChange]
  );

  const count = data.length;
  const contentHeight = count * itemHeight + contentPaddingBottom;
  const orderKey = data.map(keyExtractor).join('|');

  React.useEffect(() => {
    if (activeId.value === null) {
      positions.value = Object.fromEntries(
        data.map((d, i) => [keyExtractor(d), i])
      );
    }
  }, [orderKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const commitOrder = useCallback(
    (order: Record<string, number>) => {
      const arr = [...data].sort(
        (a, b) => order[keyExtractor(a)] - order[keyExtractor(b)]
      );
      const fromIdx = data.findIndex(
        (d, i) => keyExtractor(d) !== keyExtractor(arr[i])
      );
      const toIdx =
        fromIdx === -1
          ? -1
          : arr.findIndex(
              (d) => keyExtractor(d) === keyExtractor(data[fromIdx])
            );
      onReorder(arr, fromIdx, toIdx);
    },
    [data, keyExtractor, onReorder]
  );

  const scrollHandler = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
    if (activeId.value === null) scrollTarget.value = e.contentOffset.y;
  });

  useDerivedValue(() => {
    if (activeId.value !== null) {
      scrollTo(scrollRef, 0, scrollTarget.value, false);
    }
  });

  useAnimatedReaction(
    () => (activeId.value !== null ? activeContentY.value : null),
    (cur) => {
      if (cur == null || activeId.value == null) return;
      const id = activeId.value;
      const oldPos = positions.value[id];
      const newPos = clamp(
        Math.floor((cur + itemHeight / 2) / itemHeight),
        0,
        count - 1
      );
      if (newPos !== oldPos) {
        positions.value = objectMove(positions.value, oldPos, newPos);
      }
    }
  );

  useFrameCallback((frame) => {
    if (activeId.value == null) return;
    const dt = (frame.timeSincePreviousFrame ?? 16) / 1000;
    const screenTop = fingerScreenY.value;
    const maxScroll = Math.max(0, contentHeight - containerHeight.value);

    let dir = 0;
    let t = 0;
    if (screenTop < autoscrollEdge && scrollTarget.value > 0) {
      dir = -1;
      t = clamp((autoscrollEdge - screenTop) / autoscrollEdge, 0, 1);
    } else if (
      screenTop + itemHeight > containerHeight.value - autoscrollEdge &&
      scrollTarget.value < maxScroll
    ) {
      dir = 1;
      t = clamp(
        (screenTop + itemHeight - (containerHeight.value - autoscrollEdge)) /
          autoscrollEdge,
        0,
        1
      );
    }
    if (dir !== 0) {
      const delta = dir * autoscrollSpeed * dt * t;
      scrollTarget.value = clamp(scrollTarget.value + delta, 0, maxScroll);
      activeContentY.value = fingerScreenY.value + scrollTarget.value;
    }
  });

  const onLayout = (e: LayoutChangeEvent) => {
    containerHeight.value = e.nativeEvent.layout.height;
  };

  if (count === 0 && ListEmptyComponent) {
    return (
      <View style={[styles.container, style]} onLayout={onLayout}>
        {ListHeaderComponent}
        {ListEmptyComponent}
      </View>
    );
  }

  return (
    <View style={[styles.container, style]} onLayout={onLayout}>
      <Animated.ScrollView
        ref={scrollRef}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={false}
        refreshControl={refreshControl}
        contentContainerStyle={[
          { height: contentHeight },
          contentContainerStyle,
        ]}
      >
        {ListHeaderComponent}
        {data.map((item, index) => {
          const id = keyExtractor(item);
          return (
            <SortableRow
              key={id}
              item={item}
              id={id}
              index={index}
              itemHeight={itemHeight}
              actionsWidth={actionWidth}
              rightActions={
                swipeable && renderRightActions
                  ? renderRightActions(item)
                  : EMPTY_ACTIONS
              }
              leftActions={
                swipeable && renderLeftActions
                  ? renderLeftActions(item)
                  : EMPTY_ACTIONS
              }
              swipeDirection={swipeDirection}
              dragEnabled={!disabled}
              swipeEnabled={swipeable}
              dragScale={dragScale}
              springConfig={springConfig}
              longPressDuration={longPressDuration}
              swipeThreshold={swipeThreshold}
              swipeFailOffsetY={swipeFailOffsetY}
              swipeActiveOffsetX={swipeActiveOffsetX}
              hapticEnabled={hapticEnabled}
              hapticStart={hapticStart}
              hapticEnd={hapticEnd}
              rowBackgroundColor={rowBackgroundColor}
              rowStyle={rowStyle}
              rowActiveStyle={rowActiveStyle}
              cardWrapStyle={cardWrapStyle}
              actionsContainerStyle={actionsContainerStyle}
              actionButtonStyle={actionButtonStyle}
              positions={positions}
              scrollTarget={scrollTarget}
              activeId={activeId}
              activeContentY={activeContentY}
              activeIdJS={activeIdJS}
              fingerScreenY={fingerScreenY}
              startScreenY={startScreenY}
              openSwipeId={openSwipeId}
              setActiveJS={setActiveIdJS}
              commitOrder={commitOrder}
              renderItem={renderItem}
              onSwipeOpen={onSwipeOpen}
              onSwipeClose={onSwipeClose}
              actionLabelStyle={actionLabelStyle}
              separatorColor={separatorColor}
              separatorHeight={separatorHeight}
              separatorStyle={separatorStyle}

            />
          );
        })}
      </Animated.ScrollView>
    </View>
  );
}

export default SortableDragList;

const styles = StyleSheet.create({
  container: { flex: 1 },
});