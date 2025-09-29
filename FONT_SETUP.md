# Font Setup Guide

## Quick Setup

1. **Download Roboto fonts** from [Google Fonts](https://fonts.google.com/specimen/Roboto)

2. **Place font files** in the `./fonts/` directory:
   - Roboto-Regular.ttf
   - Roboto-Bold.ttf  
   - Roboto-Black.ttf
   - Roboto-Italic.ttf
   - Roboto-BoldItalic.ttf
   - Roboto-BlackItalic.ttf

3. **Link fonts** to your project:
   ```bash
   npx react-native-asset
   ```

4. **Clean and rebuild**:
   ```bash
   # For iOS
   cd ios && pod install && cd ..
   
   # For Android
   cd android && ./gradlew clean && cd ..
   
   # Start Metro
   npx react-native start --reset-cache
   ```

## Font Usage

Your existing Typography component will automatically use the Roboto fonts:

```tsx
<Typography bold>Bold Roboto Text</Typography>
<Typography black>Black Roboto Text</Typography>
```

## Configuration Files

- `react-native.config.js` - Configures font asset paths
- `metro.config.js` - Handles font file extensions
- `ios/GoogleAnalyticsPOC/Info.plist` - iOS font registration (already configured)
