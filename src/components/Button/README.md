# Button Component

A highly customizable, accessible, and performant button component for React Native that integrates seamlessly with the ResponsiveStyleSheet utility and Typography component.

## ✨ Features

- **Multiple Variants**: Primary, secondary, outline, ghost, danger, and success
- **Flexible Sizing**: Small, medium, and large sizes with responsive dimensions
- **State Management**: Loading, disabled, and interactive states
- **Icon Support**: Left and right icon positioning with proper spacing
- **Responsive Design**: Integrates with ResponsiveStyleSheet for consistent scaling
- **Accessibility**: Full screen reader support with customizable labels and hints
- **Performance**: Memoized styles and callbacks for optimal rendering
- **TypeScript**: Fully typed with comprehensive prop interfaces

## 🚀 Installation

```tsx
import Button from '../components/Button/Button';
```

## 📖 Usage

### Basic Usage

```tsx
<Button primary onPress={handlePress}>
  Click Me
</Button>
```

### Variants

```tsx
// Primary button (default)
<Button primary onPress={handlePress}>
  Primary Action
</Button>

// Secondary button
<Button secondary onPress={handlePress}>
  Secondary Action
</Button>

// Outline button
<Button outline onPress={handlePress}>
  Outline Style
</Button>

// Ghost button
<Button ghost onPress={handlePress}>
  Ghost Style
</Button>

// Danger button
<Button danger onPress={handlePress}>
  Delete
</Button>

// Success button
<Button success onPress={handlePress}>
  Save
</Button>
```

### Sizes

```tsx
<Button small primary onPress={handlePress}>
  Small
</Button>

<Button medium primary onPress={handlePress}>
  Medium (default)
</Button>

<Button large primary onPress={handlePress}>
  Large
</Button>
```

### States

```tsx
// Loading state
<Button primary loading onPress={handlePress}>
  Processing...
</Button>

// Disabled state
<Button primary disabled onPress={handlePress}>
  Unavailable
</Button>

// Full width
<Button primary fullWidth onPress={handlePress}>
  Full Width Button
</Button>
```

### Icons

```tsx
<Button 
  primary 
  leftIcon={<Icon name="heart" />}
  onPress={handlePress}
>
  Like
</Button>

<Button 
  secondary 
  rightIcon={<Icon name="arrow-right" />}
  onPress={handlePress}
>
  Next
</Button>
```

### Custom Styling

```tsx
<Button 
  primary
  backgroundColor="#FF6B6B"
  borderColor="#FF5252"
  textColor="#FFFFFF"
  borderRadius="xl"
  style={{ marginTop: 20 }}
  onPress={handlePress}
>
  Custom Styled
</Button>
```

## 🔧 Props

### Variant Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `primary` | `boolean` | `false` | Primary button variant |
| `secondary` | `boolean` | `false` | Secondary button variant |
| `outline` | `boolean` | `false` | Outline button variant |
| `ghost` | `boolean` | `false` | Ghost button variant |
| `danger` | `boolean` | `false` | Danger button variant |
| `success` | `boolean` | `false` | Success button variant |

### Size Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `small` | `boolean` | `false` | Small button size |
| `medium` | `boolean` | `true` | Medium button size (default) |
| `large` | `boolean` | `false` | Large button size |

### State Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `loading` | `boolean` | `false` | Shows loading spinner |
| `disabled` | `boolean` | `false` | Disables button interaction |
| `fullWidth` | `boolean` | `false` | Makes button full width |

### Style Override Props

| Prop | Type | Description |
|------|------|-------------|
| `color` | `string` | Override button color |
| `backgroundColor` | `string` | Override background color |
| `borderColor` | `string` | Override border color |
| `textColor` | `string` | Override text color |
| `borderRadius` | `keyof BORDER_RADIUS_SCALE` | Border radius from ResponsiveStyleSheet |
| `style` | `ViewStyle` | Additional button styles |
| `textStyle` | `TextStyle` | Additional text styles |

### Accessibility Props

| Prop | Type | Description |
|------|------|-------------|
| `accessibilityLabel` | `string` | Screen reader text for the button |
| `accessibilityHint` | `string` | Additional context for screen readers |
| `accessibilityRole` | `'button' \| 'link' \| 'tab' \| 'menuitem'` | Button's role in the UI |
| `accessibilityState` | `object` | Current state (disabled, busy, selected, etc.) |
| `accessibilityActions` | `Array` | Available actions for the button |
| `onAccessibilityAction` | `function` | Handler for accessibility actions |

### Content Props

| Prop | Type | Description |
|------|------|-------------|
| `children` | `React.ReactNode` | Button text/content |
| `leftIcon` | `React.ReactNode` | Icon to display on the left |
| `rightIcon` | `React.ReactNode` | Icon to display on the right |

## 🎨 Design System Integration

### ResponsiveStyleSheet Integration

- **Spacing**: Uses `ResponsiveStyleSheet.responsiveSpacing()` for consistent padding
- **Dimensions**: Uses `ResponsiveStyleSheet.height()` for button heights
- **Border Radius**: Uses `ResponsiveStyleSheet.borderRadius()` with customizable values
- **Colors**: Automatically picks colors from the current theme
- **Typography**: Integrates with Typography component for consistent text styling

### Theme Colors

The button automatically adapts to the current theme:

- **Primary**: Uses theme's primary color
- **Secondary**: Uses theme's textSecondary color
- **Outline/Ghost**: Uses theme's primary color for borders and text
- **Danger**: Uses theme's error color
- **Success**: Uses theme's success color

### Border Radius Scale

Available border radius values from ResponsiveStyleSheet:

```tsx
'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
```

## ♿ Accessibility Features

### Screen Reader Support

- **Always accessible**: `accessible={true}` by default
- **Clear labels**: Use `accessibilityLabel` for meaningful descriptions
- **Context hints**: Use `accessibilityHint` for complex actions
- **State awareness**: Screen readers know when buttons are disabled or loading

### Voice Control

- **Role clarity**: Clear indication of button purpose
- **Action support**: Customizable accessibility actions
- **State feedback**: Dynamic state updates for screen readers

### Best Practices

```tsx
// Good accessibility
<Button 
  primary 
  accessibilityLabel="Submit form data"
  accessibilityHint="Saves your information and proceeds to next step"
>
  Submit
</Button>

// Loading state accessibility
<Button 
  primary 
  loading 
  accessibilityLabel="Processing payment"
  accessibilityHint="Please wait while we process your payment"
>
  Processing...
</Button>
```

## ⚡ Performance Features

- **Memoized styles**: Button styles are calculated once and cached
- **Optimized callbacks**: `onPress` and accessibility handlers are memoized
- **Pre-calculated base styles**: Static styles are defined at component level
- **Conditional rendering**: Icons and loading states are conditionally rendered

## 🔄 Migration from TouchableOpacity

Replace TouchableOpacity buttons with the new Button component:

```tsx
// Before
<TouchableOpacity 
  style={[styles.button, styles.primaryButton]} 
  onPress={handlePress}
>
  <Text style={styles.buttonText}>Click Me</Text>
</TouchableOpacity>

// After
<Button primary onPress={handlePress}>
  Click Me
</Button>
```

## 📱 Platform Considerations

- **iOS**: Optimized for iOS design patterns
- **Android**: Follows Material Design principles
- **Cross-platform**: Consistent behavior across platforms
- **Responsive**: Adapts to different screen sizes and densities

## 🧪 Testing

The Button component is designed to be easily testable:

- **Props testing**: All props are clearly defined and typed
- **State testing**: Loading and disabled states are easily verifiable
- **Accessibility testing**: Screen reader compatibility can be tested
- **Style testing**: Custom styles and theme integration can be verified

## 🔗 Dependencies

- **React Native**: Core framework
- **ResponsiveStyleSheet**: For responsive design and theming
- **Typography**: For consistent text styling
- **TypeScript**: For type safety

## 📄 License

This component is part of the project's design system and follows the project's licensing terms.
