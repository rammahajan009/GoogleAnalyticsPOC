# Alert Service

A modern alert service that mimics the native React Native `Alert.alert()` API with custom styling and modal queuing. Call `alert.show()` from anywhere in your app without managing component state, with support for multiple buttons and automatic queuing to prevent iOS modal crashes.

## Features

- ✅ **Native Alert-like API** - Familiar button array syntax
- ✅ **Multiple Button Support** - Default, cancel, and destructive button styles
- ✅ **Modal Queuing** - Prevents iOS crashes from multiple modals
- ✅ **Global Access** - Call from anywhere without state management
- ✅ **Multiple Types** - Success, error, warning, info alerts
- ✅ **Custom Styling** - Uses your design system
- ✅ **Button Callbacks** - Handle individual button presses
- ✅ **Animations** - Smooth show/hide animations
- ✅ **Full Accessibility** - Screen reader support, keyboard navigation, proper ARIA roles
- ✅ **iOS/Android Compatible** - Works seamlessly on both platforms

## Setup

### 1. Wrap Your App with AlertProvider

```tsx
import React from 'react';
import { AlertProvider } from '../../utils/alert';

const App = () => {
  return (
    <AlertProvider>
      {/* Your app content */}
    </AlertProvider>
  );
};
```

### 2. Import and Use the Service

```tsx
import { alert } from '../../utils/alert';

// Show alerts from anywhere in your app
const handleSuccess = () => {
  alert.success('Operation completed successfully!');
};
```

## API Reference

### Core Method

#### `alert.show(options: AlertOptions | string): string`
Shows an alert. You can pass either a string message or an options object.

```tsx
// Simple string message (shows with default "OK" button)
alert.show('Your message here');

// With options and custom buttons
alert.show({
  title: 'Custom Title',
  message: 'Your message here',
  buttons: [
    { text: 'Cancel', style: 'cancel' },
    { text: 'OK', style: 'default', onPress: () => console.log('OK pressed') }
  ],
  type: 'info'
});
```

### Button Configuration

Each button in the array supports:

```typescript
interface AlertButton {
  text: string;                                    // Button text
  onPress?: () => void;                           // Callback when pressed
  style?: 'default' | 'cancel' | 'destructive';   // Button style
}
```

**Button Styles:**
- **`default`** - Primary button (blue, primary action)
- **`cancel`** - Secondary button (gray, secondary action)
- **`destructive`** - Danger button (red, destructive action)

### Convenience Methods

#### `alert.success(message: string, title?: string, onPress?: () => void): string`
Shows a success alert with a single "OK" button.

#### `alert.error(message: string, title?: string, onPress?: () => void): string`
Shows an error alert with a single "OK" button.

#### `alert.warning(message: string, title?: string, onPress?: () => void): string`
Shows a warning alert with a single "OK" button.

#### `alert.info(message: string, title?: string, onPress?: () => void): string`
Shows an info alert with a single "OK" button.

#### `alert.confirm(message: string, title?: string, onPress?: () => void, onCancel?: () => void, confirmText?: string, cancelText?: string): string`
Shows a confirmation dialog with Cancel and OK buttons.

#### `alert.showWithCancel(message: string, title?: string, onPress?: () => void, onCancel?: () => void, confirmText?: string, cancelText?: string): string`
Shows an alert with Cancel and OK buttons.

### Utility Methods

#### `alert.hide(id: string): void`
Hides a specific alert by ID.

#### `alert.hideAll(): void`
Hides all visible alerts and clears the queue.

#### `alert.getQueueStatus(): object`
Returns the current queue status for debugging.

#### `alert.clearQueue(): void`
Clears all pending alerts in the queue.

## Usage Examples

### Basic Usage

```tsx
// Simple alert with default OK button
alert.show('Operation completed!');

// Success message
alert.success('Data saved successfully!');

// Error message
alert.error('Something went wrong!');

// Warning message
alert.warning('Please review your input');

// Info message
alert.info('Here is some information');
```

### Multiple Buttons

```tsx
// Confirmation dialog
alert.show({
  title: 'Delete Item',
  message: 'Are you sure you want to delete this item?',
  buttons: [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Delete', style: 'destructive', onPress: deleteItem }
  ]
});

// Three button alert
alert.show({
  title: 'Choose Action',
  message: 'What would you like to do?',
  buttons: [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Maybe Later', style: 'default' },
    { text: 'Yes, Do It', style: 'default', onPress: performAction }
  ]
});
```

### Using Convenience Methods

```tsx
// Confirmation dialog
alert.confirm(
  'Are you sure you want to proceed?',
  'Confirm Action',
  () => console.log('User confirmed'),
  () => console.log('User cancelled'),
  'Proceed',
  'Cancel'
);

// Alert with cancel button
alert.showWithCancel(
  'Do you want to save changes?',
  'Save Changes',
  () => saveChanges(),
  () => discardChanges(),
  'Save',
  'Don\'t Save'
);
```

### Advanced Usage

```tsx
// Custom alert with multiple buttons and callbacks
alert.show({
  title: 'Custom Alert',
  message: 'This is a custom alert with multiple options',
  type: 'warning',
  buttons: [
    {
      text: 'No',
      style: 'cancel',
      onPress: () => console.log('User chose No')
    },
    {
      text: 'Maybe',
      style: 'default',
      onPress: () => console.log('User chose Maybe')
    },
    {
      text: 'Yes',
      style: 'default',
      onPress: () => {
        console.log('User chose Yes');
        // Perform action
        alert.success('Action completed!');
      }
    }
  ]
});
```

### Multiple Alerts (Queued)

```tsx
// These will be automatically queued to prevent iOS crashes
const showSequence = () => {
  alert.info('Step 1: Initializing...');
  alert.warning('Step 2: Processing...');
  alert.success('Step 3: Complete!');
};

// Check queue status
console.log(alert.getQueueStatus());
// Output: { isShowingModal: true, queueLength: 2, totalAlerts: 3 }

// Clear all alerts and queue
alert.hideAll();
```

## AlertOptions Interface

```typescript
interface AlertOptions {
  title?: string;                    // Alert title (optional)
  message?: string;                  // Alert message (optional)
  buttons?: AlertButton[];           // Array of button configurations
  type?: 'default' | 'success' | 'warning' | 'error' | 'info';
}

interface AlertButton {
  text: string;                                    // Button text
  onPress?: () => void;                           // Callback when pressed
  style?: 'default' | 'cancel' | 'destructive';   // Button style
}
```

## Modal Queuing

The Alert Service automatically queues alerts to prevent iOS crashes from multiple modals:

1. **User calls `alert.show()`** → Alert is added to queue
2. **Queue processor checks** → If no modal is showing, shows the alert
3. **If modal is already showing** → Alert waits in queue
4. **User dismisses alert** → Next alert in queue is automatically shown
5. **Process continues** → Until queue is empty

This ensures smooth user experience while preventing the common iOS error:
```
Attempt to present <RCTFabricModalHostViewController> on <UIViewController> which is already presenting <RCTFabricModalHostViewController>
```

## Best Practices

1. **Use appropriate button styles** - `default` for primary actions, `cancel` for secondary, `destructive` for dangerous actions
2. **Keep messages concise** and actionable
3. **Provide meaningful callbacks** for user interactions
4. **Use the queue system** - don't worry about showing multiple alerts quickly
5. **Use `alert.hideAll()`** when navigating away from screens
6. **Follow native Alert patterns** - Cancel button typically goes first, primary action last

## Migration from Old API

If you were using the old API with `buttonText`, `onPress`, etc.:

```tsx
// Old API
alert.show({
  message: 'Message',
  buttonText: 'OK',
  onPress: () => console.log('Pressed')
});

// New API
alert.show({
  message: 'Message',
  buttons: [
    { text: 'OK', style: 'default', onPress: () => console.log('Pressed') }
  ]
});
```

The new API is more flexible and follows the familiar React Native Alert pattern while maintaining all the visual enhancements and theming capabilities.

## Accessibility

The Alert component is fully accessible and follows React Native accessibility best practices:

### Screen Reader Support
- **Alert Announcements** - Automatically announces alert content when visible
- **Proper Roles** - Uses `alert` role for the main container
- **Button Accessibility** - Each button has proper labels, hints, and roles
- **Content Structure** - Clear hierarchy with header, message, and action sections

### Accessibility Properties
```tsx
// Main alert container
accessibilityRole="alert"
accessibilityViewIsModal={true}
accessibilityLiveRegion="polite"
importantForAccessibility="yes"

// Buttons
accessibilityRole="button"
accessibilityState={{ disabled: false }}
accessibilityActions={[{ name: 'activate', label: 'Press button' }]}

// Content sections
accessibilityRole="header"     // For title
accessibilityRole="text"       // For message
accessibilityRole="image"      // For type icons
```

### Keyboard Navigation
- **Hardware Back Button** - Android back button support via `onRequestClose`
- **Focus Management** - Proper focus handling for modal dialogs
- **Touch Targets** - Adequate button sizes for touch accessibility

### Screen Reader Announcements
- **Dynamic Content** - Announces alert type, title, and message
- **Button Actions** - Clear descriptions of what each button does
- **Context Information** - Provides hints about alert purpose and actions

### Best Practices for Accessibility
1. **Use descriptive button text** - Avoid generic labels like "OK"
2. **Provide meaningful titles** - Help users understand the alert context
3. **Use appropriate alert types** - Success, warning, error, info for different scenarios
4. **Test with screen readers** - Verify announcements and navigation work correctly
