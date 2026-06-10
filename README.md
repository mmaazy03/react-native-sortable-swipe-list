# react-native-sortable-swipe-list

A performant React Native sortable drag-and-drop list with built-in swipe actions, smooth animations, autoscroll support, and Reanimated-powered gestures.

---

## Features

* ✅ Drag & Drop Sorting
* ✅ Swipe Actions
* ✅ Reanimated Powered
* ✅ Gesture Handler Integrated
* ✅ Auto Scroll While Dragging
* ✅ TypeScript Support
* ✅ Haptic Feedback
* ✅ iOS & Android
* ✅ FlatList-like API
* ✅ Highly Customizable

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

<video
src="https://res.cloudinary.com/dsxvnjefn/video/upload/v1781055388/Draggable_ut9nws.mp4"
controls
width="320"
/>

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

<video
src="https://res.cloudinary.com/dsxvnjefn/video/upload/v1781055382/swipeable_drag_bijchg.mov"
controls
width="320"
/>

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
