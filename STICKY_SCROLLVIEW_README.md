# StickyScrollView Component

A powerful React Native component that provides smooth, native-like sticky button behavior with sticky tabs navigation. Perfect for creating engaging content experiences with persistent action buttons.

## ✨ Features

- **🎯 Smart Sticky Button**: Button smoothly becomes sticky when scrolling out of view
- **📱 Sticky Tabs Navigation**: Horizontal tabs that stick to the top while scrolling
- **🔍 Section Navigation**: Built-in scroll-to-section functionality with tab synchronization
- **📏 Dynamic Measurements**: Automatically measures and caches button and tabs dimensions
- **🎨 Flexible Layout**: Accepts header, tabs, content, button, and footer as separate props
- **⚡ Native Performance**: Smooth animations with no flickering or visual glitches
- **🔄 External Offset Support**: Handles content above ScrollView for accurate positioning
- **🎮 Programmatic Control**: Rich API for scroll control and navigation

## 🚀 Installation

1. Copy `StickyScrollView.tsx` to your project's components directory
2. Ensure React Native core dependencies are installed
3. Import and use the component

## 📱 Basic Usage

```tsx
import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import StickyScrollView from './components/StickyScrollView';

const MyScreen = () => {
  const [selectedTab, setSelectedTab] = useState('overview');
  const stickyScrollViewRef = useRef(null);

  const header = (
    <View style={styles.header}>
      <Text style={styles.title}>My Content</Text>
    </View>
  );

  const tabs = (
    <View style={styles.tabs}>
      <TouchableOpacity onPress={() => setSelectedTab('overview')}>
        <Text>Overview</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setSelectedTab('details')}>
        <Text>Details</Text>
      </TouchableOpacity>
    </View>
  );

  const content = (
    <View style={styles.content}>
      <Text>Your content sections go here...</Text>
    </View>
  );

  const button = (
    <TouchableOpacity style={styles.button}>
      <Text>Action Button</Text>
    </TouchableOpacity>
  );

  const footer = (
    <View style={styles.footer}>
      <Text>Footer content</Text>
    </View>
  );

  return (
    <StickyScrollView
      ref={stickyScrollViewRef}
      header={header}
      tabs={tabs}
      top={content}
      buttonContent={button}
      footer={footer}
      stickyHeaderIndices={[1]}
    />
  );
};
```

## 🔧 Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `header` | `React.ReactNode` | ✅ | Header content displayed at the top |
| `tabs` | `React.ReactNode` | ✅ | Tab navigation that can be made sticky |
| `top` | `React.ReactNode` | ✅ | Main content sections |
| `buttonContent` | `React.ReactNode` | ✅ | Button that becomes sticky when scrolling |
| `footer` | `React.ReactNode` | ✅ | Additional content at the bottom |
| `stickyHeaderIndices` | `number[]` | ❌ | Array of indices for sticky headers (use `[1]` for sticky tabs) |
| `onSectionChange` | `(sectionName: string) => void` | ❌ | Callback when scroll position changes sections |
| `externalOffset` | `number` | ❌ | Offset for content above ScrollView (e.g., navigation headers) |

## 🎯 Advanced Features

### External Offset Support

When your ScrollView is positioned below other content (navigation headers, status bars, etc.), use `externalOffset` for accurate sticky calculations:

```tsx
const MyScreenWithHeader = () => {
  const [headerHeight, setHeaderHeight] = useState(0);
  
  return (
    <View style={styles.container}>
      {/* Navigation header above ScrollView */}
      <View 
        style={styles.navHeader}
        onLayout={(event) => setHeaderHeight(event.nativeEvent.layout.height)}
      >
        <Text>Navigation Header</Text>
      </View>
      
      <StickyScrollView
        header={header}
        tabs={tabs}
        top={content}
        buttonContent={button}
        footer={footer}
        externalOffset={headerHeight} // Accounts for header height
        stickyHeaderIndices={[1]}
      />
    </View>
  );
};
```

### Section Navigation

Register content sections for programmatic scrolling:

```tsx
const MyScreen = () => {
  const stickyScrollViewRef = useRef(null);
  const overviewRef = useRef(null);
  const detailsRef = useRef(null);

  const content = (
    <>
      <View 
        ref={overviewRef}
        onLayout={(event) => {
          const { y } = event.nativeEvent.layout;
          stickyScrollViewRef.current?.registerSection('overview', y);
        }}
      >
        <Text>Overview Section</Text>
      </View>
      
      <View 
        ref={detailsRef}
        onLayout={(event) => {
          const { y } = event.nativeEvent.layout;
          stickyScrollViewRef.current?.registerSection('details', y);
        }}
      >
        <Text>Details Section</Text>
      </View>
    </>
  );

  return (
    <StickyScrollView
      ref={stickyScrollViewRef}
      header={header}
      tabs={tabs}
      top={content}
      buttonContent={button}
      footer={footer}
      onSectionChange={(sectionName) => {
        console.log('Current section:', sectionName);
      }}
    />
  );
};
```

## 🔗 Ref Methods

Access powerful scroll control methods through the ref:

```tsx
const stickyScrollViewRef = useRef<StickyScrollViewRef>(null);

// Available methods:
stickyScrollViewRef.current?.scrollTo(y, animated);
stickyScrollViewRef.current?.scrollToComponent(ref, animated, offset);
stickyScrollViewRef.current?.scrollToTop(animated);
stickyScrollViewRef.current?.scrollToBottom(animated);
stickyScrollViewRef.current?.scrollToSection(sectionName, animated);
stickyScrollViewRef.current?.registerSection(sectionName, yPosition);
```

### Method Details

| Method | Parameters | Description |
|--------|------------|-------------|
| `scrollTo(y, animated?)` | `y: number, animated?: boolean` | Scroll to specific Y position |
| `scrollToComponent(ref, animated?, offset?)` | `ref: React.RefObject<View>, animated?: boolean, offset?: number` | Scroll to component with optional offset |
| `scrollToTop(animated?)` | `animated?: boolean` | Scroll to top of content |
| `scrollToBottom(animated?)` | `animated?: boolean` | Scroll to bottom of content |
| `scrollToSection(sectionName, animated?)` | `sectionName: string, animated?: boolean` | Scroll to registered section |
| `registerSection(sectionName, yPosition)` | `sectionName: string, yPosition: number` | Register section for navigation |

## 🎨 Content Structure

The component organizes content in this hierarchy:

```
┌─────────────────┐
│     header      │ ← Header content (index 0)
├─────────────────┤
│      tabs       │ ← Tab navigation (index 1) - Sticky!
├─────────────────┤
│      top        │ ← Main content sections (index 2+)
│ [Section 1]     │
│ [Section 2]     │
│ [Section 3]     │
├─────────────────┤
│  buttonContent  │ ← Button that becomes sticky
├─────────────────┤
│     footer      │ ← Footer content
└─────────────────┘
```

## 🔄 How It Works

### 1. **Initialization**
- Component measures button and tabs dimensions on mount
- Caches positions for performance optimization
- Sets up scroll event listeners

### 2. **Sticky Behavior**
- **Tabs**: Stick to top using `stickyHeaderIndices={[1]}`
- **Button**: Becomes sticky at bottom when scrolling out of view
- **Thresholds**: Calculated based on button position and screen dimensions

### 3. **Scroll Detection**
- Monitors scroll direction and position
- Applies sticky logic based on calculated thresholds
- Handles external offset for accurate positioning

### 4. **Section Navigation**
- Tracks registered section positions
- Provides smooth scrolling to sections
- Synchronizes with tab selection

## 🎯 Use Cases

- **Product Detail Pages**: Sticky "Add to Cart" buttons
- **Documentation**: Sticky navigation with content sections
- **Social Media**: Sticky action buttons while browsing content
- **E-commerce**: Sticky checkout or wishlist buttons
- **News/Articles**: Sticky share or bookmark buttons

## 🚀 Performance Tips

1. **Minimize Re-renders**: Use `useCallback` for event handlers
2. **Optimize Measurements**: Avoid frequent layout changes
3. **Efficient Section Registration**: Register sections once on layout
4. **Smooth Animations**: Use `animated={true}` for better UX

## 🔧 Customization

### Styling
The component uses minimal default styles, allowing full customization:

```tsx
const styles = StyleSheet.create({
  header: {
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 25,
    padding: 16,
  },
});
```

### Behavior
Customize sticky behavior through props and ref methods:

```tsx
<StickyScrollView
  ref={stickyScrollViewRef}
  // ... other props
  onSectionChange={(section) => {
    // Custom section change logic
  }}
/>
```

## 📱 Platform Support

- ✅ iOS (React Native)
- ✅ Android (React Native)
- ✅ Web (React Native Web)
- ✅ Expo

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

This component is open source and available under the MIT License. 