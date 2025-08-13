/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, useColorScheme, View, Button, Text, Alert, TouchableOpacity } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useAnalytics } from './src/hooks/useAnalytics';
import { getProjectIds, getProjectConfig } from './src/config/AnalyticsConfig';
import StickyScrollView from './src/components/StickyScrollView';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [selectedProject, setSelectedProject] = useState('india');
  const [currentScreen, setCurrentScreen] = useState<'analytics' | 'sticky'>('analytics');
  const [selectedTab, setSelectedTab] = useState<'overview' | 'features' | 'details'>('overview');
  
  // Refs for content sections
  const overviewRef = useRef<View>(null);
  const featuresRef = useRef<View>(null);
  const detailsRef = useRef<View>(null);
  const stickyScrollViewRef = useRef<any>(null);
  
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
          
          <View style={styles.buttonSpacer} />
          
          <Button 
            title="🎯 StickyScrollView Demo" 
            onPress={() => setCurrentScreen('sticky')}
            color="#FF6B6B"
          />
        </View>
      </SafeAreaView>
      
      {/* StickyScrollView Example Screen */}
      {currentScreen === 'sticky' && (
        <View style={styles.stickyScreen}>
          <View style={styles.stickyHeader}>
            <Text style={styles.stickyTitle}>🎯 StickyScrollView Demo</Text>
            <Text style={styles.stickySubtitle}>Scroll down to see the button become sticky</Text>
            

            
            <Button 
              title="⬅️ Back to Analytics" 
              onPress={() => setCurrentScreen('analytics')}
              color="#6c757d"
            />
          </View>
          
          <StickyScrollView
            ref={stickyScrollViewRef}
            stickyHeaderIndices={[1]}
            onSectionChange={(sectionName) => {
              if (sectionName === 'overview' || sectionName === 'features' || sectionName === 'details') {
                setSelectedTab(sectionName);
              }
            }}
            header={
              <View style={styles.contentHeader}>
                <Text style={styles.contentHeaderTitle}>📚 Content Sections</Text>
                <Text style={styles.contentHeaderSubtitle}>
                  Navigate through different sections using the tabs below. Each section contains detailed information about the StickyScrollView component.
                </Text>
              </View>
            }
            top={
              <>
                <View 
                  ref={overviewRef} 
                  style={styles.contentSection}
                  onLayout={(event) => {
                    const { y } = event.nativeEvent.layout;
                    stickyScrollViewRef.current?.registerSection('overview', y);
                  }}
                >
                  <Text style={styles.sectionTitle}>Overview</Text>
                  <Text style={styles.contentText}>
                    This demonstrates the StickyScrollView component with sticky button functionality.
                    Scroll down to see the button become sticky at the bottom of the screen.
                  </Text>
                  
                  <Text style={styles.sectionTitle}>How it works</Text>
                  <Text style={styles.contentText}>
                    • The button starts as part of the content{'\n'}
                    • When scrolling down, it smoothly becomes sticky{'\n'}
                    • When scrolling up, it rejoins the content flow{'\n'}
                    • Smooth animations with native performance
                  </Text>
                </View>
                
                <View 
                  ref={featuresRef} 
                  style={styles.contentSection}
                  onLayout={(event) => {
                    const { y } = event.nativeEvent.layout;
                    stickyScrollViewRef.current?.registerSection('features', y);
                  }}
                >
                  <Text style={styles.sectionTitle}>Features</Text>
                  <Text style={styles.contentText}>
                    • Smooth sticky behavior with native performance{'\n'}
                    • Customizable content sections{'\n'}
                    • Responsive design for all screen sizes{'\n'}
                    • Easy integration with existing components
                  </Text>
                  
                  <Text style={styles.sectionTitle}>Benefits</Text>
                  <Text style={styles.contentText}>
                    • Improved user experience with always-accessible buttons{'\n'}
                    • Clean, modern UI design{'\n'}
                    • Optimized scrolling performance{'\n'}
                    • Cross-platform compatibility
                  </Text>
                </View>
                
                <View 
                  ref={detailsRef} 
                  style={styles.contentSection}
                  onLayout={(event) => {
                    const { y } = event.nativeEvent.layout;
                    stickyScrollViewRef.current?.registerSection('details', y);
                  }}
                >
                  <Text style={styles.sectionTitle}>Technical Details</Text>
                  <Text style={styles.contentText}>
                    • Built with React Native core components{'\n'}
                    • Uses ScrollView with custom scroll handling{'\n'}
                    • Implements sticky positioning with absolute positioning{'\n'}
                    • Optimized with useRef and useEffect hooks
                  </Text>
                  
                  <Text style={styles.sectionTitle}>Implementation</Text>
                  <Text style={styles.contentText}>
                    • Custom scroll event handling{'\n'}
                    • Dynamic button state management{'\n'}
                    • Smooth opacity transitions{'\n'}
                    • Responsive layout calculations
                  </Text>
                </View>
              </>
            }
            tabs={
              <View style={styles.tabContainer}>
                <TouchableOpacity 
                  style={[styles.tab, selectedTab === 'overview' && styles.activeTab]}
                  onPress={() => {
                    setSelectedTab('overview');
                    stickyScrollViewRef.current?.scrollToSection('overview', true);
                  }}
                >
                  <Text style={[styles.tabText, selectedTab === 'overview' && styles.activeTabText]}>
                    Overview
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.tab, selectedTab === 'features' && styles.activeTab]}
                  onPress={() => {
                    setSelectedTab('features');
                    stickyScrollViewRef.current?.scrollToSection('features', true);
                  }}
                >
                  <Text style={[styles.tabText, selectedTab === 'features' && styles.activeTabText]}>
                    Features
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.tab, selectedTab === 'details' && styles.activeTab]}
                  onPress={() => {
                    setSelectedTab('details');
                    stickyScrollViewRef.current?.scrollToSection('details', true);
                  }}
                >
                  <Text style={[styles.tabText, selectedTab === 'details' && styles.activeTabText]}>
                    Details
                  </Text>
                </TouchableOpacity>
              </View>
            }
            buttonContent={
              <View style={[styles.stickyButton, { alignSelf: 'stretch' }]}>
                <Text style={styles.buttonText}>🎯 Sticky Button</Text>
                <Text style={styles.buttonSubtext}>Tap me!</Text>
              </View>
            }
            footer={
              <View style={styles.stickyBottomContent}>
                <View style={styles.contentBlock}>
                  <Text style={styles.sectionTitle}>Section 1</Text>
                  <Text style={styles.contentText}>
                    More content here to demonstrate scrolling. Keep scrolling down to see the sticky button behavior.
                  </Text>
                </View>
                
                <View style={styles.contentBlock}>
                  <Text style={styles.sectionTitle}>Section 2</Text>
                  <Text style={styles.contentText}>
                    The button will become sticky when it goes out of view from the bottom. This provides a great user experience for important actions.
                  </Text>
                </View>
                
                <View style={styles.contentBlock}>
                  <Text style={styles.sectionTitle}>Section 3</Text>
                  <Text style={styles.contentText}>
                    Final section. Try scrolling up and down to see the complete sticky button behavior in action.
                  </Text>
                </View>
              </View>
            }
          />
        </View>
      )}
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
  // StickyScrollView Demo Styles
  stickyScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#ffffff',
    zIndex: 1000,
  },
  stickyHeader: {
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    alignItems: 'center',
  },
  stickyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 8,
    textAlign: 'center',
  },
  stickySubtitle: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 16,
  },
  stickyTopContent: {
    padding: 20,
  },
  contentHeader: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  contentHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 8,
    textAlign: 'center',
  },
  contentHeaderSubtitle: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 20,
  },
  stickyBottomContent: {
    padding: 20,
  },
  contentBlock: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  contentText: {
    fontSize: 14,
    color: '#6c757d',
    lineHeight: 20,
    marginBottom: 16,
  },
  stickyButton: {
    backgroundColor: '#28a745',
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    marginHorizontal: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  buttonSubtext: {
    color: '#ffffff',
    fontSize: 12,
    opacity: 0.8,
  },
  // Tab Styles
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'red',
    padding: 20,
  },
  tab: {
    backgroundColor: 'blue',
    padding: 20,
    margin: 10,
    flex: 1,
  },
  activeTab: {
    backgroundColor: 'green',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
  activeTabText: {
    color: 'white',
    fontWeight: '700',
  },
  contentSection: {
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
});

export default App;
