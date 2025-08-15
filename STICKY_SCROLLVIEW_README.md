# 🚀 StickyScrollView Component

A powerful, high-performance React Native component that provides sticky button functionality with smooth animations and intelligent section navigation.

## ✨ Features

- **🎯 Sticky Button**: Button becomes sticky at the bottom when scrolling
- **📱 Section Navigation**: Automatic tab activation based on scroll position
- **⚡ High Performance**: Optimized with React hooks and efficient algorithms
- **🎨 Customizable**: Flexible props for header, tabs, content, and footer
- **🔄 Smooth Animations**: Native performance with smooth transitions
- **📏 Responsive**: Works on all screen sizes and orientations
- **🔧 Ref Methods**: Programmatic scroll control and section navigation
- **🎭 Sticky Headers**: Support for sticky header indices
- **📊 External Offset**: Account for content above the ScrollView

## 📦 Installation

```bash
# Copy the component to your project
cp src/components/StickyScrollView.tsx src/components/
```

## 🚀 Basic Usage

```tsx
import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import StickyScrollView from './components/StickyScrollView';

const App = () => {
  const stickyScrollViewRef = useRef(null);
  const [selectedTab, setSelectedTab] = useState('overview');

  const header = (
    <View style={{ padding: 20, backgroundColor: '#f8f9fa' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>My App</Text>
    </View>
  );

  const tabs = (
    <View style={{ flexDirection: 'row', backgroundColor: '#fff', padding: 10 }}>
      <TouchableOpacity style={{ flex: 1, padding: 10, alignItems: 'center' }}>
        <Text>Overview</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{ flex: 1, padding: 10, alignItems: 'center' }}>
        <Text>Features</Text>
      </TouchableOpacity>
    </View>
  );

  const buttonContent = (
    <TouchableOpacity style={{ backgroundColor: '#007AFF', padding: 15, borderRadius: 8 }}>
      <Text style={{ color: '#fff', textAlign: 'center' }}>Action Button</Text>
    </TouchableOpacity>
  );

  return (
    <StickyScrollView
      ref={stickyScrollViewRef}
      header={header}
      tabs={tabs}
      buttonContent={buttonContent}
      onSectionChange={(sectionName) => {
        console.log('Current section:', sectionName);
        setSelectedTab(sectionName);
      }}
    >
      {/* Your content here */}
    </StickyScrollView>
  );
};
```

## 🎯 Advanced Usage with Section Navigation

```tsx
import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import StickyScrollView from './components/StickyScrollView';

const AdvancedApp = () => {
  const stickyScrollViewRef = useRef(null);
  const [selectedTab, setSelectedTab] = useState('overview');
  
  // Refs for section measurement
  const overviewRef = useRef(null);
  const featuresRef = useRef(null);
  const detailsRef = useRef(null);

  const header = (
    <View style={{ padding: 20, backgroundColor: '#f8f9fa' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Advanced Demo</Text>
    </View>
  );

  const tabs = (
    <View style={{ flexDirection: 'row', backgroundColor: '#fff', padding: 10 }}>
      <TouchableOpacity 
        style={[styles.tab, selectedTab === 'overview' && styles.activeTab]}
        onPress={() => {
          setSelectedTab('overview');
          stickyScrollViewRef.current?.scrollToSection('overview', true);
        }}
      >
        <Text style={[styles.tabText, selectedTab === 'overview' && styles.activeTabText]}>
          Overview
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.tab, selectedTab === 'features' && styles.activeTab]}
        onPress={() => {
          setSelectedTab('features');
          stickyScrollViewRef.current?.scrollToSection('features', true);
        }}
      >
        <Text style={[styles.tabText, selectedTab === 'features' && styles.activeTabText]}>
          Features
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.tab, selectedTab === 'details' && styles.activeTab]}
        onPress={() => {
          setSelectedTab('details');
          stickyScrollViewRef.current?.scrollToSection('details', true);
        }}
      >
        <Text style={[styles.tabText, selectedTab === 'details' && styles.activeTabText]}>
          Details
        </Text>
      </TouchableOpacity>
    </View>
  );

  const buttonContent = (
    <TouchableOpacity style={{ backgroundColor: '#007AFF', padding: 15, borderRadius: 8 }}>
      <Text style={{ color: '#fff', textAlign: 'center' }}>Get Started</Text>
    </TouchableOpacity>
  );

  return (
    <StickyScrollView
      ref={stickyScrollViewRef}
      header={header}
      tabs={tabs}
      buttonContent={buttonContent}
      stickyHeaderIndices={[1]} // Make tabs sticky
      onSectionChange={(sectionName) => {
        if (sectionName === 'overview' || sectionName === 'features' || sectionName === 'details') {
          setSelectedTab(sectionName);
        }
      }}
    >
      {/* Overview Section */}
      <View
        ref={overviewRef}
        style={styles.contentSection}
        onLayout={(event) => {
          overviewRef.current?.measure((x, y, width, height, pageX, pageY) => {
            stickyScrollViewRef.current?.registerSection('overview', pageY);
          });
        }}
      >
        <Text style={styles.sectionTitle}>Overview</Text>
        <Text style={styles.contentText}>
          This demonstrates the StickyScrollView component with sticky button functionality.
          Scroll down to see the button become sticky at the bottom of the screen.
        </Text>
      </View>

      {/* Features Section */}
      <View
        ref={featuresRef}
        style={styles.contentSection}
        onLayout={(event) => {
          featuresRef.current?.measure((x, y, width, height, pageX, pageY) => {
            stickyScrollViewRef.current?.registerSection('features', pageY);
          });
        }}
      >
        <Text style={styles.sectionTitle}>Features</Text>
        <Text style={styles.contentText}>
          • Smooth sticky behavior with native performance{'\n'}
          • Customizable content sections{'\n'}
          • Responsive design for all screen sizes{'\n'}
          • Easy integration with existing components
        </Text>
      </View>

      {/* Details Section */}
      <View
        ref={detailsRef}
        style={styles.contentSection}
        onLayout={(event) => {
          detailsRef.current?.measure((x, y, width, height, pageX, pageY) => {
            stickyScrollViewRef.current?.registerSection('details', pageY);
          });
        }}
      >
        <Text style={styles.sectionTitle}>Technical Details</Text>
        <Text style={styles.contentText}>
          • Built with React Native core components{'\n'}
          • Uses ScrollView with custom scroll handling{'\n'}
          • Implements sticky positioning with absolute positioning{'\n'}
          • Optimized with useRef and useEffect hooks
        </Text>
      </View>
    </StickyScrollView>
  );
};
```

## 📋 Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `header` | `ReactNode` | ❌ | Content displayed at the top of the ScrollView |
| `tabs` | `ReactNode` | ❌ | Navigation tabs (can be made sticky) |
| `top` | `ReactNode` | ❌ | Content positioned after tabs |
| `buttonContent` | `ReactNode` | ❌ | Content for the sticky button |
| `footer` | `ReactNode` | ❌ | Content displayed at the bottom |
| `stickyHeaderIndices` | `number[]` | ❌ | Indices of headers to make sticky |
| `onSectionChange` | `(sectionName: string) => void` | ❌ | Callback when scroll position changes sections |
| `externalOffset` | `number` | ❌ | Offset for content above ScrollView (e.g., navigation headers) |

## 🎯 Advanced Features

### Sticky Headers
Make specific content sections sticky while scrolling:
```tsx
<StickyScrollView
  stickyHeaderIndices={[1, 3]} // Make tabs (index 1) and footer (index 3) sticky
  // ... other props
>
```

### External Offset
Account for content above the ScrollView (like navigation headers):
```tsx
const [headerHeight, setHeaderHeight] = useState(0);

<View 
  onLayout={(event) => setHeaderHeight(event.nativeEvent.layout.height)}
  style={styles.navigationHeader}
>
  {/* Navigation header content */}
</View>

<StickyScrollView
  externalOffset={headerHeight}
  // ... other props
>
```

## 🔗 Ref Methods

Access the component's methods through a ref:

```tsx
const stickyScrollViewRef = useRef(null);

// Scroll to specific position
stickyScrollViewRef.current?.scrollTo(100, true);

// Scroll to specific component
stickyScrollViewRef.current?.scrollToComponent(componentRef, true, 20);

// Scroll to top
stickyScrollViewRef.current?.scrollToTop(true);

// Scroll to bottom
stickyScrollViewRef.current?.scrollToBottom(true);

// Scroll to specific section
stickyScrollViewRef.current?.scrollToSection('overview', true);

// Register a section for navigation
stickyScrollViewRef.current?.registerSection('sectionName', yPosition);
```

### Available Methods

| Method | Parameters | Description |
|--------|------------|-------------|
| `scrollTo(y, animated)` | `y: number, animated: boolean` | Scroll to specific Y position |
| `scrollToComponent(ref, animated, offset)` | `ref: ReactRef, animated: boolean, offset: number` | Scroll to component with optional offset |
| `scrollToTop(animated)` | `animated: boolean` | Scroll to top of content |
| `scrollToBottom(animated)` | `animated: boolean` | Scroll to bottom of content |
| `scrollToSection(sectionName, animated)` | `sectionName: string, animated: boolean` | Scroll to registered section |
| `registerSection(sectionName, yPosition)` | `sectionName: string, yPosition: number` | Register section for navigation |

## ⚡ Performance Features

The component is optimized for smooth performance:

- **🎯 Memoization**: Uses `useCallback` and `useMemo` for expensive operations
- **📱 Scroll Throttling**: 8ms scroll event throttling for responsive scrolling
- **🔄 Layout Caching**: Caches button dimensions and positions
- **⏱️ Debounced Callbacks**: Reduces excessive `onSectionChange` calls
- **🚀 Early Returns**: Prevents unnecessary calculations
- **📏 Optimized Loops**: Uses `for...of` instead of `forEach`
- **🎭 ScrollView Props**: `removeClippedSubviews`, `keyboardShouldPersistTaps`

## 🔧 How It Works

### 1. **Sticky Button Logic**
- Button position is measured and cached on mount
- Scroll events calculate when button should become sticky
- Button smoothly transitions between content and sticky states

### 2. **Section Navigation**
- Sections register their absolute positions using `measure()`
- Scroll events calculate which section is closest to viewport top
- Tabs automatically activate when section tops touch viewport top
- 5px tolerance ensures smooth activation without flickering

### 3. **Performance Optimization**
- Scroll events are throttled to 8ms for responsiveness
- Expensive calculations are memoized with React hooks
- Layout measurements are cached to avoid recalculation
- Callbacks are debounced to prevent excessive updates

## 💡 Performance Tips

1. **Use `useCallback`** for event handlers passed as props
2. **Memoize expensive content** with `useMemo` or `React.memo`
3. **Register sections efficiently** - only register visible sections
4. **Optimize scroll event handlers** - keep them lightweight
5. **Use `removeClippedSubviews`** for long content lists

## 🐛 Troubleshooting

### Common Issues

1. **Button Not Sticking**: Check if `buttonContent` is provided and properly sized
2. **Sections Not Working**: Ensure sections are registered with `registerSection`
3. **Performance Issues**: Verify scroll event handlers are optimized
4. **External Offset Problems**: Check if `externalOffset` is correctly calculated

### Debug Steps

1. Verify all required props are provided
2. Check console for any error messages
3. Ensure refs are properly initialized
4. Verify section registration timing
5. Test with simpler content first

## 📱 Platform Support

- ✅ **iOS**: Full support with native performance
- ✅ **Android**: Full support with native performance
- ✅ **React Native**: 0.60+ recommended
- ✅ **Expo**: Compatible with managed and bare workflows

## 🤝 Contributing

Feel free to submit issues, feature requests, or pull requests to improve the component!

## 📄 License

This component is open source and available under the MIT License. 