/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ResponsiveStyleSheet } from './src/utils/ResponsiveStyle/ResponsiveStyleSheet';
import AnalyticsScreen from './src/screens/AnalyticsScreen';
import StickyScreen from './src/screens/StickyScreen';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [currentScreen, setCurrentScreen] = useState<'analytics' | 'sticky'>('analytics');

  const colors = ResponsiveStyleSheet.getThemeColors();

  const handleNavigateToSticky = () => {
    setCurrentScreen('sticky');
  };

  const handleNavigateToAnalytics = () => {
    setCurrentScreen('analytics');
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      
      {currentScreen === 'analytics' ? (
        <AnalyticsScreen onNavigateToSticky={handleNavigateToSticky} />
      ) : (
        <StickyScreen onNavigateToAnalytics={handleNavigateToAnalytics} />
      )}
    </SafeAreaProvider>
  );
}

export default App;