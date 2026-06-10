import { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { SortableDragList } from 'react-native-sortable-swipe-list';

interface Item {
  id: string;
  title: string;
  color: string;
}

const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
  '#F8C471', '#82E0AA', '#F1948A', '#AED6F1', '#D7BDE2',
  '#A3E4D7', '#FAD7A0', '#A9CCE3', '#D5DBDB', '#EDBB99',
];

const randomColor = () => COLORS[Math.floor(Math.random() * COLORS.length)]!;

const ITEMS: Item[] = Array.from({ length: 50 }, (_, i) => ({
  id: `item-${i}`,
  title: `Item ${i + 1}`,
  color: randomColor(),
}));

function Main() {
  const [data, setData] = useState(ITEMS);
  const insets = useSafeAreaInsets();

  const renderItem = useCallback(
    (item: Item, isActive: boolean) => (
      <View
        style={[
          styles.card,
          { backgroundColor: item.color },
          isActive && styles.active,
        ]}
      >
        <Text style={styles.text}>{item.title}</Text>
      </View>
    ),
    []
  );

  return (
    <GestureHandlerRootView style={styles.root}>
      <View
        style={[
          styles.root,
          { paddingTop: insets.top, paddingBottom: insets.bottom },
        ]}
      >
        <Text style={styles.header}>Sortable Swipe List</Text>
        <SortableDragList
          data={data}
          keyExtractor={(i) => i.id}
          itemHeight={64}
          renderItem={renderItem}
          onReorder={(reordered) => setData(reordered)}
          rowBackgroundColor="#f5f5f5"
          contentPaddingBottom={insets.bottom + 20}
          swipeable
          swipeDirection="both"
          renderRightActions={(item) => [
            {
              key: 'delete',
              icon: <Text style={styles.actionIcon}>🗑️</Text>,
              label: 'Delete',
              backgroundColor: '#e74c3c',
              onPress: () =>
                setData((d) => d.filter((x) => x.id !== item.id)),
            },
            {
              key: 'archive',
              icon: <Text style={styles.actionIcon}>📦</Text>,
              label: 'Archive',
              backgroundColor: '#3498db',
              onPress: () => console.log('archive', item.id),
            },
          ]}
          renderLeftActions={(item) => [
            {
              key: 'pin',
              icon: <Text style={styles.actionIcon}>📌</Text>,
              label: 'Pin',
              backgroundColor: '#2ecc71',
              onPress: () => console.log('pin', item.id),
            },
          ]}
        />
      </View>
    </GestureHandlerRootView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <Main />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    fontSize: 22,
    fontWeight: '700',
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#333',
  },
  card: {
    flex: 1,
    borderRadius: 10,
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginHorizontal: 12,
    marginVertical: 3,
  },
  active: { opacity: 0.85 },
  text: { fontSize: 16, fontWeight: '600', color: '#fff' },
  actionIcon: { fontSize: 18 },
});