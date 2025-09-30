/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AlertProvider } from './src/utils/alert';
import TypographyExample from './src/examples/TypographyExample';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      
      <AlertProvider>
        <TypographyExample />
      </AlertProvider>
    </SafeAreaProvider>
  );
}

export default App;