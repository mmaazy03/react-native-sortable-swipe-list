# react-native-sortable-swipe-list

A performant React Native sortable drag-and-drop list with built-in swipe actions, smooth animations, autoscroll support, and Reanimated-powered gestures.

---

## Features

- ✅ Drag & Drop Sorting
- ✅ Swipe Actions
- ✅ Reanimated Powered
- ✅ Gesture Handler Integrated
- ✅ Auto Scroll While Dragging
- ✅ TypeScript Support
- ✅ Haptic Feedback
- ✅ iOS & Android
- ✅ FlatList-like API
- ✅ Highly Customizable

---

# Installation

```bash
npm install react-native-sortable-swipe-list
```

Install peer dependencies:

```bash
npm install react-native-reanimated react-native-gesture-handler react-native-worklets
```

---

# Basic Drag Example

```tsx
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import SortableDragList from 'react-native-sortable-swipe-list';

const DATA = [
  { id: '1', title: 'Item 1' },
  { id: '2', title: 'Item 2' },
  { id: '3', title: 'Item 3' },
];

export default function App() {
  const [data, setData] = useState(DATA);

  return (
    <SortableDragList
      data={data}
      itemHeight={70}
      keyExtractor={(item) => item.id}
      renderItem={(item, isActive) => (
        <View
          style={{
            height: 70,
            backgroundColor: isActive ? '#f2f2f2' : '#fff',
            justifyContent: 'center',
            paddingHorizontal: 16,
          }}
        >
          <Text>{item.title}</Text>
        </View>
      )}
      onReorder={(items) => {
        setData(items);
      }}
    />
  );
}
```

---

# Swipe + Drag Example

```tsx
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import SortableDragList from 'react-native-sortable-swipe-list';

const DATA = [
  { id: '1', title: 'Item 1' },
  { id: '2', title: 'Item 2' },
  { id: '3', title: 'Item 3' },
];

export default function App() {
  const [data, setData] = useState(DATA);

  return (
    <SortableDragList
      data={data}
      itemHeight={70}
      swipeable
      swipeDirection="right"
      actionWidth={80}
      keyExtractor={(item) => item.id}
      renderItem={(item, isActive) => (
        <View
          style={{
            height: 70,
            backgroundColor: isActive ? '#f2f2f2' : '#fff',
            justifyContent: 'center',
            paddingHorizontal: 16,
          }}
        >
          <Text>{item.title}</Text>
        </View>
      )}
      renderRightActions={(item) => [
        {
          key: 'delete',
          label: 'Delete',
          backgroundColor: '#ff3b30',
          onPress: () => {
            console.log('Delete', item.id);
          },
        },
      ]}
      onReorder={(items) => {
        setData(items);
      }}
    />
  );
}
```

---

# Core Props

| Prop         | Type                         | Description          |
| ------------ | ---------------------------- | -------------------- |
| data         | `T[]`                        | List data            |
| keyExtractor | `(item:T)=>string`           | Unique item key      |
| itemHeight   | `number`                     | Fixed row height     |
| renderItem   | `(item,isActive)=>ReactNode` | Render row item      |
| onReorder    | `(items,from,to)=>void`      | Called after reorder |

---

# Swipe Props

| Prop               | Type                          | Default     | Description                     |
| ------------------ | ----------------------------- | ----------- | ------------------------------- |
| swipeable          | `boolean`                     | `false`     | Enable swipe gestures           |
| swipeDirection     | `'left' \| 'right' \| 'both'` | `'right'`   | Allowed swipe direction         |
| renderRightActions | `(item)=>ISwipeAction[]`      | `undefined` | Right swipe actions             |
| renderLeftActions  | `(item)=>ISwipeAction[]`      | `undefined` | Left swipe actions              |
| actionWidth        | `number`                      | `60`        | Width of each action            |
| swipeThreshold     | `number`                      | `30`        | Swipe open threshold            |
| swipeFailOffsetY   | `number`                      | `20`        | Vertical fail threshold         |
| swipeActiveOffsetX | `number`                      | `10`        | Horizontal activation threshold |

---

# Drag Props

| Prop              | Type      | Default | Description           |
| ----------------- | --------- | ------- | --------------------- |
| disabled          | `boolean` | `false` | Disable dragging      |
| longPressDuration | `number`  | `250`   | Drag activation delay |
| dragScale         | `number`  | `1`     | Active item scale     |

---

# Autoscroll Props

| Prop            | Type     | Default        | Description             |
| --------------- | -------- | -------------- | ----------------------- |
| autoscrollEdge  | `number` | `90`           | Edge detection distance |
| autoscrollSpeed | `number` | platform-based | Autoscroll speed        |

---

# Haptic Props

| Prop          | Type      | Default        | Description    |
| ------------- | --------- | -------------- | -------------- |
| hapticEnabled | `boolean` | `true`         | Enable haptics |
| hapticStart   | `string`  | `impactMedium` | Start haptic   |
| hapticEnd     | `string`  | `impactLight`  | End haptic     |

---

# Styling Props

| Prop                  |
| --------------------- |
| style                 |
| contentContainerStyle |
| rowStyle              |
| rowActiveStyle        |
| cardWrapStyle         |
| actionsContainerStyle |
| actionButtonStyle     |
| actionLabelStyle      |

---

# Separator Props

| Prop            | Type                   | Default       |
| --------------- | ---------------------- | ------------- |
| separatorColor  | `string`               | `transparent` |
| separatorHeight | `number`               | `0`           |
| separatorStyle  | `StyleProp<ViewStyle>` | `undefined`   |

---

# Callbacks

| Prop              | Description                    |
| ----------------- | ------------------------------ |
| onDragStart       | Called when drag starts        |
| onDragEnd         | Called when drag ends          |
| onDragStateChange | Called when drag state changes |
| onSwipeOpen       | Called when swipe opens        |
| onSwipeClose      | Called when swipe closes       |

---

# License

MIT
