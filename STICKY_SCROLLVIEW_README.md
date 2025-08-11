# StickyScrollView Component

A React Native component that provides a smooth, native-like sticky button experience at the bottom of the screen. When a button scrolls out of view from the bottom, it smoothly sticks to the screen bottom, and when scrolling back up, it seamlessly rejoins the content.

## ✨ Features

- **Smooth Transitions**: Native-like animations using React Native's Animated API
- **Dynamic Height Detection**: Automatically measures and caches button dimensions
- **Smart Positioning**: Calculates thresholds based on actual content layout
- **No Flickering**: Anti-flicker logic prevents bouncing and visual glitches
- **Flexible Content**: Accepts any React components as top, button, and bottom content
- **Pure Component**: Handles all sticky logic internally, parent only provides content

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

### Advanced Example with Custom Styling

```tsx
const ProductScreen = () => {
  const handleAddToCart = () => {
    // Handle add to cart
  };

  const topContent = (
    <View>
      <Text style={styles.productTitle}>Product Name</Text>
      <Text style={styles.productDescription}>Product description...</Text>
      {/* More product details */}
    </View>
  );

  const buttonContent = (
    <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
      <View style={styles.buttonContent}>
        <Text style={styles.buttonIcon}>🛒</Text>
        <Text style={styles.buttonText}>Add to Cart</Text>
        <Text style={styles.buttonPrice}>$99.99</Text>
      </View>
    </TouchableOpacity>
  );

  const bottomContent = (
    <View>
      <Text style={styles.sectionTitle}>Reviews</Text>
      {/* Review content */}
      <Text style={styles.sectionTitle}>Specifications</Text>
      {/* Spec content */}
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
```

## 🔧 Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `topContent` | `React.ReactNode` | ✅ | Content to display above the button |
| `buttonContent` | `React.ReactNode` | ✅ | The button that will become sticky |
| `bottomContent` | `React.ReactNode` | ✅ | Content to display below the button |


## 🎯 How It Works

### 1. **Content Structure**
```
┌─────────────────┐
│   topContent    │ ← Scrollable content above button
├─────────────────┤
│  buttonContent  │ ← Button that becomes sticky
├─────────────────┤
│  bottomContent  │ ← Scrollable content below button
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

### Debug Mode

The component includes internal logging for development. Check console for:
- Button height measurements
- Threshold calculations
- State changes

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