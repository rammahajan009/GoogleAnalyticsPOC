This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.

# Analytics Service

A generic, flexible analytics service for React Native that supports multiple Google Analytics 4 (GA4) properties.

## Features

- ✅ **Multi-Project Support**: Track events to different GA4 properties
- ✅ **Generic Interface**: Easy to use with any project structure
- ✅ **React Hook**: Simple integration with React components
- ✅ **TypeScript Support**: Fully typed interfaces
- ✅ **Persistent Client IDs**: Each project maintains its own client ID
- ✅ **No External Dependencies**: Uses built-in fetch API

## Quick Start

### 1. Configure Projects

Edit `src/config/AnalyticsConfig.ts`:

```typescript
export const ANALYTICS_PROJECTS: Record<string, ProjectAnalyticsConfig> = {
  main: {
    measurementId: 'G-ECMNWKHPGR',
    apiSecret: 'lEXviq-yRuCEWIAwErz6QA',
    projectName: 'Main Project',
  },
  us: {
    measurementId: 'G-XXXXXXXXXX',
    apiSecret: 'YOUR_US_API_SECRET',
    projectName: 'US Project',
  },
  // Add more projects...
};
```

### 2. Use in React Components

```typescript
import { useAnalytics } from './src/hooks/useAnalytics';

function MyComponent() {
  const { logEvent, setCurrentProject } = useAnalytics();

  const handleButtonClick = async () => {
    await logEvent('button_click', {
      button_name: 'submit',
      screen: 'login',
    });
  };

  return <Button title="Submit" onPress={handleButtonClick} />;
}
```

### 3. Switch Projects

```typescript
// Switch to different project
setCurrentProject('us');

// Log event to specific project
await logEvent('test_event', {}, 'uk');

// Log to multiple projects
await logEventToMultipleProjects('global_event', {}, ['main', 'us', 'uk']);
```

## File Structure

```
src/
├── services/
│   └── AnalyticsService.ts          # Generic analytics service
├── hooks/
│   └── useAnalytics.ts              # React hook
├── config/
│   └── AnalyticsConfig.ts           # Project configurations
└── utils/
    └── ClientIdManager.ts           # Client ID management
```

## API Reference

### AnalyticsService

- `setCurrentProject(projectId)`: Set current project
- `initializeProject(projectId, config)`: Initialize project
- `logEvent(event)`: Log event to current project
- `logEventToMultipleProjects(event, projectIds)`: Log to multiple projects

### useAnalytics Hook

- `currentProject`: Current project ID
- `setCurrentProject(projectId)`: Switch project
- `logEvent(eventName, parameters, projectId?)`: Log custom event
- `logPageView(title, location, projectId?)`: Log page view
- `logButtonClick(buttonName, params, projectId?)`: Log button click
- `logUserAction(action, category, label?, value?, projectId?)`: Log user action
- `logError(message, code?, params?, projectId?)`: Log error
- `logPurchase(transactionId, value, currency?, items?, projectId?)`: Log purchase

## Testing

1. **Run the app**: `npm run android` or `npm run ios`
2. **Switch projects**: Use the project selection buttons
3. **Test events**: Press the demo buttons
4. **Check console**: View detailed logs
5. **Verify GA4**: Check Real-Time reports in each GA4 property

## Configuration

Add your GA4 properties to `src/config/AnalyticsConfig.ts`:

1. **Get Measurement ID**: From GA4 Admin > Data Streams
2. **Get API Secret**: From GA4 Admin > Data Streams > Measurement Protocol API secrets
3. **Add to config**: Update `ANALYTICS_PROJECTS` object

## Support

- **Console Logs**: Check for detailed event logging
- **GA4 Real-Time**: Verify events appear in Real-Time reports
- **Network Tab**: Monitor requests to google-analytics.com

Your analytics system is now generic, flexible, and ready for any multi-project setup! 🚀
