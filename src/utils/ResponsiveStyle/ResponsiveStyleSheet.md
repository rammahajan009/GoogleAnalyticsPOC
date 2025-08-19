# ResponsiveStyleSheet - React Native Responsive Design with StyleSheet

A comprehensive responsive design utility for React Native that provides responsive sizing, typography, spacing, colors, shadows, and more. Designed to work seamlessly with `StyleSheet.create()` for optimal performance.

## 🚀 Features

- **Responsive Sizing**: Width, height, font sizes that scale with screen dimensions
- **Typography System**: Predefined font scales with responsive sizing
- **Spacing System**: Consistent spacing scales for margins, padding, and gaps
- **Color System**: Comprehensive color palette with semantic naming
- **Border Radius**: Responsive border radius scales
- **Shadow System**: Predefined shadow configurations
- **Device Detection**: Phone/tablet detection and orientation
- **Platform Support**: iOS and Android specific values
- **Generic Spacing**: Single function for all spacing needs
- **Spacer Utilities**: Easy ways to add space between components
- **Performance Optimized**: Works with `StyleSheet.create()` for best performance

## 📦 Installation

```bash
npm install react-native
```

## 🎯 Quick Start

```typescript
import { StyleSheet } from 'react-native';
import { 
  ResponsiveStyleSheet, 
  w, h, f, t, s, rs, b, rsh,
  spacing, layoutSpacing,
  spacer, verticalSpacer, horizontalSpacer,
  flexGap, rowGap, columnGap
} from './utils/ResponsiveStyleSheet';

const styles = StyleSheet.create({
  container: {
    width: w(300),
    height: h(200),
    padding: rs(4),
    backgroundColor: ResponsiveStyleSheet.COLORS.primary[500],
    borderRadius: b('lg'),
    ...rsh('base'),
  },
  title: {
    fontSize: t('2xl'),
    color: ResponsiveStyleSheet.COLORS.gray[900],
    marginBottom: spacing('margin', 'bottom', 4) as number,
  },
  spacer: {
    ...verticalSpacer(20),
  },
});
```

## 📏 Core Utilities

### Responsive Sizing

```typescript
// Width and height
const width = w(300);         // Responsive width
const height = h(200);        // Responsive height

// Font sizes
const fontSize = f(16);       // Responsive font size
const typography = t('xl');   // Responsive typography

// Spacing
const spacing = s(4);         // Base spacing
const responsiveSpacing = rs(4); // Responsive spacing
```

### Clean, Intuitive Names

| Function | Meaning | Example |
|----------|---------|---------|
| `w` | **W**idth | `width: w(300)` |
| `h` | **H**eight | `height: h(200)` |
| `f` | **F**ont | `fontSize: f(16)` |
| `t` | **T**ypography | `fontSize: t('xl')` |
| `s` | **S**pacing | `margin: s(4)` |
| `rs` | **R**esponsive **S**pacing | `padding: rs(4)` |
| `b` | **B**order radius | `borderRadius: b('lg')` |
| `rb` | **R**esponsive **B**order radius | `borderRadius: rb('lg')` |
| `sh` | **Sh**adow | `...sh('base')` |
| `rsh` | **R**esponsive **Sh**adow | `...rsh('lg')` |
| `ar` | **A**spect **R**atio | `...ar(16/9, 300)` |
| `pw` | **P**ercentage **W**idth | `width: pw(50)` |
| `ph` | **P**ercentage **H**eight | `height: ph(30)` |
| `lh` | **L**ine **H**eight | `lineHeight: lh(16, 1.6)` |
| `ls` | **L**etter **S**pacing | `letterSpacing: ls(0.5)` |

### Spacer Utilities

| Function | Meaning | Example |
|----------|---------|---------|
| `spacer` | **Spacer** (width & height) | `...spacer(10, 20)` |
| `hspacer` | **H**orizontal **Spacer** | `...hspacer(10)` |
| `vspacer` | **V**ertical **Spacer** | `...vspacer(20)` |
| `rvspacer` | **R**esponsive **V**ertical **Spacer** | `...rvspacer(4)` |
| `rhspacer` | **R**esponsive **H**orizontal **Spacer** | `...rhspacer(2)` |

### Gap Utilities

| Function | Meaning | Example |
|----------|---------|---------|
| `fgap` | **F**lex **Gap** | `...fgap(4)` |
| `rgap` | **R**ow **Gap** | `...rgap(4)` |
| `cgap` | **C**olumn **Gap** | `...cgap(4)` |

### Generic Spacing Function

Instead of multiple individual functions, use one generic function:

```typescript
// Margins
marginTop: spacing('margin', 'top', 4) as number,
marginBottom: spacing('margin', 'bottom', 4) as number,
marginHorizontal: spacing('margin', 'horizontal', 4) as number,
marginVertical: spacing('margin', 'vertical', 4) as number,
...spacing('margin', 'all', 4) as object, // margin: 16

// Padding
paddingTop: spacing('padding', 'top', 4) as number,
paddingBottom: spacing('padding', 'bottom', 4) as number,
paddingHorizontal: spacing('padding', 'horizontal', 4) as number,
paddingVertical: spacing('padding', 'vertical', 4) as number,
...spacing('padding', 'all', 4) as object, // padding: 16

// Gap
gap: spacing('gap', 'all', 4) as number,

// Different sides
...spacing('padding', 'sides', 4, [4, 2, 4, 2]) as object, // top: 16, right: 8, bottom: 16, left: 8
```

### Spacer Utilities for Component Spacing

```typescript
// Empty View approach
const styles = StyleSheet.create({
  spacer: {
    ...vspacer(20),           // Height: 20
    ...hspacer(10),           // Width: 10
    ...spacer(10, 20),        // Width: 10, Height: 20
  },
  responsiveSpacer: {
    ...rvspacer(4),           // Responsive height using spacing scale
    ...rhspacer(2),           // Responsive width using spacing scale
  },
});

// Usage in JSX
<View style={styles.container}>
  <Text>Component 1</Text>
  <View style={styles.spacer} /> {/* Empty view as spacer */}
  <Text>Component 2</Text>
</View>
```

### Flex Gap Approach

```typescript
const styles = StyleSheet.create({
  flexContainer: {
    flexDirection: 'row',
    ...fgap(4),      // gap: 16
    ...rgap(4),      // rowGap: 16
    ...cgap(4),      // columnGap: 16
  },
});

// Usage in JSX
<View style={styles.flexContainer}>
  <Text>Component 1</Text>
  <Text>Component 2</Text> {/* Automatically spaced */}
  <Text>Component 3</Text> {/* Automatically spaced */}
</View>
```

### Layout Spacing

```typescript
const styles = StyleSheet.create({
  listItem: {
    marginBottom: layoutSpacing('list', 3),
  },
  card: {
    marginBottom: layoutSpacing('card', 4),
  },
  button: {
    marginBottom: layoutSpacing('button', 2),
  },
  form: {
    marginBottom: layoutSpacing('form', 3),
  },
  navigation: {
    marginBottom: layoutSpacing('navigation', 2),
  },
  grid: {
    marginBottom: layoutSpacing('grid', 4),
  },
  stack: {
    marginBottom: layoutSpacing('stack', 3),
  },
  section: {
    marginBottom: layoutSpacing('section', 6),
  },
});
```

## 🎨 Design System

### Typography Scale

```typescript
ResponsiveStyleSheet.FONT_SCALE = {
  xs: 12,      // Extra small
  sm: 14,      // Small
  base: 16,    // Base
  lg: 18,      // Large
  xl: 20,      // Extra large
  '2xl': 24,   // 2X large
  '3xl': 30,   // 3X large
  '4xl': 36,   // 4X large
  '5xl': 48,   // 5X large
  '6xl': 60,   // 6X large
  '7xl': 72,   // 7X large
  '8xl': 96,   // 8X large
  '9xl': 128,  // 9X large
};
```

### Spacing Scale

```typescript
ResponsiveStyleSheet.SPACING_SCALE = {
  0: 0,        // 0px
  1: 4,        // 4px
  2: 8,        // 8px
  3: 12,       // 12px
  4: 16,       // 16px
  5: 20,       // 20px
  6: 24,       // 24px
  7: 28,       // 28px
  8: 32,       // 32px
  9: 36,       // 36px
  10: 40,      // 40px
  11: 44,      // 44px
  12: 48,      // 48px
  14: 56,      // 56px
  16: 64,      // 64px
  20: 80,      // 80px
  24: 96,      // 96px
  28: 112,     // 112px
  32: 128,     // 128px
  36: 144,     // 144px
  40: 160,     // 160px
  44: 176,     // 176px
  48: 192,     // 192px
  52: 208,     // 208px
  56: 224,     // 224px
  60: 240,     // 240px
  64: 256,     // 256px
  72: 288,     // 288px
  80: 320,     // 320px
  96: 384,     // 384px
};
```

### Border Radius Scale

```typescript
ResponsiveStyleSheet.BORDER_RADIUS_SCALE = {
  none: 0,     // 0px
  sm: 2,       // 2px
  base: 4,     // 4px
  md: 6,       // 6px
  lg: 8,       // 8px
  xl: 12,      // 12px
  '2xl': 16,   // 16px
  '3xl': 24,   // 24px
  full: 9999,  // Full radius
};
```

### Color System

```typescript
ResponsiveStyleSheet.COLORS = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    900: '#1e3a8a',
  },
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    500: '#6b7280',
    900: '#111827',
  },
  success: {
    100: '#dcfce7',
    500: '#22c55e',
  },
  warning: {
    100: '#fef3c7',
    500: '#f59e0b',
  },
  error: {
    100: '#fee2e2',
    500: '#ef4444',
  },
};
```

### Shadow Scale

```typescript
ResponsiveStyleSheet.SHADOW_SCALE = {
  sm: {
    shadowOpacity: 0.05,
    elevation: 1,
  },
  base: {
    shadowOpacity: 0.1,
    elevation: 2,
  },
  md: {
    shadowOpacity: 0.15,
    elevation: 4,
  },
  lg: {
    shadowOpacity: 0.2,
    elevation: 8,
  },
  xl: {
    shadowOpacity: 0.25,
    elevation: 16,
  },
};
```

## 🔧 Advanced Features

### Device Detection

```typescript
import { isTablet, isPhone, isLandscape, isPortrait } from './utils/ResponsiveStyleSheet';

const styles = StyleSheet.create({
  container: {
    padding: isTablet() ? rs(6) : rs(4),
    flexDirection: isLandscape() ? 'row' : 'column',
  },
});
```

### Platform-Specific Values

```typescript
import { platform } from './utils/ResponsiveStyleSheet';

const styles = StyleSheet.create({
  button: {
    borderRadius: platform(8, 4), // iOS: 8, Android: 4
    padding: platform(rs(4), rs(3)),
  },
});
```

### Aspect Ratio

```typescript
import { ar } from './utils/ResponsiveStyleSheet';

const styles = StyleSheet.create({
  image: {
    ...ar(16/9, 300), // 16:9 aspect ratio, 300px width
  },
});
```

### Percentage Sizing

```typescript
import { pw, ph } from './utils/ResponsiveStyleSheet';

const styles = StyleSheet.create({
  container: {
    width: pw(50),   // 50% of screen width
    height: ph(30),  // 30% of screen height
  },
});
```

### Advanced Typography

```typescript
import { lh, ls } from './utils/ResponsiveStyleSheet';

const styles = StyleSheet.create({
  text: {
    fontSize: t('lg'),
    lineHeight: lh(18, 1.6),     // Line height with multiplier
    letterSpacing: ls(0.5),       // Letter spacing
  },
});
```

## 📱 Component Spacing Approaches

### 1. Empty View Spacer (Most Common)

```typescript
const styles = StyleSheet.create({
  spacer: {
    ...verticalSpacer(20),
  },
});

// JSX
<View>
  <Text>Component 1</Text>
  <View style={styles.spacer} />
  <Text>Component 2</Text>
</View>
```

### 2. Flex Gap (Modern Approach)

```typescript
const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    ...flexGap(4),
  },
});

// JSX
<View style={styles.container}>
  <Text>Component 1</Text>
  <Text>Component 2</Text> {/* Automatically spaced */}
</View>
```

### 3. Margin/Padding Approach

```typescript
const styles = StyleSheet.create({
  component: {
    marginBottom: spacing('margin', 'bottom', 4) as number,
  },
});

// JSX
<View>
  <Text style={styles.component}>Component 1</Text>
  <Text>Component 2</Text>
</View>
```

### 4. Responsive Spacer

```typescript
const styles = StyleSheet.create({
  spacer: {
    ...responsiveVerticalSpacer(4), // Uses spacing scale
  },
});
```

## 🎯 Best Practices

### 1. Use StyleSheet.create()

Always use `StyleSheet.create()` for better performance:

```typescript
// ✅ Good
const styles = StyleSheet.create({
  container: {
    padding: rs(4),
  },
});

// ❌ Avoid
const styles = {
  container: {
    padding: rs(4), // Recreated on every render
  },
};
```

### 2. Use Generic Spacing Function

```typescript
// ✅ Good - Single function
marginBottom: spacing('margin', 'bottom', 4) as number,

// ❌ Avoid - Multiple functions
marginBottom: rmb(4),
```

### 3. Use Spacer Components for Simple Spacing

```typescript
// ✅ Good - Clear intent
<View style={styles.spacer} />

// ❌ Avoid - Less clear
<View style={{ height: 20 }} />
```

### 4. Use Flex Gap for Complex Layouts

```typescript
// ✅ Good - Modern approach
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    ...flexGap(4),
  },
});

// ❌ Avoid - Manual spacing
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  item: {
    marginRight: rs(4),
  },
});
```

## 🔄 Screen Updates

Update dimensions when screen changes:

```typescript
import { ResponsiveStyleSheet } from './utils/ResponsiveStyleSheet';

// In your component
useEffect(() => {
  const subscription = Dimensions.addEventListener('change', () => {
    ResponsiveStyleSheet.updateDimensions();
  });

  return () => subscription?.remove();
}, []);
```

## 📊 Performance Benefits

- **StyleSheet.create()**: Static styles for better performance
- **Generic Functions**: Less code, better maintainability
- **Responsive Calculations**: Cached and optimized
- **Type Safety**: Full TypeScript support

## 🎨 Complete Example

```typescript
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { 
  ResponsiveStyleSheet, 
  w, h, t, rs, b, rsh,
  spacing, vspacer, fgap
} from './utils/ResponsiveStyleSheet';

export const ExampleComponent: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Responsive Design</Text>
        <Text style={styles.subtitle}>Scalable and performant</Text>
      </View>
      
      <View style={styles.spacer} />
      
      <View style={styles.content}>
        <Text style={styles.body}>This component scales beautifully across all devices!</Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <Text style={styles.button}>Primary Action</Text>
        <Text style={styles.button}>Secondary Action</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ResponsiveStyleSheet.COLORS.gray[50],
    padding: rs(4),
  },
  header: {
    backgroundColor: ResponsiveStyleSheet.COLORS.white,
    borderRadius: b('lg'),
    padding: rs(6),
    ...rsh('base'),
  },
  title: {
    fontSize: t('3xl'),
    fontWeight: 'bold',
    color: ResponsiveStyleSheet.COLORS.gray[900],
    marginBottom: spacing('margin', 'bottom', 2) as number,
  },
  subtitle: {
    fontSize: t('lg'),
    color: ResponsiveStyleSheet.COLORS.gray[600],
  },
  spacer: {
    ...vspacer(20),
  },
  content: {
    backgroundColor: ResponsiveStyleSheet.COLORS.primary[50],
    borderRadius: b('base'),
    padding: rs(4),
    marginBottom: spacing('margin', 'bottom', 4) as number,
  },
  body: {
    fontSize: t('base'),
    color: ResponsiveStyleSheet.COLORS.gray[700],
    lineHeight: lh(16, 1.6),
  },
  buttonContainer: {
    flexDirection: 'row',
    ...fgap(4),
  },
  button: {
    backgroundColor: ResponsiveStyleSheet.COLORS.primary[500],
    color: ResponsiveStyleSheet.COLORS.white,
    padding: rs(4),
    borderRadius: b('base'),
    fontSize: t('base'),
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
  },
});
```

This comprehensive system provides everything you need for responsive React Native design with excellent performance and maintainability! 