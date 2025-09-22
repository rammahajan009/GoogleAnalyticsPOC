/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LoaderProvider } from './src/components';
import { AlertProvider } from './src/utils/alert';
import AnalyticsScreen from './src/screens/AnalyticsScreen';
import StickyScreen from './src/screens/StickyScreen';
import LoaderExample from './src/examples/LoaderExample';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [currentScreen, setCurrentScreen] = useState<'analytics' | 'sticky' | 'loader'>('analytics');

  const handleNavigateToSticky = () => {
    setCurrentScreen('sticky');
  };

  const handleNavigateToAnalytics = () => {
    setCurrentScreen('analytics');
  };

  const handleNavigateToLoader = () => {
    setCurrentScreen('loader');
  };

  const handleNavigateBack = () => {
    setCurrentScreen('analytics');
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      
      <AlertProvider>
        {currentScreen === 'analytics' ? (
          <AnalyticsScreen 
            onNavigateToSticky={handleNavigateToSticky} 
            onNavigateToLoader={handleNavigateToLoader}
          />
        ) : currentScreen === 'sticky' ? (
          <StickyScreen onNavigateToAnalytics={handleNavigateToAnalytics} />
        ) : (
          <LoaderExample onNavigateBack={handleNavigateBack} />
        )}
        
        {/* LoaderProvider for global loader state */}
        <LoaderProvider />
      </AlertProvider>
    </SafeAreaProvider>
  );
}

export default App;