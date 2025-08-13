# StickyScrollView Component

A React Native component that provides a smooth, native-like sticky button experience with sticky tabs navigation. The component features a header, sticky tabs, content sections, and a button that becomes sticky when scrolling out of view.

## ✨ Features

- **Sticky Tabs Navigation**: Horizontal tabs that stick to the top while scrolling
- **Smooth Button Transitions**: Button smoothly becomes sticky when scrolling out of view
- **Section Navigation**: Built-in scroll-to-section functionality with tab synchronization
- **Dynamic Height Detection**: Automatically measures and caches button and tabs dimensions
- **Smart Positioning**: Calculates thresholds based on actual content layout and sticky tabs
- **No Flickering**: Anti-flicker logic prevents bouncing and visual glitches
- **Flexible Content**: Accepts header, tabs, top content, button, and footer as separate props
- **Pure Component**: Handles all sticky logic internally, parent only provides content
- **Advanced Scrolling**: Built-in scrollTo methods for programmatic scrolling control
- **Sticky Headers**: Support for sticky header indices via `stickyHeaderIndices` prop

## 🚀 Installation

1. Copy the `StickyScrollView.tsx` component to your project
2. Ensure you have React Native's core dependencies
3. Import and use the component

## 📱 Usage

### Basic Implementation

```tsx
import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import StickyScrollView from './components/StickyScrollView';

const MyScreen = () => {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'features' | 'details'>('overview');
  const stickyScrollViewRef = useRef(null);

  const handleButtonPress = () => {
    console.log('Button pressed!');
  };

  // Header content
  const header = (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>📚 Content Sections</Text>
      <Text style={styles.headerSubtitle}>
        Navigate through different sections using the tabs below.
      </Text>
    </View>
  );

  // Tabs navigation
  const tabs = (
    <View style={styles.tabContainer}>
      <TouchableOpacity 
        style={[styles.tab, selectedTab === 'overview' && styles.activeTab]}
        onPress={() => {
          setSelectedTab('overview');
          stickyScrollViewRef.current?.scrollToSection('overview', true);
        }}
      >
        <Text style={styles.tabText}>Overview</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.tab, selectedTab === 'features' && styles.activeTab]}
        onPress={() => {
          setSelectedTab('features');
          stickyScrollViewRef.current?.scrollToSection('features', true);
        }}
      >
        <Text style={styles.tabText}>Features</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.tab, selectedTab === 'details' && styles.activeTab]}
        onPress={() => {
          setSelectedTab('details');
          stickyScrollViewRef.current?.scrollToSection('details', true);
        }}
      >
        <Text style={styles.tabText}>Details</Text>
      </TouchableOpacity>
    </View>
  );

  // Top content (main sections)
  const top = (
    <>
      <View 
        ref={overviewRef}
        style={styles.contentSection}
        onLayout={(event) => {
          const { y } = event.nativeEvent.layout;
          stickyScrollViewRef.current?.registerSection('overview', y);
        }}
      >
        <Text style={styles.sectionTitle}>Overview</Text>
        <Text style={styles.contentText}>Overview content...</Text>
      </View>
      
      <View 
        ref={featuresRef}
        style={styles.contentSection}
        onLayout={(event) => {
          const { y } = event.nativeEvent.layout;
          stickyScrollViewRef.current?.registerSection('features', y);
        }}
      >
        <Text style={styles.sectionTitle}>Features</Text>
        <Text style={styles.contentText}>Features content...</Text>
      </View>
      
      <View 
        ref={detailsRef}
        style={styles.contentSection}
        onLayout={(event) => {
          const { y } = event.nativeEvent.layout;
          stickyScrollViewRef.current?.registerSection('details', y);
        }}
      >
        <Text style={styles.sectionTitle}>Details</Text>
        <Text style={styles.contentText}>Details content...</Text>
      </View>
    </>
  );

  // Button content (will become sticky)
  const buttonContent = (
    <TouchableOpacity style={styles.button} onPress={handleButtonPress}>
      <Text style={styles.buttonText}>🎯 Sticky Button</Text>
      <Text style={styles.buttonSubtext}>Tap me!</Text>
    </TouchableOpacity>
  );

  // Footer content
  const footer = (
    <View style={styles.footer}>
      <Text style={styles.footerText}>Additional content...</Text>
    </View>
  );

  return (
    <StickyScrollView
      ref={stickyScrollViewRef}
      header={header}
      tabs={tabs}
      top={top}
      buttonContent={buttonContent}
      footer={footer}
      stickyHeaderIndices={[1]} // Make tabs sticky (index 1)
      onSectionChange={(sectionName) => {
        if (sectionName === 'overview' || sectionName === 'features' || sectionName === 'details') {
          setSelectedTab(sectionName);
        }
      }}
    />
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    alignSelf: 'stretch',
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  tab: {
    flex: 1,
    minWidth: 80,
    marginHorizontal: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  activeTab: {
    backgroundColor: '#007bff',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#495057',
  },
  contentSection: {
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  button: {
    width: '100%',
    height: 80,
    backgroundColor: '#007bff',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonSubtext: {
    color: '#ffffff',
    fontSize: 14,
    opacity: 0.8,
  },
  footer: {
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  footerText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
```

### Advanced Example with Section Navigation

```tsx
import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import StickyScrollView from './components/StickyScrollView';

const AdvancedScreen = () => {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'features' | 'details'>('overview');
  const stickyScrollViewRef = useRef(null);
  
  // Refs for content sections
  const overviewRef = useRef<View>(null);
  const featuresRef = useRef<View>(null);
  const detailsRef = useRef<View>(null);

  const header = (
    <View style={styles.contentHeader}>
      <Text style={styles.contentHeaderTitle}>📚 Content Sections</Text>
      <Text style={styles.contentHeaderSubtitle}>
        Navigate through different sections using the tabs below. Each section contains detailed information about the StickyScrollView component.
      </Text>
    </View>
  );

  const tabs = (
    <View style={styles.tabContainer}>
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

  const top = (
    <>
      <View 
        ref={overviewRef}
        style={styles.contentSection}
        onLayout={(event) => {
          const { y } = event.nativeEvent.layout;
          stickyScrollViewRef.current?.registerSection('overview', y);
        }}
      >
        <Text style={styles.sectionTitle}>Overview</Text>
        <Text style={styles.contentText}>
          This demonstrates the StickyScrollView component with sticky button functionality.
          Scroll down to see the button become sticky at the bottom of the screen.
        </Text>
        
        <Text style={styles.sectionTitle}>How it works</Text>
        <Text style={styles.contentText}>
          • The button starts as part of the content{'\n'}
          • When scrolling down, it smoothly becomes sticky{'\n'}
          • When scrolling up, it rejoins the content flow{'\n'}
          • Smooth animations with native performance
        </Text>
      </View>
      
      <View 
        ref={featuresRef}
        style={styles.contentSection}
        onLayout={(event) => {
          const { y } = event.nativeEvent.layout;
          stickyScrollViewRef.current?.registerSection('features', y);
        }}
      >
        <Text style={styles.sectionTitle}>Features</Text>
        <Text style={styles.contentText}>
          • Smooth sticky behavior with native performance{'\n'}
          • Customizable content sections{'\n'}
          • Responsive design for all screen sizes{'\n'}
          • Easy integration with existing components
        </Text>
        
        <Text style={styles.sectionTitle}>Benefits</Text>
        <Text style={styles.contentText}>
          • Improved user experience with always-accessible buttons{'\n'}
          • Clean, modern UI design{'\n'}
          • Optimized scrolling performance{'\n'}
          • Cross-platform compatibility
        </Text>
      </View>
      
      <View 
        ref={detailsRef}
        style={styles.contentSection}
        onLayout={(event) => {
          const { y } = event.nativeEvent.layout;
          stickyScrollViewRef.current?.registerSection('details', y);
        }}
      >
        <Text style={styles.sectionTitle}>Technical Details</Text>
        <Text style={styles.contentText}>
          • Built with React Native core components{'\n'}
          • Uses ScrollView with custom scroll handling{'\n'}
          • Implements sticky positioning with absolute positioning{'\n'}
          • Optimized with useRef and useEffect hooks
        </Text>
        
        <Text style={styles.sectionTitle}>Implementation</Text>
        <Text style={styles.contentText}>
          • Custom scroll event handling{'\n'}
          • Dynamic button state management{'\n'}
          • Smooth opacity transitions{'\n'}
          • Responsive layout calculations
        </Text>
      </View>
    </>
  );

  const buttonContent = (
    <View style={[styles.stickyButton, { alignSelf: 'stretch' }]}>
      <Text style={styles.buttonText}>🎯 Sticky Button</Text>
      <Text style={styles.buttonSubtext}>Tap me!</Text>
    </View>
  );

  const footer = (
    <View style={styles.stickyBottomContent}>
      <View style={styles.contentBlock}>
        <Text style={styles.sectionTitle}>Section 1</Text>
        <Text style={styles.contentText}>
          More content here to demonstrate scrolling. Keep scrolling down to see the sticky button behavior.
        </Text>
      </View>
      
      <View style={styles.contentBlock}>
        <Text style={styles.sectionTitle}>Section 2</Text>
        <Text style={styles.contentText}>
          The button will become sticky when it goes out of view from the bottom. This provides a great user experience for important actions.
        </Text>
      </View>
    </View>
  );

  return (
    <StickyScrollView
      ref={stickyScrollViewRef}
      header={header}
      tabs={tabs}
      top={top}
      buttonContent={buttonContent}
      footer={footer}
      stickyHeaderIndices={[1]} // Make tabs sticky (index 1)
      onSectionChange={(sectionName) => {
        if (sectionName === 'overview' || sectionName === 'features' || sectionName === 'details') {
          setSelectedTab(sectionName);
        }
      }}
    />
  );
};
```

## 🔧 Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `header` | `React.ReactNode` | ✅ | Header content displayed at the top |
| `tabs` | `React.ReactNode` | ✅ | Tab navigation that can be made sticky |
| `top` | `React.ReactNode` | ✅ | Main content sections with navigation refs |
| `buttonContent` | `React.ReactNode` | ✅ | The button that will become sticky |
| `footer` | `React.ReactNode` | ✅ | Additional content displayed at the bottom |
| `stickyHeaderIndices` | `number[]` | ❌ | Array of indices for sticky headers (use `[1]` for sticky tabs) |
| `onSectionChange` | `(sectionName: string) => void` | ❌ | Callback when scroll position changes sections |

## 🔗 Ref Access & ScrollTo Methods

The component provides a custom ref interface with powerful scrollTo methods for programmatic scrolling control:

```tsx
const stickyScrollViewRef = useRef<StickyScrollViewRef>(null);
```

### Available ScrollTo Methods

| Method | Parameters | Description |
|--------|------------|-------------|
| `scrollTo(y, animated?)` | `y: number, animated?: boolean` | Scroll to specific Y position |
| `scrollToComponent(ref, animated?, offset?)` | `ref: React.RefObject<View>, animated?: boolean, offset?: number` | Scroll to specific component reference with optional offset |
| `scrollToTop(animated?)` | `animated?: boolean` | Scroll to the top of the content |
| `scrollToBottom(animated?)` | `animated?: boolean` | Scroll to the bottom of the content |
| `scrollToSection(sectionName, animated?)` | `sectionName: string, animated?: boolean` | Scroll to specific section by name |
| `registerSection(sectionName, yPosition)` | `sectionName: string, yPosition: number` | Register section position for navigation |

### Section Registration Example

```tsx
// In your content sections, register their positions
<View 
  ref={overviewRef}
  style={styles.contentSection}
  onLayout={(event) => {
    const { y } = event.nativeEvent.layout;
    stickyScrollViewRef.current?.registerSection('overview', y);
  }}
>
  <Text style={styles.sectionTitle}>Overview</Text>
  <Text style={styles.contentText}>Content...</Text>
</View>
```

### ScrollTo Examples

```tsx
// Scroll to specific section
stickyScrollViewRef.current?.scrollToSection('overview', true);

// Scroll to specific position
stickyScrollViewRef.current?.scrollTo(300, true);

// Scroll to component with offset
stickyScrollViewRef.current?.scrollToComponent(sectionRef, true, 50);

// Scroll to top
stickyScrollViewRef.current?.scrollToTop(true);

// Scroll to bottom
stickyScrollViewRef.current?.scrollToBottom(true);
```

## 🎯 How It Works

### 1. **Content Structure**
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

### 2. **Sticky Behavior**
- **Tabs**: Stick to the top when scrolling (using `stickyHeaderIndices={[1]}`)
- **Button**: Becomes sticky at bottom when scrolling out of view
- **Smooth Transitions**: Opacity and display changes for seamless UX
- **Smart Thresholds**: Accounts for sticky tabs height in calculations

### 3. **Section Navigation**
- **Tab Clicks**: Scroll to corresponding sections
- **Manual Scrolling**: Automatically highlight active tab
- **Section Registration**: Components register their Y positions
- **Synchronized State**: Tab selection stays in sync with scroll position

### 4. **ScrollTo Functionality**
- **Section-based**: Navigate by section name
- **Component-based**: Navigate by component reference
- **Position-based**: Navigate by Y coordinate
- **Offset Support**: Fine-tune scroll positions

## 🎨 Styling Guidelines

### Tab Design Best Practices

1. **Horizontal Layout**: Use `flexDirection: 'row'` for horizontal tabs
2. **Equal Distribution**: Use `flex: 1` for equal tab widths
3. **Touch Targets**: Minimum 44px height for accessibility
4. **Visual Feedback**: Include active states and hover effects
5. **Consistent Spacing**: Use consistent margins and padding

### Example Tab Styles

```tsx
const tabStyles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    alignSelf: 'stretch',
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  tab: {
    flex: 1,
    minWidth: 80,
    marginHorizontal: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  activeTab: {
    backgroundColor: '#007bff',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#495057',
  },
  activeTabText: {
    color: '#ffffff',
  },
});
```

### Button Design Best Practices

1. **Consistent Dimensions**: Use fixed width/height for consistent behavior
2. **Touch Target**: Minimum 44px height for accessibility
3. **Visual Feedback**: Include hover/press states
4. **Content Layout**: Center content within button for best appearance

### Example Button Styles

```tsx
const buttonStyles = StyleSheet.create({
  button: {
    width: '100%',        // Full width for consistency
    height: 80,           // Fixed height for consistency
    backgroundColor: '#007bff',
    borderRadius: 25,     // Rounded corners for modern look
    shadowColor: '#000',  // Shadow for depth
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,         // Android shadow
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

## 🔍 Technical Details

### Internal State Management

- **`isButtonStuck`**: Boolean tracking sticky state
- **`buttonLayout`**: Current button position and dimensions
- **`cachedButtonHeight`**: Stored button height for calculations
- **`tabsHeight`**: Measured height of sticky tabs
- **`sectionPositions`**: Registered section Y positions
- **`isProgrammaticScroll`**: Flag to prevent section change during programmatic scrolls

### Sticky Logic

- **Appear Threshold**: When button goes out of view from bottom
- **Disappear Threshold**: When button comes back into view from bottom
- **Tabs Height Adjustment**: Accounts for sticky tabs in threshold calculations
- **Direction-based Logic**: Only changes state when scrolling in correct direction

### Performance Features

- **Scroll Event Throttling**: 16ms throttle for smooth 60fps scrolling
- **Layout Caching**: Stores measured dimensions to avoid recalculation
- **Efficient Section Detection**: Optimized algorithms for finding current section
- **Debounced Section Changes**: Prevents excessive callback calls

## 🐛 Troubleshooting

### Common Issues

1. **Tabs Not Horizontal**
   - Ensure `flexDirection: 'row'` is set on tab container
   - Use `flex: 1` on individual tabs for equal distribution
   - Check that `width: '100%'` and `alignSelf: 'stretch'` are set

2. **Sticky Tabs Not Working**
   - Verify `stickyHeaderIndices={[1]}` is set
   - Ensure tabs are the second child (index 1) of the ScrollView
   - Check that header is index 0 and tabs are index 1

3. **Button Height Not Correct**
   - Ensure button has explicit height in styles
   - Check that content fits within button dimensions

4. **Section Navigation Not Working**
   - Verify sections are registered with `registerSection`
   - Check that `onSectionChange` callback is provided
   - Ensure section names match between registration and navigation

5. **ScrollTo Not Working**
   - Verify component refs are properly set
   - Check that target sections are registered
   - Ensure refs are passed to the correct components

### Debug Mode

The component includes internal logging for development. Check console for:
- Button height measurements
- Tabs height measurements
- Threshold calculations
- State changes
- Section registrations
- ScrollTo method calls

## 📱 Platform Support

- ✅ **iOS**: Full support with native animations and sticky headers
- ✅ **Android**: Full support with elevation shadows and sticky headers
- ✅ **Web**: Basic support (may need polyfills for sticky behavior)

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

This component is provided as-is for educational and commercial use.

---

**Note**: This component is designed to work with React Native's core APIs and doesn't require additional dependencies beyond the standard React Native installation. The sticky tabs functionality uses React Native's built-in `stickyHeaderIndices` prop for optimal performance. 