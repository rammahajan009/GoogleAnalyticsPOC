# HorizontalPagingFlatList

A simple and reusable React Native component that provides a horizontal FlatList with paging enabled, supporting items with variable heights that automatically adapt to the maximum height.

## Features

- ✅ Horizontal scrolling with paging enabled
- ✅ Variable height items with automatic max height adaptation
- ✅ Simple configuration with minimal props
- ✅ Automatic width adaptation to parent container
- ✅ Automatic height adaptation using flexbox
- ✅ TypeScript support with generic data types
- ✅ Built-in pagination dots
- ✅ Smooth animations and gestures
- ✅ Callback support for item changes

## Installation

Copy the `HorizontalPagingFlatList` folder to your project's components directory.

## Basic Usage

```tsx
import React from 'react';
import { View, Text } from 'react-native';
import { HorizontalPagingFlatList } from './components/HorizontalPagingFlatList';

interface MyDataItem {
  id: string;
  title: string;
  content: string;
}

const MyComponent = () => {
  const data: MyDataItem[] = [
    {
      id: '1',
      title: 'Item 1',
      content: 'Content for item 1',
    },
    {
      id: '2',
      title: 'Item 2',
      content: 'Content for item 2 with longer text that will create a taller item',
    },
    // ... more items
  ];

  const renderItem = ({ item }: { item: MyDataItem }) => (
    <View style={{ backgroundColor: '#fff', padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.title}</Text>
      <Text>{item.content}</Text>
    </View>
  );

  return (
    <HorizontalPagingFlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      onItemChange={(item, index) => console.log('Current item:', item, 'Index:', index)}
    />
  );
};
```

## Props

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `data` | `T[]` | Array of items to display |
| `renderItem` | `(props: { item: T; index: number }) => React.ReactElement` | Function to render each item |
| `keyExtractor` | `(item: T, index: number) => string` | Function to extract unique key for each item |

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `itemSpacing` | `number` | `20` | Spacing between items |
| `showPaginationDots` | `boolean` | `true` | Show pagination dots |
| `containerStyle` | `ViewStyle` | Style for the main container |
| `itemContainerStyle` | `ViewStyle` | Style for individual item containers |
| `onItemChange` | `(item: T, index: number) => void` | Called when the current item changes |
| `testID` | `string` | Test ID for testing |

## Examples

### Custom Configuration

```tsx
<HorizontalPagingFlatList
  data={data}
  renderItem={renderItem}
  keyExtractor={(item) => item.id}
  itemSpacing={30}
  containerStyle={{ backgroundColor: '#f0f0f0' }}
  onItemChange={(item, index) => console.log('Current:', item)}
/>
```

### With Custom Styling

```tsx
<HorizontalPagingFlatList
  data={data}
  renderItem={renderItem}
  keyExtractor={(item) => item.id}
  containerStyle={{ backgroundColor: '#f5f5f5', borderRadius: 10 }}
  itemContainerStyle={{ shadowOpacity: 0.2 }}
/>
```

### Minimal Configuration

```tsx
<HorizontalPagingFlatList
  data={data}
  renderItem={renderItem}
  keyExtractor={(item) => item.id}
  showPaginationDots={false}
/>
```

## Data Requirements

Your data items can be any type `T`. The component is fully generic and works with any data structure:

```tsx
// Example with simple objects
interface MyDataItem {
  id: string;
  title: string;
  content: string;
}

// Example with any other structure
type UserData = {
  userId: number;
  name: string;
  email: string;
};
```

**Note:** The component uses flexbox to automatically adapt to content height. Items will size themselves based on their content using flex layout. You just need to provide a `keyExtractor` function to generate unique keys.

## Performance Tips

1. **Optimize renderItem**: Keep your render functions lightweight and use `React.memo` if needed
2. **Limit data size**: For very large datasets, consider implementing pagination or virtualization
3. **Image optimization**: If rendering images, use optimized image components
4. **Flexbox compatibility**: The component uses flexbox for automatic sizing, no manual layout calculations needed

## Accessibility

The component includes built-in accessibility features:
- Custom accessibility labels can be provided
- Pagination dots are accessible for screen readers

## Browser Compatibility

This component is designed for React Native and supports both iOS and Android platforms.

## License

This component is part of your project and follows your project's license terms.
