# Typography Component

A highly performant, responsive, and accessible typography component for React Native that integrates seamlessly with the ResponsiveStyleSheet utility. Built with modern React patterns and optimized for performance.

## ✨ Features

- **Intuitive API**: Use boolean props for variants, alignment, and weight (e.g., `<Typography h1 bold center>`)
- **Responsive Design**: Integrates with ResponsiveStyleSheet for consistent scaling across devices
- **High Performance**: Memoized styles and callbacks for optimal rendering
- **Platform Optimized**: Platform-specific font family selection
- **Flexible Styling**: Customizable colors, sizes, and spacing
- **TypeScript**: Fully typed with comprehensive interfaces
- **Accessibility**: Built-in accessibility support

## 🚀 Installation

```tsx
import Typography from '../components/Typography/Typography';
```

## 📖 Usage

### Basic Usage

```tsx
// Simple text
<Typography>Hello World</Typography>

// Headings
<Typography h1>Main Heading</Typography>
<Typography h2>Section Heading</Typography>
<Typography h3>Subsection Heading</Typography>
<Typography h4>Card Title</Typography>
<Typography h5>Small Title</Typography>
<Typography h6>Micro Title</Typography>

// Body text
<Typography body1>Primary body text</Typography>
<Typography body2>Secondary body text</Typography>

// Special text
<Typography caption>Caption text</Typography>
<Typography overline>OVERLINE TEXT</Typography>
<Typography button>BUTTON TEXT</Typography>
```

### Alignment

```tsx
<Typography h1 center>Centered Heading</Typography>
<Typography body1 right>Right-aligned text</Typography>
<Typography body2 justify>Justified text for longer content</Typography>
<Typography h3 left>Left-aligned (default)</Typography>
```

### Font Weights

```tsx
<Typography h1 thin>Thin weight</Typography>
<Typography h2 light>Light weight</Typography>
<Typography h3 normal>Normal weight</Typography>
<Typography h4 medium>Medium weight</Typography>
<Typography h5 semibold>Semi-bold weight</Typography>
<Typography h6 bold>Bold weight</Typography>
<Typography body1 extrabold>Extra-bold weight</Typography>
<Typography body2 black>Black weight</Typography>
```

### Custom Styling

```tsx
<Typography 
  h1 
  bold 
  center 
  color="#FF6B6B"
  size={40}
  lineHeight={48}
  letterSpacing={1}
  style={{ marginTop: 20 }}
>
  Custom Styled Heading
</Typography>
```

### Responsive Typography

```tsx
// The component automatically scales with ResponsiveStyleSheet
<Typography h1>This scales responsively</Typography>
<Typography body1>So does this</Typography>
```

## 🔧 Props

### Variant Props (Boolean)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `h1` | `boolean` | `false` | Heading 1 (32px) |
| `h2` | `boolean` | `false` | Heading 2 (28px) |
| `h3` | `boolean` | `false` | Heading 3 (24px) |
| `h4` | `boolean` | `false` | Heading 4 (20px) |
| `h5` | `boolean` | `false` | Heading 5 (18px) |
| `h6` | `boolean` | `false` | Heading 6 (16px) |
| `body1` | `boolean` | `false` | Body text 1 (16px) |
| `body2` | `boolean` | `false` | Body text 2 (14px) |
| `caption` | `boolean` | `false` | Caption text (12px) |
| `overline` | `boolean` | `false` | Overline text (10px) |
| `button` | `boolean` | `false` | Button text (14px) |

### Alignment Props (Boolean)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `left` | `boolean` | `true` | Left alignment |
| `center` | `boolean` | `false` | Center alignment |
| `right` | `boolean` | `false` | Right alignment |
| `justify` | `boolean` | `false` | Justified alignment |

### Weight Props (Boolean)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `normal` | `boolean` | `true` | Normal weight (400) |
| `thin` | `boolean` | `false` | Thin weight (100) |
| `light` | `boolean` | `false` | Light weight (300) |
| `medium` | `boolean` | `false` | Medium weight (500) |
| `semibold` | `boolean` | `false` | Semi-bold weight (600) |
| `bold` | `boolean` | `false` | Bold weight (700) |
| `extrabold` | `boolean` | `false` | Extra-bold weight (800) |
| `black` | `boolean` | `false` | Black weight (900) |

### Style Override Props

| Prop | Type | Description |
|------|------|-------------|
| `color` | `string` | Text color (default: #3f4048) |
| `size` | `number` | Custom font size |
| `lineHeight` | `number` | Custom line height |
| `letterSpacing` | `number` | Custom letter spacing |
| `style` | `TextStyle` | Additional text styles |

### Content Props

| Prop | Type | Description |
|------|------|-------------|
| `children` | `React.ReactNode` | Text content |

## 🎨 Design System Integration

### ResponsiveStyleSheet Integration

- **Responsive Scaling**: Automatically scales with device dimensions
- **Consistent Spacing**: Integrates with ResponsiveStyleSheet spacing system
- **Theme Colors**: Can use theme colors from ResponsiveStyleSheet
- **Platform Optimization**: Adapts to iOS and Android design patterns

### Font System

- **Primary Font**: Roboto (both iOS and Android)
- **Font Weights**: Full range from 100 (thin) to 900 (black)
- **Line Heights**: Optimized for readability
- **Letter Spacing**: Consistent spacing across variants

### Default Styles

```tsx
// Pre-calculated base styles for optimal performance
const baseStyles = StyleSheet.create({
  h1: { fontSize: 32, lineHeight: 40, fontWeight: '700' },
  h2: { fontSize: 28, lineHeight: 36, fontWeight: '600' },
  h3: { fontSize: 24, lineHeight: 32, fontWeight: '600' },
  h4: { fontSize: 20, lineHeight: 28, fontWeight: '500' },
  h5: { fontSize: 18, lineHeight: 24, fontWeight: '500' },
  h6: { fontSize: 16, lineHeight: 22, fontWeight: '400' },
  body1: { fontSize: 16, lineHeight: 24, fontWeight: '400' },
  body2: { fontSize: 14, lineHeight: 20, fontWeight: '400' },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '300' },
  overline: { fontSize: 10, lineHeight: 14, fontWeight: '300', textTransform: 'uppercase' },
  button: { fontSize: 14, lineHeight: 20, fontWeight: '500', textTransform: 'uppercase' },
});
```

## ⚡ Performance Features

### Memoization Strategy

- **Style Memoization**: Button styles are calculated once and cached
- **Callback Memoization**: Event handlers are memoized with useCallback
- **Pre-calculated Styles**: Base styles are defined at module level
- **Conditional Rendering**: Only necessary styles are applied

### Optimization Techniques

```tsx
// Styles are memoized based on props
const buttonStyle = useMemo(() => {
  // Style calculation logic
}, [variant, size, backgroundColor, borderColor, fullWidth, style, accessibilityState]);

// Callbacks are memoized
const handlePress = useCallback((event: any) => {
  if (!disabled && !loading && onPress) {
    onPress(event);
  }
}, [disabled, loading, onPress]);
```

## 🔄 Migration from Old API

### Before (Old variant prop)

```tsx
<Typography variant="h1" align="center" weight="bold">
  Old Style
</Typography>
```

### After (New boolean props)

```tsx
<Typography h1 center bold>
  New Style
</Typography>
```

## 📱 Platform Considerations

### iOS

- **Font Family**: Roboto
- **Font Weights**: iOS-optimized weight mapping
- **Line Heights**: iOS-specific line height calculations

### Android

- **Font Family**: Roboto
- **Font Weights**: Android-optimized weight mapping
- **Line Heights**: Android-specific line height calculations

### Cross-Platform

- **Consistent Behavior**: Same API across platforms
- **Responsive Scaling**: Adapts to different screen densities
- **Theme Integration**: Works with ResponsiveStyleSheet themes

## 🧪 Testing

The Typography component is designed to be easily testable:

- **Props Testing**: All boolean props are easily verifiable
- **Style Testing**: Computed styles can be tested
- **Performance Testing**: Memoization can be verified
- **Platform Testing**: Cross-platform behavior can be tested

## 🔗 Dependencies

- **React Native**: Core framework
- **ResponsiveStyleSheet**: For responsive design and theming
- **TypeScript**: For type safety

## 📄 License

This component is part of the project's design system and follows the project's licensing terms.

## 🎯 Best Practices

1. **Use Semantic Variants**: Choose variants that match content hierarchy
2. **Consistent Alignment**: Use consistent alignment within sections
3. **Weight Hierarchy**: Use weights to create visual hierarchy
4. **Responsive Design**: Let ResponsiveStyleSheet handle scaling
5. **Performance**: Avoid unnecessary style overrides

## 🚀 Advanced Usage

### Custom Typography System

```tsx
// Create custom typography variants
const CustomTypography: React.FC<{ custom?: boolean }> = ({ custom, children, ...props }) => {
  if (custom) {
    return (
      <Typography 
        body1 
        medium 
        style={{ 
          fontSize: 18, 
          lineHeight: 26,
          color: ResponsiveStyleSheet.getThemeColors().primary 
        }}
        {...props}
      >
        {children}
      </Typography>
    );
  }
  
  return <Typography {...props}>{children}</Typography>;
};
```

### Theme Integration

```tsx
// Use theme colors from ResponsiveStyleSheet
<Typography 
  h1 
  bold 
  color={ResponsiveStyleSheet.getThemeColors().primary}
>
  Themed Heading
</Typography>
```

The Typography component provides excellent performance while maintaining all the design consistency and flexibility you need! 🎉
