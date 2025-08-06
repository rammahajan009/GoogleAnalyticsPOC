/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, useColorScheme, View, Button, Text, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useAnalytics } from './src/hooks/useAnalytics';
import { getProjectIds, getProjectConfig } from './src/config/AnalyticsConfig';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [selectedProject, setSelectedProject] = useState('india');
  
  const {
    currentProject,
    setCurrentProject,
    initializeCurrentProject,
    logEvent,
    logButtonClick,
    logUserAction,
    logError,
    logPageView,
    logEventToMultipleProjects,
    getInitializedProjects,
  } = useAnalytics();

  useEffect(() => {
    // Initialize analytics for current project
    const initializeAnalytics = async () => {
      try {
        const projectConfig = getProjectConfig(selectedProject);
        if (projectConfig) {
          await initializeCurrentProject(projectConfig);
          
          // Log app start event
          await logEvent('app_start', {
            app_version: '1.0.0',
            platform: 'react-native',
            project: currentProject,
          });
          
          // Log page view for main screen
          await logPageView('Main Screen', 'app://main');
          
          console.log(`📊 Google Analytics initialized for ${currentProject}`);
        }
      } catch (error) {
        console.error('Failed to initialize Google Analytics:', error);
      }
    };

    initializeAnalytics();
  }, [initializeCurrentProject, logEvent, logPageView, currentProject, selectedProject]);

  const handleTestEvent = async () => {
    try {
      await logEvent('test_button_clicked', {
        timestamp: new Date().toISOString(),
        user_action: 'test',
        project: currentProject,
      });
      Alert.alert('Success', `Test event logged to ${currentProject}!`);
    } catch (error) {
      Alert.alert('Error', 'Failed to log test event');
    }
  };

  const handleUserAction = async () => {
    try {
      await logUserAction('button_press', 'navigation', 'test_button', 1);
      Alert.alert('Success', `User action logged to ${currentProject}!`);
    } catch (error) {
      Alert.alert('Error', 'Failed to log user action');
    }
  };

  const handleErrorLog = async () => {
    try {
      await logError('Test error occurred', 'TEST_ERROR_001', {
        screen: 'main',
        user_id: 'test_user',
        project: currentProject,
      });
      Alert.alert('Success', `Error event logged to ${currentProject}!`);
    } catch (error) {
      Alert.alert('Error', 'Failed to log error event');
    }
  };

  const handleButtonClick = async () => {
    try {
      await logButtonClick('demo_button', {
        screen: 'main',
        button_type: 'demo',
        project: currentProject,
      });
      Alert.alert('Success', `Button click logged to ${currentProject}!`);
    } catch (error) {
      Alert.alert('Error', 'Failed to log button click');
    }
  };

  const handleMultiProjectEvent = async () => {
    try {
      const results = await logEventToMultipleProjects('multi_project_event', {
        timestamp: new Date().toISOString(),
        event_type: 'multi_project_test',
      }, ['india', 'us', 'uk']);
      
      const successCount = Object.values(results).filter(Boolean).length;
      Alert.alert('Success', `Event logged to ${successCount} projects!`);
    } catch (error) {
      Alert.alert('Error', 'Failed to log multi-project event');
    }
  };

  const handleProjectChange = async (projectId: string) => {
    try {
      setCurrentProject(projectId);
      setSelectedProject(projectId);
      const projectConfig = getProjectConfig(projectId);
      if (projectConfig) {
        await initializeCurrentProject(projectConfig);
        Alert.alert('Success', `Switched to ${projectId} analytics!`);
      }
    } catch (error) {
      Alert.alert('Error', `Failed to switch to ${projectId}`);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        {/* <NewAppScreen templateFileName="App.tsx" /> */}
        
        {/* Multi-Project Analytics Demo */}
        <View style={styles.analyticsContainer}>
          <Text style={styles.title}>📊 Multi-Project Analytics</Text>
          <Text style={styles.subtitle}>Current Project: {currentProject}</Text>
          
          {/* Project Selection */}
          <View style={styles.countryContainer}>
            <Text style={styles.sectionTitle}>Select Project:</Text>
            <View style={styles.countryButtons}>
              <Button 
                title="🇮🇳 India" 
                onPress={() => handleProjectChange('india')}
                color={selectedProject === 'india' ? '#34C759' : '#007AFF'}
              />
              <View style={styles.buttonSpacer} />
              <Button 
                title="🇺🇸 US" 
                onPress={() => handleProjectChange('us')}
                color={selectedProject === 'us' ? '#34C759' : '#007AFF'}
              />
              <View style={styles.buttonSpacer} />
              <Button 
                title="🇬🇧 UK" 
                onPress={() => handleProjectChange('uk')}
                color={selectedProject === 'uk' ? '#34C759' : '#007AFF'}
              />
            </View>
          </View>
          
          <View style={styles.buttonSpacer} />
          
          {/* Event Buttons */}
          <Text style={styles.sectionTitle}>Test Events:</Text>
          
          <Button 
            title="📊 Log Test Event" 
            onPress={handleTestEvent}
            color="#007AFF"
          />
          
          <View style={styles.buttonSpacer} />
          
          <Button 
            title="👤 Log User Action" 
            onPress={handleUserAction}
            color="#34C759"
          />
          
          <View style={styles.buttonSpacer} />
          
          <Button 
            title="❌ Log Error Event" 
            onPress={handleErrorLog}
            color="#FF3B30"
          />
          
          <View style={styles.buttonSpacer} />
          
          <Button 
            title="🖱️ Log Button Click" 
            onPress={handleButtonClick}
            color="#FF9500"
          />
          
          <View style={styles.buttonSpacer} />
          
          <Button 
            title="📊 Log Multi-Project Event" 
            onPress={handleMultiProjectEvent}
            color="#AF52DE"
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: 10, // Add some top padding
  },
  analyticsContainer: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    margin: 10,
    borderRadius: 10,
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 15,
    color: '#666',
  },
  countryContainer: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  countryButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  buttonSpacer: {
    height: 10,
  },
});

export default App;
