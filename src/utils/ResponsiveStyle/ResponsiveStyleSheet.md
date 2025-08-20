# ResponsiveStyleSheet Utility

A comprehensive utility for creating responsive, themeable, and accessible React Native styles that automatically adapt to different screen sizes, densities, and themes. Built with performance and developer experience in mind.

## ✨ Features

- **Responsive Scaling**: Automatic scaling based on device dimensions and density
- **Theme System**: Light, dark, and custom themes with semantic color names
- **Performance Optimized**: Pre-calculated values and memoized calculations
- **Platform Aware**: iOS and Android specific optimizations
- **TypeScript**: Fully typed with comprehensive interfaces
- **Accessibility**: Built-in support for accessibility features
- **Design System**: Consistent spacing, typography, and layout scales

## 🚀 Installation

```tsx
import { ResponsiveStyleSheet } from '../utils/ResponsiveStyle/ResponsiveStyleSheet';
```

## 📖 Usage

### Basic Responsive Scaling

```tsx
// Responsive spacing
const styles = StyleSheet.create({
  container: {
    padding: ResponsiveStyleSheet.responsiveSpacing(4), // 16px base, scales with device
    margin: ResponsiveStyleSheet.responsiveSpacing(6),  // 24px base, scales with device
  },
});

// Responsive dimensions
const buttonStyles = StyleSheet.create({
  button: {
    height: ResponsiveStyleSheet.height(44),           // 44px base, scales with device
    width: ResponsiveStyleSheet.width(200),            // 200px base, scales with device
    borderRadius: ResponsiveStyleSheet.borderRadius('lg'), // 8px base, scales with device
  },
});
```

### Theme Integration

```tsx
// Get current theme colors
const themeColors = ResponsiveStyleSheet.getThemeColors();

const styles = StyleSheet.create({
  card: {
    backgroundColor: themeColors.surface,
    borderColor: themeColors.placeholder,
    shadowColor: themeColors.backdrop,
  },
  text: {
    color: themeColors.text,
  },
});

// Switch themes dynamically
ResponsiveStyleSheet.setTheme('dark');  // Switch to dark theme
ResponsiveStyleSheet.setTheme('light'); // Switch to light theme
ResponsiveStyleSheet.setTheme('blue');  // Switch to custom theme
```

### Responsive Typography

```tsx
// Responsive font sizes
const textStyles = StyleSheet.create({
  heading: {
    fontSize: ResponsiveStyleSheet.typography('2xl'),     // 24px base, scales with device
    lineHeight: ResponsiveStyleSheet.lineHeight(24, 1.4), // 24px with 1.4 ratio
  },
  body: {
    fontSize: ResponsiveStyleSheet.typography('base'),    // 16px base, scales with device
    lineHeight: ResponsiveStyleSheet.lineHeight(16, 1.5), // 16px with 1.5 ratio
  },
});
```

## 🎨 Theme System

### Available Themes

The ResponsiveStyleSheet provides three built-in themes:

#### Light Theme (Default)
```tsx
{
  primary: '#3f4048',      // Main brand color
  accent: '#007aff',        // iOS-style blue
  background: '#f5f5f5',    // Light background
  surface: '#ffffff',       // Card/component surface
  text: '#3f4048',         // Primary text
  textSecondary: '#6b7280', // Secondary text
  error: '#ef4444',         // Error color
  success: '#22c55e',       // Success color
  warning: '#f59e0b',       // Warning color
  info: '#007aff',          // Info color
}
```

#### Dark Theme
```tsx
{
  primary: '#f8fafc',       // Light text for dark backgrounds
  accent: '#007aff',        // Same accent color
  background: '#1a1a1a',    // Dark background
  surface: '#2d2d2d',       // Dark surface
  text: '#f8fafc',         // Light text
  textSecondary: '#cbd5e1', // Secondary light text
  error: '#f87171',         // Dark theme error
  success: '#4ade80',       // Dark theme success
  warning: '#fbbf24',       // Dark theme warning
  info: '#007aff',          // Same info color
}
```

#### Blue Theme
```tsx
{
  primary: '#1e40af',       // Blue primary
  accent: '#007aff',        // Same accent
  background: '#f0f9ff',    // Light blue background
  surface: '#ffffff',       // White surface
  text: '#1e40af',         // Blue text
  textSecondary: '#3b82f6', // Secondary blue
  error: '#dc2626',         // Blue theme error
  success: '#16a34a',       // Blue theme success
  warning: '#d97706',       // Blue theme warning
  info: '#007aff',          // Same info color
}
```

### Theme Management

```tsx
// Get current theme
const currentTheme = ResponsiveStyleSheet.getCurrentTheme();

// Get theme colors
const colors = ResponsiveStyleSheet.getThemeColors();

// Set custom theme
ResponsiveStyleSheet.setTheme('custom');

// Create custom theme
const customTheme = {
  primary: '#FF6B6B',
  accent: '#4ECDC4',
  background: '#f8f9fa',
  surface: '#ffffff',
  text: '#2c3e50',
  textSecondary: '#7f8c8d',
  error: '#e74c3c',
  success: '#27ae60',
  warning: '#f39c12',
  info: '#3498db',
  // ... other colors
};

ResponsiveStyleSheet.setTheme('custom', customTheme);
```

## 📏 Responsive Scales

### Spacing Scale

```tsx
// Base spacing unit: 4px
ResponsiveStyleSheet.responsiveSpacing(1)   // 4px base, scales with device
ResponsiveStyleSheet.responsiveSpacing(2)   // 8px base, scales with device
ResponsiveStyleSheet.responsiveSpacing(3)   // 12px base, scales with device
ResponsiveStyleSheet.responsiveSpacing(4)   // 16px base, scales with device
ResponsiveStyleSheet.responsiveSpacing(5)   // 20px base, scales with device
ResponsiveStyleSheet.responsiveSpacing(6)   // 24px base, scales with device
ResponsiveStyleSheet.responsiveSpacing(8)   // 32px base, scales with device
ResponsiveStyleSheet.responsiveSpacing(10)  // 40px base, scales with device
ResponsiveStyleSheet.responsiveSpacing(12)  // 48px base, scales with device
ResponsiveStyleSheet.responsiveSpacing(16)  // 64px base, scales with device
ResponsiveStyleSheet.responsiveSpacing(20)  // 80px base, scales with device
ResponsiveStyleSheet.responsiveSpacing(24)  // 96px base, scales with device
ResponsiveStyleSheet.responsiveSpacing(32)  // 128px base, scales with device
ResponsiveStyleSheet.responsiveSpacing(40)  // 160px base, scales with device
ResponsiveStyleSheet.responsiveSpacing(48)  // 192px base, scales with device
ResponsiveStyleSheet.responsiveSpacing(56)  // 224px base, scales with device
ResponsiveStyleSheet.responsiveSpacing(64)  // 256px base, scales with device
```

### Typography Scale

```tsx
// Font sizes that scale with device
ResponsiveStyleSheet.typography('xs')    // 12px base, scales with device
ResponsiveStyleSheet.typography('sm')    // 14px base, scales with device
ResponsiveStyleSheet.typography('base')  // 16px base, scales with device
ResponsiveStyleSheet.typography('lg')    // 18px base, scales with device
ResponsiveStyleSheet.typography('xl')    // 20px base, scales with device
ResponsiveStyleSheet.typography('2xl')   // 24px base, scales with device
ResponsiveStyleSheet.typography('3xl')   // 30px base, scales with device
ResponsiveStyleSheet.typography('4xl')   // 36px base, scales with device
ResponsiveStyleSheet.typography('5xl')   // 48px base, scales with device
ResponsiveStyleSheet.typography('6xl')   // 60px base, scales with device
ResponsiveStyleSheet.typography('7xl')   // 72px base, scales with device
ResponsiveStyleSheet.typography('8xl')   // 96px base, scales with device
ResponsiveStyleSheet.typography('9xl')   // 128px base, scales with device
```

### Border Radius Scale

```tsx
// Border radius values
ResponsiveStyleSheet.borderRadius('none')  // 0px
ResponsiveStyleSheet.borderRadius('sm')    // 2px base, scales with device
ResponsiveStyleSheet.borderRadius('md')    // 4px base, scales with device
ResponsiveStyleSheet.borderRadius('lg')    // 8px base, scales with device
ResponsiveStyleSheet.borderRadius('xl')    // 12px base, scales with device
ResponsiveStyleSheet.borderRadius('2xl')   // 16px base, scales with device
ResponsiveStyleSheet.borderRadius('3xl')   // 24px base, scales with device
ResponsiveStyleSheet.borderRadius('4xl')   // 32px base, scales with device
```

### Height and Width Scale

```tsx
// Height values
ResponsiveStyleSheet.height(36)   // 36px base, scales with device
ResponsiveStyleSheet.height(44)   // 44px base, scales with device
ResponsiveStyleSheet.height(52)   // 52px base, scales with device
ResponsiveStyleSheet.height(64)   // 64px base, scales with device

// Width values
ResponsiveStyleSheet.width(100)   // 100px base, scales with device
ResponsiveStyleSheet.width(200)   // 200px base, scales with device
ResponsiveStyleSheet.width(300)   // 300px base, scales with device
```

### Shadow Scale

```tsx
// Predefined shadow styles
ResponsiveStyleSheet.responsiveShadow('none')   // No shadow
ResponsiveStyleSheet.responsiveShadow('sm')    // Small shadow
ResponsiveStyleSheet.responsiveShadow('base')  // Base shadow
ResponsiveStyleSheet.responsiveShadow('md')    // Medium shadow
ResponsiveStyleSheet.responsiveShadow('lg')    // Large shadow
ResponsiveStyleSheet.responsiveShadow('xl')    // Extra large shadow
ResponsiveStyleSheet.responsiveShadow('2xl')   // 2x large shadow
```

## 🔧 API Reference

### Core Methods

| Method | Description | Returns |
|--------|-------------|---------|
| `responsiveSpacing(scale)` | Get responsive spacing value | `number` |
| `typography(scale)` | Get responsive typography value | `number` |
| `borderRadius(scale)` | Get responsive border radius value | `number` |
| `height(value)` | Get responsive height value | `number` |
| `width(value)` | Get responsive width value | `number` |
| `responsiveShadow(scale)` | Get responsive shadow style | `ViewStyle` |

### Theme Methods

| Method | Description | Returns |
|--------|-------------|---------|
| `setTheme(name, colors?)` | Set theme by name or custom colors | `void` |
| `getCurrentTheme()` | Get current theme name | `string` |
| `getThemeColors()` | Get current theme colors | `ThemeColors` |
| `getColorsForTheme(name)` | Get colors for specific theme | `ThemeColors` |

### Utility Methods

| Method | Description | Returns |
|--------|-------------|---------|
| `lineHeight(size, ratio)` | Calculate line height | `number` |
| `letterSpacing(size, spacing)` | Calculate letter spacing | `number` |
| `responsiveBorderRadius(scale)` | Get responsive border radius (legacy) | `number` |

## 🎯 Best Practices

### 1. Use Semantic Spacing

```tsx
// Good: Use semantic spacing values
const styles = StyleSheet.create({
  container: {
    padding: ResponsiveStyleSheet.responsiveSpacing(4),  // 16px
    marginBottom: ResponsiveStyleSheet.responsiveSpacing(6), // 24px
  },
});

// Avoid: Hardcoded values
const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginBottom: 24,
  },
});
```

### 2. Leverage Theme Colors

```tsx
// Good: Use theme colors for consistency
const styles = StyleSheet.create({
  card: {
    backgroundColor: ResponsiveStyleSheet.getThemeColors().surface,
    borderColor: ResponsiveStyleSheet.getThemeColors().placeholder,
  },
});

// Avoid: Hardcoded colors
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderColor: '#e5e7eb',
  },
});
```

### 3. Use Responsive Typography

```tsx
// Good: Use typography scale
const styles = StyleSheet.create({
  heading: {
    fontSize: ResponsiveStyleSheet.typography('2xl'),
    lineHeight: ResponsiveStyleSheet.lineHeight(24, 1.4),
  },
});

// Avoid: Hardcoded font sizes
const styles = StyleSheet.create({
  heading: {
    fontSize: 24,
    lineHeight: 34,
  },
});
```

### 4. Optimize Performance

```tsx
// Good: Pre-calculate styles
const styles = StyleSheet.create({
  button: {
    height: ResponsiveStyleSheet.height(44),
    borderRadius: ResponsiveStyleSheet.borderRadius('lg'),
  },
});

// Avoid: Calculate on every render
const styles = StyleSheet.create({
  button: {
    height: ResponsiveStyleSheet.height(44),
    borderRadius: ResponsiveStyleSheet.borderRadius('lg'),
  },
});
```

## 🔄 Migration Guide

### From Old Color System

```tsx
// Before: Using old COLORS constant
import { ResponsiveStyleSheet } from '../utils/ResponsiveStyle/ResponsiveStyleSheet';

const styles = StyleSheet.create({
  button: {
    backgroundColor: ResponsiveStyleSheet.COLORS.primary[500],
    color: ResponsiveStyleSheet.COLORS.white,
  },
});

// After: Using new theme system
const styles = StyleSheet.create({
  button: {
    backgroundColor: ResponsiveStyleSheet.getThemeColors().primary,
    color: ResponsiveStyleSheet.getThemeColors().onPrimary,
  },
});
```

### From Hardcoded Values

```tsx
// Before: Hardcoded spacing and colors
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
});

// After: Responsive and themed
const styles = StyleSheet.create({
  container: {
    padding: ResponsiveStyleSheet.responsiveSpacing(5),
    backgroundColor: ResponsiveStyleSheet.getThemeColors().background,
    borderRadius: ResponsiveStyleSheet.borderRadius('lg'),
  },
});
```

## 📱 Platform Considerations

### iOS

- **Font Rendering**: Optimized for iOS font rendering
- **Spacing**: iOS-specific spacing adjustments
- **Shadows**: iOS-specific shadow implementations

### Android

- **Font Rendering**: Optimized for Android font rendering
- **Spacing**: Android-specific spacing adjustments
- **Elevation**: Android-specific elevation support

### Cross-Platform

- **Consistent API**: Same methods work on both platforms
- **Responsive Scaling**: Adapts to different screen densities
- **Theme Support**: Consistent theming across platforms

## 🧪 Testing

### Unit Testing

```tsx
// Test responsive scaling
describe('ResponsiveStyleSheet', () => {
  it('should scale spacing correctly', () => {
    const spacing = ResponsiveStyleSheet.responsiveSpacing(4);
    expect(spacing).toBeGreaterThan(0);
  });

  it('should return theme colors', () => {
    const colors = ResponsiveStyleSheet.getThemeColors();
    expect(colors.primary).toBeDefined();
    expect(colors.text).toBeDefined();
  });
});
```

### Integration Testing

```tsx
// Test theme switching
describe('Theme Switching', () => {
  it('should switch themes correctly', () => {
    ResponsiveStyleSheet.setTheme('dark');
    const darkColors = ResponsiveStyleSheet.getThemeColors();
    expect(darkColors.background).toBe('#1a1a1a');

    ResponsiveStyleSheet.setTheme('light');
    const lightColors = ResponsiveStyleSheet.getThemeColors();
    expect(lightColors.background).toBe('#f5f5f5');
  });
});
```

## 🔗 Dependencies

- **React Native**: Core framework
- **Dimensions API**: For screen size detection
- **PixelRatio API**: For device density detection
- **TypeScript**: For type safety

## 📄 License

This utility is part of the project's design system and follows the project's licensing terms.

## 🚀 Performance Tips

1. **Pre-calculate Styles**: Use StyleSheet.create for static styles
2. **Memoize Calculations**: Use useMemo for dynamic styles
3. **Avoid Inline Objects**: Prefer style references over inline styles
4. **Theme Caching**: Access theme colors once and cache them
5. **Responsive Optimization**: Use responsive values only when needed

## 🎨 Design System Integration

The ResponsiveStyleSheet is designed to work seamlessly with:

- **Typography Component**: Consistent text scaling
- **Button Component**: Responsive button dimensions
- **Layout Components**: Consistent spacing and sizing
- **Theme System**: Dynamic color management
- **Accessibility**: Inclusive design support

The ResponsiveStyleSheet utility provides a solid foundation for building responsive, accessible, and performant React Native applications! 🎉 