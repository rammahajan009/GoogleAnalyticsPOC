import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAnalytics } from '../hooks/useAnalytics';
import { getProjectConfig } from '../config/AnalyticsConfig';
import { ResponsiveStyleSheet, s, f, b } from '../utils/ResponsiveStyle/ResponsiveStyleSheet';

interface AnalyticsScreenProps {
  onNavigateToSticky: () => void;
  onNavigateToLoader?: () => void;
}

const AnalyticsScreen: React.FC<AnalyticsScreenProps> = ({ onNavigateToSticky, onNavigateToLoader }) => {
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
  } = useAnalytics();

  useEffect(() => {
    // Initialize analytics for current project
    const initializeAnalytics = async () => {
      try {
        const projectConfig = getProjectConfig(selectedProject);
        if (projectConfig) {
          await initializeCurrentProject(projectConfig);

          // Log app start event
          await logEvent('app_start', currentProject, {
            app_version: '1.0.0',
            platform: 'react-native',
            project: currentProject,
          });

          // Log page view for main screen
          await logPageView('Main Screen', 'app://main');

          console.log(`📊 Google Analytics initialized for ${currentProject}`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        console.error('Failed to initialize Google Analytics:', error);
        Alert.alert('Initialization Error', `Failed to initialize analytics: ${errorMessage}`);
      }
    };

    initializeAnalytics();
  }, [initializeCurrentProject, logEvent, logPageView, currentProject, selectedProject]);

  const handleTestEvent = async () => {
    try {
      await logEvent('test_button_clicked', currentProject, {
        timestamp: new Date().toISOString(),
        user_action: 'test',
        project: currentProject,
      });
      Alert.alert('Success', `Test event logged to ${currentProject}!`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Test event logging error:', error);
      Alert.alert('Analytics Error', `Failed to log test event: ${errorMessage}`);
    }
  };

  const handleUserAction = async () => {
    try {
      await logUserAction('button_press', 'navigation', 'test_button', 1);
      Alert.alert('Success', `User action logged to ${currentProject}!`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('User action logging error:', error);
      Alert.alert('Analytics Error', `Failed to log user action: ${errorMessage}`);
    }
  };

  const handleErrorLog = async () => {
    try {
      await logError('Test error occurred', 'TEST_ERROR_001', currentProject, {
        screen: 'main',
        user_id: 'test_user',
        project: currentProject,
      });
      Alert.alert('Success', `Error event logged to ${currentProject}!`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Error event logging error:', error);
      Alert.alert('Analytics Error', `Failed to log error event: ${errorMessage}`);
    }
  };

  const handleButtonClick = async () => {
    try {
      await logButtonClick('demo_button', currentProject, {
        screen: 'main',
        button_type: 'demo',
        project: currentProject,
      });
      Alert.alert('Success', `Button click logged to ${currentProject}!`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Button click logging error:', error);
      Alert.alert('Analytics Error', `Failed to log button click: ${errorMessage}`);
    }
  };

  const handleMultiProjectEvent = async () => {
    try {
      const results = await logEventToMultipleProjects('multi_project_event', ['india', 'us', 'uk'], {
        timestamp: new Date().toISOString(),
        event_type: 'multi_project_test',
      });

      const successCount = Object.values(results).filter(Boolean).length;
      Alert.alert('Success', `Event logged to ${successCount} projects!`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Multi-project event logging error:', error);
      Alert.alert('Analytics Error', `Failed to log multi-project event: ${errorMessage}`);
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
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Project change error:', error);
      Alert.alert('Project Switch Error', `Failed to switch to ${projectId}: ${errorMessage}`);
    }
  };

  const colors = ResponsiveStyleSheet.getThemeColors();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <View style={styles.analyticsContainer}>
        <Text style={[styles.title, { color: colors.text }]}>📊 Multi-Project Analytics</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Current Project: {currentProject}</Text>

        {/* Project Selection */}
        <View style={styles.countryContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Select Project:</Text>
          <View style={styles.countryButtons}>
            <Button
              title="🇮🇳 India"
              onPress={() => handleProjectChange('india')}
              color={selectedProject === 'india' ? colors.success : colors.info}
            />
            <View style={styles.buttonSpacer} />
            <Button
              title="🇺🇸 US"
              onPress={() => handleProjectChange('us')}
              color={selectedProject === 'us' ? colors.success : colors.info}
            />
            <View style={styles.buttonSpacer} />
            <Button
              title="🇬🇧 UK"
              onPress={() => handleProjectChange('uk')}
              color={selectedProject === 'uk' ? colors.success : colors.info}
            />
          </View>
        </View>

        <View style={styles.buttonSpacer} />

        {/* Event Buttons */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Test Events:</Text>

        <Button
          title="📊 Log Test Event"
          onPress={handleTestEvent}
          color={colors.info}
        />

        <View style={styles.buttonSpacer} />

        <Button
          title="👤 Log User Action"
          onPress={handleUserAction}
          color={colors.success}
        />

        <View style={styles.buttonSpacer} />

        <Button
          title="❌ Log Error Event"
          onPress={handleErrorLog}
          color={colors.error}
        />

        <View style={styles.buttonSpacer} />

        <Button
          title="🖱️ Log Button Click"
          onPress={handleButtonClick}
          color={colors.warning}
        />

        <View style={styles.buttonSpacer} />

        <Button
          title="📊 Log Multi-Project Event"
          onPress={handleMultiProjectEvent}
          color={colors.accent}
        />

        <View style={styles.buttonSpacer} />

        <Button
          title="🎯 StickyScrollView Demo"
          onPress={onNavigateToSticky}
          color={colors.primary}
        />
        
        {onNavigateToLoader && (
          <Button
            title="🔄 Loader Demo"
            onPress={onNavigateToLoader}
            color={colors.accent}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: s(2),
  },
  analyticsContainer: {
    padding: s(5),
    backgroundColor: '#f5f5f5',
    margin: s(2),
    borderRadius: b('lg'),
    flex: 1,
  },
  title: {
    fontSize: f(18),
    fontWeight: 'bold',
    marginBottom: s(4),
    textAlign: 'center',
  },
  subtitle: {
    fontSize: f(14),
    textAlign: 'center',
    marginBottom: s(4),
  },
  countryContainer: {
    marginBottom: s(4),
  },
  sectionTitle: {
    fontSize: f(16),
    fontWeight: 'bold',
    marginBottom: s(2),
    textAlign: 'center',
  },
  countryButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  buttonSpacer: {
    height: s(2),
  },
});

export default AnalyticsScreen;
