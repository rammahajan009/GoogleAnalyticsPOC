# StickyScrollView Component

A React Native component that provides a smooth, native-like sticky button experience at the bottom of the screen. When a button scrolls out of view from the bottom, it smoothly sticks to the screen bottom, and when scrolling back up, it seamlessly rejoins the content.

## ✨ Features

- **Smooth Transitions**: Native-like animations using React Native's Animated API
- **Dynamic Height Detection**: Automatically measures and caches button dimensions
- **Smart Positioning**: Calculates thresholds based on actual content layout
- **No Flickering**: Anti-flicker logic prevents bouncing and visual glitches
- **Flexible Content**: Accepts any React components as top, button, and bottom content
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
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import StickyScrollView from './components/StickyScrollView';

const MyScreen = () => {
  const handleButtonPress = () => {
    console.log('Button pressed!');
  };

  // Top content (above the button)
  const topContent = (
    <View>
      <Text>Header content</Text>
      <Text>More content...</Text>
    </View>
  );

  // Button content (will become sticky)
  const buttonContent = (
    <TouchableOpacity style={styles.button} onPress={handleButtonPress}>
      <Text style={styles.buttonText}>Action Button</Text>
    </TouchableOpacity>
  );

  // Bottom content (below the button)
  const bottomContent = (
    <View>
      <Text>Footer content</Text>
      <Text>More content...</Text>
    </View>
  );

  return (
    <StickyScrollView
      topContent={topContent}
      buttonContent={buttonContent}
      bottomContent={bottomContent}
    />
  );
};

const styles = StyleSheet.create({
  button: {
    width: 280,
    height: 80,
    backgroundColor: '#007bff',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
```

### Advanced Example with ScrollTo Functionality

```tsx
import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import StickyScrollView, { StickyScrollViewRef } from './components/StickyScrollView';

const AdvancedScreen = () => {
  const stickyScrollViewRef = useRef<StickyScrollViewRef>(null);
  const targetSectionRef = useRef<View>(null);

  const handleScrollToSection = () => {
    // Scroll to specific section with 20px offset
    stickyScrollViewRef.current?.scrollToComponent(targetSectionRef, true, 20);
  };

  const handleScrollToTop = () => {
    stickyScrollViewRef.current?.scrollToTop(true);
  };

  const handleScrollToPosition = () => {
    // Scroll to specific Y position
    stickyScrollViewRef.current?.scrollTo(500, true);
  };

  const topContent = (
    <View>
      <Text style={styles.title}>Product Details</Text>
      <TouchableOpacity style={styles.scrollButton} onPress={handleScrollToSection}>
        <Text>Jump to Reviews</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.scrollButton} onPress={handleScrollToTop}>
        <Text>Back to Top</Text>
      </TouchableOpacity>
    </View>
  );

  const buttonContent = (
    <TouchableOpacity style={styles.addToCartButton}>
      <Text style={styles.buttonText}>Add to Cart - $99.99</Text>
    </TouchableOpacity>
  );

  const bottomContent = (
    <View>
      <View ref={targetSectionRef}>
        <Text style={styles.sectionTitle}>Customer Reviews</Text>
        <Text>This is the reviews section...</Text>
      </View>
      <Text style={styles.sectionTitle}>Specifications</Text>
      <Text>Product specifications...</Text>
    </View>
  );

  return (
    <StickyScrollView
      ref={stickyScrollViewRef}
      topContent={topContent}
      buttonContent={buttonContent}
      bottomContent={bottomContent}
      stickyHeaderIndices={[0]} // Make the first item in bottomContent sticky
    />
  );
};
```

### Example with Sticky Headers

```tsx
const StickyHeaderExample = () => {
  const stickyScrollViewRef = useRef<StickyScrollViewRef>(null);

  const topContent = (
    <View>
      <Text style={styles.header}>Product Catalog</Text>
    </View>
  );

  const buttonContent = (
    <TouchableOpacity style={styles.filterButton}>
      <Text>Apply Filters</Text>
    </TouchableOpacity>
  );

  const bottomContent = (
    <View>
      <View style={styles.categoryHeader}>
        <Text style={styles.categoryTitle}>Electronics</Text>
      </View>
      <Text>Phone, Laptop, Tablet...</Text>
      
      <View style={styles.categoryHeader}>
        <Text style={styles.categoryTitle}>Clothing</Text>
      </View>
      <Text>Shirts, Pants, Shoes...</Text>
      
      <View style={styles.categoryHeader}>
        <Text style={styles.categoryTitle}>Home & Garden</Text>
      </View>
      <Text>Furniture, Decor, Tools...</Text>
    </View>
  );

  return (
    <StickyScrollView
      ref={stickyScrollViewRef}
      topContent={topContent}
      buttonContent={buttonContent}
      bottomContent={bottomContent}
      stickyHeaderIndices={[0, 2, 4]} // Make category headers sticky
    />
  );
};
```

## 🔧 Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `topContent` | `React.ReactNode` | ✅ | Content to display above the button |
| `buttonContent` | `React.ReactNode` | ✅ | The button that will become sticky |
| `bottomContent` | `React.ReactNode` | ✅ | Content to display below the button |
| `stickyHeaderIndices` | `number[]` | ❌ | Array of indices for sticky headers in bottomContent |

## 🔗 Ref Access & ScrollTo Methods

The component provides a custom ref interface with powerful scrollTo methods for programmatic scrolling control:

```tsx
import { StickyScrollViewRef } from './components/StickyScrollView';

const scrollViewRef = useRef<StickyScrollViewRef>(null);
```

### Available ScrollTo Methods

| Method | Parameters | Description |
|--------|------------|-------------|
| `scrollTo(y, animated?)` | `y: number, animated?: boolean` | Scroll to specific Y position |
| `scrollToComponent(ref, animated?, offset?)` | `ref: React.RefObject<View>, animated?: boolean, offset?: number` | Scroll to specific component reference with optional offset |
| `scrollToTop(animated?)` | `animated?: boolean` | Scroll to the top of the content |
| `scrollToBottom(animated?)` | `animated?: boolean` | Scroll to the bottom of the content |

### ScrollTo Examples

```tsx
// Scroll to specific position
stickyScrollViewRef.current?.scrollTo(300, true);

// Scroll to component with offset
stickyScrollViewRef.current?.scrollToComponent(sectionRef, true, 50);

// Scroll to top
stickyScrollViewRef.current?.scrollToTop(true);

// Scroll to bottom
stickyScrollViewRef.current?.scrollToBottom(true);
```

### Complete ScrollTo Implementation Example

```tsx
const ScrollableProductScreen = () => {
  const stickyScrollViewRef = useRef<StickyScrollViewRef>(null);
  const descriptionRef = useRef<View>(null);
  const reviewsRef = useRef<View>(null);
  const specsRef = useRef<View>(null);

  const scrollToSection = (sectionRef: React.RefObject<View>, offset: number = 0) => {
    stickyScrollViewRef.current?.scrollToComponent(sectionRef, true, offset);
  };

  return (
    <View style={styles.container}>
      {/* Navigation buttons */}
      <View style={styles.navigation}>
        <TouchableOpacity onPress={() => scrollToSection(descriptionRef)}>
          <Text>Description</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => scrollToSection(reviewsRef)}>
          <Text>Reviews</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => scrollToSection(specsRef)}>
          <Text>Specs</Text>
        </TouchableOpacity>
      </View>

      <StickyScrollView
        ref={stickyScrollViewRef}
        topContent={<ProductHeader />}
        buttonContent={<AddToCartButton />}
        bottomContent={
          <View>
            <View ref={descriptionRef}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text>Product description...</Text>
            </View>
            <View ref={reviewsRef}>
              <Text style={styles.sectionTitle}>Reviews</Text>
              <Text>Customer reviews...</Text>
            </View>
            <View ref={specsRef}>
              <Text style={styles.sectionTitle}>Specifications</Text>
              <Text>Product specs...</Text>
            </View>
          </View>
        }
        stickyHeaderIndices={[0, 2, 4]} // Make section titles sticky
      />
    </View>
  );
};
```

## 🎯 How It Works

### 1. **Content Structure**
```
┌─────────────────┐
│   topContent    │ ← Scrollable content above button
├─────────────────┤
│  buttonContent  │ ← Button that becomes sticky
├─────────────────┤
│  bottomContent  │ ← Scrollable content below button
│   [Sticky]      │ ← Sticky headers (if stickyHeaderIndices provided)
└─────────────────┘
```

### 2. **Sticky Behavior**
- **Normal State**: Button scrolls with content
- **Sticky State**: Button sticks to screen bottom when scrolling down
- **Transition**: Smooth animation between states
- **Return**: Button rejoins content when scrolling back up

### 3. **Smart Thresholds**
- **Appear Threshold**: When button goes out of view from bottom
- **Disappear Threshold**: When button comes back into view from bottom
- **Dynamic Calculation**: Based on actual content layout and button dimensions

### 4. **ScrollTo Functionality**
- **Component Reference**: Uses React refs to measure component positions
- **Offset Support**: Allows fine-tuning of scroll position
- **Smooth Animations**: Built-in animation support for better UX
- **Type Safety**: Full TypeScript support with proper interfaces

## 🎨 Styling Guidelines

### Button Design Best Practices

1. **Consistent Dimensions**: Use fixed width/height for consistent behavior
2. **Touch Target**: Minimum 44px height for accessibility
3. **Visual Feedback**: Include hover/press states
4. **Content Layout**: Center content within button for best appearance

### Example Button Styles

```tsx
const buttonStyles = StyleSheet.create({
  button: {
    width: 280,           // Fixed width for consistency
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

### Sticky Header Styling

```tsx
const stickyHeaderStyles = StyleSheet.create({
  categoryHeader: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#495057',
  },
});
```

## 🔍 Technical Details

### Internal State Management

- **`isButtonStuck`**: Boolean tracking sticky state
- **`buttonLayout`**: Current button position and dimensions
- **`cachedButtonHeight`**: Stored button height for calculations
- **`topContentHeight`**: Measured height of top content
- **`buttonAnimation`**: Animated value for smooth transitions

### Animation Properties

- **Opacity**: Fade in/out for smooth appearance
- **Height**: Dynamic height adjustment
- **Scale**: Subtle scaling for visual feedback
- **Transform**: Smooth position transitions

### Performance Optimizations

- **Scroll Throttling**: 16ms throttle for smooth scrolling
- **Layout Caching**: Stores measured dimensions to avoid recalculation
- **Efficient Animations**: Uses native driver where possible
- **Ref-based Scrolling**: Efficient component-to-component navigation

## 🐛 Troubleshooting

### Common Issues

1. **Button Height Not Correct**
   - Ensure button has explicit height in styles
   - Check that content fits within button dimensions

2. **Sticky Behavior Not Working**
   - Verify ScrollView is properly nested
   - Check that button content is properly structured

3. **Animation Glitches**
   - Ensure consistent button dimensions
   - Check for conflicting style properties

4. **ScrollTo Not Working**
   - Verify component refs are properly set
   - Check that target components are mounted
   - Ensure refs are passed to the correct components

### Debug Mode

The component includes internal logging for development. Check console for:
- Button height measurements
- Threshold calculations
- State changes
- ScrollTo method calls

## 📱 Platform Support

- ✅ **iOS**: Full support with native animations
- ✅ **Android**: Full support with elevation shadows
- ✅ **Web**: Basic support (may need polyfills)

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

This component is provided as-is for educational and commercial use.

---

**Note**: This component is designed to work with React Native's core APIs and doesn't require additional dependencies beyond the standard React Native installation. 