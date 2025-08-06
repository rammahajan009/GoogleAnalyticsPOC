# Setup Instructions for GoogleAnalyticsPOC

## 📦 What's Included

This zip file contains a complete React Native project with:
- ✅ Multi-Project Google Analytics 4 (GA4) integration
- ✅ Generic analytics service for multiple projects
- ✅ SafeAreaView for proper notch handling
- ✅ TypeScript support
- ✅ Demo UI with project switching

## 🚀 Quick Setup

### Prerequisites
- Node.js (v18 or higher)
- Yarn package manager
- React Native development environment
- Android Studio (for Android) or Xcode (for iOS)

### Installation Steps

1. **Extract the zip file**
   ```bash
   unzip GoogleAnalyticsPOC.zip
   cd GoogleAnalyticsPOC
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Run the app**
   ```bash
   # For Android
   yarn android
   
   # For iOS
   yarn ios
   ```

## 📊 Current Configuration

The app is configured with these analytics projects:
- **🇮🇳 India**: `G-ECMNWKHPGR` (Your current GA4 property)
- **🇺🇸 US**: Placeholder (replace with your US GA4 property)
- **🇬🇧 UK**: Placeholder (replace with your UK GA4 property)

## 🔧 Customization

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
2. **Switch projects**: Use the project selection buttons (🇮🇳 India, 🇺🇸 US, 🇬🇧 UK)
3. **Test events**: Press the demo buttons to log events
4. **Check console**: View detailed logs in the terminal
5. **Verify GA4**: Check Real-Time reports in each GA4 property

## 📱 Features

- **Project Switching**: Switch between different analytics projects
- **Event Logging**: Test different event types (custom, page view, button click, etc.)
- **Multi-Project Events**: Log events to multiple projects simultaneously
- **SafeAreaView**: Proper notch and status bar handling
- **Real-time Testing**: See events in GA4 Real-Time reports

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

### Dependencies

The project uses these key dependencies:
- `react-native-safe-area-context`: For notch handling
- `@react-native-async-storage/async-storage`: For client ID persistence

## 📁 Project Structure

```
GoogleAnalyticsPOC/
├── src/
│   ├── services/AnalyticsService.ts          # Generic analytics service
│   ├── hooks/useAnalytics.ts                 # React hook
│   ├── config/AnalyticsConfig.ts             # Project configurations
│   └── utils/ClientIdManager.ts              # Client ID management
├── App.tsx                                   # Main app component
├── package.json                              # Dependencies
└── README.md                                # Project documentation
```

## 🎯 Next Steps

1. **Add your GA4 properties** to the configuration
2. **Test with your own events** in the demo
3. **Integrate into your app** using the `useAnalytics` hook
4. **Customize the UI** to match your app's design

## 📞 Support

If you encounter issues:
1. Check the console logs for error messages
2. Verify your GA4 credentials are correct
3. Ensure your React Native development environment is properly set up
4. Check the README.md file for additional documentation

The project is ready to use! 🚀 