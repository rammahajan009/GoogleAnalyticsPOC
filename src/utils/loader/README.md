# Loader Component

A high-performance, accessible loader component with optimized state management for React Native applications.

## Features

- **High Performance**: Optimized with React.memo, useMemo, and useCallback
- **Simple State Management**: Direct state updates without complex event system
- **Minimal Design**: Clean, single loader type with consistent styling
- **Full Screen Overlay**: Covers entire screen with semi-transparent background
- **Accessibility**: Full accessibility support with screen reader compatibility
- **Memory Efficient**: Prevents unnecessary re-renders and object recreation
- **Single Instance**: Only one loader can be shown at a time
- **TypeScript Support**: Full TypeScript support with proper type definitions

## Installation

The Loader component is already included in the project. Import it from the components:

```tsx
import { Loader, LoaderProvider, loader } from '../components';
```

## Setup

### 1. Add LoaderProvider to your App

Wrap your app with the `LoaderProvider` component:

```tsx
import React from 'react';
import { LoaderProvider } from './src/components';

function App() {
  return (
    <YourAppContent>
      {/* Your app content */}
      <LoaderProvider />
    </YourAppContent>
  );
}
```

### 2. Use the Loader Service

```tsx
import { loader } from './src/components';

// Show a basic loader
const loaderId = loader.show();

// Hide the loader
loader.hide();
```

## API Reference

### LoaderService Methods

#### `loader.show(options?)`
Shows a loader with the given options.

**Parameters:**
- `options` (LoaderOptions, optional): Loader configuration

**Returns:** `string` - Loader ID for reference

**Example:**
```tsx
// Basic loader
const id = loader.show();

// With custom size
const id = loader.show({
  size: 'small'
});
```

#### `loader.hide()`
Hides the current loader.

**Note:** Only one loader can be shown at a time. Calling `show()` while another loader is visible will replace it.


### LoaderOptions Interface

```tsx
interface LoaderOptions {
  size?: 'small' | 'large';           // Spinner size (default: 'large')
}
```

## Usage Examples

### Basic Usage

```tsx
import { loader } from '../components';

// Show loader
loader.show();

// Hide loader after some operation
setTimeout(() => {
  loader.hide();
}, 3000);
```



### Custom Size Loader

```tsx
loader.show({
  size: 'small'
});
```

### Async Operations

```tsx
const loadData = async () => {
  loader.show();
  
  try {
    const data = await fetchData();
    loader.hide();
    // Handle success
  } catch (error) {
    loader.hide();
    // Handle error
  }
};
```

## Performance Optimizations

The Loader component is highly optimized for performance:

- **React.memo**: Prevents unnecessary re-renders when props haven't changed
- **useMemo**: Memoizes expensive calculations and object creation
- **useCallback**: Prevents function recreation and unnecessary effect re-runs
- **Static Styles**: Styles are created once and reused
- **Efficient Subscriptions**: Optimized listener management with early returns
- **Timeout Management**: Proper cleanup to prevent memory leaks

## Simple State Management

The LoaderService uses direct state management:

- Only one loader can be shown at a time
- Calling `loader.show()` while another loader is visible will replace it
- Use `loader.hide()` to hide the current loader
- No complex event system - just simple state updates
- Automatic timeout cleanup to prevent memory leaks

## Accessibility

The Loader component includes full accessibility support:

- Screen reader announcements when loaders appear/disappear
- Proper accessibility roles and labels
- Keyboard navigation support
- High contrast mode support

## Styling

The Loader component uses optimized, consistent styling:

- **Full Screen Overlay**: Covers entire screen with semi-transparent dark background
- **Centered Spinner**: ActivityIndicator centered in the middle of the screen
- **Clean Design**: Minimal, distraction-free loading indicator
- **Primary Blue Accent**: Consistent blue color (#007AFF) for the spinner
- **Static Styles**: Styles created once for optimal performance
- **No Complex Responsive Logic**: Simple, reliable styling that works everywhere

## TypeScript Support

Full TypeScript support is included:

```tsx
import { LoaderOptions, LoaderInstance, LoaderProps } from '../components';

const options: LoaderOptions = {
  size: 'large'
};

const loaderProps: LoaderProps = {
  visible: true,
  size: 'small'
};
```

## Component Architecture

The Loader system consists of three main parts:

1. **Loader.tsx**: The actual UI component (memoized for performance)
2. **LoaderService.ts**: Singleton service for state management
3. **LoaderProvider.tsx**: React context provider (memoized for performance)

This architecture ensures:
- Clean separation of concerns
- Optimal performance with React optimizations
- Simple API for developers
- Type-safe implementation
