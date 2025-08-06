# 📊 Google Analytics 4 Multi-Project Integration for React Native

A complete React Native project demonstrating how to integrate Google Analytics 4 (GA4) with support for multiple analytics projects. This project provides a generic, reusable analytics service that can handle multiple GA4 properties simultaneously.

## 🚀 Features

- ✅ **Multi-Project Analytics**: Switch between different GA4 properties (India, US, UK, etc.)
- ✅ **Generic Analytics Service**: Reusable service architecture for any project type
- ✅ **SafeAreaView Integration**: Proper notch and status bar handling
- ✅ **Persistent Client ID**: User tracking across app sessions
- ✅ **TypeScript Support**: Full type safety and IntelliSense
- ✅ **Real-time Testing**: Demo UI with live event logging
- ✅ **Comprehensive Documentation**: Step-by-step setup guide

## 📱 Demo Screenshots

The app includes a demo interface with:
- Project selection buttons (🇮🇳 India, 🇺🇸 US, 🇬🇧 UK)
- Event testing buttons for different analytics events
- Real-time console logging
- SafeAreaView for proper device compatibility

## 🛠️ Quick Start

### Prerequisites
- Node.js (v18 or higher)
- Yarn package manager
- React Native development environment
- Android Studio (for Android) or Xcode (for iOS)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rammahajan009/GoogleAnalyticsPOC.git
   cd GoogleAnalyticsPOC
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **iOS Setup** (if developing for iOS)
   ```bash
   cd ios && pod install && cd ..
   ```

4. **Run the app**
   ```bash
   # For Android
   yarn android
   
   # For iOS
   yarn ios
   ```

## 📊 Configuration

### Current Setup
The project is pre-configured with:
- **🇮🇳 India Project**: `G-ECMNWKHPGR` (working GA4 property)
- **🇺🇸 US Project**: Placeholder (ready for your US GA4 property)
- **🇬🇧 UK Project**: Placeholder (ready for your UK GA4 property)

### Add Your GA4 Properties

1. **Get your GA4 credentials**:
   - Go to [analytics.google.com](https://analytics.google.com)
   - Create GA4 properties for each country/project
   - Get Measurement ID (format: G-XXXXXXXXXX)
   - Get API Secret from Admin > Data Streams > Measurement Protocol API secrets

2. **Update configuration** in `src/config/AnalyticsConfig.ts`:
   ```typescript
   export const ANALYTICS_PROJECTS = {
     india: {
       measurementId: 'G-ECMNWKHPGR', // Your India GA4 property
       apiSecret: 'lEXviq-yRuCEWIAwErz6QA',
       projectName: 'India Project',
     },
     us: {
       measurementId: 'G-XXXXXXXXXX', // Replace with your US GA4 property
       apiSecret: 'YOUR_US_API_SECRET', // Replace with your US API Secret
       projectName: 'US Project',
     },
     // Add more projects...
   };
   ```

## 🧪 Testing

1. **Run the app**: `yarn android` or `yarn ios`
2. **Switch projects**: Use the project selection buttons
3. **Test events**: Press the demo buttons to log events
4. **Check console**: View detailed logs in the terminal
5. **Verify GA4**: Check Real-Time reports in each GA4 property

## 📁 Project Structure

```
GoogleAnalyticsPOC/
├── src/
│   ├── services/AnalyticsService.ts          # Generic analytics service
│   ├── hooks/useAnalytics.ts                 # React hook for easy integration
│   ├── config/AnalyticsConfig.ts             # Project configurations
│   └── utils/ClientIdManager.ts              # Client ID management
├── App.tsx                                   # Main app component with demo UI
├── package.json                              # Dependencies
└── README.md                                # This file
```

## 🔧 API Usage

### Basic Event Logging
```typescript
import { useAnalytics } from './src/hooks/useAnalytics';

function MyComponent() {
  const { logEvent, setCurrentProject } = useAnalytics();

  const handleButtonClick = () => {
    logEvent({
      name: 'button_click',
      parameters: {
        button_name: 'test_button',
        screen: 'home'
      }
    });
  };

  return <Button onPress={handleButtonClick} title="Test Event" />;
}
```

### Multi-Project Event Logging
```typescript
// Log to multiple projects simultaneously
logEvent({
  name: 'user_action',
  parameters: { action: 'purchase' },
  projectIds: ['india', 'us', 'uk'] // Send to multiple projects
});
```

### Project Switching
```typescript
// Switch current project
setCurrentProject('us');

// Log to specific project
logEvent({
  name: 'page_view',
  projectId: 'india' // Override current project
});
```

## 📦 Dependencies

Key dependencies used:
- `react-native-safe-area-context`: For notch handling
- `@react-native-async-storage/async-storage`: For client ID persistence
- `fetch`: For GA4 Measurement Protocol API calls

## 🔍 Troubleshooting

### Common Issues

1. **Metro bundler issues**:
   ```bash
   yarn start --reset-cache
   ```

2. **iOS build issues**:
   - Clean build folder in Xcode
   - Run `cd ios && pod install`

3. **Android build issues**:
   ```bash
   cd android && ./gradlew clean
   ```

4. **Analytics not working**:
   - Check GA4 credentials in `src/config/AnalyticsConfig.ts`
   - Verify network connectivity
   - Check console for error messages

## 🎯 Use Cases

This project is perfect for:
- **Multi-country apps** with different analytics requirements
- **A/B testing** with separate GA4 properties
- **Client projects** requiring isolated analytics
- **Learning GA4** Measurement Protocol integration
- **Template projects** for React Native analytics

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you encounter issues:
1. Check the console logs for error messages
2. Verify your GA4 credentials are correct
3. Ensure your React Native development environment is properly set up
4. Open an issue on GitHub for bugs or feature requests

## 🔗 Links

- **GitHub Repository**: https://github.com/rammahajan009/GoogleAnalyticsPOC
- **Google Analytics 4**: https://analytics.google.com
- **React Native**: https://reactnative.dev

---

**Made with ❤️ for the React Native community**

⭐ **Star this repository if you find it helpful!**
